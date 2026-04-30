import { ArrowRight, ChevronRight } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";
// @ts-ignore - Vite resolves video assets at build time
import heroBackgroundVideo from "../assets/Hero background/hero-background-long.webm";
// @ts-ignore - Vite resolves video assets at build time
import heroBackgroundVideoMp4 from "../assets/Hero background/hero-background-long.optimized.mp4";
// @ts-ignore - Vite resolves image assets at build time
import heroBackgroundPoster from "../assets/Hero background/Hero Background.png";

export function Hero() {
  const { lang } = useLanguage();
  const proofCards = [
    {
      label: t("hero.card1.label", lang),
      value: t("hero.card1.value", lang),
      sub: t("hero.card1.sub", lang),
      dark: false,
    },
    {
      label: t("hero.card2.label", lang),
      value: t("hero.card2.value", lang),
      sub: t("hero.card2.sub", lang),
      dark: false,
    },
    {
      label: t("hero.card3.label", lang),
      value: t("hero.card3.value", lang),
      sub: t("hero.card3.sub", lang),
      dark: false,
    },
    {
      label: t("hero.card4.label", lang),
      value: t("hero.card4.value", lang),
      sub: t("hero.card4.sub", lang),
      dark: true,
    },
  ];
  const trustAvatars = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
  ];

  return (
    <section aria-label="Hero" className="relative w-full max-w-[100vw] pt-32 pb-24 md:pt-52 md:pb-40 px-4 overflow-hidden bg-white">
      {/* Precision Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white md:hidden" />
        <video
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroBackgroundPoster}
        >
          <source src={heroBackgroundVideo} type="video/webm" />
          <source src={heroBackgroundVideoMp4} type="video/mp4" />
        </video>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 min-w-0">
        <div className="flex min-w-0 flex-col items-center text-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex max-w-full min-w-0 items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f2f7] text-[#007aff] text-[0.8125rem] md:text-[0.875rem] font-bold mb-10 md:mb-12 transition-transform hover:scale-[1.02]"
          >
            <span className="max-w-full whitespace-normal text-center leading-tight break-words">
              {t("hero.eyebrow", lang)}
            </span>
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-full min-w-0 text-[clamp(2.125rem,9.4vw,4.5rem)] leading-[1.1] tracking-[-0.04em] font-bold text-[#0e0e10] mb-8 md:mb-10 text-balance"
          >
            <span className="block">
              <span className="md:hidden">{t("hero.line1Mobile", lang)}</span>
              <span className="hidden md:inline">{t("hero.line1", lang)}</span>
            </span>
            <span className="block text-[#86868b]">
              <span className="md:hidden">{t("hero.line2Mobile", lang)}</span>
              <span className="hidden md:inline">{t("hero.line2", lang)}</span>
            </span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-full min-w-0 text-[1.0625rem] md:text-[1.375rem] text-[#86868b] md:max-w-4xl mb-12 md:mb-16 leading-relaxed font-medium text-balance"
          >
            <span className="md:hidden">{t("hero.descriptionMobile", lang)}</span>
            <span className="hidden md:block">{t("hero.description", lang)}</span>
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 mb-20 md:mb-24"
          >
            <a
              href="/#pricing"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-[#007aff] text-white px-8 md:px-12 py-4 md:py-6 rounded-full text-[1rem] md:text-[1.125rem] font-bold hover:bg-[#0066d6] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/10"
            >
              {t("hero.cta", lang)} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
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
            className="md:hidden w-full max-w-full mb-16 relative overflow-hidden"
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

          {/* Performance Cards - Desktop Only */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden md:block w-full max-w-6xl mb-24 md:mb-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
              {proofCards.map((card) => {
                return (
                  <div
                    key={card.label}
                    className={`rounded-[1.75rem] p-7 border text-left min-h-[170px] flex flex-col justify-between ${
                      card.dark
                        ? "bg-[#0e0e10] text-white border-[#0e0e10] shadow-xl shadow-black/10"
                        : "bg-[#f5f5f7] text-[#0e0e10] border-[#d2d2d7]/30"
                    }`}
                  >
                    <div>
                      <div
                        className={`text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-3 ${
                          card.dark ? "text-white/45" : "text-[#86868b]"
                        }`}
                      >
                        {card.label}
                      </div>
                      <div className="text-[1.375rem] font-extrabold tracking-tight leading-tight">
                        {card.value}
                      </div>
                    </div>
                    <div
                      className={`text-[0.8125rem] font-medium leading-normal mt-4 ${
                        card.dark ? "text-white/45" : "text-[#86868b]"
                      }`}
                    >
                      {card.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Trust Bar Line - Desktop Only */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="hidden md:flex flex-col md:flex-row items-center justify-center gap-4 text-center"
          >
            <div className="flex -space-x-2">
              {trustAvatars.map((avatar) => (
                <div key={avatar} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                  <img
                    src={avatar}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <p className="text-[0.875rem] md:text-[1rem] text-[#86868b] font-medium px-4">
                {t("hero.trustBar", lang)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
