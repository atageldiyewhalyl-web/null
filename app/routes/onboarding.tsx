import { useState, useEffect } from "react";
import { useLanguage, t } from "../components/LanguageContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { OnboardingIntro } from "../components/OnboardingIntro";
import { OnboardingBasicInfo } from "../components/OnboardingBasicInfo";
import { OnboardingServiceSelection } from "../components/OnboardingServiceSelection";
import { OnboardingLawAreas } from "../components/OnboardingLawAreas";
import { OnboardingWebsiteType } from "../components/OnboardingWebsiteType";
import { OnboardingWebsiteArch } from "../components/OnboardingWebsiteArch";
import { OnboardingWebsiteExtras } from "../components/OnboardingWebsiteExtras";
import { OnboardingWebsiteExisting } from "../components/OnboardingWebsiteExisting";
import { OnboardingSeoDetails } from "../components/OnboardingSeoDetails";
import { OnboardingTargetAudience } from "../components/OnboardingTargetAudience";
import { OnboardingDesignPreferences } from "../components/OnboardingDesignPreferences";
import { OnboardingLogistics } from "../components/OnboardingLogistics";
import { generateOnboardingPdf, stripBase64 } from "../utils/onboarding-pdf-generator";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, Heart, Sparkles, Download } from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Nüll. | Client Onboarding" },
    { name: "description", content: "Exclusive project kick-off for Nüll. clients." },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

type OnboardingStep = 
  | "INTRO" 
  | "BASIC_INFO" 
  | "SERVICE_SELECTION" 
  | "LAW_AREAS" 
  | "WEBSITE_TYPE"
  | "WEBSITE_ARCH"
  | "WEBSITE_EXTRAS"
  | "WEBSITE_EXISTING"
  | "SEO_DETAILS"
  | "TARGET_AUDIENCE"
  | "DESIGN_PREFERENCES"
  | "FINAL_DETAILS"
  | "SUCCESS";

