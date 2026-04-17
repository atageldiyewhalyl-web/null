import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("onboarding", "routes/onboarding.tsx"),
  index("routes/home.tsx"),
  route("blog", "routes/blog-list.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
] satisfies RouteConfig;
