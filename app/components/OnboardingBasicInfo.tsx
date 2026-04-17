import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingBasicInfoProps {
  data: {
    name: string;
    firm: string;
    email: string;
    phone: string;
    city: string;
  };
  updateData: (fields: Partial<OnboardingBasicInfoProps["data"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingBasicInfo({ data, updateData, onNext, onBack }: OnboardingBasicInfoProps) {
  const { lang } = useLanguage();

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
      className="w-full max-w-3xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-32 text-center">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step1.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step1.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-20">
        {/* Name & Firm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <label className="block text-[0.875rem] font-bold text-[#0e0e10] ml-1">
              {t("onboarding.step1.name", lang)}
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder={t("onboarding.step1.name", lang)}
              className="bg-[#f5f5f7] border border-[#d2d2d7]/50 rounded-2xl px-5 py-4 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all placeholder:text-[#86868b]/50"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <label className="block text-[0.875rem] font-bold text-[#0e0e10] ml-1">
              {t("onboarding.step1.firm", lang)}
            </label>
            <input
              type="text"
              value={data.firm}
              onChange={(e) => updateData({ firm: e.target.value })}
              placeholder={t("onboarding.step1.firm", lang)}
              className="bg-[#f5f5f7] border border-[#d2d2d7]/50 rounded-2xl px-5 py-4 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all placeholder:text-[#86868b]/50"
            />
          </motion.div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <label className="block text-[0.875rem] font-bold text-[#0e0e10] ml-1">
              {t("onboarding.step1.email", lang)}
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder={t("onboarding.step1.email", lang)}
              className="bg-[#f5f5f7] border border-[#d2d2d7]/50 rounded-2xl px-5 py-4 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all placeholder:text-[#86868b]/50"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <label className="block text-[0.875rem] font-bold text-[#0e0e10] ml-1">
              {t("onboarding.step1.phone", lang)}
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
              placeholder={t("onboarding.step1.phone", lang)}
              className="bg-[#f5f5f7] border border-[#d2d2d7]/50 rounded-2xl px-5 py-4 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all placeholder:text-[#86868b]/50"
            />
          </motion.div>
        </div>

        {/* City */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <label className="text-[0.875rem] font-bold text-[#0e0e10] ml-1">
            {t("onboarding.step1.city", lang)}
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder={t("onboarding.step1.city", lang)}
            className="bg-[#f5f5f7] border border-[#d2d2d7]/50 rounded-2xl px-5 py-4 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all placeholder:text-[#86868b]/50 w-full"
          />
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        variants={itemVariants}
        className="mt-16 flex flex-col-reverse sm:flex-row items-center justify-between gap-6"
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
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-10 py-5 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20"
        >
          {t("onboarding.common.next", lang)}
          <ArrowRight size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}
