import { ArrowRight, Check } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { LeadCapture } from "./LeadCapture";

interface PricingProps {
  onOpenQuote: () => void;
}

export function Pricing({ onOpenQuote }: PricingProps) {
  const { lang } = useLanguage();
  const quoteCta =
    lang === "de"
      ? "60-Sekunden Angebot starten"
      : lang === "tr"
        ? "60 saniyelik teklifi başlat"
        : "Start your 60-second quote";
  const quoteHint =
    lang === "de"
      ? "Kostenlos, unverbindlich und direkt auf Sie zugeschnitten."
      : lang === "tr"
        ? "Ücretsiz, bağlayıcı değil ve size özel."
        : "Free, no obligation, and tailored to your project.";

  const trustPoints = [
    t("pricing.individual.trust.generic", lang),
    t("pricing.individual.trust.costs", lang),
    t("pricing.individual.trust.roadmap", lang),
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-6">
              {t("pricing.individual.label", lang)}
            </p>
            <h2 className={`${lang === "de" ? "text-[clamp(2.2rem,9vw,2.65rem)] md:text-[clamp(2.25rem,3.7vw,2.95rem)]" : "text-[clamp(2.25rem,6vw,4.25rem)]"} tracking-tight leading-[1.02] mb-7 font-bold text-[#0e0e10] md:leading-[1.05]`}>
              {lang === "de" ? (
                <>
                  <span className="block whitespace-nowrap md:hidden">Ihr Preis.</span>
                  <span className="block whitespace-nowrap md:hidden">In 60 Sekunden.</span>
                  <span className="hidden md:block md:whitespace-nowrap">Ihr individueller Preis</span>
                  <span className="hidden md:block md:whitespace-nowrap">in 60 Sekunden.</span>
                </>
              ) : (
                t("pricing.individual.title", lang)
              )}
            </h2>
            <p className="mx-auto max-w-[42rem] text-[1.125rem] font-medium leading-relaxed text-[#86868b] md:text-[1.3125rem] lg:mx-0">
              {t("pricing.individual.description", lang)}
            </p>

            <div className="mt-9 flex flex-col items-center lg:hidden">
              <button
                onClick={onOpenQuote}
                className="group/btn relative flex w-full max-w-[22rem] items-center justify-center gap-3 overflow-hidden rounded-full bg-[#007aff] px-6 py-4 text-[1rem] font-bold text-white shadow-[0_18px_35px_-16px_rgba(0,122,255,0.9)] transition-all hover:bg-[#006ee6] active:scale-[0.98]"
              >
                <span className="absolute inset-x-6 top-0 h-px bg-white/45" />
                <span>{quoteCta}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18 transition-transform group-hover/btn:translate-x-0.5">
                  <ArrowRight size={17} />
                </span>
              </button>
              <p className="mt-5 max-w-[21rem] text-[0.78rem] font-semibold leading-snug text-[#86868b]">
                {quoteHint}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:mt-10">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start justify-center gap-2.5 text-center text-[0.875rem] font-semibold leading-snug text-[#6e6e73] lg:justify-start lg:text-left">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#007aff]/10 text-[#007aff]">
                    <Check size={13} strokeWidth={2.4} />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <LeadCapture variant="embedded" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
