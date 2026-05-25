import { useEffect, useRef, useState, type UIEvent } from "react";
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
import besirNew from "../assets/Besir yaman /Besiryaman .webp";
import herkulesCaseStudy from "../assets/Herkules/hero-video-poster.webp";
import websiteHeroBackground from "../assets/Website service page/website hero new.webp";
import seoHeroBackground from "../assets/services/seo-background-hero.webp";
import googleAdsHeroBackground from "../assets/services/google-ads-hero.webp";
import conversionVisualEn from "../assets/services/english conversion.webp";
import conversionVisualDe from "../assets/services/german conversion.webp";
import resultsEn from "../assets/services/Results english .webp";
import resultsDe from "../assets/services/Results german 1.webp";
import scrollableCredentialOneEn from "../assets/services/Scrollable credential eng 1.webp";
import scrollableCredentialTwoEn from "../assets/services/Scrollable credential eng 2.webp";
import scrollableCredentialThreeEn from "../assets/services/Scrollable credential eng 2.png.webp";
import scrollableCredentialOneDe from "../assets/services/Scrollable credential 1 german.webp";
import scrollableCredentialTwoDe from "../assets/services/Scrollable credential 2 german.webp";
import scrollableCredentialThreeDe from "../assets/services/Scrollable credential 3 German.webp";
import seoStepSearch from "../assets/services/seo-step-search.svg";
import seoStepStructure from "../assets/services/seo-step-structure.svg";
import seoStepTrust from "../assets/services/seo-step-trust.svg";
import seoStepMeasurement from "../assets/services/seo-step-measurement.svg";

const copy = {
  de: {
    heroLabel: "Leistungen",
    heroTitle1: "Webdesign, das",
    heroTitle2a: "Anfragen",
    heroTitle2b: "bringt.",
    heroText: "Für Kanzleien, Berater und Dienstleister: eine schnelle, SEO-saubere Website, die Vertrauen aufbaut und Besucher in Anfragen verwandelt.",
    start: "Jetzt starten",
    viewProjects: "Projekte ansehen",
    problem1: "Die meisten Websites sehen gut aus.",
    problem2: "Aber sie bringen keine Anfragen.",
    problemText:
      "Nicht weil das Angebot schlecht ist. Sondern weil die Website nicht gefunden wird, nicht überzeugt und keinen klaren nächsten Schritt zeigt. Genau das ändern wir.",
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
    proofTitle: "Von Website zu Anfrage-System.",
    proofP1: "Unser Kunde hatte bereits eine Website. Aber sie sah aus wie 2012, brachte keine Anfragen und war auf Google nicht auffindbar.",
    proofP2: "Wir haben die Website von Grund auf neu gebaut, klare Positionierung, modernes Design, vollständige SEO-Implementierung. Eine Seite, die nicht nur gut aussieht, sondern arbeitet.",
    proofP3: "Heute erhält er regelmäßig Anfragen von Menschen, die ihn auf Google gefunden haben. Besucher verstehen sein Angebot, bevor sie ihn kontaktieren.",
    proofEvidenceLabel: "Google Ads Performance",
    proofEvidenceTitle: "Sichtbarkeit, Vertrauen und Anfragen werden messbar.",
    proofEvidenceText: "Die Website schafft die Grundlage: klare Positionierung, SEO-Struktur, Vertrauen und messbare Kontaktwege.",
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
    heroTitle1: "Websites that",
    heroTitle2a: "bring",
    heroTitle2b: "enquiries.",
    heroText: "For law firms, consultants, and service businesses: a fast, SEO-clean website that builds trust and turns visitors into enquiries.",
    start: "Get started",
    viewProjects: "View projects",
    problem1: "Most websites look professional.",
    problem2: "But they do not bring enquiries.",
    problemText:
      "Not because the offer is weak. Because the website is not found, does not build trust, and gives visitors no clear next step. That is exactly what we change.",
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
    proofTitle: "From website to enquiry system.",
    proofP1: "Our client already had a website. But it looked like 2012, generated no enquiries, and could not be found on Google.",
    proofP2: "We rebuilt the website from scratch, clear positioning, modern design, full SEO implementation. A site that does not just look good, but works.",
    proofP3: "Today he regularly receives enquiries from people who found him on Google. Visitors understand his offer before they contact him.",
    proofEvidenceLabel: "Google Ads performance",
    proofEvidenceTitle: "Visibility, trust, and enquiries become measurable.",
    proofEvidenceText: "The website creates the foundation: clear positioning, SEO structure, trust, and measurable contact paths.",
    faqLabel: "Frequently asked questions",
    faqTitle1: "Your questions.",
    faqTitle2: "Our answers.",
    closingTitle: "Ready when you are.",
    closingText: "Free initial consultation. No contract. No risk.",
    direct: "Or write to us directly:",
    pricingLink: "You can see the individual price here.",
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
    heroText: "Hukuk büroları, danışmanlar, zanaat işletmeleri ve yerel hizmet şirketleri için hızlı, SEO temelli ve talep getiren web siteleri kurarız.",
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
    proofTitle: "Web sitesinden talep sistemine.",
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
    heroTitle1: "SEO für Kanzleien,",
    heroTitle2a: "Handwerker",
    heroTitle2b: "und Dienstleister.",
    heroText: "SEO für Kanzleien, Handwerksbetriebe und Dienstleister in Deutschland, die planbar mehr Anfragen gewinnen wollen. Technisch sauber, lokal sichtbar, messbar aufgebaut.",
    viewProjects: "Referenzen ansehen",
    problem1: "Gute Arbeit reicht nicht,",
    problem2: "wenn Google Ihre Konkurrenz zeigt.",
    problemText:
      "Viele Unternehmen haben eine Website. Aber keine klare Seitenstruktur, keine lokalen Leistungsseiten, kein gepflegtes Suchfundament und keine Inhalte, die Suchende wirklich überzeugen. Wir bauen daraus ein System für echte Anfragen.",
    proofTitle: "Von lokaler Suche zu planbaren Umzugsanfragen.",
    proofP2: "Für Herkules Umzüge Mannheim haben wir die Website auf lokale Suchintention, klare Leistungsseiten und schnelle Kontaktwege ausgerichtet. So wird aus Google-Sichtbarkeit ein messbarer Anfragekanal für regionale Umzüge.",
    faqLabel: "SEO-Fragen",
    faqTitle1: "SEO ohne Nebel.",
    faqTitle2: "Klar erklärt.",
    closingTitle: "Bereit, sichtbar zu werden.",
    closingText: "Kostenlose SEO-Ersteinschätzung. Wir zeigen Ihnen, wo Sie stehen und welche nächsten Schritte sinnvoll sind.",
  },
  en: {
    ...copy.en,
    heroLabel: "SEO Service",
    heroTitle1: "SEO for law firms,",
    heroTitle2a: "trades & consultants",
    heroTitle2b: "in Germany.",
    heroText: "SEO for law firms, trades, consultants, and service businesses in Germany that want predictable enquiries from Google. Clean technical foundations, local visibility, measurable progress.",
    viewProjects: "View proof",
    problem1: "Your best customers are already searching.",
    problem2: "But they often find your competitors first.",
    problemText:
      "Most businesses have a website, but no clear service structure, local landing pages, search foundation, or content that truly builds trust. We turn that into a system for real enquiries.",
    proofTitle: "From local search to predictable moving enquiries.",
    proofP2: "For Herkules Umzüge Mannheim, we aligned the website around local search intent, clear service pages, and fast contact paths. That turns Google visibility into a measurable enquiry channel for regional moving services.",
    faqLabel: "SEO questions",
    faqTitle1: "Clear SEO.",
    faqTitle2: "No fog.",
    closingTitle: "Ready to become visible.",
    closingText: "Free initial SEO assessment. We show you where you stand and which next steps make sense.",
  },
  tr: {
    ...copy.tr,
    heroLabel: "SEO Hizmeti",
    heroTitle1: "Kanzleiler, zanaat",
    heroTitle2a: "ve danışmanlar için",
    heroTitle2b: "SEO.",
    heroText: "Almanya'daki hukuk büroları, zanaat işletmeleri, danışmanlar ve hizmet işletmeleri için Google'dan düzenli talep getiren SEO sistemi kurarız.",
    viewProjects: "Kanıtları gör",
    problem1: "En iyi müşterileriniz zaten arıyor.",
    problem2: "Ama çoğu zaman önce rakiplerinizi buluyor.",
    problemText:
      "Çoğu işletmenin web sitesi var. Ama net hizmet yapısı, yerel sayfalar, teknik SEO temeli ve güven oluşturan içerik yok. Biz bunu gerçek taleplere çalışan bir sisteme dönüştürürüz.",
    proofTitle: "Yerel aramadan düzenli taşıma taleplerine.",
    proofP2: "Herkules Umzüge Mannheim için web sitesini yerel arama niyeti, net hizmet sayfaları ve hızlı iletişim yolları etrafında kurduk. Böylece Google görünürlüğü bölgesel taşınma taleplerine dönüşen ölçülebilir bir kanala çevrildi.",
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
    proofP2: "Wir haben Suchintention, Landingpage, Conversion-Punkte und Kampagnen so verbunden, dass aus Google-Suchen konkrete Anfragen werden, nicht nur Traffic. Entscheidend ist die messbare Strecke vom Keyword bis zur Kontaktaufnahme.",
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
    proofP2: "We connected search intent, landing page, conversion points, and campaigns so Google searches turn into concrete enquiries, not just traffic. The key is a measurable path from keyword to contact.",
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
    proofP2: "Arama niyeti, landing page, dönüşüm noktaları ve kampanyaları bağlayarak Google aramalarını sadece trafiğe değil, gerçek taleplere dönüştürdük. Önemli olan anahtar kelimeden iletişime kadar ölçülebilir yoldur.",
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
    { Icon: Scale, title: "Kanzleien & Anwälte", body: "Mandanten suchen nach Rechtsgebiet und Stadt. Wir bauen die Seitenstruktur, die dafür gefunden werden kann.", anchor: "seo-kanzleien" },
    { Icon: Hammer, title: "Handwerk & lokale Betriebe", body: "Ob Sanitär, Umzug, Bau oder Elektro: Wer regional gesucht wird, braucht lokale Sichtbarkeit und klare Anfragewege.", anchor: "seo-handwerker" },
    { Icon: BriefcaseBusiness, title: "Berater & Steuerberater", body: "Komplexe Leistungen müssen schnell verständlich werden. SEO verbindet Expertise mit Vertrauen.", anchor: "seo-berater" },
    { Icon: MapPin, title: "Dienstleister in Deutschland", body: "Für Unternehmen, die nicht nur empfohlen werden wollen, sondern planbar online gefunden werden möchten.", anchor: "seo-dienstleister" },
  ],
  en: [
    { Icon: Scale, title: "Law firms", body: "Clients search by legal field and city. We build the structure that can rank for that demand.", anchor: "seo-law-firms" },
    { Icon: Hammer, title: "Trades & local businesses", body: "Plumbers, movers, builders, electricians: local demand needs local visibility and clear enquiry paths.", anchor: "seo-trades" },
    { Icon: BriefcaseBusiness, title: "Consultants & tax advisors", body: "Complex services need to become easy to understand. SEO connects expertise with trust.", anchor: "seo-consultants" },
    { Icon: MapPin, title: "German service businesses", body: "For businesses that want to be found predictably online, not only through referrals.", anchor: "seo-service-businesses" },
  ],
  tr: [
    { Icon: Scale, title: "Kanzleiler & avukatlar", body: "Müvekkiller şehir ve hukuk alanına göre arar. Biz bunun için bulunabilecek yapıyı kurarız.", anchor: "seo-kanzleiler" },
    { Icon: Hammer, title: "Zanaat ve yerel işletmeler", body: "Yerel talep, yerel görünürlük ve net iletişim yolları ister.", anchor: "seo-zanaat" },
    { Icon: BriefcaseBusiness, title: "Danışmanlar & mali müşavirler", body: "Karmaşık hizmetler hızlı anlaşılmalı. SEO uzmanlığı güvene bağlar.", anchor: "seo-danismanlar" },
    { Icon: MapPin, title: "Almanya'daki hizmet işletmeleri", body: "Sadece tavsiye ile değil, düzenli olarak Google üzerinden bulunmak isteyenler için.", anchor: "seo-hizmet" },
  ],
} satisfies Record<Language, ReadonlyArray<{ Icon: typeof Search; title: string; body: string; anchor?: string }>>;

