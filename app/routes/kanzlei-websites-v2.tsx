import { ChevronDown, Linkedin } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import NewLandingSpinnerSection, { workItems } from "../components/NewLandingSpinnerSection";

const lawyerFeatured = ["Dogru Kanzlei", "B.Y. Consulting"];
const lawyerFirstWorkItems = [
  ...lawyerFeatured
    .map((name) => workItems.find((item) => item.title === name))
    .filter((item): item is (typeof workItems)[number] => Boolean(item)),
  ...workItems.filter((item) => !lawyerFeatured.includes(item.title)),
];

export function meta() {
  const title = "Kanzlei-Websites V2 | Mehr Mandatsanfragen | nüll.";
  const description =
    "Conversion-first Kanzlei-Websites mit klarer Anfrageführung, SEO-Struktur und vertrauenswürdigem Kanzlei-Auftritt.";
  const url = "https://xn--nll-hoa.com/kanzlei-websites-v2";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, follow" },
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

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/n%C3%BCll/", label: "LinkedIn" },
];

function KanzleiV2Navbar() {
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

function KanzleiV2Hero() {
  return (
    <div className="relative flex h-auto min-h-0 w-full flex-col overflow-visible bg-white px-3 pb-12 pt-24 font-sans text-[#111111] sm:px-7 md:h-screen md:min-h-[680px] md:overflow-hidden md:px-14 md:pb-10 md:pt-28">
      <div className="relative z-10 grid min-w-0 flex-1 items-start gap-3 pt-5 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-7 md:pt-0 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
        <div className="mx-auto w-full min-w-0 max-w-[calc(100vw-1.5rem)] text-center sm:mx-0 sm:max-w-[42rem] sm:text-left">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#2f6bff] sm:text-[0.78rem] sm:tracking-[0.22em]">
            Webdesign für Rechtsanwälte
          </p>

          <h1 className="mt-3 text-[clamp(2.35rem,9.4vw,2.95rem)] font-black leading-[1.0] tracking-[-0.078em] text-[#050505] min-[430px]:text-[clamp(2.5rem,8.8vw,3.25rem)] sm:mt-5 sm:max-w-[14.5ch] sm:text-[clamp(2.35rem,5.05vw,4.85rem)] sm:leading-[0.96] md:text-[clamp(2.25rem,4.2vw,3.45rem)] lg:text-[clamp(2.65rem,5.05vw,4.85rem)] lg:leading-[0.94]">
            Hochwertige Kanzlei Websites für mehr Mandatsanfragen
          </h1>

          <p className="mt-4 text-[1.02rem] font-bold leading-[1.45] tracking-[-0.04em] text-[#101010] sm:mt-6 sm:max-w-[34rem] sm:text-[1.02rem] md:text-[1.04rem] md:leading-[1.38] lg:text-[1.18rem]">
            Moderne Präsentation, bessere Auffindbarkeit und klare Anfrageführung für Ihre Kanzlei.
          </p>

          <p className="mt-3 text-[1.02rem] font-bold leading-[1.45] tracking-[-0.04em] text-[#101010] sm:mt-4 sm:max-w-[33rem] md:text-[1rem] md:leading-[1.38] lg:text-[1.08rem]">
            Logo, Texte, Fotos, SEO, DSGVO und Betreuung sind inklusive.
          </p>

          <div className="mt-6 flex w-full justify-center sm:max-w-none sm:justify-start sm:items-start md:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#2f6bff] px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.09em] text-white no-underline shadow-[0_14px_34px_rgba(47,107,255,0.2)] transition-transform hover:-translate-y-0.5 min-[430px]:text-[0.68rem] sm:min-h-14 sm:w-auto sm:max-w-[22rem] sm:px-8 sm:text-[0.82rem]"
            >
              Kostenlose Analyse
            </a>
          </div>

          <div className="mt-5 flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.95rem] font-black tracking-[-0.035em] text-[#101010] sm:mt-7 sm:justify-start sm:gap-3 sm:text-[1.02rem] lg:gap-5 lg:text-[1.08rem]">
            <span className="whitespace-nowrap">In Zusammenarbeit mit</span>
            <img
              src="/assets/logo-mafinex.svg"
              alt="MAFINEX"
              className="h-7 w-32 object-contain sm:h-8 sm:w-36 md:h-9 md:w-40"
            />
            <img
              src="/assets/integrations/anwalt-de.webp"
              alt="anwalt.de"
              className="h-6 w-auto object-contain md:h-8 lg:ml-2"
            />
          </div>
        </div>

        <div className="relative flex min-h-[300px] min-w-0 items-end justify-center md:min-h-[430px] lg:min-h-[540px]">
          <img
            src="/assets/new-landing/lawyer-team-cutout.webp"
            alt="Three lawyers in formal suits."
            className="w-full max-w-[21rem] object-contain drop-shadow-[0_28px_56px_rgba(20,30,45,0.12)] min-[430px]:max-w-[24rem] sm:max-w-[36rem] md:max-w-[47rem] md:translate-x-3 lg:max-w-[60rem] lg:translate-x-6"
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

type KanzleiWebsitesV2PageProps = {
  serviceUrl?: string;
};

function KanzleiRiskFactorsSection() {
  const factors = [
    {
      number: "01",
      title: "Bei Google & ChatGPT kaum sichtbar",
      description:
        "Wenn Mandanten Ihre Kanzlei online nicht finden, gewinnt die Kanzlei nebenan die Mandate, die eigentlich Ihnen gehören.",
    },
    {
      number: "02",
      title: "Die Website schafft kein Vertrauen",
      description:
        "Mandanten erkennen nicht sofort, warum Ihre Kanzlei die richtige Wahl ist. Der Auftritt wirkt austauschbar und unpersönlich.",
    },
    {
      number: "03",
      title: "Keine klaren Mandatsanfragen",
      description:
        "Der Weg zu Telefon, Kontaktformular oder Erstberatung ist nicht eindeutig, und Anfragen bleiben aus.",
    },
    {
      number: "04",
      title: "Technisch & rechtlich riskant",
      description:
        "DSGVO, Barrierefreiheit und Ladezeit: Eine ungeprüfte Kanzlei-Website ist im Zweifel nicht rechtssicher.",
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
            Die meisten Mandanten suchen ihre Kanzlei zuerst bei Google oder ChatGPT<span className="text-[#007aff]">.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] font-medium leading-relaxed tracking-[-0.01em] text-[#4f5560] md:text-[1.15rem]">
            Ihre Website entscheidet, ob aus dieser Suche eine Mandatsanfrage wird oder ob der
            Mandant zur nächsten Kanzlei weiterklickt.
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

export function KanzleiWebsitesV2Page({
  serviceUrl = "https://xn--nll-hoa.com/kanzlei-websites-v2",
}: KanzleiWebsitesV2PageProps) {
  const whatsappPrefilledMessage =
    "Hallo nüll, ich habe eure Kanzlei-Website-Seite gefunden und möchte wissen, ob ihr uns helfen könnt, unseren Kanzlei-Auftritt in mehr Mandatsanfragen zu verwandeln. Können wir kurz darüber schreiben?";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: "Kanzlei-Websites für Anwälte und Berater",
    serviceType: "Webdesign und SEO für Kanzleien",
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
    url: serviceUrl,
    description:
      "Moderne Kanzlei-Websites mit klarer Struktur, lokaler Sichtbarkeit und Fokus auf Mandatsanfragen.",
  };

  return (
    <main id="top" className="relative isolate bg-white">
      <KanzleiV2Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="relative z-0 h-auto md:h-[200vh]">
        <div className="relative z-0 h-auto overflow-visible bg-white md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <KanzleiV2Hero />
        </div>
      </section>
      <div className="relative z-20 mt-0 min-h-screen bg-white md:-mt-[100vh]">
        <NewLandingSpinnerSection
          compactStats
          showLawyerProblemSection
          showSystemSection={false}
          problemSectionOverride={<KanzleiRiskFactorsSection />}
          workItemsOverride={lawyerFirstWorkItems}
          statsHeading="Sichtbarkeit wird erst wertvoll, wenn daraus Mandatsanfragen entstehen"
          statsCtaLabel="Kostenlose Kanzlei-Analyse sichern"
          statsCtaHref="#contact"
          statsCtaEventName="lawyer_results_cta"
          whatsappPrefilledMessage={whatsappPrefilledMessage}
          statsItems={[
            {
              value: 97,
              suffix: "%",
              label: "Mehr Klicks",
              description:
                "Durch klare SEO Struktur und Seiten nach echter Suchintention.",
            },
            {
              value: 95,
              suffix: "%",
              label: "Mehr Impressionen",
              description:
                "Mehr Sichtbarkeit bei relevanten Suchanfragen rund um Rechtsgebiete.",
            },
            {
              value: 6000,
              prefix: "€",
              suffix: "+",
              label: "Mandatswert durch eine Seite",
              description:
                "Eine gezielte Einstiegsseite kann konkrete Anfragen auslösen.",
            },
            {
              customValue: "Klarere Wege",
              label: "Zur Anfrage",
              description:
                "Besucher verstehen schneller, warum sie Kontakt aufnehmen sollten.",
            },
          ]}
        />
      </div>
    </main>
  );
}

export default function KanzleiWebsitesV2Route() {
  return <KanzleiWebsitesV2Page />;
}
