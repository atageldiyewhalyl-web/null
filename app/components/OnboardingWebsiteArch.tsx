import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { useEffect } from "react";

interface OnboardingWebsiteArchProps {
  siteType: "onepage" | "multipage";
  selectedItems: string[];
  onToggle: (items: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingWebsiteArch({ 
  siteType, 
  selectedItems, 
  onToggle, 
  onNext, 
  onBack 
}: OnboardingWebsiteArchProps) {
  const { lang } = useLanguage();

  const options = [
    { id: "home", label: t("onboarding.arch.home", lang), locked: siteType === "multipage" },
    { id: "services", label: t("onboarding.arch.services", lang) },
    { id: "about", label: t("onboarding.arch.about", lang) },
    { id: "why", label: t("onboarding.arch.why", lang) },
    { id: "references", label: t("onboarding.arch.references", lang) },
    { id: "contact", label: t("onboarding.arch.contact", lang) },
    { id: "faq", label: t("onboarding.arch.faq", lang) },
    { id: "blog", label: t("onboarding.arch.blog", lang) },
    { id: "cities", label: t("onboarding.arch.cities", lang) },
  ];

  // Auto-select home if multipage on mount
  useEffect(() => {
    if (siteType === "multipage" && !selectedItems.includes("home")) {
      onToggle([...selectedItems, "home"]);
    }
  }, [siteType, selectedItems, onToggle]);

  const toggle = (id: string) => {
    if (siteType === "multipage" && id === "home") return; // Locked
    
    if (selectedItems.includes(id)) {
      onToggle(selectedItems.filter((i) => i !== id));
    } else {
      onToggle([...selectedItems, id]);
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
      <motion.div variants={itemVariants} className="text-center mb-32">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {siteType === "multipage" 
            ? t("onboarding.step4b.multipage.q", lang) 
            : t("onboarding.step4b.onepage.q", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto">
          {t("onboarding.step4.sub", lang)}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedItems.includes(opt.id);
          return (
            <motion.button
              key={opt.id}
              variants={itemVariants}
              onClick={() => toggle(opt.id)}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[#007aff] bg-[#f5faff] ring-4 ring-[#007aff]/5"
                  : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7]"
              } ${opt.locked ? "cursor-default opacity-80" : "cursor-pointer"}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? "bg-[#007aff] border-[#007aff] text-white" : "border-[#d2d2d7] bg-white"
              }`}>
                {isSelected && <Check size={14} strokeWidth={4} />}
              </div>
              <span className={`text-[1rem] font-bold ${isSelected ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                {opt.label}
              </span>
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
          disabled={selectedItems.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-12 py-6 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {t("onboarding.common.next", lang)}
          <ArrowRight size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}