const websiteAudiences = {
  de: [
    { Icon: Scale, title: "Webdesign für Kanzleien", body: "Mandanten suchen nach Rechtsgebiet, Stadt und Vertrauen. Wir bauen Kanzlei-Websites mit klaren Rechtsgebietsseiten, seriöser Sprache und sichtbaren Anfragewegen.", anchor: "webdesign-kanzleien" },
    { Icon: BriefcaseBusiness, title: "Webdesign für Berater", body: "Beratung ist erklärungsbedürftig. Ihre Website muss Positionierung, Expertise und Ergebnisversprechen schnell verständlich machen.", anchor: "webdesign-berater" },
    { Icon: Hammer, title: "Webdesign für Handwerker", body: "Handwerksbetriebe brauchen regionale Sichtbarkeit, mobile Kontaktwege, Referenzen und Seiten für Leistungen wie Sanitär, Elektro, Bau, Umzug oder Reinigung.", anchor: "webdesign-handwerker" },
    { Icon: MapPin, title: "Websites für Dienstleister", body: "Für lokale und regionale Service-Unternehmen, die nicht nur empfohlen werden wollen, sondern planbar über Google und ihre Website Anfragen gewinnen möchten.", anchor: "webdesign-dienstleister" },
  ],
  en: [
    { Icon: Scale, title: "Web design for law firms", body: "Clients search by legal field, city, and trust. We build law firm websites with clear practice-area pages, serious copy, and visible enquiry paths.", anchor: "webdesign-law-firms" },
    { Icon: BriefcaseBusiness, title: "Web design for consultants", body: "Consulting is complex. Your website must make positioning, expertise, and outcomes easy to understand quickly.", anchor: "webdesign-consultants" },
    { Icon: Hammer, title: "Web design for trades", body: "Trades need local visibility, mobile contact paths, references, and service pages for what people actually search.", anchor: "webdesign-trades" },
    { Icon: MapPin, title: "Websites for service businesses", body: "For local and regional service companies that want predictable enquiries from Google and their website, not only referrals.", anchor: "webdesign-service-businesses" },
  ],
  tr: [
    { Icon: Scale, title: "Kanzleiler için web tasarım", body: "Müvekkiller hukuk alanı, şehir ve güvene göre arar. Net hizmet sayfaları ve görünür iletişim yolları kurarız.", anchor: "webdesign-kanzleiler" },
    { Icon: BriefcaseBusiness, title: "Danışmanlar için web tasarım", body: "Danışmanlık hızlı anlaşılmalıdır. Web sitesi konumlandırma, uzmanlık ve sonucu net anlatmalıdır.", anchor: "webdesign-danismanlar" },
    { Icon: Hammer, title: "Zanaat işletmeleri için web tasarım", body: "Yerel görünürlük, mobil iletişim yolları, referanslar ve gerçek hizmet sayfaları gerekir.", anchor: "webdesign-zanaat" },
    { Icon: MapPin, title: "Hizmet işletmeleri için web siteleri", body: "Sadece tavsiye ile değil, Google ve web sitesi üzerinden düzenli talep almak isteyen yerel işletmeler için.", anchor: "webdesign-hizmet" },
  ],
} satisfies Record<Language, ReadonlyArray<{ Icon: typeof Search; title: string; body: string; anchor?: string }>>;

const websiteSystemSteps = {
  de: [
    { number: "01", title: "Positionierung", body: "Besucher verstehen sofort, für wen Sie arbeiten, welches Problem Sie lösen und warum Sie die richtige Wahl sind." },
    { number: "02", title: "SEO-Seitenstruktur", body: "Leistungsseiten, lokale Suchbegriffe, interne Links und klare Überschriften helfen Google, Ihr Angebot richtig einzuordnen." },
    { number: "03", title: "Vertrauen", body: "Referenzen, Bewertungen, echte Bilder, klare Sprache und saubere Gestaltung machen aus Besuchern ernsthafte Anfragen." },
    { number: "04", title: "Kontaktwege", body: "Telefon, Formular, WhatsApp, E-Mail oder Terminbuchung werden auf dem Handy schnell erreichbar und messbar gemacht." },
  ],
  en: [
    { number: "01", title: "Positioning", body: "Visitors immediately understand who you serve, what problem you solve, and why you are the right choice." },
    { number: "02", title: "SEO page structure", body: "Service pages, local search terms, internal links, and clear headings help Google understand your offer." },
    { number: "03", title: "Trust", body: "References, reviews, real images, clear copy, and clean design turn visitors into serious enquiries." },
    { number: "04", title: "Contact paths", body: "Phone, forms, WhatsApp, email, or booking links become easy to reach on mobile and measurable." },
  ],
  tr: [
    { number: "01", title: "Konumlandırma", body: "Ziyaretçiler kime hizmet verdiğinizi, hangi problemi çözdüğünüzü ve neden doğru seçim olduğunuzu hemen anlar." },
    { number: "02", title: "SEO sayfa yapısı", body: "Hizmet sayfaları, yerel arama terimleri, iç bağlantılar ve net başlıklar Google'ın teklifinizi anlamasını sağlar." },
    { number: "03", title: "Güven", body: "Referanslar, yorumlar, gerçek görseller, net metin ve temiz tasarım ziyaretçiyi talebe dönüştürür." },
    { number: "04", title: "İletişim yolları", body: "Telefon, form, WhatsApp, e-posta veya randevu linkleri mobilde hızlı ve ölçülebilir hale gelir." },
  ],
} satisfies Record<Language, ReadonlyArray<{ number: string; title: string; body: string }>>;

