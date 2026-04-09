import { ArrowRight } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section aria-label="Hero" className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden bg-[#030213]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep blue orb */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0071e3]/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Subtle bottom glow */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0071e3]/5 rounded-full blur-[120px]" />
        
        {/* Static noise texture for premium paper/digital feel */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[0.8125rem] mb-10 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071e3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071e3]"></span>
            </span>
            {t("hero.badge", lang)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.5rem,10vw,5rem)] leading-[1] tracking-tight mb-10 text-white"
          >
            {t("hero.line1", lang)}{" "}
            <span className="text-white/40 italic font-normal">{t("hero.line2", lang)}</span>
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              {t("hero.line3", lang)}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[1.125rem] md:text-[1.375rem] text-white/50 max-w-2xl mb-14 leading-relaxed font-light"
          >
            {t("hero.description", lang)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-10 py-5 rounded-full text-[1.125rem] font-medium transition-all hover:scale-[1.05] active:scale-95 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("hero.cta", lang)} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white transition-opacity group-hover:opacity-90" />
            </a>
            
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 text-[1rem] text-white/40 hover:text-white transition-all duration-300 group"
            >
              {t("hero.secondary", lang)}
              <div className="w-0 group-hover:w-full h-px bg-white/20 transition-all duration-500" />
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Elite Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#030213] to-transparent pointer-events-none" />
    </section>
  );
}
