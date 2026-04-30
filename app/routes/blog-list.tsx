import { BlogList } from "../components/BlogList";

export function meta() {
  return [
    { title: "Blog | nüll. - Your client acquisition system" },
    { name: "description", content: "Expert insights on web design, SEO, and digital growth for businesses." },
    { property: "og:title", content: "Blog | nüll. - Your client acquisition system" },
    { property: "og:description", content: "Expert insights on web design, SEO, and digital growth for businesses." },
    { property: "og:type", content: "website" },
  ];
}

export default function BlogListRoute() {
  return <BlogList />;
}
