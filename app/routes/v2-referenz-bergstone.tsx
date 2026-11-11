import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/bergstone: case study.
 * Client: Bergstone Keramiksan GmbH, Ludwigshafen (tiles, ceramic and quartz worktops, kitchens). Site: www.keramiksan.de.
 * Website facts from the site's repo (~/Documents/Bergstone Keramiksan): lib/tiles.ts holds 54 tiles + 96 worktops = 150 products,
 *  each with its own page (/fliesen/[tile]); 4 PDF catalogues (lib/site.ts); 3 service pages (lib/services.ts); 8 blog posts;
 *  German and English. 360° tour: 16 positions (lib/tour/rooms.ts), shown by our own WebGL viewer on the homepage; the panoramas
 *  come from the client's earlier hosted tour, so the page says "built in", not "photographed".
 * Page captures: live site, 11 Nov 2026 (consent banner hidden). Product photos: the site's own tile photos.
 * Reels: three filmed reels from the shared Drive folder "FINAL / Month 1" and seven finals from the vault (05-Social Media Content/Videos).
 * Meta numbers: ad account "Keramiksan" (508524831273271), all campaigns, lifetime = 13 Oct to 11 Nov 2026, read 11 Nov 2026:
 *  impressions 75,644; reach 36,757; 3-second video plays 17,074; clicks (all) 4,098; link clicks 2,979; CTR (all) 5.42 %;
 *  ThruPlays 3,377; best campaign CTR 10.52 % ("ENG | Messages | Fliesen | Mannheim 30mi | 2026-10").
 *  Spend, CPC and CPM are left out on purpose. Message conversations are not reported by the API, so no lead count.
 */

export function meta() {
  return [
    { title: "Referenz Bergstone Keramiksan: 150 Produktseiten, 360°-Rundgang und Reels | nüll." },
    { name: "description", content: "Wie Bergstone Keramiksan in Ludwigshafen eine neue Website mit 150 Produktseiten und 360°-Rundgang bekam, dazu Reels aus dem Showroom und Anzeigen auf Facebook und Instagram." },
  ];
}

