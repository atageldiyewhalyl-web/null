import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Globe, Calendar, FileText } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { useState } from "react";

interface OnboardingLogisticsProps {
  data: {
    deadline: string;
    domainStatus: "" | "yes" | "no" | "help";
    domainName: string;
    contentReady: string[];
    extraNotes: string;
  };
  updateData: (fields: Partial<OnboardingLogisticsProps["data"]>) => void;
  onComplete: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function OnboardingLogistics({ 
  data, 
  updateData, 
  onComplete, 
  onBack,
  isSubmitting = false 
}: OnboardingLogisticsProps) {
  const { lang } = useLanguage();

  const deadlineOptions = [
    { id: "4-7", label: t("onboarding.step8.q2.4-7", lang) },
    { id: "7-10", label: t("onboarding.step8.q2.7-10", lang) },
    { id: "10-14", label: t("onboarding.step8.q2.10-14", lang) },
    { id: "flexible", label: t("onboarding.step8.q2.flex", lang) },
  ];
// ... rest of the component

  const assetOptions = [
    { id: "text", title: t("onboarding.step8.q3.text", lang), sub: t("onboarding.step8.q3.text.sub", lang) },
    { id: "photos", title: t("onboarding.step8.q3.photos", lang), sub: t("onboarding.step8.q3.photos.sub", lang) },
    { id: "logo", title: t("onboarding.step8.q3.logo", lang), sub: t("onboarding.step8.q3.logo.sub", lang) },
    { id: "none", title: t("onboarding.step8.q3.none", lang), sub: t("onboarding.step8.q3.none.sub", lang) },
  ];

  const toggleAsset = (id: string) => {
    const current = data.contentReady || [];
    if (id === "none") {
      updateData({ contentReady: ["none"] });
    } else {
      const filtered = current.filter(item => item !== "none");
      if (filtered.includes(id)) {
        updateData({ contentReady: filtered.filter(item => item !== id) });
      } else {
        updateData({ contentReady: [...filtered, id] });
      }
    }
  };

  const domainOptions = [
    { id: "yes", label: t("onboarding.step8.q1.yes", lang) },
    { id: "no", label: t("onboarding.step8.q1.no", lang) },
    { id: "help", label: t("onboarding.step8.q1.help", lang) },
  ];

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
          {t("onboarding.step8.title", lang)}
        </h2>
        <p className="text-[1.125rem] text-[#86868b] font-medium max-w-xl mx-auto leading-relaxed">
          {t("onboarding.step8.sub", lang)}
        </p>
      </motion.div>

      <div className="space-y-40">
        {/* Q1: Domain Selection (3-way) */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.5rem] font-bold text-[#0e0e10] flex items-center justify-center gap-2">
            <Globe size={24} className="text-[#007aff]" />
            {t("onboarding.step8.q1", lang)}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            {domainOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateData({ domainStatus: opt.id as any })}
                className={`py-8 px-6 rounded-[2rem] text-[1.125rem] font-bold border-2 transition-all h-full flex items-center justify-center text-center ${
                  data.domainStatus === opt.id
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-8 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {data.domainStatus === "yes" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative max-w-2xl mx-auto w-full mt-4"
            >
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b]">
                <Globe size={20} />
              </div>
              <input
                type="text"
                value={data.domainName}
                onChange={(e) => updateData({ domainName: e.target.value })}
                placeholder="domain-adi.com"
                className="w-full bg-[#f5f5f7] border border-transparent rounded-[1.25rem] px-16 py-5 text-[1.125rem] focus:bg-white focus:border-[#007aff] transition-all outline-none font-medium shadow-sm"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Q2: Deadline Tiers */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.5rem] font-bold text-[#0e0e10] flex items-center justify-center gap-2">
            <Calendar size={24} className="text-[#007aff]" />
            {t("onboarding.step8.q2", lang)}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
            {deadlineOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateData({ deadline: opt.id })}
                className={`py-6 px-4 rounded-full text-[1.125rem] font-bold border-2 transition-all ${
                  data.deadline === opt.id
                    ? "border-[#007aff] bg-[#f5faff] text-[#007aff] ring-8 ring-[#007aff]/5"
                    : "border-[#f5f5f7] bg-white text-[#86868b] hover:border-[#d2d2d7]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Q3: Asset Readiness Checklist (Checkboxes) */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.5rem] font-bold text-[#0e0e10] flex items-center justify-center gap-2">
            <FileText size={24} className="text-[#007aff]" />
            {t("onboarding.step8.q3", lang)}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full text-left">
            {assetOptions.map((opt) => {
              const isSelected = (data.contentReady || []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleAsset(opt.id)}
                  className={`relative p-8 rounded-[2.5rem] border-2 transition-all group flex flex-col gap-3 ${
                    isSelected
                      ? "border-[#007aff] bg-[#f5faff] shadow-xl ring-8 ring-[#007aff]/5"
                      : "border-[#f5f5f7] bg-white hover:border-[#d2d2d7]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-[1.25rem] font-bold ${isSelected ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                      {opt.title}
                    </h4>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "bg-[#007aff] border-[#007aff] text-white" : "border-[#d2d2d7]"
                    }`}>
                      {isSelected && <CheckCircle size={20} strokeWidth={3} />}
                    </div>
                  </div>
                  <p className="text-[1rem] text-[#86868b] font-medium leading-relaxed">
                    {opt.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Q4: Refined Extra Notes */}
        <motion.div variants={itemVariants} className="flex flex-col gap-10 text-center">
          <label className="block text-[1.5rem] font-bold text-[#0e0e10]">
            {t("onboarding.step8.q4", lang)}
          </label>
          <div className="relative max-w-6xl mx-auto group w-full">
            <textarea
              value={data.extraNotes}
              onChange={(e) => updateData({ extraNotes: e.target.value })}
              placeholder={t("onboarding.step8.q4", lang)}
              rows={5}
              className="w-full bg-white border-2 border-[#f5f5f7] rounded-[2.5rem] px-10 py-10 text-[1.25rem] focus:border-[#007aff] focus:ring-8 focus:ring-[#007aff]/10 transition-all outline-none font-medium resize-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-[#d2d2d7]"
            />
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <div className="max-w-4xl mx-auto w-full px-6 mt-40">
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-16"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[1.125rem] font-bold text-[#86868b] hover:text-[#0e0e10] transition-colors"
          >
            <ArrowLeft size={24} />
            {t("onboarding.common.back", lang)}
          </button>
  
          <button
            onClick={() => {
              console.log("BUTTON CLICKED! Calling onComplete...");
              onComplete();
            }}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-[#0e0e10] text-white px-12 py-6 rounded-full text-[1.25rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-[0_25px_60px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-wait"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-7 h-7 border-3 border-white/20 border-t-white rounded-full"
              />
            ) : (
              <>
                {lang === "tr" ? "Formu Tamamla (TEST)" : lang === "de" ? "Abschließen (TEST)" : "Complete (TEST)"}
                <CheckCircle size={24} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
