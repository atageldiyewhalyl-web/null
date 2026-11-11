import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/ft: case study.
 * Client: FT Sicherheitstechnik, Mannheim (B2B security technology since 2013; own camera brand FTronics). Site: ftsicherheitstechnik.com,
 *  rebuilt by nüll. (repo ~/Documents/ft-sicherheitstechnik), sitemap 39 URLs incl. 18 product pages, configurator, 6 guides.
 * Google Ads (102-564-5204), read-only pull 11 Nov 2026 (~/Documents/null/.resolve-work/ft-ref/ads.json):
 *  Search campaign 1–11 Oct: 1,158 impr, 67 clicks, CTR 5.8 %; 12 Oct–10 Nov: 422 impr, 39 clicks, CTR 9.2 % (after broad keywords
 *  were paused, 84 negative keywords added and search partners switched off); October search: 1 conversion (tracked enquiry).
 *  From the October report: 76 % of search clicks from video surveillance, 70 % of clicks from phones (28 % desktop, 2 % tablet).
 *  Halyl (11 Nov 2026): one new client so far, so the page says the start is made and shows ratios, not volume. Spend left out.
 * Quote: written with the owner's consent (CasesV2), sign-off pending; credited to the firm.
 */

export function meta() {
  return [
    { title: "Referenz FT Sicherheitstechnik: Sicherheitstechnik für Firmen, klar gegliedert | nüll." },
    { name: "description", content: "Wie FT Sicherheitstechnik in Mannheim eine neue Website mit 18 Produktseiten und Konfigurator bekam, dazu Google-Anzeigen nur für Firmenkunden." },
  ];
}

