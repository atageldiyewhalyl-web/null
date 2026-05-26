'use client';

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Camera,
  Cloud,
  Code2,
  Cookie,
  FileText,
  Gauge,
  Mail,
  Megaphone,
  MessageSquare,
  MonitorSmartphone,
  Palette,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Phone,
} from "lucide-react";
import { ExpandingCards } from "@/components/ui/expanding-cards";
import type { CardItem } from "@/components/ui/expanding-cards";
import MultistepForm, { type MultistepFormData } from "@/components/ui/multistep-form";
import { Accordion05 } from "@/components/ui/accordion-05";
import { AnimatedBlobs } from "@/components/ui/blobs";
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
import webpageScatterAsset from "../assets/webpage scatter.webp";
import serviceHeroScroll1 from "../assets/Service hero scroll/1.webp";
import serviceHeroScroll2 from "../assets/Service hero scroll/2.webp";
import serviceHeroScroll4 from "../assets/Service hero scroll/4.webp";
import serviceHeroScroll5 from "../assets/Service hero scroll/5.webp";
import serviceHeroScroll6 from "../assets/Service hero scroll/6.webp";
import serviceAssetLogo from "../assets/services assets /Logo-card.webp";
import serviceAssetGoogleAds from "../assets/services assets /google ads-card.webp";
import serviceAssetGoogleAiSearch from "../assets/services assets /google ai search-card.webp";
import serviceAssetPhotoshoot from "../assets/services assets /photoshoot-card.webp";
import serviceAssetSeo from "../assets/services assets /seo-card.webp";
import serviceAssetSite from "../assets/services assets /site-card.webp";
import serviceAssetText from "../assets/services assets /text-card.webp";

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

