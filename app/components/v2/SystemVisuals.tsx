import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Heart, Mail, MessageCircle, Phone, Search, Send } from "lucide-react";

/*
 * Four live motion graphics for the "So funktioniert dein Anfragesystem" rows.
 * Familiar interfaces (Google, ChatGPT, Claude, Gemini, Instagram, WhatsApp) are recreated as examples,
 * and only run while on screen. Reduced motion shows the finished state.
 */

const L = "/assets/v2/logos";
const EASE = [0.22, 1, 0.36, 1] as const;

// Steps a looping sequence while the element is in view. Returns the current step index.
function useLoop(ref: React.RefObject<Element | null>, durations: number[]) {
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? durations.length - 1 : 0);
  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => clearTimeout(t);
  }, [step, inView, reduce, durations]);
  return { step, reduce };
}

const GoogleWord = ({ className = "" }: { className?: string }) => (
  <span className={`font-medium tracking-[-0.02em] ${className}`} style={{ fontFamily: "'Product Sans','Avenir Next',Arial,sans-serif" }}>
    <span className="text-[#4285f4]">G</span>
    <span className="text-[#ea4335]">o</span>
    <span className="text-[#fbbc05]">o</span>
    <span className="text-[#4285f4]">g</span>
    <span className="text-[#34a853]">l</span>
    <span className="text-[#ea4335]">e</span>
  </span>
);

/* ---------- 01 Gefunden: Google results, your business climbs to the top ---------- */
const QUERY = "Elektriker Mannheim";
type Res = { id: string; url: string; title: string; me?: boolean };
const RESULTS: Res[] = [
  { id: "a", url: "verzeichnis.de › elektriker › mannheim", title: "Elektriker in Mannheim: Angebote vergleichen" },
  { id: "b", url: "ratgeber.de › elektro", title: "Elektroinstallation in Mannheim: Kosten 2026" },
  { id: "me", url: "dein-betrieb.de", title: "Dein Betrieb: Elektriker in Mannheim", me: true },
];

