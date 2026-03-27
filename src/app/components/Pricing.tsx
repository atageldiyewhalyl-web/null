import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Pricing() {
  const { lang } = useLanguage();

  const oneTimePlans = [
    {
      nameKey: "pricing.starter",
      price: "400",
      descKey: "pricing.starter.desc",
      featureKeys: [
        "pricing.starter.f1", "pricing.starter.f2", "pricing.starter.f3",
        "pricing.starter.f4", "pricing.starter.f5", "pricing.starter.f6",
      ],
      highlight: false,
    },
    {
      nameKey: "pricing.growth",
      price: "650",
      descKey: "pricing.growth.desc",
      featureKeys: [
        "pricing.growth.f1", "pricing.growth.f2", "pricing.growth.f3", "pricing.growth.f4",
        "pricing.growth.f5", "pricing.growth.f6", "pricing.growth.f7",
      ],
      highlight: true,
    },
    {
      nameKey: "pricing.premium",
      price: "1000",
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

  const PricingSection = ({ title, plans, isMonthly }: { title: string, plans: any[], isMonthly?: boolean }) => (
    <div className="mb-24 last:mb-0">
      <div className="flex items-center gap-4 mb-10">
        <h3 className="text-[0.8125rem] tracking-[0.12em] uppercase text-muted-foreground font-medium whitespace-nowrap">
          {title}
        </h3>
        <div className="h-[1px] w-full bg-black/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.nameKey}
            className={`relative rounded-2xl p-8 border ${
              plan.highlight
                ? "border-foreground bg-foreground text-background"
                : "border-black/10 bg-white"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0071e3] text-white text-[0.75rem] px-4 py-1 rounded-full tracking-wide">
                {t("pricing.popular", lang)}
              </div>
            )}
            <p
              className={`text-[0.8125rem] tracking-[0.05em] uppercase mb-4 ${
                plan.highlight ? "text-background/60" : "text-muted-foreground"
              }`}
            >
              {t(plan.nameKey, lang)}
            </p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[2.5rem] tracking-[-0.03em]" style={{ fontWeight: 600 }}>
                €{plan.price}
              </span>
              {isMonthly && (
                <span className={`text-[1rem] ${plan.highlight ? "text-background/60" : "text-muted-foreground"}`}>
                  / {t("pricing.billing.monthly", lang).toLowerCase()}
                </span>
              )}
            </div>
            <p
              className={`text-[0.875rem] mb-8 leading-relaxed h-[3rem] ${
                plan.highlight ? "text-background/70" : "text-muted-foreground"
              }`}
            >
              {t(plan.descKey, lang)}
            </p>

            <ul className="space-y-4 mb-8 min-h-[14rem]">
              {plan.featureKeys.map((fk: string) => (
                <li key={fk} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className={`mt-0.5 shrink-0 ${
                      plan.highlight ? "text-[#30d158]" : "text-[#0071e3]"
                    }`}
                  />
                  <span
                    className={`text-[0.875rem] leading-snug ${
                      plan.highlight ? "text-background/80" : "text-muted-foreground"
                    }`}
                  >
                    {t(fk, lang)}
                  </span>
                </li>
              ))}
            </ul>

            {plan.nameKey === "pricing.premium" && !isMonthly && (
              <p className="text-[0.8125rem] text-[#0071e3] font-medium mb-6">
                {t("pricing.premium.bonus", lang)}
              </p>
            )}

            <a
              href="#contact"
              className={`block text-center text-[0.875rem] py-3 rounded-full transition-colors ${
                plan.highlight
                  ? "bg-white text-foreground hover:bg-white/90"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {t("nav.getStarted", lang)}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
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

        <PricingSection 
          title={t("pricing.billing.onetime", lang) + " " + t("pricing.label", lang)} 
          plans={oneTimePlans} 
        />
        
        <PricingSection 
          title={t("pricing.monthly.label", lang)} 
          plans={monthlyPlans} 
          isMonthly 
        />
      </div>
    </section>
  );
}
