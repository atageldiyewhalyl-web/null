import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Pricing() {
  const { lang } = useLanguage();
  const [billingType, setBillingType] = useState<"onetime" | "monthly">("onetime");

  const oneTimePlans = [
    {
      id: "starter",
      nameKey: "pricing.starter",
      price: "549",
      descKey: "pricing.starter.desc",
      featureKeys: [
        "pricing.starter.f1", "pricing.starter.f2", "pricing.starter.f3",
        "pricing.starter.f4", "pricing.starter.f5"
      ],
      highlight: false,
      ctaKey: "pricing.cta.start",
      showRetainer: true
    },
    {
      id: "growth",
      nameKey: "pricing.growth",
      price: "849",
      badgeKey: "pricing.growth.badge",
      descKey: "pricing.growth.desc",
      featureKeys: [
        "pricing.growth.f1", "pricing.growth.f2", "pricing.growth.f3", 
        "pricing.growth.f4", "pricing.growth.f5", "pricing.growth.f6", 
        "pricing.growth.f7"
      ],
      highlight: true,
      ctaKey: "pricing.cta.start",
      showRetainer: true
    },
    {
      id: "premium",
      nameKey: "pricing.premium",
      price: "1199",
      descKey: "pricing.premium.desc",
      featureKeys: [
        "pricing.premium.f1", "pricing.premium.f2", "pricing.premium.f3", 
        "pricing.premium.f4", "pricing.premium.f5", "pricing.premium.f6", 
        "pricing.premium.f7", "pricing.premium.f8"
      ],
      highlight: false,
      ctaKey: "pricing.cta.start",
      showRetainer: true
    },
  ];

  const monthlyPlans = [
    {
      id: "seo-maintenance",
      nameKey: "pricing.retainer.seo",
      price: "170",
      badgeKey: "pricing.retainer.seo.badge",
      descKey: "pricing.retainer.seo.desc",
      featureKeys: [
        "pricing.retainer.seo.f1", "pricing.retainer.seo.f2", 
        "pricing.retainer.seo.f3", "pricing.retainer.seo.f4", 
        "pricing.retainer.seo.f5"
      ],
      highlight: true,
      ctaKey: "pricing.cta.upgrade",
      priceSuffixKey: "pricing.retainer.seo.priceSuffix"
    },
    {
      id: "growth-maintenance",
      nameKey: "pricing.retainer.growth",
      price: "220",
      descKey: "pricing.retainer.growth.desc",
      featureKeys: [
        "pricing.retainer.growth.f1", "pricing.retainer.growth.f2", 
        "pricing.retainer.growth.f3", "pricing.retainer.growth.f4", 
        "pricing.retainer.growth.f5"
      ],
      highlight: false,
      ctaKey: "pricing.cta.upgrade",
      priceSuffixKey: "pricing.retainer.seo.priceSuffix"
    },
  ];

  const plans = billingType === "onetime" ? oneTimePlans : monthlyPlans;

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-6">
            {t("pricing.label", lang)}
          </p>
          <h2
            className="text-[clamp(2.25rem,6vw,3.75rem)] tracking-tight leading-[1.05] mb-6 font-bold text-[#0e0e10]"
          >
            {t("pricing.title1", lang)}
            <br className="hidden sm:block" />
            {" "}{t("pricing.title2", lang)}
          </h2>
          <p className="text-[1.125rem] md:text-[1.25rem] text-[#86868b] leading-relaxed font-medium">
            {t("pricing.description", lang)}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#f5f5f7] p-1.5 rounded-full flex items-center gap-1 shadow-sm border border-black/[0.03]">
            <button
              onClick={() => setBillingType("onetime")}
              className={`px-6 md:px-10 py-3 rounded-full text-[0.875rem] font-bold transition-all duration-300 ${
                billingType === "onetime"
                  ? "bg-white text-[#0e0e10] shadow-md"
                  : "text-[#86868b] hover:text-[#0e0e10]"
              }`}
            >
              {t("pricing.tab.websites", lang)}
            </button>
            <button
              onClick={() => setBillingType("monthly")}
              className={`px-6 md:px-10 py-3 rounded-full text-[0.875rem] font-bold transition-all duration-300 ${
                billingType === "monthly"
                  ? "bg-white text-[#0e0e10] shadow-md"
                  : "text-[#86868b] hover:text-[#0e0e10]"
              }`}
            >
              {t("pricing.tab.retainer", lang)}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={billingType}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {billingType === "monthly" && (
              <p className="text-center text-[1rem] font-bold text-[#0e0e10] mb-12">
                {t("pricing.retainer.intro", lang)}
              </p>
            )}

            <div className={`grid grid-cols-1 ${billingType === "onetime" ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl mx-auto"} gap-6`}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-[2rem] p-8 md:p-10 border transition-all duration-500 overflow-hidden flex flex-col ${
                    plan.highlight
                      ? "border-[#0e0e10] bg-[#0e0e10] text-white shadow-2xl hover:shadow-black/20"
                      : "border-black/[0.06] bg-[#fafafa] hover:border-black/[0.1] shadow-sm"
                  }`}
                >
                  {plan.badgeKey && (
                    <div className={`absolute top-0 right-0 px-5 py-1.5 rounded-bl-2xl text-[0.6875rem] font-bold tracking-wider ${
                        plan.highlight ? "bg-[#007aff] text-white" : "bg-[#007aff] text-white"
                    }`}>
                      {t(plan.badgeKey, lang)}
                    </div>
                  )}
                  
                  <div className="mb-8">
                      <p
                        className={`text-[0.8125rem] tracking-[0.14em] uppercase mb-4 font-bold ${
                          plan.highlight ? "text-white/40" : "text-[#007aff]"
                        }`}
                      >
                        {t(plan.nameKey, lang)}
                      </p>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-[3rem] md:text-[3.5rem] tracking-tight font-extrabold" style={{ letterSpacing: "-0.04em" }}>
                          €{plan.price}
                        </span>
                        {plan.priceSuffixKey && (
                          <span className={`text-[1rem] font-bold ${plan.highlight ? "text-white/40" : "text-[#86868b]"}`}>
                            {t(plan.priceSuffixKey, lang)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[1.0625rem] leading-relaxed font-medium min-h-[3.5rem] md:min-h-[auto] mb-2 ${
                          plan.highlight ? "text-white/60" : "text-[#86868b]"
                        }`}
                      >
                        {t(plan.descKey, lang)}
                      </p>
                      
                      {plan.showRetainer && (
                        <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.75rem] font-bold ${
                            plan.highlight ? "bg-white/10 text-white/80" : "bg-black/[0.04] text-[#0e0e10]/60"
                        }`}>
                          <div className="w-1 h-1 rounded-full bg-[#34c759]" />
                          {t("pricing.includedRetainer", lang)}
                        </div>
                      )}
                  </div>

                  <div className={`h-px w-full mb-8 ${plan.highlight ? "bg-white/10" : "bg-black/[0.06]"}`} />

                  <ul className="space-y-4 mb-12 flex-1">
                    {plan.featureKeys.map((fk: string) => (
                      <li key={fk} className="flex items-start gap-4">
                        <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                            plan.highlight ? "bg-white/10 text-[#34c759]" : "bg-black/[0.04] text-[#007aff]"
                        }`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span
                          className={`text-[0.9375rem] leading-snug font-bold ${
                            plan.highlight ? "text-white/80" : "text-[#0e0e10]/80"
                          }`}
                        >
                          {t(fk, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`block text-center text-[1rem] py-4 rounded-full font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                      plan.highlight
                        ? "bg-white text-[#0e0e10] hover:bg-[#f5f5f7] shadow-xl"
                        : "bg-[#0e0e10] text-white hover:bg-[#2c2c2e] shadow-lg shadow-black/5"
                    }`}
                  >
                    {t(plan.ctaKey, lang)}
                  </a>
                </div>
              ))}
            </div>

            {billingType === "monthly" && (
              <div className="mt-20 text-center max-w-2xl mx-auto space-y-6">
                  <div className="h-px w-24 bg-black/[0.1] mx-auto mb-8" />
                  <p className="text-[0.875rem] text-[#86868b] font-bold leading-relaxed px-6">
                    {t("pricing.retainer.disclaimer", lang)}
                  </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
