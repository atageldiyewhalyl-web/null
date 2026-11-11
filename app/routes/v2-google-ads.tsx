import ServiceV2, { AdsVisual, type ServiceConfig } from "../components/v2/ServiceV2";
import { SERVICE } from "../components/v2/links";

/*
 * /leistungen/google-ads: the Google Ads page.
 * Result: Waschbar 2.491 direction requests = Gesamtbericht Google Ads, 6 Aug to 5 Nov 2026 (HeroV2 PROOFS).
 * Herkules is left out on purpose: their Google Ads are run by someone else.
 * Package: "SEO & Google Ads" from PreiseV2 TIERS (450 €, guarantee, ad budget from 450 € paid directly to Google).
 */

export function meta() {
  return [
    { title: "Google Ads für Betriebe: Anzeigen, die Anfragen bringen | nüll." },
    { name: "description", content: "Google Ads für Handwerk, Kanzleien und Dienstleister. Kampagnen, Landingpage und Tracking aus einer Hand. 0 € Monatsgebühr, bis deine erste Anfrage kommt." },
  ];
}

const cfg: ServiceConfig = {
  kind: "ads",
  eyebrow: "Leistung · Google Ads",
  titleMuted: "Anzeigen, die",
  title: "Anfragen bringen",
  intro: "Wir richten deine Google-Ads-Kampagnen ein und betreuen sie laufend. Du stehst oben, wenn jemand genau das sucht, was du anbietest, und wir messen alles bis zur Anfrage.",
  Visual: AdsVisual,
  tint: "#e9f2ff",
  proof: { value: "2.491", text: "Routenanfragen über Google Ads in 3 Monaten. Waschbar, August bis November 2026." },
  video: { base: "ads", title: "In 30 Sekunden erklärt" },
  photo: { src: "/assets/v2/services/ads-scene.webp", alt: "Hand eines Handwerkers hält ein Smartphone mit eingehendem Anruf von einem neuen Kunden", chips: ["Klick über deine Anzeige", "Kein Anruf"] },
  problem: {
    strong: "Klicks sind nicht das Ziel.",
    muted: "Anfragen sind es.",
    text: "Viele Kampagnen kosten Budget, weil Suchbegriffe, Anzeigen, Seite und Messung nicht zusammenarbeiten. Wir bauen Google Ads so, dass du sichtbar bist, wenn jemand kaufen will, und messbar bis zur Anfrage.",
  },
  stepsTitle: "So bringen Anzeigen Anfragen",
  steps: [
    { art: "search", title: "Suchintention", body: "Wir trennen Suchen von Menschen, die jetzt einen Betrieb brauchen, von Klicks, die nur Budget kosten." },
    { art: "campaign", title: "Kampagnen", body: "Anzeigen, Suchbegriffe, Orte und Budget bauen wir so auf, dass wir gezielt verbessern können." },
    { art: "landing", title: "Landingpage", body: "Die Seite beantwortet die Suche sofort und führt direkt zur Anfrage, zum Anruf oder zu WhatsApp." },
    { art: "measure", title: "Tracking", body: "Anrufe, Formulare und Routen werden gemessen, damit dein Budget dorthin fließt, wo Anfragen entstehen." },
  ],
  tier: "SEO & Google Ads",
  packageNote: "Google Ads gibt es bei uns zusammen mit SEO: Die Anzeigen bringen sofort Anfragen, SEO baut deine Sichtbarkeit dauerhaft auf. Und die Monatsgebühr beginnt erst mit deiner ersten Anfrage.",
  cases: [
    { img: "/assets/v2/bento/hasan.webp", alt: "Website der Kanzlei Doğru auf Laptop und Smartphone", client: "Kanzlei Doğru · Mannheim", stat: "148 Anrufe", statRest: "über Google Ads, dazu 134 Anfragen über das Website-Formular, 7. August bis 3. November 2026" },
    { img: "/assets/v2/bento/waschbar.webp", alt: "Laptop mit der Waschbar-Website in einem Waschsalon", client: "Waschbar · Heidelberg & Ludwigshafen", stat: "2.491", statRest: "Routenanfragen über Google Ads in 3 Monaten, 6. August bis 5. November 2026" },
    { img: "/assets/v2/bento/herkules.webp", alt: "Laptop mit der Website von Herkules Umzüge", client: "Herkules Umzüge · Mannheim · SEO", stat: "19 Anfragen", statRest: "über das Formular der Website im Oktober 2026, dazu 15 Klicks auf die Telefonnummer" },
  ],
  cross: {
    label: "Langfristig gefunden werden",
    title: "SEO",
    text: "Ohne Werbebudget bei Google gefunden werden: mit Leistungsseiten, lokaler Sichtbarkeit und neuen Inhalten jeden Monat.",
    href: SERVICE.seo,
  },
  faqs: [
    { q: "Was kostet Google Ads bei euch?", a: "Das Paket SEO & Google Ads kostet 450 € im Monat, netto. Dazu kommt dein Werbebudget ab 450 € im Monat, das du direkt an Google zahlst. Die Monatsgebühr beginnt erst, wenn deine erste Anfrage kommt." },
    { q: "Was zählt als Anfrage?", a: "Ein Anruf, eine Nachricht oder ein Formular von einem echten Interessenten. Darauf ist das ganze System ausgelegt, nicht auf Klicks." },
    { q: "Wer bezahlt das Werbebudget?", a: "Du, direkt an Google, mit deiner eigenen Karte. Das Budget läuft nie über uns, so siehst du jeden Euro selbst." },
    { q: "Brauche ich eine Landingpage?", a: "Nicht immer eine neue Website, aber fast immer eine klare Seite zur Anzeige. Sie muss zur Suche passen, Vertrauen schaffen und den nächsten Schritt messbar machen." },
    { q: "Wie schnell kommen Anfragen?", a: "Mit Google Ads schneller als mit SEO allein, weil deine Anzeigen sofort sichtbar sind, sobald die Kampagnen laufen. Wie viele Anfragen kommen, hängt von Branche, Region und Budget ab." },
    { q: "SEO oder Google Ads?", a: "SEO baut langfristige Sichtbarkeit auf, Google Ads bringt schneller Anfragen. Deshalb gibt es Google Ads bei uns zusammen mit SEO: Ads als steuerbarer Kanal, SEO als Fundament." },
  ],
};

export default function GoogleAdsV2Route() {
  return <ServiceV2 cfg={cfg} current={SERVICE.ads} />;
}
