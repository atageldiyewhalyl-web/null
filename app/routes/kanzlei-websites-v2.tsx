import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import hasanWebsite from "../assets/Dogru kanzlei/Dogru kanzlei new.webp";
import hasanGoogleAds from "../assets/Dogru kanzlei/Google credibility.webp";
import hasanSearchConsole from "../assets/Dogru kanzlei/Credibility.webp";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import {
  getContactGoogleAdsConversion,
  googleAdsConversionSendTo,
  trackGaEvent,
  trackGoogleAdsConversion,
} from "../utils/tracking";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;
const whatsappMessage =
  "Hallo%20n%C3%BCll%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Kanzlei-Website%20und%20m%C3%B6chte%20eine%20kostenlose%20Analyse%20anfragen.";
const whatsappHref = `https://wa.me/4915256569852?text=${whatsappMessage}`;

export function meta() {
  const title = "Kanzlei-Websites V2 | Mehr Mandatsanfragen | nüll.";
  const description =
    "Conversion-first Kanzlei-Websites mit SEO-Struktur, Google Ads Tracking, DSGVO und Anfrageführung. Mit Hasan Doğru Case Study und MAFINEX Mannheim.";
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
    { tagName: "link", rel: "canonical", href: url },
  ];
}

const trustItems = [
  "In Zusammenarbeit mit MAFINEX Mannheim",
  "Hasan Doğru Case Study",
  "SEO + Google Ads vorbereitet",
  "30 Tage Zufriedenheitsgarantie",
];

const serviceItems = [
  "Strategie und Kanzlei-Positionierung",
  "Texte für Google, KI und Mandanten",
  "Modernes Webdesign mit klarer Anfrageführung",
  "Technisches SEO und schnelle Ladezeiten",
  "Google Ads Tracking und Conversion Events",
  "DSGVO, Impressum, Cookie-Basics und Betreuung",
];

