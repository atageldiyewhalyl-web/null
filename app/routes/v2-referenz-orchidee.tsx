import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/orchidee: case study.
 * Client: Fidelis Unternehmensgruppe GmbH, ad brand Pflegedienst Orchidee (Koblenz).
 * Every number: "2026-10 Fidelis Meta Ads Monthly Report" (vault, 4 Nov 2026).
 *  Recruiting nursing staff, 3–24 Oct: 41 applicant leads at €7.50, 31 in the first week.
 *  Leads per month: Sep 23 (PDL only), Oct 62. PDL: Sep 23 at €13.33, Oct 7. Patients: 14 enquiries, 28 patient ads tested.
 *  Oct: 70,405 impressions, 687 link clicks. Ads: S01 Qualification 20 (€7.00), S02 Team & security 19 (€6.96),
 *  S03 1–3 years 2, P04 plain language 6, P07 local trust 4.
 *  Ad spend and patient costs are not shown. Work from the client brief and campaign folders (Instant Forms to HubSpot,
 *  4 styles x 5 placements, three video ads). Quote: written with the owner's consent (see CasesV2), sign-off pending.
 */

export function meta() {
  return [
    { title: "Referenz Pflegedienst Orchidee: 41 Bewerbungen in 3 Wochen | nüll." },
    { name: "description", content: "Wie der Pflegedienst Orchidee in Koblenz mit Anzeigen auf Facebook und Instagram 41 Bewerbungen von Pflegekräften in drei Wochen bekommen hat, direkt über ein kurzes Formular in der App." },
  ];
}

const O = "/assets/v2/referenzen/orchidee";
const C = "/assets/v2/cases";

