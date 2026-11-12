import ServiceV2, { type ServiceConfig } from "../components/v2/ServiceV2";
import { withSocial } from "../utils/seoMeta";
import { AiVisual } from "../components/v2/SystemVisuals";
import { SERVICE } from "../components/v2/links";

/*
 * /leistungen/ki-sichtbarkeit: the KI-Sichtbarkeit page.
 * KI-Sichtbarkeit is part of the SEO package (PreiseV2 TIERS "SEO"), so the price and items come from there.
 * Result: Herkules, Google Search Console "Generative AI features" export, 2026-05-30 to 2026-08-29
 * (vault: Herkules Umzüge/06-Reports/2026-08 Herkules Report Data Notes.md): June 61, July 238, August 392 impressions.
 * May is left out because the export only covers its last two days.
 * No promise that any assistant will recommend a business: nobody can guarantee that, and the FAQ says so.
 */

export function meta() {
  return withSocial("/leistungen/ki-sichtbarkeit", [
    { title: "KI-Sichtbarkeit: von ChatGPT, Claude und Gemini empfohlen werden | nüll." },
    { name: "description", content: "Immer mehr Kunden fragen ChatGPT, Claude oder Gemini. Wir bereiten deine Inhalte so auf, dass diese Assistenten dich kennen und empfehlen. Teil des SEO-Pakets, ab 299 € im Monat." },
  ]);
}

const cfg: ServiceConfig = {
  kind: "ai",
  eyebrow: "Leistung · KI-Sichtbarkeit",
  titleMuted: "Wer fragt,",
  title: "hört deinen Namen",
  intro: "Immer mehr Kunden fragen ChatGPT, Claude oder Gemini, wen sie anrufen sollen. Wir bereiten deine Inhalte so auf, dass diese Assistenten dich kennen, verstehen und empfehlen.",
  Visual: AiVisual,
  tint: "#f1eefc",
  proof: { value: "392", text: "Einblendungen in Googles KI-Antworten im August 2026. Herkules Umzüge." },
  video: { base: "ai", title: "In 30 Sekunden erklärt" },
  photo: {
    src: "/assets/v2/services/ai-scene.webp",
    alt: "Hand hält ein Smartphone im hellen Wohnzimmer, ChatGPT empfiehlt einen anderen Elektriker",
    chips: ["Fragt: Welcher Elektriker?", "Empfohlen: die Konkurrenz"],
  },
  problem: {
    strong: "Die KI empfiehlt einen Betrieb.",
    muted: "Nur leider nicht deinen.",
    text: "KI-Assistenten nennen die Betriebe, über die sie klare und übereinstimmende Informationen finden. Fehlen auf deiner Website direkte Antworten, eindeutige Daten und Belege, nennen sie jemand anderen.",
  },
  stepsTitle: "So wirst du empfohlen",
  steps: [
    { art: "ask", title: "Fragen", body: "Wir sammeln, was deine Kunden Assistenten wirklich fragen: wer gut ist, was es kostet und wer heute noch Zeit hat." },
    { art: "answer", title: "Klare Antworten", body: "Deine Seiten und Artikel beantworten diese Fragen direkt, oben und in wenigen Sätzen. So kann eine KI sie verstehen und als Quelle nennen." },
    { art: "data", title: "Eindeutige Daten", body: "Name, Leistungen, Ort und Öffnungszeiten stehen als strukturierte Daten auf deiner Website und stimmen mit deinem Google-Unternehmensprofil überein." },
    { art: "aimeasure", title: "Messung", body: "Wie oft deine Seiten in Googles KI-Antworten erscheinen, zeigt die Google Search Console. Die Zahl steht jeden Monat in deinem Bericht." },
  ],
  tier: "SEO",
  packageNote: "KI-Sichtbarkeit ist Teil des SEO-Pakets: Dieselben klaren Seiten, Antworten und Daten, die dich bei Google nach oben bringen, machen dich auch für KI-Assistenten verständlich.",
  cases: [
    {
      img: "/assets/v2/bento/herkules.webp",
      alt: "Laptop mit der Website von Herkules Umzüge",
      client: "Herkules Umzüge · Mannheim",
      stat: "392",
      statRest: "Einblendungen in Googles KI-Antworten im August 2026, nach 61 im Juni",
    },
  ],
  // Halyl, 2026-11-10: these client sites appear in AI chat answers. Keep a dated screenshot per client as the record.
  mentions: {
    title: "Auch in KI-Antworten genannt",
    chip: "In KI-Antworten",
    logos: ["/assets/v2/logos/openai.svg", "/assets/v2/logos/claude.svg", "/assets/v2/logos/googlegemini.svg"],
    text: "Websites, die wir gebaut haben, tauchen heute schon in Antworten von KI-Assistenten auf. Stand November 2026.",
    items: [
      { img: "/assets/v2/bento/hasan.webp", client: "Kanzlei Doğru", place: "Mannheim" },
      { img: "/assets/v2/bento/waschbar.webp", client: "Waschbar", place: "Heidelberg & Ludwigshafen" },
      { img: "/assets/v2/bento/treu.webp", client: "Treu Haustechnik", place: "Mannheim" },
      { img: "/assets/v2/bento/sg.webp", client: "SG Laserzentrum", place: "8 Standorte" },
    ],
  },
  cross: {
    label: "Die Grundlage",
    title: "SEO",
    text: "KI-Assistenten greifen auf dieselben Inhalte zu wie Google. Gute SEO ist deshalb das Fundament für deine KI-Sichtbarkeit.",
    href: SERVICE.seo,
  },
  faqs: [
    { q: "Was ist KI-Sichtbarkeit?", a: "KI-Sichtbarkeit heißt, dass Assistenten wie ChatGPT, Claude, Gemini oder die KI-Antworten in der Google-Suche deinen Betrieb kennen und nennen, wenn jemand nach deiner Leistung in deiner Region fragt." },
    { q: "Könnt ihr garantieren, dass ChatGPT mich empfiehlt?", a: "Nein, das kann niemand. Welche Betriebe eine KI nennt, entscheidet der Anbieter. Wir sorgen dafür, dass es über dich klare, übereinstimmende Informationen gibt. Genau die nutzen Assistenten für ihre Antworten." },
    { q: "Was ist der Unterschied zu SEO?", a: "Bei SEO geht es darum, in den Suchergebnissen weit oben zu stehen. Bei KI-Sichtbarkeit geht es darum, in einer Antwort genannt zu werden. Beides baut auf denselben Inhalten auf: klare Seiten, direkte Antworten und eindeutige Daten." },
    { q: "Was kostet KI-Sichtbarkeit?", a: "KI-Sichtbarkeit ist Teil des SEO-Pakets für 299 € im Monat, netto. Darin sind die Wartung deiner Website, bis zu 8 Blogartikel im Monat, neue Seiten und Landingpages und die laufende Optimierung enthalten." },
    { q: "Welche Assistenten sind gemeint?", a: "Vor allem ChatGPT, Claude und Gemini sowie die KI-Antworten direkt in der Google-Suche. Sie alle greifen auf Inhalte aus dem Internet zurück, auch auf deine Website." },
    { q: "Woran sehe ich, ob es wirkt?", a: "Für Google zeigt die Search Console, wie oft deine Seiten in KI-Antworten erscheinen. Diese Zahl steht zusammen mit Klicks, Anrufen und Anfragen in deinem Monatsbericht." },
  ],
};

export default function KiSichtbarkeitV2Route() {
  return <ServiceV2 cfg={cfg} current={SERVICE.ai} />;
}
