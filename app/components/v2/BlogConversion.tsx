import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, Globe, MessageCircle, Phone, X } from "lucide-react";
import type { BlogPost } from "../../types";
import { getContactGoogleAdsConversion, trackGaEvent, trackGoogleAdsConversion } from "../../utils/tracking";
import { CASE_LIST } from "./caseList";
import { openWebsiteCheck } from "./WebsiteCheckModal";
import { postService } from "./blogShared";

/*
 * The conversion layer of every blog article (rendered by BlogArticleV2 and BlogIndexV2).
 * Free tools (no e-mail needed): the Anfragen-Selbsttest and the Anfragen-Rechner.
 * Lead paths: the Website-Check pop-up, WhatsApp (pre-filled with the article title), phone, the contact form (#contact).
 * Proof: real client numbers, read from caseList.ts so they never drift from the Referenzen page.
 * Articles get these modules automatically (see planModules in BlogArticleV2.tsx), or by writing
 * [CHECK], [PROOF], [SELFTEST], [CALC] or [CONTACT] as a block in a post.
 */

export const PHONE = "+4915256569852";
export const PHONE_LABEL = "+49 1525 6569852";
const WA_BASE = "https://wa.me/4915256569852";

export const waLink = (post?: BlogPost) =>
  `${WA_BASE}?text=${encodeURIComponent(
    post ? `Hallo nüll., ich habe euren Artikel „${post.title}“ gelesen und interessiere mich für ein Anfragesystem für meinen Betrieb.` : "Hallo nüll., ich interessiere mich für ein Anfragesystem für meinen Betrieb.",
  )}`;

// Same events as the contact section (…_home_v2 feeds the Google Ads conversions), plus where in the blog it happened.
export function trackBlog(event: "whatsapp_click" | "phone_click" | "email_click" | "form_cta" | "check_cta" | "tool_cta", where: string, slug?: string) {
  trackGaEvent(`${event}_blog`, { where, slug });
  const sendTo = getContactGoogleAdsConversion(event);
  if (sendTo) trackGoogleAdsConversion(sendTo, { where });
}

const WAICON = <img src="/assets/v2/logos/whatsapp.svg" alt="" className="h-[18px] w-[18px]" style={{ filter: "brightness(0) invert(1)" }} />;

/* ---------- direct contact buttons ---------- */

export function ContactButtons({ post, where, dark = false }: { post?: BlogPost; where: string; dark?: boolean }) {
  const base = "inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 text-[0.76rem] font-black uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 active:scale-[0.98]";
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <a href="#contact" onClick={() => trackBlog("form_cta", where, post?.slug)} className={`${base} bg-[#007aff] text-white shadow-[0_14px_30px_rgba(0,122,255,0.28)]`}>
        Anfrage starten <ArrowRight size={15} aria-hidden />
      </a>
      <a href={waLink(post)} target="_blank" rel="noopener noreferrer" onClick={() => trackBlog("whatsapp_click", where, post?.slug)} className={`${base} bg-[#25d366] text-white`}>
        {WAICON} WhatsApp
      </a>
      <a href={`tel:${PHONE}`} onClick={() => trackBlog("phone_click", where, post?.slug)} className={`${base} ${dark ? "bg-white text-[#0e0e10]" : "bg-[#0e0e10] text-white"}`}>
        <Phone size={15} strokeWidth={2.4} aria-hidden /> Anrufen
      </a>
    </div>
  );
}

/* ---------- address bar: opens the Website-Check pop-up ---------- */