const googleAdsAudiences = {
  de: [
    { Icon: Scale, title: "Kanzleien & Anwälte", body: "Menschen suchen akut nach rechtlicher Hilfe. Wir machen Sie bei den richtigen Suchanfragen sichtbar.", anchor: "google-ads-kanzleien" },
    { Icon: Hammer, title: "Handwerk & lokale Betriebe", body: "Notfälle, Termine und regionale Nachfrage brauchen Kampagnen, die sofort Anfragen auslösen.", anchor: "google-ads-handwerker" },
    { Icon: Target, title: "Berater & Steuerberater", body: "Komplexe Leistungen brauchen klare Anzeigen, klare Seiten und saubere Lead-Qualifizierung.", anchor: "google-ads-berater" },
    { Icon: MousePointerClick, title: "Dienstleister in Deutschland", body: "Für Unternehmen, die Nachfrage nicht nur organisch aufbauen, sondern gezielt aktivieren möchten.", anchor: "google-ads-dienstleister" },
  ],
  en: [
    { Icon: Scale, title: "Law firms", body: "People search with urgent legal needs. We make you visible for the searches that matter.", anchor: "google-ads-law-firms" },
    { Icon: Hammer, title: "Trades & local businesses", body: "Emergencies, bookings, and local demand need campaigns that create enquiries fast.", anchor: "google-ads-trades" },
    { Icon: Target, title: "Consultants & tax advisors", body: "Complex services need clear ads, clear landing pages, and clean lead qualification.", anchor: "google-ads-consultants" },
    { Icon: MousePointerClick, title: "German service businesses", body: "For businesses that want to activate demand directly, not only wait for organic growth.", anchor: "google-ads-service-businesses" },
  ],
  tr: [
    { Icon: Scale, title: "Kanzleiler & avukatlar", body: "İnsanlar acil hukuki destek arar. Sizi doğru aramalarda görünür yaparız.", anchor: "google-ads-kanzleiler" },
    { Icon: Hammer, title: "Zanaat ve yerel işletmeler", body: "Acil işler, randevular ve yerel talep hızlı talep üreten kampanyalar ister.", anchor: "google-ads-zanaat" },
    { Icon: Target, title: "Danışmanlar & mali müşavirler", body: "Karmaşık hizmetler net reklam, net landing page ve temiz lead ölçümü ister.", anchor: "google-ads-danismanlar" },
    { Icon: MousePointerClick, title: "Almanya'daki hizmet işletmeleri", body: "Talebi sadece organik olarak beklemek değil, doğrudan aktive etmek isteyen işletmeler için.", anchor: "google-ads-hizmet" },
  ],
} satisfies Record<Language, ReadonlyArray<{ Icon: typeof Search; title: string; body: string; anchor?: string }>>;

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

const faqs = {
  de: [
    {
      q: "Was kostet eine professionelle Website für Dienstleister?",
      a: "Das hängt von Umfang, Seitenstruktur, Texten, Bildern und laufender Betreuung ab. Wichtig ist: Sie bezahlen nicht nur Design, sondern ein System aus Positionierung, technischer Umsetzung, SEO-Grundlage und klaren Anfragewegen.",
    },
    {
      q: "Wie lange dauert es, bis die Website Anfragen bringt?",
      a: "Die Website wirkt sofort durch einen besseren ersten Eindruck, klare Kommunikation und sichtbare Kontaktwege. Organische SEO-Ergebnisse brauchen meist 3 bis 6 Monate. Mit Google Ads können erste Anfragen deutlich schneller getestet werden.",
    },
    {
      q: "Ist SEO bei der Website-Erstellung enthalten?",
      a: "Ja. Jede Website bekommt eine technische SEO-Basis: saubere Struktur, schnelle Ladezeiten, mobile Optimierung, klare Überschriften, interne Verlinkung und suchfreundliche Inhalte. Laufende SEO-Betreuung kann danach ergänzt werden.",
    },
    {
      q: "Brauche ich für jede Leistung eine eigene Seite?",
      a: "Oft ja. Kanzleien, Berater, Handwerker und Dienstleister werden besser gefunden, wenn wichtige Leistungen eigene Seiten bekommen. So versteht Google genauer, wofür Sie relevant sind, und Besucher finden schneller die passende Lösung.",
    },
    {
      q: "Für welche Branchen erstellt nüll. Websites?",
      a: "Wir bauen Websites für Kanzleien, Anwälte, Berater, Steuerberater, Handwerker und lokale Dienstleister in Deutschland. Entscheidend ist, dass Ihr Geschäft über Vertrauen, Sichtbarkeit und qualifizierte Anfragen wächst.",
    },
  ],
  en: [
    {
      q: "What does a professional website for a service business cost?",
      a: "Every service business has different needs, so the price depends on the scope, page structure, content, images, and support required. You are not only paying for design, but for positioning, technical implementation, an SEO foundation, and clear enquiry paths.",
    },
    {
      q: "How long does it take for the website to bring enquiries?",
      a: "Your website will be designed, officially live, and active within 1 week. From there, we can start SEO if you choose that service. SEO usually takes 1 to 2 months before organic results become visible. If you decide to work with the nüll. team on Google Ads, we can start bringing in new customer enquiries within 2 weeks of the contract beginning.",
    },
    {
      q: "Is SEO included in the website build?",
      a: "Yes. Every website gets a technical SEO foundation: clean structure, fast loading, mobile optimisation, clear headings, internal links, and search-friendly content. Ongoing SEO can be added after launch.",
    },
    {
      q: "Do I need a separate page for every service?",
      a: "Often, yes. Law firms, consultants, trades, and service businesses are easier to find when important services have their own pages. Google understands your relevance better, and visitors find the right solution faster.",
    },
    {
      q: "Which industries does nüll. build websites for?",
      a: "We build websites for law firms, lawyers, consultants, tax advisors, trades, and local service businesses in Germany. The common factor is that growth depends on trust, visibility, and qualified enquiries.",
    },
  ],
  tr: [
    {
      q: "Sonuçları görmek ne kadar sürer?",
      a: "SEO zaman alır; ilk ölçülebilir sonuçlar genelde 3 ila 6 ay içinde görünür. Web sitesinin etkisi ise hemen başlar: daha güçlü ilk izlenim, daha net iletişim ve daha fazla güven.",
    },
    {
      q: "İçerik veya metinleri ben mi hazırlamalıyım?",
      a: "Hayır. Metinleri, yapıyı ve içerikleri biz hazırlarız. Sadece ne yaptığınızı ve kime hizmet verdiğinizi anlatmanız yeterli.",
    },
    {
      q: "Zaten bir web sitem varsa?",
      a: "Sorun değil. Önce mevcut durumu analiz ederiz. Bazen yeniden kurmak mantıklıdır, bazen hedefli iyileştirmeler yeterlidir. Sadece gerçekten gerekli olanı öneririz.",
    },
    {
      q: "nüll. hangi sektörlerle çalışıyor?",
      a: "Yerel veya bölgesel müşteri kazanmak isteyen hizmet işletmeleri, danışmanlar, ajanslar ve şirketlerle çalışıyoruz. Hizmet satıyor ve online bulunmak istiyorsanız doğru yerdesiniz.",
    },
    {
      q: "Fiyat nedir?",
      a: "Paketlerimiz sabit bir aylık ücretle başlar; gizli saatlik ücretler ve sürprizler yoktur. Tüm detayları fiyat sayfasında bulabilirsiniz.",
    },
  ],
} satisfies Record<Language, ReadonlyArray<{ q: string; a: string }>>;

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

