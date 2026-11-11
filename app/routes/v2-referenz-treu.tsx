import CaseStudyV2, { type CaseConfig } from "../components/v2/CaseStudyV2";

/*
 * /referenzen/treu: case study.
 * Client: Treu Haustechnik e.K., SHK-Meisterbetrieb in Mannheim-Gartenstadt (owner: Installateur- und Heizungsbaumeister,
 *  Meister since 2023). Site: www.treu-haustechnik.de, built by nüll. (footer credit).
 * Facts: site repo ~/Documents/Treu-haustecnik: lib/site.ts, lib/services.ts, lib/i18n/de.ts (24/7 Notdienst),
 *  lib/reviews.ts (Google: 4.8 from 19 reviews, read 10 Oct 2026; quotes below are verbatim excerpts, names shortened as on the site),
 *  lib/blog/index.ts (9 Ratgeber articles: 5 at launch on 10 Oct, then weekly on 22 Oct, 29 Oct, 3 Nov, 10 Nov 2026).
 * Reels: the three reels in the vault (05-Social Media Content/Videos). The index marks them as samples that need Treu's approval,
 *  and "Die Absagen" retells a Google review, which needs Treu's permission before posting.
 * "Two reels a day" is the package as described by Halyl (11 Nov 2026).
 * No traffic or Instagram numbers: Treu has no Search Console, GA4 or Meta ad account in the reports registry, so numbers.hide.
 * Photos in the review tiles: the licensed stock photos used on Treu's own site (public/assets/img/SOURCES.md).
 */

export function meta() {
  return [
    { title: "Referenz Treu Haustechnik: wöchentlicher Ratgeber und zwei Reels am Tag | nüll." },
    { name: "description", content: "Wie der SHK-Meisterbetrieb Treu Haustechnik in Mannheim sichtbar wird: neue Website, jede Woche ein Ratgeber-Artikel und zwei Reels am Tag auf Instagram." },
  ];
}

const T = "/assets/v2/referenzen/treu";
const SITE = "https://www.treu-haustechnik.de";

