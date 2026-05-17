import { ArrowRight, ChevronRight } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
// @ts-ignore - Vite resolves video assets at build time
import heroBackgroundVideo from "../assets/Hero background photo.webm";
// @ts-ignore - Vite resolves image assets at build time
import heroBackgroundPoster from "../assets/Hero background/Hero Background.png";
// @ts-ignore - Vite imagetools emits an optimized mobile WebP asset at build time
import heroIphoneBackground from "../assets/Hero iphone.png?format=webp&w=1200";
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
    <section aria-label="Hero" className="relative flex min-h-[100svh] w-full max-w-[100vw] overflow-hidden bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(7rem+env(safe-area-inset-top))] md:min-h-screen md:py-24">
      {/* Precision Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroIphoneBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-bottom md:hidden"
        />
        <div className="absolute inset-0 bg-white/35 md:hidden" />
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

      <div className="mx-auto max-w-7xl relative z-10 flex w-full min-w-0 flex-col items-center justify-center md:min-h-[calc(100vh-6rem)]">
        <div className="-mt-14 flex w-full min-w-0 max-w-full flex-col items-center text-center md:-mt-24">
          <div
            className="hidden max-w-full min-w-0 items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f2f7] text-[#007aff] text-[0.8125rem] md:flex md:text-[0.875rem] font-bold mb-5 md:mb-12 transition-transform hover:scale-[1.02]"
          >
            <span className="max-w-full whitespace-normal text-center leading-tight break-words">
              {t("hero.eyebrow", lang)}
            </span>
          </div>

          <div className="-translate-y-7 md:translate-y-0">
            <h1
              className="w-full max-w-[24rem] min-w-0 break-words text-[clamp(2.05rem,9vw,2.65rem)] leading-[1] tracking-[-0.045em] text-[#0e0e10] mb-4 md:mb-10 md:max-w-full md:text-[clamp(2.5rem,4vw,4rem)] md:leading-[1.1] md:tracking-[-0.04em] text-balance"
            >
              <span className="block">
                <span className="md:hidden whitespace-nowrap">{t("hero.line1Mobile", lang)}</span>
                <span className="hidden md:inline md:whitespace-nowrap">{t("hero.line1", lang)}</span>
              </span>
              <span className="block text-[#86868b]">
                <span className="md:hidden whitespace-nowrap text-[clamp(1.65rem,7.4vw,2.2rem)]">{t("hero.line2Mobile", lang)}</span>
                <span className="hidden md:inline md:whitespace-nowrap">{t("hero.line2", lang)}</span>
              </span>
            </h1>

            <p
              className="w-full max-w-[21rem] min-w-0 text-[0.9375rem] md:text-[1.375rem] text-[#86868b] md:max-w-4xl mb-10 md:mb-16 leading-relaxed font-medium text-balance"
            >
              <span className="md:hidden">{t("hero.descriptionMobile", lang)}</span>
              <span className="hidden md:block">{t("hero.description", lang)}</span>
            </p>
          </div>

          <div
            className="flex w-full max-w-[22rem] flex-col sm:flex-row items-center gap-3 md:gap-5 mb-10 md:mb-0 md:max-w-none md:justify-center"
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
          </div>

          {/* Mobile Trust Ribbon (Infinite Marquee) */}
          <div
            className="md:hidden w-full max-w-full mt-14 mb-4 relative translate-y-10 overflow-hidden"
          >
            <div
              className="max-w-full overflow-hidden border-y border-black/[0.06] bg-[#fafafa] py-4 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.35)] [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
            >
              <div
                className="mobile-trust-marquee inline-flex w-max max-w-none items-center gap-9 px-7"
              >
                {[1, 2, 3].map((set) =>
                  proofCards.map((card) => (
                    <article
                      key={`${set}-${card.label}`}
                      className="grid w-[12rem] shrink-0 grid-cols-[2.35rem_minmax(0,1fr)] items-center gap-3 text-left"
                    >
                      {card.logos ? (
                        <div className="flex h-9 w-9 shrink-0 flex-wrap content-center items-center justify-center gap-1" aria-hidden="true">
                          {card.logos.map((logo, index) => (
                            <img
                              key={logo}
                              src={logo}
                              alt=""
                              className={`${index === 2 ? "h-3 w-3" : "h-4 w-4"} object-contain`}
                            />
                          ))}
                        </div>
                      ) : (
                        <img
                          src={card.icon}
                          alt=""
                          aria-hidden="true"
                          className={`${card.iconClassName} max-h-9 max-w-9 shrink-0 object-contain mix-blend-multiply`}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-[1.05rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0e0e10]">
                          {card.value}
                        </div>
                        <div className="mt-1 truncate text-[0.6rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-[#86868b]">
                          {card.label}
                        </div>
                      </div>
                    </article>
                  )),
                )}
              </div>
            </div>
          </div>

          {/* Performance Proof Bar - Desktop Only */}
          <div
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
          </div>
        </div>
      </div>
    </section>
  );
}
