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
      "/blog",
      "/blog/5-elements-every-high-converting-website-needs",
      "/blog/5-elemente-high-converting-website-2026",
      "/blog/yuksek-donusumlu-web-sitesi-icin-5-temel-oge",
      "/blog/improve-google-rankings-germany",
      "/blog/google-ranking-verbessern-deutschland",
      "/blog/google-siralamalarini-yukseltmek-almanya",
      "/blog/webdesign-fuer-anwaelte-kanzleien",
      "/blog/web-design-for-lawyers-law-firms",
      "/blog/avukatlar-icin-web-tasarim",
      "/blog/freelancer-oder-agentur-website",
      "/blog/freelancer-vs-agency-website",
      "/blog/freelancer-mi-ajans-mi"
    ];
  },
} satisfies Config;