export function CheckStrip({ post, where = "strip" }: { post: BlogPost; where?: string }) {
  const [url, setUrl] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    trackBlog("check_cta", where, post.slug);
    openWebsiteCheck({ url: url.trim(), source: `blog:${post.slug}` });
  };
  return (
    <aside className="my-10 rounded-[20px] bg-[#e9f2ff] p-5 sm:p-6" aria-label="Kostenloser Website-Check">
      <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Kostenlos · ca. 1 Minute</p>
      <p className="mt-2 text-[clamp(1.25rem,2.2vw,1.55rem)] font-bold leading-[1.12] tracking-[-0.04em] text-[#0e0e10]">Wie viele Anfragen verliert deine Website gerade?</p>
      <p className="mt-2 max-w-[52ch] text-[0.98rem] font-medium leading-[1.5] text-[#424245]">Gib deine Adresse ein. Du bekommst eine Note von 0 bis 100 und die drei wichtigsten Baustellen per E-Mail.</p>
      <form onSubmit={submit} noValidate className="mt-4 flex h-14 items-center gap-2 rounded-full bg-white pl-4 pr-1.5 shadow-[0_10px_28px_-14px_rgba(0,64,160,0.4)] sm:pl-5">
        <Globe size={18} strokeWidth={2} aria-hidden className="flex-none text-[#86868b]" />
        <label htmlFor={`bc-url-${where}`} className="sr-only">Deine Website</label>
        <input
          id={`bc-url-${where}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="meinbetrieb.de"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          className="h-full min-w-0 flex-1 bg-transparent text-[1rem] font-semibold tracking-[-0.02em] text-[#0e0e10] outline-none placeholder:font-medium placeholder:text-[#a1a1a6]"
        />
        <button type="submit" className="group inline-flex h-11 flex-none items-center gap-2 rounded-full bg-[#007aff] px-4 text-[0.74rem] font-black uppercase tracking-[0.12em] text-white sm:px-5">
          <span className="hidden sm:inline">Website prüfen</span>
          <span className="sm:hidden">Prüfen</span>
          <ArrowRight size={15} strokeWidth={2.6} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    </aside>
  );
}

/* ---------- proof: what we built, in numbers ---------- */

// Which client results fit which article: the first matching rule's clients come first, then the general ones fill up to three.
// Slugs are the ones in caseList.ts. Clients without a measured number show their short fact instead.
const PROOF_RULES: [RegExp, string[]][] = [
  [/google-ranking-verbessern/, ["herkules", "dogru"]], // the article itself discusses these two
  [/mitarbeiter|azubi|recruit|bewerb/, ["orchidee", "treu"]],
  [/kanzlei|anwael|rechtsanw|arztpraxen|praxis/, ["dogru", "sg"]],
  [/rohrreinigung|notdienst/, ["onkel", "waschbar"]],
  [/sanitaer|heizung|haustechnik|waermepumpe|baustellenfotos|marketing-kalender/, ["treu", "herkules"]],
  [/fliesen|badsanierung|schreiner|tischler/, ["bergstone", "herkules"]],
  [/elektriker|dachdecker|maler|garten|schreiner|fenster|photovoltaik|handwerk/, ["treu", "onkel", "herkules"]],
  [/instagram|facebook|meta-ads|kalender/, ["so", "orchidee"]],
  [/google ads|ads-|-ads|ads$|werbung/, ["waschbar", "ft"]],
  [/bewertung|maps|unternehmensprofil|ortsseiten|einzugsgebiet|ludwigshafen|ki-sichtbarkeit|seo|ranking/, ["herkules", "treu"]],
  [/kosten|baukasten|beispiele|impressum|barrierefrei|formular|website/, ["herkules", "bergstone"]],
];
const PROOF_DEFAULT = ["herkules", "waschbar", "treu"];

export function proofSlugs(post: BlogPost): string[] {
  const s = `${post.slug} ${post.category}`.toLowerCase();
  const first = PROOF_RULES.find(([re]) => re.test(s))?.[1] ?? [];
  return [...new Set([...first, ...PROOF_DEFAULT])].slice(0, 3);
}

export function ProofRow({ post, where = "proof" }: { post: BlogPost; where?: string }) {
  const cases = proofSlugs(post)
    .map((slug) => CASE_LIST.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => !!c && !!(c.stat || c.facts?.length));
  if (!cases.length) return null;
  return (
    <aside className="my-12" aria-label="Ergebnisse unserer Kunden">
      <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Das haben wir für Kunden gebaut</p>
      <p className="mt-2 max-w-[30ch] text-[clamp(1.35rem,2.4vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.045em] text-[#0e0e10]">Echte Anfragen, aus echten Websites.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {cases.map((c) => (
          <a
            key={c.slug}
            href={c.page ?? "/referenzen"}
            onClick={() => trackGaEvent("blog_proof_click", { where, slug: post.slug, client: c.slug })}
            className="group flex flex-col rounded-[18px] p-5 transition-transform hover:-translate-y-0.5"
            style={{ background: c.tint }}
          >
            {c.stat ? (
              <>
                <span className="text-[clamp(1.9rem,3.4vw,2.4rem)] font-bold leading-none tracking-[-0.055em] text-[#0e0e10]">{c.stat}</span>
                <span className="mt-2 text-[0.95rem] font-semibold leading-[1.35] tracking-[-0.015em] text-[#424245]">{c.statRest}</span>
              </>
            ) : (
              <span className="text-[1.15rem] font-bold leading-[1.2] tracking-[-0.035em] text-[#0e0e10]">{c.facts?.[0]}</span>
            )}
            <span className="mt-4 flex items-center justify-between gap-2 pt-1 text-[0.82rem] font-bold text-[#0e0e10]">
              {c.client}
              <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden className="text-[#007aff] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-[0.92rem] font-semibold text-[#6b7280]">
        Wie das bei dir aussehen kann? <a href="#contact" onClick={() => trackBlog("form_cta", where, post.slug)} className="text-[#007aff] underline decoration-[#007aff]/30 underline-offset-[3px] hover:decoration-[#007aff]">Erzähl uns kurz von deinem Betrieb.</a>
      </p>
    </aside>
  );
}

/* ---------- free tool 1: Anfragen-Selbsttest ---------- */

const ALL_TESTS = [
  { q: "Kann man deine Telefonnummer am Handy antippen, um anzurufen?", fix: "Telefonnummer als Antipp-Link", why: "Wer schnell Hilfe braucht, tippt, statt abzuschreiben." },
  { q: "Gibt es einen WhatsApp-Button?", fix: "WhatsApp-Button", why: "Kunden schicken lieber ein Foto vom Problem als eine lange Mail." },
  { q: "Steht ein kurzes Formular direkt auf der Startseite?", fix: "Anfrageformular auf der Startseite", why: "Jeder zusätzliche Klick kostet Anfragen, besonders abends." },
  { q: "Hat jede deiner Leistungen eine eigene Seite?", fix: "Eine eigene Seite pro Leistung", why: "Nur so findet Google dich für die einzelnen Suchen." },
  { q: "Zeigst du echte Bewertungen oder Kundenstimmen auf der Startseite?", fix: "Bewertungen auf der Startseite", why: "Fremde Stimmen überzeugen mehr als eigene Versprechen." },
  { q: "Lädt deine Seite am Handy in unter 3 Sekunden?", fix: "Schnellere Ladezeit am Handy", why: "Viele springen ab, bevor die Seite da ist." },
] as const;

const PRO_RE = /kanzlei|anwael|rechtsanw|steuerberater|praxis|arztpraxen|zahnarzt/i;
// Kanzleien and Praxen: no WhatsApp question, "Terminbuchung" instead (WhatsApp is sensitive for Verschwiegenheit and Gesundheitsdaten)
const PRO_TEST = { q: "Können Mandanten oder Patienten online einen Termin für das Erstgespräch anfragen?", fix: "Online-Terminanfrage", why: "Viele fragen abends an, wenn niemand erreichbar ist." } as const;

export function SelfTest({ post }: { post: BlogPost }) {
  const pro = PRO_RE.test(post.slug);
  const TESTS = pro ? ALL_TESTS.map((t, i) => (i === 1 ? PRO_TEST : t)) : ALL_TESTS;
  const [a, setA] = useState<(boolean | null)[]>(() => TESTS.map(() => null));
  const answered = a.filter((x) => x !== null).length;
  const done = answered === TESTS.length;
  const yes = a.filter(Boolean).length;
  const missing = TESTS.filter((_, i) => a[i] === false);

  useEffect(() => {
    if (done) trackGaEvent("blog_selftest_done", { slug: post.slug, yes });
  }, [done, post.slug, yes]);

  const set = (i: number, v: boolean) => setA((p) => p.map((x, j) => (j === i ? v : x)));
  const tone = yes >= 5 ? "#1a9f4b" : yes >= 3 ? "#e08600" : "#d70015";

  return (
    <section className="my-12 rounded-[20px] bg-[#f5f5f7] p-4 sm:p-6" aria-labelledby="selftest-title">
      <div className="flex items-baseline justify-between gap-4 px-1">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Selbsttest · 1 Minute</p>
        <p className="text-[0.9rem] font-bold tabular-nums text-[#0e0e10]">
          {answered} <span className="text-[#86868b]">von {TESTS.length}</span>
        </p>
      </div>
      <h2 id="selftest-title" className="mt-2 px-1 text-[clamp(1.35rem,2.4vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.045em] text-[#0e0e10]">Wie gut fängt deine Website Anfragen ein?</h2>
      <ul className="mt-4 grid gap-2">
        {TESTS.map((t, i) => (
          <li key={t.q} className="rounded-[14px] bg-white p-3.5 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <p className="text-[0.98rem] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0e0e10]">{t.q}</p>
            <div className="mt-3 flex flex-none gap-2 sm:mt-0" role="group" aria-label={t.q}>
              {([true, false] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={a[i] === v}
                  onClick={() => set(i, v)}
                  className={`min-h-10 min-w-[4.5rem] rounded-full px-4 text-[0.85rem] font-bold transition-colors ${a[i] === v ? (v ? "bg-[#007aff] text-white" : "bg-[#0e0e10] text-white") : "bg-[#f5f5f7] text-[#424245] hover:bg-[#e8e8ed]"}`}
                >
                  {v ? "Ja" : "Nein"}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div aria-live="polite">
        {done && (
          <div className="mt-5 rounded-[16px] bg-white p-5">
            <p className="text-[2.4rem] font-bold leading-none tracking-[-0.06em]" style={{ color: tone }}>
              {yes} <span className="text-[1.2rem] text-[#86868b]">von {TESTS.length}</span>
            </p>
            {missing.length === 0 ? (
              <p className="mt-3 text-[1rem] font-semibold leading-[1.5] text-[#0e0e10]">Stark. Die Grundlagen stehen. Der Website-Check zeigt dir, was darüber hinaus noch Anfragen kostet.</p>
            ) : (
              <>
                <p className="mt-3 text-[1rem] font-semibold leading-[1.5] text-[#0e0e10]">Das kostet dich gerade Anfragen:</p>
                <ul className="mt-3 grid gap-2">
                  {missing.map((m) => (
                    <li key={m.fix} className="flex gap-3 text-[0.98rem] font-medium leading-[1.45] text-[#424245]">
                      <X size={17} strokeWidth={3} aria-hidden className="mt-0.5 flex-none text-[#d70015]" />
                      <span><strong className="font-bold text-[#0e0e10]">{m.fix}.</strong> {m.why}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#website-check" data-source={`blog:${post.slug}:selftest`} onClick={() => trackBlog("check_cta", "selftest", post.slug)} className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#007aff] px-5 text-[0.76rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
                Website automatisch prüfen <ArrowRight size={15} aria-hidden />
              </a>
              <a href="#contact" onClick={() => trackBlog("form_cta", "selftest", post.slug)} className="border-b-2 border-[#0e0e10] pb-0.5 text-[0.95rem] font-black tracking-[-0.03em] text-[#0e0e10] transition-opacity hover:opacity-60">
                {missing.length ? "Das für mich beheben lassen" : "Gespräch anfragen"}
              </a>
            </div>
          </div>
        )}
      </div>
      {!done && <p className="mt-4 px-1 text-[0.86rem] font-medium text-[#6b7280]">Ehrlich antworten, nichts wird gespeichert.</p>}
    </section>
  );
}

/* ---------- free tool 2: Anfragen-Rechner ---------- */

const eur = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;

function Field({ id, label, suffix, value, onChange, min, max, step }: { id: string; label: string; suffix: string; value: number; onChange: (n: number) => void; min: number; max: number; step: number }) {
  return (
    <div className="rounded-[14px] bg-white p-3.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.9rem] font-semibold leading-[1.3] text-[#424245]">
        {label}
        <span className="flex-none text-[1.05rem] font-bold tabular-nums text-[#0e0e10]">
          {value.toLocaleString("de-DE")} {suffix}
        </span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-[#007aff]" />
    </div>
  );
}

export function InquiryCalc({ post }: { post: BlogPost }) {
  const [visitors, setVisitors] = useState(400);
  const [now, setNow] = useState(1);
  const [goal, setGoal] = useState(3);
  const [value, setValue] = useState(1500);
  const [close, setClose] = useState(35);
  const res = useMemo(() => {
    const extra = Math.max(0, (visitors * (goal - now)) / 100);
    const jobs = extra * (close / 100);
    return { extra, jobs, revenue: jobs * value, year: jobs * value * 12 };
  }, [visitors, now, goal, value, close]);

  return (
    <section className="my-12 rounded-[20px] bg-[#f5f5f7] p-4 sm:p-6" aria-labelledby="calc-title">
      <p className="px-1 text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Rechner · kostenlos</p>
      <h2 id="calc-title" className="mt-2 px-1 text-[clamp(1.35rem,2.4vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.045em] text-[#0e0e10]">Was wäre dir jede Anfrage mehr wert?</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Field id="calc-v" label="Besucher pro Monat" suffix="" value={visitors} onChange={setVisitors} min={50} max={5000} step={50} />
        <Field id="calc-w" label="Durchschnittlicher Auftrag" suffix="€" value={value} onChange={setValue} min={100} max={20000} step={100} />
        <Field id="calc-n" label="Davon schreiben oder rufen heute an" suffix="%" value={now} onChange={(n) => setNow(Math.min(n, goal))} min={0} max={10} step={0.5} />
        <Field id="calc-g" label="Dein Wunschwert" suffix="%" value={goal} onChange={(n) => setGoal(Math.max(n, now))} min={1} max={15} step={0.5} />
        <div className="sm:col-span-2">
          <Field id="calc-c" label="Anfragen, die zum Auftrag werden" suffix="%" value={close} onChange={setClose} min={5} max={90} step={5} />
        </div>
      </div>
      <div className="mt-4 rounded-[16px] bg-[#0e0e10] p-5 text-white" aria-live="polite">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#5aa9ff]">Dein Rechenbeispiel</p>
        <p className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none tracking-[-0.06em] text-white">
          +{res.extra.toLocaleString("de-DE", { maximumFractionDigits: 1 })} <span className="text-[1.1rem] font-semibold tracking-[-0.02em] text-white/60">Anfragen im Monat</span>
        </p>
        <p className="mt-3 text-[1.02rem] font-medium leading-[1.5] text-white/80">
          Das wären rund <strong className="font-bold text-white">{res.jobs.toLocaleString("de-DE", { maximumFractionDigits: 1 })} Aufträge</strong> mehr, also etwa <strong className="font-bold text-white">{eur(res.revenue)}</strong> im Monat und <strong className="font-bold text-white">{eur(res.year)}</strong> im Jahr.
        </p>
        <p className="mt-3 text-[0.82rem] font-medium leading-[1.4] text-white/50">Rechenbeispiel mit deinen Annahmen, keine Prognose. Was möglich ist, hängt von Branche, Region und Website ab.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href="#contact" onClick={() => trackBlog("tool_cta", "calc", post.slug)} className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#007aff] px-5 text-[0.76rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
            So kommen wir dahin <ArrowRight size={15} aria-hidden />
          </a>
          <a href="#website-check" data-source={`blog:${post.slug}:calc`} onClick={() => trackBlog("check_cta", "calc", post.slug)} className="border-b-2 border-white pb-0.5 text-[0.95rem] font-black tracking-[-0.03em] text-white transition-opacity hover:opacity-60">
            Erst die Website prüfen
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- direct contact, between article and FAQ ---------- */

export function ContactBand({ post, where = "band" }: { post: BlogPost; where?: string }) {
  return (
    <aside className="my-14 rounded-[20px] border border-black/[0.08] p-5 sm:p-7" aria-label="Direkt Kontakt aufnehmen">
      <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Lieber direkt sprechen?</p>
      <p className="mt-2 max-w-[28ch] text-[clamp(1.35rem,2.4vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.045em] text-[#0e0e10]">Schreib uns, was dein Betrieb braucht.</p>
      <p className="mt-2 max-w-[52ch] text-[0.98rem] font-medium leading-[1.5] text-[#424245]">Kostenlos und ohne Verkaufsdruck. Du bekommst eine ehrliche Antwort, ob und wie wir dir mehr Anfragen bringen können.</p>
      <div className="mt-5">
        <ContactButtons post={post} where={where} />
      </div>
    </aside>
  );
}

/* ---------- phones: a bar that follows the reader ---------- */

export function StickyBar({ post }: { post: BlogPost }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contact");
    let inContact = false;
    let past = false;
    const update = () => setShow(past && !inContact);
    const onScroll = () => {
      past = window.scrollY > 700;
      update();
    };
    const io = contact
      ? new IntersectionObserver(([e]) => {
          inContact = e.isIntersecting;
          update();
        })
      : null;
    if (contact) io?.observe(contact);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const item = "flex min-h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[0.8rem] font-black tracking-[0.01em] active:scale-[0.97]";
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.08] bg-white/92 px-3 pt-2.5 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-[520px] gap-2">
        <a href={`tel:${PHONE}`} tabIndex={show ? 0 : -1} onClick={() => trackBlog("phone_click", "sticky", post.slug)} className={`${item} bg-[#0e0e10] text-white`}>
          <Phone size={16} strokeWidth={2.4} aria-hidden /> Anrufen
        </a>
        <a href={waLink(post)} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} onClick={() => trackBlog("whatsapp_click", "sticky", post.slug)} className={`${item} bg-[#25d366] text-white`}>
          <MessageCircle size={16} strokeWidth={2.4} aria-hidden /> WhatsApp
        </a>
        <a href="#website-check" data-source={`blog:${post.slug}:sticky`} tabIndex={show ? 0 : -1} onClick={() => trackBlog("check_cta", "sticky", post.slug)} className={`${item} bg-[#007aff] text-white`}>
          Gratis-Check
        </a>
      </div>
    </div>
  );
}

/* ---------- desktop sidebar card ---------- */

export function SidebarLead({ post }: { post: BlogPost }) {
  const service = postService(post);
  return (
    <div className="mt-8 grid gap-3">
      <div className="rounded-[20px] bg-[#007aff] p-5 text-white">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-white/70">Kostenlos</p>
        <p className="mt-2 text-[1.2rem] font-bold leading-[1.15] tracking-[-0.04em] text-white">Website-Check: deine Note in einer Minute.</p>
        <a href="#website-check" data-source={`blog:${post.slug}:sidebar`} onClick={() => trackBlog("check_cta", "sidebar", post.slug)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-[0.76rem] font-black uppercase tracking-[0.12em] text-[#007aff] transition-transform hover:-translate-y-0.5">
          Website prüfen <ArrowRight size={15} aria-hidden />
        </a>
      </div>
      <div className="rounded-[20px] bg-[#f5f5f7] p-5">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">{service.label}</p>
        <p className="mt-2 text-[0.98rem] font-semibold leading-[1.4] tracking-[-0.02em] text-[#0e0e10]">{service.cta}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] font-bold">
          <a href="#contact" onClick={() => trackBlog("form_cta", "sidebar", post.slug)} className="text-[#007aff] underline decoration-[#007aff]/30 underline-offset-[3px] hover:decoration-[#007aff]">Anfrage starten</a>
          <a href={waLink(post)} target="_blank" rel="noopener noreferrer" onClick={() => trackBlog("whatsapp_click", "sidebar", post.slug)} className="text-[#0e0e10] underline decoration-black/25 underline-offset-[3px] hover:decoration-black">WhatsApp</a>
          <a href={`tel:${PHONE}`} onClick={() => trackBlog("phone_click", "sidebar", post.slug)} className="text-[#0e0e10] underline decoration-black/25 underline-offset-[3px] hover:decoration-black">{PHONE_LABEL}</a>
        </div>
      </div>
    </div>
  );
}