export default function OnboardingPage() {
  const { lang } = useLanguage();
  const [step, setStep] = useState<OnboardingStep>("INTRO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const [formData, setFormData] = useState({
    // Step 1: Identity
    name: "",
    firm: "",
    email: "",
    phone: "",
    city: "",
    // Step 2: Service
    selectedServices: [] as string[], // website, seo, ads, both
    // Step 3: Law Areas
    selectedAreas: [] as string[],
    customAreas: [] as string[],
    topServices: [] as string[],
    // Step 4: Website Details (RESTRUCTURED)
    websiteDetails: {
      siteType: "" as "onepage" | "multipage" | "",
      architecture: [] as string[],
      extras: [] as string[],
      hasExistingSite: null as boolean | null,
      existingSiteUrl: "",
      dislikes: "",
    },
    // Step 5: SEO Details
    seoDetails: {
      isMapVisible: null as boolean | null,
      hadSeoBefore: null as boolean | null,
      targetCities: [] as string[],
    },
    // Step 6: Audience
    audienceData: {
      audience: [] as string[],
      trustFactors: "",
      targetLanguages: [] as string[],
    },
    // Step 7: Design
    designData: {
      style: "",
      tone: 50,
      colors: "",
      references: "",
    },
    // Step 8: Logistics
    logisticsData: {
      deadline: "",
      domainStatus: "" as "" | "yes" | "no" | "help",
      domainName: "",
      contentReady: [] as string[],
      extraNotes: "",
    }
  });

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const updateWebsiteDetails = (fields: Partial<typeof formData["websiteDetails"]>) => {
    setFormData((prev) => ({
      ...prev,
      websiteDetails: { ...prev.websiteDetails, ...fields },
    }));
  };

  const updateSeoDetails = (fields: Partial<typeof formData["seoDetails"]>) => {
    setFormData((prev) => ({
      ...prev,
      seoDetails: { ...prev.seoDetails, ...fields },
    }));
  };

  const updateAudienceData = (fields: Partial<typeof formData["audienceData"]>) => {
    setFormData((prev) => ({
      ...prev,
      audienceData: { ...prev.audienceData, ...fields },
    }));
  };

  const updateDesignData = (fields: Partial<typeof formData["designData"]>) => {
    setFormData((prev) => ({
      ...prev,
      designData: { ...prev.designData, ...fields },
    }));
  };

  const updateLogisticsData = (fields: Partial<typeof formData["logisticsData"]>) => {
    setFormData((prev) => ({
      ...prev,
      logisticsData: { ...prev.logisticsData, ...fields },
    }));
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Debug check: ensures credentials exist
    if (!projectId || !publicAnonKey) {
      const msg = "Supabase configuration missing (projectId/publicAnonKey)";
      console.error(msg);
      setSubmitError(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/onboarding`;
      console.log("Submitting to:", endpoint);

      const pdfDataUri = await generateOnboardingPdf(formData, lang);
      const pdfBase64 = stripBase64(pdfDataUri);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...formData,
          pdfBase64,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        setStep("SUCCESS");
      } else {
        const errorMsg = data.error 
          ? (typeof data.error === 'object' ? JSON.stringify(data.error) : data.error)
          : `HTTP ${res.status}: Unknown Error`;
        const statusMsg = `Submission failed: ${errorMsg}`;
        console.error(statusMsg);
        setSubmitError(statusMsg);
        // We still proceed to SUCCESS after a delay to not break UX for most users, 
        // but keep the error visible so they can report it if they see it.
        setTimeout(() => setStep("SUCCESS"), 8000);
      }
    } catch (err) {
      const excMsg = `Network/CORS Error: ${err instanceof Error ? err.message : String(err)}`;
      console.error(excMsg);
      setSubmitError(excMsg);
      setTimeout(() => setStep("SUCCESS"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLongStep = [
    "WEBSITE_ARCH", 
    "WEBSITE_EXTRAS", 
    "SEO_DETAILS", 
    "TARGET_AUDIENCE", 
    "DESIGN_PREFERENCES", 
    "FINAL_DETAILS"
  ].includes(step);

  return (
    <OnboardingLayout 
      isLong={isLongStep} 
      isCentered={step === "INTRO"} 
      showSecureMessage={step === "INTRO"}
    >
      {submitError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
            <div className="flex-1 font-medium text-sm">
              <strong>Submission Issue:</strong> {submitError}
            </div>
            <button 
              onClick={() => setSubmitError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {step === "INTRO" && (
          <OnboardingIntro 
            key="intro" 
            onNext={() => setStep("BASIC_INFO")} 
          />
        )}

        {step === "BASIC_INFO" && (
          <OnboardingBasicInfo
            key="basic-info"
            data={formData}
            updateData={updateFormData}
            onNext={() => setStep("SERVICE_SELECTION")}
            onBack={() => setStep("INTRO")}
          />
        )}

        {step === "SERVICE_SELECTION" && (
          <OnboardingServiceSelection
            key="service-selection"
            selectedServices={formData.selectedServices}
            onSelect={(services) => updateFormData({ selectedServices: services })}
            onNext={() => setStep("LAW_AREAS")}
            onBack={() => setStep("BASIC_INFO")}
          />
        )}

        {step === "LAW_AREAS" && (
          <OnboardingLawAreas
            key="law-areas"
            selectedAreas={formData.selectedAreas}
            customAreas={formData.customAreas}
            topServices={formData.topServices}
            updateData={(fields) => updateFormData(fields)}
            onNext={() => {
              if (formData.selectedServices.includes("website") || formData.selectedServices.includes("both")) {
                setStep("WEBSITE_TYPE");
              } else if (formData.selectedServices.includes("seo")) {
                setStep("SEO_DETAILS");
              } else {
                setStep("TARGET_AUDIENCE"); // Fallback if ads only
              }
            }}
            onBack={() => setStep("SERVICE_SELECTION")}
          />
        )}

        {step === "WEBSITE_TYPE" && (
          <OnboardingWebsiteType
            key="website-type"
            siteType={formData.websiteDetails.siteType}
            onSelect={(type) => updateWebsiteDetails({ siteType: type })}
            onNext={() => setStep("WEBSITE_ARCH")}
            onBack={() => setStep("LAW_AREAS")}
          />
        )}

        {step === "WEBSITE_ARCH" && (
          <OnboardingWebsiteArch
            key="website-arch"
            siteType={formData.websiteDetails.siteType as "onepage" | "multipage"}
            selectedItems={formData.websiteDetails.architecture}
            onToggle={(items) => updateWebsiteDetails({ architecture: items })}
            onNext={() => setStep("WEBSITE_EXTRAS")}
            onBack={() => setStep("WEBSITE_TYPE")}
          />
        )}

        {step === "WEBSITE_EXTRAS" && (
          <OnboardingWebsiteExtras
            key="website-extras"
            selectedExtras={formData.websiteDetails.extras}
            onToggle={(items) => updateWebsiteDetails({ extras: items })}
            onNext={() => setStep("WEBSITE_EXISTING")}
            onBack={() => setStep("WEBSITE_ARCH")}
          />
        )}

        {step === "WEBSITE_EXISTING" && (
          <OnboardingWebsiteExisting
            key="website-existing"
            hasSite={formData.websiteDetails.hasExistingSite}
            siteUrl={formData.websiteDetails.existingSiteUrl}
            dislikes={formData.websiteDetails.dislikes}
            updateData={(fields) => updateWebsiteDetails(fields)}
            onNext={() => {
              if (formData.selectedServices.includes("seo") || formData.selectedServices.includes("both")) {
                setStep("SEO_DETAILS");
              } else {
                setStep("TARGET_AUDIENCE");
              }
            }}
            onBack={() => setStep("WEBSITE_EXTRAS")}
          />
        )}

        {step === "SEO_DETAILS" && (
          <OnboardingSeoDetails
            key="seo-details"
            data={formData.seoDetails}
            updateData={updateSeoDetails}
            onNext={() => setStep("TARGET_AUDIENCE")}
            onBack={() => {
              if (formData.selectedServices.includes("website") || formData.selectedServices.includes("both")) {
                setStep("WEBSITE_EXISTING");
              } else {
                setStep("LAW_AREAS");
              }
            }}
          />
        )}

        {step === "TARGET_AUDIENCE" && (
          <OnboardingTargetAudience
            key="target-audience"
            data={formData.audienceData}
            updateData={updateAudienceData}
            onNext={() => {
              if (formData.selectedServices.includes("website") || formData.selectedServices.includes("both")) {
                setStep("DESIGN_PREFERENCES");
              } else {
                setStep("FINAL_DETAILS");
              }
            }}
            onBack={() => {
              if (formData.selectedServices.includes("seo") || formData.selectedServices.includes("both")) {
                setStep("SEO_DETAILS");
              } else if (formData.selectedServices.includes("website")) {
                setStep("WEBSITE_EXISTING");
              } else {
                setStep("LAW_AREAS");
              }
            }}
          />
        )}

        {step === "DESIGN_PREFERENCES" && (
          <OnboardingDesignPreferences
            key="design-preferences"
            data={formData.designData}
            updateData={updateDesignData}
            onNext={() => setStep("FINAL_DETAILS")}
            onBack={() => setStep("TARGET_AUDIENCE")}
          />
        )}

        {step === "FINAL_DETAILS" && (
          <OnboardingLogistics
            key="logistics"
            data={formData.logisticsData}
            updateData={updateLogisticsData}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
            onBack={() => {
              if (formData.selectedServices.includes("website") || formData.selectedServices.includes("both")) {
                setStep("DESIGN_PREFERENCES");
              } else {
                setStep("TARGET_AUDIENCE");
              }
            }}
          />
        )}

        {step === "SUCCESS" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-[#007aff]/10 text-[#007aff] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle size={48} />
            </motion.div>
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight text-[#0e0e10] mb-4">
              {t("onboarding.success.title", lang)}
            </h2>
            <p className="text-[1.25rem] text-[#86868b] font-medium max-w-xl mx-auto mb-12">
              {t("onboarding.success.sub", lang)}
            </p>
             <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-[#0e0e10] font-bold">
                  <Sparkles size={18} className="text-[#007aff]" />
                  {t("onboarding.success.roadmap", lang)}
                </div>
                <div className="flex items-center gap-2 text-[#0e0e10] font-bold">
                  <Heart size={18} className="text-[#ff2d55]" />
                  {t("onboarding.success.thanks", lang)}
                </div>
             </div>

          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingLayout>
  );
}
