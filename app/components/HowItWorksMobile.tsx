import { motion } from "motion/react";
import { Search, MousePointerClick, ShieldCheck, MessageCircle } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

const icons = [Search, MousePointerClick, ShieldCheck, MessageCircle];

export function HowItWorksMobile() {
  const { lang } = useLanguage();

  const steps = [
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

  return (
    <section className="bg-white px-4 pb-24 md:hidden" aria-label={t("services.flow.aria", lang)}>
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <p className="mb-4 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#007aff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
            {t("services.flow.label", lang)}
          </p>
          <h2 className="text-[2.125rem] font-bold leading-[1.05] tracking-tight text-[#0e0e10]">
            {t("services.flow.title1", lang)}{" "}
            <span className="text-[#007aff]">{t("services.flow.title2", lang)}</span>
          </h2>
          <p className="mt-4 text-[1rem] font-medium leading-relaxed text-[#86868b]">
            {t("services.flow.subtitle", lang)}
          </p>
        </motion.div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = icons[index];

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                className="rounded-[1.25rem] border border-black/[0.06] bg-[#f5f5f7] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#007aff] shadow-sm">
                      <Icon size={19} strokeWidth={2} />
                    </span>
                    <span className="text-[0.6875rem] font-black uppercase tracking-[0.14em] text-[#007aff]/70">
                      {step.number}
                    </span>
                  </div>
                </div>
                <h3 className="mb-2 text-[1.125rem] font-bold leading-tight tracking-tight text-[#0e0e10]">
                  {step.label}
                </h3>
                <p className="text-[0.875rem] font-medium leading-relaxed text-[#86868b]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
