import { useParams, Link } from "react-router";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ChevronDown, CheckCircle2, AlertCircle, TrendingUp, X, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, BarChart3, FileCheck2, Gavel, MapPin, PhoneCall, Scale, Search, ShieldCheck, Target } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { blogPosts } from "./blogData";
import { useState, useMemo } from "react";
import { StructuredData } from "./SEO";

// --- Custom Interactive Components ---

const FAQSection = ({ faqs, articleLang, title }: { faqs: { question: string, answer: string }[], articleLang: string, title?: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-24 border-t border-[#e8e4dc] pt-16">
      <h3 className="mb-8 text-3xl font-semibold tracking-normal">
        {title ?? (articleLang === "de" ? "Häufig gestellte Fragen (FAQ)" : "Frequently Asked Questions")}
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="overflow-hidden rounded-lg border border-[#d9d6cf] bg-white transition-all duration-300 hover:border-[#0071e3]/30"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#faf9f5]"
            >
              <span className="pr-8 text-base font-semibold text-black">{faq.question}</span>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d9d6cf] bg-white transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`}>
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
                  <div className="px-5 pb-5 text-base leading-[1.8] text-neutral-600">
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

// ─── Question TOC ───────────────────────────────────────────────────────────
const QuestionTOC = ({ content, lang }: { content: string[], lang: string }) => {
  const headers = content
    .filter(b => b.startsWith("## "))
    .map(b => {
      const text = b.replace("## ", "");
      const id = text.toLowerCase()
        .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ä/g, "a").replace(/ß/g, "ss")
        .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      return { text, id };
    });
  if (headers.length < 3) return null;
  return (
    <nav className="my-10 overflow-hidden rounded-lg border border-[#d9d6cf] bg-white">
      <div className="flex items-center justify-between border-b border-[#e8e4dc] bg-[#141414] px-5 py-4">
        <div>
          <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-normal !text-white/60">
            {lang === "de" ? "Inhalt" : "Contents"}
          </p>
          <p className="text-sm font-semibold !text-white">
            {lang === "de" ? "Diese Fragen beantworte ich:" : "Questions answered in this guide:"}
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
          <FileCheck2 size={15} className="text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-[#ece8df] bg-white md:grid-cols-2 md:divide-x md:divide-y-0">
        {headers.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className="group flex items-center gap-3 border-b border-[#ece8df] px-5 py-4 transition-colors hover:bg-[#faf9f5] last:border-b-0 md:last:border-b md:[&:nth-last-child(2)]:border-b-0"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f1eee7] text-[0.72rem] font-semibold text-neutral-500 transition-all group-hover:bg-[#0071e3] group-hover:text-white">
              {i + 1}
            </span>
            <span className="text-sm font-medium leading-snug text-neutral-700 transition-colors group-hover:text-[#0071e3]">{h.text}</span>
            <ChevronRight size={14} className="ml-auto shrink-0 text-neutral-300 transition-colors group-hover:text-[#0071e3]" />
          </a>
        ))}
      </div>
    </nav>
  );
};

// ─── Positivbeispiel Block ────────────────────────────────────────────────────
const PositivbeispielBlock = () => (
  <div className="my-14">
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <span className="rounded-md bg-[#0e0e10] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-normal text-white">Positivbeispiel</span>
      <span className="text-sm font-medium text-neutral-500">Kanzlei Doğru, Mannheim</span>
    </div>
    <div className="overflow-hidden rounded-lg border border-[#d9d6cf] bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <img
          src="/assets/blog/kanzlei-dogru-fotoshooting.jpg"
          alt="Website Kanzlei Doğru Mannheim — Professionelles Webdesign für türkisch-deutsches Recht"
          className="h-full min-h-[340px] w-full object-cover"
        />
        <div className="flex flex-col justify-between bg-[#f8f6f1] p-6 md:p-8">
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-[#ded9cf] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-neutral-500">Case Study</p>
                <p className="mt-1 text-xl font-semibold tracking-normal text-[#0e0e10]">dogru-kanzlei.de</p>
              </div>
              <a href="https://dogru-kanzlei.de" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[#d8d2c8] bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-[#0071e3] hover:text-[#0071e3]">
                Website <ExternalLink size={12} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#ded9cf] bg-[#ded9cf]">
              {[
                ["719", "organische Klicks"],
                ["35.200", "Impressionen"],
                ["119", "Ads-Konversionen"],
                ["8,31 €", "pro Konversion"],
              ].map(([value, label], i) => (
                <div key={i} className="bg-white p-4">
                  <p className="text-2xl font-semibold tracking-normal text-[#0e0e10]">{value}</p>
                  <p className="mt-1 text-xs font-medium text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              ["Ladezeit", "JS-Bundle von 915 KB auf 76 KB reduziert"],
              ["Google Maps", "Position 1 fuer relevante lokale Suchbegriffe"],
              ["KI-Suche", "ChatGPT nennt Hasan als klare Empfehlung"],
            ].map(([title, sub], i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0071e3]" />
                <div>
                  <p className="text-sm font-semibold tracking-normal text-[#0e0e10]">{title}</p>
                  <p className="text-sm font-medium leading-relaxed text-neutral-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Methoden Quick Table ─────────────────────────────────────────────────────
const MethodenQuick = () => (
  <div className="my-10 overflow-hidden rounded-lg border border-[#d9d6cf] bg-white">
    <div className="border-b border-[#e8e4dc] bg-[#f8f6f1] px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-normal text-neutral-500">Kurzübersicht</p>
      <p className="mt-1 text-base font-semibold tracking-normal text-[#0e0e10]">Welche Methoden gibt es, um eine Kanzlei-Website zu erstellen?</p>
    </div>
    <div className="divide-y divide-[#ece8df]">
      {[
        { num: "1", method: "Selbst erstellen", desc: "Homepage-Baukasten (Wix, Squarespace, Jimdo)", cost: "Ab 15 €/Monat", tag: "DIY", tagColor: "bg-neutral-100 text-neutral-500" },
        { num: "2", method: "Freelancer beauftragen", desc: "Einzelner Webdesigner ohne laufende Betreuung", cost: "Ab 1.500 € einmalig", tag: "Freelancer", tagColor: "bg-neutral-100 text-neutral-500" },
        { num: "3", method: "Spezialagentur", desc: "Design, SEO, Google Ads und KI-Sichtbarkeit als System", cost: "Ab 450 € (nüll.)", tag: "Empfohlen", tagColor: "bg-[#0071e3] text-white" },
      ].map((row, i) => (
        <div key={i} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-[#faf9f5] sm:flex-row sm:items-center">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f1eee7] text-[0.75rem] font-semibold text-neutral-500">{row.num}</span>
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold tracking-normal text-[#0e0e10]">{row.method}</p>
              <span className={`rounded-md px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-normal ${row.tagColor}`}>{row.tag}</span>
            </div>
            <p className="text-sm font-medium text-neutral-500">{row.desc}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[#0071e3] sm:text-right">{row.cost}</p>
        </div>
      ))}
    </div>
  </div>
);

const EditorialChecklist = ({ items }: { items: string[] }) => (
  <div className="my-16 border-y border-neutral-100 py-10">
    <h4 className="mb-6 text-[1.5rem] font-bold tracking-[-0.03em] text-black font-outfit">
      Website-Audit: kurze Checkliste
    </h4>
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#0071e3]" />
          <p className="m-0 text-[1rem] font-medium leading-relaxed text-neutral-600">
            {item.replace(/\[\s\]\s*/, "")}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const ProviderEditorialList = ({ providers }: { providers: import("../types").Provider[] }) => {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="my-14 border-y border-neutral-100">
      {providers.map((provider, idx) => (
        <div key={provider.name} className="grid grid-cols-[3rem_1fr] gap-5 border-b border-neutral-100 py-7 last:border-b-0">
          <div className="text-[1.25rem] font-bold text-neutral-300 font-outfit">
            {String(provider.rank ?? idx + 1).padStart(2, "0")}
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h4 className="m-0 text-[1.35rem] font-bold tracking-[-0.03em] text-black font-outfit">
                {provider.name}
              </h4>
              {provider.badge && (
                <span className="rounded-full bg-[#0071e3]/10 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.12em] text-[#0071e3]">
                  {provider.badge}
                </span>
              )}
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
            {provider.url && (
              <a
                href={provider.url}
                target={provider.url.startsWith("/") ? undefined : "_blank"}
                rel={provider.url.startsWith("/") ? undefined : "noopener noreferrer"}
                className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-bold text-[#0071e3] hover:underline"
              >
                Anbieter ansehen <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      ))}
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
      if (score >= maxScore * 0.8) return "Exzellent. Ihre Website ist gut optimiert.";
      if (score >= maxScore * 0.5) return "Solide. Klare Verbesserungspotenziale existieren.";
      return "Kritisch. Deine Website verliert täglich Kunden.";
    }
    return score >= maxScore * 0.8 ? "Excellent. Your site is high-converting." : score >= maxScore * 0.5 ? "Moderate performer. Improvement areas exist." : "Critical. Immediate improvements required.";
  };

  return (
    <div className="my-16 overflow-hidden rounded-lg border border-[#d9d6cf] bg-white shadow-sm">
      <div className="p-6 md:p-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-[#e8e4dc] pb-8 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-normal text-neutral-500">Website-Audit</p>
            <h4 className="text-2xl font-semibold tracking-normal text-[#0e0e10]">Mandanten-Score</h4>
            <p className="mt-2 text-sm font-medium text-neutral-500">{getScoreMessage()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-4xl font-semibold leading-none tracking-normal text-[#0e0e10]">{score}<span className="text-xl text-neutral-300">/{maxScore}</span></div>
              <div className="mt-2 text-xs font-bold uppercase tracking-normal text-neutral-400">Conversion Score</div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#e8e4dc] bg-[#f8f6f1]">
              <TrendingUp size={24} className={score >= maxScore * 0.5 ? "text-green-500" : "text-red-500"} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}
              className="group flex min-h-[76px] w-full items-center gap-4 rounded-lg border border-[#e8e4dc] p-4 text-left transition-all hover:border-[#0071e3]/40 hover:bg-[#f8fbff]"
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${checked[idx] ? 'border-[#0071e3] bg-[#0071e3]' : 'border-neutral-200 bg-white group-hover:border-[#0071e3]/50'}`}>
                {checked[idx] && <CheckCircle2 size={16} className="text-white" />}
              </div>
              <span className={`text-sm font-medium leading-snug transition-colors ${checked[idx] ? 'text-black' : 'text-neutral-600'}`}>
                {item.replace(/\[\s\]\s*/, "")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-[#e8e4dc] pt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
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

const BFSGVisual = () => (
  <div className="my-12">
    <div className="overflow-hidden rounded-lg bg-[#141414]">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-6 py-6 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-normal !text-white/55">Gesetz</p>
          <p className="text-lg font-semibold tracking-normal !text-white">BFSG: Barrierefreiheitsstärkungsgesetz</p>
        </div>
        <span className="shrink-0 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
          Pflicht seit 28. Juni 2025
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
        <div className="bg-[#141414] p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15">
            <AlertCircle size={18} className="text-red-300" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-normal !text-red-300">Betroffen</p>
          <p className="mb-1 text-3xl font-semibold leading-none tracking-normal !text-white">10+ MA</p>
          <p className="mb-6 text-sm font-medium !text-white/55">oder Jahresumsatz über 2 Mio. €</p>
          <div className="space-y-2">
            {["WCAG 2.1 Level AA", "Barrierefreiheitserklärung", "Bußgeld bis 100.000 €"].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-sm font-medium text-white/65">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#141414] p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0071e3]/20">
            <ShieldCheck size={18} className="text-[#60a5fa]" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-normal !text-[#60a5fa]">Ausnahme</p>
          <p className="mb-1 text-3xl font-semibold leading-none tracking-normal !text-white">unter 10 MA</p>
          <p className="mb-6 text-sm font-medium !text-white/55">und Jahresumsatz unter 2 Mio. €</p>
          <div className="space-y-2">
            {["§ 3 Abs. 3 BFSG: Kleinstunternehmen befreit", "Keine Pflicht zur WCAG-Konformität", "Empfohlen trotzdem: bessere Rankings"].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] shrink-0" />
                <span className="text-sm font-medium text-white/65">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs font-medium !text-white/45">Gilt für Kanzleien, die Privatmandanten über die Website ansprechen.</p>
      </div>
    </div>
  </div>
);

const DsgvoVisual = () => {
  const items = [
    {
      num: "01",
      label: "Google Fonts extern",
      error: "IP-Adresse wird bei jedem Seitenaufruf ohne Einwilligung an Google übertragen.",
      fix: "Schriften lokal hosten",
      fixDetail: "2 Zeilen CSS — kein Performance-Verlust",
    },
    {
      num: "02",
      label: "Google Maps eingebettet",
      error: "Karte lädt sofort und sendet Daten, bevor der Nutzer zustimmt.",
      fix: "Two-Click-Lösung",
      fixDetail: "Karte erst nach Klick laden oder OpenStreetMap nutzen",
    },
    {
      num: "03",
      label: "Kontaktformular ohne AVV",
      error: "Kein Auftragsverarbeitungsvertrag mit dem CRM-Anbieter. Keine TLS-Verschlüsselung.",
      fix: "TLS + AVV abschließen",
      fixDetail: "Pflicht nach Art. 28 DSGVO bei jedem Drittanbieter",
    },
  ];

  return (
    <div className="my-12 space-y-3">
      <div className="mb-5 flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-center">
        <p className="text-xs font-bold uppercase tracking-normal text-neutral-500">DSGVO: Häufigste Fehler auf Kanzlei-Websites</p>
        <span className="w-fit rounded-md bg-[#f1eee7] px-3 py-1 text-xs font-semibold text-neutral-500">BGH März 2025</span>
      </div>
      {items.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-[#d9d6cf] bg-white">
          <div className="flex items-start gap-4 bg-[#f8f6f1] p-5">
            <span className="shrink-0 pt-0.5 text-xs font-bold text-neutral-400">{item.num}</span>
            <div className="flex-1">
              <p className="mb-1 text-base font-semibold tracking-normal text-[#0e0e10]">{item.label}</p>
              <p className="text-sm leading-relaxed text-neutral-600">{item.error}</p>
            </div>
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-100">
              <X size={13} className="text-red-500" strokeWidth={3} />
            </div>
          </div>
          <div className="flex items-start gap-4 border-t border-[#e8e4dc] bg-white px-5 py-4">
            <span className="shrink-0 text-xs font-bold text-neutral-300 opacity-0">{item.num}</span>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#0071e3]">
                <CheckCircle2 size={13} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-[#0071e3]">{item.fix}</span>
              <span className="text-sm font-medium text-neutral-500">{item.fixDetail}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProviderCarousel = ({ providers }: { providers: import("../types").Provider[] }) => {
  const [active, setActive] = useState(0);

  if (!providers || providers.length === 0) return null;

  const p = providers[active];
  const isHighlighted = p.highlight;

  return (
    <div className="my-16">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-neutral-500">Anbieter-Ranking</p>
          <p className="mt-1 text-xl font-semibold tracking-normal text-[#0e0e10]">Vergleich nach Kanzlei-Fit, SEO und Betreuung</p>
        </div>
        <span className="text-sm font-medium text-neutral-500">{active + 1} von {providers.length}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-lg border border-[#d9d6cf] bg-white">
          {providers.map((prov, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`flex w-full items-center gap-3 border-b border-[#ece8df] px-4 py-4 text-left transition-colors last:border-b-0 ${
                active === idx
                  ? "bg-[#0e0e10] text-white"
                  : "bg-white text-neutral-700 hover:bg-[#faf9f5]"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${
                active === idx ? "bg-white text-[#0e0e10]" : "bg-[#f1eee7] text-neutral-500"
              }`}>
                {prov.rank ?? idx + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-normal">{prov.name}</span>
                {prov.badge && (
                  <span className={`mt-0.5 block truncate text-xs font-medium ${active === idx ? "text-white/55" : "text-neutral-400"}`}>{prov.badge}</span>
                )}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`overflow-hidden rounded-lg border shadow-sm ${
              isHighlighted
                ? "border-[#0071e3]/35 bg-[#f7fbff]"
                : "border-[#d9d6cf] bg-white"
            }`}
          >
            <div className={`flex flex-col gap-5 border-b px-6 py-6 md:flex-row md:items-start md:justify-between ${
              isHighlighted ? "border-[#0071e3]/15" : "border-[#ece8df]"
            }`}>
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-normal ${
                    isHighlighted ? "bg-[#0071e3] text-white" : "bg-[#f1eee7] text-neutral-500"
                  }`}>
                    {p.badge ?? `Platz ${p.rank ?? active + 1}`}
                  </span>
                  <span className="text-sm font-medium text-neutral-500">#{p.rank ?? active + 1}</span>
                </div>
                <h4 className="text-3xl font-semibold tracking-normal text-[#0e0e10]">{p.name}</h4>
              </div>
              {p.url && (
                <a
                  href={p.url}
                  target={p.url.startsWith("/") ? undefined : "_blank"}
                  rel={p.url.startsWith("/") ? undefined : "noopener noreferrer"}
                  className={`inline-flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    isHighlighted
                      ? "bg-[#0071e3] text-white hover:bg-[#005bb5]"
                      : "border border-[#d9d6cf] text-neutral-700 hover:border-[#0071e3] hover:text-[#0071e3]"
                  }`}
                >
                  Zum Anbieter <ExternalLink size={14} />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 gap-px bg-[#ece8df] md:grid-cols-[1fr_280px]">
              <div className="bg-white p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-normal text-neutral-500">Stärken</p>
                <ul className="space-y-3">
                  {p.pros.map((pro, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Plus size={16} className={`mt-0.5 shrink-0 ${isHighlighted ? "text-[#0071e3]" : "text-neutral-900"}`} strokeWidth={3} />
                      <span className="text-sm leading-relaxed text-neutral-700">{pro}</span>
                    </li>
                  ))}
                </ul>
                {p.cons && p.cons.length > 0 && (
                  <>
                    <p className="mb-4 mt-7 text-xs font-bold uppercase tracking-normal text-neutral-500">Grenzen</p>
                    <ul className="space-y-3">
                      {p.cons.map((con, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Minus size={16} className="mt-0.5 shrink-0 text-red-500" strokeWidth={3} />
                          <span className="text-sm leading-relaxed text-neutral-600">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="bg-[#f8f6f1] p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-normal text-neutral-500">Preis & Umfang</p>
                {p.pricing ? (
                  <ul className="space-y-3">
                    {p.pricing.map((line, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm font-medium leading-relaxed text-neutral-700">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#0071e3]" />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-medium leading-relaxed text-neutral-500">Keine transparente Paketstruktur sichtbar.</p>
                )}
                {p.pricingIncludes && (
                  <div className="mt-6 border-t border-[#ded9cf] pt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-normal text-neutral-500">Inklusive</p>
                    <ul className="space-y-2">
                      {p.pricingIncludes.map((line, j) => (
                        <li key={j} className="text-sm font-medium leading-relaxed text-neutral-700">{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#0071e3] origin-left z-[1000]"
        style={{ scaleX }}
      />

      <main className="pt-48 pb-24 min-h-screen">
        <article>
          <div className="mx-auto mt-10 mb-10 flex max-w-7xl items-center justify-between px-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-all hover:text-black"
              >
                <div className="rounded-md bg-white p-1.5 ring-1 ring-[#ded9cf] transition-colors group-hover:bg-[#f1eee7]">
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
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all ${
                  shareStatus === "copied"
                    ? "border-[#0071e3]/20 bg-[#0071e3]/10 text-[#0071e3]"
                    : shareStatus === "error"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-[#ded9cf] bg-white text-neutral-500 hover:bg-[#f8f6f1]"
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


          <div className="max-w-7xl mx-auto px-6">
            <div className={`blog-prose mx-auto ${isLawFirmGuide ? "law-guide-prose max-w-5xl" : "max-w-3xl"}`}>
              {/* Question TOC — auto-generated for articles with 4+ sections */}
              {!isLawFirmGuide && <QuestionTOC content={post.content} lang={articleLang} />}

              {post.content[0]?.startsWith("> ") && (
                <motion.div 
                  className="group relative mb-12 overflow-hidden rounded-lg border border-[#d9d6cf] bg-[#f8f6f1] p-6 md:p-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute right-0 top-0 p-8 opacity-5 transition-transform duration-700 group-hover:rotate-0">
                    <Bookmark size={120} />
                  </div>
                  <h3 className="mb-5 flex items-center gap-3 text-xl font-semibold tracking-normal text-black">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-sm text-white">!</div>
                    {articleLang === "de" ? "Zusammenfassung" : "Quick Summary"}
                  </h3>
                  <p className="mb-0 text-base leading-relaxed text-neutral-600">
                    {post.content[0].replace("> ", "").replace("**Key Takeaways:**", "").replace("**Zusammenfassung:**", "").replace("**Önemli Çıkarımlar:**", "").trim()}
                  </p>
                </motion.div>
              )}

              {post.content.map((block, i) => {
                if (i === 0 && block.startsWith("> ")) return null;

                const renderText = (text: string) => {
                  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
                  return parts.map((part, index) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={index} className="rounded-sm bg-[#0071e3]/5 px-1 font-semibold text-black">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith("*") && part.endsWith("*")) {
                      return <em key={index}>{part.slice(1, -1)}</em>;
                    }
                    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                    if (linkMatch) {
                      const [, label, href] = linkMatch;
                      return (
                        <Link key={index} to={href} className="font-semibold text-[#0071e3] hover:underline">
                          {label}
                        </Link>
                      );
                    }
                    return part;
                  });
                };

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
                  if (isLawFirmGuide) {
                    return <EditorialChecklist key={i} items={checklistItems} />;
                  }
                  return <AuditChecklist key={i} items={checklistItems} articleLang={articleLang} />;
                }

                // Handle Provider Carousel
                if (block.trim() === "[PROVIDERS_CAROUSEL]") {
                  return post.providers && post.providers.length > 0
                    ? isLawFirmGuide
                      ? <ProviderEditorialList key={i} providers={post.providers} />
                      : <ProviderCarousel key={i} providers={post.providers} />
                    : null;
                }

                // Handle Pricing Table (skip — rows are rendered separately as table)
                if (block.trim() === "[PRICING_TABLE]") return null;

                // The law-firm guide should stay editorial, not widget-heavy.
                if (isLawFirmGuide && block.trim() === "[BFSG_VISUAL]") return null;
                if (isLawFirmGuide && block.trim() === "[DSGVO_VISUAL]") return null;
                if (isLawFirmGuide && block.trim() === "[METHODEN_QUICK]") return null;

                // Handle BFSG Visual
                if (block.trim() === "[BFSG_VISUAL]") {
                  return <BFSGVisual key={i} />;
                }

                // Handle DSGVO Visual
                if (block.trim() === "[DSGVO_VISUAL]") {
                  return <DsgvoVisual key={i} />;
                }

                // Handle image assets and placeholders
                if (block.trim().startsWith("[ASSET:") || block.trim().startsWith("[IMAGE")) {
                  const labelMatch = block.match(/\[(?:ASSET|IMAGE[^:]*?):\s*(.*?)\]/);
                  const label = labelMatch ? labelMatch[1].split("—")[0].trim() : "Bild";
                  // Check if it's an actual image path
                  const pathMatch = block.match(/([^\s\]]+\.(png|jpg|jpeg|webp|gif))/i);
                  if (pathMatch) {
                    return (
                      <figure key={i} className="my-10">
                        <img src={pathMatch[1].startsWith("/") ? pathMatch[1] : `/assets/blog/${pathMatch[1]}`} alt={label} className="w-full rounded-lg border border-[#d9d6cf] object-cover" />
                        <figcaption className="mt-3 text-center text-sm font-medium text-neutral-500">{label}</figcaption>
                      </figure>
                    );
                  }
                  return (
                    <div key={i} className="my-10 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 py-16">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200">
                        <AlertCircle size={20} className="text-neutral-400" />
                      </div>
                      <span className="text-sm font-bold text-neutral-400">[ Bild: {label} ]</span>
                    </div>
                  );
                }

                // Handle Comparison Detection
                if (block.includes("[BEFORE]") && block.includes("[AFTER]")) {
                  const match = block.match(/\[BEFORE\]\s*"?(.*?)"?\s*\[AFTER\]\s*"?(.*?)"?$/);
                  if (match) {
                    return <ComparisonCard key={i} before={match[1]} after={match[2]} articleLang={articleLang} />;
                  }
                }

                // Handle Positivbeispiel
                if (block.trim() === "[POSITIVBEISPIEL]") {
                  return isLawFirmGuide ? null : <PositivbeispielBlock key={i} />;
                }

                // Handle Methoden Quick Table
                if (block.trim() === "[METHODEN_QUICK]") {
                  return isLawFirmGuide ? null : <MethodenQuick key={i} />;
                }

                if (block.startsWith("## ")) {
                  const text = block.replace("## ", "");
                  const headingId = text.toLowerCase()
                    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ä/g, "a").replace(/ß/g, "ss")
                    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                  return (
                    <motion.h2
                      key={i}
                      id={headingId}
                      className="group relative scroll-mt-32 tracking-normal"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <span className="absolute -left-8 top-1/2 hidden -translate-y-1/2 text-2xl font-semibold text-[#0071e3] opacity-0 transition-opacity group-hover:opacity-100 lg:block">#</span>
                      {text}
                    </motion.h2>
                  );
                }

                if (block.startsWith("### ")) {
                  const text = block.replace("### ", "");
                  // "Das Wichtigste" → collect following bullets into a callout card
                  const isWichtigste = text.toLowerCase().includes("wichtigste");
                  if (isWichtigste) {
                    const bullets: string[] = [];
                    let j = i + 1;
                    while (j < post.content.length && post.content[j].startsWith("- ")) {
                      bullets.push(post.content[j].replace(/^-\s*/, ""));
                      j++;
                    }
                    if (bullets.length > 0) {
                      return (
                        <motion.div
                          key={i}
                          className="my-10 overflow-hidden rounded-lg border border-[#bcd8f5] bg-[#f7fbff]"
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-center gap-3 border-b border-[#d7e8fb] bg-[#edf6ff] px-5 py-4">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0071e3]">
                              <CheckCircle2 size={14} className="text-white" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-normal text-[#0071e3]">{text}</p>
                          </div>
                          <div className="space-y-3 p-5">
                            {bullets.map((b, bi) => (
                              <div key={bi} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#0071e3]/15">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#0071e3]" />
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-neutral-700">{renderText(b)}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    }
                  }
                  return (
                    <motion.h3
                      key={i}
                      className="mt-12 mb-5 text-2xl font-semibold tracking-normal text-black"
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

                if (block.startsWith("> ")) {
                  return (
                    <blockquote key={i} className="my-8 border-l-4 border-[#0071e3] py-2 pl-5 text-lg italic text-neutral-600">
                      {renderText(block.replace("> ", ""))}
                    </blockquote>
                  );
                }

                if (block.trim().startsWith("|")) {
                  if (i > 0 && post.content[i - 1].trim().startsWith("|")) return null;
                  // Check if previous non-pipe block was [PRICING_TABLE]
                  const isPricingTable = i > 0 && post.content.slice(0, i).some(b => b.trim() === "[PRICING_TABLE]" && !post.content.slice(post.content.indexOf(b) + 1, i).some(bb => bb.trim().startsWith("|")));

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
                  // Find nüll. column index for pricing table highlight
                  const nullColIdx = headerCells.findIndex(c => c.includes("nüll") || c.includes("Nüll") || c.includes("null."));

                  if (isPricingTable && nullColIdx >= 0) {
                    // Pricing table: dark header, highlighted nüll. column
                    return (
                      <div key={i} className="my-12 overflow-hidden rounded-lg border border-[#d9d6cf] shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead className="bg-[#0e0e10]">
                              <tr>
                                {headerCells.map((cell, ci) => (
                                  <th key={ci} className={`px-5 py-4 text-xs font-bold uppercase tracking-normal ${ci === nullColIdx ? "text-[#60a5fa]" : "text-white/55"}`}>
                                    {ci === nullColIdx ? `★ ${cell}` : cell || ""}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {bodyRows.map((row, ri) => (
                                <tr key={ri} className="border-t border-neutral-100">
                                  {row.map((cell, ci) => (
                                    <td key={ci} className={`px-5 py-4 align-top text-sm leading-relaxed ${
                                      ci === nullColIdx
                                        ? "bg-[#edf6ff] font-semibold text-[#0071e3]"
                                        : ci === 0
                                        ? "bg-[#f8f6f1] font-semibold text-[#0e0e10]"
                                        : "text-neutral-500"
                                    }`}>
                                      {renderText(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={i} className="my-12 overflow-hidden rounded-lg border border-[#d9d6cf] shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                          <thead className="border-b border-[#d9d6cf] bg-[#f8f6f1]">
                            <tr>
                              {headerCells.map((cell, cellIndex) => (
                                <th key={cellIndex} className={`px-5 py-4 text-xs font-bold uppercase tracking-normal ${cellIndex === 0 ? "text-neutral-400" : "text-neutral-600"}`}>
                                  {renderText(cell) || ""}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {bodyRows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t border-[#ece8df] transition-colors hover:bg-[#faf9f5]">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className={`px-5 py-4 align-top text-sm leading-relaxed ${cellIndex === 0 ? "font-semibold text-[#0e0e10]" : "text-neutral-500"}`}>
                                      {renderText(cell)}
                                    </td>
                                  ))}
                                </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }

                if (block.startsWith("- ")) {
                  // Skip bullets that are already consumed by the "Das Wichtigste" callout card
                  const prevH3 = post.content.slice(0, i).reverse().find(b => b.startsWith("### "));
                  if (prevH3 && prevH3.toLowerCase().includes("wichtigste")) {
                    const prevH3Idx = post.content.lastIndexOf(prevH3, i);
                    const allBulletsSince = post.content.slice(prevH3Idx + 1, i).every(b => b.startsWith("- ") || b === "");
                    if (allBulletsSince) return null;
                  }
                  return (
                    <div key={i} className="mb-4 flex items-start gap-3 pl-1">
                      <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0071e3]" />
                      <p className="m-0 text-[1.125rem] leading-[1.8] text-[#424245] font-medium">
                        {renderText(block.replace("- ", ""))}
                      </p>
                    </div>
                  );
                }

                if (/^\d+\./.test(block)) {
                   return (
                    <div key={i} className="mb-6 flex items-start gap-4">
                      <span className="min-w-[1.5rem] text-lg font-semibold text-[#0071e3]">{block.match(/^\d+/)?.[0]}.</span>
                      <p className="m-0 text-[1.125rem] leading-[1.8] text-[#424245] font-medium">
                        {renderText(block.replace(/^\d+\.\s*/, ""))}
                      </p>
                    </div>
                  );
                }

                if (block.trim() === "[PROVIDERS_CAROUSEL]") {
                  return post.providers && post.providers.length > 0
                    ? <ProviderCarousel key={i} providers={post.providers} />
                    : null;
                }

                if (isLawFirmGuide && block.trim() === "[BFSG_VISUAL]") return null;
                if (isLawFirmGuide && block.trim() === "[DSGVO_VISUAL]") return null;

                if (block.trim() === "[BFSG_VISUAL]") {
                  return <BFSGVisual key={i} />;
                }

                if (block.trim() === "[DSGVO_VISUAL]") {
                  return <DsgvoVisual key={i} />;
                }

                if (block.trim().startsWith("[ASSET:") || block.trim().startsWith("[IMAGE")) {
                  const labelMatch = block.match(/\[(?:ASSET|IMAGE[^:]*?):\s*(.*?)\]/);
                  const label = labelMatch ? labelMatch[1].split("—")[0].trim() : "Bild";
                  const pathMatch = block.match(/([^\s\]]+\.(png|jpg|jpeg|webp|gif))/i);
                  if (pathMatch) {
                    return (
                      <div key={i} className="my-10 overflow-hidden rounded-lg">
                        <img src={pathMatch[1].startsWith("/") ? pathMatch[1] : `/assets/blog/${pathMatch[1]}`} alt={label} className="w-full rounded-lg border border-[#d9d6cf] object-cover" />
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="my-10 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 py-16">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200">
                        <AlertCircle size={20} className="text-neutral-400" />
                      </div>
                      <span className="text-sm font-bold text-neutral-400">[ Bild: {label} ]</span>
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
              <div className="mt-24 border-t border-[#e8e4dc] pt-12">
                <div className="flex flex-col items-center gap-8 rounded-lg border border-[#d9d6cf] bg-[#f8f6f1] p-6 md:flex-row md:p-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-black text-3xl font-semibold text-white">N</div>
                  <div className="text-center md:text-left flex-1">
                    <h4 className="mb-2 text-xl font-semibold tracking-normal">Nüll. Editorial Team</h4>
                    <p className="mb-5 text-base leading-relaxed text-neutral-500">
                      {articleLang === "de" 
                        ? "Experten für digitale Positionierung, Premium-Webdesign und Marketingstrategie für ambitionierte Unternehmen." 
                        : "Experts in digital positioning, premium webdesign, and marketing strategy for ambitious businesses."}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {['LinkedIn', 'Website', 'WhatsApp'].map(p => (
                        <button key={p} className="rounded-md border border-[#d9d6cf] bg-white px-4 py-2 text-xs font-bold uppercase tracking-normal transition-all hover:bg-black hover:text-white">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </article>

        <div className="max-w-7xl mx-auto px-6 mt-48">
          <motion.div 
            className="relative overflow-hidden rounded-lg bg-[#141414] p-8 text-white md:p-14"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10 max-w-2xl">
              <div className="mb-8 inline-block rounded-md bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-normal text-white/80">
                {articleLang === "de" ? "Nächste Schritte" : "Next Steps"}
              </div>
              <h3 className="mb-8 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                {articleLang === "de" 
                  ? "Verwandeln Sie Ihr Unternehmen in eine starke digitale Marke." 
                  : "Transform your business into a strong digital brand."}
              </h3>
              <p className="mb-10 max-w-xl text-lg leading-relaxed !text-white/60">
                {articleLang === "de" 
                  ? "Wir bauen nicht nur Websites. Wir schaffen digitale Auftritte, die Vertrauen aufbauen und planbares Wachstum ermöglichen." 
                  : "We don't just build websites. We build digital presences that earn trust and deliver predictable growth for businesses."}
              </p>
              <Link
                to="/#contact"
                className="group inline-flex items-center gap-4 rounded-md bg-white px-7 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-[#0071e3] hover:text-white active:scale-95"
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
                <h3 className="mb-4 text-3xl font-semibold tracking-normal md:text-4xl">
                  {articleLang === "de" ? "Weiterführende Lektüre" : "Further Reading"}
                </h3>
                <p className="text-base font-medium text-neutral-500">
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
                  <div className="mb-6 aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/5 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/10">
                    <ImageWithFallback
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-normal text-[#0071e3]">
                        {r.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span className="text-[0.875rem] font-semibold text-neutral-400">
                        {r.readTime}
                      </span>
                    </div>
                    <h4 className="line-clamp-2 text-2xl font-semibold leading-tight tracking-normal transition-colors group-hover:text-[#0071e3]">
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
