/*
 * Shared SEO meta for routes. React Router does not merge parent meta, so a route that returns only a title and a
 * description loses canonical, Open Graph and Twitter tags. withSocial() takes a route's own meta list and adds
 * whatever is missing: canonical, og:*, twitter:*. Titles and descriptions are never changed.
 */
export const SITE = "https://nuell-agentur.com";
export const OG_IMAGE = `${SITE}/og-image.png`;

type Item = Record<string, unknown>;

export function withSocial(path: string, items: Item[], opts: { image?: string; type?: "website" | "article"; extra?: Item[] } = {}): Item[] {
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const title = String(items.find((m) => "title" in m)?.title ?? "nüll.");
  const description = String(items.find((m) => m.name === "description")?.content ?? "");
  const has = (pred: (m: Item) => boolean) => items.some(pred);
  const out = [...items];
  if (!has((m) => m.rel === "canonical")) out.push({ tagName: "link", rel: "canonical", href: url });
  const og = (property: string, content: string) => {
    if (!has((m) => m.property === property)) out.push({ property, content });
  };
  og("og:type", opts.type ?? "website");
  og("og:title", title);
  if (description) og("og:description", description);
  og("og:url", url);
  og("og:image", opts.image ?? OG_IMAGE);
  og("og:locale", "de_DE");
  og("og:site_name", "nüll.");
  const tw = (name: string, content: string) => {
    if (!has((m) => m.name === name)) out.push({ name, content });
  };
  tw("twitter:card", "summary_large_image");
  tw("twitter:title", title);
  if (description) tw("twitter:description", description);
  tw("twitter:image", opts.image ?? OG_IMAGE);
  return [...out, ...(opts.extra ?? [])];
}

// <title> of an article: "Title | nüll." when it fits in about 62 characters, otherwise the part before the first colon, otherwise a word-boundary cut.
export function articleTitle(title: string): string {
  const suffix = " | nüll.";
  if ((title + suffix).length <= 62) return title + suffix;
  const head = title.split(":")[0].trim();
  if (head.length >= 22 && (head + suffix).length <= 62) return head + suffix;
  const max = 62 - suffix.length - 1;
  const cut = title.slice(0, max).replace(/\s+\S*$/, "").replace(/[,:;(]+$/, "");
  return cut + "…" + suffix;
}

// meta description: at most 158 characters, cut at a word boundary
export function articleDescription(text: string): string {
  if (text.length <= 158) return text;
  return text.slice(0, 155).replace(/\s+\S*$/, "").replace(/[,:;(]+$/, "") + "…";
}