export function GoogleVisual() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 empty, 1 typing, 2 results, 3 climb, 4 hold
  const { step } = useLoop(ref, [600, 1300, 1400, 1100, 3200]);
  const typed = step === 0 ? "" : step === 1 ? QUERY.slice(0, 11) : QUERY;
  const order = step >= 3 ? [RESULTS[2], RESULTS[0], RESULTS[1]] : RESULTS;
  return (
    <div ref={ref} className="relative flex h-full w-full items-start justify-center overflow-hidden px-5 lg:items-center lg:bg-[linear-gradient(160deg,#eef3fb,#f7f9fc)] lg:p-10">
      <div className="w-full max-w-[520px] rounded-[18px] bg-white p-4 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.35)] sm:p-7">
        {/* phones: logo on top, search bar full width (like Google's own mobile page); wider: side by side */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <GoogleWord className="text-[1.6rem] sm:text-[2rem]" />
          <div className="flex h-11 w-full min-w-0 flex-1 items-center gap-2 rounded-full px-4 text-[0.92rem] text-[#202124] shadow-[0_1px_6px_rgba(32,33,36,.22)] sm:w-auto sm:text-[0.95rem]">
            <Search size={16} className="flex-none text-[#9aa0a6]" />
            <span className="truncate whitespace-nowrap">{typed}</span>
            {step <= 1 && <span className="h-5 w-[2px] animate-pulse bg-[#202124]" />}
          </div>
        </div>
        <div className="mt-3 flex gap-5 border-b border-[#e8eaed] pb-2 text-[0.78rem] text-[#5f6368]">
          <span className="border-b-[3px] border-[#1a73e8] pb-1.5 font-semibold text-[#1a73e8]">Alle</span>
          <span>Maps</span>
          <span>Bilder</span>
          <span>News</span>
        </div>
        <div className="mt-3 flex min-h-[270px] flex-col gap-1.5 sm:min-h-[300px] sm:gap-2">
          {step >= 2 &&
            order.map((r) => (
              <motion.div
                layout
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ layout: { duration: 0.9, ease: EASE }, duration: 0.4 }}
                className={`rounded-[12px] px-3 py-2.5 sm:py-3 ${r.me ? "bg-[#eaf3ff] shadow-[inset_0_0_0_2px_#007aff]" : ""}`}
              >
                <div className="flex min-w-0 items-center gap-2 text-[0.72rem] text-[#4d5156]">
                  <span className={`h-5 w-5 flex-none rounded-full ${r.me ? "bg-[#007aff]" : "bg-[#e8eaed]"}`} />
                  <span className="truncate">{r.url}</span>
                </div>
                <div className="mt-1 text-[0.95rem] leading-snug text-[#1a0dab] sm:text-[1.02rem]">{r.title}</div>
                {r.me ? (
                  <div className="mt-1 text-[0.75rem] text-[#4d5156]">
                    <span className="text-[#f9ab00]">★★★★★</span> 4,9 · Notdienst · Heute geöffnet
                  </div>
                ) : (
                  <div className="mt-2 h-2 w-3/5 rounded-full bg-[#e8eaed]" />
                )}
              </motion.div>
            ))}
        </div>
      </div>
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#007aff] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white sm:bottom-10 sm:px-5 sm:text-[0.72rem] sm:tracking-[0.16em]"
          >
            Ganz oben in deiner Stadt
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 02 Empfohlen: ChatGPT, Claude and Gemini take turns recommending you ---------- */
const ASSISTANTS = [
  { name: "ChatGPT", logo: "openai", invert: true, bg: "#212121", fg: "#ececec", bubble: "#303030", answer: ["Ich", "empfehle", "**Dein Betrieb.**", "Schnelle", "Termine", "und", "sehr", "gute", "Bewertungen."] },
  { name: "Claude", logo: "claude", invert: false, bg: "#faf9f5", fg: "#29261b", bubble: "#f0eee6", answer: ["Eine", "gute", "Wahl", "in", "Mannheim", "ist", "**Dein Betrieb.**", "Klares", "Angebot,", "faire", "Preise."] },
  { name: "Gemini", logo: "googlegemini", invert: false, bg: "#ffffff", fg: "#1f1f1f", bubble: "#f0f4f9", answer: ["Top", "bewertet", "in", "Mannheim:", "**Dein Betrieb.**", "Auch", "für", "Notdienste", "erreichbar."] },
];

