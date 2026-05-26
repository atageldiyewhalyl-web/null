import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import NewLandingSpinnerSection from "../components/NewLandingSpinnerSection";
import { MinimalistHero } from "../components/ui/minimalist-hero";
import doctorVisualAsset from "../assets/Doctor visual asset.webp";
import doctorMockup1 from "../assets/service doctor mockups/1.webp";
import doctorMockup2 from "../assets/service doctor mockups/2.webp";
import doctorMockup3 from "../assets/service doctor mockups/3.webp";
import doctorMockup4 from "../assets/service doctor mockups/4.webp";
import doctorMockup5 from "../assets/service doctor mockups/5.webp";
import doctorMockup6 from "../assets/service doctor mockups/6.webp";
import doctorMockup7 from "../assets/service doctor mockups/7.webp";
import doctorMockup8 from "../assets/service doctor mockups/8.webp";
import doctorMockup9 from "../assets/service doctor mockups/9.webp";
import doctorScatterAsset from "../assets/scatter for doctor  1.webp";
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
  { src: doctorMockup4, alt: "Doctor website long-form mockup 4" },
  { src: doctorMockup5, alt: "Doctor website long-form mockup 5" },
  { src: doctorMockup6, alt: "Doctor website long-form mockup 6" },
  { src: doctorMockup7, alt: "Doctor website long-form mockup 7" },
  { src: doctorMockup8, alt: "Doctor website long-form mockup 8" },
  { src: doctorMockup9, alt: "Doctor website long-form mockup 9" },
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

export default function DoctorsRoute() {
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

  return (
    <main className="relative isolate bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="relative z-0 h-[200vh]">
        <div className="sticky top-0 z-0 h-screen overflow-hidden bg-white">
          <MinimalistHero
            logoText="nüll."
            navLinks={[
              { label: "Blog", href: "/blog" },
              { label: "Kontakt", href: "#contact" },
              { label: "Leistungen", href: "#services" },
            ]}
            categoryLinks={[
              { label: "Anwälte & Berater", href: "/kanzlei-websites" },
              { label: "Ärzte & Praxen", href: "/arztpraxis-websites" },
            ]}
            mainText="Moderne Websites für Arztpraxen, die sichtbar machen, Vertrauen schaffen und Termine bringen."
            readMoreLink="#services"
            imageSrc={doctorVisualAsset}
            imageAlt="Doctor visual asset over a blue circle."
            imageClassName="max-w-none"
            imageStyle={{
              width: "clamp(20.5rem, 38vw, 46rem)",
              marginLeft: "-6.5rem",
              marginTop: "-1rem",
            }}
            overlayText={{
              part1: "gefunden werden.",
              part2: "termine gewinnen.",
            }}
            overlayTextClassName="text-[clamp(2.25rem,9.6vw,3rem)] md:text-[clamp(3.35rem,4.75vw,5.35rem)]"
            socialLinks={[
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Linkedin, href: "https://www.linkedin.com/company/n%C3%BCll/", label: "LinkedIn" },
            ]}
            locationText="Mannheim, DE"
          />
        </div>
      </section>
      <div className="relative z-20 -mt-[100vh] min-h-screen bg-white">
        <NewLandingSpinnerSection
          showLawyerProblemSection
          contactTrackingCategory="doctor_contact"
          contactEventPrefix="doctor"
          doctorMockupItems={doctorMockups}
          problemVisualSrc={doctorScatterAsset}
          problemVisualAlt="Doctor website preview scatter"
          problemCopy={{
            sideText: (
              <>
                Viele Praxen sind online auffindbar,
                <br />
                aber nicht klar genug,
                <br />
                um Patienten zur Anfrage zu führen.
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
                <span className="block">Terminanfragen werden<span className="text-[#007aff]">.</span></span>
              </>
            ),
            items: [
              {
                number: "01",
                title: "Unklare Spezialisierung",
                description:
                  "Patienten verstehen nicht sofort, für welche Beschwerden, Behandlungen oder Fachgebiete Ihre Praxis der richtige Ansprechpartner ist.",
              },
              {
                number: "02",
                title: "Zu wenig Suchintention",
                description:
                  "Die Seiten orientieren sich nicht an den Fragen, die Patienten tatsächlich bei Google eingeben.",
              },
              {
                number: "03",
                title: "Schwache Terminführung",
                description:
                  "Der Weg zu Telefon, Formular, Online-Buchung oder Doctolib ist nicht klar genug aufgebaut.",
              },
            ],
          }}
          servicesCopy={{
            heading: <>Alles, was aus Sichtbarkeit planbare Terminanfragen macht.</>,
            subheading:
              "Praxis-Branding, Website, SEO, Google Ads, KI-Sichtbarkeit und Betreuung: alles greift ineinander und bringt Ihrer Praxis messbar mehr Patientenanfragen.",
            cards: [
              {
                title: "Branding & Praxisauftritt",
                description:
                  "Wir entwickeln einen digitalen Auftritt, der Vertrauen schafft und Ihre Praxis klar positioniert — professionell, ruhig und medizinisch seriös.",
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
                  "Authentische Bilder von Praxis, Team und Räumen schaffen Vertrauen — noch bevor Patienten den ersten Termin buchen.",
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
                  "Wir führen Patienten klar zu Telefon, Formular, Online-Buchung oder Doctolib — und automatisieren Abläufe, wo es sinnvoll ist.",
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
          faqItemsOverride={[
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
          ]}
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
