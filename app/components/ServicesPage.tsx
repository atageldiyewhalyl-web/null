import { useEffect, useState } from "react";
import { ImageComparison } from "./ui/image-comparison-slider";
import { LeadCapture } from "./LeadCapture";
import {
  ArrowRight,
  BriefcaseBusiness,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Hammer,
  MapPin,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  RefreshCw,
  Search,
  Scale,
  Target,
} from "lucide-react";
import { useLanguage, type Language } from "./LanguageContext";
import dogruNew from "../assets/Dogru kanzlei/Dogru kanzlei new.png";
import dogruOld from "../assets/Dogru kanzlei/Dogru kanzlei old.png";
import credibility from "../assets/Dogru kanzlei/Credibility.png?format=webp&w=1600";
import googleCredibility from "../assets/Dogru kanzlei/Google credibility.png?format=webp&w=1800";
import websiteHeroBackground from "../assets/Website service page/website hero new.png";
import seoHeroBackground from "../assets/services/seo-background-hero.webp";
import googleAdsHeroBackground from "../assets/services/google-ads-hero.webp";
import conversionVisualEn from "../assets/services/english conversion.png";
import conversionVisualDe from "../assets/services/german conversion.png";
import resultsEn from "../assets/services/Results english .png";
import resultsDe from "../assets/services/Results german 1.png";
import seoStepSearch from "../assets/services/seo-step-search.svg";
import seoStepStructure from "../assets/services/seo-step-structure.svg";
import seoStepTrust from "../assets/services/seo-step-trust.svg";
import seoStepMeasurement from "../assets/services/seo-step-measurement.svg";

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
    heroText: "SEO für Kanzleien, Handwerksbetriebe und Dienstleister in Deutschland, die planbar mehr Anfragen gewinnen wollen. Technisch sauber, lokal sichtbar, messbar aufgebaut.",
    viewProjects: "Referenzen ansehen",
    problem1: "Gute Arbeit reicht nicht,",
    problem2: "wenn Google Ihre Konkurrenz zeigt.",
    problemText:
      "Viele Unternehmen haben eine Website. Aber keine klare Seitenstruktur, keine lokalen Leistungsseiten, kein gepflegtes Suchfundament und keine Inhalte, die Suchende wirklich überzeugen. Wir bauen daraus ein System für echte Anfragen.",
    proofTitle: "Von kaum auffindbar zu messbarer Google-Sichtbarkeit.",
    proofP2: "Wir haben die Kanzlei neu positioniert, die Website technisch und inhaltlich aufgebaut und die Grundlage für SEO, Google Ads und mehrsprachige Mandatsanfragen geschaffen.",
    faqLabel: "SEO-Fragen",
    faqTitle1: "SEO ohne Nebel.",
    faqTitle2: "Klar erklärt.",
    closingTitle: "Bereit, sichtbar zu werden.",
    closingText: "Kostenlose SEO-Ersteinschätzung. Wir zeigen Ihnen, wo Sie stehen und welche nächsten Schritte sinnvoll sind.",
  },
  en: {
    ...copy.en,
    heroLabel: "SEO Service",
    heroTitle1: "Your clients are",
    heroTitle2a: "Google.",
    heroTitle2b: "searching on",
    heroText: "SEO for law firms, trades, consultants, and service businesses in Germany that want predictable enquiries from Google. Clean technical foundations, local visibility, measurable progress.",
    viewProjects: "View proof",
    problem1: "Your best customers are already searching.",
    problem2: "But they often find your competitors first.",
    problemText:
      "Most businesses have a website, but no clear service structure, local landing pages, search foundation, or content that truly builds trust. We turn that into a system for real enquiries.",
    proofTitle: "From invisible to measurable Google visibility.",
    proofP2: "We repositioned the law firm, rebuilt the website technically and strategically, and created the foundation for SEO, Google Ads, and measurable enquiries.",
    faqLabel: "SEO questions",
    faqTitle1: "Clear SEO.",
    faqTitle2: "No fog.",
    closingTitle: "Ready to become visible.",
    closingText: "Free initial SEO assessment. We show you where you stand and which next steps make sense.",
  },
  tr: {
    ...copy.tr,
    heroLabel: "SEO Hizmeti",
    heroTitle1: "Müşterileriniz",
    heroTitle2a: "Google'da",
    heroTitle2b: "arıyor.",
    heroText: "Almanya'daki hukuk büroları, zanaat işletmeleri, danışmanlar ve hizmet işletmeleri için Google'dan düzenli talep getiren SEO sistemi kurarız.",
    viewProjects: "Kanıtları gör",
    problem1: "En iyi müşterileriniz zaten arıyor.",
    problem2: "Ama çoğu zaman önce rakiplerinizi buluyor.",
    problemText:
      "Çoğu işletmenin web sitesi var. Ama net hizmet yapısı, yerel sayfalar, teknik SEO temeli ve güven oluşturan içerik yok. Biz bunu gerçek taleplere çalışan bir sisteme dönüştürürüz.",
    proofTitle: "Görünmezlikten ölçülebilir Google görünürlüğüne.",
    proofP2: "Kanzleiyi yeniden konumlandırdık, siteyi teknik ve içerik olarak kurduk; SEO, Google Ads ve ölçülebilir talepler için sağlam bir temel oluşturduk.",
    faqLabel: "SEO soruları",
    faqTitle1: "Net SEO.",
    faqTitle2: "Boş vaat yok.",
    closingTitle: "Görünür olmaya hazır mısınız?",
    closingText: "Ücretsiz ilk SEO değerlendirmesi. Nerede durduğunuzu ve hangi adımların mantıklı olduğunu gösteririz.",
  },
} satisfies Record<Language, Record<string, string>>;

