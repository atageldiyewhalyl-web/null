import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/so: case study.
 * Client: S&O Beauty Salon, Q1 7, Mannheim (laser hair removal with Soprano ICE Platinum, AquaFacial, microneedling,
 *  lash lifting, skin care). nüll. did the complete setup (vault brief + Angebot 2026-07-21): logo and design line, website,
 *  Google Business Profile, initial Meta/Google Ads setup, local SEO basics, flyers and business cards; now monthly retainer.
 * Site: beautyso.de (repo ~/Documents/so-beauty-salon, Next.js, from 29 Sep 2026): home, 5 treatment pages, 6 guide articles.
 * Meta (ad account 2169520714447143), read-only on 11 Nov 2026, lifetime 4 Aug–11 Nov 2026: impressions 146,661; reach 67,022;
 *  3-second video plays 24,235; clicks (all) 6,007; link clicks 2,909; CTR 4.10 %; ThruPlays 9,410; current campaign CTR 5.47 %.
 *  Monthly clicks: Aug 330, Sep 2,052, Oct 3,069. Spend left out on purpose. Bookings run over WhatsApp and are not counted
 *  in this ad account (the August review found no recorded leads), so the page shows reach and clicks, not leads.
 * Client rules (clients.json): no prices and no fake reviews in anything client-facing: no ad creatives (they show prices),
 *  the price page is not captured, no quote. Salon photos: the client's own (vault 07-Assets/Salon pics).
 */

export function meta() {
  return [
    { title: "Referenz S&O Beauty Salon: ein neuer Salon, von Anfang an sichtbar | nüll." },
    { name: "description", content: "Wie der S&O Beauty Salon in Mannheim alles aus einer Hand bekam: Logo, Website, Google-Profil, Flyer und Anzeigen auf Facebook und Instagram mit 4,1 % Klickrate." },
  ];
}

