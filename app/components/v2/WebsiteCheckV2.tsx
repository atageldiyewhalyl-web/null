import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
import { NavBar } from "./HeroV2";
import FooterV2 from "./FooterV2";
import FaqV2 from "./FaqV2";
import ContactV2 from "./ContactV2";
import ScanStage from "./ScanStage";
import { AREAS, CheckFlow } from "./WebsiteCheckForm";
import CasesBentoV2 from "./CasesBentoV2";
import StimmenV2 from "./StimmenV2";

/*
 * /website-check: the free website check (lead magnet).
 * Hero = the form: a browser-style address bar; after a valid address the e-mail step opens under it.
 * The make-server-ea5edff4 /website-check endpoint answers at once, runs the checks in the background and
 * e-mails the report. No result is shown on screen (Halyl's decision, 11 Nov 2026): after sending, the page
 * shows what is being checked and where the report goes.
 * Everything in the "Beispiel-Report" and the area tiles is illustrative and labelled as an example.
 * OPT_IN_TEXT must stay identical to OPT_IN_TEXT in supabase/functions/make-server-ea5edff4/website_check.ts.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const GOOD = "#1a9f4b";
const MID = "#e08600";
const BAD = "#d70015";
const tone = (v: number) => (v >= 70 ? GOOD : v >= 40 ? MID : BAD);


const FAQS = [
  { q: "Was kostet der Website-Check?", a: "Nichts. Du bekommst den Report kostenlos per E-Mail. Werbe-Mails bekommst du nur, wenn du das Häkchen dafür setzt." },
  { q: "Wie lange dauert es?", a: "Meist etwa eine Minute. Die Ladezeit-Messung von Google braucht am längsten. Schau auch im Spam-Ordner nach, falls nichts ankommt." },
  { q: "Was wird genau geprüft?", a: "Deine Startseite: wie gut Kunden dich erreichen, wie schnell sie lädt, die Grundlagen für Google, Pflichtseiten und Technik sowie Barrierefreiheit. Du bekommst eine Note von 0 bis 100 und die drei wichtigsten Baustellen." },
  { q: "Ist das eine rechtliche Prüfung?", a: "Nein. Bei Impressum, Datenschutz und Cookies prüfen wir nur technisch, ob die Seiten und Elemente vorhanden sind. Das ersetzt keine Rechtsberatung." },
  { q: "Was passiert mit meinen Daten?", a: "Wir speichern deine Website-Adresse, deine E-Mail und das Ergebnis, damit wir dir den Report schicken und bei Fragen darauf antworten können. Mehr dazu in der Datenschutzerklärung." },
];

/* ---------- small helpers ---------- */