const googleAdsCopy = {
  de: {
    ...copy.de,
    heroLabel: "Google Ads Agentur",
    heroTitle1: "Google Ads Agentur",
    heroTitle2a: "für Dienstleister.",
    heroTitle2b: "",
    heroText: "Google Ads Betreuung für Kanzleien, Handwerksbetriebe, Berater und Dienstleister in Deutschland. Wir verbinden Kampagnen, Landingpages und Conversion Tracking, damit aus kaufbereiter Suche echte Anfragen werden.",
    viewProjects: "Referenzen ansehen",
    problem1: "Klicks sind nicht das Ziel.",
    problem2: "Qualifizierte Anfragen sind das Ziel.",
    problemText:
      "Viele Kampagnen verbrennen Budget, weil Suchbegriffe, Anzeigen, Landingpage, Tracking und Angebot nicht zusammenarbeiten. Wir bauen Google Ads und SEA als Akquise-System: sichtbar bei kaufbereiter Suche, messbar bis zur Anfrage.",
    proofTitle: "Von unklaren Klicks zu messbaren Anfragen.",
    proofP2: "Wir haben Website, Suchintention, Conversion-Punkte und Kampagnen so verbunden, dass aus Google-Suchen konkrete Anfragen werden, nicht nur Traffic.",
    proofEvidenceLabel: "Google Ads Performance",
    proofEvidenceTitle: "Budget, Klicks und Anfragen werden steuerbar.",
    proofEvidenceText: "Wir messen nicht nur Klicks. Wir prüfen, welche Suchbegriffe, Anzeigen und Seiten echte Anfragen bringen und optimieren laufend darauf.",
    faqLabel: "Google-Ads-Fragen",
    faqTitle1: "Ads ohne Rätsel.",
    faqTitle2: "Klar erklärt.",
    closingTitle: "Bereit, Nachfrage zu aktivieren.",
    closingText: "Kostenlose Google-Ads-Ersteinschätzung. Wir prüfen, wo Budget sinnvoll eingesetzt werden kann.",
  },
  en: {
    ...copy.en,
    heroLabel: "Google Ads Agency",
    heroTitle1: "Google Ads agency",
    heroTitle2a: "for service businesses.",
    heroTitle2b: "",
    heroText: "Google Ads management for law firms, trades, consultants, and service businesses in Germany. We connect campaigns, landing pages, and conversion tracking so buyer searches turn into real enquiries.",
    viewProjects: "View proof",
    problem1: "Clicks are not the goal.",
    problem2: "Qualified enquiries are the goal.",
    problemText:
      "Many campaigns waste budget because keywords, ads, landing pages, tracking, and offer do not work together. We build Google Ads and SEA as an acquisition system: visible for high-intent searches, measurable through to enquiry.",
    proofTitle: "From unclear clicks to measurable enquiries.",
    proofP2: "We connected website, search intent, conversion points, and campaigns so Google searches turn into concrete enquiries, not just traffic.",
    proofEvidenceLabel: "Google Ads performance",
    proofEvidenceTitle: "Budget, clicks, and enquiries become controllable.",
    proofEvidenceText: "We do not only measure clicks. We identify which terms, ads, and pages create real enquiries, then optimise continuously.",
    faqLabel: "Google Ads questions",
    faqTitle1: "Clear Ads.",
    faqTitle2: "No guesswork.",
    closingTitle: "Ready to activate demand.",
    closingText: "Free initial Google Ads assessment. We show where budget can be used sensibly.",
  },
  tr: {
    ...copy.tr,
    heroLabel: "Google Ads Ajansı",
    heroTitle1: "Hizmet işletmeleri için",
    heroTitle2a: "Google Ads ajansı.",
    heroTitle2b: "",
    heroText: "Almanya'daki hukuk büroları, zanaat işletmeleri, danışmanlar ve hizmet işletmeleri için Google Ads yönetimi. Kampanya, landing page ve dönüşüm ölçümünü tek sistemde bağlarız.",
    viewProjects: "Kanıtları gör",
    problem1: "Amaç tıklama değildir.",
    problem2: "Amaç nitelikli taleptir.",
    problemText:
      "Birçok kampanya bütçe yakar; çünkü anahtar kelime, reklam, landing page, ölçüm ve teklif birlikte çalışmaz. Google Ads ve SEA'yı talebe kadar ölçülen bir akquise sistemine dönüştürürüz.",
    proofTitle: "Belirsiz tıklamalardan ölçülebilir taleplere.",
    proofP2: "Web sitesi, arama niyeti, dönüşüm noktaları ve kampanyaları bağlayarak Google aramalarını sadece trafiğe değil, gerçek taleplere dönüştürdük.",
    proofEvidenceLabel: "Google Ads performansı",
    proofEvidenceTitle: "Bütçe, tıklamalar ve talepler kontrol edilebilir olur.",
    proofEvidenceText: "Sadece tıklama ölçmeyiz. Hangi aramalar, reklamlar ve sayfalar gerçek talep getiriyor, bunu bulur ve sürekli optimize ederiz.",
    faqLabel: "Google Ads soruları",
    faqTitle1: "Net Ads.",
    faqTitle2: "Tahmin yok.",
    closingTitle: "Talebi aktive etmeye hazır mısınız?",
    closingText: "Ücretsiz ilk Google Ads değerlendirmesi. Bütçenin nerede mantıklı kullanılabileceğini gösteririz.",
  },
} satisfies Record<Language, Record<string, string>>;

