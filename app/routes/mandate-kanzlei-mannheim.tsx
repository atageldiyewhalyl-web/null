import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { ArrowDown, ArrowRight, CalendarCheck, Check, Phone, Plus } from "lucide-react";
import MultistepForm, { type MultistepFormData } from "@/components/ui/multistep-form";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  getContactGoogleAdsConversion,
  googleAdsConversionSendTo,
  trackGaEvent,
  trackGoogleAdsConversion,
} from "@/utils/tracking";
import heroBgWide from "../assets/hero-bg-wide.webp";
import heroBgPortrait from "../assets/hero-bg-portrait.webp";
import hasanDemo from "../assets/Hasan Hero Demo.webp";
import dogruGoogleAdsProof from "../assets/Dogru kanzlei/Google credibility.webp";
import dogruGscProof from "../assets/Dogru kanzlei/Credibility.webp";
import sysSichtbarkeit from "../assets/sys-1-sichtbarkeit.webp";
import sysVertrauen from "../assets/sys-2-vertrauen.webp";
import sysMandatsanfrage from "../assets/sys-3-mandatsanfrage.webp";
const calLink =
  import.meta.env.VITE_KANZLEI_CAL_LINK || "null-kanzlei/kostenloses-erstgesprach";
const calNamespace = "kostenloses-erstgesprach";

const contactFormSections = [
  {
    id: "contact",
    deTitle: "Kontakt",
    questions: [
      { id: "name", de: "Name" },
      { id: "businessName", de: "Kanzleiname" },
      { id: "phone", de: "Telefonnummer" },
      { id: "email", de: "E-Mail" },
      { id: "city", de: "Stadt" },
    ],
  },
  {
    id: "services",
    deTitle: "Ziele",
    questions: [{ id: "selectedServices", de: "Welche Ziele verfolgen wir?" }],
  },
  {
    id: "final",
    deTitle: "Kontext",
    questions: [
      { id: "websiteUrl", de: "Aktuelle Website-URL (falls vorhanden)" },
      { id: "biggestChallenge", de: "Was ist Ihre größte Herausforderung?" },
    ],
  },
];

const contactFormServiceLabels: Record<string, string> = {
  "professional-website": "Neue professionelle Website",
  seo: "Google Sichtbarkeit (SEO)",
  geo: "KI-Suche Sichtbarkeit (GEO)",
  "google-ads": "Google Ads Kampagnen-Management",
  "meta-ads": "Meta Ads (Instagram & Facebook)",
  "lead-system": "Digitales Lead-System",
};

const buildContactFormAnswers = (data: MultistepFormData) => ({
  "contact.name": data.name,
  "contact.businessName": data.businessName,
  "contact.phone": data.phone,
  "contact.email": data.email,
  "contact.city": data.city,
  "services.selectedServices": data.services
    .map((service) => contactFormServiceLabels[service] ?? service)
    .join(", "),
  "final.websiteUrl": data.websiteUrl || "Keine Website angegeben",
  "final.biggestChallenge": data.biggestChallenge,
});

const proofStats = [
  { value: "107K", label: "Impressionen für Doğru Kanzlei" },
  { value: "1,85K", label: "organische Klicks aus Google" },
  { value: "111", label: "eingegangene Mandatsanfragen" },
  { value: "8,15 €", label: "pro Anfrage über Google Ads" },
];

const systemSteps = [
  {
    step: "01",
    tag: "Sichtbarkeit",
    title: "Oben stehen, wenn jemand sucht",
    body: "Lokale SEO und Google/Meta-Anzeigen bringen Ihre Kanzlei nach vorne – für Ihre Rechtsgebiete und Ihre Stadt.",
    image: sysSichtbarkeit,
    alt: "Smartphone mit einem Kanzlei-Suchergebnis auf Platz eins",
  },
  {
    step: "02",
    tag: "Vertrauen",
    title: "Eine Website, die zur Anfrage führt",
    body: "Klarer Auftritt, klare Rechtsgebiete, klarer nächster Schritt – statt einer Seite von 2016.",
    image: sysVertrauen,
    alt: "Aufgeräumte Kanzlei-Website mit klarem Call-to-Action",
  },
  {
    step: "03",
    tag: "Mandatsanfrage",
    title: "Anfragen landen gebündelt bei Ihnen",
    body: "Per Formular, Anruf oder WhatsApp – nachverfolgt und messbar. Sie bearbeiten, den Rest übernehmen wir.",
    image: sysMandatsanfrage,
    alt: "Eingehende Anfragen, die in einen Kalender fließen",
  },
];

