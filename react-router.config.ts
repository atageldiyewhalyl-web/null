import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  ssr: true,
  async prerender() {
    return [
      "/",
      "/onboarding",
      "/onboarding/client-discovery",
      "/blog",
      "/blog/why-every-local-business-needs-a-website-in-2026",
      "/blog/seo-basics-for-small-businesses",
      "/blog/personal-branding-for-business-owners",
      "/blog/5-elements-every-high-converting-website-needs",
      "/blog/5-elemente-high-converting-website-2026",
      "/blog/yuksek-donusumlu-web-sitesi-icin-5-temel-oge",
      "/blog/website-performance-why-speed-matters",
      "/blog/improve-google-rankings-germany",
      "/blog/google-ranking-verbessern-deutschland",
      "/blog/google-siralamalarini-yukseltmek-almanya"
    ];
  },
} satisfies Config;