const seoAudiences = {
  de: [
    { Icon: Scale, title: "Kanzleien & Anwälte", body: "Mandanten suchen nach Rechtsgebiet und Stadt. Wir bauen die Seitenstruktur, die dafür gefunden werden kann." },
    { Icon: Hammer, title: "Handwerk & lokale Betriebe", body: "Ob Sanitär, Umzug, Bau oder Elektro: Wer regional gesucht wird, braucht lokale Sichtbarkeit und klare Anfragewege." },
    { Icon: BriefcaseBusiness, title: "Berater & Steuerberater", body: "Komplexe Leistungen müssen schnell verständlich werden. SEO verbindet Expertise mit Vertrauen." },
    { Icon: MapPin, title: "Dienstleister in Deutschland", body: "Für Unternehmen, die nicht nur empfohlen werden wollen, sondern planbar online gefunden werden möchten." },
  ],
  en: [
    { Icon: Scale, title: "Law firms", body: "Clients search by legal field and city. We build the structure that can rank for that demand." },
    { Icon: Hammer, title: "Trades & local businesses", body: "Plumbers, movers, builders, electricians: local demand needs local visibility and clear enquiry paths." },
    { Icon: BriefcaseBusiness, title: "Consultants & tax advisors", body: "Complex services need to become easy to understand. SEO connects expertise with trust." },
    { Icon: MapPin, title: "German service businesses", body: "For businesses that want to be found predictably online, not only through referrals." },
  ],
  tr: [
    { Icon: Scale, title: "Kanzleiler & avukatlar", body: "Müvekkiller şehir ve hukuk alanına göre arar. Biz bunun için bulunabilecek yapıyı kurarız." },
    { Icon: Hammer, title: "Zanaat ve yerel işletmeler", body: "Yerel talep, yerel görünürlük ve net iletişim yolları ister." },
    { Icon: BriefcaseBusiness, title: "Danışmanlar & mali müşavirler", body: "Karmaşık hizmetler hızlı anlaşılmalı. SEO uzmanlığı güvene bağlar." },
    { Icon: MapPin, title: "Almanya'daki hizmet işletmeleri", body: "Sadece tavsiye ile değil, düzenli olarak Google üzerinden bulunmak isteyenler için." },
  ],
} satisfies Record<Language, ReadonlyArray<{ Icon: typeof Search; title: string; body: string }>>;

