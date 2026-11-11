import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/*
 * "Was unsere Kunden sagen." Client quotes in an endless, slowly gliding row (after the systrastudios.de reviews row).
 * Keeps gliding on hover; trackpad, drag/swipe and the arrows move it. Reduced motion = plain swipe row.
 * Avatars are each client's real logo (taken from their own website / our project files; Orchidee from their ad).
 * Quotes come from CasesV2.tsx (Herkules + B.Y. from the previous site; the others written with the owners' consent).
 * Kanzlei Doğru left out on purpose. Each owner signs off the exact wording before launch.
 * Not Google reviews, so no Google icon and no star rating.
 * Phones (below md): PhoneStimmen, one big quote card plus a 2x5 wall of all ten marks (one-colour, /kunden/mono);
 * tap a mark to read that quote. Only business names are shown, never the owner's name.
 */

// Business names only, never the owner's name (Halyl, 2026-11-10).
type Quote = { text: string; biz: string; slug: string; r: number; dark?: boolean }; // r = width / height of the mono mark

const L = "/assets/v2/kunden";
const logo = (q: Quote) => `${L}/${q.slug}.webp`;
const mono = (q: Quote) => `${L}/mono/${q.slug}.png`; // one-colour versions for the phone logo wall (cut from the same files)
const color = (q: Quote) => `${L}/color/${q.slug}.png`; // the same cut in the real colours, shown for the selected client
const SQUARE = new Set(["sg", "so", "treu"]); // logos that are a coloured square: rounded corners in colour
// optical size: wide wordmarks get less height than square marks, so every mark carries about the same weight
const markH = (q: Quote, base: number) => Math.min(base, base * 1.05 / Math.pow(q.r, 0.45));
const QUOTES: Quote[] = [
  { text: "Jeden Monat sehen wir schwarz auf weiß, was die Werbung bringt. So ergibt Marketing für uns endlich Sinn.", biz: "Waschbar", slug: "waschbar", r: 3.53 },
  { text: "Der Prozess war klar, schnell und professionell. Wir wussten zu jedem Zeitpunkt, was passiert.", biz: "Herkules Umzüge", slug: "herkules", r: 2.82 },
  { text: "Die Videos zeigen unsere Arbeitsplatten so, wie sie wirklich aussehen. Genau so wollten wir uns online zeigen.", biz: "Bergstone Keramiksan", slug: "bergstone", r: 1.46 },
  { text: "Wir haben lange nach Pflegekräften gesucht. Über Facebook und Instagram kamen endlich die Bewerbungen, die wir brauchen.", biz: "Pflegedienst Orchidee", slug: "orchidee", r: 1.14 },
  { text: "Unsere Website sieht endlich so aus, wie wir arbeiten. Jede Woche kommt ein neuer Artikel online, ohne dass wir uns kümmern müssen.", biz: "Treu Haustechnik", slug: "treu", r: 1.18, dark: true },
  { text: "Die Website ist genau so ästhetisch, wie ich sie mir vorgestellt habe. Und meine Ideen waren schneller umgesetzt, als ich gedacht hätte.", biz: "SG Laserzentrum", slug: "sg", r: 0.85 },
  { text: "Unser Studio sieht online endlich so gepflegt aus wie vor Ort. Website und Instagram kommen aus einer Hand.", biz: "S&O Beauty", slug: "so", r: 1.25 },
  { text: "Unsere Leistungen sind jetzt so erklärt, dass Kunden sofort verstehen, was wir machen. Die Zusammenarbeit läuft unkompliziert.", biz: "FT Sicherheitstechnik", slug: "ft", r: 5.71 },
  { text: "Die Seite bringt es auf den Punkt: Wer ein Problem hat, sieht sofort, wie er uns erreicht. Genau so sollte es sein.", biz: "Onkel Abwassertechnik", slug: "onkel", r: 2.93 },
  { text: "nüll hat unsere Positionierung geschärft und daraus eine Website gebaut, die Vertrauen aufbaut, bevor das erste Gespräch beginnt.", biz: "B.Y. Consulting", slug: "by", r: 1.25 },
];

