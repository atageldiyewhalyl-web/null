import ServiceV2, { type ServiceConfig } from "../components/v2/ServiceV2";
import { GoogleVisual } from "../components/v2/SystemVisuals";
import { SERVICE } from "../components/v2/links";

/*
 * /leistungen/seo: the SEO page.
 * Results: Herkules "Seite 1" = SEO report Oct 2026, "umzugsunternehmen mannheim" avg. position 9.1.
 * Treu: weekly blog article (no measured numbers yet, so no number is shown).
 * Timeline answer taken from the live SEO page (services FAQ). Package data comes from PreiseV2 TIERS.
 */

export function meta() {
  return [
    { title: "SEO für Betriebe: bei Google gefunden werden | nüll." },
    { name: "description", content: "SEO für Handwerk, Kanzleien und Dienstleister in ganz Deutschland. Klare Leistungsseiten, lokale Sichtbarkeit und jeden Monat echte Zahlen. Ab 299 € im Monat." },
  ];
}

const cfg: ServiceConfig = {
  kind: "seo",
  eyebrow: "Leistung · SEO",
  titleMuted: "Wer sucht,",
  title: "findet dich",
  intro: "Wenn jemand in deiner Stadt sucht, was du anbietest, wirst du bei Google gefunden. Mit sauberer Technik, klaren Leistungsseiten und Texten, die überzeugen.",
  Visual: GoogleVisual,
  tint: "#eef3fb",
  proof: { value: "Seite 1", text: "bei Google für „Umzugsunternehmen Mannheim“. Herkules Umzüge, Oktober 2026." },
  video: { base: "seo", title: "In 30 Sekunden erklärt" },
  photo: { src: "/assets/v2/services/seo-scene.webp", alt: "Smartphone auf dem Küchentisch bei Kerzenlicht, Google zeigt „Dein Betrieb“ als erstes Ergebnis", chips: ["Sucht: Elektriker Mannheim", "Platz 1: die Konkurrenz"] },
  problem: {
    strong: "Gute Arbeit reicht nicht,",
    muted: "wenn Google deine Konkurrenz zeigt.",
    text: "Viele Betriebe haben eine Website. Aber keine klare Seitenstruktur, keine Seiten für ihre Leistungen und ihre Stadt und keine Texte, die Suchende überzeugen. Daraus bauen wir ein System, das Anfragen bringt.",
  },
  stepsTitle: "So machen wir dich sichtbar",
  steps: [
    { art: "search", title: "Suchintention", body: "Wir finden heraus, wonach deine Kunden wirklich suchen: Leistung, Ort, Problem und wie dringend es ist." },
    { art: "structure", title: "Seitenstruktur", body: "Deine Website bekommt Leistungsseiten, Seiten für deine Orte und interne Links, die Google versteht." },
    { art: "trust", title: "Vertrauen", body: "Texte, Bewertungen, Belege und ein klarer nächster Schritt machen aus Sichtbarkeit eine Anfrage." },
    { art: "measure", title: "Messung", body: "Rankings, Klicks, Anrufe und Formulare messen wir laufend. Jeden Monat siehst du die Zahlen im Bericht." },
  ],
  tier: "SEO",
  packageNote: "Das SEO-Paket baut auf deiner Website auf: Wir kümmern uns um Technik und Wartung, schreiben neue Inhalte und verbessern jeden Monat, was dich bei Google weiterbringt.",
  cases: [
    { img: "/assets/v2/bento/herkules.webp", alt: "Laptop mit der Website von Herkules Umzüge", client: "Herkules Umzüge · Mannheim", stat: "Seite 1", statRest: "bei Google für „Umzugsunternehmen Mannheim“, Oktober 2026" },
    { img: "/assets/v2/bento/treu.webp", alt: "Laptop mit der Website von Treu Haustechnik in einem Technikraum", client: "Treu Haustechnik · Mannheim", stat: "Jede Woche", statRest: "ein neuer Blogartikel zu Fragen, die Kunden bei Google stellen" },
  ],
  cross: {
    label: "Schneller sichtbar",
    title: "SEO & Google Ads",
    text: "SEO baut deine Sichtbarkeit langfristig auf. Mit Google Ads stehst du sofort oben, wenn jemand sucht.",
    href: SERVICE.ads,
  },
  faqs: [
    { q: "Wie lange dauert SEO?", a: "In den ersten 1 bis 3 Monaten bauen wir das Fundament auf und Google nimmt die Seiten auf. Nach 4 bis 6 Monaten siehst du erste belastbare Rankings. Danach wächst die Sichtbarkeit Monat für Monat weiter." },
    { q: "Was ist im SEO-Paket enthalten?", a: "Alles aus der Wartung (Hosting, technische Wartung, kleine Änderungen und dein Monatsbericht), dazu bis zu 8 Blogartikel im Monat, neue Seiten und Landingpages und laufende SEO-Optimierung. Für 299 € im Monat, netto." },
    { q: "Muss ich die Texte selbst schreiben?", a: "Nein. Die Texte schreiben wir. Von dir brauchen wir dein Fachwissen im Gespräch und Fotos deiner Arbeit, die du schon hast. Du prüfst nur, ob fachlich alles stimmt." },
    { q: "Was ist lokale SEO?", a: "Lokale SEO sorgt dafür, dass du gefunden wirst, wenn jemand mit Stadt, Region oder „in der Nähe“ sucht. Dazu gehören Seiten für deine Orte, dein Google-Unternehmensprofil, Bewertungen und eine saubere Technik." },
    { q: "Brauche ich zusätzlich Google Ads?", a: "Nicht immer. SEO baut deine Sichtbarkeit langfristig auf. Google Ads lohnt sich, wenn du sofort Anfragen brauchst. Im Paket SEO & Google Ads zahlst du die Monatsgebühr erst, wenn deine erste Anfrage kommt." },
    { q: "Woran sehe ich, ob es wirkt?", a: "Am Monatsbericht. Jeden Monat zeigen wir dir echte Zahlen: Besucher, Rankings, Anrufe und Anfragen. So siehst du schwarz auf weiß, was SEO dir bringt." },
  ],
};

export default function SeoV2Route() {
  return <ServiceV2 cfg={cfg} current={SERVICE.seo} />;
}
