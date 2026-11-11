import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Mail, Star } from "lucide-react";

/*
 * Hero motion graphic for /website-check, in the style of the nüll. explainer loops
 * (public/assets/v2/explainer: white cards, Google blue, "Beispiel" in the corner, no hard cuts).
 * One loop of the product story, about 11 s:
 *   1 type   "dein-betrieb.de" types into a browser bar
 *   2 scan   a blue line sweeps the page, results pop out next to the parts it passes
 *   3 score  the browser gives way to a score ring that counts up
 *   4 mail   the ring becomes the e-mail notification "Dein Website-Check ist da"
 * Everything is an example (labelled "Beispiel"); no real site or result is shown.
 * Reduced motion: a still frame of the scan with all results visible.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const URL_TEXT = "dein-betrieb.de";
const SCORE = 74;
const GOOD = "#1a9f4b";
const MID = "#e08600";

type Phase = "type" | "scan" | "score" | "mail";
const DURATION: Record<Phase, number> = { type: 1600, scan: 4400, score: 2300, mail: 3000 };
const NEXT: Record<Phase, Phase> = { type: "scan", scan: "score", score: "mail", mail: "type" };

// results that pop out while the scan line passes; top = where on the page (in %), side = which side the tag sits
const FINDINGS = [
  { top: 14, side: "right", ok: true, label: "Telefon antippbar", at: 0.15 },
  { top: 38, side: "left", ok: true, label: "Button gleich oben", at: 0.35 },
  { top: 58, side: "right", ok: true, label: "Ladezeit 2,1 s", at: 0.55 },
  { top: 80, side: "left", ok: false, label: "Kundenstimmen fehlen", at: 0.78 },
] as const;

function useCount(target: number, run: boolean, ms: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return setV(0);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / ms));
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return v;
}

function Tag({ ok, label, side }: { ok: boolean; label: string; side: "left" | "right" }) {
  return (
    <span className={`flex items-center gap-2 whitespace-nowrap rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-[0.74rem] font-semibold sm:text-[0.82rem] tracking-[-0.01em] text-[#0e0e10] shadow-[0_10px_30px_-8px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04] ${side === "left" ? "flex-row-reverse pl-3.5 pr-1.5" : ""}`}>
      <span className="grid h-5 w-5 flex-none place-items-center rounded-full text-white" style={{ background: ok ? GOOD : MID }}>
        {ok ? <Check size={12} strokeWidth={3.5} aria-hidden /> : <span className="text-[0.7rem] font-black">!</span>}
      </span>
      {label}
    </span>
  );
}

// the example website inside the browser: grey skeleton, one blue button, an empty review slot
function Skeleton() {
  return (
    <div className="flex h-full flex-col gap-[7%] px-[7%] py-[6%]">
      <div className="flex items-center justify-between">
        <span className="h-3 w-16 rounded-full bg-[#0e0e10]/80" />
        <span className="flex gap-2">
          {[0, 1, 2].map((n) => <span key={n} className="h-2 w-8 rounded-full bg-[#e3e6ec]" />)}
        </span>
      </div>
      <div className="grid gap-2.5">
        <span className="h-4 w-[78%] rounded-full bg-[#0e0e10]/85" />
        <span className="h-4 w-[56%] rounded-full bg-[#0e0e10]/85" />
        <span className="mt-1 h-2.5 w-[88%] rounded-full bg-[#e3e6ec]" />
        <span className="flex items-center gap-2.5 pt-2">
          <span className="h-7 w-28 rounded-full bg-[#007aff]" />
          <span className="h-7 w-24 rounded-full border-2 border-[#e3e6ec]" />
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {[0, 1, 2].map((n) => <span key={n} className="rounded-[10px] bg-[#eef2f7]" />)}
      </div>
      <div className="flex items-center gap-2 rounded-[10px] border-2 border-dashed border-[#e3e6ec] px-3 py-2.5">
        {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} className="text-[#e3e6ec]" fill="#e3e6ec" aria-hidden />)}
        <span className="ml-1 h-2 w-20 rounded-full bg-[#eef2f7]" />
      </div>
    </div>
  );
}

export default function ScanStage() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "scan" : "type");
  const [typed, setTyped] = useState(reduce ? URL_TEXT.length : 0);
  const score = useCount(SCORE, phase === "score" || phase === "mail", 1400);

  // drive the loop
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setPhase((p) => NEXT[p]), DURATION[phase]);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  // typing in the address bar
  useEffect(() => {
    if (reduce) return;
    if (phase !== "type") return;
    setTyped(0);
    const step = Math.floor((DURATION.type - 400) / URL_TEXT.length);
    const timers = Array.from({ length: URL_TEXT.length }, (_, n) => setTimeout(() => setTyped(n + 1), 250 + n * step));
    return () => timers.forEach(clearTimeout);
  }, [phase, reduce]);

  const browserVisible = phase === "type" || phase === "scan";
  const scanning = phase === "scan";

  return (
    <div className="relative mx-auto aspect-[1/1] w-full max-w-[560px] select-none overflow-hidden rounded-[28px] bg-[#f5f7fb]" aria-hidden>

      {/* 1 + 2: browser with the example site */}
      <AnimatePresence>
        {browserVisible && (
          <motion.div
            key="browser"
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-x-[10%] bottom-[12%] top-[12%] flex flex-col overflow-visible sm:inset-x-[13%]"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.05]">
              <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
                <span className="flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
                </span>
                <span className="flex h-7 flex-1 items-center rounded-full bg-[#f5f5f7] px-3 text-[0.8rem] font-medium text-[#0e0e10]">
                  {URL_TEXT.slice(0, typed)}
                  {phase === "type" && <span className="ml-px h-3.5 w-[1.5px] animate-pulse bg-[#007aff]" />}
                </span>
              </div>
              <div className="relative flex-1">
                <Skeleton />
                {/* the scan line */}
                {scanning && !reduce && (
                  <motion.div initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: DURATION.scan / 1000 - 0.6, ease: "linear" }} className="pointer-events-none absolute inset-x-0 h-0">
                    <span className="absolute inset-x-0 -top-10 h-10 bg-[linear-gradient(180deg,rgba(0,122,255,0),rgba(0,122,255,0.12))]" />
                    <span className="absolute inset-x-0 top-0 h-[2px] bg-[#007aff] shadow-[0_0_14px_rgba(0,122,255,0.8)]" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* results pop out next to the browser as the line passes */}
            {scanning &&
              FINDINGS.map((f) => (
                <motion.div
                  key={f.label}
                  initial={reduce ? false : { opacity: 0, scale: 0.6, x: f.side === "right" ? -10 : 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: reduce ? 0 : (DURATION.scan / 1000 - 0.6) * f.at, ease: EASE }}
                  className={`absolute z-20 ${f.side === "right" ? "right-[-6%] sm:right-[-14%]" : "left-[-6%] sm:left-[-14%]"}`}
                  style={{ top: `calc(${f.top}% + 20px)` }}
                >
                  <Tag ok={f.ok} label={f.label} side={f.side} />
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3: score ring */}
      <AnimatePresence>
        {phase === "score" && (
          <motion.div key="score" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5, y: 30 }} transition={{ duration: 0.6, ease: EASE }} className="absolute inset-0 grid place-items-center">
            <div className="relative h-[46%] w-[46%]">
              <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e3e8f0" strokeWidth="10" />
                <motion.circle cx="60" cy="60" r="52" fill="none" stroke={GOOD} strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 1 - SCORE / 100 }} transition={{ duration: 1.4, ease: EASE }} />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-[clamp(2.6rem,7vw,4.2rem)] font-bold leading-none tracking-[-0.06em] tabular-nums text-[#0e0e10]">{score}</p>
                  <p className="mt-1 text-[0.85rem] font-semibold text-[#6b7280]">von 100</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4: the report arrives */}
      <AnimatePresence>
        {phase === "mail" && (
          <motion.div key="mail" initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="absolute inset-x-[9%] top-1/2 -translate-y-1/2">
            <div className="flex items-center gap-4 rounded-[20px] bg-white p-4 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.4)] ring-1 ring-black/[0.04] md:p-5">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-[12px] bg-[#007aff] text-white">
                <Mail size={22} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[1.02rem] font-bold tracking-[-0.02em] text-[#0e0e10]">Dein Website-Check ist da</span>
                <span className="block truncate text-[0.88rem] font-medium text-[#6b7280]">dein-betrieb.de · {SCORE} von 100</span>
              </span>
              <span className="self-start text-[0.78rem] font-medium text-[#86868b]">jetzt</span>
            </div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5, ease: EASE }} className="mx-[6%] -mt-2 rounded-b-[18px] bg-white/70 px-5 pb-3 pt-5 text-[0.85rem] font-medium text-[#424245] shadow-[0_20px_40px_-30px_rgba(15,23,42,0.4)]">
              3 Baustellen · Ladezeit, Kundenstimmen, Seitentitel
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
