'use client';

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Camera,
  Code2,
  Megaphone,
  MonitorSmartphone,
  Palette,
  Phone,
  Search,
} from "lucide-react";
import { ExpandingCards } from "@/components/ui/expanding-cards";
import MultistepForm, { type MultistepFormData } from "@/components/ui/multistep-form";
import type { CardItem } from "@/components/ui/expanding-cards";
import { Accordion05 } from "@/components/ui/accordion-05";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from "@/components/ui/carousel";
import { Footer } from "@/components/Footer";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import gmailIcon from "../assets/icons/gmail-icon.webp";
import whatsappIcon from "../assets/icons/whatsapp-icon.webp";
import webdesignPreview from "../assets/Webdesing .webp";
import technicalPreview from "../assets/Technical carrousel.webp";

const contactFormSections = [
  {
    id: "contact",
    enTitle: "Contact",
    deTitle: "Kontakt",
    questions: [
      { id: "name", en: "Name", de: "Name" },
      { id: "businessName", en: "Business name", de: "Unternehmensname" },
      { id: "phone", en: "Phone number", de: "Telefonnummer" },
      { id: "email", en: "Email", de: "E-Mail" },
      { id: "city", en: "City", de: "Stadt" },
    ],
  },
  {
    id: "source",
    enTitle: "Source",
    deTitle: "Quelle",
    questions: [
      { id: "foundFrom", en: "Where did they find us?", de: "Wo haben Sie uns gefunden?" },
    ],
  },
  {
    id: "services",
    enTitle: "Services",
    deTitle: "Ziele",
    questions: [
      { id: "selectedServices", en: "What do they want?", de: "Welche Ziele verfolgen wir?" },
    ],
  },
  {
    id: "final",
    enTitle: "Final",
    deTitle: "Abschluss",
    questions: [
      { id: "websiteUrl", en: "Current website URL, if available", de: "Aktuelle Website-URL (falls vorhanden)" },
      { id: "biggestChallenge", en: "Biggest challenge", de: "Was ist Ihre größte Herausforderung?" },
    ],
  },
];

const contactFormServiceLabels: Record<string, string> = {
  "professional-website": "Neue professionelle Website",
  seo: "Google Sichtbarkeit (SEO)",
  geo: "KI-Suche Sichtbarkeit (GEO)",
  "google-ads": "Google Ads Kampagnen-Management",
  "lead-system": "Digitales Lead-System",
};

const buildContactFormAnswers = (data: MultistepFormData) => ({
  "contact.name": data.name,
  "contact.businessName": data.businessName,
  "contact.phone": data.phone,
  "contact.email": data.email,
  "contact.city": data.city,
  "source.foundFrom":
    data.foundFrom === "Other" ? `Other: ${data.foundFromOther}` : data.foundFrom,
  "services.selectedServices": data.services
    .map((service) => contactFormServiceLabels[service] ?? service)
    .join(", "),
  "final.websiteUrl": data.websiteUrl || "Keine Website angegeben",
  "final.biggestChallenge": data.biggestChallenge,
});

type StatItem = {
  value?: number;
  customValue?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  description?: string;
};

const stats: StatItem[] = [
  {
    value: 100,
    suffix: "+",
    label: "Monatliche Leads generiert",
    description:
      "Websites, die jeden Monat mehr qualifizierte Anfragen gewinnen sollen.",
  },
  {
    value: 97,
    suffix: "%",
    label: "Mehr Klicks",
    description: "Durch klare SEO-Struktur und echte Suchintention.",
  },
  {
    value: 10000,
    prefix: "€",
    suffix: "+",
    label: "Umsatz durch eine Seite",
    description: "Ein starker Entry-Point kann mehr leisten als ein ganzer Blog.",
  },
  {
    value: 7,
    suffix: "x",
    label: "Mehr Anfragen",
    description: "Weil Besucher schneller verstehen, warum sie Kontakt aufnehmen sollten.",
  },
];

