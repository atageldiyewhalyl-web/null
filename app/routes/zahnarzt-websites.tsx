export { default } from "./doctors";

export function meta() {
  const title = "Webdesign für Zahnärzte | Zahnarzt-Website & SEO | nüll.";
  const description =
    "Moderne Zahnarzt-Websites: Webdesign, lokale SEO und Google Ads für mehr Neupatienten, Sichtbarkeit und Terminanfragen.";
  const url = "https://xn--nll-hoa.com/zahnarzt-websites";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "Webdesign Zahnarzt, Zahnarzt Website erstellen, Website für Zahnärzte, SEO für Zahnärzte, SEO Zahnarztpraxis, Zahnarzt Homepage, Neupatienten gewinnen",
    },
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
