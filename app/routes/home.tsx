import MinimalistHeroDemo from "../components/MinimalistHeroDemo";

export function meta() {
  const title = "nüll. | Websites, SEO & Google Ads für mehr Anfragen";
  const description =
    "nüll entwickelt moderne Websites, SEO-Strukturen und Google Ads Systeme, die Unternehmen sichtbar machen und aus Besuchern qualifizierte Anfragen machen.";
  const url = "https://xn--nll-hoa.com/";
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
    { property: "og:image:alt", content: "nüll. logo on a minimal branded background" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "nüll. logo on a minimal branded background" },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function HomeRoute() {
  return <MinimalistHeroDemo />;
}