const cfg: CaseConfig = {
  client: "Treu Haustechnik",
  theme: { ink: "#1f1a16", accent: "#c2410c", soft: "#fff1e6", bright: "#f97316" },
  logo: { light: `${T}/logo.png`, dark: `${T}/logo.png`, alt: "Treu Haustechnik, Meisterbetrieb für Sanitär, Heizung und Klima in Mannheim", square: true },
  eyebrow: "Referenz · Sanitär, Heizung und Klima in Mannheim",
  title: "Der Meisterbetrieb aus Mannheim, jetzt jeden Tag zu sehen.",
  headline: { value: 14, unit: "Reels", caption: "Reels pro Woche, zwei jeden Tag", statement: "Der Meisterbetrieb aus Mannheim, jetzt jeden Tag zu sehen" },
  browser: {
    scroll: `${T}/site-home-scroll.webp`,
    url: "treu-haustechnik.de",
    alt: "Die Startseite von treu-haustechnik.de",
    phone: `${T}/reel-2.jpg`,
    phoneVideo: `${T}/reel-2.mp4`,
    phoneAlt: "Reel: Rufen Sie uns noch nicht an",
  },
  intro: "Ein SHK-Meisterbetrieb, den die Kunden weiterempfehlen. Damit ihn auch die finden, die ihn noch nicht kennen: jede Woche ein Ratgeber-Artikel und jeden Tag zwei Reels auf Instagram.",
  services: ["Website", "Ratgeber", "Reels", "Instagram", "Briefpapier"],
  stats: [
    { value: "4,8 ★", label: "aus 19 Google-Bewertungen", star: true },
    { value: "24/7", label: "Notdienst bei Heizungsausfall und Rohrbruch" },
    { value: "9", label: "Ratgeber-Artikel seit Oktober, jede Woche einer mehr", star: true },
    { value: "2 am Tag", label: "Reels auf Instagram" },
  ],
  starNote: "Google-Bewertungen laut Profil von Treu Haustechnik, Stand 10. Oktober 2026. Artikel: treu-haustechnik.de/ratgeber, Stand 11. November 2026.",
  task: {
    title: "Der Betrieb",
    statement: "Ein Meisterbetrieb, den die Kunden weiterempfehlen",
    columns: [
      { title: "Ausgangslage", text: "Treu Haustechnik ist ein Meisterbetrieb in Mannheim-Gartenstadt: Heizung, Sanitär und Bad, Klima und ein Notdienst rund um die Uhr. Die Kunden sind begeistert, online war davon aber wenig zu sehen." },
      { title: "Unser Ansatz", text: "Eine neue Website, die zeigt, was die Kunden längst wissen. Dazu jede Woche ein Ratgeber-Artikel zu den Fragen, die Hausbesitzer in Mannheim wirklich stellen, und jeden Tag zwei Reels auf Instagram." },
    ],
    moments: [
      { img: `${T}/m-heizung.webp`, alt: "Monteur an einer Heizungsanlage", title: "„Die Firma Treu war nach kurzer Zeit bei uns“", fact: "Heizungsausfall, über 6 Betriebe hatten abgesagt", search: "Google · Jörg V.", stat: "★★★★★", review: true },
      { img: `${T}/m-bad.webp`, alt: "Modernes Bad nach der Sanierung", title: "„Die Arbeiten wurden sehr zügig, zuverlässig und ordentlich ausgeführt.“", fact: "Bad und Gäste-WC saniert", search: "Google · Thomas V.", stat: "★★★★★", review: true },
      { img: `${T}/m-tausch.webp`, alt: "Installateur prüft die Rohre einer neuen Heizung", title: "„Die Heizung wurde schnell und äußerst professionell getauscht.“", fact: "Heizungstausch", search: "Google · Anna", stat: "★★★★★", review: true },
      { img: `${T}/m-notdienst.webp`, alt: "Heizkörper mit Thermostat", title: "„In der heutigen Zeit schwer einen so guten und schnellen Service zu finden.“", fact: "Hilfe bei der Heizungsanlage", search: "Google · JL", stat: "★★★★★", review: true },
    ],
    momentsNote: "Auszüge aus Google-Bewertungen von Treu Haustechnik, im Wortlaut. 4,8 von 5 Sternen aus 19 Bewertungen, Stand 10. Oktober 2026.",
    text: [],
    photos: [],
  },
  blog: {
    title: "Der Ratgeber",
    statement: "Jede Woche ein Artikel, den Hausbesitzer suchen",
    text: "Heizung kalt, Wasser zu hart, Wärmepumpe im Altbau: Wir schreiben über die Fragen, mit denen Kunden anrufen, verständlich und mit Blick auf Mannheim. Der Meister liest jeden Artikel, bevor er online geht.",
    weeks: [
      { date: "10. Okt.", note: "Start mit 5 Artikeln" },
      { date: "22. Okt.", note: "F-Gase-Verordnung 2027" },
      { date: "29. Okt.", note: "Heizung winterfit machen" },
      { date: "3. Nov.", note: "Trinkwasserhygiene" },
      { date: "10. Nov.", note: "Richtig lüften und heizen" },
      { date: "17. Nov.", note: "Der nächste Artikel", next: true },
    ],
    posts: [
      { img: `${T}/posts/richtig-lueften-und-heizen.webp`, title: "Richtig lüften und heizen im Winter: So vermeiden Sie Schimmel", date: "10. Nov.", tag: "Heizung", url: `${SITE}/ratgeber/richtig-lueften-und-heizen` },
      { img: `${T}/posts/trinkwasserhygiene.webp`, title: "Trinkwasserhygiene: Legionellen, Kalk und Aufbereitung", date: "3. Nov.", tag: "Sanitär", url: `${SITE}/ratgeber/trinkwasserhygiene` },
      { img: `${T}/posts/heizung-winterfit-machen.webp`, title: "Heizung winterfit machen: Die Checkliste", date: "29. Okt.", tag: "Heizung", url: `${SITE}/ratgeber/heizung-winterfit-machen` },
      { img: `${T}/posts/f-gase-verordnung-2027.webp`, title: "F-Gase-Verordnung 2027: Wärmepumpe & Klima", date: "22. Okt.", tag: "Klima", url: `${SITE}/ratgeber/f-gase-verordnung-2027` },
      { img: `${T}/posts/heizung-faellt-aus-was-tun.webp`, title: "Heizung fällt aus: 7 Dinge, die Sie selbst prüfen können", date: "10. Okt.", tag: "Notdienst", url: `${SITE}/ratgeber/heizung-faellt-aus-was-tun` },
      { img: `${T}/posts/waermepumpe-im-altbau.webp`, title: "Wärmepumpe im Altbau: Wann lohnt sie sich wirklich?", date: "10. Okt.", tag: "Heizung", url: `${SITE}/ratgeber/waermepumpe-im-altbau` },
      { img: `${T}/posts/hartes-wasser-mannheim-kalk.webp`, title: "Hartes Wasser in Mannheim: Was Kalk im Haus anrichtet", date: "10. Okt.", tag: "Sanitär", url: `${SITE}/ratgeber/hartes-wasser-mannheim-kalk` },
      { img: `${T}/posts/badsanierung-ablauf-dauer-fehler.webp`, title: "Badsanierung: Ablauf, Dauer und die häufigsten Fehler", date: "10. Okt.", tag: "Sanitär", url: `${SITE}/ratgeber/badsanierung-ablauf-dauer-fehler` },
      { img: `${T}/posts/klimaanlage-nachruesten-split-anlage.webp`, title: "Klimaanlage nachrüsten: Das sollten Sie vorher wissen", date: "10. Okt.", tag: "Klima", url: `${SITE}/ratgeber/klimaanlage-nachruesten-split-anlage` },
    ],
    allUrl: `${SITE}/ratgeber`,
  },
  galleryFirst: true,
  gallery: {
    title: "Die Reels",
    text: "Kurze Videos mit Stimme und Untertiteln: echte Geschichten aus Bewertungen, Tipps aus dem Ratgeber, Themen der Jahreszeit.",
    videosTitle: "Zwei Reels am Tag, drei davon hier",
    photos: [
      { src: `${T}/reel-1.jpg`, video: `${T}/reel-1.mp4`, alt: "Reel: Die Absagen", label: "Die Absagen", text: "Über sechs Betriebe sagen ab, Treu kommt: eine echte Google-Bewertung, als Geschichte erzählt." },
      { src: `${T}/reel-2.jpg`, video: `${T}/reel-2.mp4`, alt: "Reel: Rufen Sie uns noch nicht an", label: "Rufen Sie uns noch nicht an", text: "Sieben Dinge, die man selbst prüfen kann, aus dem Ratgeber-Artikel zum Heizungsausfall." },
      { src: `${T}/reel-3.jpg`, video: `${T}/reel-3.mp4`, alt: "Reel: Erster kalter Abend", label: "Erster kalter Abend", text: "Thermostat auf, Heizkörper kalt: was nach dem Sommer klemmt und wie man es löst." },
    ],
  },
  numbers: { hide: true, title: "", intro: "", source: "" },
  timeline: { title: "Was wir gemacht haben", items: [] },
  work: {
    title: "Was wir gemacht haben",
    intro: "Website, Ratgeber, Reels und Briefpapier, alles aus einer Hand.",
    groups: [
      { title: "Website", icon: "web", points: ["Eigene Seiten für Heizung, Sanitär & Bad, Klima und Notdienst", "Anfrageformular mit Bildern statt Fachbegriffen", "Echte Google-Bewertungen direkt auf der Seite", "Schnell, fürs Handy gebaut, mit WhatsApp-Knopf"] },
      { title: "Ratgeber", icon: "blog", points: ["Jede Woche ein neuer Artikel", "Themen aus Mannheim: hartes Wasser, Heizungsausfall, F-Gase 2027", "Der Meister liest jeden Artikel vor dem Start", "Mit Fragen und Antworten für Google"] },
      { title: "Reels", icon: "video", points: ["Zwei Reels jeden Tag auf Instagram", "Skript, Stimme, Animation und Untertitel", "Aus echten Bewertungen, dem Ratgeber und der Jahreszeit"] },
      { title: "Briefpapier", icon: "image", points: ["Geschäftsausstattung in mehreren Entwürfen", "Im Treu-Orange, passend zur Website"] },
    ],
  },
};

export default function TreuReferenzRoute() {
  return <CaseStudyV2 cfg={cfg} />;
}
