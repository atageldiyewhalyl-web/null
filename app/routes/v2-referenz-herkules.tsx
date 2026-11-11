import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/herkules: case study.
 * Client: Herkules Umzüge & Transporte e.K., Mannheim (+ Frankfurt location). Site: www.umzuege-herkules.de, rebuilt by nüll.,
 *  live since early May 2026 (repo ~/Documents/Herkules, first commit 2 May 2026). nüll. does website + SEO only;
 *  another agency runs their Google Ads, so organic and paid are kept apart below.
 * Numbers: read-only pull on 11 Nov 2026 (~/Documents/null/.resolve-work/herkules-ref/fetch.py, data.json).
 *  Search Console (sc-domain:umzuege-herkules.de): impressions May 3,786 · Jun 6,570 · Jul 9,759 · Aug 11,602 · Sep 15,495 · Oct 12,209;
 *   clicks May–8 Nov 1,137; avg position Jun 22.7 → 1–8 Nov 12.5; "umzugsunternehmen mannheim" May 20.1 → Oct 9.1,
 *   "umzug mannheim" 25.3 → 8.4, "umzüge mannheim" 12.6 → 7.9.
 *  GA4 (properties/536701252, key events, consented visitors only), 1 Jun–10 Nov 2026 (163 days):
 *   259 enquiries = 138 anfrage_submit + 93 phone_click + 27 email_click + 1 whatsapp_click (WhatsApp tracked since 4 Nov);
 *   at least one on 125 of 163 days; 130 without Paid Search; last 30 days (12 Oct–10 Nov): 22 days with an enquiry.
 * Page count: sitemap.xml = 58 URLs (9 services, 24 local pages, 22 blog posts, home, about, blog index).
 * Trust facts (20+ years, partner of the city of Mannheim, 4.8 Google rating) from the client's own site and the vault case study note.
 * Their own photos are partly AI-generated, so the page uses live page captures only.
 */

export function meta() {
  return [
    { title: "Referenz Herkules Umzüge: 259 Anfragen über die neue Website | nüll." },
    { name: "description", content: "Wie Herkules Umzüge in Mannheim mit einer neuen Website und SEO bei Google nach vorne kam: 58 Seiten, Seite 1 für „Umzugsunternehmen Mannheim“ und an drei von vier Tagen eine Anfrage." },
  ];
}

