/*
 * Regenerates the blog part of public/sitemap.xml (every German article, lastmod = its publish date) and public/llms.txt
 * from app/components/blogData.tsx, so the sitemap, llms.txt and the prerender list (react-router.config.ts) can't drift apart.
 * Run: npx vite-node scripts/generate-seo-files.ts   (after adding or changing articles)
 */
import fs from "node:fs";
import { blogPosts } from "../app/components/blogData";
import { CITY_PATHS } from "../app/components/v2/cities";

const SITE = "https://nuell-agentur.com";
const posts = blogPosts.filter((p) => p.lang === "de").sort((a, b) => (a.date < b.date ? 1 : -1));

// sitemap: keep every non-blog <url>, rebuild the blog ones
const old = fs.readFileSync("public/sitemap.xml", "utf8");
const blocks = [...old.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);
const keep = blocks.filter((b) => !b.includes(`${SITE}/blog/`));
const blog = posts.map((p) => `  <url>\n    <loc>${SITE}/blog/${p.slug}</loc>\n    <lastmod>${p.date}</lastmod>\n  </url>`);
const body = [...keep.map((b) => (b.startsWith("  ") ? b : `  ${b}`)), ...blog].join("\n");
fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);

// llms.txt
const group = (re: RegExp) => posts.filter((p) => re.test(`${p.slug} ${p.category}`.toLowerCase()));
const line = (p: (typeof posts)[number]) => `- [${p.title}](${SITE}/blog/${p.slug})`;
const sections: [string, RegExp][] = [
  ["Kanzleien", /kanzlei|anwael|rechtsanw|steuerberater/],
  ["Arztpraxen", /praxis|arztpraxen|zahnarzt/],
  ["Handwerk", /handwerk|mannheim/],
  ["Berater, Coaches und Dienstleister", /berater|coaching|dienstleister|linkedin/],
];
const used = new Set<string>();
const blogLines = sections
  .map(([name, re]) => {
    const list = group(re).filter((p) => !used.has(p.slug));
    list.forEach((p) => used.add(p.slug));
    return list.length ? `### ${name}\n${list.map(line).join("\n")}` : "";
  })
  .filter(Boolean);
const rest = posts.filter((p) => !used.has(p.slug));
if (rest.length) blogLines.push(`### Websites, SEO, Google Ads und Marketing allgemein\n${rest.map(line).join("\n")}`);

const llms = `# nüll.

> nüll. ist eine Agentur aus Mannheim für Websites, SEO und Google Ads. Wir bauen Anfragesysteme für Handwerksbetriebe, Kanzleien, Arztpraxen, Berater und lokale Dienstleister: Besucher sollen per Anruf, WhatsApp oder Formular anfragen, und jede Anfrage wird gemessen. Websites stehen in 7 Tagen. Webdesign ab 1.499 € (Onepager) bzw. ab 1.999 € (ab 10 Seiten) einmalig, SEO ab 299 € im Monat, Google Ads mit 0 € Monatsgebühr, bis die erste Anfrage kommt (jeweils netto, Werbebudget zahlt der Kunde direkt an Google).

Marke: nüll. (auch: nuell, nüll Agentur Mannheim). Domain: ${SITE}
Kontakt: info@nüll.com (ASCII: info@xn--nll-hoa.com), Telefon und WhatsApp +49 1525 6569852
Sprache: Deutsch

## Leistungen
- [Leistungen im Überblick](${SITE}/leistungen)
- [Webdesign](${SITE}/leistungen/webdesign): Websites, die Besucher zu Anfragen machen
- [SEO](${SITE}/leistungen/seo): bei Google und Google Maps gefunden werden
- [Google Ads](${SITE}/leistungen/google-ads)
- [KI-Sichtbarkeit](${SITE}/leistungen/ki-sichtbarkeit): von ChatGPT, Claude, Gemini und Perplexity empfohlen werden
- [Content](${SITE}/leistungen/content): Videos und Social Media
- [Preise](${SITE}/preise)
- [Standorte und Städte](${SITE}/standorte)
- [Kostenloser Website-Check](${SITE}/website-check): Note von 0 bis 100 und die drei wichtigsten Baustellen, Report per E-Mail

## Städte
${CITY_PATHS.map((p) => `- ${SITE}${p}`).join("\n")}

## Referenzen
- [Alle Referenzen](${SITE}/referenzen)
- Treu Haustechnik, Onkel Abwassertechnik, FT Sicherheitstechnik, SG Laserzentrum, Waschbar, Bergstone Keramiksan, Kanzlei Doğru, S&O Beauty, B.Y. Consulting, Pflegedienst Orchidee

## Ratgeber (${posts.length} Artikel)
- [Alle Artikel](${SITE}/blog)
${blogLines.join("\n\n")}

## Rechtliches
- [Impressum](${SITE}/impressum)
- [Datenschutz](${SITE}/datenschutz)
`;
fs.writeFileSync("public/llms.txt", llms);
console.log("sitemap urls:", (body.match(/<loc>/g) || []).length, "| blog:", blog.length, "| llms.txt bytes:", llms.length);
