import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/waschbar: case study.
 * Every number: "2026-11 Waschbar Overall Report Google Ads and Meta Ads" (vault, 6 Nov 2026).
 *  Google Ads 6 Aug–5 Nov 2026: 2,491 direction requests, 387 store visits (Google estimate), 4,838 clicks, 93% mobile.
 *  Per month: Aug 45, Sep 870, Oct 1,462 directions. € per estimated visit: Sep 8.88, Oct 3.00.
 *  Heidelberg search (from 6 Aug): 520 directions, 124 visits. Ludwigshafen Performance Max (from 18 Sep): 1,971 directions, 262 visits.
 *  Top searches Heidelberg (clicks): waschsalon in meiner nähe 192, waschsalon heidelberg 180, waschsalon near me 48, laundry near me 47, waschsalon 34, waschbar heidelberg 33.
 *  Meta: 84,041 people reached in Heidelberg (video, from 20 Aug); 1,556 website visits for the opening at €0.26.
 *  Ad spend is deliberately not shown. Store photos and logo: client assets (vault 07-Assets). Quote: written with the owner's consent (see CasesV2), sign-off pending.
 */

export function meta() {
  return [
    { title: "Referenz Waschbar: 2.491 Routen zum Waschsalon | nüll." },
    { name: "description", content: "Wie Waschbar in Heidelberg und Ludwigshafen mit Google Ads, Google Maps und einer neuen Website 2.491 Routenanfragen in drei Monaten bekommen hat." },
  ];
}

const W = "/assets/v2/referenzen/waschbar";