const seoTargetLinks = {
  de: [
    { href: "#seo-kanzleien", label: "SEO für Kanzleien" },
    { href: "#seo-handwerker", label: "SEO für Handwerker" },
    { href: "#seo-berater", label: "SEO für Berater" },
    { href: "#seo-dienstleister", label: "SEO für Dienstleister" },
    { href: "#was-wir-bauen", label: "Lokale SEO Struktur" },
  ],
  en: [
    { href: "#seo-law-firms", label: "SEO for law firms" },
    { href: "#seo-trades", label: "SEO for trades" },
    { href: "#seo-consultants", label: "SEO for consultants" },
    { href: "#seo-service-businesses", label: "SEO for service businesses" },
    { href: "#was-wir-bauen", label: "Local SEO structure" },
  ],
  tr: [
    { href: "#seo-kanzleiler", label: "Kanzleiler için SEO" },
    { href: "#seo-zanaat", label: "Zanaat işletmeleri için SEO" },
    { href: "#seo-danismanlar", label: "Danışmanlar için SEO" },
    { href: "#seo-hizmet", label: "Hizmet işletmeleri için SEO" },
    { href: "#was-wir-bauen", label: "Yerel SEO yapısı" },
  ],
} satisfies Record<Language, ReadonlyArray<{ href: string; label: string }>>;

const websiteTargetLinks = {
  de: [
    { href: "#webdesign-kanzleien", label: "Webdesign für Kanzleien" },
    { href: "#webdesign-berater", label: "Webdesign für Berater" },
    { href: "#webdesign-handwerker", label: "Webdesign für Handwerker" },
    { href: "#webdesign-dienstleister", label: "Websites für Dienstleister" },
    { href: "#was-wir-bauen", label: "SEO-saubere Website-Struktur" },
  ],
  en: [
    { href: "#webdesign-law-firms", label: "Web design for law firms" },
    { href: "#webdesign-consultants", label: "Web design for consultants" },
    { href: "#webdesign-trades", label: "Web design for trades" },
    { href: "#webdesign-service-businesses", label: "Websites for service businesses" },
    { href: "#was-wir-bauen", label: "SEO-clean website structure" },
  ],
  tr: [
    { href: "#webdesign-kanzleiler", label: "Kanzleiler için web tasarım" },
    { href: "#webdesign-danismanlar", label: "Danışmanlar için web tasarım" },
    { href: "#webdesign-zanaat", label: "Zanaat için web tasarım" },
    { href: "#webdesign-hizmet", label: "Hizmet işletmeleri için web sitesi" },
    { href: "#was-wir-bauen", label: "SEO temelli web sitesi yapısı" },
  ],
} satisfies Record<Language, ReadonlyArray<{ href: string; label: string }>>;

const googleAdsTargetLinks = {
  de: [
    { href: "#google-ads-kanzleien", label: "Google Ads für Kanzleien" },
    { href: "#google-ads-handwerker", label: "Google Ads für Handwerker" },
    { href: "#google-ads-berater", label: "Google Ads für Berater" },
    { href: "#google-ads-dienstleister", label: "Google Ads für Dienstleister" },
    { href: "#was-wir-bauen", label: "Tracking & Landingpages" },
  ],
  en: [
    { href: "#google-ads-law-firms", label: "Google Ads for law firms" },
    { href: "#google-ads-trades", label: "Google Ads for trades" },
    { href: "#google-ads-consultants", label: "Google Ads for consultants" },
    { href: "#google-ads-service-businesses", label: "Google Ads for service businesses" },
    { href: "#was-wir-bauen", label: "Tracking & landing pages" },
  ],
  tr: [
    { href: "#google-ads-kanzleiler", label: "Kanzleiler için Google Ads" },
    { href: "#google-ads-zanaat", label: "Zanaat için Google Ads" },
    { href: "#google-ads-danismanlar", label: "Danışmanlar için Google Ads" },
    { href: "#google-ads-hizmet", label: "Hizmet işletmeleri için Google Ads" },
    { href: "#was-wir-bauen", label: "Tracking & landing page" },
  ],
} satisfies Record<Language, ReadonlyArray<{ href: string; label: string }>>;

const websiteSchemaCopy = {
  de: {
    name: "Webdesign für Dienstleister, Kanzleien und Handwerker",
    description:
      "Webdesign für Kanzleien, Berater, Handwerker und lokale Dienstleister. Schnelle, SEO-saubere Websites, die Vertrauen aufbauen und aus Besuchern echte Anfragen machen.",
    audience: ["Kanzleien", "Berater", "Handwerksbetriebe", "lokale Dienstleister"],
    breadcrumb: "Webdesign",
  },
  en: {
    name: "Web design for law firms, consultants, trades and service businesses",
    description:
      "Web design for law firms, consultants, trades and local service businesses. Fast, SEO-clean websites that build trust and turn visitors into enquiries.",
    audience: ["Law firms", "Consultants", "Trades", "local service businesses"],
    breadcrumb: "Web design",
  },
  tr: {
    name: "Kanzleiler, danışmanlar, zanaat ve hizmet işletmeleri için web tasarım",
    description:
      "Kanzleiler, danışmanlar, zanaat işletmeleri ve yerel hizmet şirketleri için güven oluşturan ve ziyaretçileri talebe çeviren SEO temelli web siteleri.",
    audience: ["Kanzleiler", "Danışmanlar", "Zanaat işletmeleri", "yerel hizmet işletmeleri"],
    breadcrumb: "Web tasarım",
  },
} satisfies Record<Language, { name: string; description: string; audience: string[]; breadcrumb: string }>;

const googleAdsSchemaCopy = {
  de: {
    name: "Google Ads Agentur für Dienstleister, Kanzleien und Handwerker",
    description:
      "Google Ads Agentur für Kanzleien, Handwerk, Berater und Dienstleister. Kampagnen, Landingpages und Tracking für messbare Anfragen statt nur Klicks.",
    audience: ["Kanzleien", "Handwerksbetriebe", "Berater", "Steuerberater", "lokale Dienstleister"],
    breadcrumb: "Google Ads",
  },
  en: {
    name: "Google Ads agency for law firms, trades and service businesses",
    description:
      "Google Ads management for law firms, trades, consultants and service businesses in Germany with campaigns, landing pages and conversion tracking for measurable enquiries.",
    audience: ["Law firms", "Trades", "Consultants", "Tax advisors", "local service businesses"],
    breadcrumb: "Google Ads",
  },
  tr: {
    name: "Kanzleiler, zanaat işletmeleri ve hizmet şirketleri için Google Ads ajansı",
    description:
      "Almanya'daki hukuk büroları, zanaat işletmeleri, danışmanlar ve hizmet işletmeleri için kampanya, landing page ve dönüşüm ölçümünü bağlayan Google Ads yönetimi.",
    audience: ["Kanzleiler", "Zanaat işletmeleri", "Danışmanlar", "Mali müşavirler", "yerel hizmet işletmeleri"],
    breadcrumb: "Google Ads",
  },
} satisfies Record<Language, { name: string; description: string; audience: string[]; breadcrumb: string }>;

const seoSchemaCopy = {
  de: {
    name: "SEO für Kanzleien, Handwerker und Dienstleister",
    description:
      "SEO für Kanzleien, Handwerker, Berater und Dienstleister in Deutschland mit lokaler Sichtbarkeit, klarer Seitenstruktur und messbaren Anfragen über Google.",
    audience: ["Kanzleien", "Handwerksbetriebe", "Berater", "Steuerberater", "lokale Dienstleister"],
    breadcrumb: "SEO",
  },
  en: {
    name: "SEO for law firms, trades and service businesses",
    description:
      "SEO for law firms, trades, consultants and service businesses in Germany with local visibility, clear page structure and measurable enquiries from Google.",
    audience: ["Law firms", "Trades", "Consultants", "Tax advisors", "local service businesses"],
    breadcrumb: "SEO",
  },
  tr: {
    name: "Kanzleiler, zanaat işletmeleri ve hizmet şirketleri için SEO",
    description:
      "Almanya'daki hukuk büroları, zanaat işletmeleri, danışmanlar ve hizmet işletmeleri için yerel görünürlük, net sayfa yapısı ve ölçülebilir talepler sağlayan SEO.",
    audience: ["Kanzleiler", "Zanaat işletmeleri", "Danışmanlar", "Mali müşavirler", "yerel hizmet işletmeleri"],
    breadcrumb: "SEO",
  },
} satisfies Record<Language, { name: string; description: string; audience: string[]; breadcrumb: string }>;

function buildWebsiteStructuredData(lang: Language) {
  const pageUrl = "https://xn--nll-hoa.com/leistungen/webdesign";
  const schema = websiteSchemaCopy[lang] ?? websiteSchemaCopy.de;
  const questions = faqs[lang] ?? faqs.de;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://xn--nll-hoa.com/#organization",
        name: "nüll.",
        url: "https://xn--nll-hoa.com",
        image: "https://xn--nll-hoa.com/og-image.png",
        email: "info@nüll.com",
        areaServed: "DE",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mannheim",
          addressRegion: "Baden-Württemberg",
          addressCountry: "DE",
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: schema.name,
        description: schema.description,
        serviceType: "Web Design",
        provider: { "@id": "https://xn--nll-hoa.com/#organization" },
        areaServed: { "@type": "Country", name: "Germany" },
        audience: schema.audience.map((name) => ({ "@type": "BusinessAudience", name })),
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "nüll.",
            item: "https://xn--nll-hoa.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: schema.breadcrumb,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: questions.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };
}

