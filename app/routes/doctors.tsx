import { ChevronDown, Linkedin } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import NewLandingSpinnerSection from "../components/NewLandingSpinnerSection";
import doctorMockup1 from "../assets/service doctor mockups/1.webp";
import doctorMockup2 from "../assets/service doctor mockups/2.webp";
import doctorMockup3 from "../assets/service doctor mockups/3.webp";
import serviceAssetLogo from "../assets/services assets /Logo-card.webp";
import serviceAssetGoogleAds from "../assets/services assets /google ads-card.webp";
import serviceAssetGoogleAiSearch from "../assets/services assets /google ai search-card.webp";
import serviceAssetPhotoshoot from "../assets/services assets /photoshoot-card.webp";
import serviceAssetSeo from "../assets/services assets /seo-card.webp";
import serviceAssetSite from "../assets/services assets /site-card.webp";
import serviceAssetText from "../assets/services assets /text-card.webp";

const doctorMockups = [
  { src: doctorMockup1, alt: "Doctor website long-form mockup 1" },
  { src: doctorMockup2, alt: "Doctor website long-form mockup 2" },
  { src: doctorMockup3, alt: "Doctor website long-form mockup 3" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/n%C3%BCll/", label: "LinkedIn" },
];

export function meta() {
  const title = "Webdesign für Arztpraxen | Praxis-Website & SEO | nüll.";
  const description =
    "Moderne Praxis-Websites für Ärzte: Webdesign, lokale SEO, Google Ads und Terminführung für mehr Vertrauen, Sichtbarkeit und Patientenanfragen.";
  const url = "https://xn--nll-hoa.com/arztpraxis-websites";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "Webdesign Arztpraxis, Praxis Website erstellen, Website für Ärzte, SEO für Ärzte, SEO Arztpraxis, Praxis Website, Patienten gewinnen, Terminbuchung Arztpraxis",
    },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "nüll. logo on a minimal branded background" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "nüll. logo on a minimal branded background" },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

function DoctorNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.scrollY > 40) {
      event.preventDefault();
      setIsMobileMenuOpen(false);
      window.history.pushState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  return (
      <header className="fixed left-0 right-0 top-0 z-[100] flex w-full items-center justify-between border-b border-black/[0.06] bg-white px-3 py-5 font-sans text-[#111111] shadow-[0_16px_44px_rgba(20,30,45,0.06)] sm:px-7 md:px-14 md:py-7">
        <a
          href="/"
          onClick={handleLogoClick}
          className="text-[1.8rem] font-bold leading-none tracking-[-0.03em] text-[#0e0e10] no-underline"
        >
          nüll<span className="text-[#007aff]">.</span>
        </a>

        <nav className="hidden items-center gap-12 md:flex lg:gap-16">
          <a href="/blog" className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#111111] transition-opacity hover:opacity-55">
            Blog
          </a>
          <a href="#services" className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#111111] transition-opacity hover:opacity-55">
            Leistungen
          </a>
          <div className="group relative py-3">
            <button
              type="button"
              className="flex items-center gap-2 text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#111111] transition-opacity hover:opacity-55"
              aria-expanded="false"
            >
              Kategorien
              <ChevronDown aria-hidden="true" size={15} strokeWidth={3} />
            </button>
            <div className="pointer-events-none absolute right-0 top-full w-[18rem] pt-3 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-[8px] border border-[#0064df] bg-[#007aff] p-2 shadow-[0_18px_48px_rgba(0,74,173,0.22)]">
                {[
                  { label: "Anwälte & Berater", href: "/kanzlei-websites" },
                  { label: "Ärzte & Praxen", href: "/arztpraxis-websites" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between rounded-[6px] px-4 py-3 text-[0.82rem] font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#007aff]"
                  >
                    {link.label}
                    <span aria-hidden="true">&gt;</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#007aff] px-6 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white no-underline shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5"
          >
            Anfrage starten
          </a>
        </nav>

        <button
          type="button"
          className="flex min-h-11 min-w-11 flex-col items-end justify-center gap-1.5 md:hidden"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-7 bg-[#111111]" />
          <span className="block h-0.5 w-7 bg-[#111111]" />
          <span className="block h-0.5 w-5 bg-[#111111]" />
        </button>

        {isMobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-[calc(100%+1rem)] z-50 rounded-[8px] border border-black/10 bg-white p-2 shadow-[0_22px_60px_rgba(20,30,45,0.14)] md:hidden"
          >
            {[
              { label: "Blog", href: "/blog" },
              { label: "Leistungen", href: "#services" },
              { label: "Anwälte & Berater", href: "/kanzlei-websites" },
              { label: "Ärzte & Praxen", href: "/arztpraxis-websites" },
              { label: "Anfrage starten", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex min-h-12 items-center justify-between rounded-[6px] px-4 text-[0.78rem] font-black uppercase tracking-[0.16em] text-[#111111] no-underline transition-colors hover:bg-[#f2f7ff] hover:text-[#007aff]"
              >
                {link.label}
                <span aria-hidden="true">&gt;</span>
              </a>
            ))}
          </nav>
        )}
      </header>
  );
}

function DoctorHero() {
  return (
    <div className="relative flex h-auto min-h-0 w-full flex-col overflow-visible bg-white px-3 pb-12 pt-24 font-sans text-[#111111] sm:px-7 md:h-screen md:min-h-[680px] md:overflow-hidden md:px-14 md:pb-10 md:pt-28">
      <div className="relative z-10 grid min-w-0 flex-1 items-start gap-7 pt-7 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-8 md:pt-0 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="mx-auto w-full min-w-0 max-w-[42rem] text-center sm:mx-0 sm:text-left">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#2f6bff] sm:text-[0.78rem] sm:tracking-[0.22em]">
            Webdesign für Arztpraxen
          </p>

          <h1 className="mt-5 text-[clamp(2.3rem,9vw,2.85rem)] font-black leading-[1.05] tracking-[-0.078em] text-[#050505] sm:max-w-[14.5ch] sm:text-[clamp(2.35rem,5.05vw,4.85rem)] sm:leading-[0.96] md:text-[clamp(2.25rem,4.2vw,3.45rem)] lg:text-[clamp(2.65rem,5.05vw,4.85rem)] lg:leading-[0.94]">
            Hochwertige Praxis Websites für mehr Terminanfragen
          </h1>

          <p className="mt-6 text-[1.02rem] font-bold leading-[1.5] tracking-[-0.04em] text-[#101010] sm:max-w-[34rem] sm:text-[1.02rem] md:text-[1.04rem] md:leading-[1.38] lg:text-[1.18rem]">
            Moderne Präsentation, bessere Auffindbarkeit und klare Terminführung für Ihre Praxis.
          </p>

          <p className="mt-4 text-[1.02rem] font-bold leading-[1.5] tracking-[-0.04em] text-[#101010] sm:max-w-[33rem] sm:text-[1.02rem] md:text-[1rem] md:leading-[1.38] lg:text-[1.08rem]">
            Logo, Texte, Fotos, SEO, DSGVO und Betreuung sind inklusive.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:items-start md:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-12 w-full max-w-[17.5rem] items-center justify-center rounded-full bg-[#2f6bff] px-6 text-[0.78rem] font-black uppercase tracking-[0.13em] text-white no-underline shadow-[0_14px_34px_rgba(47,107,255,0.2)] transition-transform hover:-translate-y-0.5 sm:min-h-14 sm:w-auto sm:max-w-[22rem] sm:px-8 sm:text-[0.82rem]"
            >
              Kostenlose Analyse
            </a>
          </div>

          <div className="mt-7 flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[1.02rem] font-black tracking-[-0.035em] text-[#101010] sm:justify-start sm:text-[1.02rem] lg:gap-5 lg:text-[1.08rem]">
            <span className="whitespace-nowrap">In Zusammenarbeit mit</span>
            <img
              src="/assets/logo-mafinex.svg"
              alt="MAFINEX"
              className="h-8 w-36 object-contain md:h-9 md:w-40"
            />
            <img
              src="/assets/integrations/doctolib.png"
              alt="Doctolib"
              className="h-6 w-auto object-contain md:h-8 lg:ml-2"
            />
          </div>
        </div>

        <div className="relative flex min-h-[320px] min-w-0 items-end justify-center md:min-h-[520px] lg:min-h-[620px]">
          <img
            src="/assets/new-landing/doctor-team-cutout.webp"
            alt="Two doctors standing in white coats."
            className="w-full max-w-[25rem] object-contain drop-shadow-[0_28px_56px_rgba(20,30,45,0.1)] sm:max-w-[34rem] md:max-w-[46rem] md:translate-x-2 lg:max-w-[58rem] lg:translate-x-5"
          />
        </div>
      </div>

      <div className="relative z-20 flex items-center justify-between gap-4 text-black">
        <div className="hidden items-center gap-6 md:flex">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:bg-black hover:text-white"
            >
              <Icon size={19} strokeWidth={2.35} />
            </a>
          ))}
        </div>
        <a href="#services" className="text-[0.95rem] font-black no-underline underline-offset-8 hover:underline">
          Read More
        </a>
        <p className="hidden text-[0.95rem] font-black md:block">Mannheim, DE</p>
      </div>
    </div>
  );
}

function DoctorRiskFactorsSection() {
  const factors = [
    {
      number: "01",
      title: "Bei Google & ChatGPT kaum sichtbar",
      description:
        "Wenn Patienten Ihre Praxis online nicht finden, gewinnt die Praxis nebenan die Termine, die eigentlich Ihnen gehören.",
    },
    {
      number: "02",
      title: "Die Website schafft kein Vertrauen",
      description:
        "Patienten erkennen nicht sofort, warum Ihre Praxis die richtige Wahl ist. Der Auftritt wirkt austauschbar und unpersönlich.",
    },
    {
      number: "03",
      title: "Keine klaren Terminanfragen",
      description:
        "Der Weg zu Telefon, Formular, Online-Buchung oder Doctolib ist nicht eindeutig, und Anfragen bleiben aus.",
    },
    {
      number: "04",
      title: "Technisch & rechtlich riskant",
      description:
        "DSGVO, Barrierefreiheit und Ladezeit: Eine ungeprüfte Praxis-Website ist im Zweifel nicht rechtssicher.",
    },
  ];

  return (
    <section className="relative left-1/2 mt-16 w-screen max-w-none -translate-x-1/2 bg-white px-6 py-20 text-black md:mt-24 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-[#0e0e10] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white">
            Fakt ist …
          </span>
          <h2 className="mx-auto mt-8 max-w-3xl text-[clamp(1.95rem,4.6vw,3.35rem)] font-black leading-[1.05] tracking-[-0.04em] text-[#050505]">
            Die meisten Patienten suchen Ihre Praxis zuerst bei Google oder ChatGPT<span className="text-[#007aff]">.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] font-medium leading-relaxed tracking-[-0.01em] text-[#4f5560] md:text-[1.15rem]">
            Ihre Website entscheidet, ob aus dieser Suche eine Terminanfrage wird oder ob der
            Patient zur nächsten Praxis weiterklickt.
          </p>
          <p className="mt-9 text-[1.05rem] font-bold tracking-[-0.02em] text-[#050505] md:text-[1.18rem]">
            Das sind die 4 wichtigsten Risikofaktoren:
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {factors.map((factor) => (
            <article
              key={factor.number}
              className="relative overflow-hidden rounded-2xl border border-[#d7deea] bg-white p-7 shadow-[0_18px_40px_rgba(20,30,45,0.05)]"
            >
              <span className="pointer-events-none absolute -top-3 right-3 select-none text-[5.5rem] font-black leading-none text-[#eef2f8]">
                {factor.number}
              </span>
              <h3 className="relative mt-10 text-[1.08rem] font-bold leading-snug tracking-[-0.02em] text-[#007aff]">
                {factor.title}
              </h3>
              <p className="relative mt-3 text-[0.95rem] font-medium leading-relaxed tracking-[-0.01em] text-[#4f5560]">
                {factor.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DoctorsRoute() {
  const whatsappPrefilledMessage =
    "Hallo nüll, ich habe eure Praxis-Website-Seite gefunden und möchte wissen, ob ihr uns helfen könnt, unseren Praxis-Auftritt in mehr Terminanfragen zu verwandeln. Können wir kurz darüber schreiben?";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://xn--nll-hoa.com/arztpraxis-websites#service",
    name: "Webdesign für Arztpraxen",
    alternateName: "Praxis-Website und SEO für Ärzte",
    serviceType: "Webdesign, lokale SEO und Terminführung für Arztpraxen",
    provider: {
      "@type": "ProfessionalService",
      "@id": "https://xn--nll-hoa.com/#organization",
      name: "nüll.",
      url: "https://xn--nll-hoa.com/",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mannheim",
        addressCountry: "DE",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Deutschland",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Arztpraxen, Facharztpraxen, Zahnarztpraxen und medizinische Dienstleister",
    },
    url: "https://xn--nll-hoa.com/arztpraxis-websites",
    description:
      "Moderne Praxis-Websites mit klarer Struktur, lokaler Sichtbarkeit, Google Ads und Terminführung für mehr Patientenanfragen.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digitale Leistungen für Arztpraxen",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Praxis-Website erstellen",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Lokales SEO für Ärzte",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Google Ads für Praxen",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Terminführung und Online-Buchung",
          },
        },
      ],
    },
  };

  const doctorFaqItems = [
    {
      question: "Was kostet eine Praxis-Website mit SEO bei nüll?",
      answer:
        "Der Preis hängt vom Umfang der Praxis-Website ab. Eine professionelle Website startet bei 800 Euro. Dazu kommt eine monatliche Gebühr für Wartung und Hosting. Zusätzliche Leistungen wie laufende SEO-Betreuung, Google Ads, Content-Erstellung, Fotos oder separate Seiten für Fachgebiete und Behandlungen werden je nach Bedarf und Leistungsumfang geplant.",
    },
    {
      question: "Wie lange dauert ein Website-Projekt für Arztpraxen?",
      answer:
        "Ein typisches Praxis-Website-Projekt dauert bei uns etwa 2 bis 3 Wochen. Entscheidend sind Umfang, Feedback-Geschwindigkeit und ob Inhalte, Fotos, Vertrauenselemente, Leistungsseiten oder Terminwege wie Formular, Online-Buchung oder Doctolib neu aufgebaut werden müssen.",
    },
    {
      question: "Ist SEO für Praxen direkt in der Website-Erstellung enthalten?",
      answer:
        "Ja. Jede Praxis-Website erhält technische SEO-Grundlagen, eine saubere Seitenstruktur, Meta Titles, Meta Descriptions, Performance-Basics und Google-Indexierung. Wer monatliche Pakete bucht, kann zusätzlich lokale SEO, Content-Planung, Ratgeberinhalte, Behandlungsseiten und laufende SEO-Optimierung erhalten.",
    },
    {
      question: "Hilft nüll dabei, bei Google und in KI-Suchen für Behandlungen sichtbar zu werden?",
      answer:
        "Ja. Wir strukturieren Praxis-Websites so, dass sie für Google und KI-Systeme wie ChatGPT, Gemini, Perplexity und Claude besser verständlich sind. Dazu gehören klare Inhalte, saubere Seitenlogik, relevante Antworten zu Beschwerden, Behandlungen und Fachgebieten, lokale Signale und technische Grundlagen. Rankings können nie garantiert werden, aber die Website wird gezielt auf Sichtbarkeit und qualifizierte Terminanfragen vorbereitet.",
    },
    {
      question: "Erstellt nüll auch Texte, Fotos und Inhalte für Praxis-Websites?",
      answer:
        "Ja. Je nach Projekt übernehmen wir Copywriting, Content-Konzept, Fotoshootings, Videodrehs und visuelle Inhalte. Besonders für Arztpraxen, Fachärzte, Zahnärzte, Dermatologen und andere medizinische Anbieter hilft eigener Content dabei, Vertrauen aufzubauen, Leistungen verständlich zu erklären und professioneller aufzutreten.",
    },
    {
      question: "Übernimmt nüll Wartung, Hosting, SEO und Google Ads nach dem Launch?",
      answer:
        "Ja. Für jede Website gibt es eine monatliche Gebühr für Hosting und technische Wartung. Darüber hinaus können Praxen laufende SEO-Betreuung, Content-Updates und Google Ads Kampagnenmanagement buchen, wenn sie kontinuierlich sichtbarer werden und mehr Patientenanfragen gewinnen möchten.",
    },
    {
      question: "Für welche Praxen und medizinischen Anbieter eignet sich nüll?",
      answer:
        "nüll ist besonders passend für Arztpraxen, Facharztpraxen, Zahnarztpraxen, Privatpraxen, Therapieanbieter, Kliniken und medizinische Dienstleister in Deutschland. Der Fokus liegt auf Websites, die Kompetenz zeigen, Vertrauen schaffen und planbare Patientenanfragen oder Terminbuchungen auslösen.",
    },
    {
      question: "Gibt es eine Zufriedenheitsgarantie für Praxis-Website-Projekte?",
      answer:
        "Ja. Wenn ein Kunde in den ersten 30 Tagen merkt, dass die Zusammenarbeit nicht passt, bieten wir eine Geld-zurück-Garantie. Uns ist wichtig, dass die Zusammenarbeit mit Praxen transparent, professionell und für beide Seiten sinnvoll ist.",
    },
  ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: doctorFaqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main id="top" className="relative isolate bg-white">
      <DoctorNavbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <section className="relative z-0 h-auto md:h-[200vh]">
        <div className="relative z-0 h-auto overflow-visible bg-white md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <DoctorHero />
        </div>
      </section>
      <div className="relative z-20 mt-0 min-h-screen bg-white md:-mt-[100vh]">
        <NewLandingSpinnerSection
          showLawyerProblemSection
          contactTrackingCategory="doctor_contact"
          contactEventPrefix="doctor"
          whatsappPrefilledMessage={whatsappPrefilledMessage}
          doctorMockupItems={doctorMockups}
          problemSectionOverride={<DoctorRiskFactorsSection />}
          showSystemSection={false}
          servicesCopy={{
            heading: <>Alles, was aus Sichtbarkeit planbare Terminanfragen macht.</>,
            subheading:
              "Praxis-Branding, Website, SEO, Google Ads, KI-Sichtbarkeit und Betreuung: alles greift ineinander und bringt Ihrer Praxis messbar mehr Patientenanfragen.",
            ctaLabel: "Leistungen für Ihre Praxis besprechen",
            ctaHref: "#contact",
            cards: [
              {
                title: "Branding & Praxisauftritt",
                description:
                  "Wir entwickeln einen digitalen Auftritt, der Vertrauen schafft und Ihre Praxis klar positioniert, professionell, ruhig und medizinisch seriös.",
                visualSrc: serviceAssetLogo,
                visualAlt: "Branding und Praxisauftritt Vorschau",
              },
              {
                title: "Texte für Google & Patienten",
                description:
                  "Wir schreiben Inhalte, die Patienten verstehen und Suchmaschinen einordnen können: klar, relevant und auf echte Suchanfragen optimiert.",
                visualSrc: serviceAssetText,
                visualAlt: "Texte für Google und Patienten Vorschau",
              },
              {
                title: "Hochwertiges Praxis-Webdesign",
                description:
                  "Websites, die Kompetenz zeigen: modern, schnell und vertrauenswürdig. Für bessere Orientierung, mehr Anfragen und klare Terminwege.",
                visualSrc: serviceAssetSite,
                visualAlt: "Hochwertiges Praxis-Webdesign Vorschau",
              },
              {
                title: "Professionelles Praxis-Fotoshooting",
                description:
                  "Authentische Bilder von Praxis, Team und Räumen schaffen Vertrauen, noch bevor Patienten den ersten Termin buchen.",
                visualSrc: serviceAssetPhotoshoot,
                visualAlt: "Professionelles Praxis-Fotoshooting Vorschau",
              },
              {
                title: "Lokales SEO für Praxen",
                description:
                  "Wir verbessern Ihre Sichtbarkeit bei lokalen Suchanfragen zu Fachgebieten, Behandlungen, Beschwerden und Praxisleistungen.",
                visualSrc: serviceAssetSeo,
                visualAlt: "Lokales SEO für Praxen Vorschau",
              },
              {
                title: "KI-Sichtbarkeit / GEO",
                description:
                  "Wir strukturieren Ihre Inhalte so, dass Ihre Praxis auch in KI-Antworten besser verstanden und als relevante Quelle eingeordnet werden kann.",
                visualSrc: serviceAssetGoogleAiSearch,
                visualAlt: "KI-Sichtbarkeit und GEO Vorschau",
              },
              {
                title: "Google Ads für Praxen",
                description:
                  "Mehr qualifizierte Anfragen durch gezielte Kampagnen für Leistungen, Fachgebiete und lokale Patientensuchen.",
                visualSrc: serviceAssetGoogleAds,
                visualAlt: "Google Ads für Praxen Vorschau",
              },
              {
                title: "Terminführung & Automatisierung",
                description:
                  "Wir führen Patienten klar zu Telefon, Formular, Online-Buchung oder Doctolib und automatisieren Abläufe, wo es sinnvoll ist.",
                visual: "automation",
                visualAlt: "Terminführung und Automatisierung Vorschau",
              },
              {
                title: "Technik & Betreuung",
                description:
                  "Wir sorgen für eine schnelle, sichere und DSGVO-konforme Praxis-Website. Damit alles aktuell bleibt und zuverlässig funktioniert.",
                visual: "tech",
                visualAlt: "Technik und Betreuung Vorschau",
              },
            ],
          }}
          faqIntro="Kurze Antworten auf die Fragen, die vor einer Praxis-Website wirklich wichtig sind."
          faqItemsOverride={doctorFaqItems}
          statsHeading="Sichtbarkeit wird erst wertvoll, wenn daraus Terminanfragen entstehen"
          statsItems={[
            {
              value: 97,
              prefix: "+",
              suffix: "%",
              label: "Mehr Klicks",
              description:
                "Durch klare SEO-Struktur und Seiten nach echter Patientensuchintention.",
            },
            {
              value: 95,
              prefix: "+",
              suffix: "%",
              label: "Mehr Sichtbarkeit",
              description:
                "Bei lokalen Suchanfragen zu Behandlungen, Beschwerden und Fachgebieten.",
            },
            {
              customValue: "24/7",
              label: "Terminwege",
              description:
                "Online-Buchung, Formular und Kontaktmöglichkeiten bleiben jederzeit erreichbar.",
            },
            {
              customValue: "Klarere Wege",
              label: "Zur Buchung",
              description:
                "Patienten verstehen schneller, welche Leistung passt und wie sie Kontakt aufnehmen.",
            },
          ]}
        />
      </div>
    </main>
  );
}
