import { BlogList } from "../components/BlogList";

export function meta() {
  return [
    { title: "Blog | Nüll. - Insights on Marketing & Webdesign" },
    { name: "description", content: "Expert insights on web design, SEO, and digital growth for consultants in Mannheim and across Germany." },
    { property: "og:title", content: "Blog | Nüll. - Insights on Marketing & Webdesign" },
    { property: "og:description", content: "Expert insights on web design, SEO, and digital growth for consultants in Mannheim and across Germany." },
    { property: "og:type", content: "website" },
  ];
}

export default function BlogListRoute() {
  return <BlogList />;
}

