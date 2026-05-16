import { useEffect, useState } from "react";
import { ImageComparison } from "./ui/image-comparison-slider";
import { LeadCapture } from "./LeadCapture";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Code2,
  MonitorSmartphone,
  Palette,
  RefreshCw,
  Search,
} from "lucide-react";
import { useLanguage, type Language } from "./LanguageContext";
import dogruNew from "../assets/Dogru kanzlei/Dogru kanzlei new.png";
import dogruOld from "../assets/Dogru kanzlei/Dogru kanzlei old.png";
import credibility from "../assets/Dogru kanzlei/Credibility.png?format=webp&w=1600";
import googleCredibility from "../assets/Dogru kanzlei/Google credibility.png?format=webp&w=1800";
import websiteHeroBackground from "../assets/Website service page/website hero new.png";
import conversionVisualEn from "../assets/services/english conversion.png";
import conversionVisualDe from "../assets/services/german conversion.png";
import resultsEn from "../assets/services/Results english .png";
import resultsDe from "../assets/services/Results german 1.png";

const copy = {
  de: {
    heroLabel: "Leistungen",
    heroTitle1: "Ihre Website sollte",
    heroTitle2a: "Kunden",
    heroTitle2b: "bringen.",
    heroText: "Wir bauen Ihnen ein digitales System, das Besucher in Anfragen verwandelt, zuverlässig, automatisch, messbar.",
    start: "Jetzt starten",
    viewProjects: "Projekte ansehen",
    problem1: "Die meisten Unternehmen haben eine Website.",
    problem2: "Fast keine bringt regelmäßig Anfragen.",
    problemText:
      "Nicht weil das Produkt schlecht ist. Sondern weil die Website nicht gefunden wird, nicht überzeugt, und keinen klaren nächsten Schritt hat. Genau das ändern wir.",
    flowLabel: "Wie es funktioniert",
    flowTitle: "Von der Suche zur Anfrage.",
    flowText: "Kein Zufall. Kein Glück. Ein System.",
    trustChapterLabel: "Warum Vertrauen entscheidet",
    trustChapterTitle: "Mehr Vertrauen. Mehr Anfragen.",
    trustChapterText:
      "Wir steigern Ihre Conversions mit einer individuell handcodierten Website, abgestimmt auf Ihre Leistungen und Zielgruppe, damit Sie online mehr Kunden gewinnen.",
    trustChapterQuote: "Sofort gewusst: Das ist die richtige Wahl.",
    trustChapterVerified: "Verifizierte Bewertung",
    trustPoint1: "Klares Angebot",
    trustPoint2: "Professionelles Design",
    trustPoint3: "Nächster Schritt",
    includedLabel: "Leistungsumfang",
    includedTitle: "Alles, was Sie brauchen.",
    includedText: "Kein Flickwerk. Kein Outsourcing. Alles aus einer Hand.",
    proofLabel: "Referenz",
    proofTitle: "Von unsichtbar zu täglich Anfragen.",
    proofP1: "Unser Kunde hatte bereits eine Website. Aber sie sah aus wie 2012, brachte keine Anfragen und war auf Google nicht auffindbar.",
    proofP2: "Wir haben die Website von Grund auf neu gebaut, klare Positionierung, modernes Design, vollständige SEO-Implementierung. Eine Seite, die nicht nur gut aussieht, sondern arbeitet.",
    proofP3: "Heute erhält er regelmäßig Anfragen von Menschen, die ihn auf Google gefunden haben. Besucher verstehen sein Angebot, bevor sie ihn kontaktieren.",
    proofEvidenceLabel: "Google Ads Performance",
    proofEvidenceTitle: "Sichtbarkeit, Klicks und Anfragen werden messbar.",
    proofEvidenceText: "Erst wird die Website organisch sichtbar. Danach werden Kampagnen so gemessen, dass aus Suchanfragen konkrete Conversions werden.",
    faqLabel: "Häufige Fragen",
    faqTitle1: "Ihre Fragen.",
    faqTitle2: "Unsere Antworten.",
    closingTitle: "Bereit, wenn Sie es sind.",
    closingText: "Kostenlose Erstberatung. Kein Vertrag. Kein Risiko.",
    direct: "Oder schreiben Sie uns direkt:",
    pricingLink: "zur Preisseite",
    email: "info@nüll.com",
    sticky: "Jetzt starten",
    before: "Vorher",
    after: "Nachher",
  },
  en: {
    heroLabel: "Services",
    heroTitle1: "Your website should",
    heroTitle2a: "clients.",
    heroTitle2b: "bring",
    heroText: "We build you a digital system that turns visitors into enquiries, reliably, automatically, measurably.",
    start: "Get started",
    viewProjects: "View projects",
    problem1: "Most businesses have a website.",
    problem2: "Almost none of them generate consistent enquiries.",
    problemText:
      "Not because the product is bad. But because the website is not found, does not convince, and has no clear next step. That is exactly what we change.",
    flowLabel: "How it works",
    flowTitle: "From search to enquiry.",
    flowText: "Proven system that converts Google searches into qualified leads.",
    trustChapterLabel: "Why trust matters",
    trustChapterTitle: "More trust. More enquiries.",
    trustChapterText:
      "We increase your conversions by designing a custom, hand-coded website tailored to your services and audience, so you get more clients online.",
    trustChapterQuote: "Immediately knew: this is the right choice.",
    trustChapterVerified: "Verified review",
    trustPoint1: "Clear offer",
    trustPoint2: "Professional design",
    trustPoint3: "Right next step",
    includedLabel: "What's included",
    includedTitle: "Everything you need.",
    includedText: "No patchwork. No outsourcing. Everything from one place.",
    proofLabel: "Case study",
    proofTitle: "From invisible to daily enquiries.",
    proofP1: "Our client already had a website. But it looked like 2012, generated no enquiries, and could not be found on Google.",
    proofP2: "We rebuilt the website from scratch, clear positioning, modern design, full SEO implementation. A site that does not just look good, but works.",
    proofP3: "Today he regularly receives enquiries from people who found him on Google. Visitors understand his offer before they contact him.",
    proofEvidenceLabel: "Google Ads performance",
    proofEvidenceTitle: "Visibility, clicks, and enquiries become measurable.",
    proofEvidenceText: "First the website becomes visible organically. Then campaigns are measured so search demand can be tracked through to concrete conversions.",
    faqLabel: "Frequently asked questions",
    faqTitle1: "Your questions.",
    faqTitle2: "Our answers.",
    closingTitle: "Ready when you are.",
    closingText: "Free initial consultation. No contract. No risk.",
    direct: "Or write to us directly:",
    pricingLink: "to the pricing page",
    email: "info@nüll.com",
    sticky: "Get started",
    before: "Before",
    after: "After",
  },
  tr: {
    heroLabel: "Hizmetler",
    heroTitle1: "Web siteniz",
    heroTitle2a: "müşteri",
    heroTitle2b: "getirmeli.",
    heroText: "Ziyaretçileri taleplere dönüştüren dijital bir sistem kurarız, güvenilir, otomatik, ölçülebilir.",
    start: "Başlayın",
    viewProjects: "Projeleri gör",
    problem1: "Çoğu işletmenin web sitesi var.",
    problem2: "Ama çok azı düzenli talep getiriyor.",
    problemText:
      "Ürün kötü olduğu için değil. Web sitesi bulunmadığı, ikna etmediği ve net bir sonraki adımı olmadığı için. Biz bunu değiştiriyoruz.",
    flowLabel: "Nasıl çalışır",
    flowTitle: "Aramadan talebe.",
    flowText: "Tesadüf değil. Şans değil. Sistem.",
    trustChapterLabel: "Güven neden belirleyici",
    trustChapterTitle: "Daha fazla güven. Daha fazla talep.",
    trustChapterText:
      "Hizmetlerinize ve hedef kitlenize özel, elde kodlanmış bir web sitesi tasarlayarak dönüşümlerinizi artırırız. Böylece online daha fazla müşteri kazanırsınız.",
    trustChapterQuote: "Hemen anladım: doğru seçim bu.",
    trustChapterVerified: "Doğrulanmış yorum",
    trustPoint1: "Net teklif",
    trustPoint2: "Profesyonel tasarım",
    trustPoint3: "Doğru sonraki adım",
    includedLabel: "Kapsam",
    includedTitle: "İhtiyacınız olan her şey.",
    includedText: "Yama yok. Dış kaynak yok. Her şey tek yerden.",
    proofLabel: "Referans",
    proofTitle: "Görünmezlikten günlük taleplere.",
    proofP1: "Müşterimizin zaten bir web sitesi vardı. Ama eski görünüyordu, talep getirmiyordu ve Google'da bulunmuyordu.",
    proofP2: "Web sitesini baştan kurduk, net konumlandırma, modern tasarım ve SEO temeli. Sadece iyi görünen değil, çalışan bir site.",
    proofP3: "Bugün Google üzerinden düzenli talepler alıyor. Ziyaretçiler iletişime geçmeden önce teklifini anlıyor.",
    proofEvidenceLabel: "Google Ads performansı",
    proofEvidenceTitle: "Görünürlük, tıklamalar ve talepler ölçülebilir hale gelir.",
    proofEvidenceText: "Önce web sitesi organik olarak görünür hale gelir. Sonra kampanyalar, arama talebini somut dönüşümlere kadar takip edecek şekilde ölçülür.",
    faqLabel: "Sık sorulan sorular",
    faqTitle1: "Sorularınız.",
    faqTitle2: "Yanıtlarımız.",
    closingTitle: "Siz hazır olduğunuzda hazırız.",
    closingText: "Ücretsiz ilk görüşme. Sözleşme yok. Risk yok.",
    direct: "Ya da bize doğrudan yazın:",
    pricingLink: "fiyat sayfasına",
    email: "info@nüll.com",
    sticky: "Başlayın",
    before: "Önce",
    after: "Sonra",
  },
} satisfies Record<Language, Record<string, string>>;

