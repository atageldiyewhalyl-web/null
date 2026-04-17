import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingTargetAudienceProps {
  data: {
    audience: string[];
    trustFactors: string;
    targetLanguages: string[];
  };
  updateData: (fields: Partial<OnboardingTargetAudienceProps["data"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingTargetAudience({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: OnboardingTargetAudienceProps) {
  const { lang } = useLanguage();

  const audienceOptions = [
    { tr: "Türk kökenli bireyler", de: "Türkischstämmige Personen", en: "Turkish-speaking individuals" },
    { tr: "Alman vatandaşları", de: "Deutsche Staatsbürger", en: "German citizens" },
    { tr: "Şirketler & Esnaflar", de: "Unternehmen & Gewerbe", en: "Companies & Businesses" },
    { tr: "Uluslararası danışanlar", de: "Internationale Klienten", en: "International clients" },
  ];

  const languageOptions = ["Türkçe", "Deutsch", "English"];

  const toggleAudience = (opt: string) => {
    if (data.audience.includes(opt)) {
      updateData({ audience: data.audience.filter((a) => a !== opt) });
    } else {
      updateData({ audience: [...data.audience, opt] });
    }
  };

  const toggleLanguage = (langOpt: string) => {
    if (data.targetLanguages.includes(langOpt)) {
      updateData({ targetLanguages: data.targetLanguages.filter((l) => l !== langOpt) });
    } else {
      updateData({ targetLanguages: [...data.targetLanguages, langOpt] });
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
      className="w-full max-w-none mx-auto pb-20 px-6 md:px-12"
    >
      <motion.div variants={itemVariants} className="mb-32 text-center">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step6.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step6.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-32">
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold tracking-tight text-[#0e0e10]">
            {t("onboarding.step6.q1", lang)}
          </label>
          <div className="flex flex-wrap justify-center gap-3">
            {audienceOptions.map((opt) => {
              const label = opt[lang as keyof typeof opt] || opt.en;
              return (
                <button
                  key={label}
                  onClick={() => toggleAudience(label)}
                  className={`px-8 py-4 rounded-full text-[1rem] font-bold border-2 transition-all flex-1 min-w-[240px] max-w-[320px] ${
                    data.audience.includes(label)
                      ? "bg-[#007aff] border-[#007aff] text-white shadow-lg shadow-[#007aff]/10"
                      : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Q2: Trust Factors */}
        <motion.div variants={itemVariants} className="flex flex-col gap-16 text-center">
          <label className="block text-[1.25rem] font-bold text-[#0e0e10]">
            {t("onboarding.step6.q2", lang)}
          </label>
          <div className="relative max-w-6xl mx-auto group">
            <div className="absolute left-8 top-10 text-[#86868b] group-focus-within:text-[#007aff] transition-colors z-10">
              <MessageSquare size={28} />
            </div>
            <textarea
              value={data.trustFactors}
              onChange={(e) => updateData({ trustFactors: e.target.value })}
              placeholder={t("onboarding.step6.q2.placeholder", lang)}
              rows={5}
              className="w-full bg-white border-2 border-[#f5f5f7] rounded-[2.5rem] pl-20 pr-10 py-10 text-[1.25rem] focus:border-[#007aff] focus:ring-8 focus:ring-[#007aff]/10 transition-all outline-none font-medium resize-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-[#d2d2d7]"
            />
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold tracking-tight text-[#0e0e10]">
            {t("onboarding.step6.q3", lang)}
          </label>
          <div className="flex justify-center gap-4">
            {languageOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleLanguage(opt)}
                className={`px-10 py-4 rounded-full text-[1rem] font-bold border-2 transition-all ${
                  data.targetLanguages.includes(opt)
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
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
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-10 py-5 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20"
          >
            {t("onboarding.common.next", lang)}
            <ArrowRight size={22} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
