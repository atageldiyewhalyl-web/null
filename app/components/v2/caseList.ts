/*
 * Every client on the Fälle page (/referenzen). One list, so a new reference page only needs `page` set here.
 * Numbers only where a report backs them (sources: CasesV2.tsx header and each reference route's header):
 *  Waschbar: Google Ads report 6 Aug–5 Nov 2026. Orchidee: Meta report Oct 2026. Bergstone: site repo (150 products).
 *  Herkules: SEO report Oct 2026. Kanzlei Doğru: review Nov 2026. Treu: blog list in the site repo.
 *  SG, S&O, FT, Onkel, B.Y.: no measured data shown, only what we built.
 */

export type CaseTag = "web" | "seo" | "gads" | "meta" | "content";

export const TAG_LABEL: Record<CaseTag, string> = {
  web: "Website",
  seo: "SEO",
  gads: "Google Ads",
  meta: "Meta Ads",
  content: "Reels & Content",
};

export type CaseEntry = {
  slug: string;
  client: string;
  place: string;
  services: string[]; // shown as written
  tags: CaseTag[]; // for the filter
  img: string;
  alt: string;
  stat?: string;
  statRest?: string;
  headline: string;
  facts?: string[];
  page?: string; // its own reference page
  tint: string; // soft card colour on the Fälle page, a light shade of the client's own colour
};

const B = "/assets/v2/bento";