const seoCopy = {
  de: {
    ...copy.de,
    heroLabel: "SEO-Service",
    heroTitle1: "Ihre Kunden suchen",
    heroTitle2a: "Sie",
    heroTitle2b: "bei Google.",
    heroText: "Wir bauen Ihre Google-Sichtbarkeit systematisch auf, technisch sauber, inhaltlich relevant und messbar auf echte Anfragen ausgerichtet.",
    viewProjects: "Referenzen ansehen",
    problem1: "Ihre besten Kunden suchen bereits.",
    problem2: "Aber sie finden oft Ihre Konkurrenz.",
    problemText:
      "SEO ist kein Trick. Es ist die klare Struktur aus Suchintention, technischer Grundlage, relevanten Seiten und laufender Optimierung. Genau das bauen wir für Sie auf.",
    proofTitle: "Von nicht auffindbar zu messbarer Google-Sichtbarkeit.",
    proofP2: "Wir haben die Seite technisch und inhaltlich neu aufgebaut, klare Leistungsseiten, saubere Struktur und ein Fundament, das Google verstehen kann.",
    faqLabel: "SEO-Fragen",
    closingTitle: "Bereit, sichtbar zu werden.",
    closingText: "Kostenlose SEO-Ersteinschätzung. Kein Vertrag. Kein Risiko.",
  },
  en: {
    ...copy.en,
    heroLabel: "SEO Service",
    heroTitle1: "Your clients are",
    heroTitle2a: "Google.",
    heroTitle2b: "searching on",
    heroText: "We build your Google visibility systematically, with clean technical foundations, relevant pages, and measurable progress toward real enquiries.",
    viewProjects: "View proof",
    problem1: "Your best customers are already searching.",
    problem2: "But they often find your competitors first.",
    problemText:
      "SEO is not a trick. It is the structure of search intent, technical foundations, relevant pages, and ongoing optimisation. That is what we build for you.",
    proofTitle: "From invisible to measurable Google visibility.",
    proofP2: "We rebuilt the site technically and strategically, clear service pages, clean structure, and a foundation Google can understand.",
    faqLabel: "SEO questions",
    closingTitle: "Ready to become visible.",
    closingText: "Free initial SEO assessment. No contract. No risk.",
  },
  tr: {
    ...copy.tr,
    heroLabel: "SEO Hizmeti",
    heroTitle1: "Müşterileriniz",
    heroTitle2a: "Google'da",
    heroTitle2b: "arıyor.",
    heroText: "Google görünürlüğünüzü teknik temel, doğru içerik yapısı ve gerçek taleplere odaklanan ölçülebilir SEO çalışmasıyla büyütürüz.",
    viewProjects: "Kanıtları gör",
    problem1: "En iyi müşterileriniz zaten arıyor.",
    problem2: "Ama çoğu zaman önce rakiplerinizi buluyor.",
    problemText:
      "SEO bir hile değildir. Arama niyeti, teknik temel, ilgili sayfalar ve düzenli optimizasyon sistemidir. Biz bunu sizin için kurarız.",
    proofTitle: "Görünmezlikten ölçülebilir Google görünürlüğüne.",
    proofP2: "Siteyi teknik ve stratejik olarak yeniden kurduk: net hizmet sayfaları, temiz yapı ve Google'ın anlayabileceği sağlam bir temel.",
    faqLabel: "SEO soruları",
    closingTitle: "Görünür olmaya hazır mısınız?",
    closingText: "Ücretsiz ilk SEO değerlendirmesi. Sözleşme yok. Risk yok.",
  },
} satisfies Record<Language, Record<string, string>>;

