import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";
import { withSocial } from "../utils/seoMeta";

/*
 * /referenzen/orchidee: case study. New website (27 Nov 2026) on top, the Meta recruiting results (Sep/Oct) below.
 * Client: Fidelis Unternehmensgruppe GmbH / Pflegedienst Orchidee GmbH, Hohenzollernstr. 19, 56068 Koblenz.
 * Website: orchidee-pflegedienst.de (Next.js on Vercel, repo atageldiyewhalyl-web/Orchidee), built by nüll.
 *  - Brief 18 Nov, first commit 21 Nov, own design 22/23 Nov, callback pop-up and 44 Ratgeber articles 25 Nov,
 *    domain live 27 Nov 2026 (Vercel domain createdAt). Live sitemap 27 Nov: 52 URLs = 8 pages + 44 Ratgeber.
 *  - Same day: old-page redirects (next.config.mjs), Search Console verified and sitemap submitted
 *    (GSC API, lastSubmitted 27 Nov), GA4 only after consent, click counting without cookies, leads by e-mail + Airtable.
 *  - No website numbers yet: on 27 Nov every row in orchidee_anfragen / orchidee_klicks is a test. Refresh ~30 days.
 *  - Photos on the site are partly stock and AI-made: never call them photos of the team. The site shows no prices.
 * Ads: every number from the "2026-10 Fidelis Meta Ads Monthly Report" (vault, 4 Nov 2026).
 *  Recruiting nursing staff, 3–24 Oct: 41 applicant leads at €7.50, 31 in the first week.
 *  Leads per month: Sep 23 (PDL only), Oct 62. PDL: Sep 23 at €13.33, Oct 7. Patients: 14 enquiries, 28 patient ads tested.
 *  Oct: 70,405 impressions, 687 link clicks. Ads: S01 Qualification 20 (€7.00), S02 Team & security 19 (€6.96),
 *  S03 1–3 years 2, P04 plain language 6, P07 local trust 4.
 *  These ran before the website, with Instant Forms inside Facebook/Instagram to HubSpot. Never credit them to the site.
 *  Ad spend and patient costs are not shown. Quote: written with the owner's consent (see CasesV2), sign-off pending.
 * Mockup: public/assets/v2/mockups/orchidee-web.webp, Codex image gen from real screenshots of the live site (27 Nov 2026).
 */

export function meta() {
  return withSocial("/referenzen/orchidee", [
    { title: "Referenz Pflegedienst Orchidee: Website & Anzeigen | nüll." },
    { name: "description", content: "Pflegedienst Orchidee, Koblenz: neue Website für Familien und Pflegekräfte, online seit 27. November 2026. Zuvor 41 Bewerbungen in drei Wochen über Anzeigen." },
  ], { image: "https://nuell-agentur.com/assets/v2/mockups/orchidee-web.webp" });
}

const O = "/assets/v2/referenzen/orchidee";
const C = "/assets/v2/cases";
const SITE = "https://www.orchidee-pflegedienst.de";
const PAGES = Array.from({ length: 30 }, (_, i) => `${O}/pages/p${String(i + 1).padStart(2, "0")}.webp`);

