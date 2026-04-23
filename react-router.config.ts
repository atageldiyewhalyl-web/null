import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  ssr: true,
  async prerender() {
    return [
      "/",
      "/blog",
      "/blog/why-every-local-business-needs-a-website-in-2026",
      "/blog/seo-basics-for-small-businesses",
      "/blog/personal-branding-for-consultants",
      "/blog/what-makes-a-high-converting-website",
      "/blog/website-performance-why-speed-matters",
      // Groundwork for requested blogs
      "/blog/webdesign-mannheim-guide-2026",
      "/blog/lead-acquisition-for-consultants",
      "/blog/digital-presence-strategy-germany"
    ];
  },
} satisfies Config;

