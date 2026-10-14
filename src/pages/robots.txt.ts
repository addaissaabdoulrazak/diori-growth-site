import { siteConfig } from "@/config/site";

export const prerender = true;

export function GET() {
  const lines = ["User-agent: *"];
  if (siteConfig.preview || !siteConfig.domain) {
    lines.push("Disallow: /");
  } else {
    lines.push("Allow: /");
    lines.push(`Sitemap: ${new URL("/sitemap.xml", siteConfig.domain).toString()}`);
  }
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