const O = "/assets/v2/referenzen/so";
const SITE = "https://www.beautyso.de";
const SALON = Array.from({ length: 19 }, (_, i) => `${O}/salon/s${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "S&O Beauty Salon",
  theme: { ink: "#2d1a20", accent: "#8f3a4d", soft: "#fdf0ea", bright: "#feafc9" },
  logo: { light: `${O}/logo.png`, dark: `${O}/logo.png`, alt: "S&O Beauty Salon, Mannheim", square: true },
  eyebrow: "Referenz · Laser und Hautpflege in Mannheim",
  title: "Ein neuer Salon, von Anfang an sichtbar.",
  headline: { value: 6007, unit: "Klicks", caption: "Klicks auf die Anzeigen seit August", statement: "Ein neuer Salon, von Anfang an sichtbar" },
  browser: {
    scroll: `${O}/site-home-scroll.webp`,
    url: "beautyso.de",
    alt: "Die Startseite von beautyso.de",
    phone: `${O}/site-m-home.webp`,
    phoneAlt: "Die Startseite des S&O Beauty Salons auf dem Handy",
  },
  intro: "Ein Kosmetiksalon mitten in den Mannheimer Quadraten. Von uns kam alles aus einer Hand: Logo, Website, Google-Profil, Flyer und Anzeigen auf Facebook und Instagram.",
  services: ["Marke", "Website", "Google-Profil", "Meta Ads", "Print"],
  stats: [
    { value: "4,1 %", label: "Klickrate der Anzeigen auf Facebook und Instagram", star: true },
    { value: "67.022", label: "erreichte Konten im Raum Mannheim", star: true },
    { value: "5", label: "Behandlungen, jede mit eigener Seite" },
    { value: "6", label: "Ratgeber-Artikel zu Laser und Hautpflege" },
  ],
  starNote: "Werbekonto auf Facebook und Instagram, alle Kampagnen vom 4. August bis 11. November 2026.",
  catalog: {
    title: "Der Auftritt",
    statement: "Alles neu, aus einer Hand",
    products: SALON,
    count: 5,
    countLabel: "Behandlungen: Laser, AquaFacial, Microneedling, Wimpernlifting, Hautpflege",
    features: ["Logo und Design-Linie", "Website mit 5 Behandlungen", "6 Ratgeber-Artikel", "Google-Unternehmensprofil", "Flyer und Visitenkarten", "Termin per WhatsApp"],
    pages: [
      { img: `${O}/site-home.webp`, title: "Startseite", text: "Laser und Hautpflege in Mannheim: persönlich beraten, Termin direkt per WhatsApp.", url: `${SITE}/` },
      { img: `${O}/site-laser.webp`, title: "Laser-Haarentfernung", text: "Die wichtigste Behandlung, mit Ablauf und der Technik dahinter.", url: `${SITE}/behandlungen/laser-haarentfernung` },
      { img: `${O}/site-aquafacial.webp`, title: "AquaFacial", text: "Jede Behandlung mit eigener Seite, eigenem Video und Termin-Knopf.", url: `${SITE}/behandlungen/aquafacial` },
      { img: `${O}/site-microneedling.webp`, title: "Microneedling", text: "Verständlich erklärt, für wen es passt und wie es abläuft.", url: `${SITE}/behandlungen/microneedling` },
      { img: `${O}/site-ratgeber.webp`, title: "Ratgeber", text: "Antworten auf die Fragen vor dem ersten Termin, ruhig und konkret.", url: `${SITE}/ratgeber` },
      { img: `${O}/site-artikel.webp`, title: "AquaFacial oder Microneedling?", text: "Ein Ratgeber-Artikel, der bei der Wahl der Behandlung hilft.", url: `${SITE}/ratgeber/aquafacial-oder-microneedling` },
    ],
  },
  task: {
    title: "Der Auftritt",
    columns: [
      { title: "Ausgangslage", text: "Ein Kosmetiksalon in den Mannheimer Quadraten, mit einem modernen Diodenlaser und einem klaren Angebot: Laser, AquaFacial, Microneedling, Wimpern und Hautpflege. Was fehlte, war der Auftritt: Logo, Website, Google-Profil und ein Weg zu neuen Kundinnen und Kunden." },
      { title: "Unser Ansatz", text: "Alles aus einer Hand: Logo und Design-Linie, eine Website mit einer Seite pro Behandlung, das Google-Profil, Flyer und Visitenkarten. Dazu Anzeigen auf Facebook und Instagram, die laufend neue Motive testen." },
    ],
    text: [],
    photos: [],
  },
  numbers: {
    title: "Die Anzeigen",
    intro: "Ergebnisse auf Facebook und Instagram, gemessen im Werbekonto. Ausgaben bleiben beim Salon.",
    meta: {
      funnelTitle: "Von der Einblendung zum Klick",
      funnel: [
        { label: "Einblendungen", value: 146661 },
        { label: "Erreichte Konten", value: 67022 },
        { label: "Videoaufrufe ab 3 Sekunden", value: 24235 },
        { label: "Klicks", value: 6007 },
        { label: "Klicks auf den Link", value: 2909 },
      ],
      rate: { title: "Klickrate", value: "4,1 %", text: "Etwa jede 25. Einblendung wurde angeklickt, über alle Kampagnen seit August." },
      tiles: [
        { value: "9×", label: "so viele Klicks im Oktober wie im August", sub: "Mit neuen Motiven und Kampagnen ab September" },
        { value: "5,5 %", label: "Klickrate der laufenden Kampagne", sub: "Motiv-Test seit Oktober 2026" },
        { value: "9.410", label: "Mal 15 Sekunden oder länger geschaut", sub: "Oder das Video bis zum Ende" },
      ],
    },
    source: "Quelle: Werbekonto auf Facebook und Instagram, alle Kampagnen vom 4. August bis 11. November 2026. Klicks zählen alle Klicks auf eine Anzeige, Klicks auf den Link nur die zur Website. Termine laufen per WhatsApp und werden in diesem Konto nicht mitgezählt.",
  },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Marke, Website, Google und Anzeigen, alles aus einer Hand.",
    groups: [
      { title: "Marke & Print", icon: "image", points: ["Logo und Design-Linie", "Flyer und Visitenkarten", "Titelbild für Facebook"] },
      { title: "Website", icon: "web", points: ["Neu gebaut, mit einer Seite pro Behandlung", "6 Ratgeber-Artikel zu Laser und Hautpflege", "Termin per WhatsApp mit einem Klick", "Echte Google-Bewertungen auf der Seite"] },
      { title: "Google-Profil", logos: ["/assets/v2/brands/google-maps.svg"], points: ["Unternehmensprofil eingerichtet", "Lokale Grundlagen für Mannheim"] },
      { title: "Facebook & Instagram", logos: ["/assets/v2/brands/instagram.svg", "/assets/v2/brands/facebook.svg"], points: ["Instagram-Auftritt eingerichtet", "Kampagnen für Laser, AquaFacial, Microneedling und Hautpflege", "Laufend neue Motive im Test"] },
    ],
  },
};

export default function SoReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
