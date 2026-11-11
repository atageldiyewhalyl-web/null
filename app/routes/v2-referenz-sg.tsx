import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/sg: case study.
 * Client: SG Laserzentrum GmbH & Co. KG (formerly SinemgizemBeauty GbR), dauerhafte Haarentfernung, 8 studios.
 * Site: sg-laserzentrum.de, rebuilt by nüll. in Next.js (repo ~/Documents/sg-laserzentrum, started 16 Sep 2026,
 *  live in October, domain moved with old URLs kept on 27 Oct 2026). Sitemap: home, 8 studio pages, 6 guides, franchise.
 * Figures (30,000+ treatments, 1,200+ Google reviews across all studios, 8 studios, NiSV, founded 2022) are the client's own,
 *  from lib/site.ts FACTS ("figures the client asked to feature"), marked as such on the page.
 * Old site (IONOS builder, placeholder link in the footer, no studio pages, no guides): vault onboarding audit, 9 Sep 2026.
 * No traffic numbers: SG has no Search Console or GA4 in the reports registry, and the new domain only switched on 27 Oct.
 * Client rule: no prices in our copy (the live site's own hero shows one; it appears only inside the captures).
 * Photos in the wall: the client's own studio photos used on their site. Quote: written with consent (CasesV2), sign-off pending.
 */

export function meta() {
  return [
    { title: "Referenz SG Laserzentrum: acht Studios, ein Auftritt | nüll." },
    { name: "description", content: "Wie SG Laserzentrum eine neue Website für acht Studios bekam: jedes Studio mit eigener Seite, Team und Online-Buchung, dazu Ratgeber und eine Seite für Franchise und Karriere." },
  ];
}

const S = "/assets/v2/referenzen/sg";
const SITE = "https://sg-laserzentrum.de";
const STUDIO = Array.from({ length: 19 }, (_, i) => `${S}/studio/s${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "SG Laserzentrum",
  theme: { ink: "#1a1816", accent: "#8c6d3a", soft: "#f3ece2", bright: "#f1b8cf" },
  logo: { light: `${S}/logo.png`, dark: `${S}/logo.png`, alt: "SG Laserzentrum", square: true },
  eyebrow: "Referenz · Dauerhafte Haarentfernung an acht Standorten",
  title: "Acht Studios, ein Auftritt.",
  headline: { value: 8, unit: "Studios", caption: "Studios, jedes mit eigener Seite und Online-Buchung", statement: "Acht Studios, ein Auftritt" },
  browser: {
    scroll: `${S}/site-home-scroll.webp`,
    url: "sg-laserzentrum.de",
    alt: "Die Startseite von sg-laserzentrum.de",
    phone: `${S}/site-m-home.webp`,
    phoneAlt: "Die Startseite von SG Laserzentrum auf dem Handy",
  },
  intro: "SG Laserzentrum ist auf dauerhafte Haarentfernung spezialisiert, mit Studios von Bielefeld bis Nürnberg. Wir haben die Website neu gebaut: ein Auftritt für die Marke, und jedes Studio mit eigener Seite, eigenem Team und direkter Online-Buchung.",
  services: ["Website", "Studioseiten", "Online-Buchung", "Ratgeber", "Franchise"],
  stats: [
    { value: "30.000+", label: "Behandlungen seit 2022", star: true },
    { value: "1.200+", label: "Google-Bewertungen über alle Studios", star: true },
    { value: "100 %", label: "spezialisiert auf dauerhafte Haarentfernung" },
    { value: "NiSV", label: "zertifiziertes Fachpersonal" },
  ],
  starNote: "Angaben von SG Laserzentrum, Stand November 2026.",
  catalog: {
    title: "Die Website",
    statement: "Ein Auftritt, acht Studios",
    products: STUDIO,
    count: 8,
    countLabel: "Studios: Bielefeld, Frankfurt, Karlsruhe, Köln, Mainz, Mannheim, Nürnberg, Stuttgart",
    features: ["Eigene Seite pro Studio", "Team pro Studio", "Online-Buchung je Studio", "Kostenlose Probebehandlung", "6 Ratgeber-Artikel", "Franchise & Karriere"],
    pages: [
      { img: `${S}/site-home.webp`, title: "Startseite", text: "Dauerhafte Haarentfernung mit Gefühl für die Haut: Studio wählen und Termin buchen.", url: `${SITE}/` },
      { img: `${S}/site-standorte.webp`, title: "Unsere Studios", text: "Alle acht Studios auf einen Blick, das nächste ist schon in Planung.", url: `${SITE}/standorte` },
      { img: `${S}/site-mannheim.webp`, title: "Studio Mannheim", text: "Jedes Studio mit Adresse, Team, Bildern und Online-Buchung.", url: `${SITE}/standorte/mannheim` },
      { img: `${S}/site-koeln.webp`, title: "Studio Köln", text: "Ein neues Studio bekommt seine Seite sofort, hier Köln.", url: `${SITE}/standorte/koeln` },
      { img: `${S}/site-ratgeber.webp`, title: "Ratgeber", text: "Wie viele Sitzungen braucht es? Antworten auf die Fragen vor der ersten Behandlung.", url: `${SITE}/ratgeber/wie-viele-sitzungen-laser-haarentfernung` },
      { img: `${S}/site-franchise.webp`, title: "Franchise & Karriere", text: "Für alle, die ein eigenes SG Laserzentrum eröffnen oder im Team arbeiten möchten.", url: `${SITE}/franchise-karriere` },
    ],
  },
  task: {
    title: "Die Website",
    columns: [
      { title: "Ausgangslage", text: "Seit 2022 ist SG Laserzentrum auf acht Studios gewachsen. Die alte Website lief auf einem Baukasten: dünne Seiten, ein Platzhalter im Footer, keine eigenen Seiten für die Studios und keine Ratgeber." },
      { title: "Unser Ansatz", text: "Eine neue Website für die Marke und jedes Studio: eigene Seite mit Team, Bildern und direkter Online-Buchung, Ratgeber zu den häufigsten Fragen und eine eigene Seite für Franchise und Karriere." },
    ],
    text: [],
    photos: [],
  },
  numbers: { hide: true, title: "", intro: "", source: "" },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Studioseiten, Ratgeber und der Umzug auf die neue Domain, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Neu gebaut, live seit Oktober 2026", "Ruhiges Design in den Farben der Marke", "Kostenlose Probebehandlung immer im Blick", "Schnell und fürs Handy gebaut"] },
      { title: "Studioseiten", icon: "image", points: ["Eine Seite für jedes der acht Studios", "Team, Bilder und Adresse pro Studio", "Online-Termin direkt im richtigen Studio", "Link zu den Google-Bewertungen je Studio"] },
      { title: "Ratgeber", icon: "blog", points: ["Sitzungen, Schmerzen, Hauttyp, Laser oder IPL", "Vor- und Nachsorge verständlich erklärt"] },
      { title: "Domain & Technik", icon: "report", points: ["Alte Adressen auf die neuen Seiten umgeleitet", "Datenschutz-Einstellungen sauber eingebaut", "Franchise- und Karriere-Seite für Bewerbungen"] },
    ],
  },
  quote: { text: "Die Website ist genau so ästhetisch, wie ich sie mir vorgestellt habe. Und meine Ideen waren schneller umgesetzt, als ich gedacht hätte.", who: "Inhaberin, SG Laserzentrum" },
};

export default function SgReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
