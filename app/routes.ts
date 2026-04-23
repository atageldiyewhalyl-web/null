import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("onboarding", "routes/onboarding.tsx"),
  index("routes/home.tsx"),
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
