import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/onkel: case study.
 * Client: Onkel Dienstleistungen (Onkel Abwassertechnik), Mannheim: pipe, drain and sewer service, 24h emergency service.
 * Site: onkel-abwassertechnik.de, built by nüll. (repo ~/Documents/Onkel, plain static HTML). Sitemap 11 Nov 2026: 21 URLs =
 *  home, 9 service pages, blog index, 10 guide articles (live since 2 Sep 2026). Retainer for site care and local SEO since 1 Sep 2026.
 * Client rules (agency registry): no prices, no invented reviews, ratings, project counts or response-time promises; the
 *  "24h Notdienst, 7 Tage" fact is the site's own. No traffic numbers: no Search Console or GA4 in the reports registry.
 * Quote: written with the owner's consent (CasesV2), sign-off pending; credited to the firm.
 */

export function meta() {
  return [
    { title: "Referenz Onkel Abwassertechnik: Rohr- und Kanalreinigung, klar erklärt | nüll." },
    { name: "description", content: "Wie Onkel Abwassertechnik in Mannheim eine Website bekam, die im Notfall sofort zum Anruf führt: 9 Leistungsseiten und 10 Ratgeber-Artikel." },
  ];
}

const K = "/assets/v2/referenzen/onkel";
const SITE = "https://www.onkel-abwassertechnik.de";
const PAGES = Array.from({ length: 21 }, (_, i) => `${K}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Onkel Abwassertechnik",
  theme: { ink: "#1c1a1b", accent: "#9b0035", soft: "#fbeff2", bright: "#ff5c7a" },
  logo: { light: `${K}/logo.png`, dark: `${K}/logo.png`, alt: "Onkel Abwassertechnik, Mannheim", square: true },
  eyebrow: "Referenz · Rohr- und Kanalservice in Mannheim",
  title: "Rohr- und Kanalreinigung, klar erklärt.",
  headline: { value: 21, unit: "Seiten", caption: "Seiten: 9 Leistungen und 10 Ratgeber", statement: "Rohr- und Kanalreinigung, klar erklärt" },
  browser: {
    scroll: `${K}/site-home-scroll.webp`,
    url: "onkel-abwassertechnik.de",
    alt: "Die Startseite von onkel-abwassertechnik.de",
    phone: `${K}/site-m-home.webp`,
    phoneAlt: "Die Startseite von Onkel Abwassertechnik auf dem Handy",
  },
  intro: "Onkel Abwassertechnik hilft in Mannheim, wenn Rohr oder Kanal streiken, mit Notdienst rund um die Uhr. Wir haben die Website gebaut und schreiben die Ratgeber zu den Fragen, die Kunden vor dem Anruf haben.",
  services: ["Website", "Leistungsseiten", "Ratgeber", "Lokale SEO"],
  stats: [
    { value: "24h", label: "Notdienst, 7 Tage die Woche" },
    { value: "9", label: "Leistungen, jede mit eigener Seite" },
    { value: "10", label: "Ratgeber-Artikel seit September" },
    { value: "1 Tipp", label: "bis zum Anruf oder zur WhatsApp" },
  ],
  starNote: "Angaben laut onkel-abwassertechnik.de, Stand November 2026.",
  catalog: {
    title: "Die Website",
    statement: "Eine Seite für jedes Problem",
    products: PAGES,
    wallWide: true,
    count: 21,
    countLabel: "Seiten: 9 Leistungen, 10 Ratgeber, Start und Blog",
    features: ["Notdienst immer im Blick", "9 Leistungsseiten", "10 Ratgeber-Artikel", "Anruf und WhatsApp mit einem Tipp", "Mannheim und Umgebung", "Strukturierte Daten für Google"],
    pages: [
      { img: `${K}/site-home.webp`, title: "Startseite", text: "Rohrreinigung und Kanalreinigung in Mannheim: anrufen oder per WhatsApp schreiben.", url: `${SITE}/` },
      { img: `${K}/site-rohr.webp`, title: "Rohrreinigung", text: "Schnelle Hilfe bei verstopften Rohren, mit allem, was vor dem Anruf zählt.", url: `${SITE}/rohrreinigung-mannheim/` },
      { img: `${K}/site-notdienst.webp`, title: "Notdienst", text: "Die Seite für den Ernstfall, wenn Wasser steht oder zurückdrückt.", url: `${SITE}/rohrreinigung-notdienst-mannheim/` },
      { img: `${K}/site-kanal.webp`, title: "Instandsetzung", text: "Rohr und Kanal sanieren, auch ohne Aufgraben.", url: `${SITE}/rohr-kanalinstandsetzung-mannheim/` },
      { img: `${K}/site-blog.webp`, title: "Ratgeber", text: "Praktische Hilfe für Mannheim: Antworten auf die Fragen vor dem Anruf.", url: `${SITE}/blog/` },
      { img: `${K}/site-artikel.webp`, title: "Wer zahlt?", text: "Rohrverstopfung in der Mietwohnung: Mieter oder Vermieter?", url: `${SITE}/blog/rohrverstopfung-wer-zahlt-mieter-vermieter/` },
    ],
  },
  task: {
    title: "Die Website",
    columns: [
      { title: "Ausgangslage", text: "Wenn das Abwasser steht, sucht niemand lange: Man googelt und ruft den an, der zuerst Vertrauen weckt. Onkel Abwassertechnik brauchte einen Auftritt, der in Sekunden zeigt: Hier bekomme ich Hilfe." },
      { title: "Unser Ansatz", text: "Eine Website, die sofort zum Anruf führt, mit einer Seite pro Leistung und Ratgebern zu den Fragen davor: Was kann ich selbst tun, wer zahlt, was passiert beim Kanal-TV?" },
    ],
    text: [],
    photos: [],
  },
  numbers: { hide: true, title: "", intro: "", source: "" },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Ratgeber und lokale SEO, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Gebaut für den Notfall: Anruf und WhatsApp sofort sichtbar", "9 Leistungsseiten für Mannheim", "Schnell, ohne Baukasten"] },
      { title: "Ratgeber", icon: "blog", points: ["10 Artikel seit September 2026", "Verstopfung, Wer zahlt, Rückstau bei Starkregen, Kanal-TV", "Keine riskanten Selbsthilfe-Tipps, dafür klare Grenzen"] },
      { title: "Lokale SEO", icon: "report", points: ["Strukturierte Daten als Rohrreinigungsbetrieb", "Mannheim und Umgebung im Blick", "Laufende Pflege seit September 2026"] },
    ],
  },
  quote: { text: "Die Seite bringt es auf den Punkt: Wer ein Problem hat, sieht sofort, wie er uns erreicht. Genau so sollte es sein.", who: "Onkel Abwassertechnik, Mannheim" },
};

export default function OnkelReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