const workItems = [
  {
    title: "B.Y. Consulting",
    image: "/assets/new-landing/by-hero-demo.webp",
    alt: "B.Y. Consulting website hero preview",
    link: "https://www.besiryaman-mentoring.de",
    description:
      "Ein präziser Beratungsauftritt, der Kompetenz sichtbar macht und Leads fokussiert.",
  },
  {
    title: "Spine Robotics",
    image: "/assets/new-landing/spine-demo.webp",
    alt: "Spine website hero preview",
    link: "https://spine-robotics.vercel.app/",
    description:
      "Ein klarer Auftritt für ein Gesundheitsangebot: ruhig, vertrauensvoll und sofort verständlich.",
  },
  {
    title: "Herkules",
    image: "/assets/new-landing/herkules-hero-demo.webp",
    alt: "Herkules website hero preview",
    link: "https://www.umzuege-herkules.de/",
    description:
      "Ein lokaler Service-Auftritt mit klarer Botschaft, starker Bildwelt und schneller Orientierung.",
  },
  {
    title: "Dogru Kanzlei",
    image: "/assets/new-landing/hasan-hero-demo.webp",
    alt: "Dogru Kanzlei website hero preview",
    link: "https://hasandogru.de",
    description:
      "Ein vertrauensvoller Kanzlei-Auftritt mit klarem Profil und direkter Anfrageführung.",
  },
];

const workSlides = Array.from({ length: Math.ceil(workItems.length / 2) }, (_, index) =>
  workItems.slice(index * 2, index * 2 + 2),
);

const serviceVisual = (title: string, accent: string) =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="#003fba"/>
        </linearGradient>
        <radialGradient id="glow" cx="70%" cy="25%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.42"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#bg)"/>
      <rect width="900" height="1200" fill="url(#glow)"/>
      <circle cx="690" cy="260" r="210" fill="#ffffff" opacity="0.12"/>
      <circle cx="250" cy="880" r="330" fill="#001b5d" opacity="0.18"/>
      <path d="M130 360H770M130 470H650M130 580H720M130 690H520" stroke="#fff" stroke-width="22" stroke-linecap="round" opacity="0.18"/>
      <text x="96" y="1088" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="800" letter-spacing="-2">${title}</text>
    </svg>
  `)}`;

