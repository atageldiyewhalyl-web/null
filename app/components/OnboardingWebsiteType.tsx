import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Layout, LayoutPanelTop } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingWebsiteTypeProps {
  siteType: "onepage" | "multipage" | "";
  onSelect: (type: "onepage" | "multipage") => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingWebsiteType({ 
  siteType, 
  onSelect, 
  onNext, 
  onBack 
}: OnboardingWebsiteTypeProps) {
  const { lang } = useLanguage();

  const options = [
    {
      id: "onepage",
      icon: <Layout size={32} />,
      title: t("onboarding.step4a.onepage.title", lang),
      sub: t("onboarding.step4a.onepage.sub", lang),
    },
    {
      id: "multipage",
      icon: <LayoutPanelTop size={32} />,
      title: t("onboarding.step4a.multipage.title", lang),
      sub: t("onboarding.step4a.multipage.sub", lang),
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
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
          {t("onboarding.step4a.q", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step4.sub", lang)}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            variants={itemVariants}
            onClick={() => onSelect(opt.id as any)}
            className={`relative flex flex-col items-center text-center p-8 pb-10 rounded-[2rem] border-2 transition-all group h-full z-10 ${
              siteType === opt.id
                ? "border-[#007aff] bg-[#f5faff] ring-4 ring-[#007aff]/5 shadow-[0_20px_40px_rgba(0,122,255,0.08)]"
                : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7] hover:bg-[#fafafa]"
            }`}
          >
            {/* Recommended Badge - Better positioned */}
            {opt.id === "multipage" && (
              <div className="absolute top-4 right-4 bg-[#34c759] text-white px-3 py-1 rounded-full text-[0.6rem] font-black tracking-wide uppercase shadow-lg shadow-[#34c759]/20 z-10">
                {t("onboarding.step4a.multipage.recommended", lang)}
              </div>
            )}

            <div className={`p-6 rounded-2xl transition-all mb-6 mt-4 ${
              siteType === opt.id ? "bg-[#007aff] text-white shadow-lg shadow-[#007aff]/20" : "bg-[#f5f5f7] text-[#0e0e10] group-hover:scale-105"
            }`}>
              {opt.icon}
            </div>

            <div className="flex flex-col items-center">
              <h3 className={`text-[1.25rem] font-bold mb-2 ${siteType === opt.id ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                {opt.title}
              </h3>
              <p className="text-[0.9375rem] text-[#86868b] font-medium leading-relaxed max-w-[200px]">
                {opt.sub}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        variants={itemVariants}
        className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-16"
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
          disabled={!siteType}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-12 py-6 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
        >
          {t("onboarding.common.next", lang)}
          <ArrowRight size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}
