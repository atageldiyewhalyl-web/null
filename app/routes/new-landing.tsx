import MinimalistHeroDemo from "../components/MinimalistHeroDemo";
import { Navigate } from "react-router";

export function meta() {
  return [
    { title: "New Landing" },
    { name: "description", content: "A minimalist nüll landing page concept." },
    { name: "robots", content: "noindex, nofollow" },
    { tagName: "link", rel: "canonical", href: "https://xn--nll-hoa.com/" },
  ];
}

export default function NewLandingRoute() {
  return <Navigate to="/" replace />;
}