const googleAdsAudiences = {
  de: [
    { Icon: Scale, title: "Kanzleien & Anwälte", body: "Menschen suchen akut nach rechtlicher Hilfe. Wir machen Sie bei den richtigen Suchanfragen sichtbar." },
    { Icon: Hammer, title: "Handwerk & lokale Betriebe", body: "Notfälle, Termine und regionale Nachfrage brauchen Kampagnen, die sofort Anfragen auslösen." },
    { Icon: Target, title: "Berater & Steuerberater", body: "Komplexe Leistungen brauchen klare Anzeigen, klare Seiten und saubere Lead-Qualifizierung." },
    { Icon: MousePointerClick, title: "Dienstleister in Deutschland", body: "Für Unternehmen, die Nachfrage nicht nur organisch aufbauen, sondern gezielt aktivieren möchten." },
  ],
  en: [
    { Icon: Scale, title: "Law firms", body: "People search with urgent legal needs. We make you visible for the searches that matter." },
    { Icon: Hammer, title: "Trades & local businesses", body: "Emergencies, bookings, and local demand need campaigns that create enquiries fast." },
    { Icon: Target, title: "Consultants & tax advisors", body: "Complex services need clear ads, clear landing pages, and clean lead qualification." },
    { Icon: MousePointerClick, title: "German service businesses", body: "For businesses that want to activate demand directly, not only wait for organic growth." },
  ],
  tr: [
    { Icon: Scale, title: "Kanzleiler & avukatlar", body: "İnsanlar acil hukuki destek arar. Sizi doğru aramalarda görünür yaparız." },
    { Icon: Hammer, title: "Zanaat ve yerel işletmeler", body: "Acil işler, randevular ve yerel talep hızlı talep üreten kampanyalar ister." },
    { Icon: Target, title: "Danışmanlar & mali müşavirler", body: "Karmaşık hizmetler net reklam, net landing page ve temiz lead ölçümü ister." },
    { Icon: MousePointerClick, title: "Almanya'daki hizmet işletmeleri", body: "Talebi sadece organik olarak beklemek değil, doğrudan aktive etmek isteyen işletmeler için." },
  ],
} satisfies Record<Language, ReadonlyArray<{ Icon: typeof Search; title: string; body: string }>>;

const seoSystemSteps = {
  de: [
    { number: "01", title: "Suchintention", body: "Wir prüfen, wonach Ihre Kunden wirklich suchen: Leistung, Ort, Problem, Dringlichkeit." },
    { number: "02", title: "Seitenstruktur", body: "Ihre Website bekommt Leistungsseiten, lokale Seiten und interne Verlinkung, die Google versteht." },
    { number: "03", title: "Vertrauen", body: "Texte, Belege, Bewertungen und klare nächste Schritte machen aus Sichtbarkeit eine Anfrage." },
    { number: "04", title: "Messung", body: "Rankings, Klicks, Anrufe, Formulare und Kampagnen werden laufend gemessen und verbessert." },
  ],
  en: [
    { number: "01", title: "Search intent", body: "We map what customers actually search for: service, location, problem, urgency." },
    { number: "02", title: "Page structure", body: "Your site gets service pages, local pages, and internal links Google can understand." },
    { number: "03", title: "Trust", body: "Copy, proof, reviews, and clear next steps turn visibility into enquiries." },
    { number: "04", title: "Measurement", body: "Rankings, clicks, calls, forms, and campaigns are tracked and improved continuously." },
  ],
  tr: [
    { number: "01", title: "Arama niyeti", body: "Müşterilerin ne aradığını çıkarırız: hizmet, şehir, problem ve aciliyet." },
    { number: "02", title: "Sayfa yapısı", body: "Google'ın anlayacağı hizmet sayfaları, yerel sayfalar ve iç bağlantı sistemi kurarız." },
    { number: "03", title: "Güven", body: "Metin, kanıt, yorumlar ve net adımlar görünürlüğü talebe çevirir." },
    { number: "04", title: "Ölçüm", body: "Sıralamalar, tıklamalar, aramalar, formlar ve kampanyalar sürekli ölçülür." },
  ],
} satisfies Record<Language, ReadonlyArray<{ number: string; title: string; body: string }>>;

const googleAdsSystemSteps = {
  de: [
    { number: "01", title: "Suchintention", body: "Wir trennen kaufbereite Suchanfragen von Klicks, die nur Budget verbrennen." },
    { number: "02", title: "Kampagnenstruktur", body: "Anzeigen, Keywords, Standorte und Budgets werden so strukturiert, dass Optimierung möglich wird." },
    { number: "03", title: "Landingpage", body: "Die Seite beantwortet die Suche sofort und führt klar zur Anfrage, zum Anruf oder zur Terminbuchung." },
    { number: "04", title: "Tracking", body: "Anfragen, Anrufe, Formulare und Qualität werden gemessen, damit Budget in Gewinner fließt." },
  ],
  en: [
    { number: "01", title: "Search intent", body: "We separate buyer searches from clicks that only burn budget." },
    { number: "02", title: "Campaign structure", body: "Ads, keywords, locations, and budgets are structured so optimisation becomes possible." },
    { number: "03", title: "Landing page", body: "The page answers the search immediately and leads clearly to enquiry, call, or booking." },
    { number: "04", title: "Tracking", body: "Enquiries, calls, forms, and lead quality are measured so budget moves toward winners." },
  ],
  tr: [
    { number: "01", title: "Arama niyeti", body: "Satın alma niyeti olan aramaları sadece bütçe yakan tıklamalardan ayırırız." },
    { number: "02", title: "Kampanya yapısı", body: "Reklam, anahtar kelime, konum ve bütçeyi optimize edilebilir şekilde kurarız." },
    { number: "03", title: "Landing page", body: "Sayfa aramaya hemen cevap verir ve kullanıcıyı talep, arama veya randevuya yönlendirir." },
    { number: "04", title: "Ölçüm", body: "Talepler, aramalar, formlar ve lead kalitesi ölçülür; bütçe kazananlara aktarılır." },
  ],
} satisfies Record<Language, ReadonlyArray<{ number: string; title: string; body: string }>>;

