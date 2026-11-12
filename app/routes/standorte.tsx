import StandorteV2 from "../components/v2/StandorteV2";
import { CITIES } from "../components/v2/cities";

// /standorte: every city page, grouped by city. Data: components/v2/cities.ts.
const SITE = "https://nuell-agentur.com";
export function meta() {
  const names = CITIES.map((c) => c.name);
  return [
    { title: "Standorte: Websites, SEO & Ads in deiner Stadt | nüll." },
    { name: "description", content: `Webdesign, SEO, Google Ads, KI-Sichtbarkeit und Content für Betriebe in ${names.slice(0, -1).join(", ")} und ${names.at(-1)}.` },
    { tagName: "link", rel: "canonical", href: `${SITE}/standorte` },
  ];
}

export default function StandorteRoute() {
  return <StandorteV2 />;
}
