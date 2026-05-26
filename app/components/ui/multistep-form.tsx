"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  Loader2,
  MapPin,
  Megaphone,
  Monitor,
  Search,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const steps = [
  { id: "services", title: "Leistungen" },
  { id: "source", title: "Quelle" },
  { id: "website", title: "Website" },
  { id: "contact", title: "Kontakt" },
] as const;

const sourceOptions = [
  "Google Search",
  "Instagram",
  "LinkedIn",
  "Referenz",
  "Other",
] as const;

const serviceOptions = [
  {
    id: "professional-website",
    label: "Neue professionelle Website",
    icon: Monitor,
    color: "text-[#007aff]",
  },
  {
    id: "seo",
    label: "Google Sichtbarkeit (SEO)",
    icon: Search,
    color: "text-[#34c759]",
  },
  {
    id: "geo",
    label: "KI-Suche Sichtbarkeit (GEO)",
    icon: Sparkles,
    color: "text-[#007aff]",
  },
  {
    id: "google-ads",
    label: "Google Ads Kampagnen-Management",
    icon: Megaphone,
    color: "text-[#ff9500]",
  },
  {
    id: "lead-system",
    label: "Digitales Lead-System",
    icon: Target,
    color: "text-[#af52de]",
  },
] as const;

export type MultistepFormData = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  city: string;
  foundFrom: string;
  foundFromOther: string;
  services: string[];
  websiteUrl: string;
  biggestChallenge: string;
};

type MultistepFormProps = {
  className?: string;
  onSubmit?: (data: MultistepFormData) => Promise<void> | void;
  showIntro?: boolean;
};

const emptyFormData: MultistepFormData = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  city: "",
  foundFrom: "",
  foundFromOther: "",
  services: [],
  websiteUrl: "",
  biggestChallenge: "",
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stepVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32 } },
  exit: { opacity: 0, x: -28, transition: { duration: 0.2 } },
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());

const isValidPhone = (phone: string) => {
  const trimmedPhone = phone.trim();
  const digitCount = trimmedPhone.replace(/\D/g, "").length;

  return digitCount >= 7 && /^[+()\d\s.-]+$/.test(trimmedPhone);
};

