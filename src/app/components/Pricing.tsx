import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Pricing() {
  const { lang } = useLanguage();

  const plans = [
    {
      nameKey: "pricing.starter",
      price: "250",
      descKey: "pricing.starter.desc",
      featureKeys: [
        "pricing.starter.f1", "pricing.starter.f2", "pricing.starter.f3",
        "pricing.starter.f4", "pricing.starter.f5", "pricing.starter.f6", "pricing.starter.f7",
      ],
      highlight: false,
    },
    {
      nameKey: "pricing.growth",
      price: "400",
      descKey: "pricing.growth.desc",
      featureKeys: [
        "pricing.growth.f1", "pricing.growth.f2", "pricing.growth.f3", "pricing.growth.f4",
        "pricing.growth.f5", "pricing.growth.f6", "pricing.growth.f7", "pricing.growth.f8",
      ],
      highlight: true,
    },
    {
      nameKey: "pricing.premium",
      price: "600",
      descKey: "pricing.premium.desc",
      featureKeys: [
        "pricing.premium.f1", "pricing.premium.f2", "pricing.premium.f3", "pricing.premium.f4",
        "pricing.premium.f5", "pricing.premium.f6", "pricing.premium.f7", "pricing.premium.f8", "pricing.premium.f9",
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
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
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[2.5rem] tracking-[-0.03em]" style={{ fontWeight: 600 }}>
                  €{plan.price}
                </span>
              </div>
              <p
                className={`text-[0.875rem] mb-8 leading-relaxed ${
                  plan.highlight ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {t(plan.descKey, lang)}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        plan.highlight ? "text-[#30d158]" : "text-[#0071e3]"
                      }`}
                    />
                    <span
                      className={`text-[0.875rem] ${
                        plan.highlight ? "text-background/80" : "text-muted-foreground"
                      }`}
                    >
                      {t(fk, lang)}
                    </span>
                  </li>
                ))}
              </ul>

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
    </section>
  );
}