const serviceCards = [
  {
    number: "01",
    Icon: MonitorSmartphone,
    title: "Professionelle Website",
    body: "Eine Website, die Ihre Expertise klar präsentiert und Besucher überzeugt. Kein Template. Kein Kompromiss.",
  },
  {
    number: "02",
    Icon: Code2,
    title: "Technische Umsetzung",
    body: "Schnell, sicher und auf allen Geräten perfekt. Ihre Website läuft zuverlässig, damit Sie es nicht müssen.",
  },
  {
    number: "03",
    Icon: Palette,
    title: "Markenidentität",
    body: "Logo, Farben und Auftritt, die Ihr Unternehmen von anderen unterscheiden. Professionalität, die man sofort sieht.",
  },
  {
    number: "04",
    Icon: Search,
    title: "Google-Sichtbarkeit",
    body: "Wenn jemand nach Ihren Leistungen sucht, soll er Sie finden. Wir sorgen dafür, dass Google Ihr Unternehmen empfiehlt.",
  },
  {
    number: "05",
    Icon: Bot,
    title: "KI-Chat-Sichtbarkeit",
    body: "Wir strukturieren Ihre Website so, dass Ihr Unternehmen in KI-Antworten, Empfehlungen und Recherche-Chats sichtbar wird.",
    badge: "KI-Suche",
    footer: "In jedem Paket inklusive",
    dark: true,
  },
  {
    number: "06",
    Icon: RefreshCw,
    title: "Monatliche Betreuung",
    body: "Updates, Sicherheit, Änderungen und laufende Betreuung. Ihre Website bleibt immer aktuell, ohne dass Sie sich darum kümmern müssen.",
  },
] as const;

