import { Home } from "../components/Home";

export function meta() {
  return [
    { title: "Nüll. - Premium Webdesign & Digital Positioning" },
    { name: "description", content: "We help businesses turn their offer into a premium digital presence. High-converting websites built to earn trust and win customers." },
    { property: "og:title", content: "Nüll. - Premium Webdesign & Digital Positioning" },
    { property: "og:description", content: "We help businesses turn their offer into a premium digital presence." },
    { property: "og:type", content: "website" },
  ];
}

export default function HomeRoute() {
  return <Home />;
}
