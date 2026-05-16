import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("onboarding", "routes/onboarding.tsx"),
  route("onboarding/client-discovery", "routes/client-discovery-onboarding.tsx"),
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("website", "routes/website.tsx"),
  route("webdesign", "routes/webdesign.tsx"),
  route("services/website", "routes/services-website.tsx"),
  route("leistungen/webdesign", "routes/leistungen-webdesign.tsx"),
  route("datenschutz", "routes/datenschutz.tsx"),
  route("impressum", "routes/impressum.tsx"),
  route("blog", "routes/blog-list.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
  route("admin/login", "routes/admin-login.tsx"),
  route("admin", "routes/admin.tsx", [
    index("routes/admin-dashboard.tsx"),
    route("projects", "routes/admin-projects.tsx"),
    route("jobs", "routes/admin-jobs.tsx"),
    route("jobs/:id", "routes/admin-job-detail.tsx"),
  ]),
] satisfies RouteConfig;
