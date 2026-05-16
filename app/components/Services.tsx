import {
  ArrowUpRight,
  Bot,
  Code2,
  MonitorSmartphone,
  Palette,
  RefreshCw,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";
import conversionVisualEn from "../assets/services/english conversion.png";
import conversionVisualDe from "../assets/services/german conversion.png";
import conversionVisualEnMobile from "../assets/services/eng conversion mobile .png";
import conversionVisualDeMobile from "../assets/services/German conversion mobile .png";

export function Services() {
  const { lang } = useLanguage();
  const conversionVisual = lang === "de" ? conversionVisualDe : conversionVisualEn;
  const conversionVisualMobile = lang === "de" ? conversionVisualDeMobile : conversionVisualEnMobile;

  const systemSteps = [
    {
      number: "01",
      label: t("services.flow.intent", lang),
      description: t("services.flow.intent.desc", lang),
    },
    {
      number: "02",
      label: t("services.flow.visibility", lang),
      description: t("services.flow.visibility.desc", lang),
    },
    {
      number: "03",
      label: t("services.flow.trust", lang),
      description: t("services.flow.trust.desc", lang),
    },
    {
      number: "04",
      label: t("services.flow.enquiry", lang),
      description: t("services.flow.enquiry.desc", lang),
    },
  ];

  const flowVisualCopy = {
    serpUrl: lang === "de" ? "ihrewebsite.de" : lang === "tr" ? "siteniz.de" : "yourwebsite.de",
    serpTitle:
      lang === "de"
        ? "Ihre Leistung in Ihrer Stadt"
        : lang === "tr"
          ? "Şehrinizde sunduğunuz hizmet"
          : "Your service in your city",
    serpDescription:
      lang === "de"
        ? "Klarer Auftritt. Direkt Anfrage erhalten."
        : lang === "tr"
          ? "Net görünüm. Doğrudan talep alın."
          : "Clear presence. Turn visitors into enquiries.",
    secondResult:
      lang === "de" ? "Mitbewerber Website" : lang === "tr" ? "Rakip web sitesi" : "Competitor website",
    before: lang === "de" ? "Vorher" : lang === "tr" ? "Önce" : "Before",
    after: lang === "de" ? "Nachher" : lang === "tr" ? "Sonra" : "After",
    reviewName: "Maria K.",
    review:
      lang === "de"
        ? "Ich habe die Website gefunden und sofort gewusst: Das passt."
        : lang === "tr"
          ? "Web sitesini buldum ve hemen doğru yer olduğunu anladım."
          : "I found the website and immediately knew this was the right fit.",
    verified:
      lang === "de" ? "Verifizierte Bewertung" : lang === "tr" ? "Doğrulanmış yorum" : "Verified review",
    incoming:
      lang === "de"
        ? "Guten Tag, ich habe Ihre Website gefunden und würde gerne eine Beratung anfragen..."
        : lang === "tr"
          ? "Merhaba, web sitenizi buldum ve danışmanlık almak istiyorum..."
          : "Hi, I found your website and would like to request a consultation...",
    outgoing:
      lang === "de" ? "Sehr gerne. Wann passt es Ihnen?" : lang === "tr" ? "Memnuniyetle. Ne zaman uygunsunuz?" : "Of course. What time works for you?",
    time: lang === "de" ? "Heute, 10:42" : lang === "tr" ? "Bugün, 10:42" : "Today, 10:42",
  };

  const cards = [
    {
      number: "01",
      title: t("services.webdesign", lang),
      description: t("services.webdesign.desc", lang),
      Icon: MonitorSmartphone,
      className: "lg:col-span-5",
    },
    {
      number: "02",
      title: t("services.development", lang),
      description: t("services.development.desc", lang),
      Icon: Code2,
      className: "lg:col-span-4",
    },
    {
      number: "03",
      title: t("services.branding", lang),
      description: t("services.branding.desc", lang),
      Icon: Palette,
      className: "lg:col-span-3",
    },
    {
      number: "04",
      title: t("services.seo", lang),
      description: t("services.seo.desc", lang),
      Icon: Search,
      className: "lg:col-span-4",
    },
    {
      number: "05",
      title: t("services.ai", lang),
      description: t("services.ai.desc", lang),
      Icon: Bot,
      badge: t("services.ai.badge", lang),
      dark: true,
      className: "lg:col-span-4",
    },
    {
      number: "06",
      title: t("services.maintenance", lang),
      description: t("services.maintenance.desc", lang),
      Icon: RefreshCw,
      footer: t("services.maintenance.badge", lang),
      className: "lg:col-span-4",
    },
  ];

  const cardBase =
    "group relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border p-6 md:p-7 transition-all duration-300";

  return (
    <section id="services" className="scroll-mt-28 py-24 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mb-32 md:mb-48"
          aria-label={t("services.flow.aria", lang)}
        >
          <div className="mb-10 md:mb-14">
            <p className="mb-5 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#007aff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
              {t("services.flow.label", lang)}
            </p>
            <h3 className="max-w-5xl text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#0e0e10] md:whitespace-nowrap">
              {t("services.flow.title1", lang)}{" "}
              <span className="text-[#007aff]">{t("services.flow.title2", lang)}</span>
            </h3>
            <p className="mt-5 max-w-2xl text-[1rem] font-medium leading-relaxed text-[#86868b] md:text-[1.125rem]">
              {t("services.flow.subtitle", lang)}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden">
            <picture>
              <source media="(max-width: 767px)" srcSet={conversionVisualMobile} />
              <img
                src={conversionVisual}
                alt=""
                aria-hidden="true"
                className="w-full object-contain"
              />
            </picture>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0)_4.5%,rgba(255,255,255,0)_95.5%,#fff_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0)_6%,rgba(255,255,255,0)_94%,#fff_100%)]" />
          </div>
        </motion.div>

        {/* ── Header ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-20 items-end mb-16 md:mb-20">
          <div>
            <motion.p
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-6"
            >
              {t("services.label", lang)}
            </motion.p>
            <motion.h2
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="max-w-full text-[clamp(2.15rem,5.5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-[#0e0e10] break-words hyphens-auto"
            >
              {t("services.title1", lang)}{" "}
              <span className="text-[#86868b]">{t("services.title2", lang)}</span>
            </motion.h2>
          </div>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-[1.0625rem] md:text-[1.1875rem] text-[#86868b] leading-relaxed font-medium"
          >
            {t("services.description", lang)}
          </motion.p>
        </div>

        {/* ── System Cards ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">
          {cards.map((card, index) => {
            const Icon = card.Icon;
            const isDark = card.dark;

            return (
          <motion.a
            key={card.number}
            href="/services"
            className={`${card.className} ${cardBase} ${
              isDark
                ? "border-[#0e0e10] bg-[#0e0e10] text-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] hover:shadow-[0_28px_80px_rgba(0,0,0,0.2)]"
                : "border-black/[0.06] bg-[#fafafa] text-[#0e0e10] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            } no-underline`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            {card.badge && (
              <span className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-bold tracking-wide text-white ring-1 ring-white/10">
                {card.badge}
              </span>
            )}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Icon
                  className={`h-8 w-8 shrink-0 ${isDark ? "text-white" : "text-[#007aff]"}`}
                  strokeWidth={1.8}
                />
                <span
                  className={`text-[0.75rem] font-black uppercase tracking-[0.14em] ${
                    isDark ? "text-white/35" : "text-[#007aff]/70"
                  }`}
                >
                  {card.number}
                </span>
              </div>
              <h3
                className={`text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-[#0e0e10]"
                }`}
              >
                {card.title}
              </h3>
              <p className={`text-[0.9375rem] leading-relaxed ${isDark ? "text-white/55" : "text-[#86868b]"}`}>
                {card.description}
              </p>
            </div>
            {card.footer ? (
              <div className={`mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-semibold ${isDark ? "text-white/70" : "text-[#0e0e10]/60"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
                {card.footer}
              </div>
            ) : (
              <div
                className={`flex items-center gap-1.5 mt-6 text-[0.875rem] font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  isDark ? "text-white" : "text-[#007aff]"
                }`}
              >
                {t("services.learnMore", lang)} <ArrowUpRight size={15} />
              </div>
            )}
          </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
