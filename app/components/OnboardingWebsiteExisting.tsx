import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Globe, MessageSquare } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingWebsiteExistingProps {
  hasSite: boolean | null;
  siteUrl: string;
  dislikes: string;
  updateData: (fields: { hasExistingSite?: boolean | null; existingSiteUrl?: string; dislikes?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingWebsiteExisting({ 
  hasSite, 
  siteUrl, 
  dislikes, 
  updateData, 
  onNext, 
  onBack 
}: OnboardingWebsiteExistingProps) {
  const { lang } = useLanguage();

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
          {t("onboarding.step4.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step4.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-12">
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          <label className="text-[1.25rem] font-bold text-[#0e0e10]">
            {t("onboarding.step4d.q", lang)}
          </label>
          <div className="flex gap-4 w-full max-w-sm">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => updateData({ hasExistingSite: val })}
                className={`flex-1 py-6 rounded-2xl text-[1.125rem] font-bold border-2 transition-all ${
                  hasSite === val
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {val ? (lang === 'tr' ? 'Evet' : 'Ja') : (lang === 'tr' ? 'Hayır' : 'Nein')}
              </button>
            ))}
          </div>
        </motion.div>

        {hasSite && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-10"
          >
            {/* URL Input */}
            <div className="space-y-4">
              <label className="text-[1.125rem] font-bold text-[#0e0e10] block text-center">
                {t("onboarding.step4d.url", lang)}
              </label>
              <div className="relative max-w-2xl mx-auto group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#007aff] transition-colors">
                  <Globe size={20} />
                </div>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => updateData({ existingSiteUrl: e.target.value })}
                  placeholder="e.g. www.beratung-beispiel.de"
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-[1.25rem] px-16 py-5 text-[1.125rem] focus:bg-white focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10 transition-all outline-none font-medium"
                />
              </div>
            </div>

            {/* Dislikes Textarea */}
            <div className="space-y-4">
              <label className="text-[1.125rem] font-bold text-[#0e0e10] block text-center">
                {t("onboarding.step4d.dislikes", lang)}
              </label>
              <div className="relative max-w-6xl mx-auto group">
                <div className="absolute left-8 top-10 text-[#86868b] group-focus-within:text-[#007aff] transition-colors z-10">
                  <MessageSquare size={28} />
                </div>
                <textarea
                  value={dislikes}
                  onChange={(e) => updateData({ dislikes: e.target.value })}
                  placeholder={t("onboarding.step4d.dislikes.placeholder", lang)}
                  rows={5}
                  className="w-full bg-white border-2 border-[#f5f5f7] rounded-[2.5rem] pl-20 pr-10 py-10 text-[1.25rem] focus:border-[#007aff] focus:ring-8 focus:ring-[#007aff]/10 transition-all outline-none font-medium resize-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-[#d2d2d7]"
                />
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <motion.div 
          variants={itemVariants}
          className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-12"
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
            disabled={hasSite === null}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-10 py-5 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("onboarding.common.next", lang)}
            <ArrowRight size={22} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
