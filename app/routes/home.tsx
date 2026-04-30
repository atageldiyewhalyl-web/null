import { Home } from "../components/Home";

export function meta() {
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title: "nüll. - Your client acquisition system" },
    { name: "description", content: "High-converting websites for businesses, consultants, and law firms built to earn trust and turn visitors into qualified enquiries." },
    { property: "og:title", content: "nüll. - Your client acquisition system" },
    { property: "og:description", content: "High-converting websites built to earn trust and turn visitors into qualified enquiries." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "nüll. logo on a minimal branded background" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "nüll. logo on a minimal branded background" },
  ];
}

export default function HomeRoute() {
  return <Home />;
}
