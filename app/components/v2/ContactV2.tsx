import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Mail, Phone } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { getContactGoogleAdsConversion, googleAdsConversionSendTo, trackGaEvent, trackGoogleAdsConversion } from "../../utils/tracking";

/*
 * Closing section (#contact) on the soft grey page background.
 * Enquiry in the same four parts as the old homepage form (components/ui/multistep-form.tsx):
 * Leistungen → Quelle → Website → Kontakt, one part at a time, same required fields.
 * Submits like the old homepage (NewLandingSpinnerSection): make-server-ea5edff4 /onboarding-discovery with
 * formData + answers + sections, so the notification email has the same format. Google Ads form conversion on success.
 */

const API = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/onboarding-discovery`;
const WA = `https://wa.me/4915256569852?text=${encodeURIComponent("Hallo nüll., ich interessiere mich für ein Anfragesystem für meinen Betrieb.")}`;
const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICES = [
  { id: "professional-website", label: "Neue Website" },
  { id: "seo", label: "Bei Google gefunden werden (SEO)" },
  { id: "geo", label: "In KI-Chats empfohlen werden" },
  { id: "google-ads", label: "Google Ads" },
  { id: "meta-ads", label: "Meta Ads (Instagram & Facebook)" },
  { id: "content", label: "Videos & Reels" },
];
const SOURCES = ["Google-Suche", "Instagram", "LinkedIn", "Empfehlung", "Andere"];

type Data = { services: string[]; foundFrom: string; foundFromOther: string; websiteUrl: string; biggestChallenge: string; name: string; businessName: string; phone: string; email: string; city: string };
const EMPTY: Data = { services: [], foundFrom: "", foundFromOther: "", websiteUrl: "", biggestChallenge: "", name: "", businessName: "", phone: "", email: "", city: "" };

const PARTS = ["Leistungen", "Quelle", "Website", "Kontakt"];

// same section/answer shape as the old homepage form
const SECTIONS = [
  { id: "contact", deTitle: "Kontakt", enTitle: "Contact", questions: [{ id: "name", de: "Name", en: "Name" }, { id: "businessName", de: "Unternehmensname", en: "Business name" }, { id: "phone", de: "Telefonnummer", en: "Phone number" }, { id: "email", de: "E-Mail", en: "Email" }, { id: "city", de: "Stadt", en: "City" }] },
  { id: "source", deTitle: "Quelle", enTitle: "Source", questions: [{ id: "foundFrom", de: "Wo hast du uns gefunden?", en: "Where did they find us?" }] },
  { id: "services", deTitle: "Ziele", enTitle: "Services", questions: [{ id: "selectedServices", de: "Welche Leistungen interessieren dich?", en: "What do they want?" }] },
  { id: "final", deTitle: "Abschluss", enTitle: "Final", questions: [{ id: "websiteUrl", de: "Aktuelle Website-URL (falls vorhanden)", en: "Current website URL, if available" }, { id: "biggestChallenge", de: "Was ist deine größte Herausforderung?", en: "Biggest challenge" }] },
];
const answers = (d: Data) => ({
  "contact.name": d.name.trim(),
  "contact.businessName": d.businessName.trim(),
  "contact.phone": d.phone.trim(),
  "contact.email": d.email.trim(),
  "contact.city": d.city.trim(),
  "source.foundFrom": d.foundFrom === "Andere" ? `Andere: ${d.foundFromOther.trim()}` : d.foundFrom,
  "services.selectedServices": d.services.map((s) => SERVICES.find((x) => x.id === s)?.label ?? s).join(", "),
  "final.websiteUrl": d.websiteUrl.trim() || "Keine Website angegeben",
  "final.biggestChallenge": d.biggestChallenge.trim(),
});

const track = (event: string) => {
  trackGaEvent(`${event}_home_v2`);
  const sendTo = getContactGoogleAdsConversion(event);
  if (sendTo) trackGoogleAdsConversion(sendTo);
};

/* ---------- pieces ---------- */