const seoStepIcons = [seoStepSearch, seoStepStructure, seoStepTrust, seoStepMeasurement] as const;

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

const seoFaqs = {
  de: [
    {
      q: "Wie lange dauert SEO wirklich?",
      a: "Seriös gerechnet: In den ersten 1 bis 3 Monaten wird das Fundament aufgebaut und indexiert. Nach 4 bis 6 Monaten sieht man erste belastbare Rankings. Nach 6 bis 12 Monaten entsteht der eigentliche Zinseszinseffekt.",
    },
    {
      q: "Für welche Branchen funktioniert das?",
      a: "Besonders gut für Kanzleien, Handwerksbetriebe, Steuerberater, Berater und lokale Dienstleister, weil dort Menschen mit konkretem Bedarf bei Google suchen.",
    },
    {
      q: "Brauche ich zusätzlich Google Ads?",
      a: "Nicht immer. Ads sind sinnvoll, wenn Sie sofort Sichtbarkeit brauchen oder SEO-Daten schneller lernen wollen. SEO baut den langfristigen Kanal auf, Ads können ihn am Anfang beschleunigen.",
    },
    {
      q: "Muss ich die Texte selbst schreiben?",
      a: "Nein. Wir holen Ihr Fachwissen im Gespräch ab und machen daraus strukturierte Seiten und Inhalte. Sie prüfen nur, ob die fachliche Aussage stimmt.",
    },
    {
      q: "Was ist lokale SEO?",
      a: "Lokale SEO sorgt dafür, dass Sie bei Suchanfragen mit Stadt, Region oder Nähe gefunden werden. Dazu gehören Standortseiten, Google Business Profile, Bewertungen, technische Struktur und relevante Inhalte.",
    },
  ],
  en: [
    {
      q: "How long does SEO really take?",
      a: "A serious timeline: months 1 to 3 build and index the foundation. Months 4 to 6 bring first reliable rankings. Months 6 to 12 are where compounding starts.",
    },
    {
      q: "Which industries does this work for?",
      a: "Especially law firms, trades, tax advisors, consultants, and local service businesses, because people search Google with concrete intent in those markets.",
    },
    {
      q: "Do I also need Google Ads?",
      a: "Not always. Ads help when you need immediate visibility or want faster search data. SEO builds the long-term channel; Ads can accelerate the beginning.",
    },
    {
      q: "Do I have to write the content myself?",
      a: "No. We extract your expertise in conversation and turn it into structured pages and content. You only review the substance.",
    },
    {
      q: "What is local SEO?",
      a: "Local SEO helps you show up for city, regional, and near-me searches. It includes location pages, Google Business Profile, reviews, technical structure, and relevant content.",
    },
  ],
  tr: [
    {
      q: "SEO gerçekten ne kadar sürer?",
      a: "Ciddi zaman çizgisi: İlk 1-3 ay temel kurulur ve indekslenir. 4-6 ayda ilk sağlam sıralamalar görülür. 6-12 ayda asıl birikimli etki başlar.",
    },
    {
      q: "Hangi sektörlerde çalışır?",
      a: "Özellikle hukuk büroları, zanaat işletmeleri, mali müşavirler, danışmanlar ve yerel hizmet işletmelerinde iyi çalışır; çünkü arama niyeti çok nettir.",
    },
    {
      q: "Google Ads de gerekir mi?",
      a: "Her zaman değil. Hemen görünürlük gerekiyorsa veya SEO verisini daha hızlı öğrenmek istiyorsak Ads faydalıdır. SEO uzun vadeli kanalı kurar.",
    },
    {
      q: "İçerikleri ben mi yazacağım?",
      a: "Hayır. Uzmanlığınızı görüşmede alır, bunu yapılandırılmış sayfa ve içeriklere dönüştürürüz. Siz sadece doğruluğunu kontrol edersiniz.",
    },
    {
      q: "Yerel SEO nedir?",
      a: "Şehir, bölge ve yakın çevre aramalarında görünmenizi sağlar. Konum sayfaları, Google Business Profile, yorumlar, teknik yapı ve içerikler buna dahildir.",
    },
  ],
} satisfies Record<Language, ReadonlyArray<{ q: string; a: string }>>;

