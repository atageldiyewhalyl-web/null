import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Globe } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface OnboardingWebsiteDetailsProps {
  data: {
    pageCount: string;
    features: string[];
    revisions: string;
    hasExistingSite: boolean;
    existingSiteUrl: string;
  };
  updateData: (fields: Partial<OnboardingWebsiteDetailsProps["data"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingWebsiteDetails({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: OnboardingWebsiteDetailsProps) {
  const { lang } = useLanguage();

  const pageOptions = ["1", "2–5", "6–10", "10+"];
  
  const featureOptions = [
    { id: "contact", label: { tr: "İletişim formu", de: "Kontaktformular", en: "Contact form" } },
    { id: "appointment", label: { tr: "Online randevu", de: "Terminbuchung", en: "Online appointment" } },
    { id: "blog", label: { tr: "Blog / Bilgilendirici makaleler", de: "Blog / Experten-Artikel", en: "Blog / Expert articles" } },
    { id: "social", label: { tr: "Sosyal medya bağlantısı", de: "Social-Media-Anbindung", en: "Social media links" } },
    { id: "whatsapp", label: { tr: "WhatsApp butonu", de: "WhatsApp-Schaltfläche", en: "WhatsApp button" } },
    { id: "branding", label: { tr: "Logo & marka kimliği", de: "Logo & Markenidentität", en: "Logo & Branding" } },
    { id: "copywriting", label: { tr: "İçerik yazımı desteği", de: "Unterstützung beim Texten", en: "Copywriting support" } },
    { id: "analytics", label: { tr: "Analytics & takip", de: "Analytics-Einrichtung", en: "Analytics setup" } },
  ];

  const revisionOptions = ["1", "2–3", "unlimited"];

  const toggleFeature = (id: string) => {
    if (data.features.includes(id)) {
      updateData({ features: data.features.filter((f) => f !== id) });
    } else {
      updateData({ features: [...data.features, id] });
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
      <motion.div variants={itemVariants} className="mb-20 text-center">
        <h2 className="text-[2.25rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] mb-6">
          {t("onboarding.step4.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step4.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-20">
        {/* Q1: Page Count */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold text-[#0e0e10]">
            {t("onboarding.step4.q1", lang)}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pageOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => updateData({ pageCount: opt })}
                className={`py-5 rounded-2xl text-[1rem] font-bold border-2 transition-all ${
                  data.pageCount === opt
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt} {opt.includes("+") ? "" : (lang === "tr" ? "sayfa" : (lang === "de" ? "Seite(n)" : "pages"))}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Q2: Features */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold text-[#0e0e10]">
            {t("onboarding.step4.q2", lang)}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {featureOptions.map((feat) => (
              <button
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className={`flex items-center gap-4 px-8 py-5 rounded-2xl text-[1rem] font-bold border-2 transition-all ${
                  data.features.includes(feat.id)
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  data.features.includes(feat.id) ? "bg-[#007aff] border-[#007aff]" : "border-[#d2d2d7]"
                }`}>
                  {data.features.includes(feat.id) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
                {feat.label[lang as keyof typeof feat.label] || feat.label.en}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Q3: Revisions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold text-[#0e0e10]">
            {t("onboarding.step4.q3", lang)}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revisionOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => updateData({ revisions: opt })}
                className={`py-5 rounded-2xl text-[1rem] font-bold border-2 transition-all ${
                  data.revisions === opt
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt === "unlimited" 
                  ? (lang === "tr" ? "Sınırsız" : (lang === "de" ? "Unbegrenzt" : "Unlimited"))
                  : (opt + " " + (lang === "tr" ? "tur" : (lang === "de" ? "Runde(n)" : "round(s)")))}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Q4: Existing Site */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.25rem] font-bold text-[#0e0e10]">
            {t("onboarding.step4.q4", lang)}
          </label>
          <div className="flex gap-4 w-full max-w-sm mx-auto">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => updateData({ hasExistingSite: val })}
                className={`flex-1 py-5 rounded-2xl text-[1.125rem] font-bold border-2 transition-all ${
                  data.hasExistingSite === val
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-4 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {val ? (lang === "tr" ? "Evet" : "Ja") : (lang === "tr" ? "Hayır" : "Nein")}
              </button>
            ))}
          </div>

          {data.hasExistingSite && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b]">
                <Globe size={20} />
              </div>
              <input
                type="text"
                value={data.existingSiteUrl}
                onChange={(e) => updateData({ existingSiteUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#f5f5f7] border border-transparent rounded-[1.25rem] px-16 py-5 text-[1.125rem] focus:bg-white focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10 transition-all outline-none font-medium"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        variants={itemVariants}
        className="mt-24 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-12"
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
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-12 py-6 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20"
        >
          {t("onboarding.common.next", lang)}
          <ArrowRight size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}
