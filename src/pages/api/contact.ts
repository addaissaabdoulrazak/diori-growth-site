import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";

const MAX_BODY_BYTES = 12_000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const recentRequests = new Map<string, number[]>();

type SubmittedRequest = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  participants?: unknown;
  format?: unknown;
  message?: unknown;
  website?: unknown;
  turnstileToken?: unknown;
  "cf-turnstile-response"?: unknown;
  period?: unknown;
  sector?: unknown;
  role?: unknown;
  contactPermission?: unknown;
};

type RequestData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  participants: string;
  format: string;
  message: string;
  website: string;
  turnstileToken: string;
  period: string;
  sector: string;
  role: string;
  contactPermission: string;
};

class BodyTooLargeError extends Error {}

async function readRequestBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }
  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(combined);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clean(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

function json(message: string, status: number): Response {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

function respond(request: Request, message: string, status: number): Response {
  if (request.headers.get("accept")?.includes("text/html")) {
    const escaped = message.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char] ?? char));
    return new Response(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Votre demande · DIORI GROWTH</title><main><h1>Votre demande</h1><p>${escaped}</p><p><a href="/contact/">Retour au contact</a></p></main></html>`, {
      status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  }
  return json(message, status);
}

function isRateLimited(key: string, now = Date.now()): boolean {
  const valid = (recentRequests.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (valid.length >= RATE_MAX_REQUESTS) {
    recentRequests.set(key, valid);
    return true;
  }
  valid.push(now);
  recentRequests.set(key, valid);
  if (recentRequests.size > 5_000) {
    for (const [ip, times] of recentRequests) {
      if (!times.some((time) => now - time < RATE_WINDOW_MS)) recentRequests.delete(ip);
    }
  }
  return false;
}

function getFields(request: Request, body: string): SubmittedRequest {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid-body");
    return parsed as SubmittedRequest;
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = new URLSearchParams(body);
    return Object.fromEntries(form.entries());
  }
  throw new Error("unsupported-content-type");
}

function normalizeFields(fields: SubmittedRequest): RequestData {
  return {
    name: clean(asText(fields.name)),
    company: clean(asText(fields.company)),
    email: clean(asText(fields.email)),
    phone: clean(asText(fields.phone)),
    service: clean(asText(fields.service)),
    participants: clean(asText(fields.participants)),
    format: clean(asText(fields.format)),
    message: clean(asText(fields.message)),
    website: asText(fields.website),
    turnstileToken: asText(fields.turnstileToken ?? fields["cf-turnstile-response"]),
    period: clean(asText(fields.period)),
    sector: clean(asText(fields.sector)),
    role: clean(asText(fields.role)),
    contactPermission: asText(fields.contactPermission),
  };
}

function validateFields(fields: RequestData, approvedOffers: string[]): string | undefined {
  if (!fields.name || fields.name.length > 100) return "Indiquez un nom de 100 caractères maximum.";
  if (!fields.email || fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return "Saisissez une adresse e-mail valide.";
  }
  if (fields.company.length > 120) return "Le nom de l'entreprise est trop long.";
  if ([fields.period, fields.sector, fields.role].some(value => value.length > 120)) return "La période, le secteur et la fonction sont limités à 120 caractères chacun.";
  if (fields.contactPermission !== "yes") return "Confirmez que vous souhaitez être recontacté pour cette demande.";
  if (fields.phone.length > 40) return "Le numéro de téléphone est trop long.";
  if (fields.message.length > 3_000) return "Le message dépasse la taille autorisée.";
  if (fields.service.length > 180) return "Le sujet de la demande est trop long.";
  if (fields.service && fields.service !== "Formation ou mobilisation d'expertise" && fields.service !== "Autre besoin" && !approvedOffers.includes(fields.service)) {
    return "Choisissez un sujet disponible dans la liste.";
  }
  if (fields.participants && (!/^\d+$/.test(fields.participants) || Number(fields.participants) < 1 || Number(fields.participants) > 10_000)) {
    return "Le nombre de participants doit être compris entre 1 et 10 000.";
  }
  if (fields.format && !siteConfig.availableFormats.includes(fields.format)) return "Choisissez un format disponible dans la liste.";
  return undefined;
}

async function verifyTurnstile(token: string, secret: string, ip: string, expectedHostname: string): Promise<boolean> {
  if (!token || token.length > 2_048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean; hostname?: string };
  return result.success === true && result.hostname === expectedHostname;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) return respond(request, "La requête n'a pas pu être vérifiée.", 403);
    } catch {
      return respond(request, "La requête n'a pas pu être vérifiée.", 403);
    }
  }

  const ip = clientAddress || "unknown";
  if (isRateLimited(ip)) return respond(request, "Trop de tentatives. Attendez avant de renvoyer une demande.", 429);

  const declaredSize = Number(request.headers.get("content-length") ?? "0");
  if (declaredSize > MAX_BODY_BYTES) return respond(request, "Le formulaire dépasse la taille autorisée.", 413);

  let fields: RequestData;
  try {
    fields = normalizeFields(getFields(request, await readRequestBody(request)));
  } catch (error) {
    if (error instanceof BodyTooLargeError) return respond(request, "Le formulaire dépasse la taille autorisée.", 413);
    return respond(request, "Le formulaire n'a pas pu être lu. Vérifiez les champs et réessayez.", 400);
  }

  if (fields.website) return respond(request, "La demande n'a pas pu être validée.", 400);

  const [services, trainings] = await Promise.all([
    getCollection("services", ({ data }) => data.approvalStatus === "approved"),
    getCollection("trainings", ({ data }) => data.approvalStatus === "approved"),
  ]);
  const approvedOffers = [
    ...services.map((entry) => entry.data.title),
    ...trainings.map((entry) => entry.data.title),
    "Formation ou mobilisation d'expertise",
    "Autre besoin",
  ];
  const validationError = validateFields(fields, approvedOffers);
  if (validationError) return respond(request, validationError, 400);

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_TO_EMAIL?.trim();
  const sender = process.env.CONTACT_FROM_EMAIL?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const explicitlyEnabled = process.env.CONTACT_SEND_ENABLED === "true";
  if (siteConfig.preview || !siteConfig.contactFormEnabled || !explicitlyEnabled || !resendKey || !recipient || !sender || !turnstileSecret || !siteConfig.turnstileSiteKey) {
    return respond(request, "L'envoi du formulaire n'est pas encore configuré. Aucune demande n'a été envoyée.", 503);
  }

  let challengeValid = false;
  try {
    const expectedHostname = siteConfig.domain ? new URL(siteConfig.domain).hostname : new URL(request.url).hostname;
    challengeValid = await verifyTurnstile(fields.turnstileToken, turnstileSecret, ip, expectedHostname);
  } catch {
    challengeValid = false;
  }
  if (!challengeValid) return respond(request, "La vérification antispam a échoué. Actualisez le contrôle et réessayez.", 400);

  const content = [
    `Nom : ${fields.name}`,
    `Entreprise : ${fields.company || "Non renseignée"}`,
    `Secteur : ${fields.sector || "Non renseigné"}`,
    `Fonction : ${fields.role || "Non renseignée"}`,
    `Période souhaitée : ${fields.period || "Non renseignée"}`,
    `E-mail : ${fields.email}`,
    `Téléphone : ${fields.phone || "Non renseigné"}`,
    `Sujet : ${fields.service || "Non précisé"}`,
    `Participants : ${fields.participants || "Non précisé"}`,
    `Format : ${fields.format || "À discuter"}`,
    "",
    "Message :",
    fields.message || "Aucun message complémentaire.",
    "",
    "La personne souhaite être recontactée au sujet de cette demande.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": "diori-contact/" + createHash("sha256").update(JSON.stringify([sender, recipient, fields.email, content])).digest("hex"),
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: fields.email,
        subject: "Nouvelle demande — DIORI GROWTH",
        text: content,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return respond(request, "Le service d'envoi n'a pas confirmé la demande. Réessayez plus tard.", 502);
    const accepted = await response.json() as { id?: unknown };
    if (typeof accepted.id !== "string" || !accepted.id) return respond(request, "Le service d'envoi n'a pas confirmé la demande. Réessayez plus tard.", 502);
    return respond(request, "Votre demande a été acceptée par le service d'envoi.", 200);
  } catch {
    return respond(request, "Le service d'envoi est momentanément inaccessible. Réessayez plus tard.", 502);
  }
};
