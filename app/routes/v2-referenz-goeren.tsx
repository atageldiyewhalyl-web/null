import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";
import { withSocial } from "../utils/seoMeta";

/*
 * /referenzen/goeren: case study.
 * Client: Rechtsanwaltskanzlei Meral Gören, R1, 16, 68161 Mannheim. Rechtsanwältin since 6 June 2008, German and Turkish.
 *  Site: kanzlei-goeren.de (Next.js on Vercel, repo ~/Documents/Meral Goeren), built by nüll. (footer credit), LIVE since 23 Nov 2026.
 *  Client rules (clients.json): law firm, so never describe results as legal outcomes; "Sie". Nothing here goes beyond enquiries.
 * Facts:
 *  - Sitemap 25 Nov 2026: 30 URLs = 15 pages in German, each with a Turkish version; 5 practice-area pages, 5 blog articles.
 *  - Enquiries: Supabase meral_anfragen (is_test excluded), read 25 Nov 2026: 3 enquiries, all on 24 Nov 2026
 *    (form/Familienrecht/de, WhatsApp form/Ausländerrecht/tr found via "Google araması", form/Ausländerrecht/tr).
 *    lead_quality not labelled yet, so never "qualified". meral_klicks: 6 WhatsApp clicks on 23–24 Nov.
 *  - GA4 (consent-gated) and Search Console (only a few days) are too thin to show: numbers.hide.
 *  - Old site's .html pages redirected (308) on 25 Nov 2026 so their Google rankings carry over.
 *  - No client quote yet: add one only once Meral Gören approves the wording.
 * Mockup: public/assets/v2/mockups/goeren.webp, generated with Codex image gen from real screenshots of the live site (25 Nov 2026).
 */

export function meta() {
  return withSocial("/referenzen/goeren", [
    { title: "Referenz Kanzlei Meral Gören: 3 Anfragen in 48 Stunden | nüll." },
    { name: "description", content: "Neue Website der Kanzlei Meral Gören in Mannheim: jede Seite auf Deutsch und Türkisch, Anfrage per Formular und WhatsApp. 3 Anfragen in 48 Stunden." },
  ], { image: "https://nuell-agentur.com/assets/v2/mockups/goeren.webp" });
}