function buildGoogleAdsStructuredData(lang: Language) {
  const pageUrl = "https://xn--nll-hoa.com/leistungen/google-ads";
  const schema = googleAdsSchemaCopy[lang] ?? googleAdsSchemaCopy.de;
  const questions = googleAdsFaqs[lang] ?? googleAdsFaqs.de;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://xn--nll-hoa.com/#organization",
        name: "nüll.",
        url: "https://xn--nll-hoa.com",
        image: "https://xn--nll-hoa.com/og-image.png",
        email: "info@nüll.com",
        areaServed: "DE",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mannheim",
          addressRegion: "Baden-Württemberg",
          addressCountry: "DE",
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: schema.name,
        description: schema.description,
        serviceType: "Google Ads Management",
        provider: { "@id": "https://xn--nll-hoa.com/#organization" },
        areaServed: { "@type": "Country", name: "Germany" },
        audience: schema.audience.map((name) => ({ "@type": "BusinessAudience", name })),
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "nüll.",
            item: "https://xn--nll-hoa.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: schema.breadcrumb,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: questions.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };
}

function buildSeoStructuredData(lang: Language) {
  const pageUrl = "https://xn--nll-hoa.com/leistungen/seo";
  const schema = seoSchemaCopy[lang] ?? seoSchemaCopy.de;
  const questions = seoFaqs[lang] ?? seoFaqs.de;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://xn--nll-hoa.com/#organization",
        name: "nüll.",
        url: "https://xn--nll-hoa.com",
        image: "https://xn--nll-hoa.com/og-image.png",
        email: "info@nüll.com",
        areaServed: "DE",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mannheim",
          addressRegion: "Baden-Württemberg",
          addressCountry: "DE",
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: schema.name,
        description: schema.description,
        serviceType: "Search Engine Optimization",
        provider: { "@id": "https://xn--nll-hoa.com/#organization" },
        areaServed: { "@type": "Country", name: "Germany" },
        audience: schema.audience.map((name) => ({ "@type": "BusinessAudience", name })),
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "nüll.",
            item: "https://xn--nll-hoa.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: schema.breadcrumb,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: questions.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#007aff]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
      {children}
    </p>
  );
}

function CaseStudySection({ c, lang, variant }: { c: Record<string, string>; lang: Language; variant: ServiceVariant }) {
  const resultsImage = lang === "de" ? resultsDe : resultsEn;
  const isSeoCaseStudy = variant === "seo";
  const caseStudyName = isSeoCaseStudy ? "Herkules Umzüge" : "Besir Yaman";
  const caseStudyImage = isSeoCaseStudy ? herkulesCaseStudy : besirNew;
  const caseStudyAlt = isSeoCaseStudy ? "Herkules Umzüge Mannheim website" : "Besir Yaman website";
  const mobileProofTitle =
    lang === "de"
      ? "Täglich Anfragen."
      : lang === "tr"
        ? "Günlük talepler."
        : "Daily enquiries.";

  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-14">
          <p className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.22em] text-[#007aff]">
            {c.proofLabel} — {caseStudyName}
          </p>
          <h2 className="max-w-[72rem] text-[clamp(2rem,4.2vw,4rem)] font-bold leading-[1.06] tracking-[-0.04em] text-[#0e0e10]">
            {variant === "seo" || variant === "website" || variant === "googleAds" ? (
              c.proofTitle
            ) : (
              <>
                <span className="block whitespace-nowrap md:hidden">{mobileProofTitle}</span>
                <span className="hidden md:block">{c.proofTitle}</span>
              </>
            )}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] font-medium leading-relaxed text-[#86868b]">
            {c.proofP2}
          </p>
        </div>

        <img
          src={caseStudyImage}
          alt={caseStudyAlt}
          className="w-full rounded-[1.25rem] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.08)] md:rounded-[2rem]"
        />

        <img
          src={resultsImage}
          alt=""
          aria-hidden="true"
          className="mt-14 w-full object-contain"
        />

      </div>
    </section>
  );
}

type ServiceVariant = "website" | "seo" | "googleAds";

