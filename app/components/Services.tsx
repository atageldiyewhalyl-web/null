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
import { useRef, useState, type UIEvent } from "react";
import { useLanguage, t } from "./LanguageContext";
import conversionVisualEn from "../assets/services/english conversion.png";
import conversionVisualDe from "../assets/services/german conversion.png";
import conversionVisualEnMobile from "../assets/services/eng conversion mobile .png";
import conversionVisualDeMobile from "../assets/services/German conversion mobile .png";
import scrollableCredentialOneEn from "../assets/services/Scrollable credential eng 1.png";
import scrollableCredentialTwoEn from "../assets/services/Scrollable credential eng 2.png";
import scrollableCredentialThreeEn from "../assets/services/Scrollable credential eng 2.png.png";
import scrollableCredentialOneDe from "../assets/services/Scrollable credential 1 german.png";
import scrollableCredentialTwoDe from "../assets/services/Scrollable credential 2 german.png";
import scrollableCredentialThreeDe from "../assets/services/Scrollable credential 3 German.png";

export function Services() {
  const { lang } = useLanguage();
  const mobileFlowScrollerRef = useRef<HTMLDivElement>(null);
  const [activeMobileFlowSlide, setActiveMobileFlowSlide] = useState(0);
  const conversionVisual = lang === "de" ? conversionVisualDe : conversionVisualEn;
  const conversionVisualMobile = lang === "de" ? conversionVisualDeMobile : conversionVisualEnMobile;
  const mobileFlowSlides =
    lang === "de"
      ? [scrollableCredentialOneDe, scrollableCredentialTwoDe, scrollableCredentialThreeDe]
      : [scrollableCredentialOneEn, scrollableCredentialTwoEn, scrollableCredentialThreeEn];

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
    "group relative flex min-h-[11.25rem] flex-col overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-white p-4 transition-all duration-300 md:min-h-[14rem] md:justify-between md:rounded-[1.75rem] md:p-7";

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

          <div className="md:hidden">
            <div
              ref={mobileFlowScrollerRef}
              className="relative left-1/2 flex w-screen -translate-x-1/2 snap-x snap-mandatory gap-5 overflow-x-auto px-3 pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label={t("services.flow.aria", lang)}
              onScroll={handleMobileFlowScroll}
            >
              {mobileFlowSlides.map((slide, index) => (
                <div
                  key={slide}
                  className="w-[94vw] flex-none snap-center"
                >
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

          <div className="relative left-1/2 hidden w-[124vw] max-w-none -translate-x-1/2 overflow-hidden md:left-auto md:mx-auto md:block md:w-full md:max-w-[1320px] md:translate-x-0">
            <picture>
              <source media="(max-width: 767px)" srcSet={conversionVisualMobile} />
              <img
                src={conversionVisual}
                alt=""
                aria-hidden="true"
                className="w-full object-contain"
              />
            </picture>
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
              className={`max-w-full font-bold leading-[1.08] text-[#0e0e10] md:text-[clamp(2.15rem,5.5vw,3.75rem)] md:tracking-tight ${
                lang === "de"
                  ? "whitespace-nowrap text-[clamp(1.76rem,7.3vw,2.05rem)] tracking-[-0.055em]"
                  : "text-[clamp(2.15rem,5.5vw,3.75rem)] tracking-tight break-words hyphens-auto"
              }`}
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-12 auto-rows-auto">
          {cards.map((card, index) => {
            const Icon = card.Icon;
            const isDark = card.dark;

            return (
          <motion.a
            key={card.number}
            href="/services"
            className={`${card.className} ${cardBase} ${
              isDark
                ? "text-[#0e0e10] md:border-[#0e0e10] md:bg-[#0e0e10] md:text-white md:shadow-[0_24px_70px_rgba(0,0,0,0.14)] md:hover:shadow-[0_28px_80px_rgba(0,0,0,0.2)]"
                : "text-[#0e0e10] md:border-black/[0.06] md:bg-[#fafafa] md:hover:-translate-y-0.5 md:hover:bg-white md:hover:shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            } no-underline`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            {card.badge && (
              <span className="absolute right-5 top-5 hidden rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-bold tracking-wide text-white ring-1 ring-white/10 md:inline-flex">
                {card.badge}
              </span>
            )}
            <div>
              <div className="mb-4 flex items-center gap-2.5 md:gap-3 md:mb-5">
                <Icon
                  className={`h-5 w-5 shrink-0 md:h-8 md:w-8 ${isDark ? "text-[#007aff] md:text-white" : "text-[#007aff]"}`}
                  strokeWidth={1.8}
                />
                <span
                  className={`text-[0.6875rem] font-black uppercase tracking-[0.12em] md:text-[0.75rem] md:tracking-[0.14em] ${
                    isDark ? "text-[#007aff]/70 md:text-white/35" : "text-[#007aff]/70"
                  }`}
                >
                  {card.number}
                </span>
              </div>
              <h3
                className={`mb-2 text-[1rem] font-bold leading-tight tracking-tight md:mb-3 md:text-[1.4375rem] ${
                  isDark ? "text-[#0e0e10] md:text-white" : "text-[#0e0e10]"
                }`}
              >
                {card.title}
              </h3>
              <p className={`text-[0.75rem] leading-relaxed md:text-[0.9375rem] ${isDark ? "text-[#86868b] md:text-white/55" : "text-[#86868b]"}`}>
                {card.description}
              </p>
            </div>
            {card.footer ? (
              <div className={`mt-4 hidden items-center gap-2 text-[0.8125rem] font-semibold md:mt-6 md:inline-flex ${isDark ? "text-[#0e0e10]/60 md:text-white/70" : "text-[#0e0e10]/60"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
                {card.footer}
              </div>
            ) : (
              <div
                className={`mt-4 hidden items-center gap-1.5 text-[0.875rem] font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:mt-6 md:flex ${
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