const serviceItems: CardItem[] = [
  {
    id: "website",
    title: "Professionelle Website",
    description: "Eine Website, die Expertise klar präsentiert und Besucher in echte Anfragen führt.",
    imgSrc: webdesignPreview,
    icon: <MonitorSmartphone size={24} />,
    linkHref: "/services",
  },
  {
    id: "development",
    title: "Technische Umsetzung",
    description: "Schnell, sicher und sauber gebaut, damit Ihr Auftritt auf jedem Gerät zuverlässig wirkt.",
    imgSrc: technicalPreview,
    icon: <Code2 size={24} />,
    linkHref: "/services",
  },
  {
    id: "seo",
    title: "Google-Sichtbarkeit",
    description: "Wir strukturieren Seiten so, dass Menschen mit klarer Suchabsicht Sie finden.",
    imgSrc: "/assets/new-landing/google-search-service.webp",
    icon: <Search size={24} />,
    linkHref: "/leistungen/seo",
  },
  {
    id: "ai",
    title: "KI-Chat-Sichtbarkeit",
    description: "Inhalte und Struktur, damit Ihr Anbieter auch in KI-Antworten sichtbar werden kann.",
    imgSrc: "/assets/new-landing/ai-search-service.webp",
    icon: <Bot size={24} />,
    linkHref: "/services",
  },
  {
    id: "branding",
    title: "Markenidentität",
    description: "Logo, Farben und visuelle Sprache, die sofort professionell und unterscheidbar wirken.",
    imgSrc: "/assets/new-landing/branding-service.webp",
    icon: <Palette size={24} />,
    linkHref: "/services",
  },
  {
    id: "content",
    title: "Content Creation",
    description: "Wir filmen Content mit Kameras und planen spezielle Foto-Shootings für Ihren Auftritt.",
    imgSrc: "/assets/new-landing/content-creation-service.webp",
    icon: <Camera size={24} />,
    linkHref: "/services",
  },
  {
    id: "google-ads",
    title: "Google Ads Kampagnen",
    description: "Wir planen, starten und optimieren Suchkampagnen, die aus Klicks qualifizierte Anfragen machen.",
    imgSrc: "/assets/new-landing/google-ads-service.webp",
    icon: <Megaphone size={24} />,
    linkHref: "/services/google-ads",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Onboarding, Discovery & Strategie",
    description:
      "Wir lernen Ihr Unternehmen, Ihre Zielgruppe, Ihre Ziele und Ihre aktuelle Ausgangslage kennen. Daraus entwickeln wir eine klare Strategie für Sichtbarkeit, Vertrauen und qualifizierte Anfragen.",
  },
  {
    number: "02",
    title: "Struktur, Layout & Freigabe",
    description:
      "Unser Team erstellt die erste Seitenstruktur, das Layout und die visuelle Richtung. Sie sehen früh, wie Ihr Auftritt aufgebaut wird, geben Feedback und bestätigen die Grundlage.",
  },
  {
    number: "03",
    title: "Content, Design & Markenwirkung",
    description:
      "Wir entwickeln Texte, Bilder, Content-Ideen und das finale Design. Ihre Expertise wird klar verständlich, professionell und überzeugend inszeniert.",
  },
  {
    number: "04",
    title: "Technische Umsetzung & Fundament",
    description:
      "Wir setzen die Website sauber um: responsiv, schnell, stabil und suchmaschinenfreundlich. Struktur, Performance, Tracking und SEO-Grundlagen werden direkt mitgedacht.",
  },
  {
    number: "05",
    title: "Review, Feinschliff & Zufriedenheit",
    description:
      "Gemeinsam prüfen wir die fertige Website, optimieren Inhalte, Design und Nutzerführung und nehmen letzte Anpassungen vor. Erst wenn alles stimmig ist, geht der Auftritt live.",
  },
  {
    number: "06",
    title: "Wachstum, SEO & laufende Betreuung",
    description:
      "Nach dem Launch betreuen wir Ihr System weiter: SEO, Wartung, technische Pflege, Content-Optimierung und auf Wunsch Google Ads Kampagnen jeden Monat.",
  },
];

const successStories = [
  {
    variant: "blue",
    image: "/assets/new-landing/hasan-dogru-main-hero-1.webp",
    quote:
      "Seit dem neuen Auftritt verstehen Besucher sofort, was wir anbieten und warum sie uns kontaktieren sollten. Die Website fühlt sich nicht nur besser an, sie bringt auch klarere Anfragen.",
    metricOne: "8x",
    metricOneLabel: "mehr qualifizierte Anfragen",
    metricTwo: "85%",
    metricTwoLabel: "mehr Kontaktaufnahmen",
    name: "Hasan Dogru",
    role: "Anwalt",
  },
  {
    variant: "dark",
    avatar: "/assets/new-landing/by-pfp.webp",
    quote:
      "nüll hat unsere Positionierung geschärft, die Inhalte verständlich gemacht und daraus eine Website gebaut, die Vertrauen aufbaut, bevor das erste Gespräch beginnt.",
    metricOne: "97%",
    metricOneLabel: "mehr Sichtbarkeit",
    metricTwo: "10+",
    metricTwoLabel: "neue Seitenbereiche",
    name: "Besir Yaman",
    role: "Finanzberater",
  },
  {
    variant: "light",
    avatar: "/assets/new-landing/dondu-pfp.webp",
    quote:
      "Der Prozess war klar, schnell und professionell. Wir wussten zu jedem Zeitpunkt, was passiert, und konnten am Ende einen Auftritt launchen, der genau zu uns passt.",
    metricOne: "60k+",
    metricOneLabel: "monatliche Impressionen",
    metricTwo: "100%",
    metricTwoLabel: "zufriedenes Team",
    name: "Dondu Akbaba",
    role: "Inhaberin von Herkules",
  },
];

