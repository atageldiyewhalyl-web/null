import { BlogList } from "../components/BlogList";

export function meta() {
  const title = "Blog zu Webdesign, SEO & Mandantengewinnung | nüll.";
  const description =
    "Artikel zu Webdesign, SEO, Google Ads und digitaler Mandantengewinnung für Kanzleien, Berater und Dienstleister in Deutschland.";
  const url = "https://xn--nll-hoa.com/blog";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "de_DE" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function BlogListRoute() {
  return <BlogList />;
}
