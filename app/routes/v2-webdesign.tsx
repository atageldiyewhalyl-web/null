import ServiceV2, { type ServiceConfig } from "../components/v2/ServiceV2";
import { withSocial } from "../utils/seoMeta";
import { EnquiryVisual } from "../components/v2/SystemVisuals";
import { SERVICE, REFS } from "../components/v2/links";

/*
 * /leistungen/webdesign: the Webdesign page ("Angefragt werden").
 * Prices: PreiseV2 STARTS (one-time: Onepager ab 1.499, Website ab 1.999, Onlineshop ab 3.499) plus TIERS[0] Wartung 99 €/Monat.
 * Results section is a portfolio of sites we built (Halyl, 2026-11-11: no Doğru or Herkules here).
 * Tracking events shown in the steps (form, phone, WhatsApp, route) match what we set up for Herkules in GA4.
 */

export function meta() {
  return withSocial("/leistungen/webdesign", [
    { title: "Webdesign für Betriebe: Websites, die Anfragen bringen | nüll." },
    { name: "description", content: "Websites für Handwerk, Kanzleien und Dienstleister: klares Angebot, Anfrage per Formular, Anruf oder WhatsApp, jede Anfrage gemessen. Live in 7 Tagen, ab 1.499 € einmalig." },
  ]);
}

const cfg: ServiceConfig = {
  kind: "web",
  eyebrow: "Leistung · Webdesign",
  titleMuted: "Wer dich findet,",
  title: "fragt dich an",
  intro: "Deine Website führt Besucher direkt zur Anfrage. Per Formular, Anruf oder WhatsApp. Und jeden Monat siehst du, was sie gebracht hat.",
  Visual: EnquiryVisual,
  tint: "#e9f2ff",
  proof: { value: "7 Tage", text: "bis deine Website live ist." },
  photo: {
    src: "/assets/v2/services/web-scene.webp",
    alt: "Hand hält ein Smartphone im hellen Flur, darauf eine veraltete Website mit winziger Schrift und Cookie-Banner",
    chips: ["Sucht deine Telefonnummer", "Verlässt die Seite"],
  },
  problem: {
    strong: "Deine Website hat Besucher.",
    muted: "Aber keine Anfragen.",
    text: "Wer auf deiner Seite landet, muss in Sekunden verstehen, was du machst, wo du arbeitest und wie er dich erreicht. Fehlt das, ist er weg, bevor er anfragt.",
  },
  stepsTitle: "So wird aus Besuch eine Anfrage",
  steps: [
    { art: "offer", title: "Klares Angebot", body: "Was du machst, wo du arbeitest, für wen und was der nächste Schritt ist. Das versteht jeder Besucher in den ersten Sekunden." },
    { art: "design", title: "Design und Texte", body: "Wir schreiben die Texte, gestalten die Seiten und bauen die Technik. Mit echten Fotos deiner Arbeit, schnell auf jedem Handy." },
    { art: "contact", title: "Anfrage in einem Klick", body: "Anrufen, WhatsApp oder ein kurzes Formular, das Schritt für Schritt fragt, worum es geht. Bis zur Anfrage ist es nie mehr als ein Tippen." },
    { art: "tracking", title: "Jede Anfrage gemessen", body: "Formulare, Anrufe, WhatsApp und Routen werden gemessen. Jeden Monat siehst du im Bericht, was die Website gebracht hat." },
  ],
  tier: "Website",
  packageNote: "Texte, Design und Technik aus einer Hand, dein Google-Unternehmensprofil gleich mit. In 7 Tagen ist deine Website live.",
  cases: [],
  results: { title: "Ausgewählte Websites", text: "Echte Websites für echte Betriebe, gebaut von uns." },
  mentions: {
    title: "Gebaut für Betriebe",
    text: "Die online so gut aussehen wollen, wie sie arbeiten. Mit klarem Angebot und dem kürzesten Weg zur Anfrage.",
    items: [
      { img: "/assets/v2/bento/sg.webp", client: "SG Laserzentrum", place: "8 Standorte", href: `${REFS}/sg` },
      { img: "/assets/v2/bento/treu.webp", client: "Treu Haustechnik", place: "Mannheim", href: `${REFS}/treu` },
      { img: "/assets/v2/bento/waschbar.webp", client: "Waschbar", place: "Heidelberg & Ludwigshafen", href: `${REFS}/waschbar` },
      { img: "/assets/v2/bento/bergstone-web.webp", client: "Bergstone Keramiksan", place: "Ludwigshafen", href: `${REFS}/bergstone` },
      { img: "/assets/v2/bento/so.webp", client: "S&O Beauty", place: "Mannheim", href: `${REFS}/so` },
      { img: "/assets/v2/bento/ft.webp", client: "FT Sicherheitstechnik", place: "Mannheim", href: `${REFS}/ft` },
    ],
  },
  cross: {
    label: "Damit Besucher kommen",
    title: "SEO",
    text: "Die beste Website bringt nichts, wenn sie keiner findet. Mit SEO wirst du bei Google gefunden, wenn jemand sucht.",
    href: SERVICE.seo,
  },
  faqs: [
    { q: "Was kostet eine Website?", a: "Ein Onepager kostet ab 1.499 €, eine Website mit 10 und mehr Seiten ab 1.999 € und ein Onlineshop ab 3.499 €, jeweils einmalig und netto. Danach läuft sie mit einem Monatspaket ab 99 €: Hosting, Wartung, kleine Änderungen und dein Monatsbericht." },
    { q: "Wie schnell ist meine Website online?", a: "Onepager und Website sind in 7 Tagen live. Dafür brauchen wir von dir ein Gespräch über deinen Betrieb und die Fotos, die du schon hast." },
    { q: "Muss ich die Texte selbst schreiben?", a: "Nein. Die Texte schreiben wir. Von dir brauchen wir dein Fachwissen im Gespräch. Du prüfst nur, ob fachlich alles stimmt." },
    { q: "Wie kommen Anfragen über die Website rein?", a: "Per Anruf, per WhatsApp und über ein kurzes Formular, das Schritt für Schritt fragt, worum es geht. Alle drei Wege sind auf jeder Seite mit einem Klick erreichbar." },
    { q: "Woran sehe ich, was die Website bringt?", a: "Wir messen Formulare, Klicks auf deine Telefonnummer, WhatsApp und Routen. Jeden Monat siehst du die Zahlen in deinem Bericht." },
    { q: "Was ist im Google-Unternehmensprofil enthalten?", a: "Wir optimieren dein Profil, damit Name, Leistungen, Öffnungszeiten und Website stimmen und zu deiner neuen Website passen. So wirst du auch in Google Maps gefunden." },
  ],
};

export default function WebdesignV2Route() {
  return <ServiceV2 cfg={cfg} current={SERVICE.web} />;
}
