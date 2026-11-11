import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/dogru: case study.
 * Client: Av. Hasan Doğru (Doğru Kanzlei), Mannheim: Turkish lawyer (Ankara Barosu), registered at the RAK Karlsruhe under § 207 BRAO.
 *  Client rules (clients.json): never describe results as legal outcomes; the lawyer approves every line. So the page talks about
 *  enquiries and visibility only, uses his own title ("Avukat", "türkischer Anwalt") and never "Rechtsanwalt".
 * Site: www.hasandogru.de (de/tr/en), sitemap 11 Nov 2026: 214 URLs, 163 of them guide articles. Relaunched spring 2026.
 * Search Console (sc-domain:hasandogru.de), read-only pull 11 Nov 2026 (~/Documents/null/.resolve-work/dogru-ref/data.json):
 *  clicks Nov 2025 171 · Dec 107 · Jan 166 · Feb 129 (avg 143) · Apr 272 · May 439 · Jun 587 · Jul 721 · Aug 631 · Sep 780 · Oct 760
 *  (March 2026 has only 3 days of data and is left out); last 90 days: 1,782 clicks from Germany, 324 from Turkey (15 %).
 * Enquiries and ads: "2026-11 Av. Hasan Doğru Inquiry and Google Ads Review" (vault, 6 Nov 2026), 7 Aug–3 Nov 2026:
 *  134 web-form enquiries (100 not from ads, 46 % of those in his field; 34 from ads); 148 calls from the ads in the last 90 days,
 *  128 of them family law (87 + 41); Google clicks/day 25.2 and average position 6.6 for 24 Sep–3 Nov.
 *  Spend and cost per call are left out on purpose.
 * Quote: from the previous nüll. site (CasesV2), credited to the firm, not the owner.
 */

export function meta() {
  return [
    { title: "Referenz Kanzlei Doğru: 282 Anfragen in drei Monaten | nüll." },
    { name: "description", content: "Wie die Kanzlei Doğru in Mannheim mit einer Website in drei Sprachen, Ratgebern und Google-Anzeigen gefunden wird: 282 Anfragen in drei Monaten." },
  ];
}

