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
    tr: "Ankara bağlantılı bir Mannheim avukatı için iki dilli hukuk bürosu web sitesi. Marka kimliğini geliştirdik, mesajını netleştirdik ve otorite yayan, müvekkilleri ikna eden bir web sitesi inşa ettik.",
  },
  "work.besir.category": { en: "Consultant · Personal Brand & Web Design", de: "Berater · Personal Branding & Webdesign", tr: "Danışman · Kişisel Marka & Web Tasarım" },
  "work.besir.desc": {
    en: "Positioning and branding for a finance and insurance consultant looking to build an online presence. We crafted his message, designed his brand identity, and built a site that establishes authority and trust.",
    de: "Positionierung und Markenaufbau für einen Finanz- und Versicherungsberater, der seine Online-Präsenz stärken möchte. Wir haben seine Botschaft geschärft, seine Markenidentität entwickelt und eine Website erstellt, die Autorität und Vertrauen vermittelt.",
    tr: "Online varlığını güçlendirmek isteyen bir finans ve sigorta danışmanı için konumlandırma ve marka çalışması. Mesajını netleştirdik, marka kimliğini oluşturduk ve otorite ile güven sağlayan bir web sitesi geliştirdik.",
  },

  // Pricing
  "pricing.label": { en: "Pricing", de: "Preise", tr: "Fiyatlandırma" },
  "pricing.title1": { en: "Full clarity", de: "Volle Klarheit", tr: "İlk günden itibaren" },
  "pricing.title2": { en: "From day one.", de: "von Anfang an.", tr: "Tam netlik." },
  "pricing.billing.onetime": { en: "Website Creation", de: "Website-Pakete", tr: "Web Tasarım" },
  "pricing.billing.monthly": { en: "Monthly Maintenance Services", de: "Monatliche Betreuung", tr: "Aylık Bakım ve SEO" },
  "pricing.description": {
    en: "Choose the package that fits your stage. Every plan includes a fully responsive, performance-optimized website.",
    de: "Wählen Sie das Paket, das zu Ihrer aktuellen Situation passt. Jedes Paket beinhaltet eine vollständig responsive und performance-optimierte Website.",
    tr: "İşinizin aşamasına en uygun paketi seçin. Tüm paketler tamamen responsive ve performans odaklı web sitesi içerir.",
  },
  "pricing.popular": { en: "Most Popular", de: "Meistgewählt", tr: "En çok tercih edilen" },
  "pricing.starter": { en: "Starter", de: "Starter", tr: "Başlangıç" },
  "pricing.starter.desc": {
    en: "A quick start with a solid foundation.",
    de: "Ein schneller Start mit solidem Fundament.",
    tr: "Hızlı bir başlangıç için sağlam bir temel.",
  },
  "pricing.growth": { en: "Growth", de: "Growth", tr: "Growth" },
  "pricing.growth.desc": {
    en: "A website that wins clients and gets found on Google.",
    de: "Eine website, die Kunden gewinnt und bei Google gefunden wird.",
    tr: "Müşteri kazandıran, Google'da öne çıkan bir site.",
  },
  "pricing.premium": { en: "Premium", de: "Premium", tr: "Premium" },
  "pricing.premium.desc": {
    en: "For those who want to be one step ahead of their competitors.",
    de: "Für alle, die ihren Mitbewerbern einen Schritt voraus sein wollen.",
    tr: "Rakiplerinizin önüne geçmek isteyenler için.",
  },
  "pricing.starter.f1": { en: "One page, perfect on all devices", de: "Eine Seite, auf allen Geräten perfekt", tr: "Tek sayfa, her cihazda düzgün görünen" },
  "pricing.starter.f2": { en: "Individual design", de: "Individuelles Design", tr: "Size özel tasarım" },
  "pricing.starter.f3": { en: "Basic SEO setup", de: "Grundlegende SEO-Einrichtung", tr: "Temel SEO kurulumu" },
  "pricing.starter.f4": { en: "Contact form integration", de: "Kontaktformular-Integration", tr: "İletişim formu entegrasyonu" },
  "pricing.starter.f5": { en: "Mobile-optimized", de: "Für Mobilgeräte optimiert", tr: "Mobil uyumlu" },
  "pricing.starter.f6": { en: "1 round of revisions", de: "1 Korrekturrunde", tr: "1 revizyon hakkı" },
  "pricing.starter.f7": { en: "Live in 5–7 days", de: "In 5–7 Tagen live", tr: "5–7 günde yayında" },
  "pricing.growth.f1": { en: "Up to 5-page website", de: "Bis zu 5 Seiten", tr: "5 sayfaya kadar" },
  "pricing.growth.f2": { en: "Fully custom design", de: "Individuelles Design", tr: "Size özel tasarım" },
  "pricing.growth.f3": { en: "Comprehensive On-Page SEO", de: "Umfassendes On-Page SEO", tr: "Kapsamlı sayfa içi SEO" },
  "pricing.growth.f4": { en: "Blog and news area", de: "Blog- und Newsbereich", tr: "Blog ve haber alanı" },
  "pricing.growth.f5": { en: "Social media integration", de: "Social-Media-Integration", tr: "Sosyal medya bağlantıları" },
  "pricing.growth.f6": { en: "Basic branding package", de: "Basis-Branding-Paket", tr: "Marka kimliği temeli" },
  "pricing.growth.f7": { en: "3 rounds of revisions", de: "3 Korrekturrunden", tr: "3 kez revizyon" },
  "pricing.growth.f8": { en: "Live in 7–10 days", de: "In 7–10 Tagen live", tr: "7–10 günde yayında" },
  "pricing.premium.f1": { en: "Up to 10-page website", de: "Bis zu 10 Seiten", tr: "10 sayfaya kadar" },
  "pricing.premium.f2": { en: "Premium custom design", de: "Premium-Design", tr: "Premium tasarım" },
  "pricing.premium.f3": { en: "Full SEO strategy", de: "Tam SEO stratejisi", tr: "Tam SEO stratejisi" },
  "pricing.premium.f4": { en: "Logo and brand identity", de: "Logo und Markenidentität", tr: "Logo ve marka kimliği" },
  "pricing.premium.f5": { en: "Texting assistance", de: "Unterstützung beim Texten", tr: "İçerik yazımı desteği" },
  "pricing.premium.f6": { en: "Analytics setup", de: "Analytics-Einrichtung", tr: "Analytics kurulumu" },
  "pricing.premium.f7": { en: "Priority support (30 days)", de: "Priorisierter Support (30 Tage)", tr: "Öncelikli destek (30 gün)" },
  "pricing.premium.f8": { en: "Unlimited revisions", de: "Unbegrenzte Korrekturen", tr: "Sınırsız revizyon" },
  "pricing.premium.f9": { en: "Live in 14–21 days", de: "In 14–21 Tagen live", tr: "14–21 günde yayında" },
  "pricing.premium.bonus": { en: "+ 2 months SEO-Content included for free", de: "+ 2 Monate SEO-Content kostenlos inklusive", tr: "+ 2 aylık SEO içerik ücretsiz dahil" },

  // Monthly Packages
  "pricing.monthly.label": { en: "Monthly Packages", de: "Monatliche Pakete", tr: "Aylık Paketler" },
  "pricing.monthly.wartung": { en: "Maintenance", de: "Wartung", tr: "Bakım" },
  "pricing.monthly.wartung.desc": {
    en: "Ongoing care for your existing website.",
    de: "Laufende Pflege Ihrer bestehenden Website.",
    tr: "Mevcut web sitenizin sürekli bakımı.",
  },
  "pricing.monthly.seo": { en: "SEO & Care", de: "SEO & Pflege", tr: "SEO & Bakım" },
  "pricing.monthly.seo.desc": {
    en: "Regular content and ongoing site maintenance.",
    de: "Regelmäßige Inhalte und laufende Seitenpflege.",
    tr: "Düzenli içerik ve sürekli sayfa bakımı.",
  },
  "pricing.monthly.combined": { en: "All-in-One Package", de: "Rundum-Paket", tr: "Hepsi Bir Arada Paket" },
  "pricing.monthly.combined.desc": {
    en: "Complete growth package.",
    de: "Vollständiges Wachstumspaket.",
    tr: "Tam kapsamlı büyüme paketi.",
  },

  // Monthly Features
  "pricing.monthly.f1": { en: "Text and image updates", de: "Text- und Bildaktualisierungen", tr: "Metin ve görsel güncellemeleri" },
  "pricing.monthly.f2": { en: "Small design adjustments", de: "Kleine Design-Anpassungen", tr: "Küçük tasarım düzenlemeleri" },
  "pricing.monthly.f3": { en: "Uptime monitoring", de: "Uptime-Monitoring", tr: "Uptime takibi" },
  "pricing.monthly.f4": { en: "Monthly summary report", de: "Monatlicher Kurzbericht", tr: "Aylık özet rapor" },
  "pricing.monthly.f5": { en: "2 SEO blog articles per month", de: "2 SEO-Blogartikel pro Monat", tr: "Ayda 2 SEO blog yazısı" },
  "pricing.monthly.f6": { en: "Keyword research", de: "Keyword-Recherche", tr: "Anahtar kelime araştırması" },
  "pricing.monthly.f7": { en: "In German, Turkish or both", de: "Auf Deutsch, Türkisch oder beides", tr: "Almanca, Türkçe oder her ikisi" },
  "pricing.monthly.f8": { en: "Current site maintenance", de: "Aktuelle Seitenpflege", tr: "Güncel sayfa bakımı" },
  "pricing.monthly.f9": { en: "Topics matching your industry", de: "Themen passend zu Ihrer Branche", tr: "Sektörünüize uygun konular" },
  "pricing.monthly.f10": { en: "2 SEO articles per month", de: "2 SEO-Artikel pro Monat", tr: "Ayda 2 SEO makalesi" },
  "pricing.monthly.f11": { en: "New page design and integration", de: "Neue Seitengestaltung und -einbindung", tr: "Yeni sayfa tasarımı ve entegrasyonu" },
  "pricing.monthly.f12": { en: "Landing page development", de: "Landing-Page-Entwicklung", tr: "Landing page geliştirme" },
  "pricing.monthly.f13": { en: "Maintenance and updates", de: "Wartung und Updates", tr: "Bakım ve güncellemeler" },
  "pricing.monthly.f14": { en: "Priority support", de: "Prioritätssupport", tr: "Öncelikli destek" },

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