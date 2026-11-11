import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Menu, MonitorSmartphone, Phone, X } from "lucide-react";
import { BLOG, REFS, SERVICE, SERVICES, toHome, CHECK } from "./links";

const PRIMARY_BTN =
  "group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]";
const TEXT_LINK =
  "border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55";

// every item points at something that exists on  (the old "Branchen" anchor and "/#services" led nowhere)
const NAV: { label: string; href: string; menu?: boolean }[] = [
  { label: "Leistungen", href: SERVICES, menu: true },
  { label: "Fälle", href: REFS },
  { label: "Website-Check", href: CHECK },
  { label: "Preise", href: "/preise" },
  { label: "Blog", href: BLOG },
];
// the Leistungen dropdown: one entry per service page, marked with the logos of the platforms it covers
// (webdesign has no platform, so it gets a plain device icon in nüll. blue)
const B = "/assets/v2/brands";
const L = "/assets/v2/logos";
export const SERVICE_NAV: { label: string; text: string; href: string; logos: string[] }[] = [
  { label: "Webdesign", text: "Websites, die zur Anfrage führen", href: SERVICE.web, logos: [] },
  { label: "SEO", text: "Bei Google gefunden werden", href: SERVICE.seo, logos: [`${B}/google-g.svg`] },
  { label: "Google Ads", text: "Anzeigen genau dann, wenn jemand sucht", href: SERVICE.ads, logos: [`${B}/google-ads.svg`] },
  { label: "KI-Sichtbarkeit", text: "Von ChatGPT und Co. empfohlen werden", href: SERVICE.ai, logos: [`${L}/openai.svg`, `${L}/claude.svg`, `${L}/googlegemini.svg`] },
  { label: "Content", text: "Videos und Posts, die zeigen, was du kannst", href: SERVICE.content, logos: [`${B}/instagram.svg`, `${B}/facebook.svg`] },
];