export const CASE_LIST: CaseEntry[] = [
  {
    slug: "waschbar",
    tint: "#e9f2ff",
    client: "Waschbar",
    place: "Heidelberg & Ludwigshafen",
    services: ["Website", "Google Ads", "Meta Ads"],
    tags: ["web", "gads", "meta"],
    img: `${B}/waschbar.webp`,
    alt: "Laptop mit der Waschbar-Website in einem Waschsalon",
    stat: "2.491",
    statRest: "Routenanfragen in 3 Monaten",
    headline: "Aus Google-Suchen werden Besuche im Salon.",
    page: "/referenzen/waschbar",
  },
  {
    slug: "orchidee",
    tint: "#fdf1ee",
    client: "Pflegedienst Orchidee",
    place: "Koblenz",
    services: ["Meta Ads", "Recruiting"],
    tags: ["meta"],
    img: `${B}/orchidee.webp`,
    alt: "Smartphone mit einer Instagram-Anzeige von Pflegedienst Orchidee",
    stat: "41",
    statRest: "Bewerbungen in 3 Wochen",
    headline: "Pflegekräfte bewerben sich, statt gesucht zu werden.",
    page: "/referenzen/orchidee",
  },
  {
    slug: "bergstone",
    tint: "#f6f3ee",
    client: "Bergstone Keramiksan",
    place: "Ludwigshafen",
    services: ["Website", "360°-Rundgang", "Reels", "Meta Ads"],
    tags: ["web", "meta", "content"],
    img: `${B}/bergstone-web.webp`,
    alt: "Laptop mit der Website von Bergstone Keramiksan",
    stat: "150",
    statRest: "Produkte mit eigener Seite",
    headline: "Der ganze Showroom, jetzt auch online.",
    page: "/referenzen/bergstone",
  },
  {
    slug: "treu",
    tint: "#fff1e6",
    client: "Treu Haustechnik",
    place: "Mannheim",
    services: ["Website", "Ratgeber", "Reels"],
    tags: ["web", "seo", "content"],
    img: `${B}/treu.webp`,
    alt: "Laptop mit der Website von Treu Haustechnik in einem Technikraum mit Wärmepumpe",
    stat: "Jede Woche",
    statRest: "ein neuer Ratgeber-Artikel",
    headline: "Der Meisterbetrieb aus Mannheim, jetzt jeden Tag zu sehen.",
    page: "/referenzen/treu",
  },
  {
    slug: "herkules",
    tint: "#eef3fb",
    client: "Herkules Umzüge",
    place: "Mannheim",
    services: ["Website", "SEO"],
    tags: ["web", "seo"],
    img: `${B}/herkules.webp`,
    alt: "Website von Herkules Umzüge",
    stat: "Seite 1",
    statRest: "bei Google für „Umzugsunternehmen Mannheim“",
    headline: "Wer in Mannheim umzieht, findet Herkules.",
    facts: ["Ø Position von 22,7 auf 12,5 (Juni bis November)", "259 Anfragen über die Website seit Juni"],
    page: "/referenzen/herkules",
  },
  {
    slug: "dogru",
    tint: "#eef5f0",
    client: "Kanzlei Doğru",
    place: "Mannheim",
    services: ["Website", "SEO", "Google Ads"],
    tags: ["web", "seo", "gads"],
    img: `${B}/dogru.webp`,
    alt: "Laptop mit der Website der Kanzlei Doğru auf einem Schreibtisch in einer Kanzlei",
    stat: "282",
    statRest: "Anfragen in drei Monaten, per Formular und Anruf",
    headline: "Mandanten finden die Kanzlei, statt umgekehrt.",
    facts: ["Rund 25 Klicks pro Tag aus der Google-Suche", "Ø Position 6,6 bei Google"],
    page: "/referenzen/dogru",
  },
  {
    slug: "sg",
    tint: "#f3f1fb",
    client: "SG Laserzentrum",
    place: "8 Standorte",
    services: ["Website", "Online-Terminbuchung"],
    tags: ["web"],
    img: `${B}/sg.webp`,
    alt: "Website von SG Laserzentrum",
    headline: "Acht Studios, ein Auftritt.",
    facts: ["Jedes Studio mit eigener Seite und Team", "Termin direkt online buchen"],
    page: "/referenzen/sg",
  },
  {
    slug: "so",
    tint: "#fdf1f4",
    client: "S&O Beauty",
    place: "Mannheim",
    services: ["Website", "Meta Ads", "Instagram"],
    tags: ["web", "meta", "content"],
    img: `${B}/so.webp`,
    alt: "Website von S&O Beauty",
    stat: "4,1 %",
    statRest: "Klickrate der Anzeigen auf Facebook und Instagram",
    headline: "Ein neuer Salon, von Anfang an sichtbar.",
    facts: ["Logo, Website, Google-Profil und Print", "Anzeigen auf Facebook und Instagram"],
    page: "/referenzen/so",
  },
  {
    slug: "ft",
    tint: "#eef1f5",
    client: "FT Sicherheitstechnik",
    place: "Mannheim",
    services: ["Website", "Google Ads"],
    tags: ["web", "gads"],
    img: `${B}/ft.webp`,
    alt: "Website von FT Sicherheitstechnik",
    stat: "9,2 %",
    statRest: "Klickrate der Suchanzeigen für Firmen",
    headline: "Sicherheitstechnik für Firmen, klar gegliedert.",
    facts: ["18 Produktseiten und ein Konfigurator", "Google-Anzeigen nur für Firmenkunden"],
    page: "/referenzen/ft",
  },
  {
    slug: "onkel",
    tint: "#eaf4fb",
    client: "Onkel Abwassertechnik",
    place: "Mannheim",
    services: ["Website"],
    tags: ["web"],
    img: `${B}/onkel.webp`,
    alt: "Laptop mit der Website von Onkel Abwassertechnik in einer Werkstatt für Rohrreinigung",
    headline: "Rohr- und Kanalreinigung, klar erklärt.",
    facts: ["Akute Probleme direkt angesprochen", "Schneller Weg zur Anfrage"],
    page: "/referenzen/onkel",
  },
  {
    slug: "by",
    tint: "#f2f2ef",
    client: "B.Y. Consulting",
    place: "Heidelberg",
    services: ["Marke", "Positionierung", "Website"],
    tags: ["web"],
    img: `${B}/by.webp`,
    alt: "Laptop mit der Website von Besir Yaman auf einem Schreibtisch im Beratungsbüro",
    headline: "Ein Mentor, eine klare Marke.",
    facts: ["Markenauftritt von Grund auf", "Website, die Vertrauen aufbaut"],
    page: "/referenzen/by",
  },
];
