import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/by: case study.
 * Client: Besir Yaman (B.Y. Consulting), Heidelberg: mentor for financial and insurance brokers, lawyer (LL.M.) and tax expert.
 * nüll. built brand identity, positioning and website from scratch (null-content brief: no website and no online presence before).
 * Site: besiryaman-mentoring.de: one long page + 3 blog articles (sitemap, 11 Nov 2026).
 * "50+ brokers" is the client's own claim on his site, marked as such. No traffic numbers (no Search Console or GA4 access).
 * Quote: written with the owner's consent (CasesV2), sign-off pending; credited to the firm.
 */

export function meta() {
  return [
    { title: "Referenz B.Y. Consulting: ein Mentor, eine klare Marke | nüll." },
    { name: "description", content: "Wie Besir Yaman, Mentor für Versicherungsvermittler in Heidelberg, eine Marke und Website von Grund auf bekam." },
  ];
}

const Y = "/assets/v2/referenzen/by";
const SITE = "https://www.besiryaman-mentoring.de";
const SLICES = Array.from({ length: 14 }, (_, i) => `${Y}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "B.Y. Consulting",
  theme: { ink: "#1f2a33", accent: "#47792b", soft: "#f1f4ef", bright: "#8bd36b" },
  logo: { light: `${Y}/logo.png`, dark: `${Y}/logo.png`, alt: "B.Y. Consulting, Besir Yaman", square: true },
  eyebrow: "Referenz · Mentoring für Versicherungsvermittler in Heidelberg",
  title: "Ein Mentor, eine klare Marke.",
  headline: { value: 3, unit: "Artikel", caption: "Ratgeber-Artikel zum Weg in die Unabhängigkeit", statement: "Ein Mentor, eine klare Marke" },
  browser: {
    scroll: `${Y}/site-home-scroll.webp`,
    url: "besiryaman-mentoring.de",
    alt: "Die Website von Besir Yaman",
    phone: `${Y}/site-m-home.webp`,
    phoneAlt: "Die Website von Besir Yaman auf dem Handy",
  },
  intro: "Besir Yaman begleitet erfahrene Versicherungsvermittler in die Unabhängigkeit. Online gab es ihn nicht. Wir haben Marke, Positionierung und Website von Grund auf gebaut.",
  services: ["Marke", "Positionierung", "Website", "Ratgeber"],
  stats: [
    { value: "Neu", label: "Logo, Marke und Website von Grund auf" },
    { value: "50+", label: "Vermittler bereits begleitet", star: true },
    { value: "1 Seite", label: "die alles erzählt, vom Profil bis zum Gespräch" },
    { value: "1 Klick", label: "zum Kennenlerngespräch" },
  ],
  starNote: "Angabe von Besir Yaman auf seiner Website, Stand November 2026.",
  catalog: {
    title: "Der Auftritt",
    statement: "Eine Seite, die überzeugt",
    products: SLICES,
    wallWide: true,
    count: 3,
    countLabel: "Ratgeber-Artikel, dazu eine Seite mit allem, was zählt",
    features: ["Logo und Marke neu", "Klare Positionierung als Mentor", "Eine Seite, eine Botschaft", "3 Ratgeber-Artikel", "Kennenlerngespräch mit einem Klick", "Fürs Handy gebaut"],
    pages: [
      { img: `${Y}/site-home.webp`, title: "Startseite", text: "Mentor für Finanz- und Versicherungsvermittler, Jurist und Steuerexperte: alles auf einen Blick.", url: `${SITE}/` },
      { img: `${Y}/site-blog1.webp`, title: "Warum wechseln?", text: "Warum erfahrene Versicherungsvermittler in die Unabhängigkeit wechseln.", url: `${SITE}/blog/warum-vermittler-unabhaengig-werden.html` },
      { img: `${Y}/site-blog2.webp`, title: "Akquise", text: "Steuerseminare als Werkzeug: Kunden, die von selbst kommen.", url: `${SITE}/blog/steuerseminare-als-akquise-werkzeug.html` },
      { img: `${Y}/site-blog3.webp`, title: "Vom Vermittler zum Unternehmer", text: "Die vier Phasen des Übergangs, aus eigener Erfahrung.", url: `${SITE}/blog/vom-vermittler-zum-unternehmer.html` },
    ],
  },
  task: {
    title: "Der Auftritt",
    columns: [
      { title: "Ausgangslage", text: "Besir Yaman ist Jurist und Steuerexperte und hat den Übergang in die Unabhängigkeit selbst gemacht. Seine Erfahrung kannten nur die, die ihn persönlich trafen: Website und Marke gab es nicht." },
      { title: "Unser Ansatz", text: "Eine Marke von Grund auf: Logo, Farben und eine klare Positionierung als Mentor. Dazu eine Website, die auf einer Seite erzählt, was er bietet, und direkt zum Kennenlerngespräch führt." },
    ],
    text: [],
    photos: [],
  },
  numbers: { hide: true, title: "", intro: "", source: "" },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Marke, Positionierung und Website, alles aus einer Hand.",
    groups: [
      { title: "Marke", icon: "image", points: ["Logo mit Initialen und Waage", "Farben und Schrift", "Positionierung als Mentor"] },
      { title: "Website", icon: "web", points: ["Eine Seite mit klarer Botschaft", "Kennenlerngespräch mit einem Klick", "WhatsApp immer erreichbar", "Fürs Handy gebaut"] },
      { title: "Ratgeber", icon: "blog", points: ["3 Artikel für wechselwillige Vermittler", "Unabhängigkeit, Akquise, Unternehmertum"] },
    ],
  },
  quote: { text: "nüll hat unsere Positionierung geschärft und daraus eine Website gebaut, die Vertrauen aufbaut, bevor das erste Gespräch beginnt.", who: "B.Y. Consulting, Heidelberg" },
};

export default function ByReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