// one logo fills the tile; several sit as small overlapping chips
export function ServiceMark({ logos, size = "md" }: { logos: string[]; size?: "md" | "sm" }) {
  const box = size === "md" ? "h-12 w-12 rounded-[12px]" : "h-10 w-10 rounded-[10px]";
  return (
    <span className={`grid flex-none place-items-center bg-[#f5f5f7] ${box}`}>
      {logos.length === 0 ? (
        <MonitorSmartphone size={size === "md" ? 22 : 19} strokeWidth={2} className="text-[#007aff]" />
      ) : logos.length === 1 ? (
        <img src={logos[0]} alt="" className={size === "md" ? "h-6 w-6" : "h-5 w-5"} />
      ) : (
        <span className="flex -space-x-1.5">
          {logos.map((l) => (
            <span key={l} className={`grid place-items-center rounded-full bg-white ring-2 ring-[#f5f5f7] ${size === "md" ? "h-[22px] w-[22px]" : "h-5 w-5"}`}>
              <img src={l} alt="" className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} />
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
const EASE = [0.22, 1, 0.36, 1] as const;
const isService = (path?: string) => !!path && (path === SERVICES || SERVICE_NAV.some((s) => s.href === path));

// Desktop: opens on hover or click, closes on leaving, Escape, a click outside or tabbing away.
function ServicesMenu({ overview, current }: { overview: string; current?: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const hoverAt = useRef(0);
  const active = isService(current);
  const show = () => {
    window.clearTimeout(timer.current);
    if (!open) hoverAt.current = Date.now();
    setOpen(true);
  };
  // a mouse click right after the hover opened it must not close it again; keyboard and later clicks toggle
  const toggle = () => setOpen((v) => (v && Date.now() - hoverAt.current < 400 ? true : !v));
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      ref.current?.querySelector("button")?.focus();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={toggle}
        className={`flex items-center gap-1.5 text-[0.72rem] font-black uppercase tracking-[0.22em] transition-colors hover:text-[#0e0e10] ${active ? "text-[#007aff]" : "text-[#111111]"}`}
      >
        Leistungen
        <ChevronDown size={14} strokeWidth={2.8} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          // Tailwind v4's -translate-x-1/2 uses the CSS `translate` property, so it stacks with motion's transform
          <motion.div
            key="services-menu"
            id="services-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute left-1/2 top-full z-40 origin-top -translate-x-1/2 pt-5"
          >
            <div
              className="grid w-[620px] grid-cols-2 gap-1 rounded-[18px] bg-white p-2.5 shadow-[0_18px_48px_rgba(15,23,42,0.13)] ring-1 ring-black/[0.06]"
            >
              {SERVICE_NAV.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  aria-current={s.href === current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3.5 rounded-[12px] p-2.5 transition-colors duration-300 hover:bg-[#f5f5f7] focus-visible:bg-[#f5f5f7] focus-visible:outline-none"
                >
                  <ServiceMark logos={s.logos} />
                  <span className="min-w-0">
                    <span className={`flex items-center gap-1 text-[1rem] font-bold tracking-[-0.03em] ${s.href === current ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                      {s.label}
                      <ArrowUpRight size={15} strokeWidth={2.4} className="text-[#007aff] opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-[0.84rem] font-medium leading-snug tracking-[-0.01em] text-[#6b7280]">{s.text}</span>
                  </span>
                </a>
              ))}
              <a
                href={overview}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between gap-3 rounded-[12px] bg-[#007aff]/[0.07] px-4 py-2.5 transition-colors duration-300 hover:bg-[#007aff]/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff]"
              >
                <span>
                  <span className="block text-[1rem] font-bold tracking-[-0.03em] text-[#0e0e10]">Alles im Überblick</span>
                  <span className="mt-0.5 block text-[0.84rem] font-medium leading-snug text-[#6b7280]">So greift alles ineinander</span>
                </span>
                <ArrowRight size={18} strokeWidth={2.4} className="flex-none text-[#007aff] transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const WA = `https://wa.me/4915256569852?text=${encodeURIComponent("Hallo nüll., ich interessiere mich für ein Anfragesystem für meinen Betrieb.")}`;

const CTA_LABEL = "Anfrage starten";
const CTA_HREF = "#contact";
const CASES_HREF = "#faelle";

type Proof = {
  client: string;
  src: string;
  alt: string;
  // value + label only where a report backs the number; otherwise the mockup shows the client name only
  value?: string;
  label?: string;
  // short qualitative line (no number) for clients without measured results
  note?: string;
  // desktop placement inside the hero stage
  pos: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
};

/*
 * Every number comes from a nüll. report or a live API pull (Nov 2026):
 * Waschbar: Gesamtbericht Google Ads, 6 Aug – 5 Nov 2026 (2,491 direction requests).
 * Herkules: SEO report Oct 2026, "umzugsunternehmen mannheim" avg. position 9.1.
 * Bergstone: Meta Ads account "Keramiksan", lifetime to 10 Nov 2026 (36,757 reach).
 * Kanzlei Doğru: review Nov 2026 data.json: 132 unique web form enquiries (7 Aug – 2 Nov)
 *   + 98 calls from Google Ads (31 Aug – 1 Nov) = 230. That is ~2.6 a day, not 5.
 * Update only from a fetched report. Mockups live in /assets/v2/mockups (trimmed webp).
 */
const M = "/assets/v2/mockups";
const PROOFS: Proof[] = [
  { client: "Waschbar", src: `${M}/waschbar.webp`, alt: "Website von Waschbar auf Laptop und Smartphone", value: "2.491", label: "Routenanfragen über Google Ads, Aug. bis Nov. 2026", pos: { top: "1%", left: "0%" }, delay: 0.4 },
  { client: "Bergstone Keramiksan", src: `${M}/bergstone.webp`, alt: "Website von Bergstone Keramiksan auf Laptop und Smartphone", value: "36.757", label: "Menschen über Meta Ads erreicht, Okt. bis Nov. 2026", pos: { top: "1%", right: "0%" }, delay: 0.55 },
  { client: "Herkules Umzüge", src: `${M}/herkules.webp`, alt: "Website von Herkules Umzüge auf Laptop und Smartphone", value: "Seite 1", label: "bei Google für „Umzugsunternehmen Mannheim“, Okt. 2026", pos: { bottom: "4%", left: "0%" }, delay: 0.7 },
  { client: "Kanzlei Doğru", src: `${M}/hasan.webp`, alt: "Website der Kanzlei Doğru auf Laptop und Smartphone", value: "230 Anfragen", label: "per Website-Formular und Anruf, Aug. bis Nov. 2026", pos: { bottom: "4%", right: "0%" }, delay: 0.85 },
  { client: "Treu Haustechnik", src: `${M}/treu.webp`, alt: "Website von Treu Haustechnik auf Laptop und Smartphone", pos: { top: "0%", left: "23%" }, delay: 1.0 },
  { client: "SG Laserzentrum", note: "Online so hochwertig wie vor Ort.", src: `${M}/sg.webp`, alt: "Website von SG Laserzentrum auf Laptop und Smartphone", pos: { top: "0%", right: "23%" }, delay: 1.1 },
  { client: "FT Sicherheitstechnik", src: `${M}/ft.webp`, alt: "Website von FT Sicherheitstechnik auf Laptop und Smartphone", pos: { top: "41%", left: "0%" }, delay: 1.2 },
  { client: "S&O Beauty", note: "Online so hochwertig wie die Behandlung.", src: `${M}/so.webp`, alt: "Website von S&O Beauty auf Laptop und Smartphone", pos: { top: "41%", right: "0%" }, delay: 1.3 },
  { client: "B.Y. Consulting", src: `${M}/by.webp`, alt: "Website von B.Y. Consulting auf Laptop und Smartphone", pos: { bottom: "3%", left: "23%" }, delay: 1.4 },
  { client: "Onkel Abwassertechnik", src: `${M}/onkel.webp`, alt: "Website von Onkel Abwassertechnik auf Laptop und Smartphone", pos: { bottom: "3%", right: "23%" }, delay: 1.5 },
];

function Logo() {
  return (
    <a href="/" className="text-[1.6rem] font-bold tracking-[-0.04em] text-[#0e0e10]">
      nüll<span className="text-[#007aff]">.</span>
    </a>
  );
}

// onHome: false on other pages (e.g. /preise), so section anchors lead back to the homepage. current: path of the page we're on.
// Below lg the bar is fixed to the top (logo + menu button) and the menu opens full screen.
export function NavBar({ onHome = true, current }: { onHome?: boolean; current?: string }) {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const nav = NAV.map((item) => ({ ...item, href: toHome(item.href, onHome) }));

  // hairline under the fixed bar once the page has moved
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // open menu: page behind stays put, Escape closes
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* keeps the page content below the fixed bar on phones and tablets */}
      <div aria-hidden className="h-[64px] lg:hidden" />
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 lg:relative lg:z-30 lg:bg-transparent lg:shadow-none ${scrolled && !open ? "shadow-[0_1px_0_rgba(14,14,16,0.08)]" : ""}`}
      >
        <div className="mx-auto flex h-[64px] w-full max-w-[1360px] items-center justify-between px-4 md:px-8 lg:h-[72px]">
          <span className="relative z-[60]" onClick={close}>
            <Logo />
          </span>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) =>
              item.menu ? (
                <ServicesMenu key={item.label} overview={item.href} current={current} />
              ) : (
              <a
                key={item.label}
                href={item.href}
                aria-current={item.href === current ? "page" : undefined}
                className={`text-[0.72rem] font-black uppercase tracking-[0.22em] transition-colors hover:text-[#0e0e10] ${item.href === current ? "text-[#007aff]" : "text-[#111111]"}`}
              >
                {item.label}
              </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={CTA_HREF}
              className="hidden min-h-11 items-center rounded-full bg-[#007aff] px-6 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              {CTA_LABEL}
            </a>
            <button
              type="button"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full bg-[#f5f5f7] text-[#0e0e10] transition-colors active:scale-95 lg:hidden"
            >
              {open ? <X size={20} strokeWidth={2.4} /> : <Menu size={20} strokeWidth={2.4} />}
            </button>
          </div>
        </div>

        {/* phones and tablets: full-screen menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menü"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[64px] md:px-8 lg:hidden"
            >
              <nav aria-label="Hauptmenü" className="mt-4 border-t border-black/[0.07]">
                {nav.map((item, i) =>
                  item.menu ? (
                    <motion.div
                      key={item.label}
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.04, ease: EASE }}
                      className="border-b border-black/[0.07]"
                    >
                      <button
                        type="button"
                        aria-expanded={svcOpen}
                        aria-controls="mobile-services"
                        onClick={() => setSvcOpen((v) => !v)}
                        className="flex w-full items-center gap-4 py-4 text-left"
                      >
                        <span className="w-6 text-[0.8rem] font-semibold tabular-nums text-[#a1a1a6]">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`flex-1 text-[2.1rem] font-bold leading-none tracking-[-0.055em] ${isService(current) ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                          {item.label}
                        </span>
                        <ChevronDown size={24} strokeWidth={2.2} className={`text-[#007aff] transition-transform duration-300 ${svcOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {svcOpen && (
                          <motion.div
                            id="mobile-services"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-1 pb-4 pl-10">
                              {SERVICE_NAV.map((s) => (
                                <a
                                  key={s.href}
                                  href={s.href}
                                  onClick={close}
                                  aria-current={s.href === current ? "page" : undefined}
                                  className="flex items-center gap-3 rounded-[12px] py-1.5 active:bg-[#f5f5f7]"
                                >
                                  <ServiceMark logos={s.logos} size="sm" />
                                  <span className="min-w-0">
                                    <span className={`block text-[1.12rem] font-bold leading-tight tracking-[-0.035em] ${s.href === current ? "text-[#007aff]" : "text-[#0e0e10]"}`}>{s.label}</span>
                                    <span className="mt-0.5 block text-[0.82rem] font-medium leading-snug text-[#6b7280]">{s.text}</span>
                                  </span>
                                </a>
                              ))}
                              <a href={item.href} onClick={close} className="mt-1 inline-flex w-max items-center gap-1.5 py-1.5 text-[0.95rem] font-bold tracking-[-0.02em] text-[#007aff]">
                                Alles im Überblick
                                <ArrowRight size={16} strokeWidth={2.4} />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    aria-current={item.href === current ? "page" : undefined}
                    className="group flex items-center gap-4 border-b border-black/[0.07] py-4"
                  >
                    <span className="w-6 text-[0.8rem] font-semibold tabular-nums text-[#a1a1a6]">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 text-[2.1rem] font-bold leading-none tracking-[-0.055em] ${item.href === current ? "text-[#007aff]" : "text-[#0e0e10]"}`}>
                      {item.label}
                    </span>
                    <ArrowUpRight size={22} strokeWidth={2.2} className="text-[#007aff]" />
                  </motion.a>
                  ),
                )}
              </nav>

              <div className="mt-auto pt-8">
                <a href={CTA_HREF} onClick={close} className={`${PRIMARY_BTN} w-full`}>
                  {CTA_LABEL}
                  <ArrowRight size={18} />
                </a>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                  {[
                    { label: "WhatsApp", href: WA, ext: true, icon: <img src="/assets/v2/logos/whatsapp.svg" alt="" className="h-[20px] w-[20px]" style={{ filter: "brightness(0) invert(1)" }} />, bg: "#25d366" },
                    { label: "Anrufen", href: "tel:+4915256569852", icon: <Phone size={18} strokeWidth={2.2} />, bg: "#0e0e10" },
                    { label: "E-Mail", href: "mailto:info@nüll.com", icon: <Mail size={18} strokeWidth={2.2} />, bg: "#007aff" },
                  ].map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.ext ? "_blank" : undefined}
                      rel={c.ext ? "noopener noreferrer" : undefined}
                      onClick={close}
                      className="flex flex-col items-start gap-4 rounded-[18px] bg-[#f5f5f7] p-3.5"
                    >
                      <span className="grid h-9 w-9 flex-none place-items-center rounded-full text-white" style={{ background: c.bg }}>{c.icon}</span>
                      <span className="text-[0.9rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{c.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/*
 * Desktop: the mockups orbit the headline on an ellipse. Positions are written straight to the
 * DOM in a rAF loop (no React state per frame). Front of the ellipse = bigger and on top,
 * back = smaller, so it reads as a slow circular carousel. Hover pauses; reduced motion = static ring.
 */
// Alternate mockups with numbers and plain ones so the tall captioned cards never sit side by side on the ring.
function interleave(list: Proof[]) {
  const withNum = list.filter((p) => p.value);
  const plain = list.filter((p) => !p.value);
  const out: Proof[] = [];
  for (let i = 0; i < Math.max(withNum.length, plain.length); i++) {
    if (withNum[i]) out.push(withNum[i]);
    if (plain[i]) out.push(plain[i]);
  }
  return out;
}

/*
 * Ring geometry as fractions of the stage. Desktop: a wide ellipse around the headline.
 * Phone: the ellipse is wider than the screen (rx > 0.5), so the cards sweep in over the top, out past the edges
 * and back along the bottom, leaving the middle free for the text. Smaller cards, number + client only.
 */
type Ring = { rx: number; ry: number; lap: number; compact?: boolean; numW: string; plainW: string };
const RING_DESKTOP: Ring = { rx: 0.37, ry: 0.37, lap: 110, numW: "w-[clamp(220px,19vw,280px)]", plainW: "w-[clamp(170px,15vw,220px)]" };
const RING_PHONE: Ring = { rx: 0.74, ry: 0.41, lap: 70, compact: true, numW: "w-[clamp(132px,37vw,180px)]", plainW: "w-[clamp(132px,37vw,180px)]" };

function Orbit({ items: raw, reduce, ring = RING_DESKTOP }: { items: Proof[]; reduce: boolean | null; ring?: Ring }) {
  const items = interleave(raw);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paused = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const N = items.length;
    const SPEED = (2 * Math.PI) / ring.lap; // one full lap every ring.lap seconds
    let angle = -Math.PI / 2;
    let last = performance.now();
    let raf = 0;

    const place = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!paused.current && !reduce) angle += dt * SPEED;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (W === 0) {
        // this stage is hidden at the current breakpoint: idle cheaply
        if (!reduce) raf = requestAnimationFrame(place);
        return;
      }
      const cx = W / 2;
      const cy = H / 2;
      const rx = W * ring.rx;
      const ry = H * ring.ry;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = angle + (i * 2 * Math.PI) / N;
        const depth = (Math.sin(t) + 1) / 2; // 0 = back (top), 1 = front (bottom)
        const s = 0.8 + 0.2 * depth;
        const x = cx + rx * Math.cos(t) - el.offsetWidth / 2;
        const y = cy + ry * Math.sin(t) - el.offsetHeight / 2;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        el.style.zIndex = String(Math.round(depth * 10));
        el.style.opacity = (0.72 + 0.28 * depth).toFixed(3);
        el.style.visibility = "visible";
      });
      if (!reduce) raf = requestAnimationFrame(place);
    };

    raf = requestAnimationFrame(place);
    const ro = new ResizeObserver(() => {
      if (reduce) requestAnimationFrame(place);
    });
    ro.observe(stage);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [items.length, reduce, ring]);

  return (
    <div ref={stageRef} className="absolute inset-0">
      {items.map((p, i) => (
        <div
          key={p.client}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className={`invisible absolute left-0 top-0 will-change-transform ${p.value ? ring.numW : ring.plainW}`}
        >
          <ProofItem p={p} reduce={reduce} compact={ring.compact} />
        </div>
      ))}
    </div>
  );
}

function ProofItem({ p, reduce, compact = false }: { p: Proof; reduce: boolean | null; compact?: boolean }) {
  if (compact) {
    // phone ring: picture and the business name only. Numbers and source labels stay on desktop.
    return (
      <motion.figure
        initial={reduce ? false : { opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: reduce ? 0 : p.delay * 0.6 }}
        className="relative"
      >
        <img src={p.src} alt={p.alt} loading="eager" className="block w-full select-none" draggable={false} />
        <figcaption className="mt-1.5 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#86868b]">{p.client}</figcaption>
      </motion.figure>
    );
  }
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: reduce ? 0 : p.delay }}
      className="relative"
    >
      <img src={p.src} alt={p.alt} loading="eager" className="block w-full select-none" draggable={false} />
      <figcaption className="mt-2">
        {p.value && (
          <>
            <p className="text-[1.55rem] font-bold leading-none tracking-[-0.045em] text-[#0e0e10]">
              {p.value}
              <span className="text-[#007aff]">.</span>
            </p>
            <p className="mt-1.5 text-[0.82rem] font-medium leading-[1.35] tracking-[-0.01em] text-[#424245]">{p.label}</p>
          </>
        )}
        {p.note && <p className="text-[0.86rem] font-semibold leading-[1.3] tracking-[-0.02em] text-[#0e0e10]">{p.note}</p>}
        <p className="mt-1 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#86868b]">{p.client}</p>
      </figcaption>
    </motion.figure>
  );
}

export default function HeroV2() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative overflow-hidden bg-white text-[#0e0e10]">
      <NavBar />

      {/* Desktop stage: headline in the middle, photos pop in around it */}
      <div className="relative mx-auto hidden h-[min(840px,calc(100dvh-72px))] min-h-[740px] w-full max-w-[1360px] px-8 lg:block">
        <Orbit items={PROOFS} reduce={reduce} />

        <div className="absolute left-1/2 top-1/2 z-20 w-[min(600px,44%)] -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.h1 {...rise(0)} className="text-[clamp(3.6rem,5.6vw,5.6rem)] font-bold leading-[0.92] tracking-[-0.065em]">
            <span className="text-[#0e0e10]/30">Von null</span>
            <br />
            auf Anfrage<span className="text-[#007aff]">.</span>
          </motion.h1>
          <motion.p {...rise(0.12)} className="mx-auto mt-7 max-w-[30rem] text-[1.15rem] leading-[1.55] text-[#0e0e10]/65">
            Wir bauen dein Anfragesystem: bei Google gefunden, auf deiner Website überzeugt, jeden Monat gemessen.
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-9 flex items-center justify-center gap-6">
            <a href={CTA_HREF} className={PRIMARY_BTN}>
              {CTA_LABEL}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href={CASES_HREF} className={TEXT_LINK}>
              Fälle ansehen
            </a>
          </motion.div>
        </div>
      </div>

      {/* Phone and tablet: the same ring, tall and wider than the screen, so the cards circle over and under the text */}
      <div className="relative h-[calc(100svh-72px)] min-h-[640px] max-h-[920px] w-full overflow-hidden lg:hidden">
        <Orbit items={PROOFS} reduce={reduce} ring={RING_PHONE} />

        {/* soft white field behind the text, so cards passing the sides fade out under it instead of cutting words */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-[15] h-[62%] w-[130%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(closest-side, #fff 62%, rgba(255,255,255,0.85) 78%, rgba(255,255,255,0) 100%)" }}
        />
        <div className="absolute left-1/2 top-1/2 z-20 w-[min(88%,420px)] -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.h1 {...rise(0)} className="text-[clamp(2.7rem,12vw,4.4rem)] font-bold leading-[0.92] tracking-[-0.065em]">
            <span className="text-[#0e0e10]/30">Von null</span>
            <br />
            auf Anfrage<span className="text-[#007aff]">.</span>
          </motion.h1>
          <motion.p {...rise(0.12)} className="mx-auto mt-4 max-w-[22rem] text-[0.98rem] leading-[1.5] text-[#0e0e10]/65">
            Wir bauen dein Anfragesystem: bei Google gefunden, auf deiner Website überzeugt, jeden Monat gemessen.
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-6 flex flex-col items-center gap-4">
            <a href={CTA_HREF} className={PRIMARY_BTN}>
              {CTA_LABEL}
              <ArrowRight size={18} />
            </a>
            <a href={CASES_HREF} className={TEXT_LINK}>
              Fälle ansehen
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