export default function MultistepForm({
  className,
  onSubmit,
  showIntro = true,
}: MultistepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const isEmbedded = !showIntro;

  const selectedServiceLabels = useMemo(
    () =>
      serviceOptions
        .filter((service) => formData.services.includes(service.id))
        .map((service) => service.label),
    [formData.services],
  );
  const emailError =
    formData.email.trim() && !isValidEmail(formData.email)
      ? "Bitte geben Sie eine gültige E-Mail-Adresse ein."
      : "";
  const phoneError =
    formData.phone.trim() && !isValidPhone(formData.phone)
      ? "Bitte geben Sie eine gültige Telefonnummer ein."
      : "";

  useEffect(() => {
    if (!showIntro) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, showIntro]);

  const updateFormData = <Key extends keyof MultistepFormData>(
    field: Key,
    value: MultistepFormData[Key],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((current) => {
      const services = current.services.includes(serviceId)
        ? current.services.filter((id) => id !== serviceId)
        : [...current.services, serviceId];

      return { ...current, services };
    });
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.services.length > 0;
    }

    if (currentStep === 1) {
      return (
        formData.foundFrom &&
        (formData.foundFrom !== "Other" || formData.foundFromOther.trim())
      );
    }

    if (currentStep === 2) {
      return true;
    }

    return Boolean(
      formData.name.trim() &&
      formData.businessName.trim() &&
      formData.phone.trim() &&
      !phoneError &&
      formData.email.trim() &&
      !emailError &&
      formData.city.trim()
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !isStepValid()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit?.(formData);
      setIsComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Senden fehlgeschlagen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "mx-auto flex min-h-[420px] w-full max-w-xl flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]",
          className,
        )}
      >
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#007aff]/10 text-[#007aff]">
          <BadgeCheck className="h-10 w-10" />
        </div>
        <h1 className="mb-4 text-[2.25rem] font-black tracking-[-0.04em] text-[#0e0e10] md:text-[3.25rem]">
          Anfrage erhalten.
        </h1>
        <p className="max-w-md text-[1.05rem] font-medium leading-relaxed text-[#6e6e73]">
          Danke. Wir prüfen Ihre Angaben und melden uns mit den nächsten Schritten.
          Unser Team ruft Sie innerhalb von 24 Stunden an.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-4xl", isEmbedded ? "pb-0" : "pb-16", className)}>
      {showIntro && (
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-4 text-[0.75rem] font-black uppercase tracking-[0.18em] text-[#007aff]">
            Projektanfrage
          </p>
          <h1 className="mx-auto max-w-3xl text-[2.35rem] font-black leading-[1.04] tracking-[-0.045em] text-[#0e0e10] md:text-[4rem]">
            Erzählen Sie uns, was wachsen soll.
          </h1>
        </div>
      )}

      <div className={cn(isEmbedded ? "mb-5 sm:mb-6" : "mb-7")}>
        <div className="mb-3 flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isDone = index < currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => index <= currentStep && setCurrentStep(index)}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
                disabled={index > currentStep}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-[0.68rem] font-black transition-all sm:h-8 sm:w-8 sm:text-xs",
                    isEmbedded
                      ? [
                          isDone && "border-white bg-white text-[#007aff]",
                          isActive && "border-white bg-white text-[#007aff] ring-4 ring-white/25",
                          !isDone && !isActive && "border-white/80 bg-white/90 text-[#007aff]/65",
                        ]
                      : [
                          isDone && "border-[#007aff] bg-[#007aff] text-white",
                          isActive && "border-[#007aff] bg-white text-[#007aff] ring-4 ring-[#007aff]/10",
                          !isDone && !isActive && "border-[#e5e5ea] bg-[#f5f5f7] text-[#86868b]",
                        ],
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[0.72rem] font-bold text-[#86868b] sm:block",
                    isEmbedded && "text-white/70",
                    isActive && (isEmbedded ? "text-white" : "text-[#007aff]"),
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
        <div className={cn("h-1.5 overflow-hidden rounded-full sm:h-2", isEmbedded ? "bg-white/25" : "bg-[#f5f5f7]")}>
          <motion.div
            className={cn("h-full rounded-full", isEmbedded ? "bg-white" : "bg-[#007aff]")}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <Card className="overflow-hidden rounded-[1.35rem] border-[#eeeeef] bg-white text-[#0e0e10] shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:rounded-[1.65rem] md:rounded-[2rem] [&_input]:text-[#0e0e10] [&_input]:caret-[#007aff] [&_input::placeholder]:text-[#8e8e93] [&_textarea]:text-[#0e0e10] [&_textarea]:caret-[#007aff] [&_textarea::placeholder]:text-[#8e8e93]">
        <AnimatePresence mode="wait">
          <motion.div
            key={steps[currentStep].id}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentStep === 3 && (
              <>
                <CardHeader className="p-6 pb-4 md:p-8 md:pb-5">
                  <CardTitle className="flex items-center gap-3 text-[1.5rem] leading-tight tracking-[-0.035em] text-[#0e0e10] sm:text-[1.75rem]">
                    <UserRound className="h-5 w-5 text-[#007aff] sm:h-6 sm:w-6" />
                    Ihre Kontaktdaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2 md:p-8 md:pt-0">
                  <FormField label="Ihr Name" id="name">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(event) => updateFormData("name", event.target.value)}
                      placeholder="Max Mustermann"
                      className="h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd]"
                    />
                  </FormField>
                  <FormField label="Unternehmensname" id="businessName">
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(event) => updateFormData("businessName", event.target.value)}
                      placeholder="Muster GmbH"
                      className="h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd]"
                    />
                  </FormField>
                  <FormField label="Telefonnummer" id="phone" error={phoneError}>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(event) => updateFormData("phone", event.target.value)}
                      placeholder="+49 ..."
                      className={cn(
                        "h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd]",
                        phoneError && "border-red-300 focus-visible:ring-red-500/30",
                      )}
                    />
                  </FormField>
                  <FormField label="E-Mail" id="email" error={emailError}>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(event) => updateFormData("email", event.target.value)}
                      placeholder="name@firma.de"
                      className={cn(
                        "h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd]",
                        emailError && "border-red-300 focus-visible:ring-red-500/30",
                      )}
                    />
                  </FormField>
                  <FormField label="Stadt" id="city" className="md:col-span-2">
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868b]" />
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(event) => updateFormData("city", event.target.value)}
                        placeholder="Mannheim"
                        className="h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd] pl-11"
                      />
                    </div>
                  </FormField>
                </CardContent>
              </>
            )}

            {currentStep === 1 && (
              <>
                <CardHeader className="p-6 pb-4 md:p-8 md:pb-5">
                  <CardTitle className="text-[1.5rem] leading-tight tracking-[-0.035em] text-[#0e0e10] sm:text-[1.75rem]">
                    Wo haben Sie uns gefunden?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6 pt-0 md:p-8 md:pt-0">
                  <RadioGroup
                    value={formData.foundFrom}
                    onValueChange={(value) => updateFormData("foundFrom", value)}
                    className="grid gap-3"
                  >
                    {sourceOptions.map((option, index) => (
                      <motion.label
                        key={option}
                        variants={fieldVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.04 }}
                        htmlFor={`source-${option}`}
                        className={cn(
                          "grid min-h-[3.7rem] cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[1.15rem] border p-4 transition-all hover:bg-[#fbfbfd] sm:rounded-[1.25rem]",
                          formData.foundFrom === option
                            ? "border-[#007aff] bg-[#f5faff] ring-4 ring-[#007aff]/10"
                            : "border-[#eeeeef] bg-white",
                        )}
                      >
                        <span className="min-w-0 font-bold leading-tight text-[#1d1d1f] [overflow-wrap:anywhere]">{option}</span>
                        <RadioGroupItem id={`source-${option}`} value={option} />
                      </motion.label>
                    ))}
                  </RadioGroup>

                  {formData.foundFrom === "Other" && (
                    <FormField label="Bitte kurz spezifizieren" id="foundFromOther">
                      <Input
                        id="foundFromOther"
                        value={formData.foundFromOther}
                        onChange={(event) => updateFormData("foundFromOther", event.target.value)}
                        placeholder="z. B. Event, Podcast, Empfehlung ..."
                        className="h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd]"
                      />
                    </FormField>
                  )}
                </CardContent>
              </>
            )}

            {currentStep === 0 && (
              <>
                <CardHeader className="p-6 pb-4 md:p-8 md:pb-5">
                  <CardTitle className="text-[1.5rem] leading-tight tracking-[-0.035em] text-[#0e0e10] sm:text-[1.75rem]">
                    Welche Ziele verfolgen wir?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 p-6 pt-0 md:p-8 md:pt-0">
                  {serviceOptions.map((service, index) => {
                    const isSelected = formData.services.includes(service.id);
                    const Icon = service.icon;

                    return (
                      <motion.button
                        key={service.id}
                        type="button"
                        variants={fieldVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.04 }}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "grid min-h-[4.25rem] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 rounded-[1.15rem] border bg-white p-4 text-left transition-all sm:rounded-[1.25rem]",
                          isSelected
                            ? "border-[#007aff] ring-4 ring-[#007aff]/10"
                            : "border-[#eeeeef] hover:border-[#d2d2d7] hover:bg-[#fbfbfd]",
                        )}
                      >
                        <Icon className={cn("h-5 w-5 shrink-0 sm:h-6 sm:w-6", service.color)} />
                        <span className="min-w-0 text-[0.96rem] font-black leading-tight text-[#1d1d1f] [overflow-wrap:anywhere] sm:text-[1rem]">
                          {service.label}
                        </span>
                        <Checkbox
                          checked={isSelected}
                          onClick={(event) => event.stopPropagation()}
                          onCheckedChange={() => toggleService(service.id)}
                          className={cn(
                            "h-5 w-5 rounded-full border-[#d2d2d7] sm:h-6 sm:w-6",
                            isSelected && "border-[#007aff] bg-[#007aff] text-white",
                          )}
                        />
                      </motion.button>
                    );
                  })}
                </CardContent>
              </>
            )}

            {currentStep === 2 && (
              <>
                <CardHeader className="p-6 pb-4 md:p-8 md:pb-5">
                  <CardTitle className="text-[1.5rem] leading-tight tracking-[-0.035em] text-[#0e0e10] sm:text-[1.75rem]">
                    Der wichtigste Kontext
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6 pt-0 md:p-8 md:pt-0">
                  <FormField label="Aktuelle Website-URL (falls vorhanden)" id="websiteUrl">
                    <Input
                      id="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={(event) => updateFormData("websiteUrl", event.target.value)}
                      placeholder="https://..."
                      className="h-12 rounded-2xl border-[#e5e5ea] bg-[#fbfbfd]"
                    />
                  </FormField>
                  <FormField label="Was ist Ihre größte Herausforderung?" id="biggestChallenge">
                    <Textarea
                      id="biggestChallenge"
                      value={formData.biggestChallenge}
                      onChange={(event) => updateFormData("biggestChallenge", event.target.value)}
                      placeholder="Beschreiben Sie kurz, was aktuell bremst oder gelöst werden soll."
                      className="min-h-[110px] rounded-2xl border-[#e5e5ea] bg-[#fbfbfd] sm:min-h-[140px]"
                    />
                  </FormField>

                  {selectedServiceLabels.length > 0 && (
                    <div className="rounded-[1.25rem] bg-[#f5f5f7] p-4">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#86868b]">
                        Ausgewählte Ziele
                      </p>
                      <p className="text-sm font-bold leading-relaxed text-[#1d1d1f]">
                        {selectedServiceLabels.join(", ")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <CardFooter className="flex flex-col gap-4 border-t border-[#f5f5f7] p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="h-12 w-full rounded-full border-[#d2d2d7] bg-white font-bold md:w-auto"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>

          <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:items-end">
            {submitError && (
              <p className="max-w-sm text-sm font-semibold text-red-600">{submitError}</p>
            )}
            <Button
              type="button"
              onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="h-12 w-full rounded-full bg-[#0e0e10] px-8 font-bold text-white hover:bg-black md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Absenden
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <p className={cn("mt-4 text-center text-xs font-semibold sm:mt-5 sm:text-sm", isEmbedded ? "text-white/75" : "text-[#86868b]")}>
        Schritt {currentStep + 1} von {steps.length}: {steps[currentStep].title}
      </p>
    </div>
  );
}

function FormField({
  children,
  className,
  error,
  id,
  label,
}: {
  children: ReactNode;
  className?: string;
  error?: string;
  id: string;
  label: string;
}) {
  return (
    <motion.div
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-2", className)}
    >
      <Label htmlFor={id} className="text-[0.9rem] font-black text-[#1d1d1f]">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[0.78rem] font-bold leading-snug text-red-600">
          {error}
        </p>
      )}
    </motion.div>
  );
}
