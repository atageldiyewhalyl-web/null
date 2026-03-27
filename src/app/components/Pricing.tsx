import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Pricing() {
  const { lang } = useLanguage();
  const [billingType, setBillingType] = useState<"onetime" | "monthly">("onetime");

  const oneTimePlans = [
    {
      nameKey: "pricing.starter",
      price: "549",
      descKey: "pricing.starter.desc",
      featureKeys: [
        "pricing.starter.f1", "pricing.starter.f2", "pricing.starter.f3",
        "pricing.starter.f4", "pricing.starter.f5", "pricing.starter.f6",
      ],
      highlight: false,
    },
    {
      nameKey: "pricing.growth",
      price: "849",
      descKey: "pricing.growth.desc",
      featureKeys: [
        "pricing.growth.f1", "pricing.growth.f2", "pricing.growth.f3", "pricing.growth.f4",
        "pricing.growth.f5", "pricing.growth.f6", "pricing.growth.f7",
      ],
      highlight: true,
    },
    {
      nameKey: "pricing.premium",
      price: "1199",
      descKey: "pricing.premium.desc",
      featureKeys: [
        "pricing.premium.f1", "pricing.premium.f2", "pricing.premium.f3", "pricing.premium.f4",
        "pricing.premium.f5", "pricing.premium.f6", "pricing.premium.f7", "pricing.premium.f8",
      ],
      highlight: false,
    },
  ];

  const monthlyPlans = [
    {
      nameKey: "pricing.monthly.wartung",
      price: "75",
      descKey: "pricing.monthly.wartung.desc",
      featureKeys: [
        "pricing.monthly.f1", "pricing.monthly.f2", "pricing.monthly.f3", "pricing.monthly.f4",
      ],
      highlight: false,
    },
    {
      nameKey: "pricing.monthly.seo",
      price: "150",
      descKey: "pricing.monthly.seo.desc",
      featureKeys: [
        "pricing.monthly.f5", "pricing.monthly.f6", "pricing.monthly.f7", "pricing.monthly.f8", "pricing.monthly.f9",
      ],
      highlight: true,
    },
    {
      nameKey: "pricing.monthly.combined",
      price: "220",
      descKey: "pricing.monthly.combined.desc",
      featureKeys: [
        "pricing.monthly.f10", "pricing.monthly.f11", "pricing.monthly.f12", "pricing.monthly.f13", "pricing.monthly.f14",
      ],
      highlight: false,
    },
  ];

  const plans = billingType === "onetime" ? oneTimePlans : monthlyPlans;

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[0.875rem] tracking-[0.1em] uppercase text-[#0071e3] mb-4">
            {t("pricing.label", lang)}
          </p>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] leading-[1.15] mb-6"
            style={{ fontWeight: 600 }}
          >
            {t("pricing.title1", lang)}
            <br />
            {t("pricing.title2", lang)}
          </h2>
          <p className="text-[1.0625rem] text-muted-foreground leading-relaxed">
            {t("pricing.description", lang)}
          </p>
        </div>

        {/* Improved Toggle UI */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#f5f5f7] p-1.5 rounded-full flex items-center gap-1 shadow-sm border border-black/5">
            <button
              onClick={() => setBillingType("onetime")}
              className={`px-8 py-2.5 rounded-full text-[0.875rem] font-medium transition-all duration-300 ${
                billingType === "onetime"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.billing.onetime", lang)}
            </button>
            <button
              onClick={() => setBillingType("monthly")}
              className={`px-8 py-2.5 rounded-full text-[0.875rem] font-medium transition-all duration-300 ${
                billingType === "monthly"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.billing.monthly", lang)}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[40rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={billingType}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {plans.map((plan, i) => (
                <div
                  key={plan.nameKey}
                  className={`relative rounded-3xl p-8 border transition-all duration-300 ${
                    plan.highlight
                      ? "border-foreground bg-foreground text-background shadow-xl"
                      : "border-black/5 bg-white hover:border-black/10 shadow-sm"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0071e3] text-white text-[0.75rem] px-4 py-1 rounded-full tracking-wide font-medium">
                      {t("pricing.popular", lang)}
                    </div>
                  )}
                  <p
                    className={`text-[0.75rem] tracking-[0.1em] uppercase mb-4 font-semibold ${
                      plan.highlight ? "text-background/50" : "text-muted-foreground"
                    }`}
                  >
                    {t(plan.nameKey, lang)}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[2.75rem] tracking-[-0.03em]" style={{ fontWeight: 600 }}>
                      €{plan.price}
                    </span>
                    {billingType === "monthly" && (
                      <span className={`text-[0.9375rem] ${plan.highlight ? "text-background/50" : "text-muted-foreground"}`}>
                        / {t("pricing.billing.monthly", lang).split(' ')[0].toLowerCase()}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[0.9375rem] mb-8 leading-relaxed h-[3rem] ${
                      plan.highlight ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    {t(plan.descKey, lang)}
                  </p>

                  <ul className="space-y-4 mb-10 min-h-[14rem]">
                    {plan.featureKeys.map((fk: string) => (
                      <li key={fk} className="flex items-start gap-3">
                        <Check
                          size={18}
                          className={`mt-0.5 shrink-0 ${
                            plan.highlight ? "text-[#30d158]" : "text-[#0071e3]"
                          }`}
                        />
                        <span
                          className={`text-[0.875rem] leading-snug font-medium ${
                            plan.highlight ? "text-background/80" : "text-muted-foreground"
                          }`}
                        >
                          {t(fk, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.nameKey === "pricing.premium" && billingType === "onetime" && (
                    <div className="mb-8 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-[0.8125rem] text-[#0071e3] font-semibold text-center">
                        {t("pricing.premium.bonus", lang)}
                      </p>
                    </div>
                  )}

                  <a
                    href="#contact"
                    className={`block text-center text-[0.875rem] py-3.5 rounded-full font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? "bg-white text-foreground hover:bg-white/90 shadow-md"
                        : "bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                    }`}
                  >
                    {t("nav.getStarted", lang)}
                  </a>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
