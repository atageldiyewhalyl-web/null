import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, CheckCheck, Loader2, Mail, Phone } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { trackGaEvent } from "../../utils/tracking";

/*
 * /check-flyer: landing page for the QR code on the printed flyers ("Kostenloser Website-Check & Angebot").
 * One short form (website, e-mail, name, company, optional biggest challenge, mobile number, consent) is sent to the
 * make-server-ea5edff4 edge function (/flyer-check). It answers at once; the same check as /website-check runs in the
 * background and the report is e-mailed to the visitor. Nobody waits on screen (Halyl's decision, 28 Nov 2026): right
 * after sending, the page confirms the e-mail and shows the WhatsApp step ("Angebot") without scrolling.
 * ?f=allgemein | ?f=handwerk tells which flyer the scan came from (stored with the lead).
 * CONSENT_TEXT must stay identical to FLYER_CONSENT_TEXT in supabase/functions/make-server-ea5edff4/flyer_check.ts.
 */

const API = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/flyer-check`;
const WA_NUMBER = "4915256569852";
const PHONE_DISPLAY = "01525 6569852";
const CONSENT_TEXT =
  "Ich bin einverstanden, dass nüll. meine Angaben speichert und mich zu meinem Website-Check und einem Angebot per E-Mail, Telefon oder WhatsApp kontaktiert. Widerruf jederzeit möglich.";
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

// Every business nüll. has built for (logos from the reference pages, public/assets/v2/referenzen/<slug>/logo.png)
const CLIENTS = [
  { k: "treu", name: "Treu Haustechnik" },
  { k: "herkules", name: "Herkules Umzüge" },
  { k: "waschbar", name: "Waschbar" },
  { k: "dogru", name: "Kanzlei Doğru" },
  { k: "goeren", name: "Kanzlei Meral Gören" },
  { k: "entruemplerhelden", name: "Die Entrümplerhelden" },
  { k: "orchidee", name: "Pflegedienst Orchidee" },
  { k: "sg", name: "SG Laserzentrum" },
  { k: "ft", name: "FT Sicherheitstechnik" },
  { k: "onkel", name: "Onkel Abwassertechnik" },
  { k: "by", name: "B.Y. Consulting" },
  { k: "bergstone", name: "Bergstone Keramiksan" },
  { k: "so", name: "S&O Beauty" },
];

const inputCls = (bad = false) =>
  `h-14 w-full rounded-[14px] border bg-white px-4 text-[1.05rem] text-[#0e0e10] outline-none transition placeholder:text-[#a3a3ab] focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/15 disabled:bg-[#f4f4f6] disabled:text-[#a3a3ab] ${bad ? "border-[#d70015]" : "border-[#dcdce2]"}`;

function Field({ label, error, children }: { label: ReactNode; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.92rem] font-semibold text-[#0e0e10]">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[0.88rem] font-medium text-[#d70015]">{error}</span>}
    </label>
  );
}

function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return <img src="/assets/v2/logos/whatsapp.svg" alt="" className={className} style={{ filter: "brightness(0) invert(1)" }} />;
}

