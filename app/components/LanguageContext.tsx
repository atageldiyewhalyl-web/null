import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import type { Language } from "../types";
import { getLanguageForPath, isLanguage } from "../utils/i18nRouting";
export type { Language };

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
  const location = useLocation();
  const [lang, setLangState] = useState<Language>(isLanguage(initialLang) ? initialLang : "de");
  const [isHydrated, setIsHydrated] = useState(false);

  const setLang = useCallback((newLang: Language) => {
    if (!isLanguage(newLang)) return;

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
    } catch (e) {
      console.warn("Language persistence issue:", e);
    }
  }, []);

  // Sync visible language from localized blog URLs. Blog URL language is
  // canonical and must not rewrite the user's saved preference by itself.
  useEffect(() => {
    const pathLang = getLanguageForPath(location.pathname);
    if (!pathLang) return;

    setLangState(pathLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = pathLang;
    }
  }, [location.pathname]);

  // Keep non-blog pages synced from ?lang= so refreshes and hot reloads use
  // the same durable source of truth as localized blog URLs.
  useEffect(() => {
    if (getLanguageForPath(location.pathname)) return;

    const urlLang = new URLSearchParams(location.search).get("lang");
    if (isLanguage(urlLang) && urlLang !== lang) {
      setLang(urlLang);
    }
  }, [lang, location.pathname, location.search, setLang]);

  // Hydrate non-blog pages from localStorage or cookies once when no URL
  // language is present. Blog pages keep the language encoded in their URL.
  useEffect(() => {
    try {
      if (getLanguageForPath(location.pathname)) {
        setIsHydrated(true);
        return;
      }

      const urlLang = new URLSearchParams(location.search).get("lang");
      if (isLanguage(urlLang)) {
        setLang(urlLang);
        setIsHydrated(true);
        return;
      }

      const saved = localStorage.getItem("nll_lang") || getCookie("nll_lang");
      if (isLanguage(saved)) {
        setLang(saved);
      }
    } catch (e) {
      console.warn("Language hydration from storage failed:", e);
    }
    setIsHydrated(true);
  }, [location.pathname, location.search, setLang]);

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
    en: "Your client acquisition system",
    de: "Ihr System für planbare Kundenakquise",
    tr: "Müşteri kazanım sisteminiz"
  },
  "hero.line1": {
    en: "Your next customer is already searching",
    de: "Ihre nächsten Kunden suchen gerade",
    tr: "Bir sonraki müşteriniz arıyor"
  },
  "hero.line2": {
    en: "Make sure they find you",
    de: "Sorgen Sie dafür, dass sie Sie finden",
    tr: "Sizi bulduğundan emin olun"
  },
  "hero.line1Mobile": {
    en: "Get found.",
    de: "Gefunden werden.",
    tr: "Önce siz"
  },
  "hero.line2Mobile": {
    en: "Before they do.",
    de: "Bevor sie andere wählen.",
    tr: "bulunun."
  },
  "hero.description": {
    en: "We build the digital presence that turns searches into enquiries, website, SEO, and AI visibility working together so your business gets found before your competitors do.",
    de: "Wir bauen die digitale Präsenz, die Ihr Unternehmen sichtbar macht, Website, SEO und KI-Sichtbarkeit, damit Kunden Sie finden, bevor sie zur Konkurrenz gehen.",
    tr: "Bulunmak, güven kazanmak ve ziyaretçileri nitelikli taleplere dönüştürmek isteyen hizmet işletmeleri, danışmanlar ve hukuk büroları için yüksek dönüşümlü web siteleri tasarlıyoruz.",
  },
  "hero.descriptionMobile": {
    en: "We build the digital presence that turns searches into enquiries before your competitors get found.",
    de: "Wir bauen die digitale Präsenz, damit Kunden Sie finden, bevor sie zur Konkurrenz gehen.",
    tr: "Güven, netlik ve nitelikli talepler isteyen hizmet işletmeleri, danışmanlar ve hukuk büroları için web siteleri.",
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
  "hero.card1.label": { en: "Client value generated", de: "Generierter Kundenwert", tr: "Oluşturulan müşteri değeri" },
  "hero.card1.value": { en: "€10k / week", de: "€10k / Woche", tr: "Haftalık €10k" },
  "hero.card1.sub": { en: "average new client value across active projects", de: "durchschnittlicher Neukundenwert in aktiven Projekten", tr: "aktif projelerde ortalama yeni müşteri değeri" },

  "hero.card2.label": { en: "SEO rankings", de: "SEO-Rankings", tr: "SEO sıralamaları" },
  "hero.card2.value": { en: "Top 3 avg.", de: "Top 3 im Schnitt", tr: "Ortalama ilk 3" },
  "hero.card2.sub": { en: "for the keywords we target", de: "für die Keywords, die wir gezielt aufbauen", tr: "hedeflediğimiz anahtar kelimelerde" },

  "hero.card3.label": { en: "Monthly visibility", de: "Monatliche Sichtbarkeit", tr: "Aylık görünürlük" },
  "hero.card3.value": { en: "50k views", de: "50k Impressionen", tr: "50k gösterim" },
  "hero.card3.sub": { en: "and 7k clicks generated every month", de: "und 7k Klicks pro Monat", tr: "ve ayda 7k tıklama" },

  "hero.card4.label": { en: "AI discovery", de: "KI-Sichtbarkeit", tr: "Yapay zeka görünürlüğü" },
  "hero.card4.value": { en: "Found in chats", de: "In Chats gefunden", tr: "Sohbetlerde bulunur" },
  "hero.card4.sub": { en: "clients appear in AI answers and recommendations", de: "Kunden erscheinen in KI-Antworten und Empfehlungen", tr: "müşteriler yapay zeka cevaplarında ve önerilerinde görünür" },

  "hero.trustRibbon.t1": { en: "€10k / Week", de: "€10k / Woche", tr: "Haftalık €10k" },
  "hero.trustRibbon.t2": { en: "Top 3 SEO", de: "Top 3 SEO", tr: "İlk 3 SEO" },
  "hero.trustRibbon.t3": { en: "AI Discovery", de: "KI-Sichtbarkeit", tr: "Yapay Zeka Görünürlüğü" },

  "hero.trustBar": {
    en: "Built for local businesses that need to be found, earn trust, and turn visitors into customers.",
    de: "Für lokale Unternehmen, die gefunden werden, Vertrauen aufbauen und Besucher in Kunden verwandeln möchten.",
    tr: "Sadece dikkat değil, güven kazandıran web sitelerine ihtiyaç duyan işletmeler, danışmanlar ve avukatlar için.",
  },
  "hero.comparison.label": {
    en: "Digital Transformation",
    de: "Digitale Transformation",
    tr: "Dijital Dönüşüm",
  },
  "hero.comparison.title": {
    en: "This is what a business that wins trust looks like.",
    de: "So sieht ein Auftritt aus, der überzeugt.",
    tr: "Güven kazanan bir işletme böyle görünür.",
  },
  "hero.comparison.subtitle": {
    en: "Every detail designed to build trust and win customers.",
    de: "Jedes Detail darauf ausgelegt, Vertrauen zu schaffen und Kunden zu gewinnen.",
    tr: "Her detay, güven oluşturmak ve müşteri kazanmak için tasarlanmıştır.",
  },
  "problem.header": {
    en: "Most firms lose clients before the first conversation.",
    de: "Viele Anbieter verlieren Kunden vor dem ersten Gespräch.",
    tr: "Birçok firma, ilk görüşmeden önce müşteri kaybediyor.",
  },
  "problem.subHeader": {
    en: "Not because their offer is weak. But because their online presence does not build enough trust.",
    de: "Nicht weil ihr Angebot schwach ist. Sondern weil ihr Online-Auftritt nicht genug Vertrauen schafft.",
    tr: "Teklifleri zayıf olduğu için değil. Online varlıkları yeterince güven oluşturmadığı için.",
  },
  "problem.p1": {
    en: "Someone is searching for your service right now. They type into Google. They find a competitor. Not you.",
    de: "Jemand sucht gerade nach Ihrer Leistung. Er tippt bei Google. Er findet einen Wettbewerber. Nicht Sie.",
    tr: "Birileri şu anda sizin hizmetinizi arıyor. Google'a yazıyor. Rakibinizi buluyor. Sizi değil.",
  },
  "problem.p2": {
    en: "Your website exists, but it looks outdated. First impressions matter, and right now your first impression is costing you customers.",
    de: "Ihre Website existiert, aber sie wirkt veraltet. Der erste Eindruck zählt, und genau dieser Eindruck kostet Sie Kunden.",
    tr: "Web siteniz var ama eski görünüyor. İlk izlenim önemlidir ve şu an bu izlenim size müşteri kaybettiriyor.",
  },
  "problem.p3": {
    en: "You have no website. Your competitors do. And they are getting the enquiries that should be yours.",
    de: "Sie haben keine Website. Ihre Konkurrenz schon. Und sie bekommt die Anfragen, die eigentlich Ihnen gehören sollten.",
    tr: "Web siteniz yok. Rakiplerinizin var. Ve size gelmesi gereken talepler onlara gidiyor.",
  },
  "problem.turn": {
    en: "It doesn't have to stay this way. And it's easier to change than you think.",
    de: "Das muss nicht so bleiben. Und es ist einfacher zu ändern, als Sie denken.",
    tr: "Böyle kalmak zorunda değil. Ve değiştirmek düşündüğünüzden çok daha kolay.",
  },

  "services.label": { en: "Services", de: "Leistungen", tr: "Hizmetler" },
  "services.title1": {
    en: "All you need to build",
    de: "Alles, was Sie brauchen",
    tr: "Müşteri kazanım kanalınızı",
  },
  "services.title2": {
    en: "your client acquisition channel.",
    de: "für Ihre Kundenakquise.",
    tr: "kurmak için ihtiyacınız olan her şey.",
  },
  "services.description": {
    en: "Websites, SEO, AI visibility, positioning, and ongoing care working together to turn attention into qualified enquiries.",
    de: "Websites, SEO, KI-Sichtbarkeit, Positionierung und laufende Betreuung, die gemeinsam Aufmerksamkeit in qualifizierte Anfragen verwandeln.",
    tr: "Web sitesi, SEO, yapay zeka görünürlüğü, konumlandırma ve sürekli bakım birlikte çalışarak ilgiyi nitelikli taleplere dönüştürür.",
  },
  "services.flow.intent": { en: "Search intent", de: "Suchabsicht", tr: "Arama niyeti" },
  "services.flow.intent.desc": {
    en: "Right now, someone is searching for what you offer. The question is: do they find you or your competitor?",
    de: "Gerade jetzt sucht jemand nach dem, was Sie anbieten. Die Frage ist: Finden sie Sie oder Ihren Mitbewerber?",
    tr: "Şu anda biri sunduğunuz şeyi arıyor. Soru şu: Sizi mi buluyorlar yoksa rakibinizi mi?",
  },
  "services.flow.visibility": { en: "Visibility", de: "Sichtbarkeit", tr: "Görünürlük" },
  "services.flow.visibility.desc": {
    en: "Your website appears at the top, at the right time, in the right place. Not somewhere on page two.",
    de: "Ihre Website erscheint ganz oben, zur richtigen Zeit, am richtigen Ort. Nicht irgendwo auf Seite zwei.",
    tr: "Web siteniz doğru zamanda, doğru yerde, en üstte görünür. İkinci sayfanın bir yerinde değil.",
  },
  "services.flow.trust": { en: "Trust", de: "Vertrauen", tr: "Güven" },
  "services.flow.trust.desc": {
    en: "They click. The page is clear, professional, convincing. They trust you before they even write.",
    de: "Sie klicken. Die Seite ist klar, professionell, überzeugend. Sie vertrauen Ihnen, bevor sie schreiben.",
    tr: "Tıklarlar. Sayfa net, profesyonel ve ikna edicidir. Size yazmadan önce güvenirler.",
  },
  "services.flow.enquiry": { en: "Enquiry", de: "Anfrage", tr: "Talep" },
  "services.flow.enquiry.desc": {
    en: "You receive a message. You did not have to do anything. The system did the work.",
    de: "Sie erhalten eine Nachricht. Sie haben nichts tun müssen. Das System hat gearbeitet.",
    tr: "Bir mesaj alırsınız. Hiçbir şey yapmanız gerekmez. Sistem çalışmıştır.",
  },
  "services.flow.aria": {
    en: "Client acquisition journey",
    de: "Ablauf der Kundenakquise",
    tr: "Müşteri kazanım akışı",
  },
  "services.flow.label": {
    en: "How it works",
    de: "Wie es funktioniert",
    tr: "Nasıl çalışır",
  },
  "services.flow.title1": {
    en: "From Google search to",
    de: "Von der Google-Suche zur",
    tr: "Google aramasından",
  },
  "services.flow.title2": {
    en: "enquiry.",
    de: "Anfrage.",
    tr: "talebe.",
  },
  "services.flow.subtitle": {
    en: "No accident. No luck. A system that works before the first conversation starts.",
    de: "Kein Zufall. Kein Glück. Ein System, das arbeitet, bevor das erste Gespräch beginnt.",
    tr: "Tesadüf değil. Şans değil. İlk görüşmeden önce çalışan bir sistem.",
  },
  "services.webdesign": { en: "Professional website", de: "Professionelle Website", tr: "Profesyonel web sitesi" },
  "services.webdesign.desc": {
    en: "A website that presents your expertise clearly and converts visitors. No templates. No compromises.",
    de: "Eine Website, die Ihre Expertise klar präsentiert und Besucher überzeugt. Kein Template. Kein Kompromiss.",
    tr: "Uzmanlığınızı net şekilde sunan ve ziyaretçileri müşteriye dönüştüren bir web sitesi. Şablon yok, taviz yok."
  },
  "services.development": { en: "Technical development", de: "Technische Umsetzung", tr: "Teknik geliştirme" },
  "services.development.desc": {
    en: "Fast, secure and perfect on every device. Your website runs reliably so you don't have to think about it.",
    de: "Schnell, sicher und auf allen Geräten perfekt. Ihre Website läuft zuverlässig — damit Sie es nicht müssen.",
    tr: "Hızlı, güvenli ve her cihazda kusursuz. Web siteniz güvenilir çalışır, siz düşünmek zorunda kalmazsınız.",
  },
  "services.seo": { en: "Google visibility", de: "Google-Sichtbarkeit", tr: "Google görünürlüğü" },
  "services.seo.desc": {
    en: "When someone searches for your services, they should find you. We make sure Google can recommend your business.",
    de: "Wenn jemand nach Ihren Leistungen sucht, soll er Sie finden. Wir sorgen dafür, dass Google Ihr Unternehmen empfehlen kann.",
    tr: "Birileri hizmetlerinizi aradığında sizi bulsun. Google'ın işletmenizi önerebilmesini sağlıyoruz.",
  },
  "services.seo.upsell": {
    en: "Option from €150/mo",
    de: "Option ab €150/Monat",
    tr: "Ek seçenek €150/ay'dan",
  },
  "services.ai": { en: "AI chat visibility", de: "KI-Chat-Sichtbarkeit", tr: "Yapay zeka sohbet görünürlüğü" },
  "services.ai.desc": {
    en: "We structure your website and content so your firm can appear in AI answers, recommendations, and research conversations.",
    de: "Wir strukturieren Website und Inhalte so, dass Ihr Anbieter in KI-Antworten, Empfehlungen und Recherche-Chats sichtbar werden kann.",
    tr: "Web sitenizi ve içeriklerinizi, firmanızın yapay zeka cevaplarında, önerilerinde ve araştırma sohbetlerinde görünmesi için yapılandırıyoruz.",
  },
  "services.ai.badge": {
    en: "AI search",
    de: "KI-Suche",
    tr: "Yapay zeka araması",
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
    en: "Included in every package",
    de: "In jedem Paket inklusive",
    tr: "Her pakete dahil",
  },
  "services.learnMore": { en: "Learn more", de: "Mehr erfahren", tr: "Daha fazla bilgi" },

  "work.label": { en: "Selected Work", de: "Ausgewählte Projekte", tr: "Seçili Çalışmalar" },
  "work.title": { en: "Projects that speak for themselves.", de: "Arbeiten, die für sich sprechen.", tr: "Kendini anlatan projeler." },
  "work.herkules.category": {
    en: "Moving company website & local visibility",
    de: "Umzugsunternehmen Website & lokale Sichtbarkeit",
    tr: "Nakliye firması web sitesi ve yerel görünürlük",
  },
  "work.herkules.desc": {
    en: "A fast website and enquiry flow for an established Mannheim moving company with 20+ years of experience and official City of Mannheim partner status.",
    de: "Eine schnelle Website mit klarer Anfragestrecke für ein etabliertes Mannheimer Umzugsunternehmen mit über 20 Jahren Erfahrung und offizieller Partnerschaft mit der Stadt Mannheim.",
    tr: "20 yılı aşkın deneyime ve Mannheim Belediyesi resmi partnerliğine sahip köklü bir nakliye firması için hızlı web sitesi ve net talep akışı.",
  },
  "work.dogru.category": {
    en: "Web design & brand identity",
    de: "Webdesign & Markenidentität",
    tr: "Web tasarımı ve marka kimliği",
  },
  "work.dogru.desc": {
    en: "A professional website built to present the firm clearly, explain the offer with confidence, and turn visitors into qualified enquiries.",
    de: "Eine professionelle Website, die den Anbieter klar präsentiert, das Angebot überzeugend erklärt und Besucher in qualifizierte Anfragen verwandelt.",
    tr: "Firmayı net şekilde sunan, teklifi güvenle anlatan ve ziyaretçileri nitelikli taleplere dönüştüren profesyonel bir web sitesi.",
  },
  "work.besir.category": { en: "Consultant Brand & Web Design", de: "Beratermarke & Webdesign", tr: "Danışman Markası & Web Tasarım" },
  "work.besir.desc": {
    en: "Positioning and branding for a consultant building a stronger online presence. We clarified the message, designed the brand identity, and built a site that establishes trust.",
    de: "Positionierung und Markenaufbau für einen Berater, der seine Online-Präsenz stärken möchte. Wir haben die Botschaft geschärft, die Markenidentität entwickelt und eine Website erstellt, die Vertrauen schafft.",
    tr: "Online varlığını güçlendirmek isteyen bir danışman için konumlandırma ve marka çalışması. Mesajı netleştirdik, marka kimliğini oluşturduk ve güven sağlayan bir web sitesi geliştirdik.",
  },

  // Pricing
  "pricing.individual.label": { en: "Individual price", de: "Individueller Preis", tr: "Size özel fiyat" },
  "pricing.individual.title": {
    en: "Your individual price in 60 seconds.",
    de: "Ihr individueller Preis in 60 Sekunden.",
    tr: "Size özel fiyatınız 60 saniyede hazır.",
  },
  "pricing.individual.description": {
    en: "Choose what you need, website, SEO, AI visibility, Google Ads, or the full lead system. We show you a clear setup and monthly estimate before we speak.",
    de: "Wählen Sie, was Sie brauchen: Website, SEO, KI-Sichtbarkeit, Google Ads oder ein komplettes Akquise-System. Sie erhalten eine klare Einschätzung für Setup und monatliche Betreuung.",
    tr: "İhtiyacınız olanı seçin: web sitesi, SEO, yapay zeka görünürlüğü, Google Ads veya tam talep sistemi. Görüşmeden önce kurulum ve aylık bakım için net bir tahmin gösteririz.",
  },
  "pricing.individual.preview.label": { en: "Quote preview", de: "Angebotsvorschau", tr: "Teklif önizlemesi" },
  "pricing.individual.preview.title": { en: "Your setup", de: "Ihr Setup", tr: "Kurulumunuz" },
  "pricing.individual.item.website": { en: "Website", de: "Website", tr: "Web sitesi" },
  "pricing.individual.item.seo": { en: "SEO", de: "SEO", tr: "SEO" },
  "pricing.individual.item.ai": { en: "AI visibility", de: "KI-Sichtbarkeit", tr: "Yapay zeka görünürlüğü" },
  "pricing.individual.item.ads": { en: "Google Ads", de: "Google Ads", tr: "Google Ads" },
  "pricing.individual.status.selected": { en: "selected", de: "ausgewählt", tr: "seçildi" },
  "pricing.individual.status.optional": { en: "optional", de: "optional", tr: "opsiyonel" },
  "pricing.individual.preview.estimate": { en: "Estimated range", de: "Geschätzter Rahmen", tr: "Tahmini aralık" },
  "pricing.individual.preview.calculated": { en: "Calculated after 60 seconds", de: "Berechnet nach 60 Sekunden", tr: "60 saniye sonra hesaplanır" },
  "pricing.individual.trust.generic": { en: "No generic packages", de: "Keine Standardpakete", tr: "Standart paket yok" },
  "pricing.individual.trust.costs": { en: "Clear setup and monthly costs", de: "Klare Setup- und Monatskosten", tr: "Net kurulum ve aylık maliyet" },
  "pricing.individual.trust.roadmap": { en: "You receive a project roadmap", de: "Sie erhalten eine Projekt-Roadmap", tr: "Proje yol haritası alırsınız" },
  "pricing.label": { en: "Pricing", de: "PREISE", tr: "FİYATLAR" },
  "pricing.title1": { en: "Full clarity", de: "Volle Klarheit", tr: "Baştan tam" },
  "pricing.title2": { en: "from the start.", de: "von Anfang an.", tr: "netlik." },
  "pricing.description": {
    en: "Choose the package that fits your firm. Monthly care is included in every package.",
    de: "Wählen Sie das Paket, das zu Ihrem Auftritt passt. Monatliche Betreuung ist in jedem Paket dabei.",
    tr: "Firmanıza en uygun paketi seçin. Aylık bakım her pakete dahildir.",
  },
  "pricing.tab.websites": { en: "Website Packages", de: "Website-Pakete", tr: "Web Sitesi Paketleri" },
  "pricing.tab.retainer": { en: "Monthly Retainer", de: "Monatliche Betreuung", tr: "Aylık Bakım" },

  // TAB 1: WEBSITES
  "pricing.basic": { en: "BASIC", de: "BASIC", tr: "BASIC" },
  "pricing.basic.desc": {
    en: "1 page, 3 iterations. Perfect for a sharp start.",
    de: "1 Seite, 3 Korrekturrunden. Perfekt für einen klaren Start.",
    tr: "1 sayfa, 3 revizyon. Güçlü bir başlangıç için ideal.",
  },
  "pricing.basic.f1": { en: "One-Page Expert Website", de: "Ein-Seiten Experten-Website", tr: "Tek Sayfalık Uzman Web Sitesi" },
  "pricing.basic.f2": { en: "3 Design Iterations", de: "3 Design-Korrekturrunden", tr: "3 Tasarım Revizyonu" },
  "pricing.basic.f3": { en: "Maintenance & Hosting Included", de: "Inklusive Wartung & Hosting", tr: "Bakım ve Hosting Dahil" },
  "pricing.basic.f4": { en: "Mobile Optimized", de: "Mobil optimiert", tr: "Mobil uyumlu" },
  "pricing.basic.f5": { en: "Fast Load Times", de: "Hohe Geschwindigkeit", tr: "Yüksek hız" },
  "pricing.basic.cta": { en: "Select Basic", de: "Basic wählen", tr: "Basic Seç" },

  "pricing.business": { en: "BUSINESS", de: "BUSINESS", tr: "BUSINESS" },
  "pricing.business.badge": { en: "MOST POPULAR", de: "MEISTGEWÄHLT", tr: "EN POPÜLER" },
  "pricing.business.price": { en: "125€/mo", de: "125€/Monat", tr: "125€/ay" },
  "pricing.business.desc": {
    en: "Up to 10 pages. Ideal for growing firms.",
    de: "Bis zu 10 Seiten. Ideal für wachsende Anbieter.",
    tr: "10 sayfaya kadar. Büyüyen firmalar için ideal.",
  },
  "pricing.business.f1": { en: "Up to 10 Pages", de: "Bis zu 10 Seiten", tr: "10 Sayfaya Kadar" },
  "pricing.business.f2": { en: "Individual Design", de: "Individuelles Design", tr: "Kişiye özel tasarım" },
  "pricing.business.f3": { en: "Maintenance & Hosting Included", de: "Inklusive Wartung & Hosting", tr: "Bakım ve Hosting Dahil" },
  "pricing.business.f4": { en: "Blog and news section", de: "Blog- und Newsbereich", tr: "Blog ve haber bölümü" },
  "pricing.business.f5": { en: "Social media integration", de: "Social-Media-Anbindung", tr: "Sosyal medya entegrasyonu" },
  "pricing.business.f6": { en: "Basic branding package", de: "Basis-Branding-Paket", tr: "Temel marka paketi" },
  "pricing.business.f7": { en: "Active SEO strategy included", de: "Inklusive aktiver SEO-Strategie", tr: "Aktif SEO stratejisi dahil" },

  "pricing.advanced": { en: "ADVANCED", de: "ADVANCED", tr: "ADVANCED" },
  "pricing.advanced.price": { en: "150€/mo", de: "150€/Monat", tr: "150€/ay" },
  "pricing.advanced.desc": {
    en: "10+ pages. The full digital authority system.",
    de: "10+ Seiten. Das volle digitale Autoritäts-System.",
    tr: "10+ sayfa. Eksiksiz dijital otorite sistemi.",
  },
  "pricing.advanced.f1": { en: "10+ Pages", de: "10+ Seiten", tr: "10+ Sayfa" },
  "pricing.advanced.f2": { en: "Premium Design", de: "Premium-Design", tr: "Premium tasarım" },
  "pricing.advanced.f3": { en: "Maintenance & Hosting Included", de: "Inklusive Wartung & Hosting", tr: "Bakım ve Hosting Dahil" },
  "pricing.advanced.f4": { en: "Logo and brand identity", de: "Logo und Markenidentität", tr: "Logo ve marka kimliği" },
  "pricing.advanced.f5": { en: "Copywriting support", de: "Unterstützung beim Texten", tr: "Metin yazarlığı desteği" },
  "pricing.advanced.f6": { en: "Analytics setup", de: "Analytics-Einrichtung", tr: "Analitik kurulumu" },
  "pricing.advanced.f7": { en: "Priority support", de: "Priorisierter Support", tr: "Öncelikli destek" },
  "pricing.advanced.f8": { en: "Full Managed Lead System", de: "Full Managed Lead-System", tr: "Tam yönetimli talep sistemi" },

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
  "pricing.retainer.seo.f2": { en: "Keyword research for your services", de: "Keyword-Arbeit für Ihre Leistungen", tr: "Hizmetlerinize özel anahtar kelime çalışması" },
  "pricing.retainer.seo.f3": { en: "Content aligned with your audience", de: "Inhalte passend zu Ihrer Zielgruppe", tr: "Hedef kitlenize uygun içerik" },
  "pricing.retainer.seo.f4": { en: "Technical SEO maintenance", de: "Technische SEO-Begleitung", tr: "Teknik SEO takibi" },
  "pricing.retainer.seo.f5": { en: "Monthly progress report", de: "Monatlicher Fortschrittsbericht", tr: "Aylık gelişim raporu" },
  "pricing.retainer.seo.priceSuffix": { en: "/month", de: "/Monat", tr: "/ay" },

  "pricing.retainer.growth": { en: "GROWTH PACKAGE", de: "WACHSTUMS-PAKET", tr: "BÜYÜME PAKETİ" },
  "pricing.retainer.growth.desc": {
    en: "SEO plus new landing pages that actively win customers for your services.",
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
  "contact.title1": { en: "Your expertise deserves a stronger presence.", de: "Ihre Expertise verdient einen stärkeren Auftritt.", tr: "Uzmanlığınız daha güçlü bir duruşu hak ediyor." },
  "contact.title2": { en: "Let's turn it into enquiries.", de: "Machen wir daraus Anfragen.", tr: "Bunu taleplere dönüştürelim." },
  "contact.description": {
    en: "Tell us about your business. We will get back to you within 24 hours with a concrete plan.",
    de: "Erzählen Sie uns von Ihrem Unternehmen. Wir melden uns innerhalb von 24 Stunden mit einem konkreten Plan zurück.",
    tr: "İşletmenizden bahsedin. 24 saat içinde somut bir planla size geri döneceğiz.",
  },
  "contact.location": { en: "Remote & local projects", de: "Remote & lokale Projekte", tr: "Uzaktan ve yerel projeler" },
  "contact.whatsapp.cta": { en: "Message us directly.", de: "Schreiben Sie uns direkt.", tr: "Bize direkt yazın." },
  "contact.email.cta": { en: "Prefer email? No problem.", de: "Lieber per E-Mail? Kein Problem.", tr: "E-posta tercih ederseniz sorun değil." },
  "contact.name": { en: "Your name", de: "Ihr Name", tr: "Adınız" },
  "contact.email": { en: "Your email address", de: "Ihre E-Mail-Adresse", tr: "E-posta adresiniz" },
  "contact.phone": { en: "Your phone number", de: "Ihre Telefonnummer", tr: "Telefon numaranız" },
  "contact.city": { en: "Which city is your business in?", de: "In welcher Stadt ist Ihr Unternehmen?", tr: "İşletmeniz hangi şehirde?" },
  "contact.practiceArea": { en: "What is your main service?", de: "Was ist Ihre wichtigste Leistung?", tr: "Ana hizmetiniz nedir?" },
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
  "onboarding.intro.title": { en: "Let's build you a constant flow of customers", de: "Gemeinsam starten wir Ihren kontinuierlichen Kundenstrom", tr: "Kesintisiz müşteri akışınız için ilk adım" },
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
  "onboarding.step2.seo.sub": { en: "A steady stream of organic customers in 2–3 months", de: "Kontinuierlicher Kundenstrom in 2–3 Monaten", tr: "2–3 ayda organik müşteri akışı" },
  "onboarding.step2.seo.time": { en: "First results: 2–3 months", de: "Erste Ergebnisse: 2–3 Monate", tr: "İlk sonuçlar: 2–3 ay" },

  "onboarding.step2.ads.title": { en: "Google Ads", de: "Google Ads", tr: "Google Reklamları" },
  "onboarding.step2.ads.sub": { en: "Customers from the very first week", de: "Kunden ab der ersten Woche", tr: "İlk haftadan itibaren müşteri" },
  "onboarding.step2.ads.time": { en: "First results: within 1 week", de: "Erste Ergebnisse: innerhalb 1 Woche", tr: "İlk sonuçlar: 1 hafta içinde" },

  "onboarding.step2.both.title": { en: "Full Package", de: "Gesamtpaket", tr: "Tam Paket" },
  "onboarding.step2.both.sub": { en: "Fast start, lasting growth", de: "Schneller Start, nachhaltiges Wachstum", tr: "Hızlı başlangıç + kalıcı büyüme" },
  "onboarding.step2.both.time": { en: "Recommended for best results", de: "Für beste Ergebnisse empfohlen", tr: "En iyi sonuç için önerilen" },
  "onboarding.step2.both.badge": { en: "MOST POPULAR", de: "AM BELIEBTESTEN", tr: "EN ÇOK TERCİH EDİLEN" },

  "onboarding.step3.title": { en: "Your specialties.", de: "Ihre Schwerpunkte.", tr: "Uzmanlık alanlarınız." },
  "onboarding.step3.sub": { en: "Which services do you focus on?", de: "Auf welche Leistungen sind Sie spezialisiert?", tr: "Hangi hizmetlere odaklanıyorsunuz?" },
  "onboarding.step3.other": { en: "Other service or niche...", de: "Andere Leistung / Nische...", tr: "Diğer hizmet / niş..." },
  "onboarding.step3.topServices.title": { en: "Your Top 3.", de: "Ihre Top 3.", tr: "En Önemli 3 Alan." },
  "onboarding.step3.topServices.sub": { en: "Select your three most important services.", de: "Wählen Sie Ihre drei wichtigsten Leistungen.", tr: "En önemli üç hizmetinizi seçin." },

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
  "onboarding.extra.appointment.sub": { en: "Customers book, you confirm", de: "Kunden buchen, Sie bestätigen", tr: "Müşteriler randevu alsın, siz onaylayın" },

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
  "onboarding.step6.q1": { en: "Who is your primary customer group?", de: "Wer ist Ihre primäre Kundengruppe?", tr: "Öncelikli müşteri kitleniz?" },
  "onboarding.step6.q2": { en: "What creates trust with your customers?", de: "Was schafft Vertrauen bei Ihren Kunden?", tr: "Müşterilerinizin size güvenmesini ne sağlıyor?" },
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

  "quote.step.objective.title": { en: "Which goals are we pursuing?", de: "Welche Ziele verfolgen wir?", tr: "Hangi hedeflere odaklanıyoruz?" },
  "quote.step.objective.web": { en: "New Professional Website", de: "Neue professionelle Website", tr: "Yeni profesyonel web sitesi" },
  "quote.step.objective.seo": { en: "Google Search Visibility (SEO)", de: "Google Sichtbarkeit (SEO)", tr: "Google Görünürlüğü (SEO)" },
  "quote.step.objective.geo": { en: "AI Search Visibility (GEO)", de: "KI-Suche Sichtbarkeit (GEO)", tr: "Yapay Zeka Görünürlüğü (GEO)" },
  "quote.step.objective.ads": { en: "Google Ads Management", de: "Google Ads Kampagnen-Management", tr: "Google Ads Kampanya Yönetimi" },
  "quote.step.objective.system": { en: "Full Digital Lead System", de: "Digitales Lead-System", tr: "Dijital Talep Sistemi" },

  "quote.result.setup": { en: "Setup Investment", de: "Einmalige Investition", tr: "Başlangıç Yatırımı" },
  "quote.result.monthly": { en: "per month", de: "pro Monat", tr: "aylık" },
  "quote.result.including": { en: "Including:", de: "Inklusive:", tr: "Dahil olanlar:" },

  "quote.step.siteType.title": { en: "How many pages do you need?", de: "Wie viele Seiten benötigen Sie?", tr: "Kaç sayfa ihtiyacınız var?" },
  "quote.step.siteType.single": { en: "Single-Page", de: "Ein-Seiten-Website", tr: "Tek Sayfa" },
  "quote.step.siteType.single.sub": { en: "Perfect for a sharp, compact start.", de: "Ideal für einen kompakten, klaren Start.", tr: "Net ve hızlı bir başlangıç için ideal." },
  "quote.step.siteType.multi": { en: "Multi-Page (Recommended)", de: "Mehrseitige Website (Empfohlen)", tr: "Çok Sayfalı (Önerilen)" },
  "quote.step.siteType.multi.sub": { en: "The foundation for long-term SEO success.", de: "Die Basis für langfristigen SEO-Erfolg.", tr: "Uzun vadeli SEO başarısı için temel." },

  "quote.step.presence.title": { en: "Current Status.", de: "Aktueller Stand.", tr: "Mevcut Durum." },
  "quote.step.presence.url": { en: "Current Website URL (if any)", de: "Aktuelle Website-URL (falls vorhanden)", tr: "Mevcut web sitesi adresi (varsa)" },
  "quote.step.presence.pain": { en: "What is your biggest challenge?", de: "Was ist Ihre größte Herausforderung?", tr: "En büyük zorluğunuz nedir?" },
  "quote.step.presence.pain.placeholder": { en: "e.g. No leads, outdated look...", de: "z.B. Keine Anfragen, veraltetes Design...", tr: "Örn: talep gelmiyor, tasarımı eski..." },

  "quote.result.title": { en: "Your Personalized Foundation.", de: "Ihr individuelles Fundament.", tr: "Size özel temel yapınız." },
  "quote.result.receivedTitle": { en: "Request received.", de: "Anfrage erhalten.", tr: "Talebiniz alındı." },
  "quote.result.receivedSub": {
    en: "Thank you. Our team will review your answers and reach out within 24 hours with the right next step for your project.",
    de: "Vielen Dank. Unser Team prüft Ihre Angaben und meldet sich innerhalb von 24 Stunden mit dem passenden nächsten Schritt für Ihr Projekt.",
    tr: "Teşekkürler. Ekibimiz bilgilerinizi inceleyecek ve projeniz için uygun sonraki adımla 24 saat içinde size ulaşacak."
  },
  "quote.result.nextStep": {
    en: "No generic package. No automatic price. You receive a personal recommendation after we understand the project properly.",
    de: "Kein Standardpaket. Kein automatischer Preis. Sie erhalten eine persönliche Empfehlung, sobald wir das Projekt richtig verstanden haben.",
    tr: "Standart paket yok. Otomatik fiyat yok. Projeyi doğru anladıktan sonra size kişisel bir öneri sunacağız."
  },
  "quote.result.estimate": {
    en: "Estimated total investment for your project:",
    de: "Voraussichtliche Investition für Ihr Projekt:",
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
  "quote.result.email": { en: "Send an Email", de: "E-Mail senden", tr: "E-posta Gönder" },

  "onboarding.common.next": { en: "Continue", de: "Weiter", tr: "Devam Et" },
  "onboarding.common.back": { en: "Back", de: "Zurück", tr: "Geri" },
};

export function t(key: string, lang: Language): string {
  return labels[key]?.[lang] ?? labels[key]?.["de"] ?? key;
}
