import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { useState } from "react";

interface OnboardingLawAreasProps {
  selectedAreas: string[];
  customAreas: string[];
  topServices: string[];
  updateData: (fields: { selectedAreas?: string[]; customAreas?: string[]; topServices?: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingLawAreas({ 
  selectedAreas, 
  customAreas = [], 
  topServices = [], 
  updateData, 
  onNext, 
  onBack 
}: OnboardingLawAreasProps) {
  const { lang } = useLanguage();
  const [inputValue, setInputValue] = useState("");

  const lawAreas = [
    "Unternehmensberatung",
    "IT & Digitalisierung",
    "Marketing & Vertrieb",
    "Finanz- & Strategieberatung",
    "Personal & HR",
    "Prozessoptimierung",
    "Gründungs- & Startup-Beratung",
    "Transformationsmanagement",
    "Coaching & Training",
    "Immobilien- & Projektberatung"
  ];

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      updateData({ selectedAreas: selectedAreas.filter((a) => a !== area) });
    } else {
      updateData({ selectedAreas: [...selectedAreas, area] });
    }
  };

  const addCustomArea = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !customAreas.includes(trimmed) && !lawAreas.includes(trimmed)) {
      updateData({ customAreas: [...customAreas, trimmed] });
      setInputValue("");
    }
  };

  const removeCustomArea = (area: string) => {
    updateData({ 
      customAreas: customAreas.filter((a) => a !== area),
      topServices: topServices.filter((s) => s !== area)
    });
  };

  const toggleTopService = (service: string) => {
    if (topServices.includes(service)) {
      updateData({ topServices: topServices.filter((s) => s !== service) });
    } else if (topServices.length < 3) {
      updateData({ topServices: [...topServices, service] });
    }
  };

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

  const isNextDisabled = (selectedAreas.length === 0 && customAreas.length === 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto"
    >
      {/* ── Section 1: Areas of Expertise ── */}
      <motion.div variants={itemVariants} className="mb-20 text-center">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step3.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step3.sub", lang)}
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {lawAreas.map((area) => (
          <motion.button
            key={area}
            variants={itemVariants}
            onClick={() => toggleArea(area)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-8 py-4 rounded-full text-[1rem] font-bold border-2 transition-all min-w-[180px] max-w-[320px] z-10 ${
              selectedAreas.includes(area)
                ? "bg-[#0e0e10] border-[#0e0e10] text-white shadow-lg"
                : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
            }`}
          >
            {area}
          </motion.button>
        ))}
      </div>

      {/* Custom Areas Tags */}
      {customAreas.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {customAreas.map((area) => (
            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={area}
              className="flex items-center gap-2 bg-[#f5f5f7] px-4 py-2 rounded-xl text-[0.875rem] font-bold text-[#0e0e10] border border-[#d2d2d7]"
            >
              {area}
              <button 
                onClick={() => removeCustomArea(area)}
                className="hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div variants={itemVariants} className="mb-32">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#007aff] transition-colors">
            <Plus size={20} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomArea();
              }
            }}
            placeholder={t("onboarding.step3.other", lang)}
            className="w-full bg-[#f5f5f7] border border-transparent rounded-2xl px-14 py-5 text-[1.125rem] transition-all focus:bg-white focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10 outline-none font-medium text-[#0e0e10]"
          />
          {inputValue.trim() && (
            <button
              onClick={addCustomArea}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#007aff] text-white px-4 py-2 rounded-xl text-[0.8125rem] font-bold shadow-lg shadow-[#007aff]/20"
            >
              {lang === 'tr' ? 'Ekle' : (lang === 'de' ? 'Hinzufügen' : 'Add')}
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Section 2: Top 3 Services ── */}
      <motion.div variants={itemVariants} className="mb-20 text-center">
        <h2 className="text-[2.25rem] md:text-[2.5rem] font-bold tracking-tight text-[#0e0e10] mb-4">
          {t("onboarding.step3.topServices.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step3.topServices.sub", lang)}
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mb-20">
        {[...lawAreas, ...customAreas].map((service) => {
          const isSelectedInMain = selectedAreas.includes(service) || customAreas.includes(service);
          if (!isSelectedInMain) return null;

          return (
            <motion.button
              key={service}
              variants={itemVariants}
              onClick={() => toggleTopService(service)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!topServices.includes(service) && topServices.length >= 3}
              className={`px-6 py-3 rounded-2xl text-[0.9375rem] font-bold border-2 transition-all ${
                topServices.includes(service)
                  ? "bg-[#007aff] border-[#007aff] text-white shadow-lg shadow-[#007aff]/20"
                  : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7] disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              {service}
              {topServices.includes(service) && (
                <span className="ml-2 text-[0.75rem] bg-white/20 px-1.5 py-0.5 rounded-md">
                  {topServices.indexOf(service) + 1}
                </span>
              )}
            </motion.button>
          );
        })}
        {[...lawAreas, ...customAreas].filter(s => selectedAreas.includes(s) || customAreas.includes(s)).length === 0 && (
          <p className="text-[#86868b] text-[0.9375rem] font-medium opacity-50">
            {lang === 'tr' ? 'Henüz uzmanlık alanı seçilmedi' : (lang === 'de' ? 'Noch keine Fachgebiete ausgewählt' : 'No expertise areas selected yet')}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        variants={itemVariants}
        className="mt-32 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-16"
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