export function ServicesPage({ variant = "website" }: { variant?: ServiceVariant }) {
  const { lang } = useLanguage();
  const pageCopy = variant === "seo" ? seoCopy : variant === "googleAds" ? googleAdsCopy : copy;
  const c = pageCopy[lang] ?? pageCopy.de;
  const mobileFlowScrollerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [activeMobileFlowSlide, setActiveMobileFlowSlide] = useState(0);
  const conversionVisual = lang === "de" ? conversionVisualDe : conversionVisualEn;
  const mobileFlowSlides =
    lang === "de"
      ? [scrollableCredentialOneDe, scrollableCredentialTwoDe, scrollableCredentialThreeDe]
      : [scrollableCredentialOneEn, scrollableCredentialTwoEn, scrollableCredentialThreeEn];
  const heroBackground = variant === "googleAds" ? googleAdsHeroBackground : variant === "seo" ? seoHeroBackground : websiteHeroBackground;
  const activeFaqs = variant === "seo" ? seoFaqs[lang] : variant === "googleAds" ? googleAdsFaqs[lang] : faqs[lang];
  const activeGrowthAudiences =
    variant === "googleAds" ? googleAdsAudiences[lang] : variant === "seo" ? seoAudiences[lang] : websiteAudiences[lang];
  const activeGrowthSteps =
    variant === "googleAds" ? googleAdsSystemSteps[lang] : variant === "seo" ? seoSystemSteps[lang] : websiteSystemSteps[lang];
  const activeSeoTargetLinks = seoTargetLinks[lang] ?? seoTargetLinks.de;
  const activeWebsiteTargetLinks = websiteTargetLinks[lang] ?? websiteTargetLinks.de;
  const activeGoogleAdsTargetLinks = googleAdsTargetLinks[lang] ?? googleAdsTargetLinks.de;
  const showGrowthSection = variant === "website" || variant === "seo" || variant === "googleAds";
  const isWebsitePage = variant === "website";
  const isSeoPage = variant === "seo";
  const isGoogleAdsPage = variant === "googleAds";
  const activeTargetLinks = isSeoPage ? activeSeoTargetLinks : isWebsitePage ? activeWebsiteTargetLinks : isGoogleAdsPage ? activeGoogleAdsTargetLinks : [];
  const structuredData = isSeoPage ? buildSeoStructuredData(lang) : isWebsitePage ? buildWebsiteStructuredData(lang) : isGoogleAdsPage ? buildGoogleAdsStructuredData(lang) : null;
  const mobileProblemText =
    lang === "de"
      ? "Nicht wegen Ihres Angebots. Sondern weil Ihre Website nicht gefunden wird, nicht überzeugt und keinen klaren nächsten Schritt zeigt"
      : lang === "tr"
        ? "Sorun teklifiniz değil. Web siteniz bulunmuyor, güven vermiyor ve net bir sonraki adım göstermiyor"
        : "Not because your offer is weak. Because the website is not found, does not build trust, and gives no clear next step";
  const mobileProblemTitle1 =
    lang === "de"
      ? "Viele haben eine Website"
      : lang === "tr"
        ? "Çoğunun web sitesi var"
        : "Most have a website";
  const mobileProblemTitle2 =
    lang === "de"
      ? "Kaum eine bringt Anfragen"
      : lang === "tr"
        ? "Ama çok azı talep getiriyor"
        : "But few get enquiries";
  const mobileClosingTitle =
    lang === "de"
      ? "Website starten, Anfragen gewinnen"
      : lang === "tr"
        ? "Web siteniz talep getirsin"
        : "Launch your website, win enquiries";
  const mobileClosingText =
    lang === "de"
      ? "Kostenlose Erstberatung. Klarer nächster Schritt. Kein Risiko"
      : lang === "tr"
        ? "Ücretsiz ilk görüşme. Net sonraki adım. Risk yok"
        : "Free first call. Clear next step. No risk";
  const mobileClosingTrust =
    lang === "de"
      ? ["Kostenlos", "15 Minuten", "Unverbindlich"]
      : lang === "tr"
        ? ["Ücretsiz", "15 dakika", "Bağlayıcı değil"]
        : ["Free", "15 minutes", "No obligation"];

  const renderHeroTitle = () => {
    if (isWebsitePage) {
      if (lang === "de") {
        return (
          <>
            <span className="block whitespace-nowrap md:whitespace-nowrap">Webdesign, das </span>
            <span className="block whitespace-nowrap text-[#86868b] md:whitespace-nowrap"><span className="text-[#007aff]">Anfragen</span> bringt.</span>
          </>
        );
      }

      if (lang === "en") {
        return (
          <>
            <span className="block whitespace-nowrap md:whitespace-nowrap">Websites that </span>
            <span className="block whitespace-nowrap text-[#86868b] md:whitespace-nowrap"><span className="text-[#007aff]">bring</span> enquiries.</span>
          </>
        );
      }

      return (
        <>
          <span className="block whitespace-nowrap md:whitespace-nowrap">Web siteniz </span>
          <span className="block whitespace-nowrap text-[#86868b] md:whitespace-nowrap"><span className="text-[#007aff]">müşteri</span> getirmeli.</span>
        </>
      );
    }

    if (variant === "seo" && lang === "de") {
      return (
        <>
          <span className="block"><span className="text-[#007aff]">SEO</span> für Kanzleien</span>
          <span className="block">Handwerk & Berater</span>
          <span className="block">in Deutschland.</span>
        </>
      );
    }

    if (variant === "seo" && lang === "en") {
      return (
        <>
          <span className="block"><span className="text-[#007aff]">SEO</span> for law firms</span>
          <span className="block">trades & consultants</span>
          <span className="block">in Germany.</span>
        </>
      );
    }

    if (variant === "seo" && lang === "tr") {
      return (
        <>
          <span className="block">Kanzleiler ve</span>
          <span className="block">danışmanlar için</span>
          <span className="block text-[#007aff]">SEO.</span>
        </>
      );
    }

    if (variant === "googleAds") {
      if (lang === "de") {
        return (
          <>
            <span className="block md:whitespace-nowrap">Google Ads Agentur </span>
            <span className="block md:whitespace-nowrap"><span className="text-[#007aff]">für Dienstleister.</span></span>
          </>
        );
      }

      if (lang === "en") {
        return (
          <>
            <span className="block md:whitespace-nowrap">Google Ads agency </span>
            <span className="block md:whitespace-nowrap"><span className="text-[#007aff]">for service businesses.</span></span>
          </>
        );
      }

      return (
        <>
          <span className="block md:whitespace-nowrap">Hizmet işletmeleri için </span>
          <span className="block text-[#007aff] md:whitespace-nowrap">Google Ads ajansı.</span>
        </>
      );
    }

    return (
      <>
        <span className="block md:whitespace-nowrap">{c.heroTitle1}</span>
        {lang === "en" ? (
          <span className="block md:whitespace-nowrap">{c.heroTitle2b} <span className="text-[#007aff]">{c.heroTitle2a}</span></span>
        ) : (
          <span className="block md:whitespace-nowrap"><span className="text-[#007aff]">{c.heroTitle2a}</span> {c.heroTitle2b}</span>
        )}
      </>
    );
  };
  const renderHeroText = () => {
    if (isWebsitePage) {
      const mobileLines =
        lang === "de"
          ? ["Für Kanzleien, Berater und Handwerk", "eine schnelle, SEO-saubere Website", "die Besucher in Anfragen verwandelt"]
          : lang === "tr"
            ? ["Hukuk, danışmanlık ve hizmetler için", "hızlı, SEO temelli bir web sitesi", "ziyaretçileri taleplere dönüştürür"]
            : ["For law firms, consultants and trades", "a fast, SEO-clean website", "built to turn visitors into enquiries"];

      return (
        <>
          <span className="md:hidden">
            {mobileLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </span>
          <span className="hidden md:inline">{c.heroText}</span>
        </>
      );
    }

    if (variant === "seo" && lang === "de") {
      return (
        <>
          <span className="md:hidden">SEO für Dienstleister in Deutschland. Lokal sichtbar, technisch sauber und auf mehr Anfragen ausgelegt.</span>
          <span className="hidden md:inline">{c.heroText}</span>
        </>
      );
    }

    if (variant === "seo" && lang === "en") {
      return (
        <>
          <span className="md:hidden">SEO for service businesses in Germany. Local visibility, clean structure, measurable enquiries.</span>
          <span className="hidden md:inline">{c.heroText}</span>
        </>
      );
    }

    if (variant === "googleAds") {
      if (lang === "de") {
        return (
          <>
            <span className="md:hidden">Google Ads für Dienstleister in Deutschland. Sauber gemessen, auf echte Anfragen optimiert.</span>
            <span className="hidden md:inline">{c.heroText}</span>
          </>
        );
      }

      if (lang === "en") {
        return (
          <>
            <span className="md:hidden">Google Ads for service businesses in Germany. Clean tracking, real enquiries, controlled spend.</span>
            <span className="hidden md:inline">{c.heroText}</span>
          </>
        );
      }

      return (
        <>
          <span className="md:hidden">Almanya'daki hizmet işletmeleri için Google Ads. Temiz ölçüm, gerçek talepler, kontrollü bütçe.</span>
          <span className="hidden md:inline">{c.heroText}</span>
        </>
      );
    }

    return c.heroText;
  };
  const heroTitleClass = `w-full min-w-0 font-bold leading-[0.92] tracking-[-0.055em] text-[#0e0e10] md:max-w-3xl md:text-[clamp(3rem,5vw,3.85rem)] md:leading-[0.98] md:tracking-[-0.055em] ${
    variant === "googleAds" && lang === "en"
      ? "mx-auto max-w-[calc(100vw-2rem)] text-[clamp(2.42rem,10.2vw,2.95rem)] md:mx-0 md:max-w-3xl"
      : variant === "googleAds" && lang === "de"
      ? "mx-auto max-w-[calc(100vw-2rem)] text-[clamp(2.52rem,10.6vw,3.08rem)] md:mx-0 md:max-w-3xl"
      : variant === "seo" && lang === "en"
      ? "mx-auto max-w-[25rem] text-[clamp(2.42rem,9.75vw,2.92rem)] leading-[0.94] md:mx-0 md:max-w-3xl md:text-[clamp(3rem,5vw,3.85rem)] md:leading-[0.98]"
      : variant === "seo" && lang === "de"
      ? "mx-auto max-w-[25rem] text-[clamp(2.42rem,9.75vw,2.92rem)] leading-[0.94] md:mx-0 md:max-w-3xl md:text-[clamp(3rem,5vw,3.85rem)] md:leading-[0.98]"
      : variant === "seo"
      ? "mx-auto max-w-[25rem] text-[clamp(2.34rem,9.45vw,2.82rem)] leading-[0.94] md:mx-0 md:max-w-3xl md:text-[clamp(3rem,5vw,3.85rem)] md:leading-[0.98]"
      : isWebsitePage && lang === "en"
      ? "max-w-[25rem] text-[clamp(2.42rem,9.45vw,2.86rem)]"
      : "max-w-[24rem] text-[clamp(2.72rem,11.3vw,3.35rem)]"
  }`;

  useEffect(() => {
    const openQuote = () => setIsQuoteOpen(true);
    window.addEventListener("open-quote-preview", openQuote);
    return () => window.removeEventListener("open-quote-preview", openQuote);
  }, []);

  const handleMobileFlowScroll = (event: UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    const slides = Array.from(scroller.children) as HTMLElement[];

    const closestSlide = slides.reduce(
      (closest, slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - viewportCenter);

        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );

    if (closestSlide.index !== activeMobileFlowSlide) {
      setActiveMobileFlowSlide(closestSlide.index);
    }
  };

  const scrollToMobileFlowSlide = (index: number) => {
    const scroller = mobileFlowScrollerRef.current;
    const slide = scroller?.children[index] as HTMLElement | undefined;

    slide?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveMobileFlowSlide(index);
  };

  useEffect(() => {
    const updateStickyCta = () => {
      setShowStickyCta(window.scrollY > window.innerHeight * 0.72);
    };

    updateStickyCta();
    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("resize", updateStickyCta);
    return () => {
      window.removeEventListener("scroll", updateStickyCta);
      window.removeEventListener("resize", updateStickyCta);
    };
  }, []);

  return (
    <main className="bg-white">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <section className="relative min-h-[100svh] overflow-hidden bg-white px-4 pb-16 pt-[calc(7rem+env(safe-area-inset-top))] md:min-h-screen md:px-6 md:pb-28 md:pt-36">
        <img
          src={heroBackground}
          alt=""
          aria-hidden="true"
          className={
            isWebsitePage
              ? "absolute bottom-0 right-[-28vw] h-auto w-[178vw] max-w-none object-contain md:inset-0 md:h-full md:w-full md:object-cover md:object-center"
              : isSeoPage
                ? "absolute bottom-[-10svh] right-[-14vw] h-auto w-[188vw] max-w-none object-contain [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_100%)] md:inset-0 md:h-full md:w-full md:object-cover md:object-center md:[mask-image:none]"
              : isGoogleAdsPage
                ? "absolute bottom-[-10svh] right-[-2vw] h-auto w-[202vw] max-w-none object-contain [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_100%)] md:inset-0 md:h-full md:w-full md:object-cover md:object-center md:[mask-image:none]"
              : "absolute inset-0 h-full w-full object-cover object-center"
          }
        />
        {!isWebsitePage && !isSeoPage && !isGoogleAdsPage && (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.98)_28%,rgba(255,255,255,0.7)_54%,rgba(255,255,255,0.08)_100%)] md:hidden" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0.98)_38%,rgba(255,255,255,0.56)_63%,rgba(255,255,255,0)_100%)] md:hidden" />
          </>
        )}
        <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent md:h-20 ${isWebsitePage || isSeoPage || isGoogleAdsPage ? "hidden md:block" : ""}`} />
        <div className="relative mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-[92rem] items-center justify-center md:min-h-[calc(100vh-16rem)] md:justify-start">
          <div className={`-mt-24 flex w-full max-w-full flex-col items-center text-center md:mt-0 md:block md:max-w-[690px] md:text-left ${isGoogleAdsPage ? "max-md:-mt-40" : ""} ${isSeoPage ? "max-md:-mt-36" : ""}`}>
            <div className="hidden md:block">
              <Label>{c.heroLabel}</Label>
            </div>
            <h1 className={heroTitleClass}>
              {renderHeroTitle()}
            </h1>
            <p className="mt-6 w-full max-w-[23.5rem] min-w-0 text-balance text-[0.9375rem] font-medium leading-relaxed text-[#86868b] md:mt-8 md:max-w-2xl md:text-[1.35rem]">
              {renderHeroText()}
            </p>
            <div className={`mt-10 flex w-full max-w-[22rem] flex-col items-center gap-3 sm:max-w-none sm:flex-row md:mt-10 md:items-center md:gap-4 ${isSeoPage ? "max-md:gap-1" : ""}`}>
              <button type="button" onClick={() => setIsQuoteOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0e0e10] px-7 py-4 text-[0.95rem] font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#1c1c1e] sm:w-auto">
                {c.start} <ArrowRight size={18} />
              </button>
              <a href="/#work" className={`items-center justify-center gap-1 px-2 py-3 text-[1rem] font-bold text-[#0e0e10] transition hover:text-[#007aff] ${isSeoPage ? "hidden md:inline-flex" : "inline-flex"}`}>
                {c.viewProjects} <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-[1320px] text-center">
          <h2 className="mx-auto w-[calc(100vw-2rem)] max-w-[26rem] text-center text-[clamp(1.82rem,7.35vw,2.08rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#0e0e10] md:max-w-[980px] md:text-[clamp(2rem,3.4vw,3rem)] md:leading-[1.08] md:tracking-[-0.04em]">
            {isSeoPage || isGoogleAdsPage ? (
              <>
                <span className="block">{c.problem1} </span>
                <span className="mx-auto mt-3 block max-w-[22rem] text-[0.82em] font-semibold leading-[1.05] tracking-[-0.045em] text-[#86868b] md:max-w-[920px] md:leading-[1.12] md:tracking-[-0.035em]">
                  {c.problem2}
                </span>
              </>
            ) : isWebsitePage ? (
              <>
                <span className="block">{c.problem1} </span>
                <span className="mx-auto mt-3 block max-w-[22rem] text-[0.82em] font-semibold leading-[1.05] tracking-[-0.045em] text-[#86868b] md:max-w-[920px] md:leading-[1.12] md:tracking-[-0.035em]">
                  {c.problem2}
                </span>
              </>
            ) : (
              <>
                <span className="block whitespace-nowrap md:hidden">{mobileProblemTitle1}</span>
                <span className="hidden md:block">{c.problem1}</span>
                <span className="mx-auto mt-3 block max-w-[22rem] whitespace-nowrap text-[0.82em] font-semibold leading-[1.05] tracking-[-0.045em] text-[#86868b] md:max-w-[920px] md:whitespace-normal md:leading-[1.12] md:tracking-[-0.035em]">
                  <span className="md:hidden">{mobileProblemTitle2}</span>
                  <span className="hidden md:inline">
                  {c.problem2}
                  </span>
                </span>
              </>
            )}
          </h2>
          <p className={`mx-auto mt-7 text-center font-medium text-[#7d7d83] md:mt-8 md:max-w-[680px] md:text-[1.12rem] md:leading-relaxed md:text-[#86868b] ${
            isSeoPage || isWebsitePage || isGoogleAdsPage
              ? "max-w-[23.5rem] text-[0.95rem] leading-[1.52]"
              : "max-w-[18.25rem] text-[0.94rem] leading-[1.62]"
          }`}>
            {isSeoPage || isGoogleAdsPage ? (
              c.problemText
            ) : isWebsitePage ? (
              c.problemText
            ) : (
              <>
                <span className="md:hidden">{mobileProblemText}</span>
                <span className="hidden md:inline">{c.problemText}</span>
              </>
            )}
          </p>

          <div className="mt-10 md:hidden">
            <div
              ref={mobileFlowScrollerRef}
              className="relative left-1/2 flex w-screen -translate-x-1/2 snap-x snap-mandatory gap-5 overflow-x-auto px-3 pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label={c.flowLabel}
              onScroll={handleMobileFlowScroll}
            >
              {mobileFlowSlides.map((slide, index) => (
                <div key={slide} className="w-[94vw] flex-none snap-center">
                  <img
                    src={slide}
                    alt=""
                    aria-hidden="true"
                    className="w-full rounded-[1.25rem] object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2.5">
              {mobileFlowSlides.map((slide, index) => (
                <button
                  key={slide}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={activeMobileFlowSlide === index ? "true" : undefined}
                  onClick={() => scrollToMobileFlowSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeMobileFlowSlide === index ? "w-8 bg-[#007aff]" : "w-2.5 bg-[#007aff]/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-10 hidden w-full max-w-[840px] overflow-hidden md:mt-12 md:block md:max-w-[1160px] lg:max-w-[1320px]">
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

      {showGrowthSection && (
        <section className="px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-16">
              <div>
                <Label>{lang === "de" ? "Für wen" : lang === "tr" ? "Kimler için" : "Who it is for"}</Label>
                <h2 className={`font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10] ${isWebsitePage ? "text-[clamp(2.08rem,8.4vw,2.45rem)] md:text-[clamp(2.55rem,3vw,2.9rem)]" : "text-[clamp(2.2rem,3.45vw,3.55rem)]"}`}>
                  {isWebsitePage && lang === "de" ? (
                    <>
                      <span className="block md:whitespace-nowrap">Websites für Dienstleister </span>
                      <span className="block md:whitespace-nowrap">die Anfragen gewinnen.</span>
                    </>
                  ) : isWebsitePage && lang === "tr" ? (
                    <>
                      <span className="block">Kanzleiler ve danışmanlar, </span>
                      <span className="block">zanaat ve hizmet işletmeleri </span>
                      <span className="block">için web siteleri.</span>
                    </>
                  ) : isWebsitePage ? (
                    <>
                      <span className="block">Websites for law firms, </span>
                      <span className="block">consultants and trades, </span>
                      <span className="block">and service businesses.</span>
                    </>
                  ) : variant === "googleAds" && lang === "de" ? (
                    <>
                      <span className="block">Google Ads für Unternehmen, </span>
                      <span className="block">die <span className="text-[#007aff]">jetzt Anfragen</span> gewinnen wollen.</span>
                    </>
                  ) : variant === "googleAds" && lang === "tr" ? (
                    <>
                      <span className="block">Hemen talep almak isteyen </span>
                      <span className="block">işletmeler için <span className="text-[#007aff]">Google Ads.</span></span>
                    </>
                  ) : variant === "googleAds" ? (
                    <>
                      <span className="block">Google Ads for businesses </span>
                      <span className="block">that want <span className="text-[#007aff]">enquiries now.</span></span>
                    </>
                  ) : lang === "de" ? (
                    <>
                      <span className="block">SEO für Unternehmen, </span>
                      <span className="block">die <span className="text-[#007aff]">in Deutschland</span> gefunden werden.</span>
                    </>
                  ) : lang === "tr" ? (
                    <>
                      <span className="block">Almanya'da bulunmak isteyen </span>
                      <span className="block">işletmeler için <span className="text-[#007aff]">SEO.</span></span>
                    </>
                  ) : (
                    <>
                      <span className="block">SEO for businesses </span>
                      <span className="block">that want to be found </span>
                      <span className="block text-[#007aff]">in Germany.</span>
                    </>
                  )}
                </h2>
                <p className="mt-6 max-w-xl text-[1.05rem] font-medium leading-relaxed text-[#86868b]">
                  {isWebsitePage && lang === "de"
                    ? "Eine gute Website ist keine digitale Visitenkarte. Sie ist ein System aus Positionierung, Vertrauen, SEO-Struktur und klaren Kontaktwegen."
                    : isWebsitePage && lang === "tr"
                      ? "İyi bir web sitesi dijital kartvizit değildir. Konumlandırma, güven, SEO yapısı ve net iletişim yollarından oluşan bir sistemdir."
                      : isWebsitePage
                        ? "A good website is not a digital business card. It is a system of positioning, trust, SEO structure, and clear contact paths."
                        : variant === "googleAds" && lang === "de"
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
                {activeTargetLinks.length > 0 && (
                  <nav aria-label={isWebsitePage ? (lang === "de" ? "Webdesign-Zielgruppen" : lang === "tr" ? "Web tasarım hedef grupları" : "Web design target audiences") : isGoogleAdsPage ? (lang === "de" ? "Google-Ads-Zielgruppen" : lang === "tr" ? "Google Ads hedef grupları" : "Google Ads target audiences") : (lang === "de" ? "SEO-Zielgruppen" : lang === "tr" ? "SEO hedef grupları" : "SEO target audiences")} className="mt-6 flex flex-wrap gap-2">
                    {activeTargetLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[0.8rem] font-bold text-[#0e0e10] shadow-[0_10px_30px_rgba(0,0,0,0.035)] transition hover:border-[#007aff]/30 hover:text-[#007aff]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {activeGrowthAudiences.map((audience) => {
                  const anchor = "anchor" in audience ? audience.anchor : undefined;
                  const Icon = audience.Icon;

                  return (
                    <article id={anchor} key={audience.title} className="scroll-mt-28 rounded-[1.35rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#007aff]">
                          <Icon size={20} strokeWidth={2.4} />
                        </div>
                        <h3 className="min-w-0 text-[1.15rem] font-bold leading-tight tracking-[-0.03em] text-[#0e0e10] md:text-[1.2rem]">{audience.title}</h3>
                      </div>
                      <p className="mt-3 text-[0.98rem] font-medium leading-relaxed text-[#86868b]">{audience.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div id="was-wir-bauen" className="mt-20 scroll-mt-28 pt-12 md:mt-24 md:pt-16">
              <div className="mb-10 flex flex-col gap-4">
                <div>
                  <Label>{lang === "de" ? "Was wir bauen" : lang === "tr" ? "Ne kuruyoruz" : "What we build"}</Label>
                  <h2 className="max-w-none text-[clamp(2.2rem,4vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10] xl:whitespace-nowrap">
                    {isWebsitePage && lang === "de" ? (
                      "Was eine Website braucht, um Kunden zu gewinnen."
                    ) : isWebsitePage && lang === "tr" ? (
                      "Bir web sitesinin talep getirmesi için gerekenler."
                    ) : isWebsitePage ? (
                      "What a website needs to win enquiries."
                    ) : variant === "googleAds" && lang === "de" ? (
                      "Was wir konkret für profitable Kampagnen aufbauen."
                    ) : variant === "googleAds" && lang === "tr" ? (
                      "Karlı kampanyalar için gerçekten kurduğumuz yapı."
                    ) : variant === "googleAds" ? (
                      "What we actually build for profitable campaigns."
                    ) : lang === "de" ? (
                      "Was wir konkret für Ihre Sichtbarkeit aufbauen."
                    ) : lang === "tr" ? (
                      "Görünürlüğünüz için gerçekten kurduğumuz yapı."
                    ) : (
                      "What we actually build for your visibility."
                    )}
                  </h2>
                </div>
                <p className="max-w-md text-[1rem] font-medium leading-relaxed text-[#86868b]">
                  {isWebsitePage && lang === "de"
                    ? "Wir verbinden Design, technische Performance, lokale SEO, Vertrauen und messbare Kontaktwege zu einer Website, die nicht nur gut aussieht, sondern arbeitet."
                    : isWebsitePage && lang === "tr"
                      ? "Tasarım, teknik performans, yerel SEO, güven ve ölçülebilir iletişim yollarını çalışan bir web sitesinde birleştiririz."
                      : isWebsitePage
                        ? "We connect design, technical performance, local SEO, trust, and measurable contact paths into a website that works, not just one that looks good."
                        : variant === "googleAds" && lang === "de"
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
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {activeGrowthSteps.map((step, index) => (
                  <article key={step.number} className="rounded-[1.15rem] border border-black/[0.08] bg-white p-4 shadow-[0_14px_45px_rgba(0,0,0,0.04)] md:border-0 md:p-0 md:shadow-none">
                    <img
                      src={seoStepIcons[index]}
                      alt=""
                      aria-hidden="true"
                      className="mb-4 h-10 w-10 object-contain md:mb-6 md:h-20 md:w-20"
                    />
                    <h3 className="text-[1.02rem] font-bold leading-tight tracking-[-0.035em] text-[#0e0e10] md:text-[1.35rem]">{step.title}</h3>
                    <p className="mt-2 text-[0.82rem] font-medium leading-[1.45] text-[#86868b] md:mt-3 md:text-[0.98rem] md:leading-relaxed">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <CaseStudySection c={c} lang={lang} variant={variant} />

      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div>
            <Label>{c.faqLabel}</Label>
            <h2 className="text-[clamp(2.4rem,4.4vw,4rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[#0e0e10]">
              <span className="block">{c.faqTitle1} </span>
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
                        {faq.a} {index === 0 && <a href="/#pricing" className="font-bold text-[#007aff]">{c.pricingLink} →</a>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#070914] px-5 py-12 text-center shadow-[0_24px_90px_rgba(7,9,20,0.18)] md:rounded-[2rem] md:px-10 md:py-24">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/55 md:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
            {c.heroLabel}
          </div>
          <h2 className="mx-auto max-w-[22rem] text-[clamp(2.55rem,10.4vw,3rem)] font-bold leading-[0.98] tracking-[-0.06em] text-white md:max-w-none md:text-[clamp(2.4rem,5vw,4.5rem)] md:leading-[1.04] md:tracking-[-0.05em]">
            {isSeoPage || isWebsitePage || isGoogleAdsPage ? (
              c.closingTitle
            ) : (
              <>
                <span className="md:hidden">{mobileClosingTitle}</span>
                <span className="hidden md:inline">{c.closingTitle}</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-[18rem] text-[1rem] font-medium leading-relaxed text-white/58 md:max-w-2xl md:text-[1.125rem]">
            {isSeoPage || isWebsitePage || isGoogleAdsPage ? (
              c.closingText
            ) : (
              <>
                <span className="md:hidden">{mobileClosingText}</span>
                <span className="hidden md:inline">{c.closingText}</span>
              </>
            )}
          </p>
          <div className="mx-auto mt-7 grid max-w-[20rem] grid-cols-3 gap-2 md:hidden">
            {mobileClosingTrust.map((item) => (
              <div key={item} className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-2 text-[0.74rem] font-bold leading-tight text-white/75">
                {item}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIsQuoteOpen(true)} className="mt-8 inline-flex w-full max-w-[20rem] items-center justify-center gap-2 rounded-full bg-[#007aff] px-8 py-4 text-[1rem] font-bold text-white shadow-[0_18px_45px_rgba(0,122,255,0.32)] transition hover:bg-[#0066d6] md:mt-10 md:w-auto md:max-w-none">
            {c.start} <ArrowRight size={18} />
          </button>
          <a href="mailto:info@nüll.com" className="mx-auto mt-4 flex max-w-[20rem] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.9rem] font-semibold text-white/78 md:mt-6 md:block md:max-w-none md:border-0 md:bg-transparent md:p-0 md:text-[0.95rem] md:font-medium md:text-white/45">
            <span className="hidden md:inline">{c.direct} </span><span className="text-white">{c.email}</span>
          </a>
        </div>
      </section>

      <div className={`fixed inset-x-0 bottom-0 z-[9999998] border-t border-black/10 bg-white/85 px-4 py-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${showStickyCta ? "translate-y-0" : "translate-y-full"}`}>
        <button type="button" onClick={() => setIsQuoteOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0e0e10] py-4 text-[0.95rem] font-bold text-white">
          {c.sticky} <ArrowRight size={17} />
        </button>
      </div>

      <LeadCapture isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </main>
  );
}