const G = "/assets/v2/referenzen/goeren";
const SITE = "https://kanzlei-goeren.de";
const PAGES = Array.from({ length: 26 }, (_, i) => `${G}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Kanzlei Meral Gören",
  theme: { ink: "#0f1d2b", accent: "#9a6f34", soft: "#f6efe4", bright: "#c9a063" },
  logo: { light: `${G}/logo.png`, dark: `${G}/logo-light.png`, alt: "Rechtsanwaltskanzlei Meral Gören, Mannheim" },
  eyebrow: "Referenz · Rechtsanwaltskanzlei in Mannheim",
  title: "Eine Kanzlei, zwei Sprachen, die ersten Anfragen am zweiten Tag.",
  headline: { value: 3, unit: "Anfragen", caption: "Anfragen in den ersten 48 Stunden nach dem Start", statement: "Die ersten Anfragen kamen am zweiten Tag" },
  browser: {
    scroll: `${G}/site-home-scroll.webp`,
    url: "kanzlei-goeren.de",
    alt: "Die Startseite von kanzlei-goeren.de",
    phone: `${G}/site-m-home.webp`,
    phoneAlt: "Die Startseite der Kanzlei Meral Gören auf dem Handy",
  },
  intro: "Rechtsanwältin Meral Gören berät in Mannheim auf Deutsch und Türkisch. Ihre neue Website spricht beide Sprachen, Seite für Seite. Am 23. November 2026 ging sie online, am nächsten Tag kamen die ersten drei Anfragen.",
  services: ["Website", "Deutsch & Türkisch", "SEO", "Website-Pflege"],
  stats: [
    { value: "3", label: "Anfragen in den ersten 48 Stunden", star: true },
    { value: "2 von 3", label: "Anfragen auf Türkisch", star: true },
    { value: "30", label: "Seiten, jede auf Deutsch und Türkisch" },
    { value: "5", label: "Rechtsgebiete mit eigener Seite" },
  ],
  starNote: "Anfragen per Formular und WhatsApp-Formular laut Anfrage-Protokoll der Website, 23. und 24. November 2026, Testeingänge ausgenommen.",
  catalog: {
    title: "Die Website",
    statement: "Jede Seite auf Deutsch und auf Türkisch",
    products: PAGES,
    wallWide: true,
    count: 30,
    countLabel: "Seiten, 15 auf Deutsch und 15 auf Türkisch",
    features: ["Deutsch und Türkisch, Seite für Seite", "Eine Seite je Rechtsgebiet", "Anfrage per Formular und WhatsApp", "Ratgeber-Artikel", "Kooperation für türkisches Recht", "Strukturierte Daten für Google"],
    pages: [
      { img: `${G}/site-de.webp`, title: "Startseite", text: "Fünf Rechtsgebiete, eine Ansprechpartnerin: Beratung anfragen oder per WhatsApp schreiben.", url: `${SITE}/` },
      { img: `${G}/site-tr.webp`, title: "Ana sayfa", text: "Dieselbe Seite auf Türkisch, für alle, die lieber Türkisch lesen.", url: `${SITE}/tr` },
      { img: `${G}/site-auslaenderrecht-tr.webp`, title: "Yabancılar Hukuku", text: "Ausländerrecht auf Türkisch: Von hier kamen die ersten Anfragen über WhatsApp.", url: `${SITE}/tr/rechtsgebiete/auslaenderrecht` },
      { img: `${G}/site-familienrecht.webp`, title: "Familienrecht", text: "Eine eigene Seite je Rechtsgebiet, hier Trennung, Scheidung und Unterhalt.", url: `${SITE}/rechtsgebiete/familienrecht` },
      { img: `${G}/site-ueber-mich.webp`, title: "Zur Person", text: "Deutsche Rechtsanwältin türkischer Herkunft, zugelassen seit 2008.", url: `${SITE}/ueber-mich` },
      { img: `${G}/site-erbfall.webp`, title: "Ratgeber", text: "Erbfall mit Bezug zur Türkei: welches Recht gilt? Artikel zu den Fragen, die Mandanten wirklich stellen.", url: `${SITE}/blog/erbfall-tuerkei` },
    ],
  },
  task: {
    title: "Die Kanzlei",
    statement: "Eine Ansprechpartnerin, in beiden Sprachen",
    columns: [
      { title: "Ausgangslage", text: "Die Kanzlei hatte noch eine alte, statische Website. Viele Mandantinnen und Mandanten sprechen Türkisch und suchen auch auf Türkisch nach einer Anwältin." },
      { title: "Unser Ansatz", text: "Eine neue Website, auf der jede Seite auch auf Türkisch erscheint. Eine Seite je Rechtsgebiet, Anfragen per Formular oder WhatsApp, und die alten Adressen leiten auf die neuen Seiten um, damit Google nichts verliert." },
    ],
    text: [],
    photos: [],
  },
  beforeAfter: {
    title: "Vorher und nachher",
    statement: "Derselbe Satz, eine neue Website",
    text: "Der Leitsatz der Kanzlei ist geblieben: „Wir verhelfen Ihnen zu Ihrem Recht.“ Alles andere ist neu: eine eigene Seite je Rechtsgebiet, jede Seite auf Deutsch und Türkisch, Anfrage per Formular und WhatsApp.",
    before: { img: `${G}/site-old.webp`, alt: "Die frühere Website der Rechtsanwaltskanzlei Gören", label: "Vorher", note: "Die alte Website, bis zum Umzug am 23. November 2026", url: "kanzlei-goeren.de" },
    after: { img: `${G}/site-de.webp`, alt: "Die neue Startseite von kanzlei-goeren.de", label: "Nachher", note: "Die neue Website, online seit 23. November 2026", url: "kanzlei-goeren.de" },
  },
  firstDays: {
    title: "Die ersten 48 Stunden",
    intro: "Kleine Zahlen, aber jede ist echt. Und sie zeigen, wofür die Website gebaut ist: Mandanten, die auf Türkisch suchen und schreiben.",
    splits: [
      { title: "In welcher Sprache", parts: [{ label: "Türkisch", value: 2 }, { label: "Deutsch", value: 1 }] },
      { title: "Über welchen Weg", parts: [{ label: "Kontaktformular", value: 2 }, { label: "WhatsApp-Formular", value: 1 }] },
      { title: "Zu welchem Rechtsgebiet", parts: [{ label: "Ausländerrecht", value: 2 }, { label: "Familienrecht", value: 1 }] },
    ],
    tiles: [
      { value: "6", label: "Klicks auf den WhatsApp-Knopf", sub: "4 davon auf türkischen Seiten" },
      { value: "Google", label: "So hat eine Anfrage die Kanzlei gefunden", sub: "Eigene Angabe im WhatsApp-Formular: „Google araması“" },
    ],
    source: "Quelle: Anfrage- und Klick-Protokoll der Website (ohne Cookies), 23. und 24. November 2026, Testeingänge ausgenommen. Rechtsgebiet: wie im Formular ausgewählt.",
  },
  launch: {
    title: "Der Start",
    intro: "Vom Einrichten der Messung bis zu den ersten Anfragen in sechs Tagen.",
    items: [
      { date: "18. Nov.", title: "Messung eingerichtet", text: "Google Analytics hinter dem Cookie-Banner, dazu ein cookiefreies Protokoll für jede Anfrage und jeden Klick auf Telefon, E-Mail und WhatsApp." },
      { date: "23. Nov.", title: "Die Website ist online", text: "Domain umgezogen, Website live, Google Search Console verifiziert und die Sitemap mit 30 Seiten eingereicht." },
      { date: "24. Nov.", title: "Die ersten drei Anfragen", text: "Zwei auf Türkisch, eine auf Deutsch, per Formular und WhatsApp." },
      { date: "25. Nov.", title: "Alte Adressen umgeleitet", text: "Die Seiten der alten Website führen jetzt auf die passenden neuen Seiten, damit ihre Plätze bei Google erhalten bleiben." },
    ],
  },
  partner: {
    kicker: "Kooperation",
    title: "Zwei Kanzleien, beide mit Website von uns.",
    text: "Für alles, was türkischem Recht unterliegt, arbeitet die Kanzlei mit der Doğru Kanzlei in Mannheim zusammen. Beide Websites nennen sich gegenseitig als Partner, auf Deutsch und auf Türkisch.",
    img: "/assets/v2/mockups/hasan.webp",
    alt: "Website der Kanzlei Doğru auf Laptop und Smartphone",
    logo: "/assets/v2/referenzen/dogru/logo.png",
    logoAlt: "Doğru Kanzlei",
    href: "/referenzen/dogru",
    cta: "Referenz Kanzlei Doğru",
  },
  numbers: { hide: true, title: "", intro: "", source: "" },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, SEO und laufende Pflege, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Neu gebaut, jede Seite auf Deutsch und Türkisch", "Eine Seite je Rechtsgebiet", "Fürs Handy gebaut"] },
      { title: "Anfragen", icon: "form", points: ["Anfrageformular mit Auswahl des Rechtsgebiets", "WhatsApp-Knopf mit kurzem Formular davor", "Jede Anfrage kommt sofort per E-Mail an"] },
      { title: "SEO", icon: "report", points: ["Sprachversionen für Google sauber verknüpft", "Strukturierte Daten für Kanzlei und Artikel", "Alte Adressen leiten auf die neuen Seiten um", "Search Console und Sitemap eingerichtet"] },
      { title: "Ratgeber", icon: "blog", points: ["Artikel zu Erbfall, Einbürgerung, Mietminderung, Kündigung und Scheidung mit Türkei-Bezug", "Auf Deutsch und Türkisch"] },
    ],
  },
};

export default function GoerenReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