const faqItems = [
  {
    question: "Was kostet das Mandatssystem?",
    answer:
      "Das System startet ab 400 € pro Monat. Der genaue Umfang hängt davon ab, ob zuerst Landingpage, Website, SEO-Struktur, Ads oder Content priorisiert werden.",
  },
  {
    question: "Was bedeutet der kostenlose erste Monat?",
    answer:
      "Der erste Monat ist der Testlauf. Wir bauen die erste Version der Anfrage-Strecke, starten die priorisierten Maßnahmen und prüfen, ob qualifizierte Mandatsanfragen entstehen.",
  },
  {
    question: "Was gilt als qualifizierte Mandatsanfrage?",
    answer:
      "Eine Anfrage ist qualifiziert, wenn sie von einer realen Person mit erkennbarem rechtlichem Anliegen kommt und grundsätzlich zu den vereinbarten Rechtsgebieten passt.",
  },
  {
    question: "Funktioniert das für jedes Rechtsgebiet?",
    answer:
      "Nein. Wir priorisieren Rechtsgebiete mit klarer Nachfrage, lokaler Suchintention und glaubwürdigem Kanzlei-Profil. Genau das wird im Erstgespräch geprüft.",
  },
];

const trackLandingEvent = (eventName: string) => {
  trackGaEvent(eventName, { event_category: "kanzlei_meta_landing" });
};

const trackContactClick = (eventName: string) => {
  const conversion = getContactGoogleAdsConversion(eventName);

  if (conversion) {
    trackGoogleAdsConversion(conversion, {
      event_category: "kanzlei_meta_landing",
      event_label: eventName,
    });
  }

  trackLandingEvent(eventName);
};

