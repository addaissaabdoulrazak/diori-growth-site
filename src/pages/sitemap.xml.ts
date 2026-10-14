import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";

export const prerender = true;

export async function GET() {
  const urls = siteConfig.domain && !siteConfig.preview
    ? [
        "/",
        "/services/",
        "/formations/",
        "/experts/",
        "/a-propos/",
        "/contact/",
        ...(await getCollection("services", ({ data }) => data.approvalStatus === "approved")).map((entry) => `/services/${entry.id}/`),
        ...(await getCollection("trainings", ({ data }) => data.approvalStatus === "approved")).map((entry) => `/formations/${entry.id}/`),
      ]
    : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${new URL(path, siteConfig.domain).toString()}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
