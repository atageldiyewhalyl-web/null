import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, Loader2, Phone } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { trackGaEvent } from "../../utils/tracking";

/*
 * /check-flyer: landing page for the QR code on the printed flyers ("Kostenloser Website-Check & Angebot").
 * One short form (website, name, company, mobile number, consent) -> the same check as /website-check runs in the
 * make-server-ea5edff4 edge function (/flyer-check) -> the score and the three most important issues are shown on
 * screen -> the next step is WhatsApp with a pre-filled message that already contains the result.
 * ?f=allgemein | ?f=handwerk tells which flyer the scan came from (stored with the lead).
 * CONSENT_TEXT must stay identical to FLYER_CONSENT_TEXT in supabase/functions/make-server-ea5edff4/flyer_check.ts.
 */

const API = `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/flyer-check`;
const WA_NUMBER = "4915256569852";
const PHONE_DISPLAY = "01525 6569852";
const CONSENT_TEXT =
  "Ich bin einverstanden, dass nüll. meine Angaben speichert und mich zu meinem Website-Check und einem Angebot per Telefon oder WhatsApp kontaktiert. Widerruf jederzeit möglich.";

const GOOD = "#1a9f4b";
const MID = "#e08600";
const BAD = "#d70015";
const tone = (v: number) => (v >= 70 ? GOOD : v >= 40 ? MID : BAD);
const BAND: Record<string, string> = { gut: "Gut aufgestellt", ausbaufaehig: "Da geht noch einiges", kritisch: "Hier gehen Kunden verloren" };

type Issue = { title: string; detail: string; status: string };
type Result =
  | { state: "done" | "unreachable"; score: number | null; band: string | null; host: string | null; builtBy: string | null; top: Issue[] }
  | { state: "no_site" | "failed" };

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

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
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

