import { useParams, Link } from "react-router";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ChevronDown, CheckCircle2, AlertCircle, TrendingUp, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { blogPosts } from "./blogData";
import { useState, useMemo } from "react";
import { StructuredData } from "./SEO";

// --- Custom Interactive Components ---

const FAQSection = ({ faqs, articleLang, title }: { faqs: { question: string, answer: string }[], articleLang: string, title?: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-32 pt-32 border-t border-neutral-100">
      <h3 className="text-[2.5rem] font-bold tracking-[-0.04em] mb-12 font-outfit">
        {title ?? (articleLang === "de" ? "Häufig gestellte Fragen (FAQ)" : "Frequently Asked Questions")}
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="rounded-3xl border border-neutral-100 bg-neutral-50/50 overflow-hidden transition-all duration-300 hover:border-[#0071e3]/30"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-8 flex items-center justify-between text-left hover:bg-neutral-100/50 transition-colors"
            >
              <span className="text-[1.25rem] font-bold text-black pr-8">{faq.question}</span>
              <div className={`shrink-0 w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} className="text-[#0071e3]" />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-8 pb-8 text-[1.125rem] leading-[1.8] text-neutral-600">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuditChecklist = ({ items, articleLang }: { items: string[], articleLang: string }) => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  
  const score = useMemo(() => {
    return Object.values(checked).filter(Boolean).length * 2;
  }, [checked]);

  const maxScore = items.length * 2;

  const getScoreColor = () => {
    if (score >= maxScore * 0.8) return "bg-green-500";
    if (score >= maxScore * 0.5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreMessage = () => {
    if (articleLang === "de") {
      if (score >= 40) return "Exzellent. Deine Website ist gut optimiert.";
      if (score >= 25) return "Solide. Klare Verbesserungspotenziale existieren.";
      return "Kritisch. Deine Website verliert täglich Kunden.";
    }
    return score >= 40 ? "Excellent. Your site is high-converting." : score >= 25 ? "Moderate performer. Improvement areas exist." : "Critical. Immediate improvements required.";
  };

  return (
    <div className="my-16 p-1 rounded-[3rem] bg-gradient-to-br from-neutral-100 to-white border border-neutral-200 shadow-2xl shadow-black/5 overflow-hidden">
      <div className="bg-white rounded-[2.8rem] p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-neutral-100 pb-12">
          <div>
            <h4 className="text-[1.75rem] font-bold mb-2 font-outfit">Audit Scoring</h4>
            <p className="text-neutral-500 font-medium">{getScoreMessage()}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[2.5rem] font-bold leading-none font-outfit">{score}<span className="text-neutral-300 text-[1.5rem]">/{maxScore}</span></div>
              <div className="text-xs font-black uppercase tracking-widest text-neutral-400 mt-2">Conversion Score</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
              <TrendingUp size={24} className={score >= 25 ? "text-green-500" : "text-red-500"} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}
              className="w-full flex items-center gap-5 p-5 rounded-2xl border border-neutral-100 hover:border-[#0071e3]/30 hover:bg-neutral-50/50 transition-all text-left group"
            >
              <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${checked[idx] ? 'bg-[#0071e3] border-[#0071e3] shadow-lg shadow-[#0071e3]/20' : 'border-neutral-200 group-hover:border-[#0071e3]/50 bg-white'}`}>
                {checked[idx] && <CheckCircle2 size={16} className="text-white" />}
              </div>
              <span className={`text-[1.125rem] font-medium transition-colors ${checked[idx] ? 'text-black' : 'text-neutral-500'}`}>
                {item.replace(/\[\s\]\s*/, "")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-100">
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${getScoreColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${(score / maxScore) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonCard = ({ before, after, articleLang }: { before: string, after: string, articleLang: string }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 relative group overflow-hidden">
        <div className="absolute top-4 right-4 text-[0.65rem] font-black uppercase tracking-widest text-red-400 bg-red-50 px-2 py-1 rounded">
          {articleLang === "de" ? "Vermeiden" : "Avoid"}
        </div>
        <div className="flex items-center gap-3 mb-4 text-red-500 opacity-40 group-hover:opacity-100 transition-opacity">
          <X size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">{articleLang === "de" ? "Schlechte Conversion" : "Low Conversion"}</span>
        </div>
        <p className="text-[1.25rem] font-bold text-neutral-400 italic">"{before}"</p>
      </div>
      <div className="p-8 rounded-3xl bg-[#0071e3]/5 border border-[#0071e3]/20 relative group overflow-hidden shadow-xl shadow-[#0071e3]/5">
        <div className="absolute top-4 right-4 text-[0.65rem] font-black uppercase tracking-widest text-[#0071e3] bg-white px-2 py-1 rounded shadow-sm">
          {articleLang === "de" ? "Optimiert" : "Optimized"}
        </div>
        <div className="flex items-center gap-3 mb-4 text-[#0071e3]">
          <TrendingUp size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">{articleLang === "de" ? "Hohe Conversion" : "High Conversion"}</span>
        </div>
        <p className="text-[1.25rem] font-bold text-black italic">"{after}"</p>
      </div>
    </div>
  );
};

// --- End Interactive Components ---

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  
  const post = blogPosts.find((p) => p.slug === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!post) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen text-center">
        <h1 className="text-2xl mb-4 font-bold">Post not found</h1>
        <Link to="/blog" className="text-[#0071e3] hover:underline">Back to blog</Link>
      </div>
    );
  }

  const articleLang = post.lang;

  const formattedDate = new Date(post.date).toLocaleDateString(articleLang === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shareLabels = {
    idle: articleLang === "de" ? "Teilen" : "Share",
    copied: articleLang === "de" ? "Link kopiert" : "Link copied",
    error: articleLang === "de" ? "Kopieren fehlgeschlagen" : "Could not copy",
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `${baseUrl}/blog/${post.slug}`;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("Clipboard API unavailable");
      }

      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 1800);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setShareStatus("error");
      window.setTimeout(() => setShareStatus("idle"), 2200);
    }
  };

  const related = blogPosts
    .filter((p) => p.groupId !== post.groupId && p.lang === articleLang)
    .slice(0, 2);

  const headers = post.content
    .filter(block => block.startsWith("## "))
    .map(block => block.replace("## ", ""));

  const baseUrl = "https://xn--nll-hoa.com";
  const articleKeywords: Record<string, string> = {
    "freelancer-oder-agentur-website": "freelancer oder agentur, webdesign freelancer, website kosten vergleich, webdesign preise",
    "freelancer-vs-agency-website": "freelancer vs agency, web design agency, freelance web designer, website design cost",
    "webdesign-fuer-anwaelte-kanzleien": "webdesign für anwälte, kanzlei website, SEO rechtsanwalt, mandanten gewinnen online",
    "web-design-for-lawyers-law-firms": "web design for lawyers, law firm website design, SEO for law firms, legal website design, law firm digital marketing",
  };
  const customArticleStructuredData: Record<string, object> = {
    "freelancer-oder-agentur-website": {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Freelancer oder Agentur für deine Website? Der ehrliche Vergleich für Selbstständige",
      description: "Wer baut die bessere Website — Freelancer oder Agentur? Kosten, SEO und Verlässlichkeit im Direktvergleich für Berater und Kanzleien.",
      author: { "@type": "Organization", name: "nüll.", url: "https://xn--nll-hoa.com" },
      publisher: {
        "@type": "Organization",
        name: "nüll.",
        logo: { "@type": "ImageObject", url: "https://xn--nll-hoa.com/logo.png" },
      },
      datePublished: "2026-05-04",
      dateModified: "2026-05-04",
      inLanguage: "de",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://xn--nll-hoa.com/blog/freelancer-oder-agentur-website",
      },
      keywords: "freelancer oder agentur, webdesign freelancer, website kosten vergleich, webdesign preise",
    },
    "freelancer-vs-agency-website": {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Freelancer vs. Agency for Your Website: An Honest Comparison for Consultants and Law Firms",
      description: "Freelancer or agency — who builds the better website for consultants and law firms? Honest comparison of costs, SEO, and long-term reliability.",
      author: { "@type": "Organization", name: "nüll.", url: "https://xn--nll-hoa.com" },
      publisher: {
        "@type": "Organization",
        name: "nüll.",
        logo: { "@type": "ImageObject", url: "https://xn--nll-hoa.com/logo.png" },
      },
      datePublished: "2026-05-04",
      dateModified: "2026-05-04",
      inLanguage: "en",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://xn--nll-hoa.com/blog/freelancer-vs-agency-website",
      },
      keywords: "freelancer vs agency, web design agency, freelance web designer, website design cost",
    },
  };
  const articleStructuredData = customArticleStructuredData[post.slug] ?? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      name: "nüll.",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "nüll.",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.svg`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    image: post.image.startsWith("http") ? post.image : `${baseUrl}${post.image}`,
    keywords: articleKeywords[post.slug] ?? post.category,
  };

  const faqStructuredData = post.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="bg-white selection:bg-primary selection:text-white">
      <StructuredData data={articleStructuredData} />
      {faqStructuredData && <StructuredData data={faqStructuredData} />}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#0071e3] origin-left z-[1000]"
        style={{ scaleX }}
      />

      <main className="pt-48 pb-24 min-h-screen">
        <article>
          <div className="max-w-5xl mx-auto px-6 mt-12 mb-12 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-[0.875rem] font-bold text-neutral-400 hover:text-black transition-all"
              >
                <div className="p-1.5 rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition-colors">
                  <ArrowLeft size={14} />
                </div>
                {articleLang === "de" ? "Zurück zu den Insights" : "Back to Insights"}
              </Link>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                aria-live="polite"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-semibold text-sm ${
                  shareStatus === "copied"
                    ? "border-[#0071e3]/20 bg-[#0071e3]/10 text-[#0071e3]"
                    : shareStatus === "error"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                <Share2 size={16} /> {shareLabels[shareStatus]}
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[0.75rem] font-extrabold uppercase tracking-[0.1em] mb-10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
              {post.category}
            </motion.div>
            
            <motion.h1
              className="text-[clamp(2.5rem,8vw,5.5rem)] tracking-[-0.05em] leading-[1] mb-12 font-bold text-black text-gradient font-outfit"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {post.title}
            </motion.h1>

            <motion.p
              className="text-[clamp(1.125rem,2vw,1.5rem)] text-neutral-500 leading-relaxed font-medium max-w-3xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {post.excerpt}
            </motion.p>

            <motion.div 
              className="flex items-center gap-8 text-[0.9375rem] text-neutral-500 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Calendar size={14} className="text-neutral-400" />
                </div>
                {formattedDate}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Clock size={14} className="text-neutral-400" />
                </div>
                {post.readTime}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="max-w-[1400px] mx-auto px-6 mb-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="aspect-[21/9] overflow-hidden rounded-[3rem] bg-neutral-100 shadow-2xl shadow-black/10 ring-1 ring-black/5 relative">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-20">
            <div className="blog-prose lg:max-w-3xl">
              {post.content[0]?.startsWith("> ") && (
                <motion.div 
                  className="mb-16 p-10 rounded-[2.5rem] bg-[#f5f5f7] border border-black/5 relative overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Bookmark size={120} />
                  </div>
                  <h3 className="text-[1.5rem] font-bold mb-6 text-black flex items-center gap-3 font-outfit">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm">!</div>
                    {articleLang === "de" ? "Zusammenfassung" : "Quick Summary"}
                  </h3>
                  <p className="text-[1.125rem] text-neutral-600 leading-relaxed italic mb-0">
                    {post.content[0].replace("> ", "").replace("**Key Takeaways:**", "").replace("**Zusammenfassung:**", "").replace("**Önemli Çıkarımlar:**", "").trim()}
                  </p>
                </motion.div>
              )}

              {post.content.map((block, i) => {
                if (i === 0 && block.startsWith("> ")) return null;

                // Handle Checklist Detection
                if (block.startsWith("- [ ]")) {
                  // Collect all sequential checklist items
                  const checklistItems: string[] = [];
                  let j = i;
                  while (j < post.content.length && post.content[j].startsWith("- [ ]")) {
                    checklistItems.push(post.content[j]);
                    j++;
                  }
                  // Only render if we are at the start of the sequence to avoid duplicates
                  if (i > 0 && post.content[i-1].startsWith("- [ ]")) return null;
                  return <AuditChecklist key={i} items={checklistItems} articleLang={articleLang} />;
                }

                // Handle Comparison Detection
                if (block.includes("[BEFORE]") && block.includes("[AFTER]")) {
                  const match = block.match(/\[BEFORE\]\s*"?(.*?)"?\s*\[AFTER\]\s*"?(.*?)"?$/);
                  if (match) {
                    return <ComparisonCard key={i} before={match[1]} after={match[2]} articleLang={articleLang} />;
                  }
                }

                if (block.startsWith("## ")) {
                  const text = block.replace("## ", "");
                  return (
                    <motion.h2
                      key={i}
                      id={text.toLowerCase().replace(/\s+/g, "-")}
                      className="scroll-mt-32 group relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <span className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#0071e3] font-bold text-2xl hidden lg:block">#</span>
                      {text}
                    </motion.h2>
                  );
                }

                if (block.startsWith("### ")) {
                  const text = block.replace("### ", "");
                  return (
                    <motion.h3
                      key={i}
                      className="text-[1.75rem] font-bold mt-12 mb-6 text-black font-outfit"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      {text}
                    </motion.h3>
                  );
                }
                
                const firstActualParagraphIndex = post.content.findIndex((b, idx) => !b.startsWith("## ") && (idx > 0 || !b.startsWith("> ")));
                const isFirstParagraph = i === firstActualParagraphIndex;

                const renderText = (text: string) => {
                  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
                  return parts.map((part, index) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={index} className="font-bold text-black bg-[#0071e3]/5 px-1 rounded">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith("*") && part.endsWith("*")) {
                      return <em key={index}>{part.slice(1, -1)}</em>;
                    }
                    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                    if (linkMatch) {
                      const [, label, href] = linkMatch;
                      return (
                        <Link key={index} to={href} className="font-bold text-[#0071e3] hover:underline">
                          {label}
                        </Link>
                      );
                    }
                    return part;
                  });
                };
                
                if (block.startsWith("> ")) {
                  return (
                    <blockquote key={i} className="border-l-4 border-[#0071e3] pl-6 py-2 my-8 italic text-neutral-600 text-lg">
                      {renderText(block.replace("> ", ""))}
                    </blockquote>
                  );
                }

                if (block.trim().startsWith("|")) {
                  if (i > 0 && post.content[i - 1].trim().startsWith("|")) return null;

                  const tableLines: string[] = [];
                  let j = i;
                  while (j < post.content.length && post.content[j].trim().startsWith("|")) {
                    tableLines.push(post.content[j].trim());
                    j++;
                  }

                  const rows = tableLines
                    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
                    .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));

                  const [headerCells, ...bodyRows] = rows;

                  return (
                    <div key={i} className="my-12 overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                          <thead className="bg-neutral-50">
                            <tr>
                              {headerCells.map((cell, cellIndex) => (
                                <th key={cellIndex} className="px-6 py-4 text-sm font-black uppercase tracking-wider text-neutral-500">
                                  {renderText(cell)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {bodyRows.map((row, rowIndex) => {
                              const isHighlighted = row.some((cell) => cell.includes("Nüll."));

                              return (
                                <tr
                                  key={rowIndex}
                                  className={`border-t ${
                                    isHighlighted
                                      ? "border-[#0071e3]/20 bg-[#0071e3]/5"
                                      : "border-neutral-100"
                                  }`}
                                >
                                  {row.map((cell, cellIndex) => (
                                    <td
                                      key={cellIndex}
                                      className={`px-6 py-5 align-top text-[1rem] leading-relaxed ${
                                        isHighlighted
                                          ? "font-bold text-[#0e0e10]"
                                          : "text-neutral-600"
                                      }`}
                                    >
                                      {renderText(cell)}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }

                if (block.startsWith("- ")) {
                  return (
                    <div key={i} className="flex items-start gap-3 mb-4 pl-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2.5 shrink-0" />
                      <p className="text-[1.125rem] leading-[1.8] text-[#424245] font-medium m-0">
                        {renderText(block.replace("- ", ""))}
                      </p>
                    </div>
                  );
                }

                if (/^\d+\./.test(block)) {
                   return (
                    <div key={i} className="flex items-start gap-4 mb-6">
                      <span className="text-[#0071e3] font-bold text-lg min-w-[1.5rem]">{block.match(/^\d+/)?.[0]}.</span>
                      <p className="text-[1.125rem] leading-[1.8] text-[#424245] font-medium m-0">
                        {renderText(block.replace(/^\d+\.\s*/, ""))}
                      </p>
                    </div>
                  );
                }

                if (block.startsWith("[BEFORE]")) {
                  const match = block.match(/\[BEFORE\]\s*"(.*?)"\s*\[AFTER\]\s*"(.*?)"/);
                  if (match) {
                    return <ComparisonCard key={i} before={match[1]} after={match[2]} articleLang={articleLang} />;
                  }
                }

                if (block.startsWith("- [ ]")) {
                  // Group contiguous checklist items
                  const checklistItems: string[] = [];
                  let j = i;
                  while (j < post.content.length && post.content[j].startsWith("- [ ]")) {
                    checklistItems.push(post.content[j].replace("- [ ] ", ""));
                    j++;
                  }
                  
                  // Only render the checklist once for the whole group
                  if (i > 0 && post.content[i-1].startsWith("- [ ]")) return null;
                  
                  return <AuditChecklist key={i} items={checklistItems} articleLang={articleLang} />;
                }

                return (
                  <motion.p
                    key={i}
                    className={isFirstParagraph ? "drop-cap font-medium text-neutral-900" : "text-[1.125rem] leading-[1.8] text-[#424245] mb-8 font-medium"}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    {renderText(block)}
                  </motion.p>
                );
              })}

              {/* Render Structured FAQs if they exist */}
              {post.faqs && <FAQSection faqs={post.faqs} articleLang={articleLang} title={post.faqTitle} />}

              {/* Author Section */}
              <div className="mt-32 pt-16 border-t border-neutral-100">
                <div className="p-10 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-black/20">N</div>
                  <div className="text-center md:text-left flex-1">
                    <h4 className="text-[1.5rem] font-bold mb-2">Nüll. Editorial Team</h4>
                    <p className="text-[1rem] text-neutral-500 mb-6 leading-relaxed">
                      {articleLang === "de" 
                        ? "Experten für digitale Positionierung, Premium-Webdesign und Marketingstrategie für ambitionierte Unternehmen." 
                        : "Experts in digital positioning, premium webdesign, and marketing strategy for ambitious businesses."}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {['LinkedIn', 'Website', 'WhatsApp'].map(p => (
                        <button key={p} className="px-5 py-2 rounded-full bg-white border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-12">
                <div className="space-y-6">
                  <h4 className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-neutral-400">
                    {articleLang === "de" ? "Auf dieser Seite" : "On this page"}
                  </h4>
                  <nav className="space-y-4">
                    {headers.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group flex items-center gap-3 text-[0.9375rem] font-bold text-neutral-400 hover:text-[#0071e3] transition-all"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-[#0071e3] transition-colors" />
                        {h}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="p-8 rounded-[2rem] bg-[#0e0e10] text-white relative overflow-hidden shadow-2xl shadow-black/20">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Share2 size={80} />
                  </div>
                  <h4 className="text-[1.25rem] font-bold mb-4 relative z-10">Newsletter</h4>
                  <p className="text-[0.875rem] text-white/50 mb-8 leading-relaxed relative z-10">
                    {articleLang === "de" 
                      ? "Schließen Sie sich 500+ Experten an, die wöchentlich Insights zur digitalen Autorität erhalten." 
                      : "Join 500+ experts receiving weekly insights on digital authority."}
                  </p>
                  <div className="space-y-3 relative z-10">
                    <input 
                      type="email" 
                      placeholder={articleLang === "de" ? "Ihre E-Mail" : "Your email"}
                      className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    />
                    <button className="w-full py-4 bg-[#0071e3] text-white rounded-2xl text-[0.875rem] font-bold hover:bg-[#0066d6] transition-all active:scale-95">
                      {articleLang === "de" ? "Insights erhalten" : "Get Insights"}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>

        <div className="max-w-7xl mx-auto px-6 mt-48">
          <motion.div 
            className="relative overflow-hidden rounded-[4rem] bg-neutral-900 text-white p-12 md:p-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0071e3] opacity-30 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[0.75rem] font-black uppercase tracking-[0.2em] mb-10">
                {articleLang === "de" ? "Nächste Schritte" : "Next Steps"}
              </div>
              <h3 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-[-0.05em] leading-[1] mb-10 font-outfit">
                {articleLang === "de" 
                  ? "Verwandeln Sie Ihr Unternehmen in eine starke digitale Marke." 
                  : "Transform your business into a strong digital brand."}
              </h3>
              <p className="text-[1.25rem] text-white/60 mb-12 leading-relaxed max-w-xl">
                {articleLang === "de" 
                  ? "Wir bauen nicht nur Websites. Wir schaffen digitale Auftritte, die Vertrauen aufbauen und planbares Wachstum ermöglichen." 
                  : "We don't just build websites. We build digital presences that earn trust and deliver predictable growth for businesses."}
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full text-[1.125rem] font-bold hover:bg-[#0071e3] hover:text-white transition-all duration-500 hover:scale-[1.02] active:scale-95 group shadow-2xl shadow-black/20"
              >
                {articleLang === "de" ? "Strategiegespräch buchen" : "Schedule a Consultation"} <ArrowLeft size={22} className="rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-48">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h3 className="text-[2.5rem] font-bold tracking-[-0.04em] mb-4 font-outfit">
                  {articleLang === "de" ? "Weiterführende Lektüre" : "Further Reading"}
                </h3>
                <p className="text-[1.125rem] text-neutral-500 font-medium">
                  {articleLang === "de" 
                    ? "Mehr Insights für ambitionierte Unternehmen." 
                    : "More insights for ambitious businesses."}
                </p>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-2 text-[1rem] font-bold text-[#0071e3] hover:translate-x-1 transition-transform">
                {articleLang === "de" ? "Zum Archiv" : "View the archive"} <ArrowLeft size={20} className="rotate-180" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group block"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-neutral-100 mb-8 shadow-sm ring-1 ring-black/5 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/10 group-hover:-translate-y-1">
                    <ImageWithFallback
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-[#0071e3]">
                        {r.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span className="text-[0.875rem] font-semibold text-neutral-400">
                        {r.readTime}
                      </span>
                    </div>
                    <h4 className="text-[1.75rem] font-bold tracking-[-0.03em] leading-tight group-hover:text-[#0071e3] transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                    <p className="text-[1rem] text-neutral-500 line-clamp-2 leading-relaxed">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