const faqItems = [
  {
    question: "Was kostet eine professionelle Website mit SEO bei nüll?",
    answer:
      "Der Preis hängt vom Umfang des Projekts ab. Eine professionelle Website startet bei 800 Euro. Dazu kommt eine monatliche Gebühr für Wartung und Hosting. Zusätzliche Leistungen wie laufende SEO-Betreuung, Google Ads oder Content-Erstellung werden je nach Bedarf und Leistungsumfang geplant.",
  },
  {
    question: "Wie lange dauert ein Website-Projekt mit nüll?",
    answer:
      "Ein typisches Website-Projekt dauert bei uns etwa 2 bis 3 Wochen. Entscheidend sind Umfang, Feedback-Geschwindigkeit und ob Inhalte, Fotos oder zusätzliche Seiten neu erstellt werden müssen.",
  },
  {
    question: "Ist SEO direkt in der Website-Erstellung enthalten?",
    answer:
      "Ja. Jede Website erhält technische SEO-Grundlagen, eine saubere Seitenstruktur, Meta Titles, Meta Descriptions, Performance-Basics und Google-Indexierung. Wer monatliche Pakete bucht, kann zusätzlich lokale SEO, Content-Planung, Blogartikel und laufende SEO-Optimierung erhalten.",
  },
  {
    question: "Hilft nüll auch dabei, bei Google und in KI-Suchen sichtbar zu werden?",
    answer:
      "Ja. Wir strukturieren Websites so, dass sie für Google und KI-Systeme wie ChatGPT, Gemini, Perplexity und Claude besser verständlich sind. Dazu gehören klare Inhalte, saubere Seitenlogik, relevante Antworten, lokale Signale und technische Grundlagen. Rankings können nie garantiert werden, aber die Website wird gezielt auf Sichtbarkeit vorbereitet.",
  },
  {
    question: "Erstellt nüll auch Texte, Fotos und Content für die Website?",
    answer:
      "Ja. Je nach Projekt übernehmen wir Copywriting, Content-Konzept, Fotoshootings, Videodrehs und visuelle Inhalte. Besonders für Handwerker, Immobilienanbieter, Berater und Kanzleien hilft eigener Content dabei, Vertrauen aufzubauen und professioneller aufzutreten.",
  },
  {
    question: "Übernimmt nüll Wartung, Hosting, SEO und Google Ads nach dem Launch?",
    answer:
      "Ja. Für jede Website gibt es eine monatliche Gebühr für Hosting und technische Wartung. Darüber hinaus können Kunden laufende SEO-Betreuung, Content-Updates und Google Ads Kampagnenmanagement buchen, wenn sie kontinuierlich wachsen möchten.",
  },
  {
    question: "Für welche Unternehmen eignet sich nüll?",
    answer:
      "nüll ist besonders passend für lokale Unternehmen in Deutschland, Handwerksbetriebe, Immobilienanbieter, Berater, Finanzdienstleister und Anwälte. Der Fokus liegt auf Websites, die Kompetenz zeigen, Vertrauen schaffen und planbare Anfragen auslösen.",
  },
  {
    question: "Gibt es eine Zufriedenheitsgarantie?",
    answer:
      "Ja. Wenn ein Kunde in den ersten 30 Tagen merkt, dass die Zusammenarbeit nicht passt, bieten wir eine Geld-zurück-Garantie. Uns ist wichtig, dass die Zusammenarbeit transparent, professionell und für beide Seiten sinnvoll ist.",
  },
];

const priceScopes = ["Website", "SEO", "KI-Sichtbarkeit", "Google Ads", "Lead System"];

