import { ServicesPage } from "../components/ServicesPage";

export function meta() {
  return [
    { title: "Google Ads Agentur für Dienstleister | nüll." },
    {
      name: "description",
      content:
        "Google Ads Agentur für Kanzleien, Handwerk, Berater und Dienstleister. Kampagnen, Landingpages und Tracking für messbare Anfragen statt nur Klicks.",
    },
    { property: "og:title", content: "Google Ads Agentur für Dienstleister | nüll." },
    {
      property: "og:description",
      content:
        "Ein Google-Ads-System, das kaufbereite Suchanfragen in messbare Anfragen verwandelt.",
    },
  ];
}

export default function GoogleAdsServiceRoute() {
  return <ServicesPage variant="googleAds" />;
}
