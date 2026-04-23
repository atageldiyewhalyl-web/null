import { Home } from "../components/Home";

export function meta() {
  return [
    { title: "Nüll. - Premium Webdesign & Digital Positioning" },
    { name: "description", content: "We help consultants and experts in Germany transform their expertise into a premium digital brand. High-converting websites for the next generation of leaders." },
    { property: "og:title", content: "Nüll. - Premium Webdesign & Digital Positioning" },
    { property: "og:description", content: "We help consultants and experts in Germany transform their expertise into a premium digital brand." },
    { property: "og:type", content: "website" },
  ];
}

export default function HomeRoute() {
  return <Home />;
}

