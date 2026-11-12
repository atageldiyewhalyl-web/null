import LeistungenV2 from "../components/v2/LeistungenV2";
import { withSocial } from "../utils/seoMeta";

// /leistungen: all services on one page.
export function meta() {
  return withSocial("/leistungen", [
    { title: "Leistungen: Websites, SEO, Google Ads, KI-Sichtbarkeit und Content | nüll." },
    { name: "description", content: "Alles, was Anfragen bringt: Webdesign, SEO, Google Ads, KI-Sichtbarkeit und Content für Handwerk, Kanzleien, Praxen und Dienstleister. Einzeln oder kombiniert." },
  ]);
}

export default function LeistungenV2Route() {
  return <LeistungenV2 />;
}
