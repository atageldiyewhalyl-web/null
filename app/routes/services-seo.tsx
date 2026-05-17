import { ServicesPage } from "../components/ServicesPage";

export function meta() {
  const title = "SEO für Kanzleien, Handwerker & Dienstleister | nüll.";
  const description =
    "SEO für Kanzleien, Handwerker, Berater und Dienstleister in Deutschland. Wir bauen lokale Sichtbarkeit, klare Seitenstruktur und messbare Anfragen über Google auf.";
  const url = "https://xn--nll-hoa.com/leistungen/seo";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    {
      name: "description",
      content: description,
    },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "nüll." },
    { property: "og:locale", content: "de_DE" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function SeoServiceRoute() {
  return <ServicesPage variant="seo" />;
}
