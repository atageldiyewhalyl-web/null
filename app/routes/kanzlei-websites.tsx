import { KanzleiWebsitesV2Page } from "./kanzlei-websites-v2";

export function meta() {
  const title = "Kanzlei-Websites | Mehr Mandatsanfragen | nüll.";
  const description =
    "Moderne Kanzlei-Websites für Anwälte und Berater mit klarer Anfrageführung, SEO-Struktur und vertrauenswürdigem Kanzlei-Auftritt.";
  const url = "https://xn--nll-hoa.com/kanzlei-websites";
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

export default function KanzleiWebsitesRoute() {
  return <KanzleiWebsitesV2Page serviceUrl="https://xn--nll-hoa.com/kanzlei-websites" />;
}