const faqs = [
  {
    q: "Wie lange dauert es, bis ich Ergebnisse sehe?",
    a: "SEO braucht Zeit, in der Regel 3 bis 6 Monate bis erste messbare Ergebnisse sichtbar werden. Die Website selbst ist sofort wirksam: besserer erster Eindruck, klarere Kommunikation, mehr Vertrauen.",
  },
  {
    q: "Muss ich Inhalte oder Texte liefern?",
    a: "Nein. Wir übernehmen die Texte, Struktur und Inhalte. Sie müssen uns nur erklären, was Sie tun und für wen, den Rest erledigen wir.",
  },
  {
    q: "Was, wenn ich schon eine Website habe?",
    a: "Kein Problem. Wir analysieren zuerst, was vorhanden ist. Manchmal ist ein Relaunch sinnvoll, manchmal reichen gezielte Verbesserungen. Wir empfehlen nur, was wirklich notwendig ist.",
  },
  {
    q: "Für welche Branchen arbeitet nüll.?",
    a: "Wir arbeiten mit Dienstleistern, Beratern, Agenturen und Unternehmen, die lokal oder regional Kunden gewinnen wollen. Wenn Sie Leistungen verkaufen und online gefunden werden wollen, sind Sie richtig bei uns.",
  },
  {
    q: "Was kostet das?",
    a: "Unsere Pakete beginnen ab einem fixen Monatsbeitrag, kein versteckter Stundensatz, keine Überraschungen. Alle Details finden Sie auf der Preisseite.",
  },
] as const;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#007aff]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
      {children}
    </p>
  );
}

