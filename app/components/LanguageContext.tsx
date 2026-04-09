import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type Language = "en" | "de" | "tr";

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
}>({ lang: "de", setLang: () => { } });

// Cookie Helpers for Bulletproof Persistence
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("de");
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with cookies/localStorage on mount
  useEffect(() => {
    const saved = (getCookie("nll_lang") || localStorage.getItem("nll_lang")) as Language;
    if (saved && (saved === "en" || saved === "de" || saved === "tr")) {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
    setIsHydrated(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    // Persist everywhere
    setCookie("nll_lang", newLang, 365);
    localStorage.setItem("nll_lang", newLang);
    
    // Immediate DOM update
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
    }
    
    console.log("Language updated to:", newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div 
        data-lang={lang} 
        style={{ 
          opacity: isHydrated ? 1 : 1, 
          transition: "opacity 0.2s ease" 
        }}
      >
        {children}
      </div>
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
    en: "Web design & positioning for lawyers", 
    de: "Webdesign & Positionierung für Rechtsanwälte", 
    tr: "Avukatlar için web tasarımı ve konumlandırma" 
  },
  "hero.line1": { 
    en: "Clients are searching.", 
    de: "Mandanten suchen.", 
    tr: "Müvekkiller avukat arıyor." 
  },
  "hero.line2": { 
    en: "Your firm is the answer.", 
    de: "Ihre Kanzlei ist die Antwort.", 
    tr: "Büronuz cevap olmalı." 
  },
  "hero.description": {
    en: "We build digital presences for Turkish-German lawyers in Germany so you get found, earn trust, and win the right clients. Whether you have no website yet or one that isn't working: we make your firm the first choice.",
    de: "Wir schaffen digitale Präsenz für deutsch-türkische Rechtsanwälte in Deutschland, damit Sie gefunden werden, Vertrauen aufbauen und die richtigen Mandanten gewinnen. Ob Sie noch keine Website haben oder eine, die nicht funktioniert, wir machen Ihre Kanzlei zur ersten Wahl.",
    tr: "Almanya'daki Türk-Alman avukatlar için dijital varlık oluşturuyoruz. Bulunmanız, güven kazanmanız ve doğru müvekkilleri çekmeniz için. Henüz bir web siteniz yoksa ya da işe yaramayanı varsa: Büronuzu ilk tercih haline getiriyoruz.",
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
  "hero.card1.label": { en: "Law firm website", de: "Kanzlei-Website", tr: "Hukuk bürosu sitesi" },
  "hero.card1.value": { en: "4 completed", de: "4 fertiggestellt", tr: "4 tamamlandı" },
  "hero.card1.sub": { en: "built with a real lawyer", de: "mit einem echten Anwalt entwickelt", tr: "gerçek bir avukatla geliştirildi" },

  "hero.card2.label": { en: "Design", de: "Design", tr: "Tasarım" },
  "hero.card2.value": { en: "Fully responsive", de: "Vollständig responsiv", tr: "Tam uyumlu" },
  "hero.card2.sub": { en: "looks great on every device", de: "auf jedem Gerät perfekt", tr: "her cihazda kusursuz görünüm" },

  "hero.card3.label": { en: "SEO", de: "SEO", tr: "SEO" },
  "hero.card3.value": { en: "Foundation in place", de: "Grundlage gelegt", tr: "Altyapı kuruldu" },
  "hero.card3.sub": { en: "results on the way", de: "Ergebnisse folgen", tr: "sonuçlar yolda" },

  "hero.trustBar": {
    en: "Already trusted by lawyers in Germany. Every website built to win clients, not just look good.",
    de: "Bereits von Rechtsanwälten in Deutschland vertraut. Jede Website gebaut, um Mandanten zu gewinnen, nicht nur um zu beeindrucken.",
    tr: "Almanya'daki avukatlar tarafından tercih ediliyoruz. Her web sitesi, sadece iyi görünmek için değil, müvekkil kazanmak için tasarlandı.",
  },
  "hero.comparison.label": {
    en: "Digital Transformation",
    de: "Digitale Transformation",
    tr: "Dijital Dönüşüm",
  },
  "hero.comparison.title": {
    en: "This is what a law firm that wins trust looks like.",
    de: "So sieht eine Kanzlei aus, die überzeugt.",
    tr: "Güven kazanan bir hukuk bürosu böyle görünür.",
  },
  "hero.comparison.subtitle": {
    en: "Every detail designed to build trust and win clients.",
    de: "Jedes Detail darauf ausgelegt, Vertrauen zu schaffen und Mandanten zu gewinnen.",
    tr: "Her detay, güven oluşturmak ve müvekkil kazanmak için tasarlanmıştır.",
  },
  "problem.header": {
    en: "Most law firms lose clients before they ever speak to them.",
    de: "Die meisten Kanzleien verlieren Mandanten, bevor sie überhaupt sprechen.",
    tr: "Çoğu hukuk bürosu, henüz konuşmadan müvekkil kaybediyor.",
  },
  "problem.subHeader": {
    en: "Not because they are bad lawyers. But because they don't exist online.",
    de: "Nicht weil sie schlechte Anwälte sind. Sondern weil sie online nicht existieren.",
    tr: "Kötü avukat oldukları için değil. Çevrimiçi var olmadıkları için.",
  },
  "problem.p1": {
    en: "Someone is searching for a lawyer in your city right now. They type into Google. They find your competition. Not you.",
    de: "Jemand sucht gerade nach einem Anwalt in Ihrer Stadt. Er tippt bei Google. Er findet Ihre Konkurrenz. Nicht Sie.",
    tr: "Şu an birileri bulunduğunuz şehirde avukat arıyor. Google'a yazıyor. Rakiplerinizi buluyor. Sizi değil.",
  },
  "problem.p2": {
    en: "Your website exists, but it looks outdated. First impressions matter — and right now your first impression is costing you clients.",
    de: "Ihre Website existiert, aber sie wirkt veraltet. Der erste Eindruck zählt — und der erste Eindruck kostet Sie Mandanten.",
    tr: "Web siteniz var ama eski görünüyor. İlk izlenim önemlidir ve şu an bu izlenim size müvekkil kaybettiriyor.",
  },
  "problem.p3": {
    en: "You have no website. The lawyer down the street does. And they are getting the enquiries that should be yours.",
    de: "Sie haben keine Website. Ihr Nachbar, der auch Anwalt ist, schon. Und er bekommt die Anfragen, die eigentlich Ihnen gehören sollten.",
    tr: "Web siteniz yok. Yakınınızdaki avukatın var. Ve size gelmesi gereken talepler ona gidiyor.",
  },
  "problem.turn": {
    en: "It doesn't have to stay this way. And it's easier to change than you think.",
    de: "Das muss nicht so bleiben. Und es ist einfacher zu ändern, als Sie denken.",
    tr: "Böyle kalmak zorunda değil. Ve değiştirmek düşündüğünüzden çok daha kolay.",
  },

  "services.label": { en: "Services", de: "Leistungen", tr: "Hizmetler" },
  "services.title1": {
    en: "Everything your law firm",
    de: "Alles, was Ihre Kanzlei",
    tr: "Büronuzun çevrimiçi",
  },
  "services.title2": {
    en: "needs online.",
    de: "online braucht.",
    tr: "ihtiyacı olan her şey.",
  },
  "services.description": {
    en: "We take care of your entire digital presence so you can focus on what you do best: representing your clients.",
    de: "Wir kümmern uns um Ihre gesamte digitale Präsenz, damit Sie sich auf das konzentrieren können, was Sie am besten können: Ihre Mandanten vertreten.",
    tr: "Tüm dijital varlığınızla biz ilgileniyoruz, siz en iyi yaptığınıza odaklanın: müvekkillerinizi temsil etmek.",
  },
  "services.webdesign": { en: "Law firm website", de: "Kanzlei-Website", tr: "Hukuk bürosu sitesi" },
  "services.webdesign.desc": {
    en: "A website that shows your expertise and convinces clients. No templates. No compromises. Built for lawyers.",
    de: "Eine Website, die Ihre Expertise zeigt und Mandanten überzeugt. Kein Template. Kein Kompromiss. Gebaut für Rechtsanwälte.",
    tr: "Uzmanlığınızı gösteren ve müvekkilleri ikna eden bir web sitesi. Şablon yok. Taviz yok. Avukatlar için tasarlandı.",
  },
  "services.development": { en: "Technical development", de: "Technische Umsetzung", tr: "Teknik geliştirme" },
  "services.development.desc": {
    en: "Fast, secure and perfect on every device. Your website runs reliably so you don't have to think about it.",
    de: "Schnell, sicher und auf allen Geräten perfekt. Ihre Website läuft zuverlässig — damit Sie es nicht müssen.",
    tr: "Hızlı, güvenli ve her cihazda kusursuz. Web siteniz güvenilir çalışır, siz düşünmek zorunda kalmazsınız.",
  },
  "services.seo": { en: "Google visibility", de: "Google-Sichtbarkeit", tr: "Google görünürlüğü" },
  "services.seo.desc": {
    en: "When someone in your city searches for a lawyer, they should find you. We make sure Google recommends your firm.",
    de: "Wenn jemand in Ihrer Stadt nach einem Anwalt sucht, soll er Sie finden. Wir sorgen dafür, dass Google Ihre Kanzlei empfiehlt.",
    tr: "Şehrinizde biri avukat aradığında sizi bulsun. Google'ın büronuzu önermesini sağlıyoruz.",
  },
  "services.seo.upsell": {
    en: "Add-on from €170/mo",
    de: "Option ab €170/Monat",
    tr: "Ek seçenek €170/ay'dan",
  },
  "services.branding": { en: "Brand identity", de: "Markenidentität", tr: "Marka kimliği" },
  "services.branding.desc": {
    en: "Logo, colours and visual presence that set your firm apart. Professionalism that is visible at first glance.",
    de: "Logo, Farben und Auftritt, die Ihre Kanzlei von anderen unterscheiden. Professionalität, die man sofort sieht.",
    tr: "Büronuzu diğerlerinden ayıran logo, renkler ve görsel kimlik. İlk bakışta fark edilen profesyonellik.",
  },
  "services.maintenance": { en: "Monthly care", de: "Monatliche Kanzlei-Betreuung", tr: "Aylık bakım" },
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
    en: "A bilingual law firm website for a Mannheim lawyer with ties to Ankara. We developed his brand identity, sharpened his message and built a website that radiates authority and convinces clients.",
    de: "Eine zweisprachige Kanzlei-Website für einen Mannheimer Rechtsanwalt mit Verbindungen nach Ankara. Wir haben seine Markenidentität entwickelt, seine Botschaft geschärft und eine Website gebaut, die Autorität ausstrahlt und Mandanten überzeugt.",
    tr: "Mannheim'da faaliyet gösteren avukat Hasan Doğru, hem Alman hem de Türk müvekkillere hitap eden güçlü bir dijital kimlik istiyordu. Marka kimliğinden web sitesine kadar her detayı birlikte geliştirdik. Sonuç: İki dilde güven veren, kararlı ve özgün bir Kanzlei.",
  },
  "work.besir.category": { en: "Consultant · Personal Brand & Web Design", de: "Berater · Personal Branding & Webdesign", tr: "Danışman · Kişisel Marka & Web Tasarım" },
  "work.besir.desc": {
    en: "Positioning and branding for a finance and insurance consultant looking to build an online presence. We crafted his message, designed his brand identity, and built a site that establishes authority and trust.",
    de: "Positionierung und Markenaufbau für einen Finanz- und Versicherungsberater, der seine Online-Präsenz stärken möchte. Wir haben seine Botschaft geschärft, seine Markenidentität entwickelt und eine Website erstellt, die Autorität und Vertrauen vermittelt.",
    tr: "Online varlığını güçlendirmek isteyen bir finans ve sigorta danışmanı için konumlandırma ve marka çalışması. Mesajını netleştirdik, marka kimliğini oluşturduk ve otorite ile güven sağlayan bir web sitesi geliştirdik.",
  },

  // Pricing
  "pricing.label": { en: "Pricing", de: "Preise", tr: "Fiyatlar" },
  "pricing.title1": {
    en: "Full clarity",
    de: "Volle Klarheit",
    tr: "Baştan tam",
  },
  "pricing.title2": {
    en: "from the start.",
    de: "von Anfang an.",
    tr: "netlik.",
  },
  "pricing.description": {
    en: "Choose the package that fits your law firm. Monthly care is included in every package.",
    de: "Wählen Sie das Paket, das zu Ihrer Kanzlei passt. Monatliche Betreuung ist in jedem Paket enthalten.",
    tr: "Büronuza uygun paketi seçin. Aylık bakım her pakete dahildir.",
  },
  "pricing.tab.websites": { en: "Website Packages", de: "Website-Pakete", tr: "Web Sitesi Paketleri" },
  "pricing.tab.retainer": { en: "Monthly Retainer", de: "Monatliche Betreuung", tr: "Aylık Bakım" },

  // TAB 1: WEBSITES
  "pricing.starter": { en: "STARTER", de: "STARTER", tr: "STARTER" },
  "pricing.starter.desc": {
    en: "A fast start with a solid foundation.",
    de: "Ein schneller Start mit solidem Fundament.",
    tr: "Sağlam bir temel ile hızlı başlangıç.",
  },
  "pricing.starter.f1": { en: "One page, perfect on all devices", de: "Eine Seite, auf allen Geräten perfekt", tr: "Tüm cihazlarda kusursuz tek sayfa" },
  "pricing.starter.f2": { en: "Individual design", de: "Individuelles Design", tr: "Bireysel tasarım" },
  "pricing.starter.f3": { en: "Basic SEO setup", de: "Grundlegende SEO-Einrichtung", tr: "Temel SEO kurulumu" },
  "pricing.starter.f4": { en: "Contact form integration", de: "Kontaktformular-Integration", tr: "İletişim formu entegrasyonu" },
  "pricing.starter.f5": { en: "1 revision round", de: "1 Korrekturrunde", tr: "1 revizyon turu" },

  "pricing.growth": { en: "GROWTH", de: "GROWTH", tr: "GROWTH" },
  "pricing.growth.badge": { en: "MOST POPULAR", de: "MEISTGEWÄHLT", tr: "EN POPÜLER" },
  "pricing.growth.desc": {
    en: "A website that wins clients and gets found on Google.",
    de: "Eine Website, die Mandanten gewinnt und bei Google gefunden wird.",
    tr: "Müvekkil kazanan ve Google'da bulunan bir web sitesi.",
  },
  "pricing.growth.f1": { en: "Up to 5 pages", de: "Bis zu 5 Seiten", tr: "5 sayfaya kadar" },
  "pricing.growth.f2": { en: "Individual design", de: "Individuelles Design", tr: "Bireysel tasarım" },
  "pricing.growth.f3": { en: "Comprehensive on-page SEO", de: "Umfassendes On-Page SEO", tr: "Kapsamlı sayfa içi SEO" },
  "pricing.growth.f4": { en: "Blog and news section", de: "Blog- und Newsbereich", tr: "Blog ve haber bölümü" },
  "pricing.growth.f5": { en: "Social media integration", de: "Social-Media-Integration", tr: "Sosyal medya entegrasyonu" },
  "pricing.growth.f6": { en: "Basic branding package", de: "Basis-Branding-Paket", tr: "Temel markalaşma paketi" },
  "pricing.growth.f7": { en: "3 revision rounds", de: "3 Korrekturrunden", tr: "3 revizyon turu" },

  "pricing.premium": { en: "PREMIUM", de: "PREMIUM", tr: "PREMIUM" },
  "pricing.premium.desc": {
    en: "For law firms that want to stay one step ahead of their competition.",
    de: "Für Kanzleien, die ihrer Konkurrenz einen Schritt voraus sein wollen.",
    tr: "Rakiplerinin bir adım önünde olmak isteyen bürolar için.",
  },
  "pricing.premium.f1": { en: "Up to 10 pages", de: "Bis zu 10 Seiten", tr: "10 sayfaya kadar" },
  "pricing.premium.f2": { en: "Premium design", de: "Premium-Design", tr: "Premium tasarım" },
  "pricing.premium.f3": { en: "Full SEO strategy", de: "Vollständige SEO-Strategie", tr: "Tam SEO stratejisi" },
  "pricing.premium.f4": { en: "Logo and brand identity", de: "Logo und Markenidentität", tr: "Logo ve marka kimliği" },
  "pricing.premium.f5": { en: "Copywriting support", de: "Unterstützung beim Texten", tr: "Metin yazarlığı desteği" },
  "pricing.premium.f6": { en: "Analytics setup", de: "Analytics-Einrichtung", tr: "Analitik kurulumu" },
  "pricing.premium.f7": { en: "Priority support 30 days", de: "Priorisierter Support 30 Tage", tr: "30 gün öncelikli destek" },
  "pricing.premium.f8": { en: "Unlimited revisions", de: "Unbegrenzte Korrekturen", tr: "Sınırsız revizyon" },

  "pricing.includedRetainer": {
    en: "Incl. €99/month law firm care",
    de: "Inkl. €99/Monat Kanzlei-Betreuung",
    tr: "Aylık €99 büro bakımı dahil",
  },
  "pricing.cta.start": { en: "Get started", de: "Jetzt starten", tr: "Hemen başlayın" },

  // TAB 2: RETAINER
  "pricing.retainer.intro": {
    en: "Already included in your package: €99/month basic care. Want more? Upgrade at any time.",
    de: "Bereits in Ihrem Paket enthalten: €99/Monat Basis-Betreuung. Möchten Sie mehr? Upgraden Sie jederzeit.",
    tr: "Her paketimize aylık €99 temel bakım dahildir. Daha fazla büyümek istiyorsanız, istediğiniz zaman bir üst pakete geçebilirsiniz.",
  },
  "pricing.retainer.seo": { en: "SEO & CARE", de: "SEO & PFLEGE", tr: "SEO & BAKIM" },
  "pricing.retainer.seo.badge": { en: "RECOMMENDED", de: "EMPFOHLEN", tr: "TAVSİYE EDİLEN" },
  "pricing.retainer.seo.desc": {
    en: "Your law firm grows in Google search results every month.",
    de: "Ihre Kanzlei wächst jeden Monat in den Google-Suchergebnissen.",
    tr: "Büronuz her ay Google'da biraz daha yukarı çıksın.",
  },
  "pricing.retainer.seo.f1": { en: "2 SEO blog articles per month", de: "2 SEO-Blogartikel pro Monat", tr: "Ayda 2 SEO odaklı blog yazısı" },
  "pricing.retainer.seo.f2": { en: "Keyword research for practice areas", de: "Keyword-Recherche für Ihre Rechtsgebiete", tr: "Hukuk alanınıza özel anahtar kelime çalışması" },
  "pricing.retainer.seo.f3": { en: "In German, Turkish or both", de: "Auf Deutsch, Türkisch oder beides", tr: "Almanca, Türkçe veya her ikisi" },
  "pricing.retainer.seo.f4": { en: "Technical SEO maintenance", de: "Technische SEO-Pflege", tr: "Teknik SEO takibi" },
  "pricing.retainer.seo.f5": { en: "Monthly progress report", de: "Monatlicher Fortschrittsbericht", tr: "Aylık gelişim raporu" },
  "pricing.retainer.seo.priceSuffix": { en: "/month", de: "/Monat", tr: "/ay" },

  "pricing.retainer.growth": { en: "GROWTH PACKAGE", de: "WACHSTUMS-PAKET", tr: "BÜYÜME PAKETİ" },
  "pricing.retainer.growth.desc": {
    en: "SEO plus new landing pages that actively win clients for your practice areas.",
    de: "SEO plus neue Landingpages, die gezielt Mandanten für Ihre Rechtsgebiete gewinnen.",
    tr: "SEO çalışmasına ek olarak, her ay yeni bir sayfa ile büronuzun online varlığını genişletin.",
  },
  "pricing.retainer.growth.f1": { en: "Everything in SEO & care", de: "Alles aus SEO & Pflege", tr: "SEO & Bakım paketindeki her şey" },
  "pricing.retainer.growth.f2": { en: "New landing page every month", de: "Monatlich neue Landingpage", tr: "Her ay yeni bir hizmet veya şehir sayfası" },
  "pricing.retainer.growth.f3": { en: "Targeted by practice area or city", de: "Ausgerichteten auf Rechtsgebiet oder Stadt", tr: "Hedef kitleye özel içerik" },
  "pricing.retainer.growth.f4": { en: "Built to rank on Google", de: "Entwickelt um bei Google zu ranken", tr: "Google sıralamalarını doğrudan hedefleyen yapı" },
  "pricing.retainer.growth.f5": { en: "Priority support", de: "Priorisierter Support", tr: "Öncelikli destek" },

  "pricing.retainer.disclaimer": {
    en: "Basic care at €99/month is included in every website package and cannot be booked separately.",
    de: "Basis-Betreuung für €99/Monat ist in jedem Website-Paket enthalten und nicht separat buchbar.",
    tr: "Aylık €99 temel bakım tüm paketlere dahildir ve ayrıca satın alınamaz.",
  },
  "pricing.cta.upgrade": { en: "Upgrade now", de: "Jetzt upgraden", tr: "Şimdi geç" },
  // Contact
  "contact.label": { en: "Contact", de: "Kontakt", tr: "İletişim" },
  "contact.title1": { en: "Let's build something", de: "Lassen Sie uns etwas", tr: "Birlikte" },
  "contact.title2": { en: "remarkable.", de: "Außergewöhnliches schaffen.", tr: "harika bir şey inşa edelim." },
  "contact.description": {
    en: "Tell us about your project, and we'll get back to you within 24 hours with a tailored plan.",
    de: "Erzählen Sie uns von Ihrem Projekt — wir melden uns innerhalb von 24 Stunden mit einem maßgeschneiderten Plan.",
    tr: "Projenizi anlatın — size 24 saat içinde özel bir planla geri dönelim.",
  },
  "contact.location": { en: "Mannheim, Germany", de: "Mannheim, Deutschland", tr: "Mannheim, Almanya" },
  "contact.name": { en: "Name", de: "Name", tr: "İsim" },
  "contact.namePlaceholder": { en: "Your name", de: "Ihr Name", tr: "Adınız" },
  "contact.email": { en: "Email", de: "E-Mail", tr: "E-posta" },
  "contact.emailPlaceholder": { en: "you@company.com", de: "sie@unternehmen.de", tr: "you@company.com" },
  "contact.details": { en: "Project Details", de: "Projektdetails", tr: "Proje Detayları" },
  "contact.detailsPlaceholder": {
    en: "Tell us about your project, goals, and timeline...",
    de: "Erzählen Sie uns von Ihrem Projekt, Ihren Zielen und Ihrem Zeitplan…",
    tr: "Projenizi, hedeflerinizi ve zaman planınızı anlatın…",
  },
  "contact.send": { en: "Send Message", de: "Nachricht senden", tr: "Mesaj Gönder" },
  "contact.sending": { en: "Sending...", de: "Wird gesendet...", tr: "Gönderiliyor..." },
  "contact.sent": { en: "Message sent!", de: "Nachricht gesendet!", tr: "Mesaj gönderildi!" },
  "contact.sentDesc": { en: "We'll be in touch within 24 hours.", de: "Wir melden uns innerhalb von 24 Stunden.", tr: "24 saat içinde size dönüş yapacağız." },
  "contact.error": { en: "Something went wrong. Please try again.", de: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.", tr: "Bir hata oluştu. Lütfen tekrar deneyin." },
  "contact.networkError": { en: "Network error. Please try again.", de: "Netzwerkfehler. Bitte versuchen Sie es erneut.", tr: "Ağ hatası. Lütfen tekrar deneyin." },

  // Footer
  "footer.rights": { en: "All rights reserved.", de: "Alle Rechte vorbehalten.", tr: "Tüm hakları saklıdır." },
};

export function t(key: string, lang: Language): string {
  return labels[key]?.[lang] ?? labels[key]?.["de"] ?? key;
}