function WhatsAppCta({ text, source }: { text: string; source: string }) {
  const time = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  return (
    <section className="mt-7 border-t-2 border-[#0e0e10] pt-6">
      <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[#1a9f4b]">Dein Angebot</p>
      <h2 className="mt-1.5 text-[1.85rem] font-extrabold leading-[1.04] tracking-[-0.05em] text-[#0e0e10]">
        Schreib uns jetzt auf WhatsApp<span className="text-[#25d366]">.</span>
      </h2>
      <p className="mt-2 text-[0.98rem] leading-relaxed text-[#4a4a52]">Die Nachricht ist schon geschrieben. Tipp auf Senden, wir melden uns persönlich.</p>

      <div className="mt-4 ml-auto max-w-[94%] rounded-[16px] rounded-tr-[4px] bg-[#d9fdd3] px-4 pb-2 pt-3 text-[0.93rem] leading-snug text-[#111b21] shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]" aria-label="Vorschau deiner Nachricht">
        {text}
        <span className="mt-1 flex items-center justify-end gap-1 text-[0.7rem] text-[#667781]">
          {time} <CheckCheck size={15} className="text-[#53bdeb]" aria-hidden />
        </span>
      </div>

      <a
        href={waLink(text)}
        target="_blank"
        rel="noopener"
        onClick={() => trackGaEvent("flyer_whatsapp_click", { flyer: source || "unbekannt" })}
        className="mt-5 flex min-h-[62px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#25d366] px-5 text-[1.05rem] font-extrabold tracking-[-0.01em] text-white transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="h-6 w-6" />
        Angebot per WhatsApp holen
      </a>

      <p className="mt-3.5 text-center text-[0.86rem] font-semibold text-[#6e6e76]">Kostenlos · Unverbindlich · Persönlich</p>
      <p className="mt-5 text-center text-[0.95rem] text-[#6e6e76]">
        Lieber anrufen?{" "}
        <a href={`tel:+${WA_NUMBER}`} className="inline-flex items-center gap-1.5 font-bold text-[#0e0e10] underline underline-offset-4">
          <Phone size={15} aria-hidden /> {PHONE_DISPLAY}
        </a>
      </p>
    </section>
  );
}

export default function FlyerCheck() {
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [challenge, setChallenge] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failMsg, setFailMsg] = useState("");
  const [step, setStep] = useState<"form" | "sending" | "sent">("form");

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("f") ?? "";
    setSource(["allgemein", "handwerk"].includes(f) ? f : "");
  }, []);

  useEffect(() => {
    if (step === "sent") window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const host = (() => {
    try {
      return new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`).hostname.replace(/^www\./, "");
    } catch {
      return url.trim();
    }
  })();

  const challengeText = challenge.trim().replace(/[.!\s]+$/, "");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!noWebsite && !/\.[a-z]{2,}/i.test(url.trim())) errs.url = "Bitte gib deine Website-Adresse ein, z. B. meinbetrieb.de";
    if (!EMAIL_RE.test(email.trim())) errs.email = "Bitte gib deine E-Mail-Adresse ein.";
    if (name.trim().length < 2) errs.name = "Bitte gib deinen Namen ein.";
    if (company.trim().length < 2) errs.company = "Bitte gib den Namen deines Betriebs ein.";
    if (phone.replace(/\D/g, "").length < 7) errs.phone = "Bitte gib deine Handynummer ein.";
    if (!consent) errs.consent = "Bitte bestätige kurz, dass wir dich kontaktieren dürfen.";
    setErrors(errs);
    setFailMsg("");
    if (Object.keys(errs).length) return;

    setStep("sending");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          url: noWebsite ? "" : url.trim(),
          noWebsite,
          email: email.trim(),
          name: name.trim(),
          company: company.trim(),
          phone: phone.trim(),
          challenge: challengeText,
          consent,
          source,
          website: honey,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const map: Record<string, string> = {
          invalid_url: "Diese Website-Adresse können wir nicht prüfen. Stimmt die Schreibweise?",
          invalid_phone: "Diese Telefonnummer sieht nicht richtig aus.",
          invalid_email: "Diese E-Mail-Adresse sieht nicht richtig aus.",
          email_disposable: "Bitte nutze deine echte E-Mail-Adresse, an Wegwerf-Adressen schicken wir keinen Report.",
          email_domain: "An diese E-Mail-Adresse können wir nichts schicken. Stimmt die Schreibweise?",
          rate_limited: "Von hier kamen heute schon viele Checks. Schreib uns einfach direkt auf WhatsApp.",
        };
        setFailMsg(map[data.error] ?? "Da ist etwas schiefgegangen. Versuch es noch einmal oder schreib uns direkt auf WhatsApp.");
        setStep("form");
        return;
      }
      trackGaEvent("flyer_check_submit", { flyer: source || "unbekannt", has_website: noWebsite ? "nein" : "ja" });
      setStep("sent");
    } catch {
      setFailMsg("Keine Verbindung. Prüf dein Internet und versuch es noch einmal.");
      setStep("form");
    }
  }

  const first = name.trim().split(/\s+/)[0] || "";
  const intro = `Hallo nüll., ich bin ${name.trim()} von ${company.trim()}.`;
  const challengeLine = challengeText ? ` Meine größte Herausforderung gerade: ${challengeText}.` : "";
  const waText = noWebsite
    ? `${intro} Wir haben noch keine Website und möchten ein Angebot.${challengeLine}`
    : `${intro} Ich habe gerade den Website-Check für ${host} gemacht und möchte ein Angebot.${challengeLine}`;

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans text-[#0e0e10]">
      <header className="mx-auto flex max-w-[560px] items-center justify-between px-5 pt-6">
        <a href="/" className="text-[1.6rem] font-bold tracking-[-0.04em]">
          nüll<span className="text-[#007aff]">.</span>
        </a>
        <span className="rounded-full border border-[#dcdce2] bg-white px-3 py-1 text-[0.78rem] font-bold text-[#6e6e76]">Kostenlos</span>
      </header>

      <main className="mx-auto max-w-[560px] px-5 pb-16 pt-7">
        {step !== "sent" ? (
          <>
            <h1 className="text-center text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-[2.8rem]">
              Kostenloser Website-Check <span className="text-[#007aff]">&amp; Angebot.</span>
            </h1>
            <p className="mt-3 text-center text-[1.08rem] leading-relaxed text-[#4a4a52]">
              Deine Note von 0 bis 100 und die drei wichtigsten Baustellen bekommst du per E-Mail. Dein Angebot direkt per WhatsApp.
            </p>

            <form onSubmit={submit} noValidate className="mt-7 space-y-4 rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_48px_-24px_rgba(15,23,42,0.25)] sm:p-7">
              <Field label="Deine Website" error={errors.url}>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={noWebsite}
                  placeholder="meinbetrieb.de"
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  className={inputCls(!!errors.url)}
                />
              </Field>
              <label className="-mt-1 flex items-center gap-2.5 text-[0.95rem] text-[#4a4a52]">
                <input type="checkbox" checked={noWebsite} onChange={(e) => { setNoWebsite(e.target.checked); setErrors((x) => ({ ...x, url: "" })); }} className="h-5 w-5 accent-[#007aff]" />
                Ich habe noch keine Website
              </label>
              <Field label={<>Deine E-Mail <span className="font-normal text-[#a3a3ab]">(dorthin schicken wir den Report)</span></>} error={errors.email}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@betrieb.de" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" className={inputCls(!!errors.email)} />
              </Field>
              <Field label="Dein Name" error={errors.name}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vor- und Nachname" autoComplete="name" className={inputCls(!!errors.name)} />
              </Field>
              <Field label="Name deines Betriebs" error={errors.company}>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="z. B. Müller Haustechnik" autoComplete="organization" className={inputCls(!!errors.company)} />
              </Field>
              <label className="block">
                <span className="mb-1.5 block text-[0.92rem] font-semibold text-[#0e0e10]">
                  Was ist gerade deine größte Herausforderung? <span className="font-normal text-[#a3a3ab]">(optional)</span>
                </span>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="z. B. zu wenig Anfragen, keine Zeit für Marketing …"
                  maxLength={280}
                  rows={3}
                  className="w-full resize-none rounded-[14px] border border-[#dcdce2] bg-white px-4 py-3 text-[1.05rem] text-[#0e0e10] outline-none transition placeholder:text-[#a3a3ab] focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/15"
                />
              </label>
              <Field label="Handynummer (für WhatsApp)" error={errors.phone}>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0151 23456789" type="tel" inputMode="tel" autoComplete="tel" className={inputCls(!!errors.phone)} />
              </Field>
              <input value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />
              <label className="flex items-start gap-3 pt-1 text-[0.88rem] leading-snug text-[#4a4a52]">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-[#007aff]" />
                <span>
                  {CONSENT_TEXT} Mehr in der <a href="/datenschutz" target="_blank" rel="noopener" className="font-semibold text-[#007aff] underline underline-offset-2">Datenschutzerklärung</a>.
                </span>
              </label>
              {errors.consent && <p className="text-[0.88rem] font-medium text-[#d70015]">{errors.consent}</p>}
              {failMsg && <p className="rounded-[12px] bg-[#fff2f2] px-4 py-3 text-[0.95rem] font-medium text-[#a1000f]" role="alert">{failMsg}</p>}
              <button
                type="submit"
                disabled={step === "sending"}
                className="mt-2 flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#007aff] px-6 text-[1.05rem] font-extrabold tracking-[-0.01em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.25)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
              >
                {step === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
                {noWebsite ? "Angebot anfragen" : "Website-Check starten"}
                {step === "sending" ? null : <ArrowRight className="h-5 w-5" aria-hidden />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[0.95rem] font-semibold text-[#4a4a52]">0 € Monatsgebühr, bis deine erste Anfrage kommt.</p>
              <div className="flyer-marquee relative mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-label="Betriebe, für die wir gebaut haben">
                <div className="flyer-marquee-track flex w-max items-center gap-10">
                  {[...CLIENTS, ...CLIENTS].map((c, i) => (
                    <img key={`${c.k}-${i}`} src={`/assets/v2/referenzen/${c.k}/logo.png`} alt={i < CLIENTS.length ? c.name : ""} aria-hidden={i >= CLIENTS.length} className="h-8 w-auto max-w-[110px] flex-none object-contain opacity-60 grayscale" />
                  ))}
                </div>
                <style>{`.flyer-marquee-track{animation:flyer-marquee 38s linear infinite}@keyframes flyer-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.flyer-marquee-track{animation:none}}`}</style>
              </div>
            </div>
          </>
        ) : (
          <div aria-live="polite">
            <section>
              <p className="flex items-center gap-2 text-[0.92rem] font-bold text-[#1a9f4b]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1a9f4b] text-white">
                  <Check size={12} strokeWidth={3.5} aria-hidden />
                </span>
                {noWebsite ? "Anfrage ist bei uns" : "Website-Check läuft"}
              </p>
              {noWebsite ? (
                <>
                  <p className="mt-2.5 text-[1.55rem] font-extrabold leading-[1.08] tracking-[-0.045em]">Danke{first ? `, ${first}` : ""}. Deine Anfrage ist bei uns.</p>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[#4a4a52]">Am schnellsten geht es per WhatsApp, dann bekommst du dein Angebot direkt.</p>
                </>
              ) : (
                <>
                  <p className="mt-2.5 text-[1.55rem] font-extrabold leading-[1.08] tracking-[-0.045em]">{first ? `${first}, dein` : "Dein"} Report kommt per E-Mail.</p>
                  <p className="mt-2 flex items-start gap-2 text-[0.98rem] leading-relaxed text-[#4a4a52]">
                    <Mail size={18} className="mt-0.5 flex-none text-[#6e6e76]" aria-hidden />
                    <span>
                      In ein bis zwei Minuten an <b className="text-[#0e0e10]">{email.trim()}</b>. Schau auch im Spam-Ordner nach.
                    </span>
                  </p>
                </>
              )}
            </section>
            <WhatsAppCta text={waText} source={source} />
          </div>
        )}
      </main>
    </div>
  );
}