export function AiVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [words, setWords] = useState(reduce ? 99 : 0);
  const a = ASSISTANTS[idx];

  useEffect(() => {
    if (reduce || !inView) return;
    if (words < a.answer.length) {
      const t = setTimeout(() => setWords((w) => w + 1), words === 0 ? 900 : 140);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % ASSISTANTS.length);
      setWords(0);
    }, 2600);
    return () => clearTimeout(t);
  }, [words, inView, reduce, a.answer.length]);

  return (
    <div ref={ref} className="relative flex h-full w-full flex-col overflow-hidden px-5 lg:bg-[linear-gradient(160deg,#f3f1fb,#f7f9fc)] lg:p-10">
      <div className="flex justify-center gap-1 sm:justify-start sm:gap-2">
        {ASSISTANTS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => {
              setIdx(i);
              setWords(0);
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[0.78rem] font-semibold transition-colors sm:gap-2 sm:px-3.5 sm:text-[0.8rem] ${i === idx ? "bg-white text-[#0e0e10] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)]" : "text-[#6b7280] hover:text-[#0e0e10]"}`}
          >
            <img src={`${L}/${x.logo}.svg`} alt="" className="h-4 w-4" />
            {x.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={a.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="-mb-8 mt-4 flex flex-1 flex-col rounded-[18px] p-5 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.4)] sm:mt-5 sm:p-6 lg:mb-0"
          style={{ background: a.bg, color: a.fg }}
        >
          <div className="flex items-center gap-2.5 text-[1rem] font-semibold">
            <img src={`${L}/${a.logo}.svg`} alt="" className="h-6 w-6" style={a.invert ? { filter: "invert(1)" } : undefined} />
            {a.name}
          </div>
          <div className="ml-auto mt-6 max-w-[88%] rounded-[20px] px-4 py-3 text-[0.94rem] leading-snug sm:mt-8 sm:max-w-[85%] sm:text-[0.98rem]" style={{ background: a.bubble }}>
            Welchen Elektriker in Mannheim empfiehlst du?
          </div>
          {/* explicit colour: the global p colour would otherwise turn ChatGPT's answer dark grey on dark */}
          <p className="mt-5 text-[1.02rem] leading-[1.5] sm:mt-6 sm:text-[1.08rem]" style={{ color: a.fg }}>
            {a.answer.slice(0, words).map((w, i) =>
              w.startsWith("**") ? (
                <motion.b key={i} initial={{ backgroundColor: "rgba(0,122,255,0.35)" }} animate={{ backgroundColor: "rgba(0,122,255,0.12)" }} transition={{ duration: 1.2 }} className="rounded px-1 text-[#007aff]">
                  {w.replace(/\*\*/g, "")}{" "}
                </motion.b>
              ) : (
                <span key={i}>{w} </span>
              ),
            )}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- 03 Gesehen werden: your reel plays, people react and follow ---------- */
const REELS = ["/assets/v2/explainer/reel-filming.jpg", "/assets/v2/explainer/reel-phone.jpg", "/assets/v2/explainer/reel-search.jpg"];

export function InstagramVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [reel, setReel] = useState(0);
  const [hearts, setHearts] = useState<number[]>([]);
  const [following, setFollowing] = useState(Boolean(reduce));

  useEffect(() => {
    if (reduce || !inView) return;
    const r = setInterval(() => setReel((x) => (x + 1) % REELS.length), 4200);
    const h = setInterval(() => setHearts((list) => [...list.slice(-6), Date.now()]), 650);
    const f = setInterval(() => setFollowing((v) => !v), 4200);
    return () => {
      clearInterval(r);
      clearInterval(h);
      clearInterval(f);
    };
  }, [inView, reduce]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden lg:flex lg:items-center lg:justify-center lg:bg-[linear-gradient(160deg,#fdf1f4,#f6f1fb)] lg:p-6">
      <div className="absolute left-1/2 top-2 aspect-[9/19] w-[66%] max-w-[270px] -translate-x-1/2 lg:relative lg:left-auto lg:top-auto lg:h-[88%] lg:max-h-[560px] lg:w-auto lg:max-w-none lg:translate-x-0 rounded-[38px] bg-[#0e0e10] p-[9px] shadow-[0_40px_90px_-40px_rgba(15,23,42,0.6)]">
        <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-black">
          <AnimatePresence>
            <motion.img
              key={REELS[reel]}
              src={REELS[reel]}
              alt=""
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.6 }, scale: { duration: 4.2, ease: "linear" } }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),transparent_22%,transparent_42%,rgba(0,0,0,.7)_82%)] lg:bg-[linear-gradient(180deg,rgba(0,0,0,.35),transparent_25%,transparent_60%,rgba(0,0,0,.6))]" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[0.85rem] font-bold text-white">
            <span>Reels</span>
            <img src={`${L}/instagram.svg`} alt="" className="h-5 w-5" style={{ filter: "brightness(0) invert(1)" }} />
          </div>
          <div className="absolute bottom-[41%] right-3 flex lg:bottom-24 flex-col items-center gap-5 text-white">
            <Heart size={24} className="fill-[#ff3b5c] text-[#ff3b5c]" />
            <MessageCircle size={24} />
            <Send size={22} />
          </div>
          {hearts.map((id, i) => (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -180, x: (i % 2 ? 1 : -1) * 18, scale: 1.1 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute bottom-[46%] right-5 lg:bottom-28 text-[#ff3b5c]"
            >
              <Heart size={20} className="fill-current" />
            </motion.span>
          ))}
          <div className="absolute bottom-[21%] left-4 right-4 text-white lg:bottom-5">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <span className="h-6 w-6 flex-none rounded-full bg-[#007aff] lg:h-7 lg:w-7" />
              <span className="min-w-0 truncate text-[0.8rem] font-bold lg:text-[0.85rem]">dein.betrieb</span>
              <motion.span layout className={`flex-none rounded-md border px-2 py-0.5 text-[0.7rem] font-semibold ${following ? "border-white/40 bg-transparent" : "border-white bg-white text-[#0e0e10]"}`}>
                {following ? "Gefolgt" : "Folgen"}
              </motion.span>
            </div>
            <div className="mt-2 text-[0.78rem] leading-snug text-white/90">So läuft eine Elektroinstallation bei uns ab.</div>
            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/30">
              <motion.div key={reel} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: reduce ? 0 : 4.2, ease: "linear" }} className="h-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 Angefragt: enquiries land on the phone ---------- */
const NOTIFS = [
  { icon: <Mail size={20} />, bg: "#007aff", title: "Neue Anfrage", sub: "Website-Formular · Elektroinstallation" },
  { icon: <Phone size={20} />, bg: "#34c759", title: "Eingehender Anruf", sub: "über deine Website" },
  { icon: <img src={`${L}/whatsapp.svg`} alt="" className="h-5 w-5" style={{ filter: "brightness(0) invert(1)" }} />, bg: "#25d366", title: "WhatsApp", sub: "Hallo, habt ihr diese Woche Zeit?" },
];

export function EnquiryVisual() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 empty lockscreen, 1..3 notifications arrive, 4 hold
  const { step } = useLoop(ref, [900, 1200, 1200, 1400, 2800]);
  const shown = Math.min(step, NOTIFS.length);
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden lg:flex lg:items-center lg:justify-center lg:bg-[linear-gradient(160deg,#e9f2ff,#f7f9fc)] lg:p-6">
      <div className="absolute left-1/2 top-2 aspect-[9/19] w-[66%] max-w-[270px] -translate-x-1/2 lg:relative lg:left-auto lg:top-auto lg:h-[88%] lg:max-h-[560px] lg:w-auto lg:max-w-none lg:translate-x-0 rounded-[38px] bg-[#0e0e10] p-[9px] shadow-[0_40px_90px_-40px_rgba(15,23,42,0.6)]">
        <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[linear-gradient(170deg,#1c2b4a,#0b1426_60%,#101a2e)] text-white">
          <div className="mt-11 whitespace-nowrap text-center text-[0.84rem] font-medium text-white/75 sm:mt-12 sm:text-[0.9rem]">Dienstag, 11. November</div>
          <div className="text-center text-[3.6rem] font-semibold leading-none tracking-[-0.04em] sm:text-[4rem]">9:41</div>
          <div className="absolute inset-x-2.5 top-[36%] flex flex-col gap-2 sm:inset-x-3 sm:top-[42%] sm:gap-2.5">
            <AnimatePresence>
              {NOTIFS.slice(0, shown)
                .map((n, i) => ({ n, i }))
                .reverse()
                .map(({ n, i }) => (
                  <motion.div
                    layout
                    key={i}
                    initial={{ opacity: 0, y: -24, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex items-start gap-2.5 rounded-[16px] bg-white/90 p-2.5 text-[#0e0e10] backdrop-blur sm:gap-3 sm:rounded-[18px] sm:p-3"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-white" style={{ background: n.bg }}>
                      {n.icon}
                    </span>
                    {/* "jetzt" sits on the title line, so the text gets the full width below it */}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="min-w-0 text-[0.8rem] font-bold leading-tight">{n.title}</span>
                        <span className="flex-none text-[0.64rem] text-[#86868b]">jetzt</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[0.74rem] leading-snug text-[#424245]">{n.sub}</span>
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