const contactMethods = [
  {
    title: "WhatsApp",
    description: "Schreiben Sie uns direkt.",
    href: "https://wa.me/4915256569852",
    action: "Nachricht senden",
    icon: whatsappIcon,
  },
  {
    title: "Anrufen",
    description: "Sprechen Sie direkt mit uns.",
    href: "tel:+4915256569852",
    action: "+49 1525 6569852",
    Icon: Phone,
  },
  {
    title: "Gmail",
    description: "Lieber per E-Mail? Kein Problem.",
    href: "mailto:info@nüll.com",
    action: "info@nüll.com",
    icon: gmailIcon,
  },
];

const faqColumns = [
  faqItems.filter((_, index) => index % 2 === 0),
  faqItems.filter((_, index) => index % 2 === 1),
];

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimatedRef.current) return;

    let animationFrame = 0;
    let observer: IntersectionObserver | null = null;

    const startCounter = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const duration = 1600;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easedProgress * value);

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

    if (isVisible) {
      startCounter();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          startCounter();
          observer?.disconnect();
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(element);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, [value]);

  const formattedValue =
    value >= 1000 ? displayValue.toLocaleString("de-DE") : displayValue.toString();

  return (
    <span ref={ref}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

type NewLandingSpinnerSectionProps = {
  statsHeading?: string;
  statsItems?: StatItem[];
};

export default function NewLandingSpinnerSection({
  statsHeading = "Sichtbarkeit wird erst wertvoll, wenn daraus Anfragen entstehen",
  statsItems = stats,
}: NewLandingSpinnerSectionProps = {}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const submitContactForm = async (data: MultistepFormData) => {
    if (!projectId || !publicAnonKey) {
      throw new Error("Supabase configuration missing.");
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/onboarding-discovery`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          lang: "de",
          formData: data,
          answers: buildContactFormAnswers(data),
          sections: contactFormSections,
          onboardingType: "new-landing-contact",
        }),
      },
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(
        result.error ? String(result.error) : `Submission failed with status ${response.status}`,
      );
    }

    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-18170315805/uJ-SCL7h764cEJ2IpNhD",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 text-[#0e0e10] md:px-12 md:py-24">
      <div className="mx-auto flex w-full max-w-none flex-col">
        <div className="grid gap-8 md:grid-cols-[0.22fr_0.78fr] md:gap-6">
          <div className="text-[0.95rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
            <span className="mr-3 text-[#007aff]">→</span>
            Ergebnisse
          </div>
          <h2 className="max-w-4xl text-[clamp(2.45rem,5.2vw,4.45rem)] font-bold leading-[0.94] tracking-[-0.06em] text-black">
            {statsHeading}<span className="text-[#007aff]">.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4 md:gap-x-10">
          {statsItems.map((stat) => (
            <div
              key={stat.label}
              className="border-t border-[#d7deea] pt-5 md:pt-7"
            >
              <div className="mb-4 text-[clamp(2.1rem,10vw,3rem)] font-bold leading-none tracking-[-0.065em] text-black md:mb-6 md:text-[clamp(2.5rem,4.2vw,4.2rem)]">
                {stat.customValue ? (
                  stat.customValue
                ) : typeof stat.value === "number" ? (
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                ) : null}
              </div>
              <h3 className="text-[0.95rem] font-bold leading-tight tracking-[-0.045em] text-black md:mb-3 md:text-[1.05rem]">
                {stat.label}
              </h3>
              <p className="max-w-xs text-[0.8rem] font-medium leading-relaxed tracking-[-0.02em] text-[#4f5560] md:text-[0.9rem]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div id="portfolio" className="mt-28 flex min-h-screen w-screen max-w-none scroll-mt-10 flex-col justify-center self-center px-6 py-20 md:px-12">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="text-[1.05rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
              <span className="mr-3 text-[#007aff]">→</span>
              Arbeiten
            </div>
          </div>

          <Carousel className="relative pb-14">
            <CarouselContent className="-ml-6 items-stretch">
              {workSlides.map((slide, slideIndex) => (
                <CarouselItem key={slideIndex} className="basis-full pl-6">
                  <div className="grid gap-10 md:grid-cols-2 md:gap-8">
                    {slide.map((item) => (
                      <article key={item.title} className="min-w-0">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.title} Website öffnen`}
                          className="group block overflow-hidden"
                        >
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </a>
                        <div className="mt-6 md:mt-7">
                          <h3 className="text-[clamp(1.8rem,2.4vw,2.65rem)] font-bold leading-[0.95] tracking-[-0.055em] text-black">
                            {item.title}
                          </h3>
                          <p className="mt-3 max-w-xl text-[1.02rem] font-medium leading-relaxed tracking-[-0.02em] text-[#6b7280]">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselIndicator className="bottom-1 justify-start md:justify-center" />
            <CarouselNavigation
              className="absolute -bottom-1 left-auto top-auto w-full translate-y-0 justify-end gap-2 px-0"
              classNameButton="bg-[#0e0e10] hover:bg-[#007aff] disabled:bg-[#d1d5db] [&_svg]:stroke-white"
              alwaysShow
            />
          </Carousel>
        </div>

        <section id="services" className="relative left-1/2 mt-16 w-screen max-w-none -translate-x-1/2 scroll-mt-10 bg-[#007aff] px-6 pb-28 pt-20 text-white md:px-12 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:items-end">
            <div>
              <p className="text-[0.95rem] font-semibold tracking-[-0.025em] text-white/80">
                <span className="mr-3 text-white">→</span>
                Leistungen
              </p>
              <h2 className="mt-6 max-w-3xl text-[clamp(3rem,6vw,6.75rem)] font-bold leading-[0.9] tracking-[-0.06em]">
                Our Services<span className="text-white/55">.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-[1.1rem] font-medium leading-relaxed tracking-[-0.025em] text-white/75">
              Websites, Sichtbarkeit, Positionierung und Betreuung. Alles greift zusammen, damit aus Aufmerksamkeit planbare Anfragen werden.
            </p>
          </div>
          <ExpandingCards
            items={serviceItems}
            defaultActiveIndex={0}
            className="mt-14 max-w-none border-0"
          />
        </section>

        <section className="w-screen max-w-none self-center bg-white px-6 py-24 text-black md:px-12 md:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.28fr_0.72fr] lg:gap-24">
            <div className="lg:sticky lg:top-16 lg:self-start">
              <p className="mb-8 text-[1.05rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
                <span className="mr-3 text-[#007aff]">→</span>
                Prozess
              </p>
              <h2 className="text-[clamp(4rem,8vw,8.75rem)] font-bold leading-[0.9] tracking-[-0.075em] text-black">
                Our
                <br />
                Process<span className="text-[#007aff]">.</span>
              </h2>
              <p className="mt-10 max-w-sm text-[1.08rem] font-medium leading-relaxed tracking-[-0.025em] text-[#6b7280]">
                Ein klarer Ablauf vom ersten Gespräch bis zum System, das langfristig für neue Anfragen arbeitet.
              </p>
              <a
                href="#contact"
                className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#007aff] px-10 text-[1.05rem] font-bold tracking-[-0.025em] text-white no-underline transition-transform hover:-translate-y-0.5"
              >
                <span>→</span>
                Erstgespräch planen
              </a>
            </div>

            <Accordion05
              items={processSteps.map((step) => ({
                id: step.number,
                title: step.title,
                content: step.description,
              }))}
            />
          </div>
        </section>

        <section className="w-screen max-w-none self-center bg-white px-6 py-24 text-black md:px-12 md:py-32">
          <div className="grid gap-5 lg:grid-cols-4">
            <article className="flex min-h-[34rem] flex-col justify-between border border-[#d8dde7] p-8 lg:min-h-[40rem]">
              <div>
                <div className="text-[1.75rem] font-bold tracking-[-0.06em] text-black">
                  nüll<span className="text-[#007aff]">.</span>
                </div>
                <h2 className="mt-20 text-[clamp(3rem,4.3vw,4.4rem)] font-bold leading-[0.85] tracking-[-0.075em] text-black">
                  Success
                  <br />
                  Stories
                </h2>
              </div>
              <p className="max-w-sm text-[0.98rem] font-medium leading-relaxed tracking-[-0.02em] text-[#6b7280]">
                Echte Ergebnisse von Kunden, deren Websites heute sichtbarer auftreten, mehr Vertrauen schaffen und mehr Anfragen auslösen.
              </p>
            </article>

            {successStories.map((story) => (
              <article
                key={story.name}
                className={`relative flex min-h-[34rem] flex-col justify-between overflow-hidden p-8 lg:min-h-[40rem] ${
                  story.variant === "dark"
                    ? "bg-black text-white"
                    : story.variant === "blue"
                      ? "bg-[#007aff] text-white"
                      : "bg-[#f3f5f8] text-black"
                }`}
                style={
                  "image" in story && story.image
                    ? {
                        backgroundImage: `url(${story.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }
                    : undefined
                }
              >
                {"image" in story && story.image && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#007aff]/95 via-[#007aff]/60 to-black/10" />
                )}
                <div className="relative z-10">
                  <div
                    className={`mb-8 text-[1rem] tracking-[0.12em] ${
                      story.variant === "light" ? "text-[#007aff]" : "text-white"
                    }`}
                    aria-label="5 Sterne"
                  >
                    ★★★★★
                  </div>
                  <p
                    className={`text-[clamp(1.2rem,1.7vw,1.55rem)] font-medium leading-[1.2] tracking-[-0.035em] ${
                      story.variant === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    {story.quote}
                  </p>
                </div>

                <div className="relative z-10">
                  <div
                    className={`grid grid-cols-2 gap-8 border-b pb-8 ${
                      story.variant === "light" ? "border-[#d8dde7]" : "border-white/25"
                    }`}
                  >
                    <div>
                      <div className="text-[clamp(2.2rem,3vw,3rem)] font-bold tracking-[-0.06em]">
                        {story.metricOne}
                      </div>
                      <p className={`mt-1 text-sm ${story.variant === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                        {story.metricOneLabel}
                      </p>
                    </div>
                    <div>
                      <div className="text-[clamp(2.2rem,3vw,3rem)] font-bold tracking-[-0.06em]">
                        {story.metricTwo}
                      </div>
                      <p className={`mt-1 text-sm ${story.variant === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                        {story.metricTwoLabel}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    {story.name !== "Hasan Dogru" && (
                      "avatar" in story && story.avatar ? (
                        <img
                          src={story.avatar}
                          alt={`${story.name} Profilbild`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`h-10 w-10 rounded-full ${
                            story.variant === "light" ? "bg-[#007aff]" : "bg-white/20"
                          }`}
                        />
                      )
                    )}
                    <div>
                      <h3 className="text-[1rem] font-bold tracking-[-0.035em]">{story.name}</h3>
                      <p className={`mt-1 text-sm ${story.variant === "light" ? "text-[#6b7280]" : "text-white/65"}`}>
                        {story.role}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="w-screen max-w-none self-center bg-white px-6 py-16 text-black md:px-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.26fr_0.74fr] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-16">
              <p className="mb-6 text-[1.05rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
                <span className="mr-3 text-[#007aff]">→</span>
                FAQ
              </p>
              <h2 className="text-[clamp(4.5rem,8vw,7.25rem)] font-bold leading-[0.85] tracking-[-0.075em] text-black">
                FAQ<span className="text-[#007aff]">.</span>
              </h2>
              <p className="mt-7 max-w-sm text-[1.02rem] font-medium leading-relaxed tracking-[-0.025em] text-[#6b7280]">
                Kurze Antworten auf die Fragen, die vor einem Website-Projekt wirklich wichtig sind.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#007aff] px-8 text-[1rem] font-bold tracking-[-0.025em] text-white no-underline transition-transform hover:-translate-y-0.5"
              >
                <span>→</span>
                Frage stellen
              </a>
            </div>

            <div className="grid gap-x-10 lg:grid-cols-2">
              {faqColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="border-b border-[#d8dde7]">
                  {column.map((item) => {
                    const itemIndex = faqItems.indexOf(item);

                    return (
                      <div key={item.question} className="border-t border-[#d8dde7]">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveFaq((current) => (current === itemIndex ? null : itemIndex))
                          }
                          className="flex w-full cursor-pointer items-center justify-between gap-8 py-5 text-left text-[clamp(1.05rem,1.25vw,1.25rem)] font-bold leading-tight tracking-[-0.045em] text-black"
                          aria-expanded={activeFaq === itemIndex}
                        >
                          <span>{item.question}</span>
                          <span
                            className={`shrink-0 text-3xl font-medium leading-none text-[#007aff] transition-transform duration-300 ${
                              activeFaq === itemIndex ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            activeFaq === itemIndex ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-2xl pb-5 text-[0.98rem] font-medium leading-relaxed tracking-[-0.02em] text-[#6b7280]">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative w-screen max-w-none self-center overflow-hidden bg-[#007aff] px-6 py-20 text-white md:px-12 md:py-28">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white to-transparent" />
          <div className="relative grid min-h-[75vh] items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)]">
            <div className="max-w-4xl">
              <p className="text-[0.92rem] font-bold uppercase tracking-[0.34em] text-white/70">
                Kontakt
              </p>
              <h2 className="mt-8 max-w-4xl text-[clamp(2.75rem,5vw,5.85rem)] font-bold leading-[0.9] tracking-[-0.075em] text-white sm:text-[clamp(3.2rem,5vw,5.85rem)]">
                <span className="block whitespace-nowrap">Lassen Sie uns</span>
                <span className="block whitespace-nowrap">
                  etwas Starkes bauen<span className="text-white/45">.</span>
                </span>
              </h2>
              <p className="mt-8 max-w-[54rem] text-[clamp(1.1rem,1.45vw,1.42rem)] font-medium leading-relaxed tracking-[-0.035em] text-white/78">
                Erzählen Sie uns kurz, wo Ihr Unternehmen gerade steht. Wir zeigen Ihnen, welche Website, SEO-Struktur, KI-Sichtbarkeit oder Google Ads Lösung wirklich sinnvoll ist.
              </p>

              <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
                {contactMethods.map(({ title, description, href, action, icon, Icon }) => (
                  <a
                    key={title}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`group flex min-h-[8.5rem] flex-col justify-between rounded-[1.35rem] border border-white/18 bg-white/12 p-4 text-left text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0e0e10] ${
                      title === "Gmail" ? "col-span-2 mx-auto w-full max-w-[20rem] sm:col-span-1 sm:max-w-none" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {Icon ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#007aff]">
                          <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                        </span>
                      ) : (
                        <img
                          src={icon}
                          alt=""
                          aria-hidden="true"
                          className="h-7 w-7 object-contain"
                        />
                      )}
                      <ArrowUpRight
                        size={17}
                        className="text-white/65 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#007aff]"
                        strokeWidth={1.8}
                      />
                    </div>
                    <div>
                      <h3 className="text-[1rem] font-bold tracking-[-0.02em]">{title}</h3>
                      <p className="mt-1 text-[0.82rem] font-medium leading-snug text-white/70 transition-colors group-hover:text-[#6b7280]">
                        {description}
                      </p>
                      <span className="mt-4 block text-[0.84rem] font-bold text-white transition-colors group-hover:text-[#007aff]">
                        {action}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <MultistepForm
              className="w-full max-w-none pb-0 md:-translate-x-6 xl:-translate-x-10"
              onSubmit={submitContactForm}
              showIntro={false}
            />
          </div>
        </section>

        <div className="new-landing-footer w-screen max-w-none self-center bg-white text-[#0e0e10] [&_footer]:py-5 [&_footer]:md:py-5">
          <Footer />
        </div>

      </div>
    </section>
  );
}
