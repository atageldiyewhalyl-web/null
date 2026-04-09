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
    tr: "Her detay, güven oluşturmak ve müvekkil kazanmak için tasarlanir.",
  },

  "services.label": { en: "Services", de: "Leistungen", tr: "Hizmetler" },
  "services.title1": { en: "Everything you need.", de: "Alles, was Sie brauchen.", tr: "İhtiyacınız olan her şey." },
  "services.title2": { en: "Designed to add real value to your business.", de: "Mit echtem Mehrwert für Ihr Geschäft.", tr: "İşinize değer katacak şekilde." },
  "services.description": {
    en: "We handle the full spectrum of web presence — design, code, search visibility, brand identity, and ongoing care — so you can focus on what you do best.",
    de: "Wir kümmern uns um Ihre gesamte Online-Präsenz — Design, Entwicklung, Sichtbarkeit in Suchmaschinen, Markenauftritt und laufende Betreuung — damit Sie sich auf Ihr Kerngeschäft konzentrieren können.",
    tr: "Tasarım, geliştirme, arama görünürlüğü, marka kimliği ve sürekli bakım dahil olmak üzere tüm dijital varlığınızı biz yönetiyoruz — böylece siz en iyi yaptığınız işe odaklanabilirsiniz.",
  },
  "services.webdesign": { en: "Web Design", de: "Webdesign", tr: "Web Tasarım" },
  "services.webdesign.desc": {
    en: "Clean, conversion-focused designs that reflect your brand and resonate with your audience. We craft every pixel to turn visitors into clients.",
    de: "Klares, conversion-orientiertes Design, das Ihre Marke widerspiegelt und Ihre Zielgruppe anspricht. Jedes Detail wird darauf ausgelegt, Besucher in Kunden zu verwandeln.",
    tr: "Markanızı yansıtan ve hedef kitlenizle bağ kuran, dönüşüm odaklı temiz tasarımlar. Her detayı ziyaretçileri müşteriye dönüştürmek için kurguluyoruz.",
  },
  "services.development": { en: "Development", de: "Entwicklung", tr: "Geliştirme" },
  "services.development.desc": {
    en: "Fast, responsive, and SEO-ready websites built with modern technologies. Performance isn't optional — it's the standard.",
    de: "Schnelle, responsive und SEO-optimierte Websites auf Basis moderner Technologien. Performance ist kein Extra — sie ist Standard.",
    tr: "Modern teknolojilerle geliştirilmiş, hızlı, mobil uyumlu ve SEO hazır web siteleri. Performans bir seçenek değil — standarttır.",
  },
  "services.seo": { en: "SEO", de: "SEO", tr: "SEO" },
  "services.seo.desc": {
    en: "On-page optimization and technical SEO so your ideal clients can find you on Google.",
    de: "On-Page-Optimierung und technische SEO, damit Ihre Wunschkunden Sie bei Google finden.",
    tr: "Hedef müşterilerinizin sizi Google'da bulabilmesi için sayfa içi optimizasyon ve teknik SEO.",
  },
  "services.branding": { en: "Branding", de: "Branding", tr: "Markalaşma" },
  "services.branding.desc": {
    en: "Logo design, color systems, and visual identity that set you apart from competitors.",
    de: "Logo, Farbkonzept und visuelle Identität, die Sie klar von der Konkurrenz abheben.",
    tr: "Rakiplerinizden ayrışmanızı sağlayan logo, renk sistemi ve görsel kimlik.",
  },
  "services.maintenance": { en: "Maintenance", de: "Wartung", tr: "Bakım" },
  "services.maintenance.desc": {
    en: "Ongoing updates, security patches, and performance monitoring — we keep it running.",
    de: "Regelmäßige Updates, Sicherheitsmaßnahmen und Performance-Monitoring — wir halten alles am Laufen.",
    tr: "Düzenli güncellemeler, güvenlik önlemleri ve performans takibi — her şeyin sorunsuz çalışmasını sağlıyoruz.",
  },
  "services.learnMore": { en: "Learn more", de: "Mehr erfahren", tr: "Daha fazla bilgi" },

  "work.label": { en: "Selected Work", de: "Ausgewählte Projekte", tr: "Seçili Çalışmalar" },
  "work.title": { en: "Projects that speak for themselves.", de: "Arbeiten, die für sich sprechen.", tr: "Kendini anlatan projeler." },
  "work.d3.category": { en: "Beauty & Wellness · Web Design & Branding", de: "Beauty & Wellness · Webdesign & Branding", tr: "Güzellik & Wellness · Web Tasarım & Marka Kimliği" },
  "work.d3.desc": {
    en: "A refined website for a Mannheim beauty studio. Elegant typography, seamless Treatwell booking integration, and a design that mirrors the salon's premium experience.",
    de: "Eine elegante Website für ein Mannheimer Beauty-Studio. Hochwertige Typografie, nahtlose Treatwell-Integration und ein Design, das die Premium-Erfahrung des Salons widerspiegelt.",
    tr: "Mannheim'daki bir güzellik salonu için zarif bir web sitesi. Şık tipografi, Treatwell ile sorunsuz rezervasyon entegrasyonu ve salonun premium deneyimini yansıtan bir tasarım.",
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