const SPEED = 0.035; // px per ms (about 35 px/s)
const GAP = 16;

function Card({ q }: { q: Quote }) {
  return (
    <figure className="flex w-[84vw] max-w-[380px] flex-none select-none flex-col justify-between rounded-[22px] md:rounded-[12px] bg-white p-6 md:w-[380px] md:p-7">
      <blockquote className="text-[1.04rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#0e0e10]">„{q.text}“</blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <span className={`flex h-[52px] w-[88px] flex-none items-center justify-center overflow-hidden rounded-[10px] border p-2 ${q.dark ? "border-transparent bg-[#111111]" : "border-black/10 bg-white"}`}>
          <img src={logo(q)} alt="" className="block max-h-full max-w-full object-contain" draggable={false} />
        </span>
        <span className="min-w-0 text-[0.95rem] font-semibold tracking-[-0.02em]">{q.biz}</span>
      </figcaption>
    </figure>
  );
}

const AUTO_MS = 7000;

function PhoneStimmen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0); // restarts the timer and the progress line after a tap
  const q = QUOTES[i];

  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setI((x) => (x + 1) % QUOTES.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [i, tick, inView, reduce]);

  const pick = (k: number) => {
    setI(k);
    setTick((t) => t + 1);
  };

  return (
    <div ref={ref} className="mx-auto mt-10 w-full max-w-[560px] px-4 md:hidden">
      {/* the quote: the client's mark on top, then their words, then the business */}
      <figure className="relative overflow-hidden rounded-[22px] bg-white px-6 pb-7 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-10 items-center justify-between">
              <img src={color(q)} alt="" style={{ height: markH(q, 40) }} className={`block w-auto max-w-[160px] object-contain object-left ${SQUARE.has(q.slug) ? "rounded-[7px]" : ""}`} draggable={false} />
              <span className="text-[0.8rem] font-semibold tabular-nums text-[#a1a1a6]">
                {String(i + 1).padStart(2, "0")} / {QUOTES.length}
              </span>
            </div>
            <blockquote className="mt-5 min-h-[8.4rem] text-[1.2rem] font-semibold leading-[1.38] tracking-[-0.025em] text-[#0e0e10]">„{q.text}“</blockquote>
            <figcaption className="mt-4 text-[0.92rem] font-semibold tracking-[-0.01em] text-[#6b7280]">{q.biz}</figcaption>
          </motion.div>
        </AnimatePresence>
        {/* how long until the next quote */}
        <div className="absolute inset-x-6 bottom-0 h-[3px] overflow-hidden rounded-full bg-[#eef0f3]">
          {!reduce && inView && <motion.div key={`${i}-${tick}`} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: AUTO_MS / 1000, ease: "linear" }} className="h-full bg-[#007aff]" />}
        </div>
      </figure>

      {/* all ten clients as one-colour marks on equal tiles; tap a mark to read that client's words */}
      <div className="mt-2.5 grid grid-cols-2 gap-2" role="tablist" aria-label="Kunden">
        {QUOTES.map((x, k) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            aria-selected={k === i}
            aria-label={x.biz}
            onClick={() => pick(k)}
            className={`flex h-[68px] items-center justify-center rounded-[18px] bg-white px-5 transition-[box-shadow,opacity] duration-300 ${k === i ? "shadow-[0_0_0_2px_#007aff]" : ""}`}
          >
            <span className="grid place-items-center">
              <img src={mono(x)} alt="" style={{ height: markH(x, 38) }} className={`block w-auto max-w-full object-contain transition-opacity duration-500 [grid-area:1/1] ${k === i ? "opacity-0" : "opacity-40"}`} draggable={false} />
              <img src={color(x)} alt="" style={{ height: markH(x, 38) }} className={`block w-auto max-w-full object-contain transition-opacity duration-500 [grid-area:1/1] ${SQUARE.has(x.slug) ? "rounded-[7px]" : ""} ${k === i ? "opacity-100" : "opacity-0"}`} draggable={false} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StimmenV2() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const plain = useRef<HTMLDivElement>(null);
  // Plain numbers + one rAF loop writing the transform directly (no React state, no animation library).
  const st = useRef({ offset: 0, target: null as number | null, half: 1, visible: true, dragging: false, lastX: 0 });

  useEffect(() => {
    if (reduce) return;
    const s = st.current;
    const apply = () => {
      const h = s.half;
      const m = ((s.offset % h) + h) % h;
      // three identical sets; the middle one is "home", so there are always cards on both sides
      if (track.current) track.current.style.transform = `translate3d(${-(h + m)}px,0,0)`;
    };
    const measure = () => {
      if (setRef.current) s.half = setRef.current.getBoundingClientRect().width + GAP;
      apply();
    };
    measure();
    window.addEventListener("resize", measure);
    const io = new IntersectionObserver(([e]) => (s.visible = e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (s.target !== null) {
        const d = s.target - s.offset;
        s.offset += d * Math.min(1, dt / 90);
        if (Math.abs(d) < 0.5) { s.offset = s.target; s.target = null; }
      } else if (s.visible && !s.dragging) {
        s.offset += dt * SPEED;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const el = wrap.current;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      s.target = null;
      s.offset += e.deltaX;
      apply();
    };
    el?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      el?.removeEventListener("wheel", onWheel);
    };
  }, [reduce]);

  const step = (dir: number) => {
    if (reduce) {
      const el = plain.current;
      const card = el?.querySelector("figure");
      el?.scrollBy({ left: dir * (card ? card.getBoundingClientRect().width + GAP : 380), behavior: "smooth" });
      return;
    }
    const s = st.current;
    const card = setRef.current?.querySelector("figure");
    const w = card ? card.getBoundingClientRect().width + GAP : 396;
    s.target = (s.target ?? s.offset) + dir * w;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    s.dragging = true;
    s.target = null;
    s.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.dragging) return;
    s.offset -= e.clientX - s.lastX;
    s.lastX = e.clientX;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    st.current.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const set = (suffix: string, ref?: React.RefObject<HTMLDivElement | null>) => (
    <div ref={ref} className="flex gap-4" aria-hidden={suffix !== "" || undefined}>
      {QUOTES.map((q) => (
        <Card key={q.slug + suffix} q={q} />
      ))}
    </div>
  );

  const pad = "pl-4 md:pl-8 lg:pl-[max(2rem,calc((100vw-1360px)/2+2rem))]";

  return (
    <section id="stimmen" className="relative overflow-hidden bg-[#f5f5f7] py-20 text-[#0e0e10] md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
          Was unsere Kunden sagen<span className="text-[#007aff]">.</span>
        </h2>
        <p className="mt-5 max-w-[46ch] text-[1.08rem] font-medium leading-[1.42] tracking-[-0.02em] text-[#424245]">
          Zehn Betriebe, die mit uns arbeiten. In ihren eigenen Worten.
        </p>
      </div>

      <PhoneStimmen />

      {reduce ? (
        <div ref={plain} className={`mt-12 hidden snap-x md:flex snap-mandatory gap-4 overflow-x-auto pb-2 pr-4 [scrollbar-width:none] md:mt-14 ${pad} [&::-webkit-scrollbar]:hidden`}>
          {QUOTES.map((q) => (
            <div key={q.slug} className="snap-start"><Card q={q} /></div>
          ))}
        </div>
      ) : (
        <div
          ref={wrap}
          className="mt-12 hidden cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:mt-14 md:block"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div ref={track} className={`flex w-max gap-4 will-change-transform ${pad}`}>
            {set("-a")}
            {set("", setRef)}
            {set("-c")}
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 hidden w-full max-w-[1360px] items-center justify-center gap-3 px-4 md:flex md:px-8">
        <button type="button" onClick={() => step(-1)} aria-label="Vorherige Stimme" className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#111111] transition-opacity hover:opacity-55">
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Nächste Stimme" className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#111111] transition-opacity hover:opacity-55">
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
