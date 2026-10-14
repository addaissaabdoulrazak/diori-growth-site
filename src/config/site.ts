const previewFlag = import.meta.env.PUBLIC_SITE_PREVIEW;
const submittedPhone = "+227 90 32 31 33";
const configuredPhone = import.meta.env.PUBLIC_CONTACT_PHONE?.trim().replace(/[^+\d]/g, "") || submittedPhone.replace(/[^+\d]/g, "");
const phoneFormatValid = /^\+[1-9]\d{6,14}$/.test(configuredPhone);
const phoneConfirmed = import.meta.env.PUBLIC_CONTACT_PHONE_CONFIRMED !== "false" && phoneFormatValid;
const privacyPolicyUrl = import.meta.env.PUBLIC_PRIVACY_POLICY_URL?.trim() || "/documents/confidentialite/";
const emailConfirmed = import.meta.env.PUBLIC_CONTACT_EMAIL_CONFIRMED === "true";

export const siteConfig = {
  commercialName: "DIORI GROWTH",
  slogan: "Grandir. Performer. Transformer.",
  contactName: "Malik DIORI",
  legalRepresentative: "ALI DIORI Abdoul Malik",
  contactRole: "Directeur général",
  phoneDisplay: phoneConfirmed ? (configuredPhone === submittedPhone.replace(/[^+\d]/g, "") ? submittedPhone : configuredPhone) : "",
  phone: phoneConfirmed ? configuredPhone : "",
  phoneConfirmed,
  email: emailConfirmed ? "contact@diorigrowth.com" : "",
  emailPendingActivation: "contact@diorigrowth.com",
  emailConfirmed,
  address: "Quartier Dar es Salam",
  city: "Niamey",
  country: "Niger",
  serviceArea: "Niger",
  socialLinks: [] as const,
  domain: import.meta.env.PUBLIC_SITE_URL?.trim() ?? "",
  legalIdentity: "DIORI GROWTH",
  registrationNumber: "NE-NIM-01-2026-A10-03969",
  availableFormats: ["Présentiel", "À distance", "Hybride"] as readonly string[],
  privacyPolicyUrl,
  contactFormEnabled: import.meta.env.PUBLIC_CONTACT_FORM_ENABLED === "true" && emailConfirmed && import.meta.env.PUBLIC_PRIVACY_POLICY_APPROVED === "true" && Boolean(privacyPolicyUrl),
  preview: previewFlag === "true",
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "",
} as const;

export const contactPhoneHref = siteConfig.phone
  ? `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`
  : "";

export const whatsappHref = (message: string) =>
  siteConfig.phone
    ? `https://wa.me/${siteConfig.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : "";

export const absoluteUrl = (path: string) =>
  siteConfig.domain ? new URL(path, siteConfig.domain).toString() : "";
