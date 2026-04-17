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

type Step = "IDENTITY" | "OBJECTIVE" | "SCALE" | "PRESENCE" | "RESULT";

export function LeadCapture({ isOpen, onClose }: LeadCaptureProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<Step>("IDENTITY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firm: "",
    location: "",
    objective: [] as string[],
    scale: "" as "single" | "small" | "large" | "",
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
    else if (step === "OBJECTIVE") setStep("SCALE");
    else if (step === "SCALE") setStep("PRESENCE");
    else if (step === "PRESENCE") handleSubmit();
  };

  const handleBack = () => {
    if (step === "OBJECTIVE") setStep("IDENTITY");
    else if (step === "SCALE") setStep("OBJECTIVE");
    else if (step === "PRESENCE") setStep("SCALE");
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
    const { objective, scale } = formData;
    const serviceCount = objective.length;
    const isSystem = objective.includes("system");
    const isAds = objective.includes("ads");
    const isSEO = objective.includes("seo");

    // Dynamic Monthly Calculation based on Priority
    let monthlyPrice = "99";
    if (isSystem) monthlyPrice = "220";
    else if (isAds) monthlyPrice = "220";
    else if (isSEO) monthlyPrice = "170";

    // Premium: Only if Full System AND (Small or Large Firm)
    if (isSystem && (scale === "small" || scale === "large")) {
      return {
        name: t("pricing.premium", lang),
        price: "1.199",
        monthly: monthlyPrice,
        features: ["pricing.premium.f1", "pricing.premium.f3", "pricing.premium.f4", "pricing.premium.f8"],
        recommended: true
      };
    }
    
    // Starter: Only if 1 Service AND (Individual Expert)
    if (serviceCount === 1 && scale === "single") {
      return {
        name: t("pricing.starter", lang),
        price: "549",
        monthly: monthlyPrice,
        features: ["pricing.starter.f1", "pricing.starter.f2", "pricing.starter.f3", "pricing.starter.f5"],
        recommended: false
      };
    }

    // Growth: The default "middle tier" for the masses
    return {
      name: t("pricing.growth", lang),
      price: "849",
      monthly: monthlyPrice,
      features: ["pricing.growth.f1", "pricing.growth.f3", "pricing.growth.f4", "pricing.growth.f7"],
      recommended: true
    };
  };

  const packageResult = getPackageResult();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-black/5 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#0e0e10] font-bold text-xl">
                  n<span className="text-[#007aff]">.</span>
                </div>
                <div>
                   <h3 className="text-[1.125rem] font-bold tracking-tight text-[#0e0e10]">
                    {step === 'RESULT' ? t("quote.result.title", lang) : t("quote.teaser.cta", lang)}
                  </h3>
                  {step !== 'RESULT' && (
                    <div className="flex gap-1 mt-1">
                      {(["IDENTITY", "OBJECTIVE", "SCALE", "PRESENCE"] as Step[]).map((s, idx) => (
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
            <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[70vh]">
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
                      <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-3 leading-[1.1]">
                        {t("quote.step.identity.title", lang)}
                      </h2>
                      <p className="text-[1.0625rem] text-[#86868b] font-medium">
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
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem]"
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
                          className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all text-[0.9375rem]"
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
                        { id: "ads", title: t("quote.step.objective.ads", lang), icon: Megaphone, color: "#ff9500" },
                        { id: "system", title: t("quote.step.objective.system", lang), icon: Rocket, color: "#af52de" },
                      ].map((opt) => {
                        const isSelected = formData.objective.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              const allOthers = ["web", "seo", "ads"];
                              let newObj: string[];

                              if (opt.id === "system") {
                                // If selecting 'system', select everything. If deselecting, clear everything.
                                newObj = isSelected ? [] : ["web", "seo", "ads", "system"];
                              } else {
                                // Standard toggle for individual items
                                newObj = isSelected
                                  ? formData.objective.filter(i => i !== opt.id)
                                  : [...formData.objective, opt.id];

                                // Auto-Completion: If all others are now selected, add 'system'
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
                            className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all group ${
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

                {step === "SCALE" && (
                  <motion.div
                    key="scale"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-3 leading-[1.1]">
                        {t("quote.step.scale.title", lang)}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "single", title: t("quote.step.scale.single", lang) },
                        { id: "small", title: t("quote.step.scale.small", lang) },
                        { id: "large", title: t("quote.step.scale.large", lang) },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateFormData({ scale: opt.id as any })}
                          className={`flex flex-col items-center justify-center aspect-square p-6 rounded-[2rem] border-2 transition-all ${
                            formData.scale === opt.id 
                              ? "border-[#007aff] bg-[#007aff]/5" 
                              : "border-black/[0.05] hover:border-black/10"
                          } ${opt.id === 'large' ? 'md:col-span-2 md:aspect-auto md:py-8' : ''}`}
                        >
                          <span className="text-[1.125rem] font-bold text-[#0e0e10] text-center">{opt.title}</span>
                          <div className={`mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.scale === opt.id ? "border-[#007aff] bg-[#007aff]" : "border-black/10"
                          }`}>
                            {formData.scale === opt.id && <Check size={14} className="text-white" />}
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
                      <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold tracking-tight text-[#0e0e10] mb-3 leading-[1.1]">
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
                        <h2 className="text-[2rem] md:text-[2.5rem] font-bold tracking-tight text-[#0e0e10] uppercase">
                          {packageResult.name}
                        </h2>
                      </motion.div>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[0.75rem] tracking-[0.2em] uppercase text-[#86868b] font-bold mb-6"
                      >
                        {t("quote.result.estimate", lang)}
                      </motion.p>

                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex flex-col md:flex-row items-center gap-4 bg-white border border-black/[0.03] p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-4"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-[2.5rem] font-extrabold text-[#0e0e10] tabular-nums">€{packageResult.price}</span>
                          <span className="text-[0.75rem] font-bold text-[#86868b] uppercase tracking-widest">{t("quote.result.setup", lang)}</span>
                        </div>
                        <div className="hidden md:flex items-center justify-center text-[#d2d2d7] text-xl font-light">+</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[1.75rem] font-bold text-[#007aff] tabular-nums">€{packageResult.monthly}</span>
                          <span className="text-[0.75rem] font-bold text-[#86868b] uppercase tracking-widest">/{t("quote.result.monthly", lang)}</span>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-[#fbfbfd] border border-black/[0.04] rounded-[2.5rem] p-6 md:p-8 max-w-lg mx-auto mb-6 shadow-sm overflow-hidden relative"
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
                      
                      <div className="mt-4 pt-4 border-t border-black/5">
                        <p className="text-[0.8125rem] text-[#86868b] leading-relaxed italic font-medium">
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
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-[0.875rem] font-bold shadow-xl">
                           <Calendar size={18} />
                           {t("quote.result.callback", lang)}
                        </div>
                      </motion.div>

                      <div className="space-y-2">
                        <p className="text-[0.75rem] tracking-[0.2em] uppercase text-[#86868b] font-bold">
                           {t("quote.result.orContact", lang)}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                           <a 
                            href="https://wa.me/491627176334" 
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#25D366] text-white text-[0.8125rem] font-bold hover:translate-y-[-2px] hover:shadow-lg transition-all"
                          >
                            <MessageSquare size={18} />
                            WhatsApp
                          </a>
                          <a 
                            href="https://calendly.com/atageldiyewhalyl/business-beratung"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#007aff] text-white text-[0.8125rem] font-bold hover:translate-y-[-2px] hover:shadow-lg transition-all"
                          >
                            <Calendar size={18} />
                            Calendly
                          </a>
                           <a 
                            href="mailto:Halyl@nüll.com"
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#f5f5f7] text-[#0e0e10] text-[0.8125rem] font-bold hover:translate-y-[-2px] transition-all"
                          >
                            <Mail size={18} />
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
              <div className="p-8 md:p-10 border-t border-black/5 bg-[#fafafa] flex items-center justify-between">
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
                      !formData.email || 
                      !formData.phone || 
                      !formData.firm || 
                      !formData.location
                    )) ||
                    (step === "OBJECTIVE" && formData.objective.length === 0) ||
                    (step === "SCALE" && !formData.scale)
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
