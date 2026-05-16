import { ServicesPage } from "../components/ServicesPage";

export function meta() {
  return [
    { title: "Leistungen - nüll." },
    {
      name: "description",
      content:
        "Websites, SEO, KI-Sichtbarkeit und laufende Betreuung für Unternehmen, die online gefunden werden und regelmäßig Anfragen erhalten wollen.",
    },
    { property: "og:title", content: "Leistungen - nüll." },
    {
      property: "og:description",
      content:
        "Ein digitales System, das Besucher in Anfragen verwandelt, zuverlässig, automatisch, messbar.",
    },
  ];
}

export default function ServicesRoute() {
  return <ServicesPage />;
}
