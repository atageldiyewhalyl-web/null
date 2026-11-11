import type { BlogPost } from "../../types";
import { blogPosts } from "../blogData";
import { BLOG, HOME, SERVICE } from "./links";

/*
 * Shared helpers for the v2 blog (overview, article page, homepage teaser). The posts themselves stay in blogData.tsx,
 * which the live /blog still uses; v2 only shows the German posts and reads them in its own design.
 */

export const postHref = (slug: string) => `${BLOG}/${slug}`;

// Each article's cover (one per article group since Nov 2026, in public/assets/blog/covers)
export const cover = (p: BlogPost) => p.image;

// German posts, newest first
export const dePosts = (): BlogPost[] => blogPosts.filter((p) => p.lang === "de").sort((a, b) => (a.date < b.date ? 1 : -1));

export const fmtDate = (d: string) => new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

// "15 min read", "18 Min. Lesezeit", "12 min" → "15 Min. Lesezeit"
export const fmtRead = (r?: string) => {
  const n = r?.match(/\d+/)?.[0];
  return n ? `${n} Min. Lesezeit` : "";
};

// Which service an article belongs to, from the first word of its category; links the reader to that service page.
export type PostService = { label: string; href: string; cta: string };
export function postService(p: BlogPost): PostService {
  const c = p.category.toLowerCase();
  if (c.startsWith("google ads")) return { label: "Google Ads", href: SERVICE.ads, cta: "Google-Anzeigen, die Anfragen bringen, und 0 € Monatsgebühr, bis die erste Anfrage kommt." };
  if (c.startsWith("seo")) return { label: "SEO", href: SERVICE.seo, cta: "Bei Google gefunden werden, mit klaren Leistungsseiten und jeden Monat echten Zahlen." };
  if (c.startsWith("web")) return { label: "Webdesign", href: SERVICE.web, cta: "Eine Website, die zur Anfrage führt: per Formular, Anruf oder WhatsApp, jede Anfrage gemessen." };
  return { label: "Online-Marketing", href: `${HOME}#so-funktionierts`, cta: "Website, Google und Anzeigen als ein System, das jeden Monat Anfragen bringt." };
}

// Mid-article call to action: "[CTA: key | optional headline]" in the content. Keys map to the service pages.
export const CTA_SERVICES: Record<string, PostService & { headline: string }> = {
  web: { label: "Webdesign", href: SERVICE.web, headline: "Soll deine Website endlich Anfragen bringen?", cta: "Wir bauen sie in 7 Tagen: klares Angebot, Anruf und WhatsApp mit einem Tipp, jede Anfrage gemessen." },
  seo: { label: "SEO", href: SERVICE.seo, headline: "Willst du in Mannheim bei Google gefunden werden?", cta: "Leistungsseiten, Google-Profil und lokale SEO, mit echten Zahlen jeden Monat. Für 299 € im Monat." },
  ads: { label: "Google Ads", href: SERVICE.ads, headline: "Sollen Anfragen schon nächste Woche kommen?", cta: "Google-Anzeigen nur für die Suchen, die zu dir passen. 0 € Monatsgebühr, bis die erste Anfrage kommt." },
  ai: { label: "KI-Sichtbarkeit", href: SERVICE.ai, headline: "Soll ChatGPT deinen Betrieb empfehlen?", cta: "Wir bereiten deine Inhalte so auf, dass KI-Assistenten dich kennen und nennen. Teil des SEO-Pakets." },
  content: { label: "Content", href: SERVICE.content, headline: "Willst du zeigen, was du kannst?", cta: "Wir drehen bei dir vor Ort, schneiden und posten. Videos, die Vertrauen schaffen und Anfragen bringen." },
  meta: { label: "Meta Ads", href: SERVICE.content, headline: "Sollen Leute in deiner Gegend dich auf Instagram sehen?", cta: "Anzeigen auf Facebook und Instagram, gezielt im Raum Mannheim, mit laufend neuen Motiven." },
};

// Who the article is written for, read from the slug (and the category for the Handwerk cluster)
export function postAudience(p: BlogPost): string | null {
  const s = p.slug;
  if (/handwerk/.test(s) || /handwerk/i.test(p.category)) return "Handwerk";
  if (/kanzlei|anwael|rechtsanw/.test(s)) return "Kanzleien";
  if (/arztpraxen|praxis/.test(s)) return "Arztpraxen";
  return null;
}

export const postTag = (p: BlogPost) => [postService(p).label, postAudience(p)].filter(Boolean).join(" · ");

export const slugify = (t: string) =>
  t
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
