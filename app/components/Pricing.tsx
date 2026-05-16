import { ArrowRight, Check } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { LeadCapture } from "./LeadCapture";

interface PricingProps {
  onOpenQuote: () => void;
}

export function Pricing({ onOpenQuote }: PricingProps) {
  const { lang } = useLanguage();

  const trustPoints = [
    t("pricing.individual.trust.generic", lang),
    t("pricing.individual.trust.costs", lang),
    t("pricing.individual.trust.roadmap", lang),
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl">
            <p className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-6">
              {t("pricing.individual.label", lang)}
            </p>
            <h2 className={`${lang === "de" ? "text-[clamp(2.25rem,3.7vw,2.95rem)]" : "text-[clamp(2.25rem,6vw,4.25rem)]"} tracking-tight leading-[1.05] mb-7 font-bold text-[#0e0e10]`}>
              {lang === "de" ? (
                <>
                  <span className="block md:whitespace-nowrap">Ihr individueller Preis</span>
                  <span className="block md:whitespace-nowrap">in 60 Sekunden.</span>
                </>
              ) : (
                t("pricing.individual.title", lang)
              )}
            </h2>
            <p className="text-[1.125rem] md:text-[1.3125rem] text-[#86868b] leading-relaxed font-medium max-w-[42rem]">
              {t("pricing.individual.description", lang)}
            </p>

            <button
              onClick={onOpenQuote}
              className="mt-10 group/btn inline-flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-7 py-4 rounded-full text-[0.9375rem] md:text-[1rem] font-bold hover:bg-[#2c2c2e] transition-all active:scale-95 shadow-lg shadow-black/10 lg:hidden"
            >
              {t("quote.teaser.cta", lang)}
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </button>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-[0.875rem] font-semibold leading-snug text-[#6e6e73]">
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