function Option({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex min-h-[60px] w-full items-center justify-between gap-3 rounded-[10px] border-2 px-5 text-left text-[1.02rem] font-semibold leading-snug tracking-[-0.02em] transition-colors duration-200 ${
        on ? "border-[#007aff] bg-[#eaf3ff] text-[#0e0e10]" : "border-[#e3e6ec] bg-white text-[#0e0e10] hover:border-[#0e0e10]/35"
      }`}
    >
      {children}
      <span className={`grid h-6 w-6 flex-none place-items-center rounded-[6px] transition-colors ${on ? "bg-[#007aff] text-white" : "border-2 border-[#d8dde7]"}`}>
        {on && <Check size={15} strokeWidth={3} aria-hidden />}
      </span>
    </button>
  );
}

const fieldCls = (bad?: boolean) =>
  `mt-2 block w-full rounded-[10px] border-2 bg-white px-5 text-[1.08rem] font-medium text-[#0e0e10] outline-none transition-colors placeholder:text-[#a1a1a6] focus:border-[#007aff] ${bad ? "border-[#d70015]" : "border-[#e3e6ec]"}`;

function Input({ label, value, onChange, error, optional, ...rest }: { label: string; value: string; onChange: (v: string) => void; error?: string; optional?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">
        {label}
        {optional && <span className="text-[0.82rem] font-medium text-[#86868b]">optional</span>}
      </span>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldCls(!!error)} h-[58px]`} />
      {error && <span className="mt-1.5 block text-[0.85rem] font-medium text-[#d70015]">{error}</span>}
    </label>
  );
}

/* ---------- section ---------- */

export default function ContactV2() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const put = <K extends keyof Data>(k: K, v: Data[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    panel.current?.querySelector<HTMLElement>("input, textarea, button[aria-pressed]")?.focus({ preventScroll: true });
  }, [step]);

  const check = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0 && d.services.length === 0) e.services = "Bitte wähle mindestens eine Leistung.";
    if (s === 1 && !d.foundFrom) e.foundFrom = "Bitte wähle eine Antwort.";
    if (s === 1 && d.foundFrom === "Andere" && !d.foundFromOther.trim()) e.foundFromOther = "Wo hast du uns gefunden?";
    if (s === 3) {
      if (!d.name.trim()) e.name = "Bitte gib deinen Namen an.";
      if (!d.businessName.trim()) e.businessName = "Bitte gib deinen Betrieb an.";
      const digits = d.phone.replace(/\D/g, "").length;
      if (digits < 7 || !/^[+()\d\s./-]+$/.test(d.phone.trim())) e.phone = "Bitte prüfe deine Telefonnummer.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(d.email.trim())) e.email = "Bitte prüfe deine E-Mail-Adresse.";
      if (!d.city.trim()) e.city = "Bitte gib deine Stadt an.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const go = (to: number) => { setDir(to > step ? 1 : -1); setStep(to); };
  const next = () => {
    if (!check(step)) return;
    if (step < 3) go(step + 1);
    else send();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") { e.preventDefault(); next(); }
  };

  const send = async () => {
    if (state === "sending") return;
    setState("sending");
    const formData = {
      name: d.name.trim(), businessName: d.businessName.trim(), phone: d.phone.trim(), email: d.email.trim(), city: d.city.trim(),
      foundFrom: d.foundFrom, foundFromOther: d.foundFromOther.trim(), services: d.services, websiteUrl: d.websiteUrl.trim(), biggestChallenge: d.biggestChallenge.trim(),
    };
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ lang: "de", formData, answers: answers(d), sections: SECTIONS, onboardingType: "home-v2-contact" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error("send failed");
      setState("sent");
      trackGaEvent("form_submit_home_v2");
      trackGoogleAdsConversion(googleAdsConversionSendTo.formSubmit);
    } catch {
      setState("failed");
    }
  };

  const steps: { q: string; hint: string; body: ReactNode }[] = [
    {
      q: "Was können wir für dich tun?",
      hint: "Wähle alles, was dich interessiert.",
      body: (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <Option key={s.id} on={d.services.includes(s.id)} onClick={() => put("services", d.services.includes(s.id) ? d.services.filter((x) => x !== s.id) : [...d.services, s.id])}>
                {s.label}
              </Option>
            ))}
          </div>
          {errors.services && <p className="mt-3 text-[0.85rem] font-medium text-[#d70015]">{errors.services}</p>}
        </>
      ),
    },
    {
      q: "Wo hast du uns gefunden?",
      hint: "Hilft uns zu verstehen, was bei dir ankommt.",
      body: (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {SOURCES.map((s) => (
              <Option
                key={s}
                on={d.foundFrom === s}
                onClick={() => {
                  put("foundFrom", s);
                  if (s !== "Andere") setTimeout(() => { setDir(1); setStep(2); }, reduce ? 0 : 220);
                }}
              >
                {s}
              </Option>
            ))}
          </div>
          {d.foundFrom === "Andere" && (
            <div className="mt-4">
              <Input label="Wo genau?" value={d.foundFromOther} onChange={(v) => put("foundFromOther", v)} error={errors.foundFromOther} placeholder="z. B. Messe, Flyer" />
            </div>
          )}
          {errors.foundFrom && <p className="mt-3 text-[0.85rem] font-medium text-[#d70015]">{errors.foundFrom}</p>}
        </>
      ),
    },
    {
      q: "Wo stehst du gerade?",
      hint: "Beides ist optional, hilft uns aber bei der Vorbereitung.",
      body: (
        <div className="grid gap-4">
          <Input label="Deine aktuelle Website" optional value={d.websiteUrl} onChange={(v) => put("websiteUrl", v)} placeholder="z. B. meinbetrieb.de" inputMode="url" />
          <label className="block">
            <span className="flex items-baseline justify-between text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">
              Was ist gerade deine größte Herausforderung?
              <span className="text-[0.82rem] font-medium text-[#86868b]">optional</span>
            </span>
            <textarea
              value={d.biggestChallenge}
              onChange={(e) => put("biggestChallenge", e.target.value)}
              placeholder="z. B. Zu wenig Anfragen, keine Website, niemand findet uns bei Google"
              className={`${fieldCls()} min-h-[130px] resize-y py-4 leading-[1.5]`}
            />
          </label>
        </div>
      ),
    },
    {
      q: "Wie erreichen wir dich?",
      hint: "Wir melden uns persönlich, kein Callcenter.",
      body: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={d.name} onChange={(v) => put("name", v)} error={errors.name} placeholder="Vor- und Nachname" autoComplete="name" />
          <Input label="Betrieb" value={d.businessName} onChange={(v) => put("businessName", v)} error={errors.businessName} placeholder="Name deines Betriebs" autoComplete="organization" />
          <Input label="Telefon" value={d.phone} onChange={(v) => put("phone", v)} error={errors.phone} placeholder="+49 …" type="tel" inputMode="tel" autoComplete="tel" />
          <Input label="E-Mail" value={d.email} onChange={(v) => put("email", v)} error={errors.email} placeholder="name@betrieb.de" type="email" inputMode="email" autoComplete="email" />
          <div className="sm:col-span-2">
            <Input label="Stadt" value={d.city} onChange={(v) => put("city", v)} error={errors.city} placeholder="z. B. Mannheim" autoComplete="address-level2" />
          </div>
        </div>
      ),
    },
  ];

  const cur = steps[step];
  const slide = reduce
    ? {}
    : { initial: { opacity: 0, x: dir * 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: dir * -40 }, transition: { duration: 0.35, ease: EASE } };

  return (
    <section id="contact" className="relative scroll-mt-4 overflow-hidden bg-[#f5f5f7] py-20 text-[#0e0e10] md:py-28">
      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        {/* left: the statement */}
        <div className="text-center lg:col-start-1 lg:row-start-1 lg:pt-6 lg:text-left">
          {/* phones and tablets: two centred lines; desktop: three lines, left */}
          <h2 className="text-[clamp(2.2rem,9.6vw,4.4rem)] font-bold leading-[0.95] tracking-[-0.065em] text-[#0e0e10] lg:hidden">
            <span className="block whitespace-nowrap">Bereit für deine</span>
            <span className="block whitespace-nowrap">erste Anfrage?</span>
          </h2>
          <h2 className="hidden text-[clamp(2.7rem,6vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.07em] text-[#0e0e10] lg:block">
            <span className="block whitespace-nowrap">Bereit für</span>
            <span className="block whitespace-nowrap">deine erste</span>
            <span className="block whitespace-nowrap">Anfrage?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[34ch] text-[1.05rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245] lg:mx-0 lg:mt-7 lg:text-[1.2rem]">
            Vier kurze Schritte, eine Minute. Danach melden wir uns persönlich bei dir.
          </p>
        </div>

        {/* right: the four parts */}
        <div className="rounded-[20px] bg-white p-6 text-[#0e0e10] shadow-[0_30px_70px_-40px_rgba(15,23,42,0.25)] md:p-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" onKeyDown={onKey}>
          {state === "sent" ? (
            <div className="flex min-h-[480px] flex-col justify-center" role="status">
              <span className="grid h-16 w-16 place-items-center rounded-[14px] bg-[#007aff] text-white">
                <Check size={32} strokeWidth={2.6} aria-hidden />
              </span>
              <p className="mt-7 text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10]">
                Danke, {d.name.trim().split(" ")[0]}<span className="text-[#007aff]">.</span>
              </p>
              <p className="mt-4 max-w-[38ch] text-[1.1rem] font-medium leading-[1.5] text-[#424245]">
                Deine Anfrage ist da. Wir schauen uns {d.businessName.trim() || "deinen Betrieb"} an und melden uns persönlich bei dir.
              </p>
            </div>
          ) : (
            <>
              {/* the four parts */}
              <ol className="grid grid-cols-4 gap-2" aria-label="Fortschritt">
                {PARTS.map((p, i) => {
                  const done = i < step, active = i === step;
                  return (
                    <li key={p}>
                      <button
                        type="button"
                        disabled={i > step}
                        onClick={() => i < step && go(i)}
                        aria-current={active ? "step" : undefined}
                        className="block w-full text-left disabled:cursor-default"
                      >
                        <span className={`block h-1.5 rounded-full transition-colors duration-300 ${done || active ? "bg-[#007aff]" : "bg-[#e3e6ec]"}`} />
                        <span className={`mt-2.5 hidden whitespace-nowrap text-[0.9rem] font-semibold tracking-[-0.01em] sm:block ${active ? "text-[#0e0e10]" : done ? "text-[#007aff]" : "text-[#a1a1a6]"}`}>
                          <span className="tabular-nums">{i + 1}</span> {p}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {/* phones: one line instead of four squeezed labels */}
              <p className="mt-2.5 text-[0.85rem] font-semibold tracking-[-0.01em] text-[#6b7280] sm:hidden">
                Schritt <span className="tabular-nums">{step + 1}</span> von {PARTS.length} · <span className="text-[#0e0e10]">{PARTS[step]}</span>
              </p>

              <div ref={panel} className="relative mt-9 min-h-[420px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} {...slide}>
                    <p className="text-[clamp(1.8rem,3.2vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.055em] text-[#0e0e10]">{cur.q}</p>
                    <p className="mt-2 text-[1rem] font-medium text-[#6b7280]">{cur.hint}</p>
                    <div className="mt-7">{cur.body}</div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {state === "failed" && (
                <p className="mt-4 rounded-[10px] bg-[#fff2f2] px-4 py-3 text-[0.95rem] font-medium text-[#a1000f]" role="alert">
                  Das hat leider nicht geklappt. Versuch es noch einmal oder schreib uns per{" "}
                  <a href={WA} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>.
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/[0.07] pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-2 text-[1rem] font-semibold text-[#0e0e10] transition-opacity hover:opacity-55">
                    <ArrowLeft size={18} strokeWidth={2.4} aria-hidden /> Zurück
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={state === "sending"}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                >
                  {state === "sending" ? "Wird gesendet …" : step === 3 ? "Anfrage senden" : "Weiter"}
                  {state !== "sending" && <ArrowRight size={17} strokeWidth={2.6} aria-hidden />}
                </button>
              </div>
              {step === 3 && (
                <p className="mt-4 text-[0.82rem] leading-snug text-[#6b7280]">
                  Deine Angaben nutzen wir nur für deine Anfrage. Mehr in der{" "}
                  <a href="/datenschutz" className="underline underline-offset-2 hover:text-[#0e0e10]">Datenschutzerklärung</a>.
                </p>
              )}
            </>
          )}
        </div>

        {/* direct contact: under the form on phones, level with the bottom of the form on desktop */}
        {/* phones and tablets: three tiles, one tap each */}
        <div className="lg:hidden">
          <p className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#6b7280]">Lieber direkt?</p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {[
              { label: "WhatsApp", href: WA, ext: true, ev: "whatsapp_click", icon: <img src="/assets/v2/logos/whatsapp.svg" alt="" className="h-[22px] w-[22px]" style={{ filter: "brightness(0) invert(1)" }} />, bg: "#25d366" },
              { label: "Anrufen", href: "tel:+4915256569852", ev: "phone_click", icon: <Phone size={20} strokeWidth={2.2} />, bg: "#0e0e10" },
              { label: "E-Mail", href: "mailto:info@nüll.com", ev: "email_click", icon: <Mail size={20} strokeWidth={2.2} />, bg: "#007aff" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.ext ? "_blank" : undefined}
                rel={c.ext ? "noopener noreferrer" : undefined}
                onClick={() => track(c.ev)}
                className="flex flex-col items-start gap-6 rounded-[22px] bg-white p-4 active:scale-[0.98]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: c.bg }}>{c.icon}</span>
                <span className="text-[0.95rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{c.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* desktop: text links, level with the bottom of the form */}
        <div className="hidden space-y-3 text-[1.05rem] font-semibold tracking-[-0.02em] lg:col-start-1 lg:row-start-2 lg:block lg:self-end">
          <p className="text-[#6b7280]">Lieber direkt?</p>
          <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click")} className="flex w-max items-center gap-2 border-b-2 border-[#0e0e10]/25 pb-0.5 text-[#0e0e10] transition-colors hover:border-[#0e0e10]">
            WhatsApp schreiben <ArrowRight size={17} strokeWidth={2.6} aria-hidden />
          </a>
          <a href="tel:+4915256569852" onClick={() => track("phone_click")} className="flex w-max items-center gap-2 border-b-2 border-[#0e0e10]/25 pb-0.5 text-[#0e0e10] transition-colors hover:border-[#0e0e10]">
            +49 1525 6569852
          </a>
          <a href="mailto:info@nüll.com" onClick={() => track("email_click")} className="flex w-max items-center gap-2 border-b-2 border-[#0e0e10]/25 pb-0.5 text-[#0e0e10] transition-colors hover:border-[#0e0e10]">
            info@nüll.com
          </a>
        </div>
      </div>
    </section>
  );
}