const cfg: CaseConfig = {
  client: "Pflegedienst Orchidee",
  theme: { ink: "#0F2A4A", accent: "#FF5A47", soft: "#fdf1ee" },
  logo: { light: `${O}/logo.png`, dark: `${O}/logo.png`, alt: "Pflegedienst Orchidee, Ambulante Pflege Koblenz", square: true },
  eyebrow: "Referenz · Ambulante Pflege in Koblenz",
  title: "Pflegekräfte bewerben sich, statt gesucht zu werden.",
  headline: { value: 41, unit: "Bewerbungen", caption: "Bewerbungen von Pflegekräften in 3 Wochen", statement: "Pflegekräfte bewerben sich, statt gesucht zu werden" },
  phone: {
    img: `${O}/ad-s01-9x16.webp`,
    screenBg: "#f4f1ea",
    alt: "Anzeige von Pflegedienst Orchidee auf Instagram: Pflegekräfte gesucht, mit oder ohne Ausbildung",
    toasts: [
      { title: "Neue Bewerbung", sub: "Pflegefachkraft · Vollzeit" },
      { title: "Neue Bewerbung", sub: "Pflegehelfer:in · Teilzeit" },
      { title: "Neue Bewerbung", sub: "Pflegefachkraft · Minijob" },
      { title: "Neue Bewerbung", sub: "Ohne Ausbildung · Vollzeit" },
    ],
  },
  intro: "Mit Anzeigen auf Facebook und Instagram und einem kurzen Formular direkt in der App kamen die Bewerbungen von selbst, direkt ins HubSpot des Pflegedienstes.",
  services: ["Meta Ads", "Lead-Formulare", "HubSpot", "Anzeigenmotive", "Videoanzeigen"],
  // ratios only: cost per application x 41 would reveal the budget, reach and lead totals stay with the client
  stats: [
    { value: "2,7×", label: "so viele Leads im Oktober wie im September" },
    { value: "76 %", label: "der Bewerbungen in der ersten Woche" },
    { value: "1 von 11", label: "Klicks wird zur Bewerbung oder Anfrage" },
    { value: "3", label: "Kampagnen: Pflegekräfte, Leitung, Patienten" },
  ],
  starNote: "Alle Zahlen aus dem Werbekonto auf Facebook und Instagram, September und Oktober 2026.",
  task: {
    title: "Die Aufgabe",
    statement: "Pflegekräfte finden, bevor es jemand anderes tut",
    columns: [
      { title: "Ausgangslage", text: "Ein ambulanter Pflegedienst in Koblenz sucht Pflegekräfte, eine Pflegedienstleitung und neue Patienten. Das Werbekonto war neu und leer, ohne Daten aus früheren Kampagnen." },
      { title: "Unser Ansatz", text: "Anzeigen dort, wo Pflegekräfte ohnehin scrollen: auf Facebook und Instagram, rund um Koblenz. Dazu ein kurzes Formular direkt in der App, jede Bewerbung landet sofort in HubSpot." },
    ],
    // shares of the 41 nursing-staff applications per ad style (S01 20, S02 19); no costs per ad on the page
    moments: [
      { img: `${O}/ad-s01-1x1.webp`, alt: "Anzeige: Pflegekräfte gesucht, mit oder ohne Ausbildung", title: "„Mit oder ohne Ausbildung“ brachte die meisten Bewerbungen", search: "Anzeige: Qualifikation", stat: "49 % der Bewerbungen", shape: "square" },
      { img: `${O}/ad-s02-1x1.webp`, alt: "Anzeige: Pflegejob in Koblenz, kleines familiäres Team", title: "Ein kleines, familiäres Team zieht", search: "Anzeige: Team & Sicherheit", stat: "46 % der Bewerbungen", shape: "square" },
      { img: `${C}/orchidee-ad-1.webp`, alt: "Anzeige im Zeitungs-Look: Unzufrieden in deinem Pflegejob?", title: "Die Pflegedienstleitung, im Zeitungs-Look gesucht", search: "Kampagne: Pflegedienstleitung", stat: "Seit September", shape: "portrait" },
      { img: `${O}/video-ad-1.jpg`, video: `${O}/video-ad-1.mp4`, alt: "Videoanzeige: Pflegedienste anrufen, Absage, nimmt niemanden mehr auf", title: "Videos für Angehörige, die einen Pflegedienst suchen", search: "Video: Anrufliste", stat: "3 Videos", shape: "phone" },
    ],
    momentsNote: "Anteile an den 41 Bewerbungen von Pflegekräften, 3. bis 24. Oktober 2026, aus dem Werbekonto auf Facebook und Instagram.",
    text: [],
    photos: [],
  },
  numbers: {
    title: "Die Zahlen",
    intro: "Verhältnisse statt Rohdaten: aus unseren Monatsberichten an den Pflegedienst, gemessen im Werbekonto auf Facebook und Instagram.",
    // Ratios from the report: leads Sep 23 → Oct 62 (2.7×, Oct adds the nursing-staff and patient campaigns);
    // Oct 62 leads / 687 link clicks = 9.0 % (one in 11); 31 of 41 applications in week one = 76 %;
    // applications per ad style: S01 20, S02 19, S03 2 of 41 = 49 / 46 / 5 %.
    ratios: {
      growth: {
        title: "Wachstum",
        value: "2,7×",
        text: "so viele Leads im Oktober wie im September, mit zwei neuen Kampagnen dazu.",
        bars: [
          { label: "September", ratio: 1 },
          { label: "Oktober", ratio: 2.7 },
        ],
      },
      dots: { title: "Vom Klick zum Lead", value: "9 %", every: 11, text: "Fast jeder 11. Klick auf eine Anzeige wurde zur Bewerbung oder Anfrage." },
      ring: { title: "Tempo", pct: 76, text: "der Bewerbungen von Pflegekräften kamen schon in der ersten Woche nach dem Start." },
      split: {
        title: "Was zieht",
        value: "95 %",
        text: "der Bewerbungen kamen aus zwei Anzeigen-Stilen: Qualifikation und Team.",
        parts: [
          { label: "Qualifikation", pct: 49 },
          { label: "Team & Sicherheit", pct: 46 },
          { label: "Andere", pct: 5 },
        ],
      },
    },
    source: "Quelle: nüll. Meta-Ads-Monatsbericht für den Pflegedienst Orchidee, Oktober 2026, mit September im Vergleich. Absolute Zahlen und Budget bleiben beim Kunden. Ein Lead ist ein ausgefülltes Formular auf Facebook oder Instagram.",
  },
  gallery: {
    title: "Die Motive",
    text: "Ein Auszug aus den Bild- und Videoanzeigen, dazu das Formular, über das die Bewerbungen kommen.",
    postBrand: { name: "Pflegedienst Orchidee", avatar: `${O}/logo.png` },
    videosTitle: "Drei Videoanzeigen für Angehörige",
    photos: [
      { src: `${O}/form-scene.webp`, alt: "Hand hält ein Smartphone mit dem Bewerbungsformular von Pflegedienst Orchidee" },
      { src: `${C}/orchidee-ad-2.webp`, alt: "Anzeige: Pflegedienstleitung gesucht" },
      { src: `${C}/orchidee-ad-3.webp`, alt: "Anzeige: Zeit für den nächsten Schritt" },
      { src: `${O}/video-ad-1.jpg`, video: `${O}/video-ad-1.mp4`, alt: "Videoanzeige: Anrufliste", label: "Anrufliste", text: "Ein Pflegedienst nach dem anderen sagt ab. Dann einer, der neue Patienten aufnimmt." },
      { src: `${O}/video-ad-2.jpg`, video: `${O}/video-ad-2.mp4`, alt: "Videoanzeige: Familienchat", label: "Familienchat", text: "Papa darf nach Hause. Aber wer macht den Verband, die Spritzen, den Medikamentenplan?" },
      { src: `${O}/video-ad-3.jpg`, video: `${O}/video-ad-3.mp4`, alt: "Videoanzeige: Tagesplan", label: "Tagesplan", text: "Insulin um sieben, Arbeit um acht: der Alltag pflegender Angehöriger, und wer ihn abnimmt." },
    ],
  },
  video: { prefix: `${O}/video`, title: "Die Geschichte in 30 Sekunden" },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Vom leeren Werbekonto bis zur Bewerbung in HubSpot, alles aus einer Hand.",
    groups: [
      { title: "Facebook & Instagram", logos: ["/assets/v2/brands/instagram.svg", "/assets/v2/brands/facebook.svg"], points: ["Lead-Kampagnen für Pflegekräfte, Pflegedienstleitung und Patienten", "Zielgebiet Koblenz und Umgebung", "Laufend optimiert, schwache Anzeigen ersetzt"] },
      { title: "Formulare & HubSpot", icon: "form", points: ["Kurze Formulare direkt in Facebook und Instagram", "Fragen zur Qualifikation schon im Formular", "Jede Bewerbung landet sofort in HubSpot"] },
      { title: "Anzeigenmotive", icon: "image", points: ["Über 20 Motive in vier Stilen und fünf Formaten", "Neue Varianten aus den besten Anzeigen", "28 Motive allein für Patientenanfragen getestet"] },
      { title: "Videoanzeigen", icon: "video", points: ["Drei Videos für Angehörige: Anrufliste, Familienchat, Tagesplan", "Für Facebook und Instagram im Hochformat"] },
      { title: "Bericht jeden Monat", icon: "report", points: ["Leads und Kosten pro Kampagne und Anzeige", "Klare nächste Schritte für den Folgemonat"] },
    ],
  },
  quote: { text: "Wir haben lange nach Pflegekräften gesucht. Über Facebook und Instagram kamen endlich die Bewerbungen, die wir brauchen.", who: "Geschäftsführung, Pflegedienst Orchidee" },
};

export default function OrchideeReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
