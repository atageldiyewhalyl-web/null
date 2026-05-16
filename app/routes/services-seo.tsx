import { ServicesPage } from "../components/ServicesPage";

export function meta() {
  return [
    { title: "SEO Service - nüll." },
    {
      name: "description",
      content:
        "SEO, Google-Sichtbarkeit und laufende Optimierung für Unternehmen, die online gefunden werden und regelmäßig qualifizierte Anfragen erhalten wollen.",
    },
    { property: "og:title", content: "SEO Service - nüll." },
    {
      property: "og:description",
      content:
        "Ein SEO-System, das Suchintention, technische Grundlage und relevante Seiten in messbare Anfragen verwandelt.",
    },
  ];
}

export default function SeoServiceRoute() {
  return <ServicesPage variant="seo" />;
}