const diagnosisItems = [
  {
    title: "Der Klick passt, aber die Website beweist zu wenig.",
    text: "Viele Kanzlei-Seiten wirken seriös, zeigen aber zu spät, warum genau diese Kanzlei der richtige Ansprechpartner ist.",
  },
  {
    title: "Mandanten finden keine klare nächste Handlung.",
    text: "Telefon, WhatsApp, Formular und Beratung müssen sofort sichtbar sein. Sonst bleibt aus Interesse kein Erstkontakt.",
  },
  {
    title: "Google Ads braucht eine Seite, die Vertrauen sofort aufbaut.",
    text: "Paid Search Besucher vergleichen schnell. Proof, Spezialisierung und Risikoabbau müssen vor dem Scrollen sichtbar sein.",
  },
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function KanzleiWebsitesV2Route() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  const trackContact = (eventName: string) => {
    const conversion = getContactGoogleAdsConversion(eventName);
    if (conversion) {
      trackGoogleAdsConversion(conversion, {
        event_category: "kanzlei_v2_contact",
        event_label: eventName,
      });
    }

    trackGaEvent(eventName, {
      event_category: "kanzlei_v2_contact",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const firm = String(form.get("firm") || "");
    const phone = String(form.get("phone") || "");
    const email = String(form.get("email") || "");
    const websiteUrl = String(form.get("websiteUrl") || "");
    const message = String(form.get("message") || "");

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          name,
          firm,
          phone,
          email,
          websiteUrl,
          message,
          practiceArea: "Kanzlei V2 Analyse",
          hasWebsite: websiteUrl ? "yes" : "unknown",
          packageName: "Kostenlose Kanzlei-Analyse",
          source: "KANZLEI_WEBSITES_V2",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || data.error?.description || "Submission failed");
      }

      setSubmitState("success");
      trackGoogleAdsConversion(googleAdsConversionSendTo.formSubmit, {
        event_category: "kanzlei_v2_contact",
      });
    } catch (err: unknown) {
      setSubmitState("error");
      setError(err instanceof Error ? err.message : "Die Anfrage konnte gerade nicht gesendet werden.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#08080a]">
      <section className="relative overflow-hidden px-5 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-[1440px] flex-col rounded-[2rem] border border-black/10 bg-[#fbfbfd] shadow-[0_24px_90px_rgba(0,0,0,0.08)]">
          <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
            <a href="/" className="text-[1.65rem] font-black tracking-tight text-[#101014] no-underline">
              nüll<span className="text-[#007aff]">.</span>
            </a>
            <nav className="hidden items-center gap-8 text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#111] md:flex">
              <a href="#proof" className="transition-opacity hover:opacity-55">Case Study</a>
              <a href="#services" className="transition-opacity hover:opacity-55">Leistungen</a>
              <a href="#contact" className="transition-opacity hover:opacity-55">Kontakt</a>
            </nav>
            <a
              href="#contact"
              onClick={() => trackGaEvent("kanzlei_v2_header_cta", { event_category: "kanzlei_v2_contact" })}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#007aff] px-5 text-[0.72rem] font-black uppercase tracking-[0.14em] text-white no-underline shadow-[0_16px_38px_rgba(0,122,255,0.22)]"
            >
              Analyse sichern
            </a>
          </header>

          <div className="grid flex-1 items-center gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:pb-16 lg:pt-12">
            <div className="max-w-3xl">
              <p className="text-[0.78rem] font-black uppercase tracking-[0.22em] text-[#007aff]">
                Webdesign für Kanzleien
              </p>
              <h1 className="mt-6 text-[clamp(2.7rem,7.5vw,6.8rem)] font-black leading-[0.9] tracking-tight text-[#070707]">
                Kanzlei-Websites, die aus Google-Klicks echte Mandatsanfragen machen.
              </h1>
              <p className="mt-7 max-w-2xl text-[1.08rem] font-medium leading-8 text-[#4f535d] sm:text-[1.18rem]">
                Website, Texte, SEO-Struktur, Google Ads Tracking, DSGVO und Betreuung aus einer Hand.
                Klar aufgebaut, schnell live und auf Vertrauen im ersten Moment ausgelegt.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="inline-flex min-h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                  <img src="/assets/logo-mafinex.svg" alt="MAFINEX Mannheim" className="h-6 w-24 object-contain object-left" />
                  <span className="text-[0.76rem] font-black uppercase tracking-[0.1em] text-[#171719]">
                    In Zusammenarbeit
                  </span>
                </div>
                <div className="inline-flex min-h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#007aff]" strokeWidth={2.4} />
                  <span className="text-[0.76rem] font-black uppercase tracking-[0.1em] text-[#171719]">
                    Hasan Doğru Case Study
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  onClick={() => trackGaEvent("kanzlei_v2_primary_cta", { event_category: "kanzlei_v2_contact" })}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white no-underline shadow-[0_18px_42px_rgba(0,122,255,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  Kostenlose Kanzlei-Analyse
                  <ArrowRight size={18} strokeWidth={2.5} />
                </a>
                <a
                  href={whatsappHref}
                  onClick={() => trackContact("kanzlei_v2_whatsapp_click")}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-[#111] no-underline shadow-[0_14px_32px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                  WhatsApp schreiben
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {trustItems.map((item, index) => (
                  <div key={item} className="flex min-h-14 items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                    {index === 0 ? <img src="/assets/logo-mafinex.svg" alt="MAFINEX Mannheim" className="h-6 w-24 object-contain object-left" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-[#007aff]" strokeWidth={2.4} />}
                    <span className="text-[0.82rem] font-bold leading-5 text-[#171719]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#007aff]/10 blur-3xl" />
              <div className="absolute -bottom-12 left-4 h-40 w-40 rounded-full bg-black/5 blur-3xl" />

              <div className="relative rounded-[2rem] border border-black/10 bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                <div className="overflow-hidden rounded-[1.45rem] bg-[#0d2a1e]">
                  <img
                    src={hasanWebsite}
                    alt="Hasan Doğru Kanzlei website preview"
                    className="aspect-[1.42/1] w-full object-cover object-top"
                  />
                </div>
                <div className="absolute -left-4 top-8 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.12)] sm:-left-8">
                  <p className="text-[1.6rem] font-black tracking-tight">188</p>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Klicks</p>
                </div>
                <div className="absolute -right-3 bottom-24 rounded-2xl border border-black/10 bg-[#007aff] px-4 py-3 text-white shadow-[0_18px_45px_rgba(0,122,255,0.25)] sm:-right-6">
                  <p className="text-[1.6rem] font-black tracking-tight">32,5</p>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/78">Conversions</p>
                </div>
                <div className="absolute bottom-4 left-1/2 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/94 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur">
                  <div>
                    <p className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Case Study</p>
                    <p className="text-[1rem] font-black text-[#101014]">Hasan Doğru Kanzlei</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.15rem] font-black text-[#101014]">4,11 EUR</p>
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">pro Conversion</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <img src={hasanGoogleAds} alt="Hasan Doğru Google Ads proof" className="h-28 w-full rounded-2xl border border-black/10 object-cover object-left-top shadow-sm" />
                <img src={hasanSearchConsole} alt="Hasan Doğru Search Console proof" className="h-28 w-full rounded-2xl border border-black/10 object-cover object-left-top shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="px-5 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-4">
          {[
            ["Nische", "Kanzleien, Anwälte und Berater"],
            ["Proof", "Hasan Doğru als echter Kanzlei-Case"],
            ["Partner", "In Zusammenarbeit mit MAFINEX Mannheim"],
            ["System", "Website, SEO, Ads und Tracking zusammen"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.4rem] border border-black/10 bg-[#fbfbfd] p-5">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#007aff]">{label}</p>
              <p className="mt-3 text-[1rem] font-black leading-6 text-[#101014]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <p className="text-[0.78rem] font-black uppercase tracking-[0.22em] text-[#007aff]">Diagnose</p>
            <h2 className="mt-4 text-[clamp(2rem,5vw,4.8rem)] font-black leading-[0.95] tracking-tight">
              Warum aus Klicks oft keine Mandatsanfragen werden.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {diagnosisItems.map((item, index) => (
              <article key={item.title} className="rounded-[1.6rem] border border-black/10 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#007aff] text-sm font-black text-white">
                  0{index + 1}
                </span>
                <h3 className="mt-6 text-[1.35rem] font-black leading-7">{item.title}</h3>
                <p className="mt-4 text-[0.98rem] leading-7 text-[#5b5f66]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#08080a] px-5 py-16 text-white sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[0.78rem] font-black uppercase tracking-[0.22em] text-[#70b7ff]">Inklusive</p>
            <h2 className="mt-4 text-[clamp(2rem,4.6vw,4.4rem)] font-black leading-[0.95] tracking-tight">
              Nicht nur Design. Ein Anfrage-System für Kanzleien.
            </h2>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-8 text-white/68">
              Der erste Eindruck, die Suchstruktur, der rechtliche Rahmen und die Kontaktwege greifen zusammen.
              Genau dort verlieren viele Kampagnen ihr Geld.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceItems.map((item, index) => {
              const icons = [Sparkles, Search, TrendingUp, BadgeCheck, ShieldCheck, Star];
              const Icon = icons[index];
              return (
                <div key={item} className="flex gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-5">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-[#70b7ff]" strokeWidth={2.4} />
                  <p className="text-[0.98rem] font-bold leading-6 text-white/88">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-8 rounded-[2rem] bg-[#007aff] p-5 text-white sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div>
            <p className="text-[0.78rem] font-black uppercase tracking-[0.22em] text-white/70">Kostenlose Analyse</p>
            <h2 className="mt-4 text-[clamp(2rem,4.8vw,4.6rem)] font-black leading-[0.95] tracking-tight">
              Lassen Sie uns prüfen, wo Ihre Kanzlei gerade Anfragen verliert.
            </h2>
            <p className="mt-6 max-w-xl text-[1.04rem] leading-8 text-white/76">
              Schicken Sie uns Ihre aktuelle Website. Wir zeigen Ihnen, welche 3 Änderungen den größten Einfluss auf
              Vertrauen, Sichtbarkeit und Anfrageführung haben.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <a href={whatsappHref} onClick={() => trackContact("kanzlei_v2_whatsapp_click")} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 font-black text-[#101014] no-underline">
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a href="tel:+4915256569852" onClick={() => trackContact("kanzlei_v2_phone_click")} className="flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-4 font-black text-white no-underline">
                <Phone size={20} />
                +49 1525 6569852
              </a>
              <a href="mailto:info@nüll.com" onClick={() => trackContact("kanzlei_v2_email_click")} className="flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-4 font-black text-white no-underline">
                <Mail size={20} />
                info@nüll.com
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[1.6rem] bg-white p-5 text-[#101014] shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Name</span>
                <input name="name" required className="mt-2 h-12 w-full rounded-2xl bg-[#f4f5f7] px-4 font-semibold outline-none focus:ring-2 focus:ring-[#007aff]/30" />
              </label>
              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Kanzlei</span>
                <input name="firm" required className="mt-2 h-12 w-full rounded-2xl bg-[#f4f5f7] px-4 font-semibold outline-none focus:ring-2 focus:ring-[#007aff]/30" />
              </label>
              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Telefon</span>
                <input name="phone" required type="tel" className="mt-2 h-12 w-full rounded-2xl bg-[#f4f5f7] px-4 font-semibold outline-none focus:ring-2 focus:ring-[#007aff]/30" />
              </label>
              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">E-Mail</span>
                <input name="email" required type="email" className="mt-2 h-12 w-full rounded-2xl bg-[#f4f5f7] px-4 font-semibold outline-none focus:ring-2 focus:ring-[#007aff]/30" />
              </label>
            </div>
            <label className="mt-3 block">
              <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Aktuelle Website</span>
              <input name="websiteUrl" type="url" placeholder="https://" className="mt-2 h-12 w-full rounded-2xl bg-[#f4f5f7] px-4 font-semibold outline-none focus:ring-2 focus:ring-[#007aff]/30" />
            </label>
            <label className="mt-3 block">
              <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#6d7178]">Was soll besser werden?</span>
              <textarea name="message" rows={4} className="mt-2 w-full resize-none rounded-2xl bg-[#f4f5f7] px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#007aff]/30" />
            </label>
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#101014] px-6 text-[0.82rem] font-black uppercase tracking-[0.12em] text-white transition-opacity disabled:opacity-60"
            >
              {submitState === "submitting" ? "Wird gesendet..." : "Analyse anfragen"}
              <ArrowRight size={18} />
            </button>
            {submitState === "success" && (
              <p className="mt-4 rounded-2xl bg-[#e8f7ee] px-4 py-3 text-sm font-bold text-[#176232]">
                Danke. Wir melden uns mit den nächsten Schritten.
              </p>
            )}
            {submitState === "error" && (
              <p className="mt-4 rounded-2xl bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#8a1f1f]">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="px-5 pb-10 text-[#6d7178] sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-4 border-t border-black/10 pt-8 text-sm font-bold sm:flex-row">
          <span>nüll. - Kanzlei-Websites V2</span>
          <span className="inline-flex items-center gap-2"><MapPin size={16} /> Mannheim, DE</span>
        </div>
      </footer>
    </main>
  );
}
