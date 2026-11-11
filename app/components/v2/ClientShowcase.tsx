import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { REFS } from "./links";

/*
 * Webdesign hero: real client websites (laptop + phone mockups) that fade in one after another.
 * Images: public/assets/v2/mockups/*.webp (white background, blended away with mix-blend-multiply).
 * Order set by Halyl (11 Nov 2026): Treu, FT, S&O, SG, Waschbar.
 * treu.webp: the private browser tab row was painted over (original in the session scratchpad).
 * SG's mockup shows "ab 149€" on SG's own site; shown at Halyl's request.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const EVERY = 4200; // ms per site

const SITES = [
  { img: "treu", client: "Treu Haustechnik", place: "Mannheim", domain: "treu-haustechnik.de", slug: "treu" },
  { img: "ft", client: "FT Sicherheitstechnik", place: "Mannheim", domain: "ftsicherheitstechnik.com", slug: "ft" },
  { img: "so", client: "S&O Beauty", place: "Mannheim", domain: "beautyso.de", slug: "so" },
  { img: "sg", client: "SG Laserzentrum", place: "8 Standorte", domain: "sg-laserzentrum.de", slug: "sg" },
  { img: "waschbar", client: "Waschbar", place: "Heidelberg & Ludwigshafen", domain: "waschbar.eu", slug: "waschbar" },
] as const;

const src = (img: string) => `/assets/v2/mockups/${img}.webp`;

export default function ClientShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = inView && !paused && !reduce;

  // load all mockups up front so every change is a clean fade
  useEffect(() => {
    SITES.forEach((s) => {
      const im = new Image();
      im.src = src(s.img);
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SITES.length), EVERY);
    return () => clearTimeout(t);
  }, [i, running]);

  const s = SITES[i];

  return (
    <div ref={ref} className="relative mx-auto mt-10 w-full max-w-[980px] md:mt-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* the devices */}
      <div className="relative mx-auto aspect-[1000/634] w-full">
        <span aria-hidden className="absolute inset-x-[12%] bottom-[2%] h-[10%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(15,23,42,0.18),rgba(15,23,42,0))] blur-[6px]" />
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={s.img}
            src={src(s.img)}
            alt={`Website von ${s.client} auf Laptop und Smartphone, gebaut von nüll.`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 1.01, filter: "blur(6px)" }}
            transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE }}
            className="absolute inset-x-0 bottom-0 mx-auto max-h-full w-full select-none object-contain object-bottom mix-blend-multiply"
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* which client, and a way to the case study */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.a
            key={s.slug}
            href={`${REFS}/${s.slug}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-4 text-left shadow-[0_12px_32px_-16px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.05] transition-transform hover:-translate-y-0.5"
          >
            <span className="rounded-full bg-[#eaf3ff] px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.14em] text-[#007aff]">Live</span>
            <span className="leading-tight">
              <span className="block text-[0.95rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{s.client}</span>
              <span className="block text-[0.8rem] font-medium text-[#6b7280]">
                {s.domain} · {s.place}
              </span>
            </span>
            <ArrowUpRight size={18} strokeWidth={2.4} aria-hidden className="ml-1 text-[#0e0e10] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </AnimatePresence>

        {/* one segment per site; the active one fills while it is shown */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Kundenwebsites">
          {SITES.map((x, n) => (
            <button
              key={x.slug}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={x.client}
              onClick={() => setI(n)}
              className="relative h-1.5 w-8 overflow-hidden rounded-full bg-[#dfe4ec] transition-[width] duration-300 hover:bg-[#cfd6e2] sm:w-10"
            >
              {n === i && (
                <motion.span
                  key={`${x.slug}-${running}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-[#007aff]"
                  initial={{ width: running ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: running ? EVERY / 1000 : 0, ease: "linear" }}
                />
              )}
              {n < i && <span className="absolute inset-0 rounded-full bg-[#007aff]/35" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
