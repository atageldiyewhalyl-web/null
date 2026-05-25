import MinimalistHeroDemo from "../components/MinimalistHeroDemo";
import { redirect } from "react-router";

export function loader() {
  return redirect("/", 301);
}

export function meta() {
  return [
    { title: "New Landing" },
    { name: "description", content: "A minimalist nüll landing page concept." },
    { name: "robots", content: "noindex, nofollow" },
    { tagName: "link", rel: "canonical", href: "https://xn--nll-hoa.com/" },
  ];
}

export default function NewLandingRoute() {
  return <MinimalistHeroDemo />;
}