const B = "/assets/v2/referenzen/bergstone";
const SITE = "https://www.keramiksan.de";
// 96 of the 150 product photos for the moving wall, spread evenly over tiles and worktops
const PRODUCTS = Array.from({ length: 96 }, (_, i) => `${B}/products/p${String(Math.floor((i * 150) / 96)).padStart(3, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Bergstone Keramiksan",
  theme: { ink: "#1d1b18", accent: "#85620f", soft: "#f6f3ee", bright: "#e8b030" },
  logo: { light: `${B}/logo.png`, dark: `${B}/logo.png`, alt: "Bergstone Keramiksan, Fliesen und Arbeitsplatten in Ludwigshafen" },
  eyebrow: "Referenz · Fliesen und Arbeitsplatten in Ludwigshafen",
  title: "Der ganze Showroom, jetzt auch online.",
  headline: { value: 150, unit: "Produkte", caption: "Produkte, jedes mit eigener Seite", statement: "Der ganze Showroom, jetzt auch online" },
  browser: {
    scroll: `${B}/site-fliesen-scroll.webp`,
    url: "keramiksan.de/fliesen",
    alt: "Die Fliesen-Übersicht auf keramiksan.de mit allen Fliesen und Arbeitsplatten",
    phone: `${B}/site-m-product.webp`,
    phoneAlt: "Produktseite Ashwin Black auf dem Handy",
  },
  intro: "Eine neue Website mit jeder Fliese und jeder Arbeitsplatte, ein 360°-Rundgang durch den Showroom, Reels aus dem Laden und Anzeigen auf Facebook und Instagram.",
  services: ["Website", "360°-Rundgang", "Reels", "Meta Ads", "Kataloge"],
  stats: [
    { value: "360°", label: "Rundgang durch den Showroom, 16 Standpunkte" },
    { value: "4", label: "Kataloge, online lesen oder herunterladen" },
    { value: "5,4 %", label: "Klickrate der Anzeigen auf Facebook und Instagram", star: true },
    { value: "17.000+", label: "Videoaufrufe in den Anzeigen", star: true },
  ],
  starNote: "Werbekonto auf Facebook und Instagram, alle Kampagnen vom 13. Oktober bis 11. November 2026.",
  catalog: {
    title: "Die Website",
    statement: "Jede Fliese und jede Arbeitsplatte mit eigener Seite",
    products: PRODUCTS,
    count: 150,
    countLabel: "Produkte online: 54 Fliesen und 96 Arbeitsplatten",
    features: ["Eigene Seite pro Produkt", "Filter nach Einsatz", "Anfrage per WhatsApp", "4 PDF-Kataloge", "Deutsch und Englisch", "360°-Rundgang"],
    pages: [
      { img: `${B}/site-home.webp`, title: "Startseite", text: "Fliesen kaufen, Arbeitsplatten montieren lassen: Beratung per WhatsApp und der 360°-Rundgang gleich oben.", url: `${SITE}/` },
      { img: `${B}/site-fliesen.webp`, title: "Fliesen und Arbeitsplatten", text: "Das ganze Sortiment, gefiltert nach Wand, Boden, Großformat und Arbeitsplatte.", url: `${SITE}/fliesen` },
      { img: `${B}/site-product.webp`, title: "Produktseite", text: "Format, Oberfläche, Optik und Einsatz, dazu die Anfrage per WhatsApp. Für alle 150 Produkte.", url: `${SITE}/fliesen/ashwin-black` },
      { img: `${B}/site-kataloge.webp`, title: "Kataloge", text: "Fliesen, Quarz, Dexstone und Pamesa als PDF, online lesen oder herunterladen.", url: `${SITE}/kataloge` },
      { img: `${B}/site-beratung.webp`, title: "Leistungen", text: "Eigene Seiten für Beratung im Showroom, Planung und Aufmaß und die Montage der Arbeitsplatten.", url: `${SITE}/beratung` },
      { img: `${B}/site-blog.webp`, title: "Ratgeber", text: "Artikel zu Formaten, Oberflächen und Materialien für Arbeitsplatten, aus der täglichen Beratung.", url: `${SITE}/blog` },
    ],
  },
  tour: {
    title: "360°-Rundgang",
    statement: "Durch den Showroom, ohne hinzufahren",
    text: "Den Rundgang haben wir direkt in die Startseite eingebaut, mit eigenem Viewer: Man geht von Standpunkt zu Standpunkt durch die Ausstellung in Ludwigshafen, auch auf dem Handy. Probier es hier aus.",
    facts: [
      { value: "16", label: "Standpunkte im Showroom" },
      { value: "1 Klick", label: "von der Startseite in den Rundgang" },
      { value: "0", label: "Plug-ins, läuft direkt im Browser" },
    ],
    rooms: [
      { name: "Küche & Theke", pano: `${B}/tour/node8.webp`, pan: -115.4 },
      { name: "Fliesengang", pano: `${B}/tour/node4.webp`, pan: 61.6 },
      { name: "Beratung", pano: `${B}/tour/node7.webp`, pan: 176.5 },
      { name: "Ausstellung", pano: `${B}/tour/node6.webp`, pan: 42.9 },
    ],
    url: `${SITE}/#360`,
    cta: "Ganzen Rundgang öffnen",
  },
  task: {
    title: "Die Website",
    columns: [
      { title: "Ausgangslage", text: "Ein Showroom voller Fliesen und Arbeitsplatten in Ludwigshafen, online aber kaum zu sehen: Die alte Seite lief noch unter dem früheren Namen Keramiksan, das Sortiment stand nur auf Fotos." },
      { title: "Unser Ansatz", text: "Wir haben das Sortiment Stück für Stück erfasst und die Website neu gebaut: 54 Fliesen und 96 Arbeitsplatten mit eigener Seite, Filter, Kataloge, Leistungsseiten und Anfrage per WhatsApp." },
    ],
    text: [],
    photos: [],
  },
  galleryFirst: true,
  // Reels: filmed in the showroom (Drive "FINAL / Month 1" + vault Videos), plus the offer reels from the vault.
  // The raw Drive "Vid#7 Tile Test" is left out: the vault's 2026-11-05 "Arbeitsplatte Test (Video 7)" is the edited version of the same take.
  // Concrete Light Mat is in Turkish; the vault index asks whether "no Beton" also rules out concrete-look tiles (see clients.json notes).
  gallery: {
    title: "Die Reels",
    text: "Gefilmt im Showroom in Ludwigshafen, mit dem Team vor der Kamera. Dazu Reels zu jedem Angebot, mit Preis und Weg zur Anfrage.",
    videosTitle: "Zehn Reels aus dem Showroom",
    photos: [
      { src: `${B}/reel-11.jpg`, video: `${B}/reel-11.mp4`, alt: "Reel: die Keramik-Arbeitsplatte im Kratz- und Hitzetest", label: "Der Arbeitsplatten-Test", text: "Schraubenzieher, Hitze, Kaffee: die Keramikplatte im Test, live im Showroom." },
      { src: `${B}/reel-1.jpg`, video: `${B}/reel-1.mp4`, alt: "Reel: Fliesen in der Ausstellung, mit Preis", label: "Preis an der Wand", text: "Durch die Ausstellung, Fliese für Fliese, mit dem Preis direkt dazu." },
      { src: `${B}/reel-5.jpg`, video: `${B}/reel-5.mp4`, alt: "Reel: Angebot der Woche, Emerace White", label: "Angebot der Woche", text: "Emerace White aus Spanien, vom Team vorgestellt, mit dem Wochenpreis." },
      { src: `${B}/reel-2.jpg`, video: `${B}/reel-2.mp4`, alt: "Reel: eine edle Küche mit Keramik", label: "Die edle Küche", text: "Warum Keramik: pflegeleicht und robust. Und der Katalog ist einen Klick entfernt." },
      { src: `${B}/reel-9.jpg`, video: `${B}/reel-9.mp4`, alt: "Reel: Quarz-Arbeitsplatten im Angebot", label: "Quarz im Angebot", text: "Quarz-Arbeitsplatten, erklärt am Tisch, mit dem Preis pro laufendem Meter." },
      { src: `${B}/reel-3.jpg`, video: `${B}/reel-3.mp4`, alt: "Reel: Großformate im Showroom und vor dem Laden", label: "Großformate", text: "Durch die großen Formate, drinnen im Showroom und draußen vor dem Laden." },
      { src: `${B}/reel-7.jpg`, video: `${B}/reel-7.mp4`, alt: "Reel: Keramik-Arbeitsplatten wie Imperio Armani und Taj Mahal", label: "Keramik-Arbeitsplatten", text: "Vier Platten, vom Team vorgestellt und in fertigen Küchen gezeigt." },
      { src: `${B}/reel-8.jpg`, video: `${B}/reel-8.mp4`, alt: "Reel: Fliesen in Marmor- und Natursteinoptik", label: "Fliesen ab 9,90 €", text: "Marmor- und Natursteinoptik, und wie die Anfrage per Instagram oder WhatsApp läuft." },
      { src: `${B}/reel-6.jpg`, video: `${B}/reel-6.mp4`, alt: "Reel: dieselbe Küche mit neuer Arbeitsplatte", label: "Neue Platte, neue Küche", text: "Vorher, Musterauswahl, nachher: von der Planung bis zum Einbau." },
      { src: `${B}/reel-10.jpg`, video: `${B}/reel-10.mp4`, alt: "Reel auf Türkisch: Concrete Light Mat in zwei Formaten", label: "Concrete Light Mat", text: "Auf Türkisch, für die türkischsprachige Kundschaft: zwei Formate, zwei Preise." },
    ],
  },
  numbers: {
    title: "Die Anzeigen",
    intro: "Ergebnisse auf Facebook und Instagram, gemessen im Werbekonto. Ausgaben und Kosten pro Klick bleiben beim Kunden.",
    meta: {
      funnelTitle: "Von der Einblendung zum Klick",
      funnel: [
        { label: "Einblendungen", value: 75644 },
        { label: "Erreichte Konten", value: 36757 },
        { label: "Videoaufrufe ab 3 Sekunden", value: 17074 },
        { label: "Klicks", value: 4098 },
        { label: "Klicks auf den Link", value: 2979 },
      ],
      rate: { title: "Klickrate", value: "5,4 %", text: "Mehr als jede 20. Einblendung wurde angeklickt, über alle Kampagnen seit Mitte Oktober." },
      tiles: [
        { value: "10,5 %", label: "Klickrate der besten Kampagne", sub: "Fliesen, Nachrichten über Instagram, Messenger und WhatsApp" },
        { value: "23 %", label: "der Einblendungen starten das Video", sub: "Mindestens 3 Sekunden angesehen" },
        { value: "3.377", label: "Mal 15 Sekunden oder länger geschaut", sub: "Oder das Video bis zum Ende" },
      ],
    },
    source: "Quelle: Werbekonto auf Facebook und Instagram, alle Kampagnen vom 13. Oktober bis 11. November 2026. Klicks zählen alle Klicks auf eine Anzeige, Klicks auf den Link nur die zum Ziel der Anzeige.",
  },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Rundgang, Reels und Anzeigen, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["150 Produktseiten: 54 Fliesen und 96 Arbeitsplatten", "Filter nach Wand, Boden, Großformat und Arbeitsplatte", "Anfrage per WhatsApp auf jeder Seite", "Auf Deutsch und Englisch"] },
      { title: "360°-Rundgang", icon: "image", points: ["16 Standpunkte, direkt auf der Startseite", "Eigener Viewer, schnell auch auf dem Handy", "Von Raum zu Raum durch die Ausstellung"] },
      { title: "Kataloge & Ratgeber", icon: "blog", points: ["Vier Kataloge als PDF: Fliesen, Quarz, Dexstone, Pamesa", "Ratgeber-Artikel zu Formaten, Oberflächen und Arbeitsplatten"] },
      { title: "Reels", icon: "video", points: ["Gefilmt im Showroom, mit dem Team vor der Kamera", "Schnitt, Untertitel und Musik fürs Hochformat", "Dazu animierte Reels für Angebote wie die Black Week"] },
      { title: "Facebook & Instagram", logos: ["/assets/v2/brands/instagram.svg", "/assets/v2/brands/facebook.svg"], points: ["Kampagnen für Fliesen und Arbeitsplatten rund um Mannheim und Ludwigshafen", "Ziel: Nachrichten über Instagram, Messenger und WhatsApp", "Videos und Motive laufend getestet"] },
    ],
  },
};

export default function BergstoneReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
