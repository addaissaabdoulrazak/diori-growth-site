import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

import vercel from "@astrojs/vercel";

const configuredSite = process.env.PUBLIC_SITE_URL || loadEnv("", process.cwd(), "PUBLIC_SITE_URL").PUBLIC_SITE_URL;
const siteUrl = configuredSite ? new URL(configuredSite) : undefined;

export default defineConfig({
  output: "server",
  adapter: vercel(),
  session: false,
  security: {
    checkOrigin: true,
    allowedDomains: siteUrl
      ? [{ hostname: siteUrl.hostname, protocol: siteUrl.protocol.replace(":", ""), port: siteUrl.port }]
      : [{ hostname: "127.0.0.1", protocol: "http" }, { hostname: "localhost", protocol: "http" }],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});