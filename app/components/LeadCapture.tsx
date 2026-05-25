import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Check,
  Files,
  Loader2,
  Megaphone,
  Monitor,
  Rocket,
  Search,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import gmailIcon from "../assets/icons/gmail-icon.webp";
import whatsappIcon from "../assets/icons/whatsapp-icon.webp";
import { useLanguage, t } from "./LanguageContext";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;

type Step = "IDENTITY" | "OBJECTIVE" | "SITE_TYPE" | "PRESENCE" | "RESULT";
const quoteSteps: Step[] = ["OBJECTIVE", "SITE_TYPE", "PRESENCE", "IDENTITY"];

interface LeadCaptureProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "modal" | "embedded";
}

export function LeadCapture({ isOpen = false, onClose = () => {}, variant = "modal" }: LeadCaptureProps) {
  const { lang } = useLanguage();
  const isEmbedded = variant === "embedded";
  const [step, setStep] = useState<Step>("OBJECTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.replace(/\D/g, "").length >= 7;

  useEffect(() => {
    if (isEmbedded) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "unset";
    const timer = window.setTimeout(() => {
      setStep("OBJECTIVE");
      setError(null);
    }, 500);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, [isEmbedded, isOpen]);

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const getPackageResult = () => {
    const { objective, siteType } = formData;
    const isGeo = objective.includes("geo");
    const isSeo = objective.includes("seo");
    const isAds = objective.includes("ads");

    let monthlyTotal = siteType === "multi" ? 150 : 75;
    const packageName = siteType === "multi" ? t("pricing.advanced", lang) : t("pricing.basic", lang);
    const features =
      siteType === "multi"
        ? ["pricing.advanced.f1", "pricing.advanced.f2", "pricing.advanced.f3", "pricing.advanced.f7"]
        : ["pricing.basic.f1", "pricing.basic.f2", "pricing.basic.f3", "pricing.basic.f5"];

    if (isGeo) {
      monthlyTotal += 199;
      features.push("quote.step.objective.geo");
      if (!isSeo) features.push("quote.step.objective.seo");
    } else if (isSeo) {
      monthlyTotal += 150;
      features.push("quote.step.objective.seo");
    }

    if (isAds) {
      monthlyTotal += 299;
      features.push("quote.step.objective.ads");
    }

    return {
      name: packageName,
      price: "0",
      monthly: String(monthlyTotal),
      features: Array.from(new Set(features)),
    };
  };

  const packageResult = getPackageResult();

  const handleNext = () => {
    if (step === "OBJECTIVE") setStep("SITE_TYPE");
    else if (step === "SITE_TYPE") setStep("PRESENCE");
    else if (step === "PRESENCE") setStep("IDENTITY");
    else if (step === "IDENTITY") handleSubmit();
  };

  const handleBack = () => {
    if (step === "SITE_TYPE") setStep("OBJECTIVE");
    else if (step === "PRESENCE") setStep("SITE_TYPE");
    else if (step === "IDENTITY") setStep("PRESENCE");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
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
          source: isEmbedded ? "LEAD_CAPTURE_EMBEDDED" : "LEAD_CAPTURE_MODAL",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || data.error?.description || "Submission failed");
      }

      setStep("RESULT");
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-18170315805/uJ-SCL7h764cEJ2IpNhD",
          value: 1.0,
          currency: "EUR",
        });
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || t("contact.error", lang));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue =
    !isSubmitting &&
    !(
      (step === "OBJECTIVE" && formData.objective.length === 0) ||
      (step === "SITE_TYPE" && !formData.siteType) ||
      (step === "IDENTITY" &&
        (!formData.name ||
          !isValidEmail(formData.email) ||
          !isValidPhone(formData.phone) ||
          !formData.firm ||
          !formData.location))
    );

  const fieldClass =
    "w-full rounded-2xl border-none bg-[#f5f5f7] px-5 py-3.5 text-[0.9375rem] outline-none transition-all focus:ring-2 focus:ring-[#007aff]/20";

  const selectObjective = (id: string, isSelected: boolean) => {
    let nextObjective: string[];

    if (id === "system") {
      nextObjective = isSelected ? [] : ["web", "seo", "geo", "ads", "system"];
    } else {
      nextObjective = isSelected
        ? formData.objective.filter((item) => item !== id)
        : [...formData.objective, id];

      const coreItems = ["web", "seo", "geo", "ads"];
      if (coreItems.every((item) => nextObjective.includes(item)) && !nextObjective.includes("system")) {
        nextObjective.push("system");
      }

      if (isSelected && nextObjective.includes("system")) {
        nextObjective = nextObjective.filter((item) => item !== "system");
      }
    }

    updateFormData({ objective: nextObjective });
  };

  const panel = (
    <motion.div
      initial={isEmbedded ? false : { opacity: 0, scale: 0.95, y: 100 }}
      animate={isEmbedded ? undefined : { opacity: 1, scale: 1, y: 0 }}
      exit={isEmbedded ? undefined : { opacity: 0, scale: 0.95, y: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={
        isEmbedded
          ? "relative flex max-h-[820px] min-h-[640px] w-full flex-col overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#fbfbfd]"
          : "relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-[92dvh] sm:rounded-t-[2.5rem] md:h-auto md:max-h-[85vh] md:max-w-xl md:rounded-[2.5rem]"
      }
    >
      {isEmbedded ? (
        <div className="px-5 pt-5 md:px-6 md:pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#86868b]">
                {t("pricing.individual.preview.label", lang)}
              </p>
              <h3 className="mt-1 text-[1.35rem] font-bold tracking-tight text-[#0e0e10]">
                {step === "RESULT" ? t("pricing.individual.preview.estimate", lang) : t("pricing.individual.preview.title", lang)}
              </h3>
            </div>
            <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[0.72rem] font-bold text-[#6e6e73] shadow-sm">
              60 sec
            </span>
          </div>
          {step !== "RESULT" && (
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {quoteSteps.map((item) => (
                <div key={item} className={`h-1.5 rounded-full transition-colors ${item === step ? "bg-[#007aff]" : "bg-black/[0.06]"}`} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/80 p-4 backdrop-blur-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f5f7] text-lg font-bold leading-none text-[#0e0e10] md:h-10 md:w-10 md:text-xl">
              n<span className="text-[#007aff]">.</span>
            </div>
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#86868b] md:text-[0.68rem] md:tracking-[0.16em]">
                {t("pricing.individual.preview.label", lang)}
              </p>
              <h3 className="text-[1rem] font-bold tracking-tight text-[#0e0e10] md:text-[1.125rem]">
                {step === "RESULT" ? t("quote.result.title", lang) : t("quote.teaser.cta", lang)}
              </h3>
              {step !== "RESULT" && (
                <div className="mt-1 flex gap-1">
                  {quoteSteps.map((item) => (
                    <div key={item} className={`h-1 rounded-full transition-all duration-300 ${item === step ? "w-6 bg-[#007aff]" : "w-2 bg-black/5"}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 md:h-10 md:w-10">
            <X size={20} />
          </button>
        </div>
      )}

      <div className={`min-h-0 flex-1 overflow-y-auto ${isEmbedded ? "p-5 md:p-6" : "p-4 md:p-10"}`}>
        <AnimatePresence mode="wait">
          {step === "IDENTITY" && (
            <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={isEmbedded ? "space-y-6" : "space-y-8"}>
              <div>
                <h2 className={`${isEmbedded ? "text-[1.45rem] md:text-[1.65rem]" : "text-[1.5rem] md:text-[2.25rem]"} mb-2 font-bold leading-[1.2] tracking-tight text-[#0e0e10]`}>
                  {t("quote.step.identity.title", lang)}
                </h2>
                <p className={`${isEmbedded ? "text-[0.9rem]" : "text-[0.9375rem] md:text-[1.0625rem]"} font-medium text-[#86868b]`}>
                  {t("quote.step.identity.sub", lang)}
                </p>
              </div>

              <div className={`grid grid-cols-1 ${isEmbedded ? "gap-4" : "gap-6 md:grid-cols-2"}`}>
                <div className="space-y-2">
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("contact.name", lang)}</label>
                  <input type="text" required value={formData.name} onChange={(event) => updateFormData({ name: event.target.value })} className={isEmbedded ? `${fieldClass} bg-white` : fieldClass} />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("onboarding.step1.firm", lang)}</label>
                  <input type="text" required value={formData.firm} onChange={(event) => updateFormData({ firm: event.target.value })} className={isEmbedded ? `${fieldClass} bg-white` : fieldClass} />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("contact.phone", lang)}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(event) => updateFormData({ phone: event.target.value })}
                    placeholder="+49..."
                    className={`${isEmbedded ? `${fieldClass} bg-white` : fieldClass} ${formData.phone && !isValidPhone(formData.phone) ? "ring-2 ring-red-500/20" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("contact.email", lang)}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => updateFormData({ email: event.target.value })}
                    placeholder="mail@example.com"
                    className={`${isEmbedded ? `${fieldClass} bg-white` : fieldClass} ${formData.email && !isValidEmail(formData.email) ? "ring-2 ring-red-500/20" : ""}`}
                  />
                </div>
                <div className={`${isEmbedded ? "" : "md:col-span-2"} space-y-2`}>
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("onboarding.step1.city", lang)}</label>
                  <input type="text" required value={formData.location} onChange={(event) => updateFormData({ location: event.target.value })} className={isEmbedded ? `${fieldClass} bg-white` : fieldClass} />
                </div>
              </div>
            </motion.div>
          )}

          {step === "OBJECTIVE" && (
            <motion.div key="objective" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={isEmbedded ? "space-y-6" : "space-y-5 md:space-y-8"}>
              <h2 className={`${isEmbedded ? "text-[1.45rem] md:text-[1.65rem]" : "text-[1.55rem] md:text-[2.25rem]"} font-bold leading-[1.08] tracking-tight text-[#0e0e10] md:leading-[1.1]`}>
                {t("quote.step.objective.title", lang)}
              </h2>

              <div className={isEmbedded ? "space-y-3" : "space-y-2.5 md:space-y-4"}>
                {[
                  { id: "web", title: t("quote.step.objective.web", lang), Icon: Monitor, color: "#007aff" },
                  { id: "seo", title: t("quote.step.objective.seo", lang), Icon: Search, color: "#34c759" },
                  { id: "geo", title: t("quote.step.objective.geo", lang), Icon: Sparkles, color: "#ff2d55" },
                  { id: "ads", title: t("quote.step.objective.ads", lang), Icon: Megaphone, color: "#ff9500" },
                  { id: "system", title: t("quote.step.objective.system", lang), Icon: Rocket, color: "#af52de" },
                ].map(({ id, title, Icon, color }) => {
                  const isSelected = formData.objective.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => selectObjective(id, isSelected)}
                      className={`flex w-full items-center justify-between gap-3 border-2 text-left transition-all ${
                        isEmbedded ? "rounded-[1.25rem] px-3.5 py-4 sm:p-4" : "rounded-[1rem] px-3 py-3 sm:rounded-[1.25rem] sm:p-4 md:rounded-[1.5rem] md:p-6"
                      } ${isSelected ? "border-[#007aff] bg-white" : "border-black/[0.05] bg-white/70 hover:border-black/10 hover:bg-white"}`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
                        <Icon className="shrink-0" size={isEmbedded ? 24 : 22} strokeWidth={2.5} style={{ color: isSelected ? "#007aff" : color }} />
                        <span className={`${isEmbedded ? "text-[0.95rem] sm:text-[0.98rem]" : "text-[0.92rem] sm:text-[1.125rem]"} min-w-0 flex-1 whitespace-normal break-words font-bold leading-tight text-[#0e0e10]`}>{title}</span>
                      </div>
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all sm:h-6 sm:w-6 ${isSelected ? "border-[#007aff] bg-[#007aff]" : "border-black/10"}`}>
                        {isSelected && <Check size={12} className="text-white sm:h-3.5 sm:w-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === "SITE_TYPE" && (
            <motion.div key="site-type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={isEmbedded ? "space-y-6" : "space-y-8"}>
              <h2 className={`${isEmbedded ? "text-[1.45rem] md:text-[1.65rem]" : "text-[1.5rem] md:text-[2.25rem]"} font-bold leading-[1.2] tracking-tight text-[#0e0e10]`}>
                {t("quote.step.siteType.title", lang)}
              </h2>

              <div className={`grid grid-cols-1 ${isEmbedded ? "gap-3" : "gap-4 md:grid-cols-2"}`}>
                {[
                  { id: "single", title: t("quote.step.siteType.single", lang), sub: t("quote.step.siteType.single.sub", lang), Icon: Monitor },
                  { id: "multi", title: t("quote.step.siteType.multi", lang), sub: t("quote.step.siteType.multi.sub", lang), Icon: Files },
                ].map(({ id, title, sub, Icon }) => {
                  const isSelected = formData.siteType === id;
                  return (
                    <button
                      key={id}
                      onClick={() => updateFormData({ siteType: id as "single" | "multi" })}
                      className={`h-full rounded-[1.5rem] border-2 transition-all md:rounded-[2rem] ${
                        isEmbedded ? "flex items-center gap-4 p-4 text-left" : "flex flex-col items-center justify-center p-6 text-center md:p-8"
                      } ${isSelected ? "border-[#007aff] bg-white" : "border-black/[0.05] bg-white/70 hover:border-black/10 hover:bg-white"}`}
                    >
                      <div className={`${isEmbedded ? "shrink-0 p-3" : "mb-4 p-3 md:mb-6 md:p-4"} rounded-xl md:rounded-2xl ${isSelected ? "bg-[#007aff] text-white" : "bg-[#f5f5f7] text-[#0e0e10]"}`}>
                        <Icon size={isEmbedded ? 24 : 28} />
                      </div>
                      <div className={isEmbedded ? "min-w-0 flex-1" : ""}>
                        <span className={`${isEmbedded ? "text-[1rem]" : "text-[1.125rem] md:text-[1.25rem]"} block font-bold text-[#0e0e10]`}>{title}</span>
                        <span className="mt-1 block text-[0.8125rem] font-medium leading-relaxed text-[#86868b] md:text-[0.875rem]">{sub}</span>
                      </div>
                      <div className={`${isEmbedded ? "shrink-0" : "mt-4 md:mt-6"} flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all md:h-6 md:w-6 ${isSelected ? "border-[#007aff] bg-[#007aff]" : "border-black/10"}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === "PRESENCE" && (
            <motion.div key="presence" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={isEmbedded ? "space-y-6" : "space-y-8"}>
              <h2 className={`${isEmbedded ? "text-[1.45rem] md:text-[1.65rem]" : "text-[1.5rem] md:text-[2.25rem]"} font-bold leading-[1.2] tracking-tight text-[#0e0e10]`}>
                {t("quote.step.presence.title", lang)}
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("quote.step.presence.url", lang)}</label>
                  <input type="url" placeholder="https://" value={formData.websiteUrl} onChange={(event) => updateFormData({ websiteUrl: event.target.value })} className={isEmbedded ? `${fieldClass} bg-white` : fieldClass} />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[0.8125rem] font-bold text-[#0e0e10]">{t("quote.step.presence.pain", lang)}</label>
                  <textarea
                    rows={isEmbedded ? 5 : 4}
                    placeholder={t("quote.step.presence.pain.placeholder", lang)}
                    value={formData.painPoints}
                    onChange={(event) => updateFormData({ painPoints: event.target.value })}
                    className={`${isEmbedded ? `${fieldClass} bg-white` : fieldClass} resize-none`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === "RESULT" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className={`${isEmbedded ? "mb-4 h-12 w-12" : "mb-6 h-16 w-16"} mx-auto flex items-center justify-center rounded-2xl bg-[#007aff] text-white shadow-[0_18px_45px_rgba(0,122,255,0.22)]`}>
                <Send size={isEmbedded ? 22 : 28} strokeWidth={2.4} />
              </div>
              <h2 className={`${isEmbedded ? "text-[1.4rem]" : "text-[1.9rem] md:text-[2.35rem]"} font-bold tracking-tight text-[#0e0e10]`}>
                {t("quote.result.receivedTitle", lang)}
              </h2>
              <p className={`${isEmbedded ? "mt-2 text-[0.92rem]" : "mt-3 text-[1rem] md:text-[1.08rem]"} mx-auto max-w-md font-medium leading-relaxed text-[#6e6e73]`}>
                {t("quote.result.receivedSub", lang)}
              </p>

              <div className={`${isEmbedded ? "mt-5 gap-2" : "mt-8 gap-3"} flex flex-col items-center`}>
                <p className={`${isEmbedded ? "text-[0.58rem]" : "text-[0.65rem] md:text-[0.7rem]"} font-bold uppercase tracking-[0.2em] text-[#86868b]`}>
                  {t("quote.result.orContact", lang)}
                </p>
                <div className={`${isEmbedded ? "gap-2 px-3" : "gap-2 px-4 md:gap-3"} grid w-full grid-cols-1 sm:grid-cols-2`}>
                  <a
                    href="https://wa.me/4915256569852"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
                        (window as any).gtag("event", "whatsapp_click", { event_category: "post_form_contact" });
                      }
                    }}
                    className={`${isEmbedded ? "py-3" : "py-3.5"} flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-[0.75rem] font-bold text-white transition-all hover:translate-y-[-2px] hover:shadow-lg md:rounded-2xl md:text-[0.8125rem]`}
                  >
                    <img src={whatsappIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                    WhatsApp
                  </a>
                  <a href="mailto:info@nüll.com" className={`${isEmbedded ? "py-3" : "py-3.5"} flex items-center justify-center gap-2 rounded-xl bg-[#f5f5f7] px-4 text-[0.75rem] font-bold text-[#0e0e10] transition-all hover:translate-y-[-2px] md:rounded-2xl md:text-[0.8125rem]`}>
                    <img src={gmailIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                    Gmail
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step !== "RESULT" && (
        <div className={`sticky bottom-0 z-10 flex items-center justify-between border-t border-black/5 ${isEmbedded ? "bg-[#fbfbfd] p-5 md:px-6" : "safe-area-bottom bg-white p-3 md:p-8"}`}>
          <button onClick={handleBack} disabled={step === "OBJECTIVE"} className="rounded-full px-4 py-2.5 text-[0.875rem] font-bold text-[#86868b] transition-all hover:text-[#0e0e10] disabled:opacity-0 md:px-6 md:py-3 md:text-[0.9375rem]">
            {t("onboarding.common.back", lang)}
          </button>
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-[0.875rem] font-bold text-white transition-all hover:bg-[#2c2c2e] active:scale-[0.98] disabled:opacity-30 md:px-8 md:py-3 md:text-[0.9375rem]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t("contact.sending", lang)}
              </>
            ) : step === "IDENTITY" ? (
              <>
                {t("contact.send", lang)}
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                {t("onboarding.common.next", lang)}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="px-10 pb-6 text-center">
          <p className="text-sm font-bold text-red-500">{error}</p>
        </div>
      )}
    </motion.div>
  );

  if (isEmbedded) {
    return panel;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000000] flex items-end justify-center overflow-y-auto md:items-center md:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-md" />
          {panel}
        </div>
      )}
    </AnimatePresence>
  );
}

export default LeadCapture;
