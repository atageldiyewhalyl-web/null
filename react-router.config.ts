import type { Config } from "@react-router/dev/config";
import { CITY_PATHS } from "./app/components/v2/cities";
import { blogPosts } from "./app/components/blogData";

// Every German article is prerendered (the site is static files): generated from the blog data so new posts can never be forgotten.
const BLOG_PATHS = blogPosts.filter((p) => p.lang === "de").map((p) => `/blog/${p.slug}`);

export default {
  ssr: true,
  future: {
    unstable_optimizeDeps: true,
  },
  prerender: [
    // every public page must be listed: the site is served as static files (dist), there is no server
    "/",
    "/leistungen",
    "/leistungen/webdesign",
    "/leistungen/seo",
    "/leistungen/google-ads",
    "/leistungen/ki-sichtbarkeit",
    "/leistungen/content",
    ...CITY_PATHS,
    "/standorte",
    "/referenzen",
    "/referenzen/waschbar",
    "/referenzen/orchidee",
    "/referenzen/bergstone",
    "/referenzen/treu",
    "/referenzen/herkules",
    "/referenzen/dogru",
    "/referenzen/sg",
    "/referenzen/so",
    "/referenzen/ft",
    "/referenzen/onkel",
    "/referenzen/by",
    "/preise",
    "/website-check",
    "/blog",
    ...BLOG_PATHS,
    "/datenschutz",
    "/impressum",
    "/onboarding/bergstone-keramiksan",
    "/onboarding/fidelis",
    // Generic shell for every /interview/:slug link (vercel.json rewrites to it); the page loads its brief client-side.
    "/interview/shell",
  ],
  routeDiscovery: {
    mode: "initial",
  },
} satisfies Config;