export function meta() {
  const title = "15 qualifizierte Mandatsanfragen in 30 Tagen | nüll.";
  const description =
    "Mandatssystem fuer Kanzleien in Mannheim: Website, SEO und Social Ads ab 400 EUR pro Monat. Erster Monat kostenlos, Walk-away-Garantie.";
  const url = "https://xn--nll-hoa.com/mandate-kanzlei-mannheim";
  const image = "https://xn--nll-hoa.com/og-image.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function KanzleiMetaAdsLandingRoute() {
  const [lead, setLead] = useState<MultistepFormData | null>(null);

  const submitContactForm = async (data: MultistepFormData) => {
    setLead(data);

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
          formData: {
            ...data,
            foundFrom: "Meta Ads Landingpage Mannheim Kanzleien",
          },
          answers: buildContactFormAnswers(data),
          sections: contactFormSections,
          onboardingType: "kanzlei-meta-ads-landing",
        }),
      },
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(
        result.error ? String(result.error) : `Submission failed with status ${response.status}`,
      );
    }

    trackGoogleAdsConversion(googleAdsConversionSendTo.formSubmit);
    trackLandingEvent("kanzlei_meta_form_submit");
    trackLandingEvent("kanzlei_meta_calendly_reveal");
  };

  const form = (
    <MultistepForm
      className="w-full max-w-none"
      hiddenSteps={["source"]}
      onSubmit={submitContactForm}
      showIntro={false}
      successContent={<CalBookingPanel lead={lead} />}
    />
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-white font-sans text-[#0b0b0c] antialiased">
      {/* ==================== HERO — blue, form first ==================== */}
      <section id="anfrage" className="relative isolate overflow-hidden bg-[#3797EE] text-white">
        <picture>
          <source media="(min-width: 900px)" srcSet={heroBgWide} />
          <img
            src={heroBgPortrait}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom lg:object-[right_center]"
            loading="eager"
          />
        </picture>
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-[#3797EE] to-transparent" />
        <div aria-hidden className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-[#3797EE] via-[#3797EE]/85 to-[#3797EE]/30 lg:block" />

        <div className="mx-auto w-full max-w-lg px-5 pb-12 pt-5 lg:max-w-6xl lg:px-8 lg:pb-20 lg:pt-7">
          <div className="flex items-center justify-between">
            <p className="text-[1.55rem] font-black leading-none tracking-[-0.06em] text-white lg:text-[1.75rem]">
              nüll<span className="text-white/50">.</span>
            </p>
            <a
              href="tel:+4915256569852"
              onClick={() => trackContactClick("kanzlei_meta_phone_click")}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[0.8rem] font-bold text-[#3797EE] no-underline lg:h-11 lg:px-5 lg:text-[0.85rem]"
              aria-label="nüll telefonisch kontaktieren"
            >
              <Phone size={14} />
              Anrufen
            </a>
          </div>

          <div className="lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(26rem,34rem)] lg:items-start lg:gap-14">
            <div className="lg:pt-6">
              <p className="mt-8 text-[0.66rem] font-black uppercase tracking-[0.18em] text-white/70 lg:mt-0 lg:text-[0.72rem] lg:tracking-[0.22em]">
                Für Kanzleien in Mannheim &amp; Heidelberg
              </p>
              <h1
                lang="de"
                className="mt-3 text-[clamp(2.05rem,8.5vw,2.9rem)] font-black leading-[1.02] tracking-[-0.04em] [text-wrap:balance] lg:mt-4 lg:text-[3.5rem] lg:leading-[1]"
              >
                15 qualifizierte Mandats&shy;anfragen in 30&nbsp;Tagen.
                <span className="mt-2 block lg:mt-3">
                  <span className="bg-white px-2 py-0.5 text-[#3797EE] lg:px-3">Garantiert.</span>
                </span>
              </h1>
              <p className="mt-4 max-w-md text-[0.98rem] font-medium leading-relaxed text-white/90 lg:mt-6 lg:text-[1.05rem]">
                Der erste Monat ist kostenlos. Keine qualifizierten Anfragen – Sie steigen
                ohne Risiko wieder aus.
              </p>
              <p className="mt-4 text-[0.85rem] font-semibold text-white/85 lg:mt-6 lg:text-[0.95rem]">
                <span className="font-black text-white">ab 400&nbsp;€ / Monat</span>
                {" · "}Website · SEO · Social Ads
              </p>
              <p className="mt-4 hidden text-[0.9rem] font-semibold text-white/80 lg:block">
                Doğru Kanzlei: <span className="font-black text-white">111 Mandatsanfragen</span> in 30 Tagen ·{" "}
                <span className="font-black text-white">8,15 €</span> pro Anfrage
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-white text-[#0b0b0c] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.4)] lg:mt-0">
              <div className="border-b border-[#eef0f3] px-5 pb-3 pt-4 lg:px-6 lg:pt-5">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#3797EE]">
                  In 60 Sekunden zur Anfrage
                </p>
                <p className="mt-1 text-[0.9rem] font-semibold text-[#5b6472]">
                  Kurz qualifizieren, danach Termin direkt im Kalender buchen.
                </p>
              </div>
              <div className="p-3 sm:p-4">{form}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROOF — black band ==================== */}
      <section className="bg-[#0b0b0c] text-white">
        <div className="mx-auto max-w-lg px-5 py-12 lg:max-w-6xl lg:px-8 lg:py-16">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#3797EE]">
            Belegbar · Kanzlei in Mannheim
          </p>
          <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-8 lg:mt-10 lg:grid-cols-4 lg:gap-8">
            {proofStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[1.9rem] font-black leading-none tracking-[-0.04em] text-[#3797EE] lg:text-[2.6rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.8rem] font-semibold leading-snug text-white/70 lg:mt-3 lg:text-[0.85rem]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DAS MANDATSSYSTEM ==================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-lg px-5 py-14 lg:max-w-6xl lg:px-8 lg:py-24">
          <div className="lg:max-w-3xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#3797EE]">
              Das Mandatssystem
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,7vw,2.4rem)] font-black leading-[1.06] tracking-[-0.035em] lg:mt-4 lg:text-[2.9rem]">
              Ein System aus drei Teilen – nicht fünf lose Einzelkäufe.
            </h2>
            <p className="mt-4 text-[0.98rem] font-medium leading-relaxed text-[#4b5565] lg:mt-5 lg:text-[1.05rem]">
              Google fängt den Mandanten, der jetzt aktiv sucht. Instagram und Facebook bauen
              die Bekanntheit auf. Eine Website, die konvertiert, macht daraus eine Anfrage.
              nüll baut und betreibt alle drei Teile.
            </p>
          </div>

          <ol className="mt-10 space-y-3 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
            {systemSteps.map((s, index) => (
              <li key={s.tag}>
                <article className="h-full overflow-hidden rounded-2xl border border-[#e6e9ef] lg:flex lg:flex-col">
                  <div className="bg-[#3797EE]/[0.07] p-4">
                    <img
                      src={s.image}
                      alt={s.alt}
                      className="w-full rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 lg:flex-1">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[1.6rem] font-black leading-none tracking-[-0.04em] text-[#3797EE]/30 tabular-nums">
                        {s.step}
                      </span>
                      <span className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#3797EE]">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[1.15rem] font-black leading-snug tracking-[-0.02em]">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[0.92rem] font-medium leading-relaxed text-[#5b6472]">
                      {s.body}
                    </p>
                  </div>
                </article>
                {index < systemSteps.length - 1 && (
                  <div className="flex justify-center py-2 lg:hidden">
                    <ArrowDown className="h-5 w-5 text-[#3797EE]" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================== DER FALL — blue ==================== */}
      <section className="bg-[#3797EE] text-white">
        <div className="mx-auto max-w-lg px-5 py-14 lg:max-w-6xl lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-white/70">
              Der Fall · Doğru Kanzlei
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,7vw,2.4rem)] font-black leading-[1.06] tracking-[-0.035em] lg:mt-4 lg:text-[2.9rem]">
              Aus einer Kanzlei-Website wurde ein Anfrage-Kanal.
            </h2>
            <p className="mt-4 text-[0.96rem] font-medium leading-relaxed text-white/90 lg:mt-5 lg:text-[1.05rem]">
              Dieselbe Strecke – Positionierung, lokale SEO, Google- und Meta-Anzeigen,
              klare Anfragewege – für eine Kanzlei in Mannheim.
            </p>
          </div>

          <div className="mt-8 space-y-3 lg:mt-0 lg:space-y-4">
            <div className="rounded-2xl bg-white p-3">
              <img src={hasanDemo} alt="Doğru Kanzlei Website auf Laptop und Smartphone" className="w-full" loading="lazy" />
            </div>
            <div className="rounded-2xl bg-white p-3">
              <img src={dogruGscProof} alt="Google Search Console Ergebnis für Doğru Kanzlei" className="w-full rounded-lg" loading="lazy" />
            </div>
            <div className="rounded-2xl bg-white p-3">
              <img src={dogruGoogleAdsProof} alt="Google Ads Ergebnis für Doğru Kanzlei" className="w-full rounded-lg" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DER ERSTE MONAT ==================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-lg px-5 py-14 lg:max-w-5xl lg:px-8 lg:py-24">
          <div className="lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#3797EE]">
                Der erste Monat
              </p>
              <h2 className="mt-3 text-[clamp(1.8rem,7vw,2.4rem)] font-black leading-[1.06] tracking-[-0.035em] lg:mt-4 lg:text-[2.9rem]">
                Wir testen nicht Ihr Vertrauen. Wir testen das System.
              </h2>
              <a
                href="#anfrage"
                onClick={() => trackLandingEvent("kanzlei_meta_month_cta_click")}
                className="mt-8 hidden h-[3.25rem] items-center justify-center rounded-full bg-[#3797EE] px-7 text-[0.95rem] font-bold text-white no-underline lg:inline-flex"
              >
                Anfrage starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            <ul className="mt-8 space-y-3 lg:mt-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {[
                "Der erste Monat ist kostenlos.",
                "Wir priorisieren die gewinnbaren Rechtsgebiete und Anfragen.",
                "Wir bauen oder schärfen die erste Anfrage-Strecke.",
                "Entstehen keine qualifizierten Anfragen, steigen Sie ohne Risiko aus.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-l-2 border-[#3797EE] bg-[#3797EE]/[0.05] py-3 pl-4 pr-3 text-[0.96rem] font-semibold leading-snug text-[#242b38]"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#3797EE]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#anfrage"
            onClick={() => trackLandingEvent("kanzlei_meta_month_cta_click")}
            className="mt-8 inline-flex h-[3.25rem] w-full items-center justify-center rounded-full bg-[#3797EE] px-6 text-[0.95rem] font-bold text-white no-underline lg:hidden"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="bg-[#f4f5f7]">
        <div className="mx-auto max-w-lg px-5 py-14 lg:max-w-5xl lg:grid lg:grid-cols-[0.65fr_1fr] lg:items-start lg:gap-14 lg:px-8 lg:py-24">
          <div className="lg:sticky lg:top-12">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#3797EE]">
              Fragen
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,7vw,2.4rem)] font-black leading-[1.06] tracking-[-0.035em] lg:mt-4 lg:text-[2.9rem]">
              Was vor dem Termin wichtig ist.
            </h2>
          </div>
          <div className="mt-8 divide-y divide-[#dfe3ea] border-y border-[#dfe3ea] lg:mt-0">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-4 lg:py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.98rem] font-bold tracking-[-0.01em] lg:text-[1.05rem]">
                  {item.question}
                  <Plus className="h-5 w-5 shrink-0 text-[#3797EE] transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-[0.94rem] font-medium leading-relaxed text-[#5b6472] lg:text-[1rem]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== Sticky CTA (mobile / tablet) ==================== */}
      <div className="sticky bottom-0 z-40 border-t border-[#e6e9ef] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <a
          href="#anfrage"
          onClick={() => trackLandingEvent("kanzlei_meta_sticky_cta_click")}
          className="flex h-[3.25rem] items-center justify-center rounded-full bg-[#3797EE] text-[0.9rem] font-bold text-white no-underline"
        >
          Jetzt Anfrage starten
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </main>
  );
}

function CalBookingPanel({ lead }: { lead: MultistepFormData | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const cal = await getCalApi({ namespace: calNamespace });
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: { light: { "cal-brand": "#3797EE" } },
      });
    })();
  }, []);

  const notes = lead
    ? [
        lead.businessName && `Kanzlei: ${lead.businessName}`,
        lead.city && `Ort: ${lead.city}`,
        lead.services.length &&
          `Ziele: ${lead.services.map((s) => contactFormServiceLabels[s] ?? s).join(", ")}`,
        lead.websiteUrl && `Website: ${lead.websiteUrl}`,
        lead.biggestChallenge && `Herausforderung: ${lead.biggestChallenge}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6e9ef] bg-white text-[#0b0b0c] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.2)]">
      <div className="p-6 md:p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3797EE]/10 text-[#3797EE]">
          <CalendarCheck className="h-7 w-7" />
        </div>
        <h3 className="text-[clamp(1.5rem,4vw,2.1rem)] font-black leading-tight tracking-[-0.035em]">
          Anfrage erhalten. Wählen Sie jetzt Ihren Termin.
        </h3>
        <p className="mt-3 text-[0.98rem] font-medium leading-relaxed text-[#5b6472]">
          Ihre Angaben sind angekommen. Suchen Sie sich unten einen Termin für das
          kostenlose Erstgespräch aus.
        </p>
      </div>
      <div className="min-h-[640px] border-t border-[#e6e9ef] bg-[#f6f7f9]">
        {mounted ? (
          <Cal
            namespace={calNamespace}
            calLink={calLink}
            style={{ width: "100%", height: "100%", minHeight: "640px", overflow: "scroll" }}
            config={{
              layout: "month_view",
              theme: "light",
              locale: "de",
              name: lead?.name ?? "",
              email: lead?.email ?? "",
              attendeePhoneNumber: lead?.phone ?? "",
              notes,
            }}
          />
        ) : (
          <div className="flex h-[640px] items-center justify-center text-[0.9rem] font-semibold text-[#8e97a5]">
            Kalender wird geladen …
          </div>
        )}
      </div>
    </div>
  );
}
