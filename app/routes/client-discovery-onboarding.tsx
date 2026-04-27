import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import type { MetaFunction } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { OnboardingIntro } from "../components/OnboardingIntro";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { useLanguage, type Language } from "../components/LanguageContext";

export const meta: MetaFunction = () => {
  return [
    { title: "Nüll. | Client Discovery Onboarding" },
    { name: "description", content: "High-impact client discovery onboarding form." },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

type DiscoveryStep = "INTRO" | "FORM" | "SUCCESS";

const discoveryLanguages: Language[] = ["en", "de"];

type DiscoveryQuestion = {
  id: string;
  en: string;
  de: string;
  placeholder: {
    en: string;
    de: string;
  };
};

type DiscoverySection = {
  id: string;
  enTitle: string;
  deTitle: string;
  questions: DiscoveryQuestion[];
};

const discoveryUiText = {
  eyebrow: {
    en: "High-Impact Client Discovery",
    de: "Kompakte Kundenanalyse",
  },
  title: {
    en: "Tell us what the website needs to achieve.",
    de: "Sagen Sie uns, was die Website erreichen soll.",
  },
  sectionProgress: {
    en: "Section",
    de: "Abschnitt",
  },
  back: {
    en: "Back",
    de: "Zurück",
  },
  continue: {
    en: "Continue",
    de: "Weiter",
  },
  sending: {
    en: "Sending",
    de: "Wird gesendet",
  },
  submit: {
    en: "Submit Discovery",
    de: "Analyse absenden",
  },
  successTitle: {
    en: "Discovery received.",
    de: "Analyse erhalten.",
  },
  successBody: {
    en: "We have everything needed to turn the answers into a focused website direction.",
    de: "Wir haben alles, um aus Ihren Antworten eine klare Website-Richtung zu entwickeln.",
  },
};

const localizedText = (value: { en: string; de: string }, lang: string) => {
  if (lang === "de") return value.de;
  return value.en;
};

const discoverySections: DiscoverySection[] = [
  {
    id: "coreBusiness",
    enTitle: "Core Business",
    deTitle: "Kerngeschäft",
    questions: [
      {
        id: "whatDoYouDo",
        en: "What exactly do you do? (1-2 sentences)",
        de: "Was genau machen Sie? (1-2 Sätze)",
        placeholder: {
          en: "Describe the business in plain language.",
          de: "Beschreiben Sie das Geschäft in einfachen Worten.",
        },
      },
      {
        id: "problemSolved",
        en: "What problem do you solve?",
        de: "Welches Problem lösen Sie?",
        placeholder: {
          en: "The main pain or bottleneck your offer removes.",
          de: "Das wichtigste Problem, das Ihr Angebot löst.",
        },
      },
      {
        id: "whoYouHelp",
        en: "Who do you help?",
        de: "Wem helfen Sie?",
        placeholder: {
          en: "Industries, roles, company sizes, or client types.",
          de: "Branchen, Rollen, Unternehmensgrößen oder Kundentypen.",
        },
      },
    ],
  },
  {
    id: "offerResults",
    enTitle: "Offer & Results",
    deTitle: "Angebot & Ergebnisse",
    questions: [
      {
        id: "servicesToPromote",
        en: "What services do you want to promote?",
        de: "Welche Leistungen möchten Sie hervorheben?",
        placeholder: {
          en: "List the main services that should sell through the website.",
          de: "Listen Sie die wichtigsten Leistungen auf, die die Website verkaufen soll.",
        },
      },
      {
        id: "clientResults",
        en: "What results do clients get from working with you?",
        de: "Welche Ergebnisse erzielen Ihre Kunden durch die Zusammenarbeit mit Ihnen?",
        placeholder: {
          en: "Concrete outcomes, improvements, time saved, money made, risk reduced.",
          de: "Konkrete Ergebnisse, Verbesserungen, Zeitersparnis, Umsatz, Risikoreduktion.",
        },
      },
      {
        id: "proof",
        en: "Do you have any proof? (results, testimonials, numbers)",
        de: "Haben Sie Nachweise? (Ergebnisse, Referenzen, Zahlen)",
        placeholder: {
          en: "Testimonials, before/after results, numbers, client wins.",
          de: "Referenzen, Vorher/Nachher-Ergebnisse, Zahlen, Kundenerfolge.",
        },
      },
    ],
  },
  {
    id: "websiteGoal",
    enTitle: "Goal of the Website",
    deTitle: "Ziel der Website",
    questions: [
      {
        id: "mainGoal",
        en: "What is the main goal? (book calls, leads, etc.)",
        de: "Was ist das Hauptziel der Website? (z. B. Termine buchen, Leads generieren)",
        placeholder: {
          en: "For example: booked strategy calls, qualified leads, direct purchases.",
          de: "Zum Beispiel: Strategiegespräche, qualifizierte Leads, direkte Käufe.",
        },
      },
      {
        id: "visitorAction",
        en: "What action should visitors take?",
        de: "Welche Handlung sollen Besucher ausführen?",
        placeholder: {
          en: "The primary call to action.",
          de: "Der wichtigste Call-to-Action.",
        },
      },
    ],
  },
  {
    id: "targetAudience",
    enTitle: "Target Audience",
    deTitle: "Zielgruppe",
    questions: [
      {
        id: "idealClient",
        en: "Who is your ideal client?",
        de: "Wer ist Ihr idealer Kunde?",
        placeholder: {
          en: "Describe the best-fit client, not everyone you could serve.",
          de: "Beschreiben Sie den ideal passenden Kunden, nicht jeden möglichen Kunden.",
        },
      },
      {
        id: "biggestPain",
        en: "What is their biggest pain/problem?",
        de: "Was ist das größte Problem dieser Zielgruppe?",
        placeholder: {
          en: "What keeps them stuck, frustrated, or searching for help?",
          de: "Was hält sie zurück oder bringt sie dazu, Hilfe zu suchen?",
        },
      },
    ],
  },
  {
    id: "messaging",
    enTitle: "Messaging",
    deTitle: "Messaging",
    questions: [
      {
        id: "whyChooseYou",
        en: "Why should someone choose you over others?",
        de: "Warum sollten Kunden sich für Sie entscheiden und nicht für andere?",
        placeholder: {
          en: "Positioning, specialization, method, experience, personality, guarantee.",
          de: "Positionierung, Spezialisierung, Methode, Erfahrung, Persönlichkeit, Garantie.",
        },
      },
      {
        id: "websiteFeel",
        en: "How should the website feel? (premium, simple, aggressive, etc.)",
        de: "Wie soll die Website wirken? (z. B. hochwertig, modern, aggressiv, minimalistisch)",
        placeholder: {
          en: "Describe the feeling and tone visitors should experience.",
          de: "Beschreiben Sie Wirkung, Gefühl und Tonalität der Website.",
        },
      },
    ],
  },
  {
    id: "structure",
    enTitle: "Structure",
    deTitle: "Struktur",
    questions: [
      {
        id: "pagesWanted",
        en: "What pages do you want? (Home, Services, About, Contact, etc.)",
        de: "Welche Seiten benötigen Sie? (Startseite, Leistungen, Über uns, Kontakt etc.)",
        placeholder: {
          en: "List known pages or sections.",
          de: "Listen Sie gewünschte Seiten oder Bereiche auf.",
        },
      },
      {
        id: "separateServicePages",
        en: "Do you want separate pages for each service?",
        de: "Möchten Sie für jede Leistung eine eigene Seite?",
        placeholder: {
          en: "Yes/no, and which services deserve their own page.",
          de: "Ja/nein, und welche Leistungen eine eigene Seite benötigen.",
        },
      },
    ],
  },
  {
    id: "seoBasics",
    enTitle: "SEO Basics",
    deTitle: "SEO Grundlagen",
    questions: [
      {
        id: "keywords",
        en: "What keywords do you want to rank for?",
        de: "Für welche Keywords möchten Sie gefunden werden?",
        placeholder: {
          en: "Services, problems, industry terms, or search phrases.",
          de: "Leistungen, Probleme, Branchenbegriffe oder Suchanfragen.",
        },
      },
      {
        id: "targetLocation",
        en: "What location are you targeting?",
        de: "Welche Region möchten Sie ansprechen?",
        placeholder: {
          en: "City, region, country, or international.",
          de: "Stadt, Region, Land oder international.",
        },
      },
    ],
  },
  {
    id: "contentAssets",
    enTitle: "Content & Assets",
    deTitle: "Inhalte & Materialien",
    questions: [
      {
        id: "photos",
        en: "Do you have photos?",
        de: "Haben Sie bereits Fotos?",
        placeholder: {
          en: "Team photos, office photos, product visuals, brand imagery.",
          de: "Teamfotos, Bürofotos, Produktbilder, Markenmaterial.",
        },
      },
      {
        id: "testimonials",
        en: "Do you have testimonials?",
        de: "Haben Sie Kundenbewertungen?",
        placeholder: {
          en: "Paste reviews or describe where they are stored.",
          de: "Fügen Sie Bewertungen ein oder beschreiben Sie, wo sie liegen.",
        },
      },
      {
        id: "caseStudies",
        en: "Do you have case studies?",
        de: "Haben Sie Fallstudien?",
        placeholder: {
          en: "Describe success stories we can turn into website content.",
          de: "Beschreiben Sie Erfolge, die wir als Website-Inhalt nutzen können.",
        },
      },
      {
        id: "createEverything",
        en: "Or should we create everything?",
        de: "Oder sollen wir die Inhalte für Sie erstellen?",
        placeholder: {
          en: "Tell us what needs to be created from scratch.",
          de: "Sagen Sie uns, was neu erstellt werden muss.",
        },
      },
    ],
  },
  {
    id: "features",
    enTitle: "Features",
    deTitle: "Funktionen",
    questions: [
      {
        id: "bookingSystem",
        en: "Do you need a booking system?",
        de: "Benötigen Sie ein Terminbuchungssystem?",
        placeholder: {
          en: "Calendly, calendar integration, paid booking, consultation request.",
          de: "Calendly, Kalenderintegration, bezahlte Buchung, Terminanfrage.",
        },
      },
      {
        id: "whatsapp",
        en: "Do you need WhatsApp?",
        de: "Benötigen Sie eine WhatsApp-Integration?",
        placeholder: {
          en: "If yes, add the number and preferred message.",
          de: "Falls ja: Nummer und gewünschte Nachricht ergänzen.",
        },
      },
      {
        id: "contactForms",
        en: "Do you need contact forms?",
        de: "Benötigen Sie Kontaktformulare?",
        placeholder: {
          en: "Simple contact, lead qualification, upload form, quote request.",
          de: "Einfacher Kontakt, Lead-Qualifizierung, Upload-Formular, Angebotsanfrage.",
        },
      },
    ],
  },
  {
    id: "style",
    enTitle: "Style",
    deTitle: "Design",
    questions: [
      {
        id: "likedWebsites",
        en: "Any websites you like?",
        de: "Gibt es Websites, die Ihnen gefallen?",
        placeholder: {
          en: "Paste links and explain what you like about them.",
          de: "Links einfügen und kurz erklären, was Ihnen daran gefällt.",
        },
      },
      {
        id: "brandingPreferences",
        en: "Any colors or branding preferences?",
        de: "Haben Sie bestimmte Farb- oder Designvorstellungen?",
        placeholder: {
          en: "Colors, fonts, logo status, visual references, things to avoid.",
          de: "Farben, Schriften, Logo-Status, Referenzen, Dinge, die vermieden werden sollen.",
        },
      },
    ],
  },
  {
    id: "final",
    enTitle: "Final",
    deTitle: "Abschluss",
    questions: [
      {
        id: "successfulWebsite",
        en: "What does a \"successful website\" mean to you?",
        de: "Wann ist die Website für Sie ein Erfolg?",
        placeholder: {
          en: "Define the outcome that would make this project a win.",
          de: "Definieren Sie, welches Ergebnis das Projekt erfolgreich macht.",
        },
      },
    ],
  },
];

const emptyAnswers = discoverySections.reduce<Record<string, string>>((acc, section) => {
  section.questions.forEach((question) => {
    acc[`${section.id}.${question.id}`] = "";
  });
  return acc;
}, {});

const buildDiscoverySummary = (answers: Record<string, string>) => {
  return discoverySections.map((section, index) => {
    const sectionTitle = `${index + 1}. ${section.enTitle} / ${section.deTitle}`;
    const questionLines = section.questions.map((question) => {
      const answer = answers[`${section.id}.${question.id}`]?.trim() || "No answer provided";
      return [
        question.en,
        question.de,
        answer,
      ].join("\n");
    });

    return [sectionTitle, ...questionLines].join("\n\n");
  }).join("\n\n---\n\n");
};

const buildLegacyOnboardingPayload = (lang: string, answers: Record<string, string>) => {
  return {
    name: "Client Discovery Submission",
    firm: "Client Discovery",
    email: "",
    phone: "",
    city: "",
    selectedServices: ["discovery"],
    selectedAreas: [],
    customAreas: [],
    topServices: [],
    websiteDetails: {
      siteType: "discovery",
      architecture: [],
      extras: [],
      hasExistingSite: null,
      existingSiteUrl: "",
      dislikes: "",
    },
    seoDetails: {
      isMapVisible: null,
      hadSeoBefore: null,
      targetCities: [],
    },
    audienceData: {
      audience: [],
      trustFactors: "",
      targetLanguages: [lang.toUpperCase()],
    },
    designData: {
      style: "",
      tone: 50,
      colors: "",
      references: "",
    },
    logisticsData: {
      deadline: "",
      domainStatus: "",
      domainName: "",
      contentReady: [],
      extraNotes: buildDiscoverySummary(answers),
    },
    discoveryAnswers: answers,
    discoverySections,
    discoveryLang: lang,
    onboardingType: "client-discovery",
  };
};

export default function ClientDiscoveryOnboardingPage() {
  const { lang } = useLanguage();
  const [step, setStep] = useState<DiscoveryStep>("INTRO");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const text = (value: { en: string; de: string }) => localizedText(value, lang);
  const currentSection = discoverySections[sectionIndex];
  const isLastSection = sectionIndex === discoverySections.length - 1;

  const updateAnswer = (key: string, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const goToSection = (nextIndex: number) => {
    setSectionIndex(Math.min(Math.max(nextIndex, 0), discoverySections.length - 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    if (!projectId || !publicAnonKey) {
      setSubmitError("Supabase configuration missing.");
      setIsSubmitting(false);
      return;
    }

    try {
      const baseEndpoint = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;
      const discoveryRes = await fetch(`${baseEndpoint}/onboarding-discovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          lang,
          answers,
          sections: discoverySections,
        }),
      });

      let res = discoveryRes;
      let data = await discoveryRes.json().catch(() => ({}));

      if (discoveryRes.status === 404) {
        res = await fetch(`${baseEndpoint}/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(buildLegacyOnboardingPayload(lang, answers)),
        });
        data = await res.json().catch(() => ({}));
      }

      if (res.ok && data.success !== false) {
        setStep("SUCCESS");
      } else {
        setSubmitError(data.error ? String(data.error) : `Submission failed with status ${res.status}`);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      isLong={step === "FORM"}
      isCentered={step === "INTRO" || step === "SUCCESS"}
      showSecureMessage={step === "INTRO"}
      languages={discoveryLanguages}
    >
      {submitError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl shadow-xl text-sm font-medium">
            {submitError}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "INTRO" && (
          <OnboardingIntro
            key="intro"
            onNext={() => {
              setSectionIndex(0);
              window.scrollTo(0, 0);
              setStep("FORM");
            }}
          />
        )}

        {step === "FORM" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl mx-auto pb-16"
          >
            <div className="mb-20 text-center">
              <p className="text-[0.75rem] font-black uppercase tracking-[0.18em] text-[#007aff] mb-4">
                {text(discoveryUiText.eyebrow)}
              </p>
              <h1 className="text-[2.5rem] md:text-[4rem] font-black tracking-[-0.04em] text-[#0e0e10] leading-[1.05] mb-6">
                {text(discoveryUiText.title)}
              </h1>
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex items-center justify-between text-[0.75rem] font-black uppercase tracking-[0.14em] text-[#86868b] mb-3">
                  <span>{text(discoveryUiText.sectionProgress)}</span>
                  <span>{sectionIndex + 1}/{discoverySections.length}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f5f5f7] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#007aff] rounded-full"
                    initial={false}
                    animate={{ width: `${((sectionIndex + 1) / discoverySections.length) * 100}%` }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.section
                key={currentSection.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-[#f5f5f7] pt-14"
              >
                <div className="grid gap-8 md:grid-cols-[260px_1fr]">
                    <div>
                      <p className="text-[0.75rem] font-black uppercase tracking-[0.18em] text-[#007aff] mb-4">
                        {String(sectionIndex + 1).padStart(2, "0")}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <h2 className="text-[1.5rem] md:text-[1.875rem] font-black tracking-[-0.03em] text-[#0e0e10]">
                          {lang === "de" ? currentSection.deTitle : currentSection.enTitle}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {currentSection.questions.map((question) => {
                        const key = `${currentSection.id}.${question.id}`;
                        return (
                          <div key={key} className="grid gap-4">
                            <label className="text-[1.125rem] font-bold leading-snug text-[#0e0e10]">
                              {lang === "de" ? question.de : question.en}
                            </label>
                            <textarea
                              value={answers[key]}
                              onChange={(event) => updateAnswer(key, event.target.value)}
                              placeholder={text(question.placeholder)}
                              rows={3}
                              className="w-full resize-none rounded-[1.5rem] border-2 border-[#f5f5f7] bg-white px-6 py-5 text-[1rem] font-medium text-[#0e0e10] shadow-[0_16px_40px_rgba(0,0,0,0.03)] outline-none transition-all placeholder:text-[#86868b]/50 hover:border-[#d2d2d7] focus:border-[#007aff] focus:ring-8 focus:ring-[#007aff]/10"
                            />
                          </div>
                        );
                      })}
                    </div>
                </div>
              </motion.section>
            </AnimatePresence>

            <div className="mt-24 flex flex-col-reverse sm:flex-row items-center justify-between gap-8 border-t border-[#f5f5f7] pt-12">
              <button
                onClick={() => {
                  if (sectionIndex === 0) {
                    window.scrollTo(0, 0);
                    setStep("INTRO");
                  } else {
                    goToSection(sectionIndex - 1);
                  }
                }}
                className="flex items-center gap-2 text-[1rem] font-bold text-[#86868b] hover:text-[#0e0e10] transition-colors"
              >
                <ArrowLeft size={20} />
                {text(discoveryUiText.back)}
              </button>

              <button
                onClick={() => {
                  if (isLastSection) {
                    handleSubmit();
                  } else {
                    goToSection(sectionIndex + 1);
                  }
                }}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0e0e10] text-white px-10 py-5 rounded-full text-[1.125rem] font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20 disabled:opacity-50 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    {text(discoveryUiText.sending)}
                  </>
                ) : (
                  <>
                    {isLastSection ? text(discoveryUiText.submit) : text(discoveryUiText.continue)}
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === "SUCCESS" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-[#007aff]/10 text-[#007aff] rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight text-[#0e0e10] mb-4">
              {text(discoveryUiText.successTitle)}
            </h2>
            <p className="text-[1.25rem] text-[#86868b] font-medium max-w-xl mx-auto">
              {text(discoveryUiText.successBody)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingLayout>
  );
}