const cfg: CaseConfig = {
  client: "Pflegedienst Orchidee",
  theme: { ink: "#2e1a3c", accent: "#c8006c", soft: "#fbf0f6", bright: "#ff9ccb" },
  logo: { light: `${O}/logo-site.png`, dark: `${O}/logo-site-white.png`, alt: "Pflegedienst Orchidee, Ambulante Pflege in Koblenz" },
  eyebrow: "Referenz · Ambulante Pflege in Koblenz",
  title: "Erst kamen die Bewerbungen, jetzt die neue Website.",
  headline: { value: 44, unit: "Ratgeber-Artikel", caption: "Ratgeber-Artikel zur Pflege zu Hause, zum Start online", statement: "Erst die Bewerbungen, jetzt die neue Website" },
  browser: {
    scroll: `${O}/site-home-scroll.webp`,
    url: "orchidee-pflegedienst.de",
    alt: "Die Startseite von orchidee-pflegedienst.de",
    phone: `${O}/site-m-home.webp`,
    phoneAlt: "Die Startseite des Pflegedienst Orchidee auf dem Handy",
  },
  intro: "Seit September bringen unsere Anzeigen dem Pflegedienst Orchidee Bewerbungen. Am 27. November 2026 ging die neue Website online: für Familien, die in Koblenz Pflege suchen, und für Pflegekräfte, die eine Stelle suchen.",
  services: ["Website", "SEO & Ratgeber", "Meta Ads", "Formulare", "Videoanzeigen"],
  stats: [
    { value: "52", label: "Seiten zum Start der neuen Website" },
    { value: "2", label: "Wege auf der Website: Rückruf für Familien, Bewerbung für Pflegekräfte" },
    { value: "41", label: "Bewerbungen von Pflegekräften in 3 Wochen, über Anzeigen", star: true },
    { value: "2,7×", label: "so viele Leads aus Anzeigen im Oktober wie im September", star: true },
  ],
  starNote: "Aus dem Werbekonto auf Facebook und Instagram, September und Oktober 2026, also vor dem Start der neuen Website, mit Formularen direkt in der App.",
  catalog: {
    title: "Die neue Website",
    statement: "Zwei Besucher, zwei klare Wege",
    thenTask: true,
    columns: [
      { title: "Ausgangslage", text: "Die alte Website bestand aus einzelnen HTML-Seiten. Gesucht werden neue Patienten und neue Pflegekräfte: zwei Gruppen mit ganz verschiedenen Fragen." },
      { title: "Unser Ansatz", text: "Die Startseite fragt zuerst: „Für wen suchen Sie Pflege?“ und sagt offen, was der Dienst nicht anbietet. Pflegekräfte haben eine eigene Karriereseite mit kurzer Bewerbung ohne Anschreiben." },
    ],
    products: PAGES,
    wallWide: true,
    count: 52,
    countLabel: "Seiten, davon 44 Ratgeber-Artikel",
    features: ["Fürs Handy entworfen", "Rückruf direkt anfordern", "Bewerbung ohne Anschreiben", "Wer die Pflege bezahlt, erklärt", "Statistik erst nach Zustimmung", "Alte Adressen umgeleitet"],
    pages: [
      { img: `${O}/site-home.webp`, title: "Startseite", text: "„Für mich“ oder „Für einen Angehörigen“: Mit einem Klick beginnt die Anfrage.", url: `${SITE}/` },
      { img: `${O}/site-leistungen.webp`, title: "Leistungen", text: "Behandlungspflege nach ärztlicher Verordnung, Grundpflege und Beratung.", url: `${SITE}/leistungen` },
      { img: `${O}/site-ueber-uns.webp`, title: "Über uns", text: "Ein kleines, festes Team aus Koblenz.", url: `${SITE}/ueber-uns` },
      { img: `${O}/site-ratgeber.webp`, title: "Ratgeber", text: "Pflegegrad, Kosten, Anträge und Behandlungspflege, in einfachen Worten.", url: `${SITE}/ratgeber` },
      { img: `${O}/site-karriere.webp`, title: "Karriere", text: "Stellen für Pflegefachkräfte und Pflegedienstleitung, mit kurzer Bewerbung.", url: `${SITE}/karriere` },
      { img: `${O}/site-kontakt.webp`, title: "Rückruf anfordern", text: "Ein Formular, daneben steht, wie es danach weitergeht.", url: `${SITE}/kontakt` },
    ],
  },
  task: {
    title: "Die Anzeigen",
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
    title: "Die Zahlen aus den Anzeigen",
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
  video: { prefix: `${O}/video`, title: "Wie die Bewerbungen kommen, in 30 Sekunden" },
  timeline: { title: "Was wir gemacht haben", items: [] },
  launch: {
    title: "Der Website-Start",
    intro: "Vom Briefing bis zur Website auf der eigenen Domain in neun Tagen.",
    items: [
      { date: "18. Nov.", title: "Das Briefing", text: "Zwei Ziele: Familien, die Pflege zu Hause suchen, und Pflegekräfte, die eine Stelle suchen." },
      { date: "21.–23. Nov.", title: "Gebaut und gestaltet", text: "Die erste Version, dann ein eigenes Design, zuerst fürs Handy." },
      { date: "25. Nov.", title: "Rückruf und Ratgeber", text: "Rückruf-Fenster auf der Website und 44 Ratgeber-Artikel rund um die Pflege zu Hause." },
      { date: "27. Nov.", title: "Die Website ist online", text: "Auf der eigenen Domain, mit Umleitungen von alten Adressen, bestätigter Search Console und eingereichter Sitemap." },
    ],
  },
  work: {
    title: "Was wir gemacht haben",
    intro: "Anzeigen, Website und SEO, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Neu gebaut, zuerst fürs Handy entworfen", "Eigene Seiten für Leistungen, Team, Karriere und Kontakt", "Sagt offen, was der Dienst anbietet und was nicht"] },
      { title: "Anfragen und Bewerbungen", icon: "form", points: ["Rückruf-Formular auf der Website", "Bewerbung ohne Anschreiben", "Jede Anfrage kommt per E-Mail an und landet in Airtable", "Klicks auf Telefon und E-Mail werden ohne Cookies gezählt"] },
      { title: "SEO und Ratgeber", icon: "blog", points: ["44 Artikel zu Pflegegrad, Kosten und Behandlungspflege", "Umleitungen von alten Adressen", "Search Console und Sitemap eingerichtet", "Google Analytics erst nach Zustimmung"] },
      { title: "Facebook & Instagram", logos: ["/assets/v2/brands/instagram.svg", "/assets/v2/brands/facebook.svg"], points: ["Lead-Kampagnen für Pflegekräfte, Pflegedienstleitung und Patienten", "Formulare direkt in der App, mit Fragen zur Qualifikation", "Jeder Lead landet in HubSpot"] },
      { title: "Anzeigen und Videos", icon: "video", points: ["Über 20 Motive in vier Stilen und fünf Formaten", "28 Motive allein für Patientenanfragen getestet", "Drei Videos für Angehörige"] },
      { title: "Bericht jeden Monat", icon: "report", points: ["Leads und Kosten pro Kampagne und Anzeige", "Klare nächste Schritte für den Folgemonat"] },
    ],
  },
  quote: { text: "Wir haben lange nach Pflegekräften gesucht. Über Facebook und Instagram kamen endlich die Bewerbungen, die wir brauchen.", who: "Geschäftsführung, Pflegedienst Orchidee" },
};

export default function OrchideeReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