type FaqItem = {
  question: string;
  answer: string;
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
  {
    title: "Spine Robotics",
    image: "/assets/new-landing/spine-demo.webp",
    alt: "Spine website hero preview",
    link: "https://spine-robotics.vercel.app/",
    description:
      "Ein klarer Auftritt für ein Gesundheitsangebot: ruhig, vertrauensvoll und sofort verständlich.",
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

const lawyerFaqItems = [
  {
    question: "Was kostet eine Kanzlei-Website mit SEO bei nüll?",
    answer:
      "Der Preis hängt vom Umfang der Kanzlei-Website ab. Eine professionelle Website startet bei 800 Euro. Dazu kommt eine monatliche Gebühr für Wartung und Hosting. Zusätzliche Leistungen wie laufende SEO-Betreuung, Google Ads, Content-Erstellung oder separate Seiten für Rechtsgebiete werden je nach Bedarf und Leistungsumfang geplant.",
  },
  {
    question: "Wie lange dauert ein Website-Projekt für Anwälte, Kanzleien oder Berater?",
    answer:
      "Ein typisches Kanzlei- oder Berater-Website-Projekt dauert bei uns etwa 2 bis 3 Wochen. Entscheidend sind Umfang, Feedback-Geschwindigkeit und ob Inhalte, Fotos, Vertrauenselemente oder zusätzliche Leistungsseiten neu erstellt werden müssen.",
  },
  {
    question: "Ist SEO für Kanzleien direkt in der Website-Erstellung enthalten?",
    answer:
      "Ja. Jede Kanzlei-Website erhält technische SEO-Grundlagen, eine saubere Seitenstruktur, Meta Titles, Meta Descriptions, Performance-Basics und Google-Indexierung. Wer monatliche Pakete bucht, kann zusätzlich lokale SEO, Content-Planung, Blogartikel, Rechtsgebietsseiten und laufende SEO-Optimierung erhalten.",
  },
  {
    question: "Hilft nüll dabei, bei Google und in KI-Suchen für Rechtsgebiete sichtbar zu werden?",
    answer:
      "Ja. Wir strukturieren Kanzlei-Websites so, dass sie für Google und KI-Systeme wie ChatGPT, Gemini, Perplexity und Claude besser verständlich sind. Dazu gehören klare Inhalte, saubere Seitenlogik, relevante Antworten zu Rechtsgebieten, lokale Signale und technische Grundlagen. Rankings können nie garantiert werden, aber die Website wird gezielt auf Sichtbarkeit und qualifizierte Mandatsanfragen vorbereitet.",
  },
  {
    question: "Erstellt nüll auch Texte, Fotos und Inhalte für Kanzlei-Websites?",
    answer:
      "Ja. Je nach Projekt übernehmen wir Copywriting, Content-Konzept, Fotoshootings, Videodrehs und visuelle Inhalte. Besonders für Anwälte, Kanzleien, Steuerberater und Berater hilft eigener Content dabei, Vertrauen aufzubauen, Expertise verständlich zu machen und professioneller aufzutreten.",
  },
  {
    question: "Übernimmt nüll Wartung, Hosting, SEO und Google Ads nach dem Launch?",
    answer:
      "Ja. Für jede Website gibt es eine monatliche Gebühr für Hosting und technische Wartung. Darüber hinaus können Kanzleien und Berater laufende SEO-Betreuung, Content-Updates und Google Ads Kampagnenmanagement buchen, wenn sie kontinuierlich sichtbarer werden und mehr Anfragen gewinnen möchten.",
  },
  {
    question: "Für welche Kanzleien, Anwälte und Berater eignet sich nüll?",
    answer:
      "nüll ist besonders passend für Anwälte, Kanzleien, Steuerberater, Finanzberater, Unternehmensberater und professionelle Dienstleister in Deutschland. Der Fokus liegt auf Websites, die Kompetenz zeigen, Vertrauen schaffen und planbare Anfragen oder Mandatsanfragen auslösen.",
  },
  {
    question: "Gibt es eine Zufriedenheitsgarantie für Kanzlei-Website-Projekte?",
    answer:
      "Ja. Wenn ein Kunde in den ersten 30 Tagen merkt, dass die Zusammenarbeit nicht passt, bieten wir eine Geld-zurück-Garantie. Uns ist wichtig, dass die Zusammenarbeit mit Kanzleien und Beratern transparent, professionell und für beide Seiten sinnvoll ist.",
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
    eventName: "lawyer_whatsapp_click",
  },
  {
    title: "Anrufen",
    description: "Sprechen Sie direkt mit uns.",
    href: "tel:+4915256569852",
    action: "+49 1525 6569852",
    Icon: Phone,
    eventName: "lawyer_phone_click",
  },
  {
    title: "Gmail",
    description: "Lieber per E-Mail? Kein Problem.",
    href: "mailto:info@nüll.com",
    action: "info@nüll.com",
    icon: gmailIcon,
    eventName: "lawyer_email_click",
  },
];

const lawyerProblemItems = [
  {
    number: "01",
    title: "Unklare Positionierung",
    description:
      "Es ist nicht sofort sichtbar, für welche Fälle und Rechtsgebiete Ihre Kanzlei steht.",
  },
  {
    number: "02",
    title: "Zu wenig Suchintention",
    description:
      "Die Seiten orientieren sich nicht an den Fragen, die Mandanten tatsächlich bei Google eingeben.",
  },
  {
    number: "03",
    title: "Schwache Anfrageführung",
    description:
      "Der Weg zu Anruf, Formular oder Erstgespräch ist nicht klar genug aufgebaut.",
  },
];

type ProblemItem = {
  number: string;
  title: string;
  description: string;
};

type ProblemSectionCopy = {
  eyebrow?: string;
  sideText: React.ReactNode;
  actionLabel?: string;
  headline: React.ReactNode;
  items: ProblemItem[];
};

const lawyerSystemItems = [
  {
    number: "01",
    title: "Positionierung",
    description: "Wir klären, wofür Ihre Kanzlei bekannt sein soll.",
    position: "leftTop",
  },
  {
    number: "02",
    title: "Suchstruktur",
    description: "Seiten entstehen aus echter juristischer Suchintention.",
    position: "rightTop",
  },
  {
    number: "03",
    title: "Vertrauensdesign",
    description: "Die Website vermittelt Kompetenz, Seriosität und Klarheit.",
    position: "rightBottom",
  },
  {
    number: "04",
    title: "Anfrageführung",
    description: "Kontakt per Telefon, Formular, Termin oder WhatsApp wird klar geführt.",
    position: "leftBottom",
  },
];

const serviceHeroScrollItems = [
  { src: serviceHeroScroll1, alt: "Steuerrecht Kanzlei Website Hero" },
  { src: serviceHeroScroll2, alt: "Migrationsrecht Kanzlei Website Hero" },
  { src: serviceHeroScroll4, alt: "Familienrecht Kanzlei Website Hero" },
  { src: serviceHeroScroll5, alt: "Erbrecht Kanzlei Website Hero" },
  { src: serviceHeroScroll6, alt: "Immobilienrecht Kanzlei Website Hero" },
];

type LawyerServiceCard = {
  title: string;
  description: string;
  visualAlt: string;
  visualSrc?: string;
  visual?: "automation" | "tech";
};

type ServicesShowcaseCopy = {
  heading: React.ReactNode;
  subheading: string;
  cards: LawyerServiceCard[];
};

type DoctorMockupItem = {
  src: string;
  alt: string;
};

const lawyerServiceCards: LawyerServiceCard[] = [
  {
    title: "Branding & Logo",
    description:
      "Wir entwickeln Kanzlei-Marken, die Vertrauen schaffen und im Kopf bleiben: mit klarem Logo, seriöser Positionierung und konsistentem Auftritt.",
    visualSrc: serviceAssetLogo,
    visualAlt: "Branding und Logo Vorschau",
  },
  {
    title: "Texte für Google & KI",
    description:
      "Wir schreiben Inhalte, die Mandanten verstehen und Suchsysteme einordnen können: klar, relevant und auf Anfragen optimiert.",
    visualSrc: serviceAssetText,
    visualAlt: "Texte für Google und KI Vorschau",
  },
  {
    title: "Hochwertiges Webdesign",
    description:
      "Websites, die Kompetenz zeigen: modern, schnell und benutzerfreundlich. Für mehr Vertrauen, bessere Leads und messbare Ergebnisse.",
    visualSrc: serviceAssetSite,
    visualAlt: "Hochwertiges Webdesign Vorschau",
  },
  {
    title: "Professionelles Fotoshooting",
    description:
      "Authentische Bilder, die Persönlichkeit und Kompetenz sichtbar machen: für einen starken ersten Eindruck auf Ihrer Website.",
    visualSrc: serviceAssetPhotoshoot,
    visualAlt: "Professionelles Fotoshooting Vorschau",
  },
  {
    title: "Nachhaltiges SEO",
    description:
      "Wir verbessern Ihre Rankings mit technischer Stärke, relevanten Inhalten und einer Struktur, die langfristig wirkt.",
    visualSrc: serviceAssetSeo,
    visualAlt: "Nachhaltiges SEO Vorschau",
  },
  {
    title: "KI-Sichtbarkeit / GEO",
    description:
      "Wir sorgen dafür, dass Ihre Kanzlei in KI-Antworten sichtbar wird: mit strukturierten Inhalten und klaren Signalen.",
    visualSrc: serviceAssetGoogleAiSearch,
    visualAlt: "KI Sichtbarkeit und GEO Vorschau",
  },
  {
    title: "Google Ads",
    description:
      "Mehr qualifizierte Anfragen durch zielgerichtete Kampagnen, die sichtbar machen, was Ihre Kanzlei besonders macht.",
    visualSrc: serviceAssetGoogleAds,
    visualAlt: "Google Ads Vorschau",
  },
  {
    title: "Automatisierung mit KI",
    description:
      "Wir automatisieren Prozesse für schnellere Antworten, effizientere Abläufe und mehr Zeit für Ihr Kerngeschäft.",
    visual: "automation",
    visualSrc: undefined,
    visualAlt: "Automatisierung mit KI Vorschau",
  },
  {
    title: "Technik & Betreuung",
    description:
      "Wir sorgen für eine sichere, schnelle und DSGVO-konforme Website. Damit alles läuft und aktuell bleibt.",
    visual: "tech",
    visualAlt: "Technik und DSGVO Betreuung Vorschau",
  },
];

function LawyerServiceVisual({
  src,
  alt,
  type,
}: {
  src?: string;
  alt?: string;
  type?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className="h-full w-full object-contain object-center"
        loading="lazy"
      />
    );
  }

  if (type === "automation") {
    const automationSteps = [
      { label: "Anfrage", Icon: MessageSquare },
      { label: "KI sortiert", Icon: Sparkles },
      { label: "Antwort", Icon: Mail },
    ];

    return (
      <div className="relative flex h-full items-center justify-between gap-4 overflow-hidden rounded-[8px] bg-[#f7f9fc] p-4">
        <div className="absolute left-10 right-10 top-1/2 h-px bg-[#dbe3ef]" />
        {automationSteps.map(({ label, Icon }, index) => (
          <div
            key={label}
            className="relative flex h-24 flex-1 flex-col items-center justify-center rounded-[8px] bg-white text-center text-[0.78rem] font-bold text-[#4b5563] shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-[#e5ebf4]"
          >
            <Icon size={20} className="mb-3 text-[#006dff]" />
            <span>{label}</span>
            {index < automationSteps.length - 1 ? (
              <span className="absolute -right-4 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#006dff] text-[0.85rem] font-bold text-white shadow-sm">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (type === "tech") {
    const techItems = [
      { label: "DSGVO", Icon: ShieldCheck },
      { label: "Cookies", Icon: Cookie },
      { label: "Impressum", Icon: FileText },
      { label: "Sicherheit", Icon: Gauge },
      { label: "Backups", Icon: Cloud },
      { label: "Updates", Icon: RefreshCw },
    ];

    return (
      <div className="relative h-full overflow-hidden rounded-[8px] bg-[#f7f9fc] p-4">
        <div className="absolute inset-x-8 top-1/2 h-px bg-[#dbe3ef]" />
        <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[#dbe3ef]" />
        <div className="relative grid h-full grid-cols-3 gap-3">
          {techItems.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex min-w-0 items-center justify-center gap-2 rounded-[8px] bg-white px-3 text-[0.78rem] font-bold tracking-[-0.02em] text-[#172033] shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-[#e5ebf4]"
            >
              <Icon size={17} className="shrink-0 text-[#006dff]" />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-[8px] border border-[#e1e7f0] bg-white p-4">
      <div className="mb-4 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="h-14 rounded bg-[#e8edf5]" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="h-10 rounded bg-[#eef2f7]" />
        <div className="h-10 rounded bg-[#eef2f7]" />
        <div className="h-10 rounded bg-[#eef2f7]" />
        <div className="h-10 rounded bg-[#007aff]" />
      </div>
    </div>
  );
}

function LawyerQuestionMarkPlaceholder({
  src = webpageScatterAsset,
  alt = "Verstreute Website-Seiten",
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-auto w-full max-w-[42rem] object-contain"
      loading="lazy"
    />
  );
}

function LawyerHeroScrollSection() {
  const repeatedItems = [...serviceHeroScrollItems, ...serviceHeroScrollItems];

  return (
    <section className="relative z-10 mt-10 w-full max-w-full overflow-hidden bg-white py-3 text-black [contain:layout_paint] md:left-1/2 md:mt-12 md:w-screen md:max-w-none md:-translate-x-1/2 md:py-6">
      <div className="flex w-max max-w-none animate-[nll-hero-scroll_18s_linear_infinite] gap-3 px-6 md:gap-5 md:px-12">
        {repeatedItems.map((item, index) => (
          <figure
            key={`${item.alt}-${index}`}
            className="w-[62vw] shrink-0 md:w-[24rem] lg:w-[31rem]"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="block aspect-[1448/1086] w-full object-contain"
              loading={index < serviceHeroScrollItems.length ? "eager" : "lazy"}
            />
          </figure>
        ))}
      </div>

      <style>{`
        @keyframes nll-hero-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 0.75rem));
          }
        }
      `}</style>
    </section>
  );
}

function DoctorMockupShowcaseSection({ items }: { items: DoctorMockupItem[] }) {
  return (
    <section className="relative z-10 mt-10 w-full max-w-full overflow-hidden bg-white py-4 text-black [contain:layout_paint] md:left-1/2 md:mt-12 md:w-screen md:max-w-none md:-translate-x-1/2 md:py-8">
      <div className="mx-auto grid max-w-[96rem] gap-7 px-6 md:grid-cols-2 md:px-12 lg:grid-cols-3 lg:gap-8">
        {items.map((item, index) => (
          <figure
            key={item.src}
            className="min-w-0"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="block h-auto w-full"
              loading={index < 3 ? "eager" : "lazy"}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

function ServicesShowcaseSection({ copy }: { copy?: ServicesShowcaseCopy }) {
  const servicesCopy = copy ?? {
    heading: <>Alles, was aus Sichtbarkeit planbare Anfragen macht.</>,
    subheading:
      "Branding, Website, SEO, Google Ads, KI-Sichtbarkeit und Betreuung: alles greift ineinander und bringt Ihrer Kanzlei messbar mehr Anfragen.",
    cards: lawyerServiceCards,
  };

  return (
    <section id="services" className="relative left-1/2 z-10 min-h-[165vh] w-screen max-w-none -translate-x-1/2 scroll-mt-10 overflow-hidden bg-[#006dff] px-5 py-16 text-white md:px-10 md:py-20 lg:min-h-[185vh]">
      <div className="mx-auto max-w-[90rem]">
        <div className="text-[0.95rem] font-medium tracking-[-0.025em] text-white/90">
          <span className="mr-3 text-white">→</span>
          Unsere Leistungen
        </div>
        <h2 className="mx-auto mt-6 max-w-5xl text-center text-[clamp(2.7rem,5.5vw,6rem)] font-bold leading-[0.9] tracking-[-0.065em]">
          {servicesCopy.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-4xl text-center text-[clamp(1.05rem,1.7vw,1.35rem)] font-medium leading-relaxed tracking-[-0.025em] text-white/86">
          {servicesCopy.subheading}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {servicesCopy.cards.map((service) => (
            <article
              key={service.title}
              className="flex min-h-[24rem] flex-col overflow-hidden rounded-[8px] bg-white p-6 text-[#121826] shadow-[0_24px_70px_rgba(0,23,82,0.22)] ring-1 ring-white/25 md:min-h-[26rem] lg:min-h-[28rem]"
            >
              <div>
                <h3 className="text-[1.55rem] font-bold leading-tight tracking-[-0.045em] md:text-[1.75rem]">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-md text-[0.98rem] font-semibold leading-relaxed tracking-[-0.025em] text-[#394150] md:text-[1.02rem]">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 h-[11rem] overflow-hidden rounded-[8px] md:h-[12rem]">
                <LawyerServiceVisual
                  src={service.visualSrc}
                  alt={service.visualAlt}
                  type={service.visual}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainServicesAccordionSection() {
  return (
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
  );
}

function LawyerSystemVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white px-6 py-12 text-black md:px-12 md:py-20 lg:py-14">
      <p className="relative z-20 text-[0.95rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
        <span className="mr-3 text-[#007aff]">→</span>
        System
      </p>

      <div className="nll-lawyer-system-stage relative mx-auto mt-7 flex h-[calc(100svh-8.75rem)] min-h-0 w-full max-w-[92rem] flex-col md:mt-6 md:h-[calc(100vh-10rem)] md:min-h-[36rem] md:-translate-y-[5vh]">
        <div className="absolute left-1/2 top-1/2 hidden h-[43rem] w-[43rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d7deea] lg:block" />

        <svg
          className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
          viewBox="0 0 1472 800"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M104 292H512L612 392" stroke="#d8dde7" strokeWidth="1.5" />
          <path d="M1368 292H960L860 392" stroke="#d8dde7" strokeWidth="1.5" />
          <path d="M104 568H512L612 468" stroke="#d8dde7" strokeWidth="1.5" />
          <path d="M1368 568H960L860 468" stroke="#d8dde7" strokeWidth="1.5" />
        </svg>

        <div className="relative z-20 mx-auto h-[11.5rem] w-[11.5rem] md:absolute md:left-1/2 md:top-1/2 md:h-[31rem] md:w-[31rem] md:-translate-x-1/2 md:-translate-y-1/2">
          <AnimatedBlobs />
          <div className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-[1rem] leading-none tracking-[-0.045em] md:text-[1.55rem]">
            <span className="font-bold">nüll</span>
            <span className="font-medium text-[#0e0e10]/75">System</span>
          </div>
        </div>

        <div className="nll-lawyer-system-list relative z-30 mt-6 flex flex-1 flex-col justify-evenly gap-0 pb-8 md:mt-0 md:grid md:flex-none md:gap-4 md:pb-0 md:pt-[32rem] lg:block lg:pt-0">
          {lawyerSystemItems.map((item) => (
            <article
              key={item.number}
              data-position={item.position}
              className={`nll-lawyer-system-card relative z-20 md:max-w-[18rem] ${
                item.position === "leftTop"
                  ? "lg:absolute lg:left-[8%] lg:top-[10%]"
                  : item.position === "rightTop"
                    ? "lg:absolute lg:right-[7%] lg:top-[10%]"
                    : item.position === "rightBottom"
                      ? "lg:absolute lg:bottom-[10%] lg:right-[7%]"
                      : "lg:absolute lg:bottom-[10%] lg:left-[8%]"
              }`}
            >
              <div className="text-[1.05rem] font-bold tracking-[-0.04em] text-[#0b63ff] md:text-[1.25rem]">
                {item.number}
              </div>
              <h3 className="mt-2 text-[1.15rem] font-bold leading-tight tracking-[-0.045em] text-black md:mt-6 md:text-[1.55rem] md:font-medium">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[0.88rem] font-medium leading-snug tracking-[-0.02em] text-[#6b7280] md:mt-5 md:text-[1.05rem] md:leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .nll-lawyer-system-stage {
              height: clamp(40rem, calc(100svh - 8.5rem), 48rem);
              min-height: 40rem;
              transform: translateY(0);
            }

            .nll-lawyer-system-list {
              position: absolute;
              inset: 0;
              display: block;
              margin-top: 0;
              padding: 0;
            }

            .nll-lawyer-system-card {
              position: absolute;
              max-width: clamp(17rem, 21vw, 20.5rem);
            }

            .nll-lawyer-system-card[data-position="leftTop"] {
              left: clamp(0rem, 4vw, 3.5rem);
              top: 4.75rem;
            }

            .nll-lawyer-system-card[data-position="rightTop"] {
              right: clamp(0rem, 4vw, 3.5rem);
              top: 4.75rem;
            }

            .nll-lawyer-system-card[data-position="rightBottom"] {
              right: clamp(0rem, 4vw, 3.5rem);
              bottom: 4.25rem;
            }

            .nll-lawyer-system-card[data-position="leftBottom"] {
              left: clamp(0rem, 4vw, 3.5rem);
              bottom: 4.25rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function LawyerFixedSystemBackground({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <LawyerSystemVisual />
    </div>
  );
}

function LawyerSystemRevealWindow({
  revealRef,
}: {
  revealRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={revealRef}
      className="relative left-1/2 h-[125vh] w-screen max-w-none -translate-x-1/2 bg-transparent pointer-events-none md:h-[115vh]"
    />
  );
}

function LawyerProblemSection({
  problemVisualSrc,
  problemVisualAlt,
  problemCopy,
}: {
  problemVisualSrc?: string;
  problemVisualAlt?: string;
  problemCopy?: ProblemSectionCopy;
}) {
  const copy = problemCopy ?? {
    eyebrow: "Problem",
    sideText: (
      <>
        Viele Kanzleien sind online auffindbar,
        <br />
        aber nicht relevant genug,
        <br />
        um von potenziellen Mandanten
        <br />
        kontaktiert zu werden.
      </>
    ),
    actionLabel: "Wie wir das lösen",
    headline: (
      <>
        <span className="block">Warum aus</span>
        <span className="block min-[430px]:hidden">Sichtbarkeit oft</span>
        <span className="block min-[430px]:hidden">noch keine</span>
        <span className="hidden min-[430px]:block md:hidden">Sichtbarkeit oft noch keine</span>
        <span className="hidden md:block">Sichtbarkeit oft noch keine</span>
        <span className="block">Anfragen werden<span className="text-[#007aff]">.</span></span>
      </>
    ),
    items: lawyerProblemItems,
  };

  return (
    <section className="relative left-1/2 mt-16 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-white px-6 py-14 text-black md:mt-24 md:px-12 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
        <aside className="flex flex-col justify-between gap-10">
          <div>
            <p className="text-[0.95rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
              <span className="mr-3 text-[#007aff]">→</span>
              {copy.eyebrow ?? "Problem"}
            </p>
            <p className="mt-10 hidden max-w-[24rem] text-[1.02rem] font-bold leading-[1.35] tracking-[-0.04em] text-[#0e0e10] md:block">
              {copy.sideText}
            </p>
            <a
              href="#services"
              className="mt-6 hidden border-b-2 border-black pb-1 text-[1.05rem] font-bold leading-none tracking-[-0.04em] text-black no-underline md:inline-flex"
            >
              {copy.actionLabel ?? "Wie wir das lösen"}
            </a>
          </div>

          <div className="hidden lg:block">
            <LawyerQuestionMarkPlaceholder src={problemVisualSrc} alt={problemVisualAlt} />
          </div>
        </aside>

        <div>
          <h2 className="max-w-full text-[clamp(2.15rem,10.6vw,3.2rem)] font-bold leading-[0.9] tracking-[-0.06em] text-black min-[430px]:text-[clamp(2.45rem,9vw,3.4rem)] md:max-w-5xl md:text-[clamp(3.25rem,4.5vw,5.15rem)] md:leading-[0.88]">
            {copy.headline}
          </h2>

          <div className="mt-12 divide-y divide-[#d7deea] border-t border-[#d7deea] md:mt-14">
            {copy.items.map((item) => (
              <article
                key={item.number}
                className="grid min-w-0 gap-5 py-8 md:grid-cols-[0.18fr_0.82fr] md:gap-14 md:py-9"
              >
                <div className="text-[clamp(3rem,15vw,4rem)] font-light leading-none tracking-[-0.06em] text-black md:text-[clamp(3.6rem,5.5vw,5rem)]">
                  {item.number}
                </div>
                <div className="min-w-0 max-w-xl">
                  <h3 className="text-[1.3rem] font-bold leading-tight tracking-[-0.04em] text-black md:text-[1.55rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-full text-[0.98rem] font-medium leading-relaxed tracking-[-0.02em] text-[#4b5563] [overflow-wrap:anywhere] md:text-[1.08rem]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 overflow-hidden lg:hidden">
            <LawyerQuestionMarkPlaceholder src={problemVisualSrc} alt={problemVisualAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}

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
  showLawyerProblemSection?: boolean;
  doctorMockupItems?: DoctorMockupItem[];
  problemVisualSrc?: string;
  problemVisualAlt?: string;
  problemCopy?: ProblemSectionCopy;
  servicesCopy?: ServicesShowcaseCopy;
  faqItemsOverride?: FaqItem[];
  faqIntro?: string;
  contactTrackingCategory?: string;
  contactEventPrefix?: string;
};

export default function NewLandingSpinnerSection({
  statsHeading = "Sichtbarkeit wird erst wertvoll, wenn daraus Anfragen entstehen",
  statsItems = stats,
  showLawyerProblemSection = false,
  doctorMockupItems,
  problemVisualSrc,
  problemVisualAlt,
  problemCopy,
  servicesCopy,
  faqItemsOverride,
  faqIntro,
  contactTrackingCategory = "lawyer_contact",
  contactEventPrefix = "lawyer",
}: NewLandingSpinnerSectionProps = {}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSystemRevealVisible, setIsSystemRevealVisible] = useState(false);
  const systemRevealRef = useRef<HTMLElement | null>(null);
  const currentFaqItems = faqItemsOverride ?? (showLawyerProblemSection ? lawyerFaqItems : faqItems);
  const faqColumns = [
    currentFaqItems.filter((_, index) => index % 2 === 0),
    currentFaqItems.filter((_, index) => index % 2 === 1),
  ];

  useEffect(() => {
    if (!showLawyerProblemSection) return;

    const element = systemRevealRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSystemRevealVisible(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        rootMargin: "-8% 0px -8% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [showLawyerProblemSection]);

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

  const trackContactMethodClick = (eventName: string) => {
    if (typeof window === "undefined" || typeof (window as any).gtag !== "function") return;
    const normalizedEventName = eventName.replace(/^lawyer_/, `${contactEventPrefix}_`);

    (window as any).gtag("event", "conversion", {
      send_to: "AW-18170315805/uJ-SCL7h764cEJ2IpNhD",
      event_category: contactTrackingCategory,
      event_label: normalizedEventName,
    });
    (window as any).gtag("event", normalizedEventName, {
      event_category: contactTrackingCategory,
    });
  };

  return (
    <section
      className={
        showLawyerProblemSection
          ? "relative overflow-x-clip bg-transparent py-20 text-[#0e0e10] md:py-24"
          : "relative overflow-hidden bg-white px-6 py-20 text-[#0e0e10] md:px-12 md:py-24"
      }
    >
      {showLawyerProblemSection ? (
        <LawyerFixedSystemBackground visible={isSystemRevealVisible} />
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-none flex-col">
        <div
          className={
            showLawyerProblemSection
              ? "relative left-1/2 w-screen max-w-none -translate-x-1/2 bg-white px-6 md:px-12"
              : undefined
          }
        >
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
        </div>

        {showLawyerProblemSection ? (
          <>
            {doctorMockupItems?.length ? (
              <DoctorMockupShowcaseSection items={doctorMockupItems} />
            ) : (
              <LawyerHeroScrollSection />
            )}
            <LawyerProblemSection
              problemVisualSrc={problemVisualSrc}
              problemVisualAlt={problemVisualAlt}
              problemCopy={problemCopy}
            />
            <LawyerSystemRevealWindow revealRef={systemRevealRef} />
            <ServicesShowcaseSection copy={servicesCopy} />
          </>
        ) : null}

        <div
          id="portfolio"
          className={`flex min-h-screen w-screen max-w-none scroll-mt-10 flex-col justify-center self-center bg-white px-6 md:px-12 ${
            showLawyerProblemSection ? "mt-0 py-28" : "mt-28 py-20"
          }`}
        >
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

        {!showLawyerProblemSection ? <MainServicesAccordionSection /> : null}

        <section className="w-screen max-w-none self-center bg-white px-6 py-20 text-black md:px-12 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.28fr_0.72fr] lg:gap-20">
            <div className="lg:sticky lg:top-16 lg:self-start">
              <p className="mb-8 text-[1.05rem] font-medium tracking-[-0.025em] text-[#0e0e10]">
                <span className="mr-3 text-[#007aff]">→</span>
                Prozess
              </p>
              <h2 className="text-[clamp(3.5rem,6.7vw,7.3rem)] font-bold leading-[0.9] tracking-[-0.075em] text-black">
                Our
                <br />
                Process<span className="text-[#007aff]">.</span>
              </h2>
              <p className="mt-8 max-w-sm text-[1.02rem] font-medium leading-relaxed tracking-[-0.025em] text-[#6b7280]">
                Ein klarer Ablauf vom ersten Gespräch bis zum System, das langfristig für neue Anfragen arbeitet.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#007aff] px-9 text-[1rem] font-bold tracking-[-0.025em] text-white no-underline transition-transform hover:-translate-y-0.5"
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
                <a href="/" className="inline-flex text-[1.75rem] font-bold tracking-[-0.06em] text-black no-underline transition-opacity hover:opacity-70">
                  nüll<span className="text-[#007aff]">.</span>
                </a>
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
                {showLawyerProblemSection
                  ? faqIntro ?? "Kurze Antworten auf die Fragen, die vor einer Kanzlei-Website wirklich wichtig sind."
                  : "Kurze Antworten auf die Fragen, die vor einem Website-Projekt wirklich wichtig sind."}
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
                    const itemIndex = currentFaqItems.indexOf(item);

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

        <section id="contact" className="relative w-screen max-w-none self-center overflow-hidden bg-[#007aff] px-5 py-14 pb-[calc(4rem+env(safe-area-inset-bottom))] text-white sm:px-6 md:px-12 md:py-28">
          <div className="relative grid min-h-0 items-start gap-9 md:min-h-[75vh] md:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] md:items-center md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)]">
            <div className="min-w-0 max-w-4xl">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.28em] text-white/70 sm:text-[0.88rem] md:text-[0.92rem] md:tracking-[0.34em]">
                Kontakt
              </p>
              <h2 className="mt-6 max-w-4xl text-[clamp(2.35rem,11vw,3.65rem)] font-bold leading-[0.92] tracking-[-0.07em] text-white sm:text-[clamp(3.15rem,8vw,4.75rem)] md:mt-8 md:text-[clamp(3.65rem,5vw,5.85rem)] md:leading-[0.9] md:tracking-[-0.075em]">
                <span className="block">Lassen Sie uns</span>
                <span className="block">
                  etwas Starkes bauen<span className="text-white/45">.</span>
                </span>
              </h2>
              <p className="mt-5 max-w-[54rem] text-[clamp(1rem,4.25vw,1.22rem)] font-medium leading-relaxed tracking-[-0.035em] text-white/78 sm:max-w-[38rem] md:mt-8 md:max-w-[54rem] md:text-[clamp(1.1rem,1.45vw,1.42rem)]">
                Erzählen Sie uns kurz, wo Ihr Unternehmen gerade steht. Wir zeigen Ihnen, welche Website, SEO-Struktur, KI-Sichtbarkeit oder Google Ads Lösung wirklich sinnvoll ist.
              </p>

              <div className="mt-7 grid max-w-3xl grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-3 md:mt-8">
                {contactMethods.map(({ title, description, href, action, icon, Icon, eventName }) => (
                  <a
                    key={title}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    onClick={() => trackContactMethodClick(eventName)}
                    className={`group flex min-h-[7.25rem] min-w-0 flex-col justify-between rounded-[1.15rem] border border-white/18 bg-white/12 p-4 text-left text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0e0e10] sm:min-h-[8.25rem] sm:rounded-[1.35rem] ${
                      title === "Gmail" ? "min-[390px]:col-span-2 sm:col-span-1" : ""
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
                      <h3 className="text-[0.98rem] font-bold tracking-[-0.02em] sm:text-[1rem]">{title}</h3>
                      <p className="mt-1 text-[0.8rem] font-medium leading-snug text-white/70 transition-colors group-hover:text-[#6b7280] sm:text-[0.82rem]">
                        {description}
                      </p>
                      <span className="mt-3 block break-words text-[0.82rem] font-bold text-white transition-colors group-hover:text-[#007aff] sm:mt-4 sm:text-[0.84rem]">
                        {action}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[38rem] min-w-0 md:max-w-none md:-translate-x-6 xl:-translate-x-10">
              <MultistepForm
                className="w-full max-w-none"
                onSubmit={submitContactForm}
                showIntro={false}
              />
            </div>
          </div>
        </section>

        <div className="new-landing-footer w-screen max-w-none self-center bg-white text-[#0e0e10] [&_footer]:py-5 [&_footer]:md:py-5">
          <Footer />
        </div>

      </div>
    </section>
  );
}
