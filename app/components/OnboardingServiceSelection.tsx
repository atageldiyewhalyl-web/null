import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Layout, Search, Sparkles, Target, CheckCircle } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingServiceSelectionProps {
  selectedServices: string[];
  onSelect: (services: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingServiceSelection({ 
  selectedServices, 
  onSelect, 
  onNext, 
  onBack 
}: OnboardingServiceSelectionProps) {
  const { lang } = useLanguage();
  const isNextDisabled = selectedServices.length === 0;

  const toggleService = (id: string) => {
    let newSelection: string[];
    
    if (id === "both") {
      // "Full Package" toggles everything
      if (selectedServices.includes("both")) {
        newSelection = [];
      } else {
        newSelection = ["website", "seo", "ads", "both"];
      }
    } else {
      if (selectedServices.includes(id)) {
        newSelection = selectedServices.filter(s => s !== id && s !== "both");
      } else {
        newSelection = [...selectedServices, id];
        // If all three individual ones are selected, also select "both"
        const core = ["website", "seo", "ads"];
        if (core.every(c => newSelection.includes(c))) {
          newSelection.push("both");
        }
      }
    }
    onSelect(newSelection);
  };

  const services = [
    {
      id: "website",
      icon: <Layout className="w-6 h-6" />,
      title: t("onboarding.step2.web.title", lang),
      description: t("onboarding.step2.web.sub", lang),
    },
    {
      id: "seo",
      icon: <Search className="w-6 h-6" />,
      title: t("onboarding.step2.seo.title", lang),
      description: t("onboarding.step2.seo.sub", lang),
    },
    {
      id: "ads",
      icon: <Target className="w-6 h-6" />,
      title: t("onboarding.step2.ads.title", lang),
      description: t("onboarding.step2.ads.sub", lang),
    },
    {
      id: "both",
      icon: <Sparkles className="w-6 h-6" />,
      title: t("onboarding.step2.both.title", lang),
      description: t("onboarding.step2.both.sub", lang),
      badge: t("onboarding.step2.both.badge", lang),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
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
          {t("onboarding.step2.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step2.sub_multi", lang)}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <motion.button
              key={service.id}
              variants={itemVariants}
              onClick={() => toggleService(service.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-start text-left p-8 rounded-[2.5rem] border-2 transition-all duration-300 z-10 h-full ${
                isSelected
                  ? "border-[#007aff] bg-[#f5faff] ring-4 ring-[#007aff]/10 shadow-[0_20px_40px_rgba(0,122,255,0.08)]"
                  : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7]"
              }`}
            >
              {service.badge && (
                <span className="absolute top-6 right-8 bg-[#007aff] text-white text-[0.6rem] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#007aff]/20 z-20">
                  {service.badge}
                </span>
              )}
              
              <div className={`p-4 rounded-2xl mb-6 transition-all ${
                isSelected 
                  ? "bg-[#007aff] text-white" 
                  : "bg-[#f5f5f7] text-[#0e0e10]"
              }`}>
                {service.icon}
              </div>

              <h3 className={`text-[1.25rem] font-bold mb-2 ${isSelected ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                {service.title}
              </h3>
              <p className="text-[0.9375rem] text-[#86868b] leading-snug font-medium mb-4">
                {service.description}
              </p>

              {isSelected && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 border-2 border-[#007aff] rounded-[2.5rem] pointer-events-none"
                >
                  <div className="absolute top-6 right-8 bg-[#007aff] text-white p-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[0.875rem] font-bold text-[#86868b] hover:text-[#0e0e10] transition-colors"
        >
          <ArrowLeft size={16} />
          {t("onboarding.common.back", lang)}
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 rounded-full text-[1rem] font-bold transition-all z-10 ${
            !isNextDisabled 
            ? "bg-[#0e0e10] text-white hover:bg-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10" 
            : "bg-[#f5f5f7] text-[#d2d2d7] cursor-not-allowed"
          }`}
        >
          {t("onboarding.common.next", lang)}
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}
