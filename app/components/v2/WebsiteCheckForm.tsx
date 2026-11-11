import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Accessibility, ArrowRight, Check, Gauge, Globe, Loader2, Mail, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { trackGaEvent } from "../../utils/tracking";

/*
 * The website check form, shared by the /website-check page (CheckFlow, big address bar) and the
 * site-wide pop-up (QuickCheckForm, compact). Both send to the make-server-ea5edff4 /website-check
 * endpoint and then show <Scanning>, which asks the server whether the report e-mail is out.
 * OPT_IN_TEXT must stay identical to OPT_IN_TEXT in supabase/functions/make-server-ea5edff4/website_check.ts.
 */

export const API = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/website-check`;
const EASE = [0.22, 1, 0.36, 1] as const;
export const OPT_IN_TEXT = "Ja, schickt mir gelegentlich Tipps für mehr Anfragen über meine Website per E-Mail. Abmelden geht jederzeit mit einem Klick.";

export const AREAS = [
  { key: "contact", icon: MessageCircle, title: "Anfragen", scan: "Kontaktwege werden geprüft" },
  { key: "speed", icon: Gauge, title: "Ladezeit", scan: "Ladezeit wird gemessen" },
  { key: "seo", icon: Search, title: "Google-Grundlagen", scan: "Google-Grundlagen werden gelesen" },
  { key: "legal", icon: ShieldCheck, title: "Pflichtseiten & Technik", scan: "Pflichtseiten werden gesucht" },
  { key: "a11y", icon: Accessibility, title: "Barrierefreiheit", scan: "Barrierefreiheit wird bewertet" },
] as const;

export const urlOk = (u: string) => /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(u.trim());
export const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(e.trim());
export const hostOf = (u: string) => u.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
export const failText = (error?: string) =>
  error === "rate_limited" ? "Du hast heute schon mehrere Checks gestartet. Versuch es morgen wieder oder schreib uns direkt." : "Das hat leider nicht geklappt. Versuch es noch einmal.";

// one place that talks to the server; `source` only goes to analytics (where the check was started)
export async function submitCheck(d: { url: string; email: string; city: string; optIn: boolean; hp: string; source: string }): Promise<{ ok: boolean; id: string | null; error?: string }> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ url: d.url.trim(), email: d.email.trim(), city: d.city.trim(), optIn: d.optIn, website: d.hp }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      trackGaEvent("website_check_submit", { source: d.source });
      return { ok: true, id: typeof data.id === "string" ? data.id : null };
    }
    return { ok: false, id: null, error: data.error ?? "server_error" };
  } catch {
    return { ok: false, id: null, error: "network" };
  }
}

/* ---------- e-mail sanity: typo suggestions and a soft warning for keyboard mashing ----------
   The server also rejects domains without a mail server and throwaway providers (website_check.ts). */

const DOMAIN_FIX: Record<string, string> = {
  "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gnail.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.de": "gmail.com", "googlemail.co": "googlemail.com",
  "gmx.dee": "gmx.de", "gmx.ed": "gmx.de", "gmx.d": "gmx.de", "gmc.de": "gmx.de", "gmx.dr": "gmx.de",
  "wbe.de": "web.de", "we.de": "web.de", "web.dee": "web.de", "web.ed": "web.de", "webb.de": "web.de",
  "tonline.de": "t-online.de", "t-onlie.de": "t-online.de", "t-online.com": "t-online.de", "t-onine.de": "t-online.de",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.co": "outlook.com", "outloo.com": "outlook.com", "outllok.com": "outlook.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.dee": "yahoo.de",
  "icloud.co": "icloud.com", "iclod.com": "icloud.com", "icoud.com": "icloud.com",
};

// local part that looks like random typing (only a warning, never a block).
// Each name part is checked on its own; German clusters sch/ch/ck/ph/th count as one sound.
// Tested: real names (christoph.schwarz, fritzschmidt, krzysztof, m.wrzesniewski) pass;
// keyboard mashing (ajslfkjhawef, asdfghjkl, qwrtzpsdfg) is caught. Rare false alarms (herbststurm) can still send.
function looksRandom(local: string) {
  const parts = local.toLowerCase().split(/[^a-zäöüß]+/).filter(Boolean).map((p) => p.replace(/sch/g, "S").replace(/ch|ck|ph|th/g, "C"));
  const letters = parts.join("");
  if (letters.length < 7) return false;
  const vowels = (letters.match(/[aeiouyäöü]/g) ?? []).length;
  const longestRun = Math.max(0, ...parts.flatMap((p) => (p.match(/[^aeiouyäöü]+/g) ?? []).map((r) => r.length)));
  return longestRun >= 6 || vowels / letters.length < 0.15;
}

export type EmailNote = { msg: string; fix?: string } | null;

export function emailNote(email: string): EmailNote {
  const [local, domain = ""] = email.trim().toLowerCase().split("@");
  const fixed = DOMAIN_FIX[domain];
  if (fixed) return { msg: "Meintest du", fix: `${email.trim().split("@")[0]}@${fixed}` };
  if (looksRandom(local)) return { msg: "Ist die Adresse richtig? Den Report bekommst du nur an eine echte Adresse. Klick noch einmal, um ihn trotzdem zu senden." };
  return null;
}

export const emailServerError = (code?: string) =>
  code === "email_disposable"
    ? "Bitte nutze deine richtige E-Mail-Adresse, keine Wegwerf-Adresse."
    : code === "email_domain"
      ? "An diese Adresse können keine E-Mails zugestellt werden. Bitte prüf die Schreibweise."
      : "Bitte prüfe deine E-Mail-Adresse.";

export function EmailHint({ note, onFix }: { note: EmailNote; onFix: (v: string) => void }) {
  if (!note) return null;
  return (
    <span className="mt-1.5 block text-[0.85rem] font-medium leading-snug text-[#b25e00]" role="status">
      {note.fix ? (
        <>
          {note.msg}{" "}
          <button type="button" onClick={() => onFix(note.fix!)} className="font-bold text-[#007aff] underline underline-offset-2">
            {note.fix}
          </button>
          ?
        </>
      ) : (
        note.msg
      )}
    </span>
  );
}

export const inputCls = (bad?: boolean) =>
  `mt-2 block h-[54px] w-full rounded-[10px] border-2 bg-white px-4 text-[1.02rem] font-medium text-[#0e0e10] outline-none transition-colors placeholder:text-[#a1a1a6] focus:border-[#007aff] ${bad ? "border-[#d70015]" : "border-[#e3e6ec]"}`;

/* ---------- hero form ---------- */

type Step = "url" | "details" | "sending" | "sent";


export function CheckFlow() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<{ url?: string; email?: string }>({});
  const [failMsg, setFailMsg] = useState("");
  const [emailHint, setEmailHint] = useState<EmailNote>(null);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [checkId, setCheckId] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const host = hostOf(url);

  useEffect(() => {
    if (step === "details") emailRef.current?.focus({ preventScroll: true });
  }, [step]);

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step === "sending") return;
    setFailMsg("");
    if (!url.trim()) return setErrors({ url: "Bitte gib deine Website an." });
    if (!urlOk(url)) return setErrors({ url: "Bitte prüfe die Adresse, z. B. meinbetrieb.de." });
    if (step === "url") {
      setErrors({});
      return setStep("details");
    }
    if (!emailOk(email)) return setErrors({ email: "Bitte prüfe deine E-Mail-Adresse." });
    const note = emailNote(email);
    if (note && confirmedEmail !== email.trim()) {
      setConfirmedEmail(email.trim());
      setEmailHint(note);
      return;
    }
    setEmailHint(null);
    setErrors({});
    setStep("sending");
    const r = await submitCheck({ url, email, city, optIn, hp, source: "website-check-page" });
    if (r.ok) {
      setCheckId(r.id);
      setStep("sent");
      return;
    }
    if (r.error === "invalid_url") setErrors({ url: "Diese Adresse können wir nicht prüfen. Bitte gib deine öffentliche Website an." });
    else if (r.error === "invalid_email" || r.error === "email_domain" || r.error === "email_disposable") setErrors({ email: emailServerError(r.error) });
    else setFailMsg(failText(r.error));
    setStep("details");
  };

  if (step === "sent") return <Scanning host={host} email={email.trim()} id={checkId} />;

  const open = step !== "url";
  return (
    <form onSubmit={submit} noValidate className="mx-auto w-full max-w-[680px] text-left lg:mx-0">
      {/* the address bar: a slow light runs around its edge */}
      <div className="relative overflow-hidden rounded-full p-[2px] shadow-[0_18px_48px_-20px_rgba(15,23,42,0.22)]">
        <span aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2">
          <span className="block h-full w-full animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,#dfe6f1_0deg,#dfe6f1_250deg,#7fb2ff_300deg,#007aff_335deg,#dfe6f1_360deg)] motion-reduce:animate-none" />
        </span>
        <div className="relative flex h-[66px] items-center gap-3 rounded-full bg-white pl-5 pr-2 sm:h-[72px] sm:pl-7">
          <Globe size={22} strokeWidth={2} className="flex-none text-[#86868b]" aria-hidden />
          <label htmlFor="wc-url" className="sr-only">Deine Website</label>
          <input
            id="wc-url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); if (errors.url) setErrors({}); }}
            placeholder="meinbetrieb.de"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={!!errors.url}
            className="h-full min-w-0 flex-1 bg-transparent text-[1.1rem] font-semibold tracking-[-0.02em] text-[#0e0e10] outline-none placeholder:font-medium placeholder:text-[#a1a1a6] sm:text-[1.25rem]"
          />
          {open ? (
            <span className="mr-3 grid h-9 w-9 flex-none place-items-center rounded-full bg-[#eaf3ff] text-[#007aff]">
              <Check size={18} strokeWidth={3} aria-hidden />
            </span>
          ) : (
            <button type="submit" className="group inline-flex h-[50px] flex-none items-center gap-2 rounded-full bg-[#007aff] px-5 text-[0.82rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 sm:h-[56px] sm:px-7">
              <span className="hidden sm:inline">Website prüfen</span>
              <span className="sm:hidden">Prüfen</span>
              <ArrowRight size={17} strokeWidth={2.6} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
      {errors.url && <p className="mt-3 pl-6 text-[0.9rem] font-medium text-[#d70015]" role="alert">{errors.url}</p>}

      <AnimatePresence initial={false}>
        {!open && (
          <motion.p key="hint" exit={{ opacity: 0 }} className="mt-5 flex flex-wrap items-center justify-center gap-x-5 lg:justify-start gap-y-1.5 text-[0.92rem] font-semibold tracking-[-0.01em] text-[#6b7280]">
            {["Kostenlos", "Ergebnis in etwa einer Minute", "Report per E-Mail"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check size={15} strokeWidth={3} className="text-[#007aff]" aria-hidden />
                {t}
              </span>
            ))}
          </motion.p>
        )}
        {open && (
          <motion.div
            key="details"
            initial={reduce ? false : { opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mt-4 rounded-[22px] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.06] md:p-8">
              <p className="text-[1.5rem] font-bold leading-[1.1] tracking-[-0.045em] text-[#0e0e10]">Wohin dürfen wir den Report schicken?</p>
              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="text-[0.95rem] font-semibold tracking-[-0.015em]">Deine E-Mail</span>
                  <input ref={emailRef} value={email} onChange={(e) => { setEmail(e.target.value); setEmailHint(null); if (errors.email) setErrors({}); }} placeholder="name@betrieb.de" type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls(!!errors.email)} />
                  {errors.email && <span className="mt-1.5 block text-[0.85rem] font-medium text-[#d70015]">{errors.email}</span>}
                  <EmailHint note={errors.email ? null : emailHint} onFix={(v) => { setEmail(v); setEmailHint(null); }} />
                </label>
                <label className="block">
                  <span className="flex items-baseline justify-between text-[0.95rem] font-semibold tracking-[-0.015em]">
                    In welcher Stadt arbeitest du?
                    <span className="text-[0.82rem] font-medium text-[#86868b]">optional</span>
                  </span>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="z. B. Mannheim" autoComplete="address-level2" className={inputCls()} />
                  <span className="mt-1.5 block text-[0.85rem] font-medium text-[#6b7280]">Dann prüfen wir auch, ob Google deine Stadt auf der Startseite findet.</span>
                </label>
                {/* honeypot: hidden from people and screen readers, bots fill it */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Website (bitte leer lassen)
                    <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
                  </label>
                </div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-[#007aff]" />
                  <span className="text-[0.9rem] font-medium leading-[1.45] text-[#424245]">{OPT_IN_TEXT}</span>
                </label>
              </div>
              {failMsg && <p className="mt-5 rounded-[10px] bg-[#fff2f2] px-4 py-3 text-[0.95rem] font-medium text-[#a1000f]" role="alert">{failMsg}</p>}
              <button type="submit" disabled={step === "sending"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60">
                {step === "sending" ? "Wird gestartet …" : "Check starten"}
                {step !== "sending" && <ArrowRight size={17} strokeWidth={2.6} aria-hidden />}
              </button>
              <p className="mt-4 text-[0.82rem] leading-snug text-[#6b7280]">
                Mit dem Absenden erstellen wir deinen Report und schicken ihn an deine E-Mail-Adresse. Mehr in der{" "}
                <a href="/datenschutz" className="underline underline-offset-2 hover:text-[#0e0e10]">Datenschutzerklärung</a>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

// After sending: asks the server every 3 s whether the report e-mail is out, and only then says "verschickt".
// The six steps tick along while the check runs; the last one waits until the server is done.
type Live = "running" | "sent" | "failed";
const WA_HELP = `https://wa.me/4915256569852?text=${encodeURIComponent("Hallo nüll., mein Website-Check hat nicht geklappt. Könnt ihr mir helfen?")}`;

// Browsers turn umlaut domains into punycode (halyl@xn--nll-hoa.com). Show them as typed (halyl@nüll.com).
function punyToUnicode(label: string) {
  if (!label.toLowerCase().startsWith("xn--")) return label;
  const input = label.slice(4);
  const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700;
  const out: number[] = [];
  const d = input.lastIndexOf("-");
  if (d > 0) for (const ch of input.slice(0, d)) out.push(ch.charCodeAt(0));
  let n = 128, i = 0, bias = 72;
  const adapt = (delta: number, num: number, first: boolean) => {
    delta = first ? Math.floor(delta / damp) : delta >> 1;
    delta += Math.floor(delta / num);
    let k = 0;
    while (delta > ((base - tMin) * tMax) >> 1) { delta = Math.floor(delta / (base - tMin)); k += base; }
    return k + Math.floor(((base - tMin + 1) * delta) / (delta + skew));
  };
  for (let pos = d > 0 ? d + 1 : 0; pos < input.length; ) {
    const oldi = i;
    for (let w = 1, k = base; ; k += base) {
      if (pos >= input.length) return label;
      const c = input.charCodeAt(pos++);
      const digit = c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : base;
      if (digit >= base) return label;
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) break;
      w *= base - t;
    }
    bias = adapt(i - oldi, out.length + 1, oldi === 0);
    n += Math.floor(i / (out.length + 1));
    i %= out.length + 1;
    out.splice(i++, 0, n);
  }
  return String.fromCodePoint(...out);
}
const readable = (s: string) => s.replace(/[^@\s/]+/g, (part) => part.split(".").map(punyToUnicode).join("."));

export function Scanning({ host, email, id, compact = false }: { host: string; email: string; id: string | null; compact?: boolean }) {
  const reduce = useReducedMotion();
  const [live, setLive] = useState<Live>("running");
  const [slow, setSlow] = useState(false);
  const [i, setI] = useState(0);
  const last = AREAS.length - 1;

  // step animation: stops on the last area until the server answers
  useEffect(() => {
    if (live !== "running") return setI(AREAS.length);
    if (i >= last) return;
    const t = setTimeout(() => setI((n) => n + 1), reduce ? 0 : 2600);
    return () => clearTimeout(t);
  }, [i, live, last, reduce]);

  // poll the status
  useEffect(() => {
    if (!id) return;
    let stop = false;
    const t0 = Date.now();
    const tick = async () => {
      if (stop) return;
      try {
        const r = await fetch(`${API}/status?id=${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const d = await r.json().catch(() => ({}));
        if (d.state === "sent" || d.state === "failed") {
          setLive(d.state);
          if (d.state === "sent") trackGaEvent("website_check_report_sent");
          return;
        }
      } catch {
        /* network hiccup: try again */
      }
      const waited = Date.now() - t0;
      if (waited > 75_000) setSlow(true);
      if (waited < 240_000) setTimeout(tick, 3000);
    };
    const first = setTimeout(tick, 4000);
    return () => {
      stop = true;
      clearTimeout(first);
    };
  }, [id]);

  const sent = live === "sent";
  const failed = live === "failed";
  const shownHost = readable(host);
  const shownEmail = readable(email);
  const progress = sent ? 1 : Math.min(0.92, (i + 0.6) / AREAS.length);

  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} role="status" aria-live="polite" className="mx-auto w-full max-w-[640px] text-center">
      {/* the circle: a ring that fills while the check runs, a blue tick once the e-mail is out */}
      <div className={`relative mx-auto ${compact ? "h-[84px] w-[84px]" : "h-[104px] w-[104px]"}`}>
        <svg viewBox="0 0 104 104" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="52" cy="52" r="47" fill="none" stroke="#e9edf3" strokeWidth="6" />
          {!failed && (
            <motion.circle cx="52" cy="52" r="47" fill="none" stroke="#007aff" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 1 - progress }} transition={{ duration: reduce ? 0 : 1.2, ease: EASE }} />
          )}
        </svg>
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.span key="ok" initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }} className="absolute inset-[10px] grid place-items-center rounded-full bg-[#007aff] text-white shadow-[0_18px_40px_-12px_rgba(0,122,255,0.6)]">
              <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: reduce ? 0 : 0.15, ease: EASE }} />
              </svg>
            </motion.span>
          ) : failed ? (
            <motion.span key="fail" initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-[10px] grid place-items-center rounded-full bg-[#fff2f2] text-[2.2rem] font-black text-[#d70015]">!</motion.span>
          ) : (
            <motion.span key="run" exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center text-[#007aff]">
              <Globe size={34} strokeWidth={1.8} aria-hidden className="motion-safe:animate-[pulse_2s_ease-in-out_infinite]" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className={`font-bold leading-[0.98] tracking-[-0.06em] text-[#0e0e10] ${compact ? "mt-6 text-[clamp(1.7rem,6vw,2.3rem)]" : "mt-8 text-[clamp(2rem,4.6vw,3.2rem)]"}`}>
        {sent ? "Dein Report ist verschickt" : failed ? "Das hat leider nicht geklappt" : "Dein Check läuft"}
        <span className="text-[#007aff]">.</span>
      </p>
      <p className="mx-auto mt-4 max-w-[46ch] text-[1.08rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#424245]">
        {failed ? (
          <>Wir konnten den Report für <strong className="font-semibold text-[#0e0e10]">{shownHost}</strong> gerade nicht verschicken. Prüf kurz die Adresse und versuch es noch einmal, oder schreib uns.</>
        ) : sent ? (
          <>Der Report für <strong className="font-semibold text-[#0e0e10]">{shownHost}</strong> ist unterwegs an <strong className="font-semibold text-[#0e0e10]">{shownEmail}</strong>. Du kannst die Seite jetzt schließen.</>
        ) : slow ? (
          <>Das dauert heute etwas länger, meist wegen der Ladezeit-Messung von Google. Der Report geht trotzdem an <strong className="font-semibold text-[#0e0e10]">{shownEmail}</strong>.</>
        ) : (
          <>Wir prüfen <strong className="font-semibold text-[#0e0e10]">{shownHost}</strong>. In etwa einer Minute ist der Report bei <strong className="font-semibold text-[#0e0e10]">{shownEmail}</strong>.</>
        )}
      </p>

      {failed ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-14 items-center gap-2 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5">
            Noch einmal versuchen <ArrowRight size={17} strokeWidth={2.6} aria-hidden />
          </button>
          <a href={WA_HELP} target="_blank" rel="noopener noreferrer" className="border-b-2 border-[#111111] pb-0.5 text-[1.02rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
            Per WhatsApp schreiben
          </a>
        </div>
      ) : (
        <>
          {/* progress: one thin bar, the five areas as plain text below */}
          <div className={`mx-auto max-w-[560px] ${compact ? "mt-7" : "mt-10"}`}>
            <div className="h-[5px] overflow-hidden rounded-full bg-[#e9edf3]">
              <motion.div className="h-full rounded-full bg-[#007aff]" initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: reduce ? 0 : 1.2, ease: EASE }} />
            </div>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2.5">
              {AREAS.map((a, n) => {
                const state = sent || n < i ? "done" : n === i ? "now" : "wait";
                return (
                  <li key={a.key} className={`inline-flex items-center gap-1.5 text-[0.95rem] font-semibold tracking-[-0.015em] transition-colors duration-500 ${state === "wait" ? "text-[#b8bcc4]" : "text-[#0e0e10]"}`}>
                    {state === "done" ? (
                      <Check size={16} strokeWidth={3} className="text-[#007aff]" aria-hidden />
                    ) : state === "now" ? (
                      <Loader2 size={15} strokeWidth={2.6} className="animate-spin text-[#007aff]" aria-hidden />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                    )}
                    {a.title}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* spam hint: a quiet line, not a box */}
          <p className={`mx-auto flex max-w-[52ch] items-start justify-center gap-2.5 text-left text-[0.95rem] font-medium leading-[1.5] text-[#6b7280] ${compact ? "mt-7" : "mt-10"}`}>
            <Mail size={18} strokeWidth={2.2} className="mt-0.5 flex-none text-[#007aff]" aria-hidden />
            <span>
              <strong className="font-semibold text-[#0e0e10]">{sent ? "Nicht im Posteingang? Schau im Spam-Ordner." : "Schau auch in deinen Spam-Ordner."}</strong>{" "}
              Der Report kommt von check@forms.nüll.com. Markier ihn als „Kein Spam“, dann landen unsere Mails künftig im Posteingang.
            </span>
          </p>
        </>
      )}
    </motion.div>
  );
}


/* ---------- compact form for the pop-up: one step, address can come pre-filled ---------- */

export function QuickCheckForm({ initialUrl = "", source, onSent }: { initialUrl?: string; source: string; onSent?: () => void }) {
  const [url, setUrl] = useState(initialUrl);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<{ url?: string; email?: string }>({});
  const [failMsg, setFailMsg] = useState("");
  const [emailHint, setEmailHint] = useState<EmailNote>(null);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ id: string | null } | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // focus the first empty field
  useEffect(() => {
    const t = setTimeout(() => (initialUrl ? emailRef : urlRef).current?.focus({ preventScroll: true }), 250);
    return () => clearTimeout(t);
  }, [initialUrl]);

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (sending) return;
    setFailMsg("");
    const e: { url?: string; email?: string } = {};
    if (!url.trim()) e.url = "Bitte gib deine Website an.";
    else if (!urlOk(url)) e.url = "Bitte prüfe die Adresse, z. B. meinbetrieb.de.";
    if (!emailOk(email)) e.email = "Bitte prüfe deine E-Mail-Adresse.";
    setErrors(e);
    if (e.url || e.email) return;
    const note = emailNote(email);
    if (note && confirmedEmail !== email.trim()) {
      setConfirmedEmail(email.trim());
      setEmailHint(note);
      return;
    }
    setEmailHint(null);
    setSending(true);
    const r = await submitCheck({ url, email, city, optIn, hp, source });
    setSending(false);
    if (r.ok) {
      setSent({ id: r.id });
      onSent?.();
      return;
    }
    if (r.error === "invalid_url") setErrors({ url: "Diese Adresse können wir nicht prüfen. Bitte gib deine öffentliche Website an." });
    else if (r.error === "invalid_email" || r.error === "email_domain" || r.error === "email_disposable") setErrors({ email: emailServerError(r.error) });
    else setFailMsg(failText(r.error));
  };

  if (sent) return <Scanning host={hostOf(url)} email={email.trim()} id={sent.id} compact />;

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 text-left">
      <label className="block">
        <span className="text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">Deine Website</span>
        <span className="relative mt-2 block">
          <Globe size={19} strokeWidth={2} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input ref={urlRef} value={url} onChange={(e) => { setUrl(e.target.value); if (errors.url) setErrors((p) => ({ ...p, url: "" })); }} placeholder="meinbetrieb.de" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} aria-invalid={!!errors.url} className={`${inputCls(!!errors.url)} !mt-0 pl-11`} />
        </span>
        {errors.url && <span className="mt-1.5 block text-[0.85rem] font-medium text-[#d70015]">{errors.url}</span>}
      </label>
      <label className="block">
        <span className="text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">Wohin dürfen wir den Report schicken?</span>
        <input ref={emailRef} value={email} onChange={(e) => { setEmail(e.target.value); setEmailHint(null); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }} placeholder="name@betrieb.de" type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls(!!errors.email)} />
        {errors.email && <span className="mt-1.5 block text-[0.85rem] font-medium text-[#d70015]">{errors.email}</span>}
                  <EmailHint note={errors.email ? null : emailHint} onFix={(v) => { setEmail(v); setEmailHint(null); }} />
      </label>
      <label className="block">
        <span className="flex items-baseline justify-between text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">
          Stadt
          <span className="text-[0.82rem] font-medium text-[#86868b]">optional</span>
        </span>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="z. B. Mannheim" autoComplete="address-level2" className={inputCls()} />
      </label>
      {/* honeypot: hidden from people and screen readers, bots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website (bitte leer lassen)
          <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
        </label>
      </div>
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-[#007aff]" />
        <span className="text-[0.88rem] font-medium leading-[1.45] text-[#424245]">{OPT_IN_TEXT}</span>
      </label>
      {failMsg && <p className="rounded-[10px] bg-[#fff2f2] px-4 py-3 text-[0.95rem] font-medium text-[#a1000f]" role="alert">{failMsg}</p>}
      <button type="submit" disabled={sending} className="mt-1 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60">
        {sending ? "Wird gestartet …" : "Check starten"}
        {!sending && <ArrowRight size={17} strokeWidth={2.6} aria-hidden />}
      </button>
      <p className="text-[0.8rem] leading-snug text-[#6b7280]">
        Mit dem Absenden erstellen wir deinen Report und schicken ihn an deine E-Mail-Adresse. Mehr in der{" "}
        <a href="/datenschutz" className="underline underline-offset-2 hover:text-[#0e0e10]">Datenschutzerklärung</a>.
      </p>
    </form>
  );
}
