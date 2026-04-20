import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ArrowRight, MessageSquare, Calendar, Mail, Loader2, Sparkles, Building2, Monitor, Search, Megaphone, Rocket, ShieldCheck, Zap } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;

interface LeadCaptureProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "IDENTITY" | "OBJECTIVE" | "SITE_TYPE" | "PRESENCE" | "RESULT";

export function LeadCapture({ isOpen, onClose }: LeadCaptureProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<Step>("IDENTITY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.replace(/\D/g, '').length >= 7;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firm: "",
    location: "",
    objective: [] as string[],
    siteType: "" as "single" | "multi" | "",
    websiteUrl: "",
    painPoints: "",
  });

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state when closed
      setTimeout(() => {
        setStep("IDENTITY");
        setError(null);
      }, 500);
    }
  }, [isOpen]);

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (step === "IDENTITY") setStep("OBJECTIVE");
    else if (step === "OBJECTIVE") setStep("SITE_TYPE");
    else if (step === "SITE_TYPE") setStep("PRESENCE");
    else if (step === "PRESENCE") handleSubmit();
  };

  const handleBack = () => {
    if (step === "OBJECTIVE") setStep("IDENTITY");
    else if (step === "SITE_TYPE") setStep("OBJECTIVE");
    else if (step === "PRESENCE") setStep("SITE_TYPE");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const packageResult = getPackageResult();
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          firm: formData.firm,
          city: formData.location,
          practiceArea: formData.objective.join(", "),
          hasWebsite: formData.websiteUrl ? "yes" : "no",
          websiteUrl: formData.websiteUrl,
          message: formData.painPoints,
          packageName: packageResult.name,
          setupPrice: packageResult.price,
          monthlyPrice: packageResult.monthly,
          source: "LEAD_CAPTURE_QUICK",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || data.error?.description || "Submission failed");
      }
      
      setStep("RESULT");
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || t("contact.error", lang));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPackageResult = () => {
    const { objective, siteType } = formData;
    const isGeo = objective.includes("geo");
    const isSeo = objective.includes("seo");
    const isAds = objective.includes("ads");

    // 1. Web Base
    let monthlyTotal = siteType === "multi" ? 150 : 75;
    let packageName = siteType === "multi" ? t("pricing.advanced", lang) : t("pricing.basic", lang);
    let features = siteType === "multi" 
      ? ["pricing.advanced.f1", "pricing.advanced.f2", "pricing.advanced.f3", "pricing.advanced.f7"] 
      : ["pricing.basic.f1", "pricing.basic.f2", "pricing.basic.f3", "pricing.basic.f5"];

    // 2. Add-ons
    if (isGeo) {
      monthlyTotal += 199; // SEO + GEO
      features.push("quote.step.objective.geo");
      if (!isSeo) features.push("quote.step.objective.seo");
    } else if (isSeo) {
      monthlyTotal += 150; // SEO only
      features.push("quote.step.objective.seo");
    }

    if (isAds) {
      monthlyTotal += 299;
      features.push("quote.step.objective.ads");
    }

    return {
      name: packageName,
      price: "0", // No setup fee
      monthly: String(monthlyTotal),
      features: Array.from(new Set(features)),
      recommended: siteType === "multi"
    };
  };

  const packageResult = getPackageResult();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full md:max-w-xl h-[92vh] md:h-auto md:max-h-[85vh] bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-black/5 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#0e0e10] font-bold text-xl leading-none">
                  n<span className="text-[#007aff]">.</span>
                </div>
                <div>
                   <h3 className="text-[1.125rem] font-bold tracking-tight text-[#0e0e10]">
                    {step === 'RESULT' ? t("quote.result.title", lang) : t("quote.teaser.cta", lang)}
                  </h3>
                  {step !== 'RESULT' && (
                    <div className="flex gap-1 mt-1">
                      {(["IDENTITY", "OBJECTIVE", "SITE_TYPE", "PRESENCE"] as Step[]).map((s, idx) => (
                        <div 
                          key={idx}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            s === step ? "w-6 bg-[#007aff]" : "w-2 bg-black/5"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                {step === "IDENTITY" && (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-[1.5rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-2 leading-[1.2]">
                        {t("quote.step.identity.title", lang)}
                      </h2>
                      <p className="text-[0.9375rem] md:text-[1.0625rem] text-[#86868b] font-medium">
                        {t("quote.step.identity.sub", lang)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("contact.name", lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => updateFormData({ name: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("onboarding.step1.firm", lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firm}
                          onChange={(e) => updateFormData({ firm: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("contact.phone", lang)}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateFormData({ phone: e.target.value })}
                          placeholder="+49..."
                          className={`w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 outline-none transition-all text-[0.9375rem] ${
                            formData.phone && !isValidPhone(formData.phone) 
                              ? "ring-2 ring-red-500/20" 
                              : "focus:ring-[#007aff]/20"
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("contact.email", lang)}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateFormData({ email: e.target.value })}
                          placeholder="mail@example.com"
                          className={`w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 outline-none transition-all text-[0.9375rem] ${
                            formData.email && !isValidEmail(formData.email) 
                              ? "ring-2 ring-red-500/20" 
                              : "focus:ring-[#007aff]/20"
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("onboarding.step1.city", lang)}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => updateFormData({ location: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "OBJECTIVE" && (
                  <motion.div
                    key="objective"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-3 leading-[1.1]">
                        {t("quote.step.objective.title", lang)}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: "web", title: t("quote.step.objective.web", lang), icon: Monitor, color: "#007aff" },
                        { id: "seo", title: t("quote.step.objective.seo", lang), icon: Search, color: "#34c759" },
                        { id: "geo", title: t("quote.step.objective.geo", lang), icon: Sparkles, color: "#ff2d55" },
                        { id: "ads", title: t("quote.step.objective.ads", lang), icon: Megaphone, color: "#ff9500" },
                        { id: "system", title: t("quote.step.objective.system", lang), icon: Rocket, color: "#af52de" },
                      ].map((opt) => {
                        const isSelected = formData.objective.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              const allOthers = ["web", "seo", "geo", "ads"];
                              let newObj: string[];

                              if (opt.id === "system") {
                                // If selecting 'system', select everything. If deselecting, clear everything.
                                newObj = isSelected ? [] : ["web", "seo", "geo", "ads", "system"];
                              } else {
                                // Standard toggle for individual items
                                newObj = isSelected
                                  ? formData.objective.filter(i => i !== opt.id)
                                  : [...formData.objective, opt.id];

                                // Auto-Completion: If all others are now selected, add 'system'
                                const allOthers = ["web", "seo", "geo", "ads"];
                                const hasAllOthers = allOthers.every(item => newObj.includes(item));
                                if (hasAllOthers && !newObj.includes("system")) {
                                  newObj.push("system");
                                }
                                
                                // Logical Dependency: If 'system' was selected but we just removed an individual item, remove 'system'
                                if (isSelected && newObj.includes("system")) {
                                  newObj = newObj.filter(i => i !== "system");
                                }
                              }
                              updateFormData({ objective: newObj });
                            }}
                            className={`w-full flex items-center justify-between p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border-2 transition-all group ${
                              isSelected 
                                ? "border-[#007aff] bg-[#007aff]/5" 
                                : "border-black/[0.05] hover:border-black/10"
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <div 
                                className="flex items-center justify-center transition-colors"
                                style={{ color: isSelected ? "#007aff" : opt.color }}
                              >
                                <opt.icon size={28} strokeWidth={2.5} />
                              </div>
                              <span className="text-[1.125rem] font-bold text-[#0e0e10]">{opt.title}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? "border-[#007aff] bg-[#007aff]" : "border-black/10"
                            }`}>
                              {isSelected && <Check size={14} className="text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === "SITE_TYPE" && (
                  <motion.div
                    key="siteType"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-[1.5rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-3 leading-[1.2]">
                        {t("quote.step.siteType.title", lang)}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "single", title: t("quote.step.siteType.single", lang), sub: t("quote.step.siteType.single.sub", lang), icon: Monitor },
                        { id: "multi", title: t("quote.step.siteType.multi", lang), sub: t("quote.step.siteType.multi.sub", lang), icon: Building2 },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateFormData({ siteType: opt.id as any })}
                          className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all text-center h-full ${
                            formData.siteType === opt.id 
                              ? "border-[#007aff] bg-[#007aff]/5" 
                              : "border-black/[0.05] hover:border-black/10"
                          }`}
                        >
                          <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl md:rounded-2xl ${formData.siteType === opt.id ? "bg-[#007aff] text-white" : "bg-[#f5f5f7] text-[#0e0e10]"}`}>
                            <opt.icon size={28} className="md:w-8 md:h-8" />
                          </div>
                          <span className="text-[1.125rem] md:text-[1.25rem] font-bold text-[#0e0e10] mb-1 md:mb-2">{opt.title}</span>
                          <span className="text-[0.8125rem] md:text-[0.875rem] text-[#86868b] font-medium leading-relaxed">{opt.sub}</span>
                          <div className={`mt-4 md:mt-6 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.siteType === opt.id ? "border-[#007aff] bg-[#007aff]" : "border-black/10"
                          }`}>
                            {formData.siteType === opt.id && <Check size={12} className="text-white md:w-3.5 md:h-3.5" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === "PRESENCE" && (
                  <motion.div
                    key="presence"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-[1.5rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-3 leading-[1.2]">
                        {t("quote.step.presence.title", lang)}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("quote.step.presence.url", lang)}
                        </label>
                        <input
                          type="url"
                          placeholder="https://"
                          value={formData.websiteUrl}
                          onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.8125rem] font-bold text-[#0e0e10] ml-1">
                          {t("quote.step.presence.pain", lang)}
                        </label>
                        <textarea
                          rows={4}
                          placeholder={t("quote.step.presence.pain.placeholder", lang)}
                          value={formData.painPoints}
                          onChange={(e) => updateFormData({ painPoints: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem] resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "RESULT" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="mb-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center mb-1"
                      >
                        <h2 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight text-[#0e0e10] uppercase">
                          {packageResult.name}
                        </h2>
                      </motion.div>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[0.7rem] md:text-[0.75rem] tracking-[0.2em] uppercase text-[#86868b] font-bold mb-3 md:mb-4"
                      >
                        {t("quote.result.estimate", lang)}
                      </motion.p>

                       <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex flex-col items-center gap-1 bg-white border border-black/[0.03] p-4 md:p-6 md:px-10 rounded-[1.25rem] md:rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.05)] mb-3 md:mb-4"
                      >
                        <div className="flex items-baseline gap-2 md:gap-3">
                          <span className="text-[2.25rem] md:text-[3rem] font-extrabold text-[#0e0e10] tabular-nums tracking-tighter">€{packageResult.monthly}</span>
                          <span className="text-[0.75rem] md:text-[0.875rem] font-bold text-[#86868b] uppercase tracking-widest">/{t("quote.result.monthly", lang)}</span>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-[#fbfbfd] border border-black/[0.04] rounded-[1.25rem] md:rounded-[1.5rem] p-4 md:p-5 max-w-lg mx-auto mb-3 md:mb-4 shadow-sm overflow-hidden relative"
                    >
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                          <Zap size={120} strokeWidth={1} />
                       </div>
                       
                       <ul className="space-y-4 text-left relative z-10">
                        {packageResult.features.map((f, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + (i * 0.1) }}
                            className="flex gap-4 text-[1rem] font-semibold text-[#1d1d1f]"
                          >
                            <div className="h-6 w-6 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 shadow-sm">
                               <Check size={14} className="text-[#007aff]" strokeWidth={2.5} />
                            </div>
                            {t(f, lang)}
                          </motion.li>
                        ))}
                      </ul>
                      
                      <div className="mt-3 pt-3 border-t border-black/5">
                        <p className="text-[0.75rem] md:text-[0.8125rem] text-[#86868b] leading-relaxed italic font-medium">
                           {t("quote.result.finalNote", lang)}
                        </p>
                      </div>
                    </motion.div>

                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-[0.8125rem] md:text-[0.875rem] font-bold shadow-xl">
                           <Calendar size={18} />
                           {t("quote.result.callback", lang)}
                        </div>
                      </motion.div>

                      <div className="space-y-2">
                        <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.2em] uppercase text-[#86868b] font-bold mb-2">
                           {t("quote.result.orContact", lang)}
                        </p>
                        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-3 px-4">
                           <a 
                            href="https://wa.me/491627176334" 
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl md:rounded-2xl bg-[#25D366] text-white text-[0.75rem] md:text-[0.8125rem] font-bold hover:translate-y-[-2px] hover:shadow-lg transition-all col-span-1"
                          >
                            <MessageSquare size={16} />
                            WhatsApp
                          </a>
                          <a 
                            href="https://calendly.com/atageldiyewhalyl/business-beratung"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl md:rounded-2xl bg-[#007aff] text-white text-[0.75rem] md:text-[0.8125rem] font-bold hover:translate-y-[-2px] hover:shadow-lg transition-all col-span-1"
                          >
                            <Calendar size={16} />
                            Calendly
                          </a>
                           <a 
                            href="mailto:Halyl@nüll.com"
                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl md:rounded-2xl bg-[#f5f5f7] text-[#0e0e10] text-[0.75rem] md:text-[0.8125rem] font-bold hover:translate-y-[-2px] transition-all col-span-2"
                          >
                            <Mail size={16} />
                            Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Buttons */}
            {step !== "RESULT" && (
              <div className="p-4 md:p-8 border-t border-black/5 bg-white flex items-center justify-between sticky bottom-0 z-10 safe-area-bottom">
                <button
                  onClick={handleBack}
                  disabled={step === "IDENTITY"}
                  className="px-6 py-3 rounded-full text-[0.9375rem] font-bold text-[#86868b] hover:text-[#0e0e10] disabled:opacity-0 transition-all"
                >
                  {t("onboarding.common.back", lang)}
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    isSubmitting ||
                    (step === "IDENTITY" && (
                      !formData.name || 
                      !isValidEmail(formData.email) || 
                      !isValidPhone(formData.phone) || 
                      !formData.firm || 
                      !formData.location
                    )) ||
                    (step === "OBJECTIVE" && formData.objective.length === 0) ||
                    (step === "SITE_TYPE" && !formData.siteType)
                  }
                  className="bg-black text-white px-8 py-3 rounded-full text-[0.9375rem] font-bold flex items-center gap-2 hover:bg-[#2c2c2e] transition-all active:scale-[0.98] disabled:opacity-30"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> {t("contact.sending", lang)}</>
                  ) : step === "PRESENCE" ? (
                    <>{t("contact.send", lang)} <ArrowRight size={18} /></>
                  ) : (
                    <>{t("onboarding.common.next", lang)} <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            )}
            
            {error && (
              <div className="px-10 pb-6 text-center">
                <p className="text-red-500 text-sm font-bold">{error}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LeadCapture;