const H = "/assets/v2/referenzen/herkules";
const SITE = "https://www.umzuege-herkules.de";
const PAGES = Array.from({ length: 58 }, (_, i) => `${H}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Herkules Umzüge",
  theme: { ink: "#101522", accent: "#9a6b00", soft: "#fff7e0", bright: "#f6c02d" },
  logo: { light: `${H}/logo.png`, dark: `${H}/logo.png`, alt: "Herkules Umzüge & Transporte, Mannheim" },
  eyebrow: "Referenz · Umzüge in Mannheim und Frankfurt",
  title: "Wer in Mannheim umzieht, findet Herkules.",
  headline: { value: 259, unit: "Anfragen", caption: "Anfragen über die Website seit Juni", statement: "Wer in Mannheim umzieht, findet Herkules" },
  browser: {
    scroll: `${H}/site-home-scroll.webp`,
    url: "umzuege-herkules.de",
    alt: "Die Startseite von umzuege-herkules.de",
    phone: `${H}/site-m-home.webp`,
    phoneAlt: "Die Startseite von Herkules Umzüge auf dem Handy",
  },
  intro: "Seit über 20 Jahren zieht Herkules Familien und Firmen in Mannheim um. Seit Mai hat der Betrieb eine neue Website mit 58 Seiten, und seitdem kommt an drei von vier Tagen mindestens eine Anfrage.",
  services: ["Website", "SEO", "Lokale Seiten", "Ratgeber", "Messung"],
  stats: [
    { value: "3 von 4", label: "Tagen mit mindestens einer Anfrage", star: true },
    { value: "Seite 1", label: "bei Google für „Umzugsunternehmen Mannheim“", star: true },
    { value: "4×", label: "so viele Google-Einblendungen im September wie im Mai", star: true },
    { value: "58", label: "Seiten: Leistungen, Stadtteile und Ratgeber" },
  ],
  starNote: "Google Analytics, 1. Juni bis 10. November 2026 (nur Besucher mit Cookie-Zustimmung), und Google Search Console, Mai bis Oktober 2026.",
  catalog: {
    title: "Die Website",
    statement: "Eine eigene Seite für jede Suche",
    products: PAGES,
    wallWide: true,
    count: 58,
    countLabel: "Seiten: 9 Leistungen, 24 Orte, 22 Ratgeber",
    features: ["Neu seit Mai 2026", "24 Stadtteile und Orte", "22 Ratgeber-Artikel", "Kostenloses Angebot per Formular", "Anruf mit einem Klick", "Eigener Standort Frankfurt"],
    pages: [
      { img: `${H}/site-home.webp`, title: "Startseite", text: "Umzugsfirma Mannheim, stressfrei umziehen: das kostenlose Angebot und der Anruf gleich oben.", url: `${SITE}/` },
      { img: `${H}/site-mannheim.webp`, title: "Umzug Mannheim", text: "Die Hauptseite für Mannheim: Festpreis, versichert, seit 2004.", url: `${SITE}/umzug-mannheim/` },
      { img: `${H}/site-kaefertal.webp`, title: "Stadtteile", text: "Jeder Mannheimer Stadtteil mit eigener Seite, von den Quadraten bis Waldhof.", url: `${SITE}/umzug-mannheim-kaefertal/` },
      { img: `${H}/site-frankfurt.webp`, title: "Umzug Frankfurt", text: "Eigene Seiten für den Standort Frankfurt, bis in die Stadtteile.", url: `${SITE}/umzug-frankfurt/` },
      { img: `${H}/site-halteverbot.webp`, title: "Halteverbotszone", text: "Die Leistung, nach der viele zuerst suchen, mit Ablauf und Fristen.", url: `${SITE}/halteverbotszone/` },
      { img: `${H}/site-blog.webp`, title: "Ratgeber", text: "Artikel zu Umzugskosten, Halteverbot und Ummelden, für Mannheim, Heidelberg und Frankfurt.", url: `${SITE}/blog/umzugskosten-mannheim/` },
    ],
  },
  task: {
    title: "Die Website",
    columns: [
      { title: "Ausgangslage", text: "Seit über 20 Jahren im Geschäft, offizieller Partner der Stadt Mannheim und offline bestens empfohlen. Online aber kaum zu finden: wenige Seiten, eine langsame alte Website und kaum ein Grund, eine Anfrage zu schicken." },
      { title: "Unser Ansatz", text: "Eine neue, schnelle Website mit einer eigenen Seite für jede Leistung, jeden Stadtteil und jede Frage vor dem Umzug. Dazu laufende SEO und ein Formular für ein kostenloses Angebot." },
    ],
    text: [],
    photos: [],
  },
  numbers: {
    title: "Die Zahlen",
    intro: "Aus Google Search Console und Google Analytics der Website, abgerufen am 11. November 2026.",
    monthsTitle: "Einblendungen in der Google-Suche pro Monat",
    months: [
      { label: "Mai", value: 3786 },
      { label: "Juni", value: 6570 },
      { label: "Juli", value: 9759 },
      { label: "Aug.", value: 11602 },
      { label: "Sep.", value: 15495 },
      { label: "Okt.", value: 12209 },
    ],
    drop: {
      title: "Ø Position bei Google",
      from: "22,7",
      fromLabel: "Juni 2026",
      to: "12,5",
      toLabel: "November 2026 (1. bis 8.)",
      text: "Je kleiner die Zahl, desto weiter oben. Die Plätze 1 bis 10 sind Seite 1.",
    },
    placesTitle: "Die wichtigsten Suchen",
    places: [
      { name: "„Umzugsunternehmen Mannheim“", how: "die Suche mit den meisten Einblendungen", since: "Mai", a: "20,1", aLabel: "Position im Mai", b: "9,1", bLabel: "Position im Oktober" },
      { name: "„Umzug Mannheim“", how: "von Seite 3 auf Seite 1", since: "Mai", a: "25,3", aLabel: "Position im Mai", b: "8,4", bLabel: "Position im Oktober" },
      { name: "„Umzüge Mannheim“", how: "auf Seite 1", since: "Mai", a: "12,6", aLabel: "Position im Mai", b: "7,9", bLabel: "Position im Oktober" },
    ],
    searchesTitle: "So kommen die 259 Anfragen",
    searchesUnit: "seit Juni",
    searchesIcon: false,
    searches: [
      { q: "Formular für ein kostenloses Angebot", clicks: 138 },
      { q: "Klick auf die Telefonnummer", clicks: 93 },
      { q: "E-Mail", clicks: 27 },
      { q: "WhatsApp (gemessen seit 4. November)", clicks: 1 },
    ],
    searchNote: "Im Schnitt 1,6 Anfragen am Tag, an 125 von 163 Tagen mindestens eine.",
    small: [
      { value: "1.137", label: "Klicks aus der Google-Suche", sub: "Mai bis 8. November 2026" },
      { value: "130", label: "Anfragen ohne bezahlte Anzeigen", sub: "Google-Suche, direkt, Empfehlungen und KI-Assistenten" },
      { value: "22 von 30", label: "Tagen mit mindestens einer Anfrage", sub: "12. Oktober bis 10. November 2026" },
    ],
    source: "Quelle: Google Search Console (Mai bis 8. November 2026) und Google Analytics 4 (1. Juni bis 10. November 2026) für umzuege-herkules.de. Eine Anfrage ist ein abgeschicktes Formular oder ein Klick auf Telefon, E-Mail oder WhatsApp. Google Analytics zählt nur Besucher, die Cookies zustimmen, die echte Zahl liegt also höher. Die Google-Anzeigen von Herkules betreut eine andere Agentur: Anfragen darüber sind in den 259 enthalten, in den 130 nicht.",
  },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, SEO und Messung, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Neu gebaut, live seit Mai 2026", "Schnell: jede Seite vorab fertig gerendert", "Formular für ein kostenloses Angebot", "Anruf, E-Mail und WhatsApp mit einem Klick"] },
      { title: "Lokale Seiten", icon: "image", points: ["24 Seiten für Stadtteile und Orte", "Mannheim, Frankfurt, Heidelberg, Ludwigshafen und mehr", "Eigene Seiten für den Standort Frankfurt"] },
      { title: "Ratgeber", icon: "blog", points: ["22 Artikel zu Kosten, Halteverbot und Ummelden", "Antworten auf die Fragen vor dem Umzug", "Jeder Artikel verlinkt auf die passende Leistung"] },
      { title: "SEO & Messung", icon: "report", points: ["Search Console und Google Analytics eingerichtet", "Anfragen gemessen: Formular, Anruf, E-Mail, WhatsApp", "Monatlicher SEO-Bericht mit nächsten Schritten"] },
    ],
  },
};

export default function HerkulesReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
