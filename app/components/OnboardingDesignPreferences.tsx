import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Palette, ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { useState, useRef, useEffect } from "react";
import Image2 from "../assets/Image 2.PNG";
import Image3 from "../assets/Image 3.PNG";
import Image4 from "../assets/Image 4.PNG";
import Image5 from "../assets/Image 5.PNG";
import Image6 from "../assets/Image 6.PNG";

interface OnboardingDesignPreferencesProps {
  data: {
    style: string;
    tone: number;
    colors: string;
    references: string;
  };
  updateData: (fields: Partial<OnboardingDesignPreferencesProps["data"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingDesignPreferences({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: OnboardingDesignPreferencesProps) {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const styleOptions = [
    { 
      id: "image2", 
      image: Image2, 
      title: { tr: "Güçlü & Kurumsal", de: "Stark & Korporativ", en: "Strong & Corporate" },
      desc: { 
        tr: "Cesur tipografi ve kurumsal yeşil tonlar. Bir şirketle iş birliği yapıyorsanız, siteniz onların renk ve stiline göre tasarlanır.", 
        de: "Starke Typografie und korporative Farben. Bei einer Firmenzugehörigkeit wird die Website im Stil und den Farben des Unternehmens gestaltet.",
        en: "Bold typography and corporate green tones. If you collaborate with a company, your site will be designed according to their style."
      }
    },
    { 
      id: "image3", 
      image: Image3, 
      title: { tr: "Sıcak & Samimi", de: "Warm & Persönlich", en: "Warm & Approachable" },
      desc: { tr: "Yumuşak serif yazı tipi ve samimi bej tonları.", de: "Weiche Serifenschrift und herzliche Beigetöne.", en: "Soft serif font and warm beige tones." }
    },
    { 
      id: "image4", 
      image: Image4, 
      title: { tr: "Cesur & Modern", de: "Mutig & Modern", en: "Bold & Modern" },
      desc: { tr: "Karanlık tema ve modern neon detaylar.", de: "Dunkles Thema und moderne Neondetails.", en: "Dark theme and modern neon details." }
    },
    { 
      id: "image5", 
      image: Image5, 
      title: { tr: "Güvenilir & Profesyonel", de: "Vertrauensvoll & Professionell", en: "Trustworthy & Professional" },
      desc: { tr: "Temiz çizgiler ve otoriter lacivert tonlar.", de: "Klare Linien und autoritäre Marinetöne.", en: "Clean lines and authoritative navy tones." }
    },
    { 
      id: "image6", 
      image: Image6, 
      title: { tr: "Prestijli & Lüks", de: "Prestige & Luxus", en: "Premium & Prestigious" },
      desc: { tr: "Derin lacivert ve altın varak detaylar.", de: "Tiefes Marineblau und Goldakzente.", en: "Deep navy and gold accents." }
    },
  ];

  // Handle scroll to track active index
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollPos = el.scrollLeft;
      const width = el.offsetWidth;
      // Index calculation based on scroll container width
      const index = Math.round(scrollPos / (width * 0.75)); 
      if (index !== activeIndex && index >= 0 && index < styleOptions.length) {
        setActiveIndex(index);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeIndex, styleOptions.length]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.offsetWidth;
    el.scrollTo({ left: index * width * 0.75, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
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
      className="w-full max-w-none mx-auto pb-20 overflow-x-hidden"
    >
      <motion.div variants={itemVariants} className="mb-20 text-center px-6">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step7.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step7.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-40">
        {/* Q1: Style Showcase Stage */}
        <div className="relative flex flex-col items-center">
          {/* Active Caption Stage-Top */}
          <div className="text-center h-40 mb-12 px-6 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-[2rem] md:text-[2.5rem] font-bold text-[#0e0e10] leading-none">
                  {styleOptions[activeIndex].title[lang as keyof (typeof styleOptions)[0]["title"]] || styleOptions[activeIndex].title.en}
                </h3>
                <p className="text-[1.25rem] text-[#86868b] font-medium leading-relaxed">
                  {styleOptions[activeIndex].desc[lang as keyof (typeof styleOptions)[0]["desc"]] || styleOptions[activeIndex].desc.en}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full overflow-hidden">
            {/* Nav Arrows (Desktop) */}
            <div className="hidden lg:block">
              <button 
                onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
                className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-20 p-8 rounded-full bg-white/90 backdrop-blur-xl border-2 border-[#f5f5f7] text-[#0e0e10] hover:bg-white hover:scale-110 transition-all shadow-2xl disabled:opacity-0 disabled:pointer-events-none"
                disabled={activeIndex === 0}
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={() => scrollTo(Math.min(styleOptions.length - 1, activeIndex + 1))}
                className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 z-20 p-8 rounded-full bg-white/90 backdrop-blur-xl border-2 border-[#f5f5f7] text-[#0e0e10] hover:bg-white hover:scale-110 transition-all shadow-2xl disabled:opacity-0 disabled:pointer-events-none"
                disabled={activeIndex === styleOptions.length - 1}
              >
                <ChevronRight size={32} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex gap-16 overflow-x-auto snap-x snap-mandatory px-[15vw] no-scrollbar py-20"
              style={{ scrollPadding: "15vw" }}
            >
              {styleOptions.map((opt, i) => (
                <div 
                  key={opt.id}
                  className="snap-center flex-shrink-0 w-[70vw] lg:w-[60vw]"
                >
                  <button
                    onClick={() => updateData({ style: opt.id })}
                    className={`relative w-full rounded-[3rem] border-4 transition-all duration-700 overflow-hidden group ${
                      data.style === opt.id
                        ? "border-[#007aff] shadow-[0_50px_120px_rgba(0,122,255,0.2)] ring-[16px] ring-[#007aff]/5 scale-100"
                        : activeIndex === i ? "border-[#f5f5f7] shadow-2xl scale-[0.98]" : "border-transparent opacity-30 scale-[0.9] blur-[4px]"
                    }`}
                  >
                    <div className="bg-white p-2">
                       <img 
                        src={opt.image} 
                        alt={opt.title.en}
                        className="w-full h-auto object-contain block"
                      />
                    </div>
                    
                    {/* Interaction Overlay */}
                    <div className={`absolute inset-0 bg-black/10 transition-opacity duration-500 flex flex-col items-center justify-center pointer-events-none ${
                      data.style === opt.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {data.style === opt.id ? (
                        <div className="bg-[#007aff] text-white p-8 rounded-full shadow-2xl scale-125 translate-y-0 opacity-100 transition-all border-4 border-white">
                          <Check size={40} strokeWidth={4} />
                        </div>
                      ) : (
                        <div className="bg-white/95 backdrop-blur-md text-[#0e0e10] px-12 py-6 rounded-full font-bold text-[1.25rem] shadow-2xl transition-all border-2 border-[#f5f5f7]">
                          {lang === 'tr' ? 'Bu Tasarımı Seç' : 'Dieses Design wählen'}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-4 mt-12">
            {styleOptions.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-2.5 transition-all duration-500 rounded-full ${
                  activeIndex === i ? "w-16 bg-[#007aff]" : "w-2.5 bg-[#d2d2d7] hover:bg-[#86868b]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Q2: Tone Slider with Enhanced Visuals */}
        <motion.div variants={itemVariants} className="flex flex-col gap-16 text-center max-w-4xl mx-auto px-6">
          <label className="block text-[1.75rem] font-bold text-[#0e0e10]">
            {t("onboarding.step7.q2", lang)}
          </label>
          <div className="relative py-16 px-12 bg-white border-2 border-[#f5f5f7] rounded-[4rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
            <input
              type="range"
              min="0"
              max="100"
              value={data.tone}
              onChange={(e) => updateData({ tone: parseInt(e.target.value) })}
              className="w-full h-5 bg-[#f5f5f7] rounded-full appearance-none cursor-pointer accent-[#007aff]"
            />
            <div className="flex justify-between mt-12 text-[1rem] font-black text-[#86868b] uppercase tracking-[0.2em] px-4">
              <span className={data.tone < 30 ? "text-[#007aff] scale-125 transition-all" : ""}>{t("onboarding.step7.q2.left", lang)}</span>
              <span className={data.tone > 70 ? "text-[#007aff] scale-125 transition-all" : ""}>{t("onboarding.step7.q2.right", lang)}</span>
            </div>
          </div>
        </motion.div>

        {/* Q3: Colors with Studio Palette System */}
        <motion.div variants={itemVariants} className="flex flex-col gap-16 text-center px-6">
          <label className="block text-[1.75rem] font-bold text-[#0e0e10]">
            {t("onboarding.step7.q3", lang)}
          </label>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {/* Special Option: Studio Choice */}
            <button
              onClick={() => updateData({ colors: "studio_choice" })}
              className={`flex flex-col items-center justify-center gap-6 p-10 rounded-[3rem] border-2 transition-all group max-w-[320px] min-h-[220px] ${
                data.colors === "studio_choice"
                  ? "border-[#007aff] bg-[#f5faff] ring-[12px] ring-[#007aff]/5 shadow-2xl"
                  : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7]"
              }`}
            >
              <span className="text-[1.125rem] font-extrabold text-[#0e0e10] leading-snug px-4 text-center">
                {t("onboarding.step7.q3.studio_choice", lang)}
              </span>
            </button>

            {[
              { id: "navy", label: "Royal Navy & Gold", colors: ["#1a2b48", "#c5a059"] },
              { id: "minimal", label: "Classic Black", colors: ["#000000", "#ffffff"] },
              { id: "slate", label: "Professional Slate", colors: ["#334155", "#e2e8f0"] },
              { id: "emerald", label: "Deep Emerald", colors: ["#064e3b", "#f0fdf4"] },
              { id: "luxury", label: "Midnight & Gold", colors: ["#0a0a0a", "#d4af37"] },
            ].map((swatch) => (
              <button
                key={swatch.id}
                onClick={() => updateData({ colors: swatch.id })}
                className={`flex flex-col items-center gap-6 p-10 rounded-[3rem] border-2 transition-all group min-w-[200px] ${
                  data.colors === swatch.id
                    ? "border-[#007aff] bg-[#f5faff] ring-[12px] ring-[#007aff]/5 shadow-2xl"
                    : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7]"
                }`}
              >
                <div className="flex -space-x-6">
                  {swatch.colors.map((c, i) => (
                    <div 
                      key={i} 
                      className="w-20 h-20 rounded-full border-[8px] border-white shadow-2xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: c, zIndex: 10 - i }}
                    />
                  ))}
                </div>
                <span className="text-[1.125rem] font-extrabold text-[#0e0e10] tracking-tight">{swatch.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation Footer (Consistent Global Layout) */}
      <div className="max-w-4xl mx-auto w-full px-6 mt-40">
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-16"
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
