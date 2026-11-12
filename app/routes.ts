import { type RouteConfig, index, route } from "@react-router/dev/routes";

// The v2 design is the live site (11 Nov 2026). The old pages are deleted; their addresses 301-redirect in vercel.json.
// Route files keep their v2-* names; the URLs are the main ones.
export default [
  index("routes/home-v2.tsx"),

  route("leistungen", "routes/v2-leistungen.tsx"),
  route("leistungen/webdesign", "routes/v2-webdesign.tsx"),
  route("leistungen/:service/:city", "routes/city-service.tsx"),
  route("leistungen/seo", "routes/v2-seo.tsx"),
  route("leistungen/google-ads", "routes/v2-google-ads.tsx"),
  route("leistungen/ki-sichtbarkeit", "routes/v2-ki-sichtbarkeit.tsx"),
  route("leistungen/content", "routes/v2-content.tsx"),

  route("standorte", "routes/standorte.tsx"),
  route("referenzen", "routes/v2-referenzen.tsx"),
  route("referenzen/waschbar", "routes/v2-referenz-waschbar.tsx"),
  route("referenzen/orchidee", "routes/v2-referenz-orchidee.tsx"),
  route("referenzen/bergstone", "routes/v2-referenz-bergstone.tsx"),
  route("referenzen/treu", "routes/v2-referenz-treu.tsx"),
  route("referenzen/herkules", "routes/v2-referenz-herkules.tsx"),
  route("referenzen/dogru", "routes/v2-referenz-dogru.tsx"),
  route("referenzen/sg", "routes/v2-referenz-sg.tsx"),
  route("referenzen/so", "routes/v2-referenz-so.tsx"),
  route("referenzen/ft", "routes/v2-referenz-ft.tsx"),
  route("referenzen/onkel", "routes/v2-referenz-onkel.tsx"),
  route("referenzen/by", "routes/v2-referenz-by.tsx"),

  route("blog", "routes/v2-blog.tsx"),
  route("blog/:slug", "routes/v2-blog-post.tsx"),

  route("preise", "routes/preise.tsx"),
  route("website-check", "routes/website-check.tsx"),

  // legal pages (old design for now, text unchanged)
  route("datenschutz", "routes/datenschutz.tsx"),
  route("impressum", "routes/impressum.tsx"),

  // internal tools and old-link handling
  route("onboarding/:slug", "routes/client-onboarding.tsx"),
  route("interview/:slug", "routes/interview.tsx"),
  route("tr/*", "routes/legacy-turkish-redirect.tsx"),
  route("admin/login", "routes/admin-login.tsx"),
  route("admin", "routes/admin.tsx", [
    index("routes/admin-dashboard.tsx"),
    route("projects", "routes/admin-projects.tsx"),
    route("jobs", "routes/admin-jobs.tsx"),
    route("jobs/:id", "routes/admin-job-detail.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