function ScoreRing({ value }: { value: number }) {
  const size = 148;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e9edf3" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone(value)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-[2.9rem] font-extrabold leading-none tracking-[-0.05em]" style={{ color: tone(value) }}>{value}</div>
          <div className="mt-1 text-[0.85rem] font-semibold text-[#6e6e76]">von 100</div>
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Website wird aufgerufen", "Ladezeit am Handy wird gemessen", "Google-Grundlagen werden geprüft", "Kontaktwege werden gesucht"];

function Running({ host }: { host: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setT((v) => v + 1), 1000);
    return () => clearInterval(i);
  }, []);
  const pct = Math.min(94, Math.round((1 - Math.exp(-t / 28)) * 100));
  const active = Math.min(STEPS.length - 1, Math.floor(t / 12));
  return (
    <div className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_48px_-24px_rgba(15,23,42,0.25)] sm:p-8" aria-live="polite">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#007aff]" aria-hidden />
        <p className="text-[1.15rem] font-bold tracking-[-0.02em]">Wir prüfen {host} …</p>
      </div>
      <div className="mt-5 h-[6px] overflow-hidden rounded-full bg-[#e9edf3]">
        <div className="h-full rounded-full bg-[#007aff] transition-[width] duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-5 space-y-2.5">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-2.5 text-[0.98rem] ${i <= active ? "text-[#0e0e10]" : "text-[#a3a3ab]"}`}>
            <span className={`grid h-5 w-5 flex-none place-items-center rounded-full ${i < active ? "bg-[#1a9f4b] text-white" : i === active ? "bg-[#eaf3ff] text-[#007aff]" : "bg-[#f0f0f3]"}`}>
              {i < active ? <Check size={12} strokeWidth={3.5} aria-hidden /> : i === active ? <Loader2 size={12} className="animate-spin" aria-hidden /> : null}
            </span>
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[0.9rem] text-[#6e6e76]">Dauert meist etwa eine Minute. Lass die Seite offen.</p>
    </div>
  );
}

function WhatsAppCta({ text, source, label = "Auf WhatsApp schreiben" }: { text: string; source: string; label?: string }) {
  return (
    <div className="rounded-[22px] bg-[#0e0e10] p-6 text-white sm:p-8">
      <p className="text-[1.6rem] font-extrabold leading-[1.1] tracking-[-0.04em] !text-white">
        Schreib uns jetzt auf WhatsApp
        <span className="!text-[#3d9bff]"> und bekomm dein Angebot.</span>
      </p>
      <p className="mt-2.5 text-[0.98rem] leading-relaxed !text-[#c8c8ce]">Die Nachricht ist schon vorbereitet. Du musst nur noch auf Senden tippen.</p>
      <a
        href={waLink(text)}
        target="_blank"
        rel="noopener"
        onClick={() => trackGaEvent("flyer_whatsapp_click", { flyer: source || "unbekannt" })}
        className="mt-5 flex min-h-[60px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#25d366] px-5 text-[1.02rem] font-extrabold tracking-[-0.01em] text-white shadow-[0_16px_36px_rgba(37,211,102,0.3)] transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="h-6 w-6" />
        {label}
      </a>
      <a href={`tel:+${WA_NUMBER}`} className="mt-4 flex items-center justify-center gap-2 text-[0.95rem] font-semibold text-[#c8c8ce]">
        <Phone size={16} aria-hidden /> Lieber anrufen? {PHONE_DISPLAY}
      </a>
    </div>
  );
}

export default function FlyerCheck() {
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [challenge, setChallenge] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failMsg, setFailMsg] = useState("");
  const [step, setStep] = useState<"form" | "sending" | "running" | "result">("form");
  const [result, setResult] = useState<Result | null>(null);
  const idRef = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("f") ?? "";
    setSource(["allgemein", "handwerk"].includes(f) ? f : "");
  }, []);

  const host = (() => {
    try {
      return new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`).hostname.replace(/^www\./, "");
    } catch {
      return url.trim();
    }
  })();

  // Poll the result while the check runs (about a minute; give up after 3 minutes).
  useEffect(() => {
    if (step !== "running" || !idRef.current) return;
    let stop = false;
    const started = Date.now();
    const poll = async () => {
      if (stop) return;
      try {
        const r = await fetch(`${API}/result?id=${encodeURIComponent(idRef.current!)}`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const data = (await r.json()) as Result | { state: "running" | "unknown" };
        if (data.state !== "running" && data.state !== "unknown") {
          setResult(data as Result);
          setStep("result");
          return;
        }
      } catch {
        /* keep polling */
      }
      if (Date.now() - started > 180_000) {
        setResult({ state: "failed" });
        setStep("result");
        return;
      }
      setTimeout(poll, 3000);
    };
    const t = setTimeout(poll, 4000);
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, [step]);

  useEffect(() => {
    if (step === "running" || step === "result") topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const challengeText = challenge.trim().replace(/[.!\s]+$/, "");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!noWebsite && !/\.[a-z]{2,}/i.test(url.trim())) errs.url = "Bitte gib deine Website-Adresse ein, z. B. meinbetrieb.de";
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
        body: JSON.stringify({ url: noWebsite ? "" : url.trim(), noWebsite, name: name.trim(), company: company.trim(), phone: phone.trim(), challenge: challengeText, consent, source, website: honey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const map: Record<string, string> = {
          invalid_url: "Diese Website-Adresse können wir nicht prüfen. Stimmt die Schreibweise?",
          invalid_phone: "Diese Telefonnummer sieht nicht richtig aus.",
          rate_limited: "Von hier kamen heute schon viele Checks. Schreib uns einfach direkt auf WhatsApp.",
        };
        setFailMsg(map[data.error] ?? "Da ist etwas schiefgegangen. Versuch es noch einmal oder schreib uns direkt auf WhatsApp.");
        setStep("form");
        return;
      }
      trackGaEvent("flyer_check_submit", { flyer: source || "unbekannt", has_website: noWebsite ? "nein" : "ja" });
      idRef.current = data.id ?? null;
      if (noWebsite || !data.id) {
        setResult({ state: "no_site" });
        setStep("result");
      } else {
        setStep("running");
      }
    } catch {
      setFailMsg("Keine Verbindung. Prüf dein Internet und versuch es noch einmal.");
      setStep("form");
    }
  }

  const first = name.trim().split(/\s+/)[0] || "";
  const intro = `Hallo nüll., ich bin ${name.trim()} von ${company.trim()}.`;
  const challengeLine = challengeText ? ` Meine größte Herausforderung gerade: ${challengeText}.` : "";
  const waText =
    result?.state === "done" && result.score != null
      ? `${intro} Meine Website ${result.host ?? host} hat im Website-Check ${result.score}/100 bekommen. Ich möchte ein Angebot.${challengeLine}`
      : result?.state === "no_site"
        ? `${intro} Wir haben noch keine Website und möchten ein Angebot.${challengeLine}`
        : `${intro} Ich habe den Website-Check für ${host} gemacht und möchte ein Angebot.${challengeLine}`;

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans text-[#0e0e10]">
      <header className="mx-auto flex max-w-[560px] items-center justify-between px-5 pt-6">
        <a href="/" className="text-[1.6rem] font-bold tracking-[-0.04em]">
          nüll<span className="text-[#007aff]">.</span>
        </a>
        <span className="rounded-full border border-[#dcdce2] bg-white px-3 py-1 text-[0.78rem] font-bold text-[#6e6e76]">Kostenlos</span>
      </header>

      <main ref={topRef} className="mx-auto max-w-[560px] px-5 pb-16 pt-7">
        {step === "form" || step === "sending" ? (
          <>
            <h1 className="text-center text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-[2.8rem]">
              Kostenloser Website-Check <span className="text-[#007aff]">&amp; Angebot.</span>
            </h1>
            <p className="mt-3 text-center text-[1.08rem] leading-relaxed text-[#4a4a52]">
              In etwa einer Minute bekommst du eine Note von 0 bis 100 und deine drei wichtigsten Baustellen. Dein Angebot bekommst du danach direkt per WhatsApp.
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
        ) : step === "running" ? (
          <Running host={host} />
        ) : result ? (
          <div className="space-y-5">
            {result.state === "done" && result.score != null ? (
              <div className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_48px_-24px_rgba(15,23,42,0.25)] sm:p-8">
                <p className="text-[0.92rem] font-semibold text-[#6e6e76]">{first ? `${first}, dein Ergebnis für` : "Ergebnis für"} {result.host ?? host}</p>
                <div className="mt-4 flex items-center gap-5">
                  <ScoreRing value={result.score} />
                  <div>
                    <p className="text-[1.5rem] font-extrabold leading-tight tracking-[-0.04em]" style={{ color: tone(result.score) }}>
                      {result.band ? BAND[result.band] ?? "" : ""}
                    </p>
                    {result.builtBy && <p className="mt-1.5 text-[0.9rem] text-[#6e6e76]">Diese Website hat nüll. gebaut.</p>}
                  </div>
                </div>
                {result.top.length > 0 && (
                  <>
                    <h2 className="mt-7 text-[1.15rem] font-extrabold tracking-[-0.02em]">Deine drei wichtigsten Baustellen</h2>
                    <ol className="mt-3 space-y-3">
                      {result.top.map((t, i) => (
                        <li key={t.title} className="flex gap-3 rounded-[14px] bg-[#f4f4f6] p-4">
                          <span className="grid h-7 w-7 flex-none place-items-center rounded-full text-[0.85rem] font-extrabold text-white" style={{ background: t.status === "fail" ? BAD : MID }}>{i + 1}</span>
                          <div>
                            <p className="text-[1rem] font-bold leading-snug">{t.title}</p>
                            {t.detail && <p className="mt-1 text-[0.92rem] leading-relaxed text-[#4a4a52]">{t.detail}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            ) : result.state === "no_site" ? (
              <div className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_48px_-24px_rgba(15,23,42,0.25)] sm:p-8">
                <p className="text-[1.55rem] font-extrabold leading-[1.1] tracking-[-0.04em]">{first ? `${first}, ohne` : "Ohne"} Website findet dich bei Google kaum ein Kunde.</p>
                <p className="mt-3 text-[1rem] leading-relaxed text-[#4a4a52]">
                  Die meisten Kunden suchen heute am Handy nach einem Betrieb in der Nähe. Wir bauen dir eine Website, die bei Google gefunden wird und Anfragen bringt.
                </p>
              </div>
            ) : (
              <div className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_48px_-24px_rgba(15,23,42,0.25)] sm:p-8">
                <p className="text-[1.45rem] font-extrabold leading-[1.12] tracking-[-0.04em]">
                  {result.state === "unreachable" ? `Unter ${host} war gerade keine Website erreichbar.` : "Den Check konnten wir gerade nicht abschließen."}
                </p>
                <p className="mt-3 text-[1rem] leading-relaxed text-[#4a4a52]">Kein Problem: Wir schauen uns deine Website persönlich an. Deine Angaben sind schon bei uns.</p>
              </div>
            )}
            <WhatsAppCta text={waText} source={source} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
