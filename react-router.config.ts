import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  ssr: false,
  async prerender() {
    return [
      "/",
      "/blog",
      "/blog/why-every-local-business-needs-a-website-in-2026",
      "/blog/seo-basics-for-small-businesses",
      "/blog/personal-branding-for-consultants",
      "/blog/what-makes-a-high-converting-website",
      "/blog/website-performance-why-speed-matters"
    ];
  },
} satisfies Config;