const cfg: CaseConfig = {
  client: "Waschbar",
  theme: { ink: "#001850", accent: "#4890f8", soft: "#eef4ff" },
  logo: { light: `${W}/logo.png`, dark: `${W}/logo-dark.png`, alt: "Waschbar SB Waschsalon" },
  eyebrow: "Referenz · SB-Waschsalon in Heidelberg und Ludwigshafen",
  title: (
    <>
      2.491 Routen zur Waschbar<span style={{ color: "#4890f8" }}>.</span>
    </>
  ),
  intro: "Gesucht wird spontan, auf dem Handy, in der Nähe. Mit Google Ads, Google Maps und einer neuen Website steht Waschbar genau dort ganz oben.",
  services: ["Website", "Google Ads", "Google Maps", "Meta Ads", "SEO"],
  headline: { value: 2491, unit: "Routen zur Waschbar", caption: "Routenanfragen in 3 Monaten", statement: "Wer einen Waschsalon sucht, findet die Waschbar" },
  machine: { display: ["LU · 1.971", "HD · 520"] }, // route requests per place, from the report

  stats: [
    { value: "4.838", label: "Klicks auf die Anzeigen" },
    { value: "≈387", label: "Besuche im Laden", star: true },
    { value: "3,00 €", label: "pro Ladenbesuch im Oktober", star: true },
    { value: "93 %", label: "der Klicks vom Handy" },
  ],
  starNote: "Ladenbesuche sind eine Schätzung von Google auf Basis von Standortdaten, keine gezählten Besuche. Google Ads, 6. August bis 5. November 2026.",
  video: { prefix: `${W}/video`, title: "Die Geschichte in 30 Sekunden" },
  task: {
    title: "Die Aufgabe",
    statement: "Wer einen Waschsalon braucht, braucht ihn jetzt",
    columns: [
      { title: "Ausgangslage", text: "Zwei SB-Waschsalons, in Heidelberg und neu in Ludwigshafen. Kaum jemand plant einen Besuch im Waschsalon: Die Maschine ist kaputt, die Bettwäsche zu groß, und es muss heute sein." },
      { title: "Unser Ansatz", text: "Waschbar dort zeigen, wo genau dann gesucht wird: in der Google-Suche, auf Google Maps und auf einer Website, die in Sekunden Preise, Zeiten und den Weg zeigt." },
    ],
    // moments and facts from waschbar.eu (15-kg machines, sportswear, pet items, 29-minute badge); searches and clicks from the Heidelberg search terms in the report
    moments: [
      { img: `${W}/m-bedding.webp`, alt: "Bettdecken, Kissen und Handtücher vor blauem Hintergrund", title: "Die Daunendecke passt nicht in die eigene Maschine", fact: "Maschinen bis 15 kg", search: "waschsalon in meiner nähe", clicks: 192 },
      { img: `${W}/m-cleaning.webp`, alt: "Putztücher, Mopp und Reinigungsmittel vor blauem Hintergrund", title: "Putztücher und Mopps, kiloweise", fact: "Waschen und Trocknen vor Ort", search: "waschsalon heidelberg", clicks: 180 },
      { img: `${W}/m-pets.webp`, alt: "Hundebett und Decken mit Pfotenmuster vor blauem Hintergrund", title: "Die Decke vom Hund, aber nicht in der eigenen Maschine", fact: "Sachen für Haustiere", search: "laundry near me", clicks: 47 },
      { img: `${W}/m-students.webp`, alt: "Voller Wäschekorb vor blauem Hintergrund", title: "Die erste Wohnung, noch ohne Waschmaschine", fact: "SB-Waschsalon, ohne Termin", search: "waschsalon near me", clicks: 48 },
    ],
    momentsNote: "Suchbegriffe und Klicks: echte Suchen aus den Google-Anzeigen für Heidelberg, 6. Aug. bis 5. Nov. 2026.",
    badge: { src: `${W}/badge-29.webp`, alt: "In nur 29 min zur sauberen Wäsche", text: "Und dann muss es schnell gehen: bei Waschbar in nur 29 Minuten zur sauberen Wäsche." },
    text: [],
    photos: [],
  },
  numbers: {
    title: "Die Zahlen",
    intro: "Aus unserem Gesamtbericht an Waschbar. Gemessen in Google Ads und Meta Ads, nicht geschätzt, außer wo es dasteht.",
    monthsTitle: "Routenanfragen aus Google-Anzeigen pro Monat",
    months: [
      { label: "August", value: 45 },
      { label: "September", value: 870 },
      { label: "Oktober", value: 1462 },
    ],
    drop: {
      from: "8,88 €",
      fromLabel: "im September",
      to: "3,00 €",
      toLabel: "im Oktober",
      text: "Seit dem 18. September läuft Ludwigshafen auf Google Maps. Damit wurde jeder Besuch im Laden fast dreimal günstiger.",
    },
    places: [
      { name: "Ludwigshafen", how: "Anzeigen vor allem auf Google Maps", since: "18. Sep.", a: "1.971", aLabel: "Routen", b: "≈ 262", bLabel: "Ladenbesuche*" },
      { name: "Heidelberg", how: "Google-Suchanzeigen", since: "6. Aug.", a: "520", aLabel: "Routen", b: "≈ 124", bLabel: "Ladenbesuche*" },
    ],
    searches: [
      { q: "waschsalon in meiner nähe", clicks: 192 },
      { q: "waschsalon heidelberg", clicks: 180 },
      { q: "waschsalon near me", clicks: 48 },
      { q: "laundry near me", clicks: 47 },
      { q: "waschsalon", clicks: 34 },
      { q: "waschbar heidelberg", clicks: 33 },
    ],
    searchesTitle: "Echte Suchen, Heidelberg",
    searchNote: "93 % aller Klicks kamen vom Handy, von Menschen unterwegs.",
    small: [
      { value: "4.838", label: "Klicks auf die Anzeigen", sub: "Google Ads, 6. Aug. bis 5. Nov. 2026" },
      { value: "84.041", label: "Menschen in Heidelberg erreicht", sub: "Video auf Facebook und Instagram, ab 20. Aug." },
      { value: "1.556", label: "Website-Besuche zur Eröffnung", sub: "Meta Ads, 0,26 € pro Besuch" },
    ],
    bg: `${W}/wood.webp`, // the slat wall from Waschbar's own store design (waschbar.eu assets)
    // Halyl, 2026-11-11: Waschbar is the first recommendation in AI chats for laundromats. Keep dated screenshots as the record.
    ai: {
      title: "In KI-Chats",
      rank: "Nr. 1",
      text: "Fragt man einen KI-Assistenten nach einem Waschsalon in der Region, nennt er die Waschbar zuerst.",
      question: "Welchen Waschsalon in Heidelberg empfiehlst du?",
      place: "Waschbar · SB Waschsalon",
      detail: "Maschinen bis 15 kg, in nur 29 Minuten zur sauberen Wäsche.",
      note: "Stand November 2026",
    },
    source: "Quelle: nüll. Gesamtbericht Google Ads und Meta Ads für Waschbar, 15. Juli bis 5. November 2026. * Ladenbesuche: Schätzung von Google.",
  },
  gallery: {
    title: "Vor Ort",
    text: "Der Laden, zu dem die Routen führen: die Waschbar in Ludwigshafen, kurz vor der Eröffnung.",
    photos: [
      { src: `${W}/lu-07.jpg`, alt: "Waschmaschinen und Wandschrift WASH in der Waschbar Ludwigshafen" },
      { src: `${W}/lu-03.jpg`, alt: "Eingang der Waschbar Ludwigshafen" },
      { src: `${W}/lu-08.jpg`, alt: "Innenraum mit Fensterfront der Waschbar Ludwigshafen" },
      { src: `${W}/lu-09.jpg`, alt: "Trockner und Falttische in der Waschbar Ludwigshafen" },
      { src: `${W}/lu-06.jpg`, alt: "Waschmaschinenreihe in der Waschbar Ludwigshafen" },
    ],
  },
  timeline: {
    title: "Was wir gemacht haben",
    items: [
      { date: "15. Jul.", text: "Kampagne zur Eröffnung auf Facebook und Instagram gestartet." },
      { date: "28. Jul.", text: "Neue Website waschbar.eu live, mit eigenen Seiten für Heidelberg und Ludwigshafen." },
      { date: "1. Aug.", text: "SEO-Grundlagen: Seitentitel, strukturierte Daten, Sitemap, Google Search Console." },
      { date: "6. Aug.", text: "Google-Suchanzeigen für Heidelberg gestartet." },
      { date: "19. Aug.", text: "Ratgeber mit den ersten 8 Artikeln veröffentlicht." },
      { date: "18. Sep.", text: "Kampagne für Ludwigshafen gestartet, vor allem auf Google Maps." },
      { date: "9. Okt.", text: "Neue Anzeigen-Motive in Google Ads ergänzt." },
      { date: "24. Okt.", text: "21 weitere Ratgeber-Artikel veröffentlicht." },
    ],
  },
  // what we did (Halyl, 2026-11-11, plus the overall report): grouped, no dates
  work: {
    title: "Was wir gemacht haben",
    intro: "Alles aus einer Hand: von der Website über die Google-Profile bis zu den Anzeigen, die Menschen vor die Tür bringen.",
    groups: [
      { title: "Website", icon: "web", points: ["waschbar.eu gebaut, mit eigenen Seiten für Heidelberg und Ludwigshafen", "Preise, Öffnungszeiten und der Weg zum Laden auf einen Blick", "SEO-Grundlagen: Seitentitel, strukturierte Daten, Sitemap, Search Console"] },
      { title: "Google-Unternehmensprofile", logos: ["/assets/v2/brands/google-maps.svg"], points: ["Profile für beide Standorte eröffnet und eingerichtet", "Fotos vom Laden hochgeladen", "Angaben zu Leistungen und Öffnungszeiten gepflegt"] },
      { title: "Ratgeber", icon: "blog", points: ["29 Artikel zu Fragen rund ums Waschen veröffentlicht", "Zum Beispiel, wie viel Wäsche in eine 7- oder 15-kg-Trommel passt"] },
      { title: "Google Ads", logos: ["/assets/v2/brands/google-ads.svg"], points: ["Werbekonto eingerichtet", "Suchanzeigen für Heidelberg, Kampagne auf Google Maps für Ludwigshafen", "Anzeigen und Suchbegriffe laufend optimiert, neue Motive ergänzt"] },
      { title: "Facebook & Instagram", logos: ["/assets/v2/brands/instagram.svg", "/assets/v2/brands/facebook.svg"], points: ["Facebook- und Instagram-Konten eröffnet", "Meta-Werbekonto und Business-Plattform eingerichtet", "Kampagnen zur Eröffnung und für Reichweite in der Region"] },
      { title: "Bericht jeden Monat", icon: "report", points: ["Routen, Besuche und Kosten aus allen Kanälen", "Klare Empfehlungen für den nächsten Monat"] },
    ],
  },
  site: { img: "/assets/v2/bento/waschbar.webp", alt: "Laptop mit der Website von Waschbar in einem Waschsalon", url: "https://www.waschbar.eu/", text: "waschbar.eu, mit Seiten für beide Standorte, Preisen und Öffnungszeiten." },
  quote: { text: "Jeden Monat sehen wir schwarz auf weiß, was die Werbung bringt. So ergibt Marketing für uns endlich Sinn.", who: "Waschbar, Heidelberg & Ludwigshafen" },
};

export default function WaschbarReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
