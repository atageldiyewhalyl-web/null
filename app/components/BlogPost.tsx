import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ChevronDown, CheckCircle2, AlertCircle, TrendingUp, X, ExternalLink, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { blogPosts } from "./blogData";
import { useEffect, useRef, useState, useMemo } from "react";
import { StructuredData } from "./SEO";
import type { Provider } from "../types";

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

const ProviderEditorialList = ({ providers }: { providers: Provider[] }) => {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="my-14 border-y border-neutral-100">
      {providers.map((provider, idx) => (
        <div key={provider.name} className="grid grid-cols-[3rem_1fr] gap-5 border-b border-neutral-100 py-7 last:border-b-0">
          <div className="font-outfit text-[1.25rem] font-bold text-neutral-300">
            {String(provider.rank ?? idx + 1).padStart(2, "0")}
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="m-0 font-outfit text-[1.35rem] font-bold tracking-[-0.03em] text-black">
                {provider.name}
              </h4>
              {provider.badge ? (
                <span className="border-l border-neutral-300 pl-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-neutral-400">
                  {provider.badge}
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              {provider.pros.slice(0, 3).map((pro) => (
                <p key={pro} className="m-0 text-[1rem] font-medium leading-relaxed text-neutral-600">
                  {pro}
                </p>
              ))}
              {provider.cons?.slice(0, 1).map((con) => (
                <p key={con} className="m-0 text-[0.95rem] font-medium leading-relaxed text-neutral-400">
                  Grenze: {con}
                </p>
              ))}
            </div>
            {provider.url ? (
              <a
                href={provider.url}
                target={provider.url.startsWith("/") ? undefined : "_blank"}
                rel={provider.url.startsWith("/") ? undefined : "noopener noreferrer"}
                className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-bold text-[#0071e3] hover:underline"
              >
                Anbieter ansehen <ExternalLink size={14} />
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

const PositivbeispielBlock = () => (
  <div className="my-14 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
      <img
        src="/assets/blog/kanzlei-dogru-fotoshooting.jpg"
        alt="Kanzlei Dogru Mannheim"
        className="h-full min-h-[340px] w-full object-cover"
      />
      <div className="flex flex-col justify-between bg-neutral-50 p-8">
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">Positivbeispiel</p>
              <p className="mt-1 text-xl font-bold tracking-[-0.03em] text-black">Kanzlei Doğru, Mannheim</p>
            </div>
            <a href="https://dogru-kanzlei.de" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition-colors hover:border-[#0071e3] hover:text-[#0071e3]">
              Website <ExternalLink size={12} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200">
            {[
              ["719", "organische Klicks"],
              ["35.200", "Impressionen"],
              ["119", "Ads-Konversionen"],
              ["8,31 €", "pro Konversion"],
            ].map(([value, label]) => (
              <div key={label} className="bg-white p-5">
                <p className="text-2xl font-bold tracking-[-0.03em] text-black">{value}</p>
                <p className="mt-1 text-xs font-semibold text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {[
            ["Ladezeit", "JS-Bundle von 915 KB auf 76 KB reduziert"],
            ["Google Maps", "Position 1 fuer relevante lokale Suchbegriffe"],
            ["KI-Suche", "ChatGPT nennt Hasan als klare Empfehlung"],
          ].map(([title, sub]) => (
            <div key={title} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0071e3]" />
              <div>
                <p className="text-sm font-bold text-black">{title}</p>
                <p className="text-sm font-medium leading-relaxed text-neutral-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MethodenQuick = () => (
  <div className="my-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
    <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">Kurzübersicht</p>
      <p className="mt-1 text-base font-bold text-black">Welche Methoden gibt es, um eine Kanzlei-Website zu erstellen?</p>
    </div>
    <div className="divide-y divide-neutral-100">
      {[
        { num: "1", method: "Selbst erstellen", desc: "Homepage-Baukasten (Wix, Squarespace, Jimdo)", cost: "Ab 15 €/Monat", tag: "DIY" },
        { num: "2", method: "Freelancer beauftragen", desc: "Einzelner Webdesigner ohne laufende Betreuung", cost: "Ab 1.500 € einmalig", tag: "Freelancer" },
        { num: "3", method: "Spezialagentur", desc: "Design, SEO, Google Ads und KI-Sichtbarkeit als System", cost: "Ab 450 € (nüll.)", tag: "Empfohlen" },
      ].map((row) => (
        <div key={row.num} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-500">{row.num}</span>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-black">{row.method}</p>
              <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-black uppercase ${row.tag === "Empfohlen" ? "bg-[#0071e3] text-white" : "bg-neutral-100 text-neutral-500"}`}>{row.tag}</span>
            </div>
            <p className="text-sm font-medium text-neutral-500">{row.desc}</p>
          </div>
          <p className="shrink-0 text-sm font-bold text-[#0071e3] sm:text-right">{row.cost}</p>
        </div>
      ))}
    </div>
  </div>
);

const BFSGVisual = () => (
  <div className="my-12 overflow-hidden rounded-3xl bg-[#141414] text-white">
    <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-7 py-6 md:flex-row md:items-center">
      <div>
        <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-white/45">Gesetz</p>
        <p className="text-lg font-bold text-white">BFSG: Barrierefreiheitsstärkungsgesetz</p>
      </div>
      <span className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/70">
        Pflicht seit 28. Juni 2025
      </span>
    </div>
    <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
      <div className="bg-[#141414] p-7">
        <AlertCircle size={20} className="mb-5 text-red-300" />
        <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-red-300">Betroffen</p>
        <p className="mb-1 text-3xl font-bold text-white">10+ MA</p>
        <p className="mb-6 text-sm font-medium text-white/55">oder Jahresumsatz über 2 Mio. €</p>
      </div>
      <div className="bg-[#141414] p-7">
        <ShieldCheck size={20} className="mb-5 text-[#60a5fa]" />
        <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#60a5fa]">Ausnahme</p>
        <p className="mb-1 text-3xl font-bold text-white">unter 10 MA</p>
        <p className="mb-6 text-sm font-medium text-white/55">und Jahresumsatz unter 2 Mio. €</p>
      </div>
    </div>
  </div>
);

const DsgvoVisual = () => (
  <div className="my-12 space-y-3">
    {[
      ["Google Fonts extern", "Schriften lokal hosten"],
      ["Google Maps eingebettet", "Two-Click-Lösung"],
      ["Kontaktformular ohne AVV", "TLS + AVV abschließen"],
    ].map(([error, fix], idx) => (
      <div key={error} className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        <div className="flex items-start gap-4 bg-neutral-50 p-6">
          <span className="shrink-0 text-xs font-bold text-neutral-400">{String(idx + 1).padStart(2, "0")}</span>
          <div className="flex-1">
            <p className="mb-1 text-base font-bold text-black">{error}</p>
            <p className="text-sm leading-relaxed text-neutral-600">Typischer DSGVO-Fehler auf Kanzlei-Websites.</p>
          </div>
          <X size={18} className="mt-0.5 shrink-0 text-red-500" />
        </div>
        <div className="flex items-center gap-3 border-t border-neutral-100 bg-white px-6 py-4">
          <CheckCircle2 size={16} className="text-[#0071e3]" />
          <span className="text-sm font-bold text-[#0071e3]">{fix}</span>
        </div>
      </div>
    ))}
  </div>
);

// --- End Interactive Components ---

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [sidebarMode, setSidebarMode] = useState<"normal" | "fixed" | "released">("normal");
  const [sidebarLeft, setSidebarLeft] = useState(0);
  const [sidebarReleasedTop, setSidebarReleasedTop] = useState(0);
  const sidebarColumnRef = useRef<HTMLElement | null>(null);
  const sidebarRailRef = useRef<HTMLDivElement | null>(null);
  
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    const updateSidebarLock = () => {
      const sidebarColumn = sidebarColumnRef.current;
      const releaseBoundary = document.getElementById("blog-faq-boundary");

      if (!sidebarColumn || !releaseBoundary || window.innerWidth < 1024) {
        setSidebarMode("normal");
        return;
      }

      const topOffset = 144;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const columnTop = sidebarColumn.getBoundingClientRect().top + scrollTop;
      const releaseTop = releaseBoundary.getBoundingClientRect().top + scrollTop;
      const currentPosition = scrollTop + topOffset;
      const sidebarHeight = sidebarRailRef.current?.offsetHeight ?? sidebarColumn.offsetHeight;
      const stopGap = 56;
      const releasePosition = releaseTop - sidebarHeight - stopGap;

      setSidebarLeft(sidebarColumn.getBoundingClientRect().left);
      setSidebarReleasedTop(Math.max(0, releasePosition - columnTop));

      if (currentPosition < columnTop) {
        setSidebarMode("normal");
      } else if (currentPosition >= releasePosition) {
        setSidebarMode("released");
      } else {
        setSidebarMode("fixed");
      }
    };

    updateSidebarLock();
    window.addEventListener("scroll", updateSidebarLock, { passive: true });
    window.addEventListener("resize", updateSidebarLock);

    return () => {
      window.removeEventListener("scroll", updateSidebarLock);
      window.removeEventListener("resize", updateSidebarLock);
    };
  }, [slug]);

  if (!post) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen text-center">
        <h1 className="text-2xl mb-4 font-bold">Post not found</h1>
        <Link to="/blog" className="text-[#0071e3] hover:underline">Back to blog</Link>
      </div>
    );
  }

  const articleLang = post.lang;
  const isLawFirmGuide = post.slug === "webdesign-fuer-rechtsanwaelte-kanzleien-leitfaden-2026";

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

  const articleAudience = (() => {
    const haystack = `${post.slug} ${post.category} ${post.title}`.toLowerCase();
    if (haystack.includes("anwalt") || haystack.includes("kanzlei") || haystack.includes("lawyer") || haystack.includes("law-firm")) {
      return "lawyers";
    }
    if (haystack.includes("arzt") || haystack.includes("praxis") || haystack.includes("doctor") || haystack.includes("medical")) {
      return "doctors";
    }
    return "general";
  })();

  const authorBio = (() => {
    if (articleLang === "de") {
      if (articleAudience === "lawyers") {
        return "Wir bauen Client-Acquisition-Systeme für Kanzleien in Deutschland - Website, SEO und Google Ads als ein System.";
      }
      if (articleAudience === "doctors") {
        return "Wir helfen Arztpraxen dabei, bei Google gefunden zu werden und mehr Patientenanfragen zu generieren.";
      }
      return "nüll. baut digitale Infrastruktur für Anwälte, Ärzte und Dienstleister in Deutschland - damit Expertise sichtbar wird.";
    }

    if (articleAudience === "lawyers") {
      return "We build client-acquisition systems for law firms in Germany - website, SEO, and Google Ads working as one system.";
    }
    if (articleAudience === "doctors") {
      return "We help medical practices get found on Google and generate more patient inquiries.";
    }
    return "nüll. builds digital infrastructure for lawyers, doctors, and service businesses in Germany - so expertise becomes visible.";
  })();

  const whatsappAuthorHref = `https://wa.me/4915256569852?text=${encodeURIComponent(
    articleLang === "de"
      ? `Hallo nüll., ich habe euren Artikel "${post.title}" gelesen und möchte direkt über meine Website sprechen.`
      : `Hi nüll., I read your article "${post.title}" and would like to talk about my website.`
  )}`;

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
        logo: { "@type": "ImageObject", url: "https://xn--nll-hoa.com/og-image.png" },
      },
      image: "https://xn--nll-hoa.com/assets/blog/mannheim-webdesign.webp",
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
        logo: { "@type": "ImageObject", url: "https://xn--nll-hoa.com/og-image.png" },
      },
      image: "https://xn--nll-hoa.com/assets/blog/mannheim-webdesign.webp",
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
      <main className="pt-32 pb-24 min-h-screen">
        <article>
          <div className="max-w-[1400px] mx-auto px-6 mt-4 mb-10">
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
          </div>

          <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-10 px-6 mb-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.55fr)] lg:items-end lg:gap-16">
            <motion.h1
              className="max-w-4xl text-[clamp(2.25rem,5.6vw,4.35rem)] tracking-[-0.045em] leading-[1.06] font-bold text-black text-gradient font-outfit"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              className="max-w-[34rem] lg:pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-[clamp(1.05rem,1.45vw,1.22rem)] text-neutral-500 leading-relaxed font-medium mb-8">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.9375rem] text-neutral-500 font-semibold">
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
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-live="polite"
                className={`mt-8 flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-semibold text-sm ${
                  shareStatus === "copied"
                    ? "border-[#0071e3]/20 bg-[#0071e3]/10 text-[#0071e3]"
                    : shareStatus === "error"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                <Share2 size={16} /> {shareLabels[shareStatus]}
              </button>
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

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 gap-20 lg:grid-cols-[1fr_380px]">
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

                if (block.trim() === "[PROVIDERS_CAROUSEL]") {
                  return post.providers && post.providers.length > 0
                    ? <ProviderEditorialList key={i} providers={post.providers} />
                    : null;
                }

                if (block.trim() === "[PRICING_TABLE]") return null;
                if (isLawFirmGuide && block.trim() === "[BFSG_VISUAL]") return null;
                if (isLawFirmGuide && block.trim() === "[DSGVO_VISUAL]") return null;
                if (isLawFirmGuide && block.trim() === "[METHODEN_QUICK]") return null;

                if (block.trim() === "[BFSG_VISUAL]") return <BFSGVisual key={i} />;
                if (block.trim() === "[DSGVO_VISUAL]") return <DsgvoVisual key={i} />;
                if (block.trim() === "[POSITIVBEISPIEL]") {
                  return isLawFirmGuide ? null : <PositivbeispielBlock key={i} />;
                }
                if (block.trim() === "[METHODEN_QUICK]") {
                  return isLawFirmGuide ? null : <MethodenQuick key={i} />;
                }

                if (block.trim().startsWith("[ASSET:") || block.trim().startsWith("[IMAGE")) {
                  const pathMatch = block.match(/([^\s\]]+\.(png|jpg|jpeg|webp|gif))/i);
                  const labelMatch = block.match(/\[(?:ASSET|IMAGE[^:]*?):\s*(.*?)\]/);
                  const label = labelMatch ? labelMatch[1].split("—").pop()?.trim() ?? "Bild" : "Bild";

                  if (!pathMatch) {
                    return (
                      <div key={i} className="my-10 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-16">
                        <AlertCircle size={20} className="text-neutral-400" />
                        <span className="text-sm font-bold text-neutral-400">{label}</span>
                      </div>
                    );
                  }

                  const imagePath = pathMatch[1].startsWith("/") ? pathMatch[1] : `/assets/blog/${pathMatch[1]}`;
                  return (
                    <figure key={i} className="my-10">
                      <img src={imagePath} alt={label} className="w-full rounded-3xl border border-neutral-200 object-cover shadow-sm" />
                      <figcaption className="mt-3 text-center text-sm font-medium text-neutral-500">{label}</figcaption>
                    </figure>
                  );
                }
                
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

            </div>

            <aside ref={sidebarColumnRef} className="relative hidden self-stretch lg:block">
              <div
                ref={sidebarRailRef}
                className={`flex h-[calc(100vh-10.5rem)] min-h-[38rem] max-h-[54rem] w-[380px] flex-col justify-start gap-10 transition-opacity duration-200 ${
                  sidebarMode === "fixed"
                    ? "fixed z-[20]"
                    : sidebarMode === "released"
                      ? "absolute left-0"
                      : "sticky top-[11rem]"
                }`}
                style={
                  sidebarMode === "fixed"
                    ? { left: sidebarLeft, top: "9rem" }
                    : sidebarMode === "released"
                      ? { top: sidebarReleasedTop }
                      : undefined
                }
              >
                <div className="min-h-0 overflow-hidden">
                  <h4 className="mb-4 text-[0.68rem] font-black uppercase tracking-[0.22em] text-neutral-400">
                    {articleLang === "de" ? "Auf dieser Seite" : "On this page"}
                  </h4>
                  <nav className="max-h-[24rem] space-y-2 overflow-y-auto pr-2">
                    {headers.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group grid grid-cols-[0.35rem_1fr] items-start gap-3 text-[0.82rem] font-bold leading-[1.22] text-neutral-400 transition-all hover:text-[#0071e3]"
                      >
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-200 transition-colors group-hover:bg-[#0071e3]" />
                        <span className="min-w-0 break-words">{h}</span>
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="relative shrink-0 overflow-hidden rounded-[2.25rem] bg-[#0e0e10] p-9 text-white shadow-2xl shadow-black/20">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Share2 size={80} />
                  </div>
                  <div className="relative z-10">
                    <p className="mb-4 text-[0.72rem] font-black uppercase tracking-[0.2em] text-white/35">
                      {articleLang === "de" ? "Launch-Angebot" : "Launch Offer"}
                    </p>
                    <h4 className="mb-4 text-[1.45rem] font-bold leading-tight tracking-[-0.04em] text-white">
                      {articleLang === "de"
                        ? "Wir bauen deine Website und starten deine Kampagnen."
                        : "We build your website and launch your campaigns."}
                    </h4>
                    <p className="mb-6 text-[1.2rem] font-bold leading-snug tracking-[-0.035em] text-white">
                      {articleLang === "de"
                        ? "Monat 1 und 2 sind auf uns. Du zahlst ab Monat 3."
                        : "Months 1–2 are on us. You pay from month 3."}
                    </p>
                    <p className="mb-8 whitespace-nowrap text-[0.92rem] font-bold leading-snug tracking-[-0.02em] text-white/62">
                      {articleLang === "de" ? (
                        "€450 einmalig. Dann €300/Monat."
                      ) : (
                        "€450 once. Then €300/month."
                      )}
                    </p>
                    <Link
                      to="/#contact"
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0071e3] px-5 py-4 text-[0.875rem] font-bold text-white transition-all hover:bg-[#0066d6] active:scale-95"
                    >
                      {articleLang === "de" ? "Jetzt starten →" : "Start now →"}
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="blog-prose lg:max-w-3xl">
              {/* Render Structured FAQs after the article body while the sidebar remains locked. */}
              {post.faqs && <FAQSection faqs={post.faqs} articleLang={articleLang} title={post.faqTitle} />}
              <div id="blog-faq-boundary" aria-hidden="true" />

              {/* Author Section */}
              <div className="mt-32 pt-16 border-t border-neutral-100">
                <div className="p-10 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-24 h-24 overflow-hidden rounded-full bg-[#1d1d1f] shadow-xl shadow-black/20">
                    <img
                      src="/favicon.svg"
                      alt="nüll."
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h4
                      className="mb-3 inline-flex flex-wrap items-baseline gap-x-2 font-bold tracking-[-0.03em] text-[#0e0e10]"
                      style={{ fontSize: "1.8rem" }}
                      aria-label="nüll. Editorial Team"
                    >
                      <span>
                        nüll<span className="text-[#007aff]">.</span>
                      </span>
                      <span className="tracking-[-0.04em]">Editorial Team</span>
                    </h4>
                    <p className="text-[1rem] text-neutral-500 mb-6 leading-relaxed">
                      {authorBio}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <a
                        href={whatsappAuthorHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#0071e3]/20 hover:bg-[#0066d6] hover:-translate-y-0.5"
                      >
                        {articleLang === "de" ? "Direkt schreiben →" : "Message directly →"}
                      </a>
                      <a
                        href="https://www.linkedin.com/company/n%C3%BCll/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        LinkedIn
                      </a>
                      <Link
                        to="/"
                        className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        Website
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-48">
          <motion.div 
            className="relative overflow-hidden bg-[#0071e3] text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10 mx-auto max-w-[92rem] px-6 py-28 md:py-36">
              <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.55fr)_minmax(24rem,0.75fr)] lg:gap-20">
                <div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white/85 text-[0.75rem] font-black uppercase tracking-[0.2em] mb-10">
                  {articleLang === "de" ? "Nächste Schritte" : "Next Steps"}
                </div>
                <h3 className="max-w-[68rem] text-[clamp(2.4rem,3.75vw,3.65rem)] font-bold tracking-[-0.06em] leading-[0.98] font-outfit">
                  {articleLang === "de" ? (
                    <>
                      Deine Website sollte
                      <br />
                      Anfragen bringen.
                      <br />
                      Wenn sie das nicht tut,
                      <br />
                      schauen wir gemeinsam, woran es liegt.
                    </>
                  ) : (
                    <>
                      Your website should
                      <br />
                      bring inquiries.
                      <br />
                      If it does not,
                      <br />
                      let us look at it together.
                    </>
                  )}
                </h3>
                </div>

                <div className="lg:pl-8">
                <p className="text-[1.35rem] text-white/85 mb-10 leading-relaxed max-w-xl font-medium">
                  {articleLang === "de" 
                    ? "Kostenlos. 20 Minuten. Direktes Feedback zu Struktur, Sichtbarkeit und den Punkten, die Anfragen verhindern." 
                    : "Free. 20 minutes. No pitch - just concrete answers on what your site is missing."}
                </p>
                <Link
                  to="/website-analyse"
                  className="inline-flex min-h-14 items-center gap-4 rounded-full bg-white px-9 py-3.5 text-[1rem] font-bold text-black shadow-2xl shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:bg-black hover:text-white active:scale-95 group"
                >
                  {articleLang === "de" ? "Kostenlose Website-Analyse buchen" : "Book a Free Website Analysis"} <ArrowLeft size={22} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
                </div>
              </div>
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
