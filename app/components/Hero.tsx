import { ArrowRight, ChevronRight } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";
// @ts-ignore - Vite resolves video assets at build time
import heroBackgroundVideo from "../assets/Hero background photo.webm";
// @ts-ignore - Vite resolves image assets at build time
import heroBackgroundPoster from "../assets/Hero background/Hero Background.png";
// @ts-ignore - Vite resolves image assets at build time
import moneyIcon from "../assets/icons/money icon.png";
// @ts-ignore - Vite resolves image assets at build time
import searchIcon from "../assets/icons/search icon.png";
// @ts-ignore - Vite resolves image assets at build time
import impressionsIcon from "../assets/icons/impressions icon.png";
// @ts-ignore - Vite resolves image assets at build time
import chatgptLogo from "../assets/icons/ChatGPT-Logo.png";
// @ts-ignore - Vite resolves image assets at build time
import geminiLogo from "../assets/icons/gemini-google-icon-symbol-logo-free-png.png.webp";
// @ts-ignore - Vite resolves image assets at build time
import claudeLogo from "../assets/icons/claude-logo.svg";

export function Hero() {
  const { lang } = useLanguage();
  const proofCards = [
    {
      label: t("hero.card1.label", lang),
      value: t("hero.card1.value", lang),
      sub: t("hero.card1.sub", lang),
      icon: moneyIcon,
      iconClassName: "h-[3.75rem] w-[3.75rem] -ml-1 -mt-1",
      subClassName: "max-w-[14.5rem]",
    },
    {
      label: t("hero.card2.label", lang),
      value: t("hero.card2.value", lang),
      sub: t("hero.card2.sub", lang),
      icon: searchIcon,
      iconClassName: "h-12 w-12",
    },
    {
      label: t("hero.card3.label", lang),
      value: t("hero.card3.value", lang),
      sub: t("hero.card3.sub", lang),
      icon: impressionsIcon,
      iconClassName: "h-[3.625rem] w-[3.625rem] -ml-1 -mt-1",
    },
    {
      label: t("hero.card4.label", lang),
      value: t("hero.card4.value", lang),
      sub: t("hero.card4.sub", lang),
      logos: [chatgptLogo, geminiLogo, claudeLogo],
      subClassName: "max-w-[14.5rem]",
    },
  ];

  return (
    <section aria-label="Hero" className="relative flex min-h-screen w-full max-w-[100vw] overflow-hidden bg-white px-4 py-12 md:py-24">
      {/* Precision Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white md:hidden" />
        <video
          aria-hidden="true"
          className="hero-background-motion absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroBackgroundPoster}
        >
          <source src={heroBackgroundVideo} type="video/webm" />
        </video>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex min-h-[calc(100vh-6rem)] min-w-0 flex-col items-center justify-center">
        <div className="flex min-w-0 flex-col items-center text-center md:-mt-24">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex max-w-full min-w-0 items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f2f7] text-[#007aff] text-[0.8125rem] md:text-[0.875rem] font-bold mb-5 md:mb-12 transition-transform hover:scale-[1.02]"
          >
            <span className="max-w-full whitespace-normal text-center leading-tight break-words">
              {t("hero.eyebrow", lang)}
            </span>
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-full min-w-0 text-[clamp(2.65rem,14vw,4.35rem)] md:text-[clamp(2.5rem,4vw,4rem)] leading-[0.96] md:leading-[1.1] tracking-[-0.055em] md:tracking-[-0.04em] font-bold text-[#0e0e10] mb-4 md:mb-10 text-balance"
          >
            <span className="block">
              <span className="md:hidden">{t("hero.line1Mobile", lang)}</span>
              <span className="hidden md:inline md:whitespace-nowrap">{t("hero.line1", lang)}</span>
            </span>
            <span className="block text-[#86868b]">
              <span className="md:hidden">{t("hero.line2Mobile", lang)}</span>
              <span className="hidden md:inline md:whitespace-nowrap">{t("hero.line2", lang)}</span>
            </span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-full min-w-0 text-[0.9375rem] md:text-[1.375rem] text-[#86868b] md:max-w-4xl mb-6 md:mb-16 leading-relaxed font-medium text-balance"
          >
            <span className="md:hidden">{t("hero.descriptionMobile", lang)}</span>
            <span className="hidden md:block">{t("hero.description", lang)}</span>
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 md:gap-5 mb-8 md:mb-0"
          >
            <a
              href="/#pricing"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-[#007aff] text-white px-8 md:px-9 py-3 md:py-4 rounded-full text-[0.9375rem] md:text-[1rem] font-semibold hover:bg-[#0066d6] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/10"
            >
              {t("hero.cta", lang)} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-1 text-[1rem] md:text-[1.125rem] font-bold text-[#0e0e10] hover:text-[#007aff] transition-colors group px-4 py-2"
            >
              {t("hero.secondary", lang)} <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Mobile Trust Ribbon (Infinite Marquee) */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="md:hidden w-full max-w-full mb-6 relative overflow-hidden"
          >
            <div
              className="max-w-full overflow-hidden border-y border-black/[0.06] bg-[#f5f5f7]/80 py-3 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
            >
              <motion.div
                animate={{ x: [0, -760] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="inline-flex w-max max-w-none items-center gap-8 whitespace-nowrap px-4"
              >
                {[1, 2, 3, 4].map((set) => (
                  <div key={set} className="flex items-center gap-8">
                    {[
                      t("hero.trustRibbon.t1", lang),
                      t("hero.trustRibbon.t2", lang),
                      t("hero.card3.value", lang),
                      t("hero.trustRibbon.t3", lang),
                    ].map((item) => (
                      <div key={`${set}-${item}`} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]/55" />
                        <span className="text-[0.75rem] font-black uppercase tracking-[0.22em] text-[#0e0e10]/60">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Performance Proof Bar - Desktop Only */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden md:block w-full max-w-6xl mt-20"
          >
            <div className="grid grid-cols-4 gap-8">
              {proofCards.map((card) => {
                return (
                  <article
                    key={card.label}
                    className="group grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-4 text-left"
                  >
                    {card.logos ? (
                      <div className="flex h-12 w-12 shrink-0 flex-wrap content-center items-center justify-center gap-1.5" aria-hidden="true">
                        {card.logos.map((logo, index) => {
                          return (
                            <img
                              key={logo}
                              src={logo}
                              alt=""
                              className={`${index === 2 ? "h-4 w-4" : "h-5 w-5"} object-contain transition-transform duration-500 group-hover:scale-110`}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <img
                        src={card.icon}
                        alt=""
                        aria-hidden="true"
                        className={`${card.iconClassName} shrink-0 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110`}
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-[0.625rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-[#86868b]">
                        {card.label}
                      </div>
                      <div className="mt-2 text-[1.125rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0e0e10]">
                        {card.value}
                      </div>
                      <p className={`mt-3 ${card.subClassName ?? "max-w-[11rem]"} text-[0.8125rem] font-medium leading-snug text-[#86868b]`}>
                        {card.sub}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