const googleAdsFaqs = {
  de: [
    {
      q: "Was macht eine Google Ads Agentur genau?",
      a: "Eine gute Google Ads Agentur plant Suchbegriffe, Anzeigen, Budget, Landingpage und Conversion Tracking zusammen. Wir optimieren nicht auf Klicks, sondern auf messbare Anfragen, Anrufe und Kontaktwege.",
    },
    {
      q: "Was kostet Google Ads Betreuung?",
      a: "Das hängt von Branche, Region, Wettbewerb und Werbebudget ab. Wir starten lieber mit einem sauberen Testbudget als mit blindem Spend. Wichtig ist, dass Kampagnenmanagement, Landingpage und Tracking zusammenpassen.",
    },
    {
      q: "Brauche ich eine Landingpage für Google Ads?",
      a: "Nicht immer eine komplett neue Website, aber fast immer eine klare Landingpage. Die Seite muss zur Suchanfrage passen, Vertrauen schaffen und den nächsten Schritt messbar machen.",
    },
    {
      q: "Was ist besser: SEO oder Google Ads?",
      a: "SEO baut langfristige Sichtbarkeit auf. Google Ads erzeugt schneller Daten und Nachfrage. Für viele Dienstleister ist die stärkste Lösung: SEO als Fundament, Ads als steuerbarer Wachstumskanal.",
    },
    {
      q: "Für welche Branchen lohnt sich Google Ads?",
      a: "Besonders für Kanzleien, Handwerker, Steuerberater, Berater und lokale Dienstleister, wenn Menschen aktiv nach einer Lösung suchen. Dann kann SEA Nachfrage sehr gezielt aktivieren.",
    },
  ],
  en: [
    {
      q: "What does a Google Ads agency actually do?",
      a: "A good Google Ads agency plans search terms, ads, budget, landing page, and conversion tracking together. We optimise for measurable enquiries, calls, and contact paths, not just clicks.",
    },
    {
      q: "What does Google Ads management cost?",
      a: "It depends on industry, location, competition, and ad budget. We prefer a clean test budget over blind spend. The key is that campaign management, landing page, and tracking work together.",
    },
    {
      q: "Do I need a landing page for Google Ads?",
      a: "Not always a completely new website, but almost always a clear landing page. It must match the search, build trust, and make the next step measurable.",
    },
    {
      q: "Which is better: SEO or Google Ads?",
      a: "SEO builds long-term visibility. Google Ads creates faster data and demand. For many service businesses, the strongest setup is SEO as the foundation and Ads as the controllable growth channel.",
    },
    {
      q: "Which industries are Google Ads worth it for?",
      a: "Especially law firms, trades, tax advisors, consultants, and local service businesses where people actively search for a solution. Then SEA can activate demand very directly.",
    },
  ],
  tr: [
    {
      q: "Google Ads ajansı tam olarak ne yapar?",
      a: "İyi bir Google Ads ajansı arama terimi, reklam, bütçe, landing page ve dönüşüm ölçümünü birlikte planlar. Sadece tıklamaya değil, ölçülebilir talep ve aramalara optimize ederiz.",
    },
    {
      q: "Google Ads yönetimi ne kadar tutar?",
      a: "Sektör, bölge, rekabet ve reklam bütçesine bağlıdır. Kör harcama yerine temiz bir test bütçesiyle başlarız. Kampanya yönetimi, landing page ve ölçüm birlikte çalışmalıdır.",
    },
    {
      q: "Google Ads için landing page gerekir mi?",
      a: "Her zaman tamamen yeni bir web sitesi gerekmez, ama neredeyse her zaman net bir landing page gerekir. Sayfa aramayla eşleşmeli, güven vermeli ve sonraki adımı ölçülebilir yapmalıdır.",
    },
    {
      q: "SEO mu Google Ads mi daha iyi?",
      a: "SEO uzun vadeli görünürlük kurar. Google Ads daha hızlı veri ve talep üretir. Birçok hizmet işletmesi için en güçlü yapı: temel olarak SEO, kontrol edilebilir büyüme kanalı olarak Ads.",
    },
    {
      q: "Google Ads hangi sektörlerde mantıklı?",
      a: "Özellikle hukuk büroları, zanaat işletmeleri, mali müşavirler, danışmanlar ve yerel hizmet işletmeleri için mantıklıdır. İnsanlar aktif çözüm arıyorsa SEA talebi doğrudan aktive edebilir.",
    },
  ],
} satisfies Record<Language, ReadonlyArray<{ q: string; a: string }>>;

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
          <h2 className="max-w-none text-[clamp(2rem,4.5vw,4rem)] font-bold leading-[1.06] tracking-[-0.04em] text-[#0e0e10] xl:whitespace-nowrap">
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