const D = "/assets/v2/referenzen/dogru";
const SITE = "https://www.hasandogru.de";
const PAGES = Array.from({ length: 60 }, (_, i) => `${D}/pages/p${String(i).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Kanzlei Doğru",
  theme: { ink: "#16301f", accent: "#8a6a1f", soft: "#f4f1e8", bright: "#d4a73a" },
  logo: { light: `${D}/logo.png`, dark: `${D}/logo.png`, alt: "Doğru Kanzlei, türkisches Recht in Mannheim", square: true },
  eyebrow: "Referenz · Türkisches Recht in Mannheim",
  title: "Mandanten finden die Kanzlei, statt umgekehrt.",
  headline: { value: 282, unit: "Anfragen", caption: "Anfragen in drei Monaten, per Formular und Anruf", statement: "Mandanten finden die Kanzlei, statt umgekehrt" },
  browser: {
    scroll: `${D}/site-home-scroll.webp`,
    url: "hasandogru.de/de",
    alt: "Die deutsche Startseite von hasandogru.de",
    phone: `${D}/site-m-home.webp`,
    phoneAlt: "Die Startseite der Kanzlei Doğru auf dem Handy",
  },
  intro: "Avukat Hasan Doğru berät von Mannheim aus zu türkischem Recht. Mit einer neuen Website in drei Sprachen, Ratgebern und Google-Anzeigen kommen die Anfragen jetzt aus Deutschland und der Türkei.",
  services: ["Website", "SEO", "Ratgeber", "Google Ads", "Drei Sprachen"],
  stats: [
    { value: "5×", label: "so viele Klicks aus Google wie im Winter", star: true },
    { value: "6,6", label: "Ø Position bei Google", star: true },
    { value: "25", label: "Klicks pro Tag aus der Google-Suche", star: true },
    { value: "214", label: "Seiten auf Deutsch, Türkisch und Englisch" },
  ],
  starNote: "Google Search Console: September 2026 im Vergleich zum Schnitt von November 2025 bis Februar 2026; Position und Klicks pro Tag vom 24. September bis 3. November 2026.",
  catalog: {
    title: "Die Website",
    statement: "Türkisches Recht, erklärt in drei Sprachen",
    products: PAGES,
    wallWide: true,
    count: 214,
    countLabel: "Seiten, davon 163 Ratgeber-Artikel",
    features: ["Deutsch, Türkisch, Englisch", "163 Ratgeber-Artikel", "Seiten je Rechtsgebiet", "Anfrage per Formular und WhatsApp", "Frage „Betrifft es die Türkei?“", "Strukturierte Daten für Google"],
    pages: [
      { img: `${D}/site-de.webp`, title: "Startseite", text: "Türkischer Anwalt in Mannheim: Beratung anfragen, per Formular oder WhatsApp.", url: `${SITE}/de` },
      { img: `${D}/site-tr.webp`, title: "Ana sayfa", text: "Dieselbe Seite auf Türkisch, für alle, die lieber Türkisch lesen.", url: `${SITE}/tr` },
      { img: `${D}/site-vekaletname.webp`, title: "Vekaletname-Ratgeber", text: "Die türkische Vollmacht aus Deutschland: die Ratgeber-Seite mit den meisten Klicks aus Google.", url: `${SITE}/tr/blog/almanya-da-vekaletname-cikarma-rehberi` },
      { img: `${D}/site-notar.webp`, title: "Türkischer Notar", text: "Gibt es einen türkischen Notar in Deutschland? Einer der meistgelesenen Ratgeber.", url: `${SITE}/de/blog/tuerkischer-notar-deutschland` },
      { img: `${D}/site-erbschaft.webp`, title: "Erbschaft Türkei", text: "Erben in der Türkei: was Familien in Deutschland wissen müssen.", url: `${SITE}/de/blog/erbschaft-tuerkei-deutschland-ratgeber` },
      { img: `${D}/site-aile.webp`, title: "Rechtsgebiete", text: "Eine Seite je Rechtsgebiet, hier Familienrecht auf Türkisch.", url: `${SITE}/tr/hizmetler/aile-hukuku` },
    ],
  },
  task: {
    title: "Die Website",
    columns: [
      { title: "Ausgangslage", text: "Avukat Hasan Doğru ist in Ankara zugelassen und bei der Rechtsanwaltskammer Karlsruhe registriert. Seine Mandanten leben in Deutschland, ihre Fälle liegen in der Türkei. Die alte Website wirkte veraltet und brachte kaum Anfragen." },
      { title: "Unser Ansatz", text: "Eine neue Website in drei Sprachen, Ratgeber zu genau den Fragen, die türkischstämmige Familien in Deutschland suchen, und Google-Anzeigen für Familien-, Straf- und Erbrecht." },
    ],
    text: [],
    photos: [],
  },
  numbers: {
    title: "Die Zahlen",
    intro: "Aus Google Search Console und unserer Auswertung der Anfragen und Google-Anzeigen.",
    monthsTitle: "Klicks aus der Google-Suche pro Monat",
    months: [
      { label: "Apr.", value: 272 },
      { label: "Mai", value: 439 },
      { label: "Juni", value: 587 },
      { label: "Juli", value: 721 },
      { label: "Aug.", value: 631 },
      { label: "Sep.", value: 780 },
      { label: "Okt.", value: 760 },
    ],
    drop: {
      title: "Klicks pro Monat",
      from: "143",
      fromLabel: "Ø November 2025 bis Februar 2026",
      to: "780",
      toLabel: "September 2026",
      text: "Die neue Website ging im Frühjahr 2026 online. Seitdem kommen rund fünfmal so viele Besucher aus der Google-Suche.",
    },
    placesTitle: "Woher die Anfragen kommen",
    places: [
      { name: "Google-Suche & direkt", how: "ohne Anzeigen", since: "7. Aug.", a: "100", aLabel: "Formular-Anfragen", b: "46 %", bLabel: "passend zum Fachgebiet" },
      { name: "Google-Anzeigen", how: "Familien-, Straf- und Erbrecht", since: "7. Aug.", a: "148", aLabel: "Anrufe aus den Anzeigen", b: "34", bLabel: "Formular-Anfragen" },
      { name: "Familienrecht", how: "die stärkste Kampagne", since: "7. Aug.", a: "128", aLabel: "Anrufe", b: "86 %", bLabel: "aller Anrufe aus Anzeigen" },
    ],
    searchesTitle: "Echte Suchen, letzte 90 Tage",
    searchesUnit: "Klicks",
    searches: [
      { q: "vekaletname", clicks: 15 },
      { q: "türkischer notar in der nähe", clicks: 8 },
      { q: "türkischer anwalt familienrecht mannheim", clicks: 6 },
      { q: "türk avukat mannheim", clicks: 5 },
      { q: "almanya da boşanma da mal paylaşımı", clicks: 3 },
    ],
    searchNote: "Gesucht wird auf Deutsch und auf Türkisch, jede siebte Suche kommt aus der Türkei.",
    small: [
      { value: "25,2", label: "Klicks pro Tag aus der Google-Suche", sub: "24. September bis 3. November 2026" },
      { value: "6,6", label: "Ø Position bei Google", sub: "24. September bis 3. November 2026" },
      { value: "15 %", label: "der Klicks aus der Türkei", sub: "letzte 90 Tage, die übrigen fast alle aus Deutschland" },
    ],
    source: "Quelle: Google Search Console für hasandogru.de (November 2025 bis 8. November 2026) und nüll.-Auswertung der Anfragen und Google-Anzeigen vom 6. November 2026, Zeitraum 7. August bis 3. November 2026. „Passend zum Fachgebiet“ heißt: eine Frage zu türkischem Recht im Tätigkeitsbereich der Kanzlei, von uns nach dem Text der Anfrage eingeordnet, keine rechtliche Bewertung. Ausgaben und Kosten pro Anfrage bleiben bei der Kanzlei.",
  },
  gallery: { title: "", text: "", photos: [] },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Ratgeber, SEO und Google-Anzeigen, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Neu gebaut, in drei Sprachen", "Eine Seite je Rechtsgebiet", "Anfrage per Formular und WhatsApp", "Die Frage „Betrifft es die Türkei?“ hält unpassende Anfragen fern"] },
      { title: "Ratgeber", icon: "blog", points: ["163 Artikel auf Deutsch, Türkisch und Englisch", "Vollmacht, Notar, Erbe, Scheidung, Strafsachen", "Mit rechtlichem Hinweis in jedem Artikel"] },
      { title: "Google-Anzeigen", logos: ["/assets/v2/brands/google-ads.svg"], points: ["Kampagnen für Familien-, Straf- und Erbrecht", "Anruf-Knopf in allen Anzeigen", "104 ausschließende Keywords gegen unpassende Suchen", "Nur in Deutschland ausgespielt"] },
      { title: "SEO & Bericht", icon: "report", points: ["Sprachversionen für Google sauber verknüpft", "Strukturierte Daten für Kanzlei, FAQ und Artikel", "Monatlicher Bericht auf Türkisch und Englisch"] },
    ],
  },
  quote: { text: "Seit dem neuen Auftritt verstehen Besucher sofort, was wir anbieten. Die Website bringt klarere Anfragen.", who: "Kanzlei Doğru, Mannheim" },
};

export default function DogruReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
