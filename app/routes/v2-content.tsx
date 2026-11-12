import ServiceV2, { type ServiceConfig } from "../components/v2/ServiceV2";
import { withSocial } from "../utils/seoMeta";
import { InstagramVisual } from "../components/v2/SystemVisuals";
import { SERVICE } from "../components/v2/links";

/*
 * /leistungen/content: the Content page ("Gesehen werden").
 * Package: PreiseV2 ADDONS "Content & Meta Ads" (1.249 €, 62,45 € per video, includes Meta Ads); Meta Ads alone 399 €.
 * Results (same sources as CasesV2):
 *  Bergstone: vault content index, 19 videos and 34 statics/stories, 23 Oct–5 Nov 2026; Meta reach 36,757 (account "Keramiksan", to 10 Nov 2026).
 *  Pflegedienst Orchidee (Fidelis): Meta, 41 applicant leads at 7,50 € from 3–24 Oct 2026.
 * The hero shows real reels we filmed for Bergstone and Treu. The package collage uses the example business "Dein Betrieb".
 */

export function meta() {
  return withSocial("/leistungen/content", [
    { title: "Content für Betriebe: Videos und Posts, die zeigen, was du kannst | nüll." },
    { name: "description", content: "Videos, Posts und Stories für Instagram und deine Website. Dreh vor Ort, Schnitt und Meta Ads inklusive. Bis zu 20 Videos im Monat, ab 62,45 € pro Video." },
  ]);
}

const cfg: ServiceConfig = {
  kind: "content",
  eyebrow: "Leistung · Content",
  titleMuted: "Wer dich sieht,",
  title: "fragt dich an",
  intro: "Videos und Texte, die zeigen, was du kannst. Für deine Website und für Instagram, damit Kunden dich kennen, bevor sie anfragen.",
  Visual: InstagramVisual,
  tint: "#fdf1f4",
  proof: { value: "19", text: "Videos in zwei Wochen für Bergstone Keramiksan, Okt. bis Nov. 2026." },
  photo: {
    src: "/assets/v2/services/content-scene.webp",
    alt: "Hand hält ein Smartphone in einem frisch renovierten Bad, das Instagram-Profil des Betriebs zeigt noch keine Beiträge",
    chips: ["Schaut sich dein Profil an", "Fragt woanders an"],
  },
  problem: {
    strong: "Du machst gute Arbeit.",
    muted: "Nur sieht sie keiner.",
    text: "Bevor Kunden anfragen, schauen sie sich an, wie du arbeitest: auf deiner Website und auf Instagram. Finden sie dort nichts, fragen sie bei jemandem an, der es zeigt.",
  },
  stepsTitle: "So zeigen wir, was du kannst",
  steps: [
    { art: "plan", title: "Planung", body: "Wir planen jeden Monat, was gezeigt wird: deine Projekte, dein Team und die Fragen, die deine Kunden immer wieder stellen." },
    { art: "shoot", title: "Dreh vor Ort", body: "Wir kommen zu dir und filmen echte Arbeit: auf der Baustelle, in der Werkstatt, mit deinem Team. Ohne Studio und ohne Schauspieler." },
    { art: "edit", title: "Schnitt und Text", body: "Daraus schneiden wir kurze Videos mit Untertiteln und schreiben die Texte dazu. Fertig für Instagram und für deine Website." },
    { art: "publish", title: "Veröffentlichen", body: "Videos, Posts und Stories gehen regelmäßig online. Mit Meta Ads sehen sie auch die Menschen in deiner Region, die dir noch nicht folgen." },
  ],
  tier: "Content & Meta Ads",
  packageNote: "Alles aus einer Hand: Wir planen, drehen bei dir vor Ort, schneiden, schreiben und veröffentlichen. Meta Ads sind dabei, damit deine Videos auch die Richtigen erreichen.",
  cases: [
    {
      img: "/assets/v2/bento/bergstone.webp",
      alt: "Arbeitsplatten von Bergstone Keramiksan, aus einem Reel",
      client: "Bergstone Keramiksan · Ludwigshafen",
      stat: "19 Videos",
      statRest: "in zwei Wochen, dazu 34 Bildmotive und Stories und 36.757 Menschen über Meta Ads erreicht, Okt. bis Nov. 2026",
    },
    {
      img: "/assets/v2/bento/orchidee.webp",
      alt: "Anzeigen für Pflegedienst Orchidee auf Facebook und Instagram",
      client: "Pflegedienst Orchidee · Koblenz",
      stat: "41 Bewerbungen",
      statRest: "von Pflegekräften in drei Wochen über Facebook und Instagram, 7,50 € pro Bewerbung, Okt. 2026",
    },
  ],
  cross: {
    label: "Gefunden werden",
    title: "SEO",
    text: "Wer dich auf Instagram gesehen hat, sucht dich später bei Google. Mit SEO wirst du dort auch gefunden.",
    href: SERVICE.seo,
  },
  faqs: [
    { q: "Was ist im Paket enthalten?", a: "Bis zu 20 Videos im Monat, 12 statische Posts und Stories, der Dreh bei dir vor Ort und der Schnitt. Meta Ads sind dabei: Wir führen dein Werbekonto, erstellen Anzeigen und optimieren laufend. Für 1.249 € im Monat, netto." },
    { q: "Was kostet ein Video?", a: "Bei 20 Videos im Monat sind es 62,45 € pro Video. Zahlst du 6 Monate im Voraus, sparst du 20 %. Dann sind es 49,96 € pro Video." },
    { q: "Wo wird gedreht?", a: "Bei dir: in deinem Betrieb, auf deinen Baustellen oder in deiner Werkstatt. So sieht man echte Arbeit statt Stockfotos." },
    { q: "Kann ich die Videos auch auf meiner Website nutzen?", a: "Ja. Die Videos und Texte sind für Instagram und für deine Website gedacht. So zeigt auch deine Website, wie du arbeitest." },
    { q: "Ist das Werbebudget enthalten?", a: "Nein. Das Werbebudget zahlst du direkt an Meta, ab 450 € im Monat. Die Führung deines Werbekontos ist im Paket enthalten." },
    { q: "Gibt es Meta Ads auch ohne Videos?", a: "Ja. Meta Ads gibt es einzeln für 399 € im Monat: Wir führen dein Werbekonto, erstellen statische Anzeigen und optimieren laufend." },
  ],
};

export default function ContentV2Route() {
  return <ServiceV2 cfg={cfg} current={SERVICE.content} />;
}