function CaseStudySection({ c, lang }: { c: Record<string, string>; lang: Language }) {
  const resultsImage = lang === "de" ? resultsDe : resultsEn;

  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-14">
          <p className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.22em] text-[#007aff]">
            {c.proofLabel} — Hasan Doğru Kanzlei
          </p>
          <h2 className="max-w-6xl text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.06] tracking-[-0.04em] text-[#0e0e10]">
            {c.proofTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] font-medium leading-relaxed text-[#86868b]">
            {c.proofP2}
          </p>
        </div>

        {/* Before / After slider */}
        <ImageComparison
          beforeImage={dogruOld}
          afterImage={dogruNew}
          altBefore={c.before}
          altAfter={c.after}
        />

        <img
          src={resultsImage}
          alt=""
          aria-hidden="true"
          className="mt-14 w-full object-contain"
        />

        {/* Proof screenshots */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <img
            src={credibility}
            alt="Google Search Console performance"
            className="w-full object-contain"
          />
          <img
            src={googleCredibility}
            alt="Google Ads performance"
            className="w-full object-contain"
          />
        </div>

      </div>
    </section>
  );
}

export function ServicesPage({ variant = "website" }: { variant?: "website" | "seo" }) {
  const { lang } = useLanguage();
  const pageCopy = variant === "seo" ? seoCopy : copy;
  const c = pageCopy[lang] ?? pageCopy.de;
  const [openFaq, setOpenFaq] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const conversionVisual = lang === "de" ? conversionVisualDe : conversionVisualEn;

  useEffect(() => {
    const openQuote = () => setIsQuoteOpen(true);
    window.addEventListener("open-quote-preview", openQuote);
    return () => window.removeEventListener("open-quote-preview", openQuote);
  }, []);

  return (
    <main className="bg-white">
      <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-24 pt-32 md:px-6 md:pb-28 md:pt-36">
        <img
          src={websiteHeroBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        <div className="relative mx-auto flex w-full max-w-[92rem] items-center md:min-h-[calc(100vh-16rem)]">
          <div className="max-w-[690px]">
            <Label>{c.heroLabel}</Label>
            <h1 className="max-w-3xl text-[clamp(3rem,5vw,3.85rem)] font-bold leading-[0.98] tracking-[-0.055em] text-[#0e0e10]">
              <span className="block md:whitespace-nowrap">{c.heroTitle1}</span>
              {lang === "en" ? (
                <span className="block md:whitespace-nowrap">{c.heroTitle2b} <span className="text-[#007aff]">{c.heroTitle2a}</span></span>
              ) : (
                <span className="block md:whitespace-nowrap"><span className="text-[#007aff]">{c.heroTitle2a}</span> {c.heroTitle2b}</span>
              )}
            </h1>
            <p className="mt-8 max-w-2xl text-[1.125rem] font-medium leading-relaxed text-[#86868b] md:text-[1.35rem]">
              {c.heroText}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setIsQuoteOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0e0e10] px-7 py-4 text-[0.95rem] font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#1c1c1e]">
                {c.start} <ArrowRight size={18} />
              </button>
              <a href="/#work" className="inline-flex items-center justify-center gap-1 px-2 py-3 text-[1rem] font-bold text-[#0e0e10] transition hover:text-[#007aff]">
                {c.viewProjects} <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-[1320px] text-center">
          <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0e0e10]">
            <span className="block md:whitespace-nowrap">{c.problem1}</span>
            <span className="mt-4 block text-[0.76em] font-semibold leading-[1.12] tracking-[-0.035em] text-[#86868b] md:whitespace-nowrap">
              {c.problem2}
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-[680px] text-center text-[1.02rem] font-medium leading-relaxed text-[#86868b] md:text-[1.12rem]">
            {c.problemText}
          </p>
          <div className="relative mx-auto mt-10 w-full max-w-[840px] overflow-hidden md:mt-12 md:max-w-[1160px] lg:max-w-[1320px]">
            <img
              src={conversionVisual}
              alt=""
              aria-hidden="true"
              className="w-full object-contain"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0)_4.5%,rgba(255,255,255,0)_95.5%,#fff_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0)_6%,rgba(255,255,255,0)_94%,#fff_100%)]" />
          </div>
        </div>
      </section>

      <CaseStudySection c={c} lang={lang} />

      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <Label>{c.faqLabel}</Label>
            <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10]">
              <span className="block">{c.faqTitle1}</span>
              <span className="block text-[#86868b]">{c.faqTitle2}</span>
            </h2>
          </div>
          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-[1.1rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[#86868b] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-3xl text-[1rem] font-medium leading-relaxed text-[#86868b]">
                        {faq.a} {index === 4 && <a href="/#pricing" className="font-bold text-[#007aff]">{c.pricingLink} →</a>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#0a0f1e] px-6 py-24 text-center md:px-10">
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.05em] text-white">
            {c.closingTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1.125rem] font-medium text-white/55">{c.closingText}</p>
          <button type="button" onClick={() => setIsQuoteOpen(true)} className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#007aff] px-8 py-4 text-[1rem] font-bold text-white transition hover:bg-[#0066d6]">
            {c.start} <ArrowRight size={18} />
          </button>
          <p className="mt-6 text-[0.95rem] font-medium text-white/45">
            {c.direct} <a href="mailto:info@nüll.com" className="text-white">{c.email}</a>
          </p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[9999998] border-t border-black/10 bg-white/85 px-4 py-3 backdrop-blur-xl md:hidden">
        <button type="button" onClick={() => setIsQuoteOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0e0e10] py-4 text-[0.95rem] font-bold text-white">
          {c.sticky} <ArrowRight size={17} />
        </button>
      </div>

      <LeadCapture isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
