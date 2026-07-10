import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    unstable_optimizeDeps: true,
  },
  prerender: [
    "/",
    "/kanzlei-websites",
    "/arztpraxis-websites",
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
    "/blog/freelancer-vs-agency-website",
    "/blog/webdesign-fuer-rechtsanwaelte-kanzleien-leitfaden-2026",
    "/blog/handwerker-website-auftraege",
    "/blog/seo-handwerker-google",
    "/blog/google-ads-handwerker",
    "/blog/online-marketing-handwerker",
    "/blog/webdesign-fuer-arztpraxen",
    "/datenschutz",
    "/impressum",
  ],
  routeDiscovery: {
    mode: "initial",
  },
} satisfies Config;
