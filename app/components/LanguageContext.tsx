import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

export type Language = "en" | "de" | "tr";

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  isHydrated: boolean;
}>({ lang: "de", setLang: () => { }, isHydrated: false });

// Cookie Helpers for Bulletproof Persistence
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === "undefined") return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.error("Cookie persistence failed:", e);
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  } catch (e) {
    return null;
  }
};

export function LanguageProvider({ children, initialLang = "de" }: { children: ReactNode, initialLang?: Language }) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with cookies/localStorage on mount
  useEffect(() => {
    try {
      const saved = (getCookie("nll_lang") || localStorage.getItem("nll_lang")) as Language;
      if (saved && (saved === "en" || saved === "de" || saved === "tr")) {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch (e) {
      console.warn("Language hydration from storage failed:", e);
    }
    setIsHydrated(true);

    // Listen for changes fired by the self-contained LanguageSwitcher
    const handler = (e: Event) => {
      const newLang = (e as CustomEvent<Language>).detail;
      if (newLang === "en" || newLang === "de" || newLang === "tr") {
        setLangState(newLang);
      }
    };
    window.addEventListener("nll-lang-change", handler);
    return () => window.removeEventListener("nll-lang-change", handler);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    // 1. Force state update immediately
    setLangState(newLang);
    
    // 2. Try persistence
    try {
      setCookie("nll_lang", newLang, 365);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("nll_lang", newLang);
      }
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
      window.dispatchEvent(new CustomEvent('nll-lang-change', { detail: newLang }));
    } catch (e) {
      console.warn("Language persistence issue:", e);
    }
  }, []);

  const value = useMemo(() => ({ 
    lang, 
    setLang, 
    isHydrated 
  }), [lang, setLang, isHydrated]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

const labels: Record<string, Record<Language, string>> = {
  "nav.services": { en: "Services", de: "Leistungen", tr: "Hizmetler" },
  "nav.work": { en: "Work", de: "Projekte", tr: "Projeler" },
  "nav.pricing": { en: "Pricing", de: "Preise", tr: "Fiyatlar" },
  "nav.blog": { en: "Blog", de: "Blog", tr: "Blog" },
  "nav.contact": { en: "Contact", de: "Kontakt", tr: "İletişim" },
  "nav.getStarted": { en: "Get Started", de: "Jetzt starten", tr: "Hemen başlayın" },

  "hero.eyebrow": { 
    en: "Web design & positioning for consultants", 
    de: "Webdesign & Positionierung für Berater", 
    tr: "Danışmanlar için web tasarımı ve konumlandırma" 
  },
  "hero.line1": { 
    en: "Clients are searching.", 
    de: "Klienten suchen.", 
    tr: "Danışanlar uzman arıyor." 
  },
  "hero.line2": { 
    en: "Your firm is the answer.", 
    de: "Ihr Unternehmen ist die Antwort.", 
    tr: "Cevap siz olmalısınız" 
  },
  "hero.description": {
    en: "We build digital presences for Turkish-German consultants in Germany so you get found, earn trust, and win the right clients. Whether you have no website yet or one that isn't working: we make your business the first choice.",
    de: "Wir schaffen digitale Präsenz für deutsch-türkische Berater in Deutschland, damit Sie gefunden werden, Vertrauen aufbauen und die richtigen Klienten gewinnen. Ob Sie noch keine Website haben oder eine, die nicht funktioniert, wir machen Ihr Unternehmen zur ersten Wahl.",
    tr: "Almanya'daki Türk-Alman danışmanlar için dijital varlık oluşturuyoruz. Bulunmanız, güven kazanmanız ve doğru danışanları çekmeniz için. Henüz bir web siteniz yoksa ya da işe yaramayanı varsa: Sizi ilk tercih haline getiriyoruz.",
  },
  "hero.descriptionMobile": {
    en: "Whether you have no website or one that isn't working: we make your business the first choice online.",
    de: "Egal ob Sie noch keine Website haben oder eine, die nicht das leistet, what she soll, wir sorgen dafür, dass Ihr Unternehmen online gefunden wird.",
    tr: "Henüz web siteniz olmasa da, olanı işe yaramasa da, sizi internette öne çıkarıyoruz.",
  },
  "hero.cta": { 
    en: "Book a free consultation", 
    de: "Jetzt kostenlos beraten lassen", 
    tr: "Ücretsiz danışmanlık al" 
  },
  "hero.secondary": { 
    en: "View case studies", 
    de: "Fallstudien ansehen", 
    tr: "Örnek projeleri gör" 
  },

  // Social Proof Cards
  "hero.card1.label": { en: "Consulting website", de: "Berater-Website", tr: "Danışmanlık sitesi" },
  "hero.card1.value": { en: "4 completed", de: "4 fertiggestellt", tr: "4 tamamlandı" },
  "hero.card1.sub": { en: "built with a real expert", de: "mit einem echten Experten entwickelt", tr: "gerçek bir uzmanla geliştirildi" },

  "hero.card2.label": { en: "Design", de: "Design", tr: "Tasarım" },
  "hero.card2.value": { en: "Fully responsive", de: "Vollständig responsiv", tr: "Tam uyumlu" },
  "hero.card2.sub": { en: "looks great on every device", de: "auf jedem Gerät perfekt", tr: "her cihazda kusursuz görünüm" },

  "hero.card3.label": { en: "SEO", de: "SEO", tr: "SEO" },
  "hero.card3.value": { en: "Foundation in place", de: "Grundlage gelegt", tr: "Altyapı kuruldu" },
  "hero.card3.sub": { en: "results on the way", de: "Ergebnisse folgen", tr: "sonuçlar yolda" },
  "hero.trustRibbon.t1": { en: "Consulting Expert", de: "Berater-Experten", tr: "Danışmanlık Uzmanı" },
  "hero.trustRibbon.t2": { en: "Conversion Focused", de: "Conversion-Fokus", tr: "Dönüşüm Odaklı" },
  "hero.trustRibbon.t3": { en: "Digital Excellence", de: "Digitale Exzellenz", tr: "Dijital Mükemmellik" },

  "hero.trustBar": {
    en: "Already trusted by experts in Germany. Every website built to win clients, not just look good.",
    de: "Bereits von Beratern in Deutschland vertraut. Jede Website gebaut, um Klienten zu gewinnen, nicht nur um zu beeindrucken.",
    tr: "Almanya'daki danışmanlar tarafından tercih ediliyoruz. Her web sitesi, sadece iyi görünmek için değil, danışan kazanmak için tasarlandı.",
  },
  "hero.comparison.label": {
    en: "Digital Transformation",
    de: "Digitale Transformation",
    tr: "Dijital Dönüşüm",
  },
  "hero.comparison.title": {
    en: "This is what a consultant that wins trust looks like.",
    de: "So sieht ein Auftritt aus, der überzeugt.",
    tr: "Güven kazanan bir danışmanlık böyle görünür.",
  },
  "hero.comparison.subtitle": {
    en: "Every detail designed to build trust and win clients.",
    de: "Jedes detail darauf ausgelegt, Vertrauen zu schaffen und Mandanten zu gewinnen.",
    tr: "Her detay, güven oluşturmak ve danışan kazanmak için tasarlanmıştır.",
  },
  "problem.header": {
    en: "Most consultants lose clients before they ever speak to them.",
    de: "Die meisten Berater verlieren Klienten, bevor sie überhaupt sprechen.",
    tr: "Çoğu danışmanlık firması, henüz konuşmadan danışan kaybediyor.",
  },
  "problem.subHeader": {
    en: "Not because they are bad experts. But because they don't exist online.",
    de: "Nicht weil sie schlechte Berater sind. Sondern weil sie online nicht existieren.",
    tr: "Kötü uzman oldukları için değil. Çevrimiçi var olmadıkları için.",
  },
  "problem.p1": {
    en: "Someone is searching for a consultant in your city right now. They type into Google. They find your competition. Not you.",
    de: "Jemand sucht gerade nach einem Berater in Ihrer Stadt. Er tippt bei Google. Er findet Ihre Konkurrenz. Nicht Sie.",
    tr: "Şu an birileri bulunduğunuz şehirde uzman arıyor. Google'a yazıyor. Rakiplerinizi buluyor. Sizi değil.",
  },
  "problem.p2": {
    en: "Your website exists, but it looks outdated. First impressions matter — and right now your first impression is costing you clients.",
    de: "Ihre Website existiert, aber sie wirkt veraltet. Der erste Eindruck zählt — und der erste Eindruck kostet Sie Mandanten.",
    tr: "Web siteniz var ama eski görünüyor. İlk izlenim önemlidir ve şu an bu izlenim size müşteri kaybettiriyor.",
  },
  "problem.p3": {
    en: "You have no website. The expert down the street does. And they are getting the enquiries that should be yours.",
    de: "Sie haben keine Website. Ihr Nachbar, der auch Berater ist, schon. Und er bekommt die Anfragen, die eigentlich Ihnen gehören sollten.",
    tr: "Web siteniz yok. Yakınınızdaki uzmanın var. Ve size gelmesi gereken talepler ona gidiyor.",
  },
  "problem.turn": {
    en: "It doesn't have to stay this way. And it's easier to change than you think.",
    de: "Das muss nicht so bleiben. Und es ist einfacher zu ändern, als Sie denken.",
    tr: "Böyle kalmak zorunda değil. Ve değiştirmek düşündüğünüzden çok daha kolay.",
  },

  "services.label": { en: "Services", de: "Leistungen", tr: "Hizmetler" },
  "services.title1": {
    en: "Everything your business",
    de: "Alles, was Ihr Unternehmen",
    tr: "Uzmanlığınızın çevrimiçi",
  },
  "services.title2": {
    en: "needs online.",
    de: "online braucht.",
    tr: "ihtiyacı olan her şey.",
  },
  "services.description": {
    en: "We take care of your entire digital presence so you can focus on what you do best: share your expertise.",
    de: "Wir kümmern uns um Ihre gesamte digitale Präsenz, damit Sie sich auf das konzentrieren können, was Sie am besten können: Ihre Expertise teilen.",
    tr: "Tüm dijital varlığınızla biz ilgileniyoruz, siz en iyi yaptığınıza odaklanın: Uzmanlığınızı paylaşmak.",
  },
  "services.webdesign": { en: "Business website", de: "Experten-Website", tr: "Kurumsal web sitesi" },
  "services.webdesign.desc": { 
    en: "A website that showcases your expertise and converts visitors. No templates. No compromises. Built for consultants.", 
    de: "Eine Website, die Ihre Expertise zeigt und Klienten überzeugt. Kein Template. Kein Kompromiss. Gebaut für Berater.", 
    tr: "Uzmanlığınızın çevrimiçi vitrini. Şablon yok, taviz yok. Uzmanlar için tasarlandı." 
  },
  "services.development": { en: "Technical development", de: "Technische Umsetzung", tr: "Teknik geliştirme" },
  "services.development.desc": {
    en: "Fast, secure and perfect on every device. Your website runs reliably so you don't have to think about it.",
    de: "Schnell, sicher und auf allen Geräten perfekt. Ihre Website läuft zuverlässig — damit Sie es nicht müssen.",
    tr: "Hızlı, güvenli ve her cihazda kusursuz. Web siteniz güvenilir çalışır, siz düşünmek zorunda kalmazsınız.",
  },
  "services.seo": { en: "Google visibility", de: "Google-Sichtbarkeit", tr: "Google görünürlüğü" },
  "services.seo.desc": {
    en: "When someone in your city searches for a consultant, they should find you. We make sure Google recommends your business.",
    de: "Wenn jemand in Ihrer Stadt nach einem Berater sucht, soll er Sie finden. Wir sorgen dafür, dass Google Ihr Unternehmen empfiehlt.",
    tr: "Şehrinizde biri uzman aradığında sizi bulsun. Google'ın sizi önermesini sağlıyoruz.",
  },
  "services.seo.upsell": {
    en: "Add-on from €170/mo",
    de: "Option ab €170/Monat",
    tr: "Ek seçenek €170/ay'dan",
  },
  "services.branding": { en: "Brand identity", de: "Markenidentität", tr: "Marka kimliği" },
  "services.branding.desc": {
    en: "Logo, colours and visual presence that set your firm apart. Professionalism that is visible at first glance.",
    de: "Logo, Farben und Auftritt, die Ihr Unternehmen von anderen unterscheiden. Professionalität, die man sofort sieht.",
    tr: "Sizi diğerlerinden ayıran logo, renkler ve görsel kimlik. İlk bakışta fark edilen profesyonellik.",
  },
  "services.maintenance": { en: "Monthly care", de: "Monatliche Betreuung", tr: "Aylık bakım" },
  "services.maintenance.desc": {
    en: "Updates, security, changes and ongoing support. Your website stays current at all times without you having to think about it.",
    de: "Updates, Sicherheit, Änderungen und laufende Betreuung. Ihre Website bleibt immer aktuell — ohne dass Sie sich darum kümmern müssen.",
    tr: "Güncellemeler, güvenlik, değişiklikler ve sürekli destek. Web siteniz her zaman güncel kalır, siz düşünmek zorunda kalmazsınız.",
  },
  "services.maintenance.badge": {
    en: "From €99/mo · included in every package",
    de: "Ab €99/Monat · in jedem Paket inklusive",
    tr: "Aylık €99'dan · her pakete dahil",
  },
  "services.learnMore": { en: "Learn more", de: "Mehr erfahren", tr: "Daha fazla bilgi" },

  "work.label": { en: "Selected Work", de: "Ausgewählte Projekte", tr: "Seçili Çalışmalar" },
  "work.title": { en: "Projects that speak for themselves.", de: "Arbeiten, die für sich sprechen.", tr: "Kendini anlatan projeler." },
  "work.dogru.category": {
    en: "Web design & brand identity",
    de: "Webdesign & Markenidentität",
    tr: "Web tasarımı ve marka kimliği",
  },
  "work.dogru.desc": {
    en: "A bilingual business website for a Mannheim consultant with ties to Ankara. We developed his brand identity, sharpened his message and built a website that radiates authority and convinces clients.",
    de: "Eine zweisprachige Experten-Website für einen Mannheimer Berater mit Verbindungen nach Ankara. Wir haben seine Markenidentität entwickelt, seine Botschaft geschärft und eine Website gebaut, die Autorität ausstrahlt und Klienten überzeugt.",
    tr: "Mannheim'da faaliyet gösteren danışman Hasan Doğru, hem Alman hem de Türk danışanlara hitap eden güçlü bir dijital kimlik istiyordu. Marka kimliğinden web sitesine kadar her detayı birlikte geliştirdik. Sonuç: İki dilde güven veren, kararlı ve özgün bir business.",
  },
  "work.besir.category": { en: "Consultant · Personal Brand & Web Design", de: "Berater · Personal Branding & Webdesign", tr: "Danışman · Kişisel Marka & Web Tasarım" },
  "work.besir.desc": {
    en: "Positioning and branding for a finance and insurance consultant looking to build an online presence. We crafted his message, designed his brand identity, and built a site that establishes authority and trust.",
    de: "Positionierung und Markenaufbau für einen Finanz- und Versicherungsberater, der seine Online-Präsenz stärken möchte. Wir haben seine Botschaft geschärft, seine Markenidentität entwickelt und eine Website erstellt, die Autorität und Vertrauen vermittelt.",
    tr: "Online varlığını güçlendirmek isteyen bir finans ve sigorta danışmanı için konumlandırma ve marka çalışması. Mesajını netleştirdik, marka kimliğini oluşturduk ve otorite ile güven sağlayan bir web sitesi geliştirdik.",
  },

  // Pricing
  "pricing.label": { en: "Pricing", de: "PREISE", tr: "FİYATLAR" },
  "pricing.title1": { en: "Full clarity", de: "Volle Klarheit", tr: "Baştan tam" },
  "pricing.title2": { en: "from the start.", de: "von Anfang an.", tr: "netlik." },
  "pricing.description": {
    en: "Choose the package that fits your business. Monthly care is included in every package.",
    de: "Wählen Sie das Paket, das zu Ihrem Unternehmen passt. Monatliche Betreuung ist in jedem Paket dabei.",
    tr: "Size en uygun paketi seçin. Aylık bakım her pakete dahildir.",
  },
  "pricing.tab.websites": { en: "Website Packages", de: "Website-Pakete", tr: "Web Sitesi Paketleri" },
  "pricing.tab.retainer": { en: "Monthly Retainer", de: "Monatliche Betreuung", tr: "Aylık Bakım" },

  // TAB 1: WEBSITES
  "pricing.starter": { en: "STARTER", de: "STARTER", tr: "STARTER" },
  "pricing.starter.desc": {
    en: "A fast start with a solid foundation.",
    de: "Schnell online. Solide aufgestellt.",
    tr: "Hızlı ve sağlam bir başlangıç.",
  },
  "pricing.starter.f1": { en: "Custom Website for Your Business", de: "Individuelle Website für Ihr Unternehmen", tr: "İşletmenize Özel Web Sitesi" },
  "pricing.starter.f2": { en: "Mobile Optimized", de: "Mobil optimiert", tr: "Mobil uyumlu" },
  "pricing.starter.f3": { en: "Fast Load Times", de: "Hohe Geschwindigkeit", tr: "Yüksek hız" },
  "pricing.starter.f4": { en: "Contact form integration", de: "Kontaktformular", tr: "İletişim formu" },
  "pricing.starter.f5": { en: "Essential maintenance included", de: "Inklusive Basis-Wartung", tr: "Temel bakım hizmeti dahil" },
  "pricing.starter.cta": { en: "Select Starter", de: "Starter wählen", tr: "Starter Seç" },

  "pricing.growth": { en: "GROWTH", de: "GROWTH", tr: "GROWTH" },
  "pricing.growth.badge": { en: "MOST POPULAR", de: "MEISTGEWÄHLT", tr: "EN POPÜLER" },
  "pricing.growth.price": { en: "from 4.900€", de: "ab 4.900€", tr: "4.900€'den itibaren" },
  "pricing.growth.desc": {
    en: "A website that wins clients and gets found on Google.",
    de: "Eine Website, die Klienten gewinnt und bei Google gefunden wird.",
    tr: "Danışan kazanan ve Google'da öne çıkan bir web sitesi.",
  },
  "pricing.growth.f1": { en: "Custom Website for Your Business", de: "Individuelle Website für Ihr Unternehmen", tr: "İşletmenize Özel Web Sitesi" },
  "pricing.growth.f2": { en: "Individual design", de: "Individuelles Design", tr: "Kişiye özel tasarım" },
  "pricing.growth.f3": { en: "Comprehensive on-page SEO", de: "Umfassendes On-Page SEO", tr: "Kapsamlı sayfa içi SEO" },
  "pricing.growth.f4": { en: "Blog and news section", de: "Blog- und Newsbereich", tr: "Blog ve haber bölümü" },
  "pricing.growth.f5": { en: "Social media integration", de: "Social-Media-Anbindung", tr: "Sosyal medya entegrasyonu" },
  "pricing.growth.f6": { en: "Basic branding package", de: "Basis-Branding-Paket", tr: "Temel marka paketi" },
  "pricing.growth.f7": { en: "Active SEO strategy included", de: "Inklusive aktiver SEO-Strategie", tr: "Aktif SEO stratejisi dahil" },

  "pricing.premium": { en: "PREMIUM", de: "PREMIUM", tr: "PREMIUM" },
  "pricing.premium.price": { en: "from 7.900€", de: "ab 7.900€", tr: "7.900€'den itibaren" },
  "pricing.premium.desc": {
    en: "The full digital lead system for high-end consultants.",
    de: "Das volle digitale Lead-System für High-End-Berater.",
    tr: "High-end danışmanlar için eksiksiz dijital talep sistemi.",
  },
  "pricing.premium.f1": { en: "Custom Website for Your Business", de: "Individuelle Website für Ihr Unternehmen", tr: "İşletmenize Özel Web Sitesi" },
  "pricing.premium.f2": { en: "Premium design", de: "Premium-Design", tr: "Premium tasarım" },
  "pricing.premium.f3": { en: "Full SEO strategy", de: "Vollständige SEO-Strategie", tr: "Eksiksiz SEO stratejisi" },
  "pricing.premium.f4": { en: "Logo and brand identity", de: "Logo und Markenidentität", tr: "Logo ve marka kimliği" },
  "pricing.premium.f5": { en: "Copywriting support", de: "Unterstützung beim Texten", tr: "Metin yazarlığı desteği" },
  "pricing.premium.f6": { en: "Analytics setup", de: "Analytics-Einrichtung", tr: "Analitik kurulumu" },
  "pricing.premium.f7": { en: "Priority support 30 days", de: "30 Tage priorisierter Support", tr: "30 gün öncelikli destek" },
  "pricing.premium.f8": { en: "Full Managed Lead System", de: "Full Managed Lead-System", tr: "Tam yönetimli talep sistemi" },

  "pricing.includedRetainer": {
    en: "Care & hosting: €99/month",
    de: "Betreuung & Hosting: €99/Monat",
    tr: "Bakım ve hosting: aylık €99",
  },
  "pricing.cta.start": { en: "Get started", de: "Jetzt starten", tr: "Hemen başlayın" },

  // TAB 2: RETAINER
  "pricing.retainer.intro": {
    en: "Already included in your package: €99/month basic care. Want more? Upgrade at any time.",
    de: "In jedem unserer Pakete ist bereits eine monatliche Basisbetreuung für €99 enthalten. Wer mehr wachsen möchte, kann jederzeit wechseln.",
    tr: "Her paketimize aylık €99 temel bakım dahildir. Daha fazla büyümek istiyorsanız, istediğiniz zaman bir üst pakete geçebilirsiniz.",
  },
  "pricing.retainer.seo": { en: "SEO & CARE", de: "SEO & PFLEGE", tr: "SEO & BAKIM" },
  "pricing.retainer.seo.badge": { en: "RECOMMENDED", de: "EMPFOHLEN", tr: "TAVSİYE EDİLEN" },
  "pricing.retainer.seo.desc": {
    en: "Your business grows in Google search results every month.",
    de: "Jeden Monat ein Stück weiter oben bei Google.",
    tr: "İşletmeniz her ay Google'da biraz daha yukarı çıksın.",
  },
  "pricing.retainer.seo.f1": { en: "Ongoing Content Optimization", de: "Laufende Content-Optimierung", tr: "Düzenli içerik optimizasyonu" },
  "pricing.retainer.seo.f2": { en: "Keyword research for your focus areas", de: "Keyword-Arbeit für Ihre Beratungsschwerpunkte", tr: "Danışmanlık alanınıza özel anahtar kelime çalışması" },
  "pricing.retainer.seo.f3": { en: "In German, Turkish or both", de: "Auf Deutsch, Türkisch oder beides", tr: "Almanca, Türkçe veya her ikisi" },
  "pricing.retainer.seo.f4": { en: "Technical SEO maintenance", de: "Technische SEO-Begleitung", tr: "Teknik SEO takibi" },
  "pricing.retainer.seo.f5": { en: "Monthly progress report", de: "Monatlicher Fortschrittsbericht", tr: "Aylık gelişim raporu" },
  "pricing.retainer.seo.priceSuffix": { en: "/month", de: "/Monat", tr: "/ay" },

  "pricing.retainer.growth": { en: "GROWTH PACKAGE", de: "WACHSTUMS-PAKET", tr: "BÜYÜME PAKETİ" },
  "pricing.retainer.growth.desc": {
    en: "SEO plus new landing pages that actively win clients for your practice areas.",
    de: "SEO plus jeden Monat eine neue Seite, die Ihr Unternehmen online sichtbarer macht.",
    tr: "SEO çalışmasına ek olarak, her ay yeni bir sayfa ile işletmenizin online varlığını genişletin.",
  },
  "pricing.retainer.growth.f1": { en: "Everything in SEO & care", de: "Alles aus SEO & Pflege", tr: "SEO & Bakım paketindeki her şey" },
  "pricing.retainer.growth.f2": { en: "New landing page every month", de: "Jeden Monat eine neue Leistungs- oder Stadtseite", tr: "Her ay yeni bir hizmet veya şehir sayfası" },
  "pricing.retainer.growth.f3": { en: "Targeted by practice area or city", de: "Inhalte, die Ihre Zielgruppe direkt ansprechen", tr: "Hedef kitleye özel içerik" },
  "pricing.retainer.growth.f4": { en: "Built to rank on Google", de: "Aufgebaut um bei Google zu ranken", tr: "Google sıralamalarını doğrudan hedefleyen yapı" },
  "pricing.retainer.growth.f5": { en: "Priority support", de: "Priorisierter Support", tr: "Öncelikli destek" },

  "pricing.retainer.disclaimer": {
    en: "Basic care at €99/month is included in every website package and cannot be booked separately.",
    de: "Die Basisbetreuung für €99/Monat ist in jedem Website-Paket enthalten und nicht separat buchbar.",
    tr: "Aylık €99 temel bakım tüm paketlere dahildir ve ayrıca satın alınamaz.",
  },
  "pricing.cta.upgrade": { en: "Upgrade now", de: "Jetzt wechseln", tr: "Şimdi geç" },
  
  // Contact
  "contact.label": { en: "Contact", de: "Kontakt", tr: "İletişim" },
  "contact.title1": { en: "Your expertise deserves a strong presence.", de: "Ihre Expertise verdient einen starken Auftritt.", tr: "Uzmanlığınız güçlü bir duruşu hak ediyor." },
  "contact.title2": { en: "Let's build your authority.", de: "Lassen Sie uns Ihre Autorität stärken.", tr: "Autoritenizi inşa edelim." },
  "contact.description": {
    en: "Tell us about your business. We will get back to you within 24 hours with a concrete plan.",
    de: "Erzählen Sie uns von Ihrem Unternehmen. Wir melden uns innerhalb von 24 Stunden mit einem konkreten Plan zurück.",
    tr: "İşletmenizden bahsedin. 24 saat içinde somut bir planla size geri döneceğiz.",
  },
  "contact.location": { en: "Mannheim, Germany", de: "Mannheim, Deutschland", tr: "Mannheim, Almanya" },
  "contact.whatsapp.cta": { en: "Message us directly — in German or Turkish.", de: "Schreiben Sie uns direkt — auf Deutsch oder Türkisch.", tr: "Bize direkt yazın — Almanca veya Türkçe." },
  "contact.email.cta": { en: "Prefer email? No problem.", de: "Lieber per E-Mail? Kein Problem.", tr: "E-posta tercih ederseniz sorun değil." },
  "contact.calendly.cta": { en: "Or book a free 30-minute call directly.", de: "Oder buchen Sie direkt ein kostenloses 30-Minuten-Gespräch.", tr: "Ya da ücretsiz 30 dakikalık görüşme için randevu alın." },
  "contact.name": { en: "Your name", de: "Ihr Name", tr: "Adınız" },
  "contact.email": { en: "Your email address", de: "Ihre E-Mail-Adresse", tr: "E-posta adresiniz" },
  "contact.phone": { en: "Your phone number", de: "Ihre Telefonnummer", tr: "Telefon numaranız" },
  "contact.city": { en: "Which city is your business in?", de: "In welcher Stadt ist Ihr Unternehmen?", tr: "İşletmeniz hangi şehirde?" },
  "contact.practiceArea": { en: "What is your main consulting area?", de: "Was ist Ihr Beratungsschwerpunkt?", tr: "Ana danışmanlık alanınız nedir?" },
  "contact.websiteUrl": { en: "Your current website link", de: "Ihre aktuelle Website-URL", tr: "Mevcut web sitesi adresiniz" },
  "contact.hasWebsite": { en: "Do you already have a website?", de: "Haben Sie bereits eine Website?", tr: "Mevcut bir web siteniz var mı?" },
  "contact.websiteOpt.yes": { en: "Yes I have one", de: "Ja, ich habe eine", tr: "Evet var" },
  "contact.websiteOpt.no": { en: "No not yet", de: "Nein, noch nicht", tr: "Hayır henüz yok" },
  "contact.message": { en: "How can we help you?", de: "Wie können wir Ihnen helfen?", tr: "Size nasıl yardımcı olabiliriz?" },
  "contact.send": { en: "Send message", de: "Nachricht senden", tr: "Mesaj gönder" },
  "contact.reassurance": { 
    en: "No sales pitch. No pressure. Just an honest conversation about how we can help your business.", 
    de: "Kein Verkaufsgespräch. Kein Druck. Nur ein ehrliches Gespräch darüber, wie wir Ihrem Unternehmen helfen können.", 
    tr: "Satış konuşması yok. Baskı yok. Sadece işletmenize nasıl yardımcı olabileceğimiz hakkında dürüst bir sohbet." 
  },
  "contact.sending": { en: "Sending...", de: "Wird gesendet...", tr: "Gönderiliyor..." },
  "contact.sent": { en: "Message sent!", de: "Nachricht gesendet!", tr: "Mesaj gönderildi!" },
  "contact.sentDesc": { en: "We'll be in touch within 24 hours.", de: "Wir melden uns innerhalb von 24 Stunden.", tr: "24 saat içinde size dönüş yapacağız." },
  "contact.error": { en: "Something went wrong. Please try again.", de: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.", tr: "Bir hata oluştu. Lütfen tekrar deneyin." },
  "contact.networkError": { en: "Network error. Please try again.", de: "Netzwerkfehler. Bitte versuchen Sie es erneut.", tr: "Ağ hatası. Lütfen tekrar deneyin." },

  // Footer
  "footer.rights": { en: "All rights reserved.", de: "Alle Rechte vorbehalten.", tr: "Tüm hakları saklıdır." },

  // Onboarding
  // Onboarding Intro
  "onboarding.intro.title": { en: "Let's build you a constant flow of clients", de: "Gemeinsam starten wir Ihren kontinuierlichen Kundenstrom", tr: "Kesintisiz müşteri akışınız için ilk adım" },
  "onboarding.intro.description": { en: "A few questions to help us understand your vision.", de: "Ein paar Fragen, um Ihre Vision zu verstehen.", tr: "Vizyonunuzu anlamamız für birkaç soru." },
  "onboarding.intro.duration": { en: "Duration: ~5 minutes", de: "Dauer: ca. 5 Minuten", tr: "Süre: ~5 dakika" },
  "onboarding.intro.cta": { en: "Start Onboarding", de: "Onboarding starten", tr: "Onboarding'i başlat" },
  "onboarding.intro.secure": { en: "Your data is handled securely and only used for your project.", de: "Ihre Daten werden sicher behandelt und nur für Ihr Projekt verwendet.", tr: "Verileriniz güvenle işlenip sadece projeniz için kullanılacaktır." },
  "onboarding.intro.secure_badge": { en: "Encrypted & Confidential", de: "Verschlüsselt & Vertraulich", tr: "Uçtan Uca Şifreli" },

  // Onboarding Step 1 - Identity
  "onboarding.step1.title": { en: "Let's get to know you.", de: "Lernen wir Sie kennen.", tr: "Sizi tanıyalım." },
  "onboarding.step1.sub": { en: "Share your basic details with us.", de: "Teilen Sie uns Ihre Grunddaten mit.", tr: "Temel bilgilerinizi paylaşın." },
  "onboarding.step1.name": { en: "Full Name", de: "Vollständiger Name", tr: "Ad Soyad" },
  "onboarding.step1.firm": { en: "Company Name", de: "Name des Unternehmens", tr: "Şirket/İşletme Adı" },
  "onboarding.step1.email": { en: "E-mail", de: "E-Mail", tr: "E-posta" },
  "onboarding.step1.phone": { en: "Phone", de: "Telefon", tr: "Telefon" },
  "onboarding.step1.city": { en: "City", de: "Stadt", tr: "Şehir" },

  // Onboarding Step 2 - Service Selection
  "onboarding.step2.title": { en: "What are you looking for?", de: "Was suchen Sie?", tr: "Ne arıyorsunuz?" },
  "onboarding.step2.sub": { en: "Depending on your choice, specific questions will follow.", de: "Je nach Auswahl zeigen wir passende Fragen.", tr: "Seçiminize göre size özel sorular gelecek." },
  "onboarding.step2.sub_multi": { en: "You can select one or more depending on your needs.", de: "Sie können je nach Bedarf eines oder mehrere auswählen.", tr: "İhtiyacınıza göre bir veya daha fazlasını seçebilirsiniz." },
  "onboarding.step2.web.title": { en: "Website Design", de: "Webseite", tr: "Web Sitesi Tasarımı" },
  "onboarding.step2.web.sub": { en: "A professional storefront that works for you", de: "Ein professioneller Auftritt, der für Sie arbeitet", tr: "Profesyonel bir vitrin" },
  "onboarding.step2.web.time": { en: "One-time", de: "Einmalig", tr: "Kalıcı" },

  "onboarding.step2.seo.title": { en: "SEO", de: "SEO", tr: "SEO" },
  "onboarding.step2.seo.sub": { en: "A steady stream of organic clients in 2–3 months", de: "Kontinuierlicher Kundenstrom in 2–3 Monaten", tr: "2–3 ayda organik müşteri akışı" },
  "onboarding.step2.seo.time": { en: "First results: 2–3 months", de: "Erste Ergebnisse: 2–3 Monate", tr: "İlk sonuçlar: 2–3 ay" },

  "onboarding.step2.ads.title": { en: "Google Ads", de: "Google Ads", tr: "Google Reklamları" },
  "onboarding.step2.ads.sub": { en: "Clients from the very first week", de: "Kunden ab der ersten Woche", tr: "İlk haftadan itibaren müşteri" },
  "onboarding.step2.ads.time": { en: "First results: within 1 week", de: "Erste Ergebnisse: innerhalb 1 Woche", tr: "İlk sonuçlar: 1 hafta içinde" },

  "onboarding.step2.both.title": { en: "Full Package", de: "Gesamtpaket", tr: "Tam Paket" },
  "onboarding.step2.both.sub": { en: "Fast start, lasting growth", de: "Schneller Start, nachhaltiges Wachstum", tr: "Hızlı başlangıç + kalıcı büyüme" },
  "onboarding.step2.both.time": { en: "Recommended for best results", de: "Für beste Ergebnisse empfohlen", tr: "En iyi sonuç için önerilen" },
  "onboarding.step2.both.badge": { en: "MOST POPULAR", de: "AM BELIEBTESTEN", tr: "EN ÇOK TERCİH EDİLEN" },

  "onboarding.step3.title": { en: "Your specialties.", de: "Ihre Schwerpunkte.", tr: "Uzmanlık alanlarınız." },
  "onboarding.step3.sub": { en: "Which consulting areas do you focus on?", de: "Auf welche Beratungsfelder sind Sie spezialisiert?", tr: "Hangi danışmanlık alanlarına odaklanıyorsunuz?" },
  "onboarding.step3.other": { en: "Other consulting area...", de: "Anderes Feld / Nische...", tr: "Diğer alan / Niş..." },
  "onboarding.step3.topServices.title": { en: "Your Top 3.", de: "Ihre Top 3.", tr: "En Önemli 3 Alan." },
  "onboarding.step3.topServices.sub": { en: "Select your three most important focus areas.", de: "Wählen Sie Ihre drei wichtigsten Beratungsschwerpunkte.", tr: "En önemli üç odak alanınızı seçin." },

  // Onboarding Step 4 — Website Details
  "onboarding.step4.title": { en: "About your website.", de: "Über Ihre Website.", tr: "Web siteniz hakkında." },
  "onboarding.step4.sub": { en: "Help us understand the scope and your needs.", de: "Helfen Sie uns, Umfang und Bedarf zu verstehen.", tr: "Kapsam ve ihtiyaçlarınızı anlayalım." },
  "onboarding.step4.q1": { en: "Estimated page count?", de: "Gewünschte Seitenzahl?", tr: "Tahmini sayfa sayısı?" },
  "onboarding.step4.q2": { en: "Which features do you need?", de: "Welche Funktionen benötigen Sie?", tr: "Hangi özellikler olsun?" },
  "onboarding.step4.q3": { en: "Revision rounds preference?", de: "Korrekturrunden?", tr: "Revizyon hakkı tercihiniz?" },
  "onboarding.step4.q4": { en: "Do you already have a website?", de: "Haben Sie bereits eine Website?", tr: "Mevcut bir web siteniz var mı?" },
  
  // 4a - Site Type
  "onboarding.step4a.q": { en: "What kind of website are you planning?", de: "Was für eine Website planen Sie?", tr: "Nasıl bir site düşünüyorsunuz?" },
  "onboarding.step4a.onepage.title": { en: "One-Page", de: "Ein-Seiten-Website", tr: "Tek sayfalık site" },
  "onboarding.step4a.onepage.sub": { en: "Simple and fast. But limited for SEO.", de: "Kompakt und schnell. Aber SEO-technisch begrenzt.", tr: "Sade ve hızlı. Ancak SEO için sınırlı." },
  "onboarding.step4a.onepage.warning": { en: "⚠ Single page makes ranking by city and service harder.", de: "⚠ Eine einzelne Seite erschwert das Ranking nach Stadt und Rechtsgebiet.", tr: "⚠ Tek sayfa, Google'da şehir ve hizmet bazlı sıralamayı zorlaştırır." },
  
  "onboarding.step4a.multipage.title": { en: "Multi-Page", de: "Mehrseitige Website", tr: "Çok sayfalık site" },
  "onboarding.step4a.multipage.sub": { en: "Separate page for each service and city. Ideal for SEO.", de: "Eigene Seite für jede Leistung und Stadt. Ideal für SEO.", tr: "Google arama görünürlüğü için ideal" },
  "onboarding.step4a.multipage.recommended": { en: "✓ Recommended for SEO", de: "✓ Für SEO empfohlen", tr: "✓ SEO için önerilen" },

  // 4b - Architecture
  "onboarding.step4b.onepage.q": { en: "Which sections should this page contain?", de: "Welche Abschnitte soll diese Seite enthalten?", tr: "Bu sayfada hangi bölümler olsun?" },
  "onboarding.step4b.multipage.q": { en: "Which pages should the website have?", de: "Welche Seiten soll die Website haben?", tr: "Hangi sayfalar olsun?" },
  
  // Arch Options
  "onboarding.arch.home": { en: "Home", de: "Startseite", tr: "Ana Sayfa" },
  "onboarding.arch.services": { en: "Services / Practice Areas", de: "Hizmetler / Rechtsgebiete", tr: "Hizmetler / Uzmanlık Alanları" },
  "onboarding.arch.about": { en: "About Me / Company", de: "Über mich / Unternehmen", tr: "Hakkımda / Şirket" },
  "onboarding.arch.why": { en: "Why me?", de: "Warum ich?", tr: "Neden ben?" },
  "onboarding.arch.references": { en: "References / Cases", de: "Referenzen / Fälle", tr: "Referanslar / Başarı Hikayeleri" },
  "onboarding.arch.contact": { en: "Contact", de: "Kontakt", tr: "İletişim" },
  "onboarding.arch.faq": { en: "FAQ", de: "SSS / Häufige Fragen", tr: "SSS / Sıkça Sorulan Sorular" },
  "onboarding.arch.blog": { en: "Blog / Articles", de: "Blog / Makaleler", tr: "Blog / Makaleler" },
  "onboarding.arch.cities": { en: "City Pages", de: "Stadtseiten", tr: "Şehir sayfaları" },

  // 4c - Extras
  "onboarding.step4c.q": { en: "What else do you need?", de: "Was benötigen Sie darüber hinaus?", tr: "Bunların dışında ihtiyacınız olan şeyler?" },
  "onboarding.extra.logo.title": { en: "Logo & Brand Design", de: "Logo & Markendesign", tr: "Logo & Marka Tasarımı" },
  "onboarding.extra.logo.sub": { en: "We design it from scratch", de: "Wir gestalten es von Grund auf", tr: "Sıfırdan tasarlıyoruz" },
  
  "onboarding.extra.copy.title": { en: "Page Content", de: "Seitentexte", tr: "Sayfa Metinleri" },
  "onboarding.extra.copy.sub": { en: "We write it on your behalf", de: "Wir schreiben für Sie", tr: "Sizin adınıza biz yazıyoruz" },
  
  "onboarding.extra.whatsapp.title": { en: "WhatsApp Integration", de: "WhatsApp-Integration", tr: "WhatsApp Entegrasyonu" },
  "onboarding.extra.whatsapp.sub": { en: "Visitors can message you directly", de: "Besucher schreiben Ihnen direkt", tr: "Ziyaretçiler size direkt yazabilsin" },
  
  "onboarding.extra.appointment.title": { en: "Calendly Integration", de: "Calendly-Integration", tr: "Calendly Entegrasyonu" },
  "onboarding.extra.appointment.sub": { en: "Clients book, you confirm", de: "Klienten buchen, Sie bestätigen", tr: "Danışanlar randevu alsın, siz onaylayın" },
  
  "onboarding.extra.analytics.title": { en: "Google Analytics", de: "Google Analytics", tr: "Google Analytics" },
  "onboarding.extra.analytics.sub": { en: "See how many visitors your site has", de: "Sehen Sie, wie viele Besucher Ihre Seite hat", tr: "Sitenizi kaç kişinin ziyaret ettiğini görün" },
  
  "onboarding.extra.social.title": { en: "Social Media Linking", de: "Social-Media-Verlinkung", tr: "Sosyal Medya Bağlantısı" },
  "onboarding.extra.social.sub": { en: "Add Instagram & LinkedIn to your site", de: "Instagram & LinkedIn auf Ihrer Website", tr: "Instagram, LinkedIn profillerinizi sitenize ekleyelim" },

  // 4d - Existing
  "onboarding.step4d.q": { en: "Do you already have a website?", de: "Haben Sie bereits eine Website?", tr: "Mevcut bir web siteniz var mı?" },
  "onboarding.step4d.url": { en: "Website URL", de: "Website-URL", tr: "Web sitesi adresiniz" },
  "onboarding.step4d.dislikes": { en: "What are your pain points?", de: "Was gefällt Ihnen nicht?", tr: "Neleri beğenmiyorsunuz?" },
  "onboarding.step4d.dislikes.placeholder": { en: "e.g. outdated design, hard to manage...", de: "z.B. Design veraltet, schwer zu pflegen...", tr: "Örn: tasarımı eski, yönetmesi zor..." },

  // Step 5 - SEO Details
  "onboarding.step5.title": { en: "Your Google presence.", de: "Ihre Google-Präsenz.", tr: "Google varlığınız." },
  "onboarding.step5.sub": { en: "Help us understand your current status.", de: "Helfen Sie uns, Ihren aktuellen Stand zu verstehen.", tr: "Mevcut durumu anlayalım." },
  "onboarding.step5.q1": { en: "Are you visible on Google Maps?", de: "Sind Sie bei Google Maps sichtbar?", tr: "Google Maps'te görünüyor musunuz?" },
  "onboarding.step5.q2": { en: "Has SEO work been done before?", de: "Wurden bereits SEO-Maßnahmen durchgeführt?", tr: "Daha önce SEO çalışması yapıldı mı?" },
  "onboarding.step5.q3": { en: "In which cities do you want to be visible?", de: "In welchen Städten möchten Sie gefunden werden?", tr: "Hangi şehirlerde görünmek istiyorsunuz?" },

  // Step 6 - Target Audience
  "onboarding.step6.title": { en: "Your target audience.", de: "Ihre Zielgruppe.", tr: "Hedef müşteriniz." },
  "onboarding.step6.sub": { en: "Who are you targeting?", de: "Wen möchten Sie ansprechen?", tr: "Kimi hedefliyorsunuz?" },
  "onboarding.step6.q1": { en: "Who is your primary clientele?", de: "Wer ist Ihre primäre Klientel?", tr: "Öncelikli müşteri kitleniz?" },
  "onboarding.step6.q2": { en: "What creates trust with your clients?", de: "Was schafft Vertrauen bei Ihren Klienten?", tr: "Danışanlarınızın size güvenmesini ne sağlıyor?" },
  "onboarding.step6.q3": { en: "Languages for the website?", de: "Sprachen für die Website?", tr: "Web sitesi dilleri?" },

  // Step 7 - Design Preferences
  "onboarding.step7.title": { en: "Your design preferences.", de: "Ihre Designpräferenzen.", tr: "Tasarım tercihiniz." },
  "onboarding.step7.sub": { en: "How do you want your site to feel?", de: "Welches Gefühl soll Ihre Website vermitteln?", tr: "Sitenizin nasıl hissettirmesini istiyorsunuz?" },
  "onboarding.step7.q1": { en: "Which style do you prefer?", de: "Welchen Stil bevorzugen Sie?", tr: "Hangi tarzı tercih edersiniz?" },
  "onboarding.step7.q2": { en: "Tone: How formal?", de: "Ton: Wie formell?", tr: "Ton: Ne kadar resmi?" },
  "onboarding.step7.q2.left": { en: "Personal", de: "Persönlich", tr: "Samimi" },
  "onboarding.step7.q2.right": { en: "Formal", de: "Formell", tr: "Resmi" },
  "onboarding.step7.q3": { en: "Any color preferences?", de: "Haben Sie Farbpräferenzen?", tr: "Renk tercihi var mı?" },
  "onboarding.step7.q3.studio_choice": { en: "I leave the decision to you.", de: "Ich überlasse die Entscheidung Ihnen.", tr: "Bu kararı size bırakıyorum." },
  "onboarding.step7.q4": { en: "Any websites you like?", de: "Gibt es Websites, die Ihnen gefallen?", tr: "Beğendiğiniz siteler var mı?" },

  // Step 8 - Final Details
  "onboarding.step8.title": { en: "A few last things.", de: "Noch ein paar Details.", tr: "Son birkaç şey." },
  "onboarding.step8.sub": { en: "Almost done.", de: "Fast geschafft.", tr: "Neredeyse bitti." },
  "onboarding.step8.q1": { en: "Do you already have a domain?", de: "Haben Sie bereits eine Domain?", tr: "Domain'iniz var mı?" },
  "onboarding.step8.q1.yes": { en: "Yes, I have one", de: "Ja, ich habe eine", tr: "Evet, var" },
  "onboarding.step8.q1.no": { en: "No, not yet", de: "Nein, noch nicht", tr: "Hayır, henüz yok" },
  "onboarding.step8.q1.help": { en: "I need help", de: "Ich brauche Hilfe", tr: "Yardım istiyorum" },
  "onboarding.step8.q2": { en: "Desired delivery date", de: "Gewünschtes Fertigstellungsdatum", tr: "İstenen teslim tarihi" },
  "onboarding.step8.q4": { en: "Anything else you'd like to add?", de: "Gibt es etwas Besonderes?", tr: "Eklemek istediğiniz bir şey var mı?" },

  // Onboarding Results
  "onboarding.results.title": { en: "The perfect package for you.", de: "Das passende Paket für Sie.", tr: "Sizin için en uygun paket." },
  "onboarding.results.sub": { en: "Based on your answers, here is our recommendation.", de: "Basierend auf Ihren Antworten empfehlen wir Folgendes.", tr: "Verdiğiniz cevaplara göre önerimiz bu." },
  "onboarding.results.contact": { en: "The nüll team will contact you shortly.", de: "Das nüll-Team wird sich in Kürze bei Ihnen melden.", tr: "nüll ekibi yakında sizinle iletişime geçecek." },

  "onboarding.success.title": { en: "Great! We're ready.", de: "Großartig! Wir sind bereit.", tr: "Harika! Hazırız." },
  "onboarding.success.sub": { en: "Your data has reached our team. We will share a custom roadmap for your project within 24 hours.", de: "Ihre Daten sind bei unserem Team eingegangen. Wir werden innerhalb von 24 Stunden eine individuelle Roadmap für Ihr Projekt mit Ihnen teilen.", tr: "Verileriniz ekibimize ulaştı. 24 saat içinde projenize özel yol haritasını sizinle paylaşacağız." },
  "onboarding.success.roadmap": { en: "Your roadmap is being prepared", de: "Ihre Roadmap wird vorbereitet", tr: "Yol haritanız hazırlanıyor" },
  "onboarding.success.thanks": { en: "Thanks for choosing nüll", de: "Vielen Dank, dass Sie sich für nüll entschieden haben", tr: "nüll'ü seçtiğiniz için teşekkürler" },

  // Lead Capture / Get a Quote
  "quote.teaser.label": { en: "CUSTOM SOLUTION", de: "INDIVIDUELLE LÖSUNG", tr: "ÖZEL ÇÖZÜM" },
  "quote.teaser.title": { 
    en: "Find your perfect price\nin 60 seconds.", 
    de: "Ihr Paket & Preis.\nIn nur 60 Sekunden.", 
    tr: "Paketiniz ve fiyatınız.\nSadece 60 saniyede." 
  },
  "quote.teaser.desc": {
    en: "Every business is unique. Take 60 seconds to tell us about yours and get a precise recommendation.",
    de: "Jedes Unternehmen ist einzigartig. Nehmen Sie sich 60 Sekunden Zeit und erhalten Sie eine präzise Empfehlung.",
    tr: "Her işletme eşsizdir. 60 saniyenizi ayırın ve size özel önerimizi alın."
  },
  "quote.teaser.cta": { en: "Get a precise quote", de: "Präzises Angebot erhalten", tr: "Net teklif al" },

  "quote.step.identity.title": { en: "Who are we speaking with?", de: "Mit wem sprechen wir?", tr: "Kiminle görüşüyoruz?" },
  "quote.step.identity.sub": { en: "Your basic contact details.", de: "Ihre Basis-Kontaktdaten.", tr: "Temel iletişim bilgileriniz." },
  
  "quote.step.objective.title": { en: "What's the goal?", de: "Was ist das Ziel?", tr: "Hedef nedir?" },
  "quote.step.objective.web": { en: "New Professional Website", de: "Neue professionelle Website", tr: "Yeni profesyonel web sitesi" },
  "quote.step.objective.seo": { en: "Google visibility (SEO)", de: "Google Sichtbarkeit (SEO)", tr: "Google Görünürlüğü (SEO)" },
  "quote.step.objective.ads": { en: "Google Ads Management", de: "Google Ads Kampagnen-Management", tr: "Google Ads Kampanya Yönetimi" },
  "quote.step.objective.system": { en: "Full Digital Lead System", de: "Digitales Lead-System", tr: "Dijital Talep Sistemi" },
  
  "quote.result.setup": { en: "Setup Investment", de: "Einmalige Investition", tr: "Başlangıç Yatırımı" },
  "quote.result.monthly": { en: "per month", de: "pro Monat", tr: "aylık" },
  "quote.result.including": { en: "Including:", de: "Inklusive:", tr: "Dahil olanlar:" },

  "quote.step.scale.title": { en: "Tell us about your business.", de: "Erzählen Sie uns von Ihrem Unternehmen.", tr: "İşletmenizden bahsedin." },
  "quote.step.scale.single": { en: "Individual Consultant", de: "Einzelberater", tr: "Bireysel Danışman" },
  "quote.step.scale.small": { en: "Small Team (2-5 Experts)", de: "Kleines Team (2-5 Experten)", tr: "Küçük Ekip (2-5 Uzman)" },
  "quote.step.scale.large": { en: "Consulting Group / Firm", de: "Beratungshaus / Unternehmen", tr: "Danışmanlık Firması / Şirket" },

  "quote.step.presence.title": { en: "Current Status.", de: "Aktueller Stand.", tr: "Mevcut Durum." },
  "quote.step.presence.url": { en: "Current Website URL (if any)", de: "Aktuelle Website-URL (falls vorhanden)", tr: "Mevcut web sitesi adresi (varsa)" },
  "quote.step.presence.pain": { en: "What is your biggest challenge?", de: "Was ist Ihre größte Herausforderung?", tr: "En büyük zorluğunuz nedir?" },
  "quote.step.presence.pain.placeholder": { en: "e.g. No leads, outdated look...", de: "z.B. Keine Anfragen, veraltetes Design...", tr: "Örn: talep gelmiyor, tasarımı eski..." },

  "quote.result.title": { en: "Your Personalized Foundation.", de: "Ihr individuelles Fundament.", tr: "Size özel temel yapınız." },
  "quote.result.estimate": {
    en: "Estimated total investment for your firm:",
    de: "Voraussichtliche Investition für Ihr Unternehmen:",
    tr: "İşletmeniz için tahmini toplam yatırım:"
  },
  "quote.result.finalNote": { 
    en: "This is a base estimate based on your goals. We provide a final binding offer during our initial strategy call.", 
    de: "Dies ist eine erste Einschätzung basierend auf Ihren Zielen. Ein verbindliches Angebot erhalten Sie nach unserem Erstgespräch.", 
    tr: "Bu, hedeflerinize dayalı temel bir tahmindir. Kesin teklifimizi strateji görüşmemizde sunacağız." 
  },
  "quote.result.callback": { 
    en: "Our expert will call you within 24 hours.", 
    de: "Unser Experte wird Sie innerhalb von 24 Stunden anrufen.", 
    tr: "Uzmanımız 24 saat içinde sizi arayacak." 
  },
  "quote.result.orContact": { en: "Or contact us directly:", de: "Oder kontaktieren Sie uns direkt:", tr: "Veya doğrudan iletişime geçin:" },
  "quote.result.whatsapp": { en: "Chat on WhatsApp", de: "WhatsApp-Chat", tr: "WhatsApp'tan Yazın" },
  "quote.result.calendly": { en: "Schedule a Call", de: "Gespräch buchen", tr: "Görüşme Ayarla" },
  "quote.result.email": { en: "Send an Email", de: "E-Mail senden", tr: "E-posta Gönder" },

  "onboarding.common.next": { en: "Continue", de: "Weiter", tr: "Devam Et" },
  "onboarding.common.back": { en: "Back", de: "Zurück", tr: "Geri" },
};

export function t(key: string, lang: Language): string {
  return labels[key]?.[lang] ?? labels[key]?.["de"] ?? key;
}