function Ring({ value, size, stroke, color, track = "#e9edf3", run, children }: { value: number; size: number; stroke: number; color: string; track?: string; run: boolean; children?: ReactNode }) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - value / 100) : c }}
          animate={{ strokeDashoffset: run ? c * (1 - value / 100) : c }}
          transition={{ duration: reduce ? 0 : 1.5, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------- the five areas: one small picture each ---------- */

const Row = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div className="flex items-center gap-2.5 rounded-[10px] bg-white px-3.5 py-2.5 text-[0.9rem] font-semibold tracking-[-0.01em] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
    <span className="grid h-5 w-5 flex-none place-items-center rounded-full text-[0.7rem] font-black text-white" style={{ background: ok ? GOOD : MID }}>{ok ? <Check size={12} strokeWidth={3.5} aria-hidden /> : "!"}</span>
    {children}
  </div>
);

type AreaKey = (typeof AREAS)[number]["key"];

function AreaVisual({ k, seen }: { k: AreaKey; seen: boolean }) {
  const reduce = useReducedMotion();
  const pop = (n: number) => ({ initial: reduce ? false : { opacity: 0, y: 10 }, animate: seen ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5, delay: reduce ? 0 : 0.15 + n * 0.12, ease: EASE } });
  if (k === "contact")
    return (
      <div className="grid gap-2">
        <motion.div {...pop(0)}><Row ok><Phone size={15} aria-hidden className="text-[#6b7280]" /> Telefon zum Antippen</Row></motion.div>
        <motion.div {...pop(1)}><Row ok><MessageCircle size={15} aria-hidden className="text-[#6b7280]" /> WhatsApp</Row></motion.div>
        <motion.div {...pop(2)}><Row ok={false}>Kundenstimmen auf der Startseite</Row></motion.div>
      </div>
    );
  if (k === "speed")
    return (
      <div className="flex items-center gap-5">
        <Ring value={48} size={96} stroke={10} color={MID} track="#fff" run={seen}>
          <span className="text-[1.7rem] font-bold tracking-[-0.05em] tabular-nums">48</span>
        </Ring>
        <div className="grid flex-1 gap-2">
          {[{ l: "Handy", v: 48 }, { l: "Computer", v: 86 }].map((b, n) => (
            <div key={b.l}>
              <div className="flex justify-between text-[0.8rem] font-semibold text-[#6b7280]"><span>{b.l}</span><span style={{ color: tone(b.v) }}>{b.v}</span></div>
              <span className="mt-1 block h-2 overflow-hidden rounded-full bg-white">
                <motion.span className="block h-full rounded-full" style={{ background: tone(b.v) }} initial={{ width: reduce ? `${b.v}%` : 0 }} animate={seen ? { width: `${b.v}%` } : {}} transition={{ duration: 1, delay: reduce ? 0 : 0.3 + n * 0.15, ease: EASE }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  if (k === "seo")
    return (
      <motion.div {...pop(0)} className="rounded-[12px] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
        <p className="text-[0.75rem] font-medium text-[#6b7280]">dein-betrieb.de</p>
        <p className="mt-1 text-[1.02rem] font-semibold leading-[1.3] tracking-[-0.02em] text-[#1a0dab]">Dein Betrieb · <span className="rounded-[4px] bg-[#eaf3ff] px-1 text-[#007aff]">Elektriker in Mannheim</span></p>
        <span className="mt-2.5 block h-2 w-full rounded-full bg-[#e9edf3]" />
        <span className="mt-1.5 block h-2 w-[70%] rounded-full bg-[#e9edf3]" />
      </motion.div>
    );
  if (k === "legal")
    return (
      <div className="grid grid-cols-2 gap-2">
        {([["HTTPS", true], ["Impressum", true], ["Datenschutz", true], ["Cookies", false]] as const).map(([l, ok], n) => (
          <motion.div key={l} {...pop(n)}><Row ok={ok}>{l}</Row></motion.div>
        ))}
      </div>
    );
  return (
    <div className="flex items-stretch gap-2.5">
      <motion.div {...pop(0)} className="grid flex-1 place-items-center rounded-[12px] bg-white py-4 text-[1.7rem] font-bold tracking-[-0.04em] text-[#c7c7cc] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">Aa</motion.div>
      <motion.div {...pop(1)} className="grid place-items-center text-[#007aff]"><ArrowRight size={20} strokeWidth={2.6} aria-hidden /></motion.div>
      <motion.div {...pop(2)} className="grid flex-1 place-items-center rounded-[12px] bg-[#0e0e10] py-4 text-[1.7rem] font-bold tracking-[-0.04em] text-white">Aa</motion.div>
    </div>
  );
}

const AREA_TEXT: Record<AreaKey, string> = {
  contact: "Button gleich oben, Telefon zum Antippen, Formular, WhatsApp und echte Kundenstimmen: Wie leicht wird aus einem Besucher eine Anfrage?",
  speed: "Wie schnell lädt deine Seite am Handy und am Computer? Gemessen mit Google PageSpeed.",
  seo: "Seitentitel, Beschreibung, Überschrift, deine Stadt, Firmendaten und wie viele Seiten Google von dir kennt.",
  legal: "HTTPS, Impressum, Datenschutz, Cookie-Banner: gefunden oder nicht. Technisch geprüft, keine Rechtsberatung.",
  a11y: "Kontraste, Alternativtexte, Sprache und der Barrierefreiheits-Wert von Google Lighthouse.",
};

function AreaCard({ a, n }: { a: (typeof AREAS)[number]; n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: reduce ? 0 : (n % 3) * 0.07, ease: EASE }}
      className={`flex flex-col rounded-[22px] bg-[#f5f5f7] p-6 md:p-7 ${n < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${n === 4 ? "sm:col-span-2 lg:col-span-3" : ""}`}
    >
      <p className="text-[0.72rem] font-black tabular-nums tracking-[0.16em] text-[#007aff]">0{n + 1}</p>
      <h3 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em]">{a.title}</h3>
      <p className="mt-2 text-[0.98rem] font-medium leading-[1.45] tracking-[-0.01em] text-[#6b7280]">{AREA_TEXT[a.key]}</p>
      <div className="mt-6 flex min-h-[132px] flex-1 flex-col justify-end">
        <AreaVisual k={a.key} seen={seen} />
      </div>
    </motion.div>
  );
}

/* ---------- page ---------- */

export default function WebsiteCheckV2() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } });

  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} current="/website-check" />
      </div>
      <main className="bg-white text-[#0e0e10]">
        {/* hero: the address bar is the form */}
        <section className="relative overflow-hidden pb-20 pt-24 md:pb-28 lg:pt-16">
          <div className="relative mx-auto grid w-full max-w-[1360px] grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:gap-14">
            <div className="relative mx-auto w-full max-w-[720px] text-center [container-type:inline-size] lg:mx-0 lg:text-left">
              <motion.p {...rise(0)} className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Kostenloser Website-Check</motion.p>
              {/* always two lines; the size follows the text column (container query): "Bringt deine Website" is ~8.75em wide, so 11cqw fills it */}
              <motion.h1 {...rise(0.06)} className="mt-5 text-[min(11cqw,7rem)] font-bold leading-[0.92] tracking-[-0.07em]">
                <span className="block whitespace-nowrap text-[#0e0e10]/30">Bringt deine Website</span>
                <span className="block whitespace-nowrap">
                  genug Anfragen<span className="text-[#007aff]">?</span>
                </span>
              </motion.h1>
              <motion.p {...rise(0.14)} className="mx-auto mt-6 max-w-[40ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245] md:text-[1.22rem] lg:mx-0">
                Gib deine Adresse ein. Wir prüfen sie in fünf Bereichen und schicken dir eine Note von 0 bis 100 und deine drei wichtigsten Baustellen.
              </motion.p>
              <motion.div {...rise(0.24)} className="mt-9 md:mt-11">
                <CheckFlow />
              </motion.div>
            </div>
            <motion.div {...rise(0.3)} className="w-full">
              <ScanStage />
            </motion.div>
          </div>
        </section>

        {/* the five areas */}
        <section className="py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <div className="mx-auto max-w-[900px] text-center">
              <h2 className="text-[clamp(2.2rem,5.4vw,4.4rem)] font-bold leading-[0.93] tracking-[-0.065em]">
                <span className="text-[#0e0e10]/30">Fünf Bereiche,</span> eine Note<span className="text-[#007aff]">.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[44ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">Wir schauen auf das, was aus einem Besucher eine Anfrage macht.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
              {AREAS.map((a, n) => <AreaCard key={a.key} a={a} n={n} />)}
            </div>
            <div className="mt-12 text-center">
              <a href="#wc-url" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => document.getElementById("wc-url")?.focus({ preventScroll: true }), 600); }} className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#007aff] px-8 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5">
                Jetzt Website prüfen
                <ArrowRight size={17} strokeWidth={2.6} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        {/* proof, as on the homepage: selected work, then what clients say */}
        <CasesBentoV2 />
        <StimmenV2 />

        <FaqV2 items={FAQS} />
        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}