type ServiceVariant = "website" | "seo" | "googleAds";

export function ServicesPage({ variant = "website" }: { variant?: ServiceVariant }) {
  const { lang } = useLanguage();
  const pageCopy = variant === "seo" ? seoCopy : variant === "googleAds" ? googleAdsCopy : copy;
  const c = pageCopy[lang] ?? pageCopy.de;
  const [openFaq, setOpenFaq] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const conversionVisual = lang === "de" ? conversionVisualDe : conversionVisualEn;
  const heroBackground = variant === "googleAds" ? googleAdsHeroBackground : variant === "seo" ? seoHeroBackground : websiteHeroBackground;
  const activeFaqs = variant === "seo" ? seoFaqs[lang] : variant === "googleAds" ? googleAdsFaqs[lang] : faqs;
  const activeGrowthAudiences = (variant === "googleAds" ? googleAdsAudiences[lang] : seoAudiences[lang]) ?? seoAudiences.de;
  const activeGrowthSteps = (variant === "googleAds" ? googleAdsSystemSteps[lang] : seoSystemSteps[lang]) ?? seoSystemSteps.de;
  const isGrowthPage = variant === "seo" || variant === "googleAds";

  useEffect(() => {
    const openQuote = () => setIsQuoteOpen(true);
    window.addEventListener("open-quote-preview", openQuote);
    return () => window.removeEventListener("open-quote-preview", openQuote);
  }, []);

  return (
    <main className="bg-white">
      <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-24 pt-32 md:px-6 md:pb-28 md:pt-36">
        <img
          src={heroBackground}
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
              ) : variant === "googleAds" && lang === "de" ? (
                <span className="block md:whitespace-nowrap"><span className="text-[#007aff]">für Dienstleister.</span></span>
              ) : variant === "googleAds" ? (
                <span className="block md:whitespace-nowrap"><span className="text-[#007aff]">{c.heroTitle2a}</span></span>
              ) : variant === "seo" && lang === "de" ? (
                <span className="block md:whitespace-nowrap">Sie bei <span className="text-[#007aff]">Google.</span></span>
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
          <h2 className="mx-auto max-w-[980px] text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0e0e10]">
            <span className="block">{c.problem1}</span>
            <span className="mx-auto mt-4 block max-w-[920px] text-[0.76em] font-semibold leading-[1.12] tracking-[-0.035em] text-[#86868b]">
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

      {isGrowthPage && (
        <section className="px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-16">
              <div>
                <Label>{lang === "de" ? "Für wen" : lang === "tr" ? "Kimler için" : "Who it is for"}</Label>
                <h2 className="text-[clamp(2.2rem,3.45vw,3.55rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10]">
                  {variant === "googleAds" && lang === "de" ? (
                    <>
                      <span className="block">Google Ads für Unternehmen,</span>
                      <span className="block">die <span className="text-[#007aff]">jetzt Anfragen</span> gewinnen wollen.</span>
                    </>
                  ) : variant === "googleAds" && lang === "tr" ? (
                    <>
                      <span className="block">Hemen talep almak isteyen</span>
                      <span className="block">işletmeler için <span className="text-[#007aff]">Google Ads.</span></span>
                    </>
                  ) : variant === "googleAds" ? (
                    <>
                      <span className="block">Google Ads</span>
                      <span className="block">for businesses that want</span>
                      <span className="block text-[#007aff]">enquiries now.</span>
                    </>
                  ) : lang === "de" ? (
                    <>
                      <span className="block">SEO für Unternehmen,</span>
                      <span className="block">die <span className="text-[#007aff]">in Deutschland</span> gefunden werden.</span>
                    </>
                  ) : lang === "tr" ? (
                    <>
                      <span className="block">Almanya'da bulunmak isteyen</span>
                      <span className="block">işletmeler için <span className="text-[#007aff]">SEO.</span></span>
                    </>
                  ) : (
                    <>
                      <span className="block">SEO for businesses</span>
                      <span className="block">that want to be found</span>
                      <span className="block text-[#007aff]">in Germany.</span>
                    </>
                  )}
                </h2>
                <p className="mt-6 max-w-xl text-[1.05rem] font-medium leading-relaxed text-[#86868b]">
                  {variant === "googleAds" && lang === "de"
                    ? "Wir starten dort, wo Suchende bereits Kaufabsicht zeigen: Recht, Handwerk, Beratung und lokale Dienstleistungen mit klarer Nachfrage."
                    : variant === "googleAds" && lang === "tr"
                      ? "Satın alma niyetinin zaten güçlü olduğu alanlara odaklanıyoruz: hukuk, zanaat, danışmanlık ve yerel hizmetler."
                      : variant === "googleAds"
                        ? "We focus where search intent is already commercial: law, trades, consulting, and local services with clear demand."
                        : lang === "de"
                    ? "Wir starten fokussiert mit den Märkten, in denen Google-Sichtbarkeit direkt zu Umsatz führt: Recht, Handwerk, Beratung und lokale Dienstleistungen."
                    : lang === "tr"
                      ? "Google görünürlüğünün doğrudan ciroya dönüştüğü alanlara odaklanıyoruz: hukuk, zanaat, danışmanlık ve yerel hizmetler."
                      : "We focus on markets where Google visibility turns directly into revenue: law, trades, consulting, and local services."}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {activeGrowthAudiences.map(({ Icon, title, body }) => (
                  <article key={title} className="rounded-[1.35rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
                    <div className="mb-6 flex h-6 w-6 items-center justify-center text-[#007aff]">
                      <Icon size={21} strokeWidth={2.4} />
                    </div>
                    <h3 className="text-[1.2rem] font-bold tracking-[-0.03em] text-[#0e0e10]">{title}</h3>
                    <p className="mt-3 text-[0.98rem] font-medium leading-relaxed text-[#86868b]">{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-20 pt-12 md:mt-24 md:pt-16">
              <div className="mb-10 flex flex-col gap-4">
                <div>
                  <Label>{lang === "de" ? "Was wir bauen" : lang === "tr" ? "Ne kuruyoruz" : "What we build"}</Label>
                  <h2 className="max-w-none text-[clamp(2.2rem,4vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10] xl:whitespace-nowrap">
                    {variant === "googleAds" && lang === "de"
                      ? "Was wir konkret für profitable Kampagnen aufbauen."
                      : variant === "googleAds" && lang === "tr"
                        ? "Karlı kampanyalar için gerçekten kurduğumuz yapı."
                        : variant === "googleAds"
                          ? "What we actually build for profitable campaigns."
                          : lang === "de"
                      ? "Was wir konkret für Ihre Sichtbarkeit aufbauen."
                      : lang === "tr"
                        ? "Görünürlüğünüz için gerçekten kurduğumuz yapı."
                        : "What we actually build for your visibility."}
                  </h2>
                </div>
                <p className="max-w-md text-[1rem] font-medium leading-relaxed text-[#86868b]">
                  {variant === "googleAds" && lang === "de"
                    ? "Die Kampagne ist nur ein Teil. Entscheidend ist das Zusammenspiel aus Suchintention, Anzeigenstruktur, Landingpage und sauberer Messung."
                    : variant === "googleAds" && lang === "tr"
                      ? "Kampanya sadece bir parça. Asıl önemli olan arama niyeti, reklam yapısı, landing page ve temiz ölçümün birlikte çalışmasıdır."
                      : variant === "googleAds"
                        ? "The campaign is only one part. What matters is the connection between intent, ad structure, landing page, and clean measurement."
                        : lang === "de"
                    ? "Die Grafik oben zeigt das Ergebnis. Hier geht es um die Arbeit darunter: Suchintention, Seitenstruktur, Vertrauen und Messung."
                    : lang === "tr"
                      ? "Yukarıdaki görsel sonucu gösterir. Burada altındaki işi anlatıyoruz: arama niyeti, yapı, güven ve ölçüm."
                      : "The visual above shows the outcome. This is the work underneath it: intent, structure, trust, and measurement."}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                {activeGrowthSteps.map((step, index) => (
                  <article key={step.number}>
                    <img
                      src={seoStepIcons[index]}
                      alt=""
                      aria-hidden="true"
                      className="mb-6 h-16 w-16 object-contain md:h-20 md:w-20"
                    />
                    <h3 className="text-[1.35rem] font-bold tracking-[-0.035em] text-[#0e0e10]">{step.title}</h3>
                    <p className="mt-3 text-[0.98rem] font-medium leading-relaxed text-[#86868b]">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <CaseStudySection c={c} lang={lang} />

      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div>
            <Label>{c.faqLabel}</Label>
            <h2 className="text-[clamp(2.4rem,4.4vw,4rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10]">
              <span className="block">{c.faqTitle1}</span>
              <span className="block text-[#86868b]">{c.faqTitle2}</span>
            </h2>
          </div>
          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {activeFaqs.map((faq, index) => {
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
