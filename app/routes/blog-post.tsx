import { BlogPost } from "../components/BlogPost";
import { getBlogPostBySlug, getBlogTranslations, getXDefaultPost } from "../utils/i18nRouting";

export function meta({ params }: { params: { slug?: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return [];
  const baseUrl = "https://xn--nll-hoa.com";
  const translations = getBlogTranslations(post);
  const xDefaultPost = getXDefaultPost(post);
  const lawFirmMeta: Record<string, {
    title: string;
    description: string;
    keywords: string;
    ogDescription: string;
    author: string;
    tags: string[];
    canonical?: string;
    ogTitle?: string;
    alternates?: { lang: string; href: string }[];
    xDefault?: string;
  }> = {
    "freelancer-oder-agentur-website": {
      title: "Freelancer oder Agentur für deine Website? Der ehrliche Vergleich für Selbstständige | nüll.",
      description: "Freelancer oder Agentur — wer baut die bessere Website für Berater und Kanzleien? Kosten, Qualität, SEO und Verlässlichkeit im direkten Vergleich. Mit konkreten Empfehlungen.",
      keywords: "freelancer oder agentur website, webdesign freelancer, freelancer vs agentur, website erstellen lassen freelancer, webdesign kosten vergleich, professionelle website kosten, webdesign preise, freelancer webdesign, website agentur vergleich",
      ogTitle: "Freelancer oder Agentur für deine Website? Der ehrliche Vergleich",
      ogDescription: "Wer baut die bessere Website — Freelancer oder Agentur? Kosten, SEO und Verlässlichkeit im Direktvergleich für Berater und Kanzleien.",
      author: "Nüll. Redaktion",
      tags: ["Webdesign Freelancer", "Website Kosten", "Webdesign Agentur"],
      canonical: "https://xn--nll-hoa.com/blog/freelancer-oder-agentur-website",
      alternates: [
        { lang: "de", href: "https://xn--nll-hoa.com/blog/freelancer-oder-agentur-website" },
        { lang: "en", href: "https://xn--nll-hoa.com/blog/freelancer-vs-agency-website" },
      ],
      xDefault: "https://xn--nll-hoa.com/blog/freelancer-oder-agentur-website",
    },
    "freelancer-vs-agency-website": {
      title: "Freelancer vs. Agency for Your Website: An Honest Comparison for Consultants | nüll.",
      description: "Freelancer or web agency — who builds the better website? An honest comparison of costs, SEO, reliability, and results for consultants and law firms. With a free decision checklist.",
      keywords: "freelancer vs agency website, freelance web designer vs agency, web design agency, hire web designer, website design cost, how much does a website cost, web design prices, professional website design, freelancer or agency for website",
      ogTitle: "Freelancer vs. Agency for Your Website: An Honest Comparison",
      ogDescription: "Freelancer or agency — who builds the better website for consultants and law firms? Honest comparison of costs, SEO, and long-term reliability.",
      author: "Nüll. Editorial",
      tags: ["Freelance Web Designer", "Website Design Cost", "Web Design Agency"],
      canonical: "https://xn--nll-hoa.com/blog/freelancer-vs-agency-website",
      alternates: [
        { lang: "en", href: "https://xn--nll-hoa.com/blog/freelancer-vs-agency-website" },
        { lang: "de", href: "https://xn--nll-hoa.com/blog/freelancer-oder-agentur-website" },
      ],
      xDefault: "https://xn--nll-hoa.com/blog/freelancer-oder-agentur-website",
    },
    "webdesign-fuer-anwaelte-kanzleien": {
      title: "Webdesign für Anwälte und Kanzleien: Was eine gute Website wirklich braucht | nüll.",
      description: "Webdesign für Anwälte: Wir zeigen, was eine Kanzlei-Website 2026 wirklich braucht, von Struktur über SEO bis zu Vertrauen. Mit Checkliste zum Download.",
      keywords: "webdesign für anwälte, webdesign kanzlei, webdesign rechtsanwalt, anwalt website erstellen, kanzlei homepage, website für rechtsanwalt, webdesign anwaltskanzlei, SEO für kanzlei, mandanten gewinnen online",
      ogDescription: "Was macht eine Kanzlei-Website 2026 wirklich erfolgreich? Struktur, SEO, Vertrauenssignale, komplett erklärt mit Checkliste.",
      author: "Nüll. Redaktion",
      tags: ["Webdesign für Anwälte", "Kanzlei Website", "SEO Rechtsanwalt"],
    },
    "web-design-for-lawyers-law-firms": {
      title: "Web Design for Lawyers and Law Firms: What a Great Legal Website Actually Needs | nüll.",
      description: "Web design for lawyers: discover what makes a law firm website actually bring in clients in 2026, from structure and SEO to trust signals. Free checklist included.",
      keywords: "web design for lawyers, law firm website design, lawyer website design, legal website design, SEO for law firms, law firm web design, attorney website design, law firm digital marketing, how to get more clients as a lawyer",
      ogDescription: "Most law firm websites look fine but bring in zero clients. Here's what actually works in 2026, with a free checklist.",
      author: "Nüll. Editorial",
      tags: ["Web Design for Lawyers", "Law Firm Website", "Legal SEO"],
    },
  };
  const customMeta = lawFirmMeta[post.slug];
  
  return [
    { title: customMeta ? customMeta.title : `${post.title} | Nüll. Blog` },
    { name: "description", content: customMeta ? customMeta.description : post.excerpt },
    ...(customMeta ? [{ name: "keywords", content: customMeta.keywords }] : []),
    { property: "og:title", content: customMeta?.ogTitle ?? post.title },
    { property: "og:description", content: customMeta ? customMeta.ogDescription : post.excerpt },
    { property: "og:image", content: post.image },
    { property: "og:type", content: "article" },
    { property: "og:url", content: customMeta?.canonical ?? `${baseUrl}/blog/${post.slug}` },
    { property: "og:locale", content: post.lang === "de" ? "de_DE" : "en_GB" },
    { property: "og:site_name", content: "nüll." },
    { property: "article:published_time", content: post.date },
    { property: "article:author", content: customMeta ? customMeta.author : "Nüll. Redaktion" },
    { property: "article:section", content: post.category },
    ...(customMeta ? customMeta.tags.map((tag) => ({ property: "article:tag", content: tag })) : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.excerpt },
    { name: "twitter:image", content: post.image },
    { tagName: "link", rel: "canonical", href: customMeta?.canonical ?? `${baseUrl}/blog/${post.slug}` },
    ...(customMeta?.alternates ?? translations.filter((translation) => translation.lang !== "tr").map((translation) => ({
      lang: translation.lang,
      href: `${baseUrl}/blog/${translation.slug}`,
    }))).map((translation) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: translation.lang,
      href: translation.href,
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: customMeta?.xDefault ?? `${baseUrl}/blog/${xDefaultPost.slug}`,
    },
  ];
}

export default function BlogPostRoute() {
  return <BlogPost />;
}
