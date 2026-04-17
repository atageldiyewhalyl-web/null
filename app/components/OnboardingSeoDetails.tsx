import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, MapPin, Plus, X } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { useState } from "react";

interface OnboardingSeoDetailsProps {
  data: {
    isMapVisible: boolean | null;
    hadSeoBefore: boolean | null;
    targetCities: string[];
  };
  updateData: (fields: Partial<OnboardingSeoDetailsProps["data"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingSeoDetails({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: OnboardingSeoDetailsProps) {
  const { lang } = useLanguage();
  const [customCity, setCustomCity] = useState("");

  const mainCities = ["Berlin", "Hamburg", "München", "Frankfurt", "Köln", "Stuttgart", "Mannheim", "Düsseldorf"];

  const toggleCity = (city: string) => {
    if (data.targetCities.includes(city)) {
      updateData({ targetCities: data.targetCities.filter((c) => c !== city) });
    } else {
      updateData({ targetCities: [...data.targetCities, city] });
    }
  };

  const addCustomCity = () => {
    if (customCity.trim() && !data.targetCities.includes(customCity.trim())) {
      updateData({ targetCities: [...data.targetCities, customCity.trim()] });
      setCustomCity("");
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
      className="w-full max-w-4xl mx-auto pb-20"
    >
      <motion.div variants={itemVariants} className="mb-32 text-center">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step5.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step5.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-32">
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold tracking-tight text-[#0e0e10]">
            {t("onboarding.step5.q1", lang)}
          </label>
          <div className="flex gap-4 w-full max-w-xl mx-auto">
            {[
              { val: true, label: { tr: "Evet, profilim var", de: "Ja, ich habe ein Profil", en: "Yes, I have a profile" } },
              { val: false, label: { tr: "Hayır / Bilmiyorum", de: "Nein / Weiß nicht", en: "No / I don't know" } }
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => updateData({ isMapVisible: opt.val })}
                className={`flex-1 py-5 px-6 rounded-2xl text-[1.125rem] font-bold border-2 transition-all whitespace-nowrap ${
                  data.isMapVisible === opt.val
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt.label[lang as keyof typeof opt.label] || opt.label.en}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold tracking-tight text-[#0e0e10]">
            {t("onboarding.step5.q2", lang)}
          </label>
          <div className="flex gap-4 w-full max-w-xl mx-auto">
            {[
              { val: true, label: { tr: "Evet", de: "Ja", en: "Yes" } },
              { val: false, label: { tr: "Hayır, ilk kez", de: "Nein, zum ersten Mal", en: "No, first time" } }
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => updateData({ hadSeoBefore: opt.val })}
                className={`flex-1 py-5 px-6 rounded-2xl text-[1.125rem] font-bold border-2 transition-all whitespace-nowrap ${
                  data.hadSeoBefore === opt.val
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt.label[lang as keyof typeof opt.label] || opt.label.en}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold tracking-tight text-[#0e0e10]">
            {t("onboarding.step5.q3", lang)}
          </label>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {mainCities.map((city) => (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-5 py-2.5 rounded-full text-[0.875rem] font-bold border-2 transition-all ${
                  data.targetCities.includes(city)
                    ? "bg-[#007aff] border-[#007aff] text-white"
                    : "bg-white border-[#f5f5f7] text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {city}
              </button>
            ))}
            {data.targetCities.filter(c => !mainCities.includes(c)).map(city => (
               <button
               key={city}
               onClick={() => toggleCity(city)}
               className="px-5 py-2.5 rounded-full text-[0.875rem] font-bold bg-[#007aff] border-2 border-[#007aff] text-white flex items-center gap-2"
             >
               {city} <X size={14} />
             </button>
            ))}
          </div>
          <div className="relative max-w-md mx-auto">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b]">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomCity()}
              placeholder={lang === 'tr' ? "Başka yer ekle..." : "Weiteren Ort hinzufügen..."}
              className="w-full bg-[#f5f5f7] border border-transparent rounded-2xl px-14 py-4 text-[1rem] focus:bg-white focus:border-[#007aff] transition-all outline-none font-medium"
            />
            <button 
              onClick={addCustomCity}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white text-[#007aff] shadow-sm hover:scale-110 transition-transform"
            >
              <Plus size={20} />
            </button>
          </div>
        </motion.div>

      </div>

      <motion.div 
        variants={itemVariants}
        className="mt-32 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 border-t border-[#f5f5f7] pt-16"
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