const F = "/assets/v2/referenzen/ft";
const SITE = "https://www.ftsicherheitstechnik.com";
const PAGES = Array.from({ length: 39 }, (_, i) => `${F}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "FT Sicherheitstechnik",
  theme: { ink: "#16181d", accent: "#c20e1a", soft: "#f4f5f7", bright: "#ff4b4b" },
  logo: { light: `${F}/logo.png`, dark: `${F}/logo.png`, alt: "FT Sicherheitstechnik, Mannheim" },
  eyebrow: "Referenz · Sicherheitstechnik für Unternehmen in Mannheim",
  title: "Sicherheitstechnik für Firmen, klar gegliedert.",
  headline: { value: 39, unit: "Seiten", caption: "Seiten: Lösungen, Produkte, Konfigurator und Ratgeber", statement: "Sicherheitstechnik für Firmen, klar gegliedert" },
  browser: {
    scroll: `${F}/site-home-scroll.webp`,
    url: "ftsicherheitstechnik.com",
    alt: "Die Startseite von ftsicherheitstechnik.com",
    phone: `${F}/site-m-home.webp`,
    phoneAlt: "Die Startseite von FT Sicherheitstechnik auf dem Handy",
  },
  intro: "FT Sicherheitstechnik schützt seit über 15 Jahren Firmen in der Rhein-Neckar-Region, mit eigener Kameramarke. Wir haben die Website neu gebaut und die Google-Anzeigen ganz auf Firmenkunden ausgerichtet. Der Anfang ist gemacht: Die erste Anfrage über die Anzeigen ist da.",
  services: ["Website", "Produktseiten", "Konfigurator", "Google Ads", "SEO"],
  stats: [
    { value: "9,2 %", label: "Klickrate der Suchanzeigen seit 12. Oktober", star: true },
    { value: "84", label: "ausgeschlossene Suchbegriffe gegen Privat-Suchen", star: true },
    { value: "18", label: "eigene Produkte, jedes mit eigener Seite" },
    { value: "6", label: "Ratgeber-Artikel für Firmen" },
  ],
  starNote: "Google-Ads-Konto von FT Sicherheitstechnik, 1. Oktober bis 10. November 2026.",
  catalog: {
    title: "Die Website",
    statement: "Vom Problem zur passenden Kamera",
    products: PAGES,
    wallWide: true,
    count: 39,
    countLabel: "Seiten: Lösungen, 18 Produkte, Konfigurator, 6 Ratgeber",
    features: ["Wege für Gewerbe und Privat", "18 FTronics-Produkte", "Konfigurator in 4 Schritten", "6 Ratgeber-Artikel", "Anfrage mit einem Klick", "DSGVO-Fragen erklärt"],
    pages: [
      { img: `${F}/site-home.webp`, title: "Startseite", text: "Smarte Sicherheitstechnik: Anfrage starten oder die passende Lösung finden.", url: `${SITE}/` },
      { img: `${F}/site-gewerbe.webp`, title: "Lösungen für Gewerbe", text: "Büro, Lager, Einzelhandel und Industrie: der Weg für Firmenkunden.", url: `${SITE}/loesungen-gewerbe` },
      { img: `${F}/site-video.webp`, title: "Videoüberwachung", text: "Die meistgesuchte Leistung, mit der Anfrage gleich daneben.", url: `${SITE}/videoueberwachung-gewerbe` },
      { img: `${F}/site-produkte.webp`, title: "FTronics", text: "Die eigene Marke: 18 Produkte, jedes mit eigener Seite.", url: `${SITE}/produkte` },
      { img: `${F}/site-konfigurator.webp`, title: "Konfigurator", text: "Das eigene Sicherheitskonzept in 4 Schritten, kostenlos und unverbindlich.", url: `${SITE}/konfigurator` },
      { img: `${F}/site-ratgeber.webp`, title: "Ratgeber", text: "Was die DSGVO bei Videoüberwachung im Unternehmen erlaubt.", url: `${SITE}/ratgeber/videoueberwachung-unternehmen-dsgvo` },
    ],
  },
  task: {
    title: "Die Website",
    columns: [
      { title: "Ausgangslage", text: "Firmen rund um Mannheim suchen nach Videoüberwachung, Alarmanlage oder Zutrittskontrolle. FT bietet genau das, mit eigener Kameramarke, war online aber kaum als Partner für Gewerbe zu erkennen." },
      { title: "Unser Ansatz", text: "Eine neue Website mit klaren Wegen für Gewerbe, allen FTronics-Produkten und einem Konfigurator. Dazu Google-Anzeigen nur für Firmen-Suchen: private Suchen nach Markenkameras sind ausgeschlossen." },
    ],
    text: [],
    photos: [],
  },
  numbers: {
    title: "Die Anzeigen",
    intro: "Aus dem Google-Ads-Konto, als Verhältnisse. Ausgaben bleiben bei FT.",
    ratios: {
      growth: {
        title: "Klickrate der Suchanzeigen",
        value: "1,6×",
        text: "so oft wird eine Anzeige jetzt angeklickt, seit sie nur noch bei Firmen-Suchen erscheint.",
        bars: [
          { label: "1. bis 11. Okt.", ratio: 1 },
          { label: "seit 12. Okt.", ratio: 1.6 },
        ],
      },
      dots: { title: "Vom Einblenden zum Klick", value: "9,2 %", every: 11, text: "Fast jede elfte Einblendung einer Suchanzeige wird angeklickt, seit dem 12. Oktober." },
      ring: { title: "Videoüberwachung", pct: 76, text: "der Klicks im Oktober kamen über Suchen nach Videoüberwachung." },
      split: {
        title: "Wer klickt",
        value: "70 %",
        text: "der Klicks kommen vom Handy, deshalb Anruf und Anfrage mit einem Tipp.",
        parts: [
          { label: "Handy", pct: 70 },
          { label: "Desktop", pct: 28 },
          { label: "Tablet", pct: 2 },
        ],
      },
    },
    source: "Quelle: Google-Ads-Konto von FT Sicherheitstechnik, Suchkampagne, 1. Oktober bis 10. November 2026, und nüll.-Monatsbericht Oktober 2026. Klickrate = Klicks ÷ Einblendungen.",
  },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Ratgeber, SEO und Google-Anzeigen, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Neu gebaut, mit Wegen für Gewerbe und Privat", "18 FTronics-Produkte mit eigener Seite", "Konfigurator für das eigene Sicherheitskonzept", "Anfrage und Anruf mit einem Klick"] },
      { title: "Ratgeber", icon: "blog", points: ["6 Artikel für Firmen", "DSGVO, Kameratypen, Zutrittskontrolle, Brandmeldeanlage"] },
      { title: "Google-Anzeigen", logos: ["/assets/v2/brands/google-ads.svg"], points: ["Suchkampagne für Videoüberwachung, Alarm und Zutritt", "84 ausgeschlossene Suchbegriffe gegen Privat-Suchen", "Nur in der Google-Suche, ohne Partner-Seiten", "Monatlicher Bericht"] },
      { title: "SEO", icon: "report", points: ["SEO-Audit zum Start", "Seiten für Mannheim und 50 km Umkreis"] },
    ],
  },
  quote: { text: "Unsere Leistungen sind jetzt so erklärt, dass Kunden sofort verstehen, was wir machen. Die Zusammenarbeit läuft unkompliziert.", who: "Geschäftsführung, FT Sicherheitstechnik" },
};

export default function FtReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
