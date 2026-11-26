import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";
import { withSocial } from "../utils/seoMeta";

/*
 * /referenzen/entruemplerhelden: case study (first version, written the day after launch).
 * Client: Die Entrümplerhelden GmbH, Berliner Straße 20, 67059 Ludwigshafen (Entrümpelung, Haushaltsauflösung, Messie-Wohnungen).
 *  Site: die-entruemplerhelden.de (Next.js on Vercel, repo ~/Documents/die-entruemplerhelden), built by nüll. (footer credit).
 *  LIVE since 25 Nov 2026, 21:55 (Vercel domain added). First commit 17 Nov 2026. Texts use "Sie".
 * Facts (all from the live site or the repo, 26 Nov 2026):
 *  - Sitemap: 82 URLs = home, Leistungen overview + 7 service pages, 12 city pages, Einsatzgebiet, Preise, Ratgeber overview
 *    + 55 Ratgeber articles, Kontakt, Impressum, Datenschutz.
 *  - Prices are the client's own, published on the site: smallest job 2 helpers × 8 h × 50 € = 800 € plus travel; fixed price
 *    after photos or a visit; no Wertanrechnung.
 *  - 18 permanent redirects from the old WordPress addresses (repo commit b3b8043, 25 Nov 2026). The old site also carried
 *    the "Servicehelden" business (reception staff, stewards); those addresses now point to /leistungen.
 *  - Measurement from day one: cookie-free counting of form enquiries and phone/WhatsApp/email clicks (Supabase), GA4 only
 *    after consent, Search Console verified and sitemap submitted on 25 Nov 2026.
 * No numbers yet: the two rows in entruempler_anfragen (25 Nov, 23:39 and 23:40) look like launch tests, so numbers.hide.
 *  Old site: the Wayback snapshots render without CSS/images, so there is no before/after until a real screenshot exists.
 *  Never mention the commission model. Update this page with Search Console data and labelled enquiries after ~30 days.
 * Mockup: public/assets/v2/mockups/entruemplerhelden.webp, Codex image gen from real screenshots of the live site (26 Nov 2026).
 */

export function meta() {
  return withSocial("/referenzen/entruemplerhelden", [
    { title: "Referenz Die Entrümplerhelden: Festpreis nach Fotos | nüll." },
    { name: "description", content: "Die Entrümplerhelden, Ludwigshafen: neue Website mit Festpreis-Anfrage per Foto, 7 Leistungen, 12 Städten und 55 Ratgeber-Artikeln zum Start." },
  ], { image: "https://nuell-agentur.com/assets/v2/mockups/entruemplerhelden.webp" });
}

