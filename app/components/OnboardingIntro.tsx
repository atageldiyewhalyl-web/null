import { motion } from "motion/react";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingIntroProps {
  onNext: () => void;
}

export function OnboardingIntro({ onNext }: OnboardingIntroProps) {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center">

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-[clamp(2rem,8vw,4rem)] leading-[1.05] font-black tracking-[-0.04em] text-[#0e0e10] mb-8 text-balance max-w-3xl"
      >
        {t("onboarding.intro.title", lang)}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-[1.125rem] md:text-[1.375rem] text-[#86868b] leading-relaxed mb-12 max-w-2xl text-balance font-medium"
      >
        {t("onboarding.intro.description", lang)}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <button
          onClick={onNext}
          className="group relative inline-flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/10 overflow-hidden mb-12"
        >
          <span className="relative z-10">{t("onboarding.intro.cta", lang)}</span>
          <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        {/* Info Points (Clean, Box-less) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-8">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-[#86868b]" />
            <span className="text-[0.8125rem] font-medium text-[#86868b]">
              {t("onboarding.intro.duration", lang)}
            </span>
          </div>

          <div className="hidden sm:block w-px h-3 bg-[#d2d2d7]/50" />

          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-[#34c759]" />
            <span className="text-[0.8125rem] font-medium text-[#86868b]">
              {t("onboarding.intro.secure_badge", lang)}
            </span>
          </div>
        </div>
        
      </motion.div>
    </div>
  );
}
