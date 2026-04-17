import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingWebsiteExtrasProps {
  selectedExtras: string[];
  onToggle: (items: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingWebsiteExtras({ 
  selectedExtras, 
  onToggle, 
  onNext, 
  onBack 
}: OnboardingWebsiteExtrasProps) {
  const { lang } = useLanguage();

  const options = [
    { id: "logo", title: t("onboarding.extra.logo.title", lang), sub: t("onboarding.extra.logo.sub", lang) },
    { id: "copy", title: t("onboarding.extra.copy.title", lang), sub: t("onboarding.extra.copy.sub", lang) },
    { id: "whatsapp", title: t("onboarding.extra.whatsapp.title", lang), sub: t("onboarding.extra.whatsapp.sub", lang) },
    { id: "appointment", title: t("onboarding.extra.appointment.title", lang), sub: t("onboarding.extra.appointment.sub", lang) },
    { id: "analytics", title: t("onboarding.extra.analytics.title", lang), sub: t("onboarding.extra.analytics.sub", lang) },
    { id: "social", title: t("onboarding.extra.social.title", lang), sub: t("onboarding.extra.social.sub", lang) },
  ];

  const toggle = (id: string) => {
    if (selectedExtras.includes(id)) {
      onToggle(selectedExtras.filter((i) => i !== id));
    } else {
      onToggle([...selectedExtras, id]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-32 text-center">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step4c.q", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto">
          {t("onboarding.step3.sub", lang)}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = selectedExtras.includes(opt.id);
          return (
            <motion.button
              key={opt.id}
              variants={itemVariants}
              onClick={() => toggle(opt.id)}
              className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[#007aff] bg-[#f5faff] ring-4 ring-[#007aff]/5"
                  : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7]"
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                isSelected ? "bg-[#007aff] border-[#007aff] text-white" : "border-[#d2d2d7] bg-white"
              }`}>
                {isSelected && <Check size={14} strokeWidth={4} />}
              </div>
              <div className="flex flex-col">
                <span className={`text-[1rem] font-bold mb-1 ${isSelected ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                  {opt.title}
                </span>
                <span className="text-[0.875rem] text-[#86868b] font-medium leading-[1.4]">
                  {opt.sub}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div 
        variants={itemVariants}
        className="mt-32 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-16"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[1rem] font-bold text-[#86868b] hover:text-[#0e0e10] transition-colors"
        >
          <ArrowLeft size={20} />
          {t("onboarding.common.back", lang)}
        </button>

        <button
          onClick={onNext}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-12 py-6 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] shadow-2xl"
        >
          {t("onboarding.common.next", lang)}
          <ArrowRight size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}
