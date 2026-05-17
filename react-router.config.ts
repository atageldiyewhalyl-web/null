import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  ssr: true,
  routeDiscovery: {
    mode: "initial",
  },
  async prerender() {
    return [
      "/",
      "/onboarding",
      "/onboarding/client-discovery",
      "/datenschutz",
      "/impressum",
      "/leistungen/webdesign",
      "/leistungen/seo",
      "/leistungen/google-ads",
      "/blog",
      "/blog/5-elements-every-high-converting-website-needs",
      "/blog/5-elemente-high-converting-website-2026",
      "/blog/improve-google-rankings-germany",
      "/blog/google-ranking-verbessern-deutschland",
      "/blog/webdesign-fuer-anwaelte-kanzleien",
      "/blog/web-design-for-lawyers-law-firms",
      "/blog/freelancer-oder-agentur-website",
      "/blog/freelancer-vs-agency-website"
    ];
  },
} satisfies Config;