const E = "/assets/v2/referenzen/entruemplerhelden";
const SITE = "https://die-entruemplerhelden.de";
const PAGES = Array.from({ length: 33 }, (_, i) => `${E}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Die Entrümplerhelden",
  theme: { ink: "#440719", accent: "#c8325c", soft: "#fbf1ef", bright: "#f06a8d" },
  logo: { light: `${E}/logo.png`, dark: `${E}/logo.png`, alt: "Die Entrümplerhelden, Entrümpelung und Haushaltsauflösung aus Ludwigshafen", square: true },
  eyebrow: "Referenz · Entrümpelung von Ludwigshafen bis Frankfurt",
  title: "Fotos schicken, Festpreis bekommen, Schlüssel abgeben.",
  headline: { value: 82, unit: "Seiten", caption: "Seiten zum Start, davon 55 Ratgeber-Artikel", statement: "Eine Website, die Entrümpelung zum Festpreis verkauft" },
  browser: {
    scroll: `${E}/site-home-scroll.webp`,
    url: "die-entruemplerhelden.de",
    alt: "Die Startseite von die-entruemplerhelden.de",
    phone: `${E}/site-m-home.webp`,
    phoneAlt: "Die Startseite der Entrümplerhelden auf dem Handy",
  },
  intro: "Die Entrümplerhelden räumen Wohnungen, Häuser, Keller und Messie-Wohnungen von Ludwigshafen bis Frankfurt. Die neue Website ist seit dem 25. November 2026 online. Erste Zahlen zu Anfragen und Google folgen hier, sobald sie aussagekräftig sind.",
  services: ["Website", "SEO", "Ratgeber", "Anfrage-Messung"],
  stats: [
    { value: "7", label: "Leistungen mit eigener Seite" },
    { value: "12", label: "Städte mit eigener Seite, von Ludwigshafen bis Frankfurt" },
    { value: "55", label: "Ratgeber-Artikel zum Start" },
    { value: "800 €", label: "kleinster Auftrag, offen auf der Website genannt" },
  ],
  starNote: "Stand: Start der Website am 25. November 2026. Preise sind die des Betriebs, wie auf die-entruemplerhelden.de veröffentlicht.",
  catalog: {
    title: "Die Website",
    statement: "Vom Foto zum Festpreis, ohne Umweg",
    products: PAGES,
    wallWide: true,
    count: 82,
    countLabel: "Seiten: Leistungen, Städte, Preise und Ratgeber",
    features: ["Festpreis-Anfrage mit Fotos", "Vorher-nachher-Regler", "Preise offen genannt", "Eine Seite je Leistung und Stadt", "55 Ratgeber-Artikel", "Anrufen mit einem Tipp"],
    pages: [
      { img: `${E}/site-home.webp`, title: "Startseite", text: "Entrümpelung zum Festpreis: Art der Räumung ankreuzen, Ort und Telefon eintragen, Fotos anhängen.", url: `${SITE}/` },
      { img: `${E}/site-preise.webp`, title: "Preise", text: "Der kleinste Auftrag offen gerechnet: zwei Helfer, acht Stunden, 50 € pro Stunde. Dazu, was den Festpreis bestimmt.", url: `${SITE}/preise` },
      { img: `${E}/site-messie.webp`, title: "Messie-Wohnung", text: "Eine eigene Seite für die schwierigsten Räumungen: diskret, gründlich, mit Reinigung.", url: `${SITE}/leistungen/messie-wohnung` },
      { img: `${E}/site-mannheim.webp`, title: "Entrümpelung Mannheim", text: "Eine von zwölf Städteseiten, damit der Betrieb auch dort gefunden wird, wo er hinfährt.", url: `${SITE}/entruempelung-mannheim` },
      { img: `${E}/site-ratgeber.webp`, title: "Ratgeber", text: "55 Artikel zum Start: Kosten, Ablauf, Wohnungsübergabe, Haushaltsauflösung nach einem Todesfall.", url: `${SITE}/ratgeber` },
      { img: `${E}/site-einsatzgebiet.webp`, title: "Einsatzgebiet", text: "Von Ludwigshafen über Mannheim und Heidelberg bis Darmstadt und Frankfurt.", url: `${SITE}/einsatzgebiet` },
    ],
  },
  task: {
    title: "Der Betrieb",
    statement: "Räumen, putzen, Schlüssel übergeben",
    columns: [
      { title: "Ausgangslage", text: "Die alte WordPress-Seite zeigte zwei Geschäfte auf einmal: die Entrümpelung und die „Servicehelden“ mit Empfangspersonal und Ordnern. Für einzelne Städte gab es keine eigenen Seiten, und der Weg zur Anfrage hieß „Termin vereinbaren“." },
      { title: "Unser Ansatz", text: "Eine Website nur für die Entrümpelung. Die Anfrage ist so einfach wie möglich: ankreuzen, was geräumt werden soll, Fotos anhängen, Festpreis bekommen. Dazu offene Preise, eine Seite je Leistung und Stadt und ein Ratgeber für die Fragen vor der Räumung." },
    ],
    text: [],
    photos: [],
  },
  launch: {
    title: "Der Start",
    intro: "Die ersten Zahlen kommen mit den nächsten Wochen. Gemessen wird ab dem ersten Tag.",
    items: [
      { date: "17. Nov.", title: "Bau der Website", text: "Neue Website mit eigener Seite je Leistung und Stadt, Preisseite und Ratgeber." },
      { date: "25. Nov.", title: "Die Website ist online", text: "Domain umgezogen, Search Console bestätigt und die Sitemap mit 82 Seiten eingereicht." },
      { date: "25. Nov.", title: "Messung vom ersten Tag an", text: "Jede Anfrage und jeder Klick auf Telefon, WhatsApp und E-Mail wird ohne Cookies gezählt, Google Analytics nur nach Einwilligung." },
      { date: "25. Nov.", title: "Alte Adressen umgeleitet", text: "18 Adressen der alten WordPress-Seite führen auf die passenden neuen Seiten, damit alte Links und Lesezeichen nicht ins Leere laufen." },
    ],
  },
  numbers: { hide: true, title: "", intro: "", source: "" },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Ratgeber, SEO und Messung, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Festpreis-Anfrage mit Fotos direkt auf der Startseite", "Vorher-nachher-Regler: so sieht der Raum nach der Räumung aus", "Anrufen mit einem Tipp, auf jeder Seite", "Fürs Handy gebaut"] },
      { title: "Seiten für Google", icon: "report", points: ["7 Leistungsseiten, von Haushaltsauflösung bis Messie-Wohnung", "12 Städteseiten von Ludwigshafen bis Frankfurt", "Preisseite mit offen gerechnetem Mindestauftrag", "18 alte Adressen dauerhaft umgeleitet"] },
      { title: "Ratgeber", icon: "blog", points: ["55 Artikel zum Start", "Kosten, Ablauf, Sperrmüll, Wohnungsübergabe", "Haushaltsauflösung nach einem Todesfall, Messie-Wohnung, Erbengemeinschaft"] },
      { title: "Messung", icon: "form", points: ["Anfragen und Klicks ohne Cookies gezählt", "Google Analytics nur nach Einwilligung", "Search Console und Sitemap am ersten Tag"] },
    ],
  },
};

export default function EntruemplerheldenReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
