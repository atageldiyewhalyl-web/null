import type { BlogPost } from "../../types";
import { postAudience } from "./blogShared";

/*
 * Bylines for the blog. Each article is assigned to one author by topic (one place to change it).
 * Names only: no roles, credentials, photos or profile links are invented. Add `role`, `url` or `sameAs` here once real ones exist;
 * the article schema picks them up.
 */
export type Author = { slug: string; name: string; topics: string };

export const AUTHORS: Author[] = [
  { slug: "lukas-schneider", name: "Lukas Schneider", topics: "Webdesign, SEO und Sichtbarkeit bei Google" },
  { slug: "maximilian-weber", name: "Maximilian Weber", topics: "Handwerk, Google Ads und Werbung" },
  { slug: "sophie-hoffmann", name: "Sophie Hoffmann", topics: "Kanzleien, Arztpraxen, Datenschutz und Pflichtangaben" },
];

const by = (slug: string) => AUTHORS.find((a) => a.slug === slug)!;

// legal and health topics (also Impressum, Datenschutz, Cookies): Sophie; Handwerk and ads: Maximilian; everything else: Lukas
export function authorFor(post: BlogPost): Author {
  const s = `${post.slug} ${post.category}`.toLowerCase();
  const audience = postAudience(post);
  if (audience === "Kanzleien" || audience === "Arztpraxen" || /impressum|dsgvo|datenschutz|heilmittel|cookie|whatsapp|bfsg|barrierefrei|43b|steuerberater/.test(s)) return by("sophie-hoffmann");
  if (audience === "Handwerk" || /google ads|ads-|-ads|werbung|handwerk/.test(s)) return by("maximilian-weber");
  return by("lukas-schneider");
}
