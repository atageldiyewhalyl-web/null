import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, Clapperboard, FileText, Globe, Image as ImageIcon, Smartphone, Sparkles } from "lucide-react";
import { NavBar } from "./HeroV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { ServiceVideo } from "./ServiceV2";
import { REFS } from "./links";

/*
 * Reference page template (v2): one client, told with their own brand colours, their own photos and
 * numbers from our reports. Every number carries its source in the config; estimates are labelled as such.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export type CaseConfig = {
  client: string;
  theme: { ink: string; accent: string; soft: string ; bright?: string };  // bright: the accent on dark backgrounds (defaults to accent) // the client's colours: dark panel, highlight, light tiles
  logo: { light: string; dark: string; alt: string; square?: boolean }; // light = for white backgrounds, dark = for the ink panel; square marks get more height
  eyebrow: string;
  title: ReactNode;
  intro: string;
  services: string[];
  heroImg?: { src: string; alt: string };
  map?: { places: { name: string; value: number; label: string; x: number; y: number }[]; rivers?: string[] }; // live route map in the hero, x/y in a 1440x760 frame
  headline?: { value: number; unit: string; caption?: string; statement?: string }; // the big counted number, its caption and the one-line statement under it
  machine?: { display: string[] }; // hero variant: a washing machine whose door shows the number; the display cycles these lines
  phone?: { img: string; alt: string; screenBg?: string; toasts: { title: string; sub: string }[] }; // hero variant: the client's real ad on a phone, results arriving
  browser?: { scroll: string; url: string; phone?: string; phoneAlt?: string; phoneVideo?: string; alt: string }; // hero variant: the client's live site in a browser, its listing scrolling by
  // the site itself: a moving wall of every product, the special pages as browser frames
  catalog?: { title: string; statement: string; products: string[]; wallWide?: boolean; count: number; countLabel: string; features?: string[]; pages: { img: string; title: string; text: string; url?: string }[] };
  // an interactive 360° panorama from the client's own tour
  tour?: { title: string; statement: string; text: string; facts: { value: string; label: string }[]; rooms: { name: string; pano: string; pan?: number }[]; url: string; cta: string };
  galleryFirst?: boolean; // show the gallery (reels) before the numbers
  // a publishing rhythm: the weeks with their posts, then every post as it looks live
  blog?: { title: string; statement: string; text: string; weeks: { date: string; note?: string; next?: boolean }[]; posts: { img: string; title: string; date: string; tag: string; url: string }[]; allUrl: string };
  stats: { value: string; label: string; star?: boolean }[];
  starNote: string;
  video?: { prefix: string; title: string };
  task: {
    title: string;
    text: string[];
    photos: { src: string; alt: string }[];
    statement?: string; // big line of the task section; with it, the section becomes statement + two columns + journey
    columns?: { title: string; text: string }[];
    journey?: { kind: "washer" | "photo" | "result" | "arrival"; title: string; text: string; img?: string; alt?: string; chip?: string }[];
    // tiles with a real image, a pill (search term or ad name) and its number.
    // With `shape`, the tile shows an ad creative whole (square/portrait as an Instagram post, phone as a playing video) with the caption below it.
    moments?: { img: string; alt: string; title: string; fact?: string; search: string; clicks?: number; unit?: string; stat?: string; shape?: "square" | "portrait" | "phone"; video?: string; review?: boolean }[]; // review: the pill is a Google review (G logo instead of the magnifier)
    momentsNote?: string;
    badge?: { src: string; alt: string; text: string };
  };
  numbers: {
    hide?: boolean; // no sourced numbers yet: the section is left out
    title: string;
    intro: string;
    ratios?: Ratios; // ratios instead of raw counts: replaces the detailed grid below, so absolute figures stay with the client
    meta?: MetaNumbers; // ad results as a funnel plus rates, never spend or cost per click
    months?: { label: string; value: number }[];
    monthsTitle?: string;
    drop?: { title?: string; from?: string; fromLabel?: string; to: string; toLabel: string; text: string };
    placesTitle?: string;
    searchesTitle?: string;
    searchesUnit?: string;
    searchesIcon?: boolean; // magnifier in front of each row (searches yes, ad names no)
    places?: { name: string; how: string; since: string; a: string; aLabel: string; b: string; bLabel: string }[];
    searches?: { q: string; clicks: number }[];
    searchNote?: string;
    small?: { value: string; label: string; sub: string }[];
    source: string;
    bg?: string; // texture behind the section (the client's own wall, floor, …)
    ai?: { title: string; rank: string; text: string; question: string; place: string; detail: string; note: string };
  };
  // photos with `video` are shown whole in phone frames in their own row (label + text under each); the rest stay a photo grid
  gallery: { title: string; text: string; photos: { src: string; alt: string; video?: string; label?: string; text?: string }[]; videosTitle?: string; postBrand?: { name: string; avatar: string } };
  timeline: { title: string; items: { date: string; text: string }[] };
  work?: { title: string; intro?: string; groups: { title: string; logos?: string[]; icon?: "web" | "blog" | "report" | "form" | "image" | "video"; points: string[] }[] }; // what we did, grouped, without dates
  site?: { img: string; alt: string; url: string; text: string };
  quote?: { text: string; who: string };
};

type NumbersCfg = CaseConfig["numbers"];

/* a muted, looping video that only plays while on screen */
function InViewVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const [el, setEl] = useState<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  return <video ref={setEl} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} className={className} />;
}

/* a phone with the client's real 9:16 video ad, uncropped */
function MiniPhone({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  return (
    <div className={`relative aspect-[9/16] overflow-hidden rounded-[1.6rem] border-[5px] border-[#0e0e10] bg-[#0e0e10] shadow-[0_30px_60px_-28px_rgba(15,42,74,0.6)] md:rounded-[2rem] md:border-[6px] ${className}`}>
      <InViewVideo src={src} poster={poster} label={label} className="h-full w-full rounded-[1.25rem] object-cover md:rounded-[1.6rem]" />
      <span aria-hidden className="absolute left-1/2 top-1.5 h-[4.5%] w-[30%] -translate-x-1/2 rounded-full bg-[#0e0e10]" />
    </div>
  );
}

/* the creative as it appeared in the feed: page name, "Gesponsert", the ad whole, the button below */
function AdPost({ img, alt, brand, cta = "Jetzt bewerben", aspect = "square", className = "" }: { img: string; alt: string; brand: { name: string; avatar: string }; cta?: string; aspect?: "square" | "portrait"; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[14px] bg-white shadow-[0_26px_50px_-24px_rgba(15,42,74,0.5)] ring-1 ring-black/5 ${className}`}>
      <div className="flex items-center gap-1.5 px-2.5 py-2 md:gap-2 md:px-3">
        <img src={brand.avatar} alt="" className="h-5 w-5 flex-none rounded-full bg-white object-contain ring-1 ring-black/10 md:h-6 md:w-6" />
        <span className="min-w-0 leading-none">
          <span className="block truncate text-[0.56rem] font-bold text-[#0e0e10] md:text-[0.68rem]">{brand.name}</span>
          <span className="mt-0.5 block text-[0.5rem] font-medium text-[#86868b] md:text-[0.6rem]">Gesponsert</span>
        </span>
      </div>
      <img src={img} alt={alt} loading="lazy" className={`block w-full object-cover ${aspect === "square" ? "aspect-square" : "aspect-[4/5]"}`} />
      <div className="flex items-center justify-between bg-[#f2f3f5] px-2.5 py-1.5 text-[0.56rem] font-bold text-[#0e0e10] md:px-3 md:py-2 md:text-[0.68rem]">
        {cta}
        <ArrowRight size={11} aria-hidden />
      </div>
    </div>
  );
}

type Ratios = {
  growth: { title: string; value: string; text: string; bars: { label: string; ratio: number }[] }; // relative bars, the first one is 1×
  dots: { title: string; value: string; every: number; text: string }; // "one in every n"
  ring: { title: string; pct: number; text: string };
  split: { title: string; value: string; text: string; parts: { label: string; pct: number }[] };
};

const SHADOW = "shadow-[0_30px_60px_-30px_rgba(20,12,4,0.55)]";
const LABEL = "text-[0.8rem] font-black uppercase tracking-[0.14em]";
const BIG = "text-[clamp(3.6rem,6.4vw,5.6rem)] font-bold leading-[0.85] tracking-[-0.07em] tabular-nums";
const BODY = "max-w-[32ch] text-[0.98rem] font-medium leading-[1.5]";
const times = (n: number) => `${n.toLocaleString("de-DE", { maximumFractionDigits: 1 })}×`;

/* ratios instead of raw numbers: growth, conversion, speed and what worked, without giving away the client's volumes or budget */
function RatioGrid({ x, reduce, ink, accent, soft }: { x: Ratios; reduce: boolean | null; ink: string; accent: string; soft: string }) {
  const r = (d = 0) => rise(reduce, d);
  const maxBar = Math.max(...x.growth.bars.map((b) => b.ratio));
  const C = 2 * Math.PI * 52;
  const splitColors = [accent, ink, "#d8dde7"];
  return (
    <div className="mt-10 grid gap-2.5 md:mt-14 md:grid-cols-12 md:gap-4">
      {/* growth, month on month, relative only */}
      <motion.div {...r(0.04)} className={`grid gap-8 rounded-[24px] p-6 md:col-span-7 md:grid-cols-2 md:p-8 ${SHADOW}`} style={{ background: soft }}>
        <div className="flex flex-col justify-between">
          <p className={LABEL} style={{ color: ink }}>{x.growth.title}</p>
          <div className="mt-8">
            <p className={BIG} style={{ color: ink }}>{x.growth.value}</p>
            <p className={`mt-4 text-[#424245] ${BODY}`}>{x.growth.text}</p>
          </div>
        </div>
        <div className="flex h-[220px] items-end gap-4 md:h-[280px]">
          {x.growth.bars.map((b, i) => (
            <div key={b.label} className="flex h-full flex-1 flex-col justify-end">
              <p className="mb-2 text-center text-[1.35rem] font-bold tracking-[-0.04em] text-[#0e0e10] tabular-nums">{times(b.ratio)}</p>
              <motion.div
                initial={reduce ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.14, ease: EASE }}
                className="origin-bottom rounded-t-[14px] rounded-b-[6px]"
                style={{ height: `${(b.ratio / maxBar) * 100}%`, background: i === x.growth.bars.length - 1 ? accent : `${accent}55` }}
              />
              <p className="mt-3 text-center text-[0.9rem] font-semibold text-[#6b7280]">{b.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* one in every n clicks */}
      <motion.div {...r(0.08)} className={`flex flex-col justify-between rounded-[24px] p-6 text-white md:col-span-5 md:p-8 ${SHADOW}`} style={{ background: ink }}>
        <p className={LABEL} style={{ color: accent }}>{x.dots.title}</p>
        <div className="mt-8 flex gap-1 md:gap-1.5" aria-hidden>
          {Array.from({ length: x.dots.every }, (_, i) => {
            const hit = i === x.dots.every - 1;
            return (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: hit ? 0.5 : 0.3, delay: 0.1 + i * 0.06 + (hit ? 0.2 : 0), ease: hit ? [0.34, 1.56, 0.64, 1] : EASE }}
                className={`grid aspect-square min-w-0 max-w-9 flex-1 place-items-center rounded-full ${hit ? "" : "bg-white/15"}`}
                style={hit ? { background: accent } : undefined}
              >
                {hit && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
              </motion.span>
            );
          })}
        </div>
        <div className="mt-8">
          <p className={`${BIG} text-white`}>{x.dots.value}</p>
          <p className={`mt-4 text-white/70 ${BODY}`}>{x.dots.text}</p>
        </div>
      </motion.div>

      {/* share in the first week */}
      <motion.div {...r(0.04)} className="flex items-center gap-6 rounded-[24px] bg-[#f5f5f7] p-6 md:col-span-5 md:gap-8 md:p-8">
        <div className="relative h-[124px] w-[124px] flex-none md:h-[150px] md:w-[150px]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e3e6ec" strokeWidth="12" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={C}
              initial={reduce ? false : { strokeDashoffset: C }}
              whileInView={{ strokeDashoffset: C * (1 - x.ring.pct / 100) }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
              style={reduce ? { strokeDashoffset: C * (1 - x.ring.pct / 100) } : undefined}
            />
          </svg>
          <p className="absolute inset-0 grid place-items-center text-[1.9rem] font-bold tracking-[-0.06em] tabular-nums md:text-[2.3rem]" style={{ color: ink }}>{x.ring.pct} %</p>
        </div>
        <div>
          <p className={LABEL} style={{ color: ink }}>{x.ring.title}</p>
          <p className={`mt-3 text-[#424245] ${BODY}`}>{x.ring.text}</p>
        </div>
      </motion.div>

      {/* what worked: share per ad style */}
      <motion.div {...r(0.08)} className="flex flex-col justify-between rounded-[24px] bg-[#f5f5f7] p-6 md:col-span-7 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={LABEL} style={{ color: ink }}>{x.split.title}</p>
            <p className={`mt-6 ${BIG}`} style={{ color: ink }}>{x.split.value}</p>
          </div>
          <p className={`text-[#424245] md:text-right ${BODY}`}>{x.split.text}</p>
        </div>
        <div className="mt-8 flex h-5 gap-1 overflow-hidden rounded-full" aria-hidden>
          {x.split.parts.map((p, i) => (
            <motion.span
              key={p.label}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.15, ease: EASE }}
              className="h-full origin-left first:rounded-l-full last:rounded-r-full"
              style={{ width: `${p.pct}%`, background: splitColors[i % splitColors.length] }}
            />
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {x.split.parts.map((p, i) => (
            <li key={p.label} className="flex items-center gap-2 text-[0.9rem] font-semibold text-[#424245]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: splitColors[i % splitColors.length] }} />
              {p.label} <b className="tabular-nums text-[#0e0e10]">{p.pct} %</b>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

type MetaNumbers = {
  funnelTitle: string;
  funnel: { label: string; value: number }[]; // largest first
  rate: { title: string; value: string; text: string };
  tiles: { value: string; label: string; sub: string }[];
};

const SITE_CSS = `
@keyframes cs-scroll { 0%, 6% { object-position: 50% 0% } 94%, 100% { object-position: 50% 100% } }
.cs-scroll { animation: cs-scroll 70s ease-in-out infinite alternate }
@keyframes cs-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
@keyframes cs-down { from { transform: translateY(-50%) } to { transform: translateY(0) } }
.cs-up { animation: cs-up var(--d, 60s) linear infinite }
.cs-down { animation: cs-down var(--d, 60s) linear infinite }
@media (prefers-reduced-motion: reduce) { .cs-scroll, .cs-up, .cs-down { animation: none } }
`;

/* a browser window: chrome with the address, then the page */
function BrowserFrame({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[12px] bg-white ring-1 ring-black/10 md:rounded-[16px] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f4f3f1] px-3 py-2 md:px-4 md:py-2.5">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="h-2 w-2 rounded-full md:h-2.5 md:w-2.5" style={{ background: c }} />)}
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-white px-3 py-0.5 text-[0.62rem] font-medium text-[#6b7280] ring-1 ring-black/5 md:text-[0.74rem]">{url}</span>
        <span className="w-6 md:w-8" />
      </div>
      {children}
    </div>
  );
}

/* hero variant: the live site, its product listing scrolling slowly; the phone shows a product page; the count sits on the frame */
function BrowserHero({ scroll, url, alt, phone, phoneAlt, phoneVideo, value, unit, ink }: { scroll: string; url: string; alt: string; phone?: string; phoneAlt?: string; phoneVideo?: string; value: number; unit: string; ink: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto max-w-[940px] px-2 md:px-0">
      <motion.div initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
        <BrowserFrame url={url} className="shadow-[0_60px_120px_-50px_rgba(29,27,24,0.55)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#f6f3ee]">
            <img src={scroll} alt={alt} className="cs-scroll absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 0%" }} />
          </div>
        </BrowserFrame>
      </motion.div>
      {phone && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          className="absolute -bottom-12 right-0 w-[31%] max-w-[230px] md:-bottom-14 md:-right-12"
        >
          <div className="overflow-hidden rounded-[1.4rem] border-[5px] border-[#0e0e10] bg-[#0e0e10] shadow-[0_40px_80px_-30px_rgba(29,27,24,0.6)] md:rounded-[2rem] md:border-[7px]">
            {phoneVideo ? (
              <InViewVideo src={phoneVideo} poster={phone} label={phoneAlt ?? ""} className="aspect-[9/16] w-full rounded-[1rem] object-cover md:rounded-[1.5rem]" />
            ) : (
              <img src={phone} alt={phoneAlt ?? ""} className="aspect-[390/844] w-full rounded-[1rem] object-cover object-top md:rounded-[1.5rem]" />
            )}
          </div>
        </motion.div>
      )}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
        className="absolute -bottom-10 left-0 rounded-[20px] px-5 py-3.5 text-white shadow-[0_30px_60px_-24px_rgba(29,27,24,0.6)] md:-left-12 md:bottom-auto md:top-[16%] md:py-4"
        style={{ background: ink }}
      >
        <p className="text-[2.4rem] font-bold leading-none tracking-[-0.06em] text-white tabular-nums md:text-[3.4rem]"><Counter to={value} /></p>
        <p className="mt-1 max-w-[15ch] text-[0.78rem] font-semibold leading-snug text-white/75">{unit}</p>
      </motion.div>
    </div>
  );
}

/* every product photo, in columns drifting up and down */
function ProductWall({ products, count, label, ink, wide = false }: { products: string[]; count: number; label: string; ink: string; wide?: boolean }) {
  const cols = 4;
  const per = Math.ceil(products.length / cols);
  return (
    <div className="relative h-[460px] overflow-hidden rounded-[28px] bg-white md:h-[640px]">
      <div className="grid h-full grid-cols-3 gap-2 p-2 md:grid-cols-4 md:gap-3 md:p-3">
        {Array.from({ length: cols }, (_, c) => {
          const list = products.slice(c * per, c * per + per);
          return (
            <div key={c} className={`overflow-hidden ${c === 3 ? "hidden md:block" : ""}`}>
              <div className={c % 2 ? "cs-down" : "cs-up"} style={{ ["--d" as string]: `${90 + c * 14}s` }}>
                {[...list, ...list].map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" className={`mb-2 w-full rounded-[14px] object-cover md:mb-3 ${wide ? "aspect-[16/10] object-top ring-1 ring-black/5" : "aspect-square"}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#fff,rgba(255,255,255,0))]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#fff_10%,rgba(255,255,255,0))]" />
      <div className="absolute bottom-5 left-5 rounded-[20px] bg-white px-5 py-4 shadow-[0_24px_50px_-24px_rgba(29,27,24,0.45)] ring-1 ring-black/5 md:bottom-7 md:left-7 md:px-6">
        <p className="text-[clamp(2.6rem,5vw,4rem)] font-bold leading-none tracking-[-0.065em] tabular-nums" style={{ color: ink }}><Counter to={count} /></p>
        <p className="mt-1.5 max-w-[22ch] text-[0.85rem] font-semibold leading-snug text-[#57524a]">{label}</p>
      </div>
    </div>
  );
}

/* a real 360° panorama: an equirectangular photo, projected per pixel in WebGL; drag to look around, it drifts on its own */
const PANO_VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const PANO_FRAG = `precision highp float;
uniform sampler2D t;uniform vec2 res;uniform float yaw,pitch,tanH;
const float PI=3.14159265359;
void main(){
  vec2 q=gl_FragCoord.xy/res*2.-1.;
  vec3 d=normalize(vec3(q.x*tanH,q.y*tanH*res.y/res.x,-1.));
  float cp=cos(pitch),sp=sin(pitch);
  d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);
  float cy=cos(yaw),sy=sin(yaw);
  d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);
  gl_FragColor=texture2D(t,vec2(.5+atan(d.x,-d.z)/(2.*PI),.5-asin(clamp(d.y,-1.,1.))/PI));
}`;

function PanoView({ src, pan = 0, label, className = "" }: { src: string; pan?: number; label: string; className?: string }) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return setFailed(true);
    const sh = (type: number, code: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, code); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, PANO_VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, PANO_FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setFailed(true);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const view = { yaw: (pan * Math.PI) / 180, pitch: 0 };
    let loaded = false, visible = false, raf = 0, last = 0, idleSince = 0, drag: { x: number; y: number; yaw: number; pitch: number } | null = null;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => { gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); loaded = true; setReady(true); draw(); };
    img.onerror = () => setFailed(true);
    img.src = src;

    const draw = () => {
      if (!loaded) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      const hfov = (w / h < 1 ? 75 : 95) * (Math.PI / 180);
      gl.uniform2f(u("res"), w, h);
      gl.uniform1f(u("yaw"), view.yaw);
      gl.uniform1f(u("pitch"), view.pitch);
      gl.uniform1f(u("tanH"), Math.tan(hfov / 2));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      if (!drag && !reduceMotion && t - idleSince > 2500) view.yaw += dt * 0.07;
      draw();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) { last = 0; raf = requestAnimationFrame(tick); }
    });
    io.observe(canvas);

    const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, yaw: view.yaw, pitch: view.pitch }; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const k = (95 * Math.PI) / 180 / canvas.clientWidth;
      view.yaw = drag.yaw + (e.clientX - drag.x) * k;
      if (e.pointerType !== "touch") view.pitch = Math.max(-1.1, Math.min(1.1, drag.pitch + (e.clientY - drag.y) * k));
    };
    const up = () => { drag = null; idleSince = performance.now(); };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      img.onload = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [canvas, src, pan]);
  return failed ? (
    <img src={src} alt={label} className={`object-cover ${className}`} />
  ) : (
    <canvas ref={setCanvas} role="img" aria-label={label} className={`cursor-grab touch-pan-y transition-opacity duration-500 active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"} ${className}`} />
  );
}

/* ad results: the funnel from impression to click, the click rate, three rates around it */
function MetaGrid({ x, reduce, ink, accent, bright, soft }: { x: MetaNumbers; reduce: boolean | null; ink: string; accent: string; bright: string; soft: string }) {
  const r = (d = 0) => rise(reduce, d);
  const max = x.funnel[0]?.value ?? 1;
  return (
    <div className="mt-10 grid gap-2.5 md:mt-14 md:grid-cols-12 md:gap-4">
      <motion.div {...r(0.04)} className={`rounded-[24px] p-6 md:col-span-7 md:p-8 ${SHADOW}`} style={{ background: soft }}>
        <p className={LABEL} style={{ color: ink }}>{x.funnelTitle}</p>
        <div className="mt-7 space-y-3">
          {x.funnel.map((f, i) => (
            <div key={f.label}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[0.92rem] font-semibold text-[#424245]">{f.label}</p>
                <p className="text-[1.25rem] font-bold tracking-[-0.04em] tabular-nums text-[#0e0e10]">{f.value.toLocaleString("de-DE")}</p>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white">
                <motion.div
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                  className="h-full origin-left rounded-full"
                  style={{ width: `${Math.max(3, Math.sqrt(f.value / max) * 100)}%`, background: i === x.funnel.length - 1 ? accent : ink, opacity: i === x.funnel.length - 1 ? 1 : 1 - i * 0.14 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div {...r(0.08)} className={`flex flex-col justify-between rounded-[24px] p-6 text-white md:col-span-5 md:p-8 ${SHADOW}`} style={{ background: ink }}>
        <p className={LABEL} style={{ color: bright }}>{x.rate.title}</p>
        <div className="mt-8">
          <p className={`${BIG} text-white`}>{x.rate.value}</p>
          <p className={`mt-4 text-white/70 ${BODY}`}>{x.rate.text}</p>
        </div>
      </motion.div>
      {x.tiles.map((s, i) => (
        <motion.div key={s.label} {...r(0.04 + i * 0.04)} className="rounded-[24px] bg-[#f5f5f7] p-6 md:col-span-4 md:p-8">
          <p className="text-[clamp(2.4rem,4vw,3.4rem)] font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums">{s.value}</p>
          <p className="mt-3 text-[1rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{s.label}</p>
          <p className="mt-1 text-[0.88rem] font-medium leading-snug text-[#6b7280]">{s.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* the panorama with its room switch, a drag hint and the link to the full tour */
function TourStage({ tour, accent, ink }: { tour: NonNullable<CaseConfig["tour"]>; accent: string; ink: string }) {
  const [room, setRoom] = useState(0);
  const rm = tour.rooms[room];
  return (
    <div className="relative mt-10 overflow-hidden rounded-[24px] bg-black/40 md:mt-14">
      <PanoView key={rm.pano} src={rm.pano} pan={rm.pan} label={`360°-Ansicht: ${rm.name}`} className="block aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/8]" />
      <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[0.75rem] font-semibold text-white backdrop-blur md:right-5 md:top-5 md:text-[0.82rem]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M8 12h8M5 9l-3 3 3 3M19 9l3 3-3 3" /></svg>
        Ziehen zum Umsehen
      </span>
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2.5 md:inset-x-5 md:bottom-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Räume">
          {tour.rooms.map((x, i) => (
            <button
              key={x.pano}
              type="button"
              role="tab"
              aria-selected={i === room}
              onClick={() => setRoom(i)}
              className={`rounded-full px-3.5 py-2 text-[0.8rem] font-semibold backdrop-blur transition-colors md:text-[0.88rem] ${i === room ? "text-[#0e0e10]" : "bg-black/45 text-white hover:bg-black/60"}`}
              style={i === room ? { background: "#fff" } : undefined}
            >
              {x.name}
            </button>
          ))}
        </div>
        <a href={tour.url} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-[0.85rem] font-bold transition-transform hover:-translate-y-0.5" style={{ background: accent, color: ink }}>
          {tour.cta} <ArrowUpRight size={15} aria-hidden />
        </a>
      </div>
    </div>
  );
}

/* the videos in phones: up to four side by side; more become a row you scroll (arrows on wider screens) */
type Clip = CaseConfig["gallery"]["photos"][number];
function ClipRow({ clips, title, bright }: { clips: Clip[]; title?: string; bright: string }) {
  const [row, setRow] = useState<HTMLDivElement | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const scroller = clips.length > 4;
  useEffect(() => {
    if (!row || !scroller) return;
    const update = () => setEdge({ start: row.scrollLeft < 8, end: row.scrollLeft + row.clientWidth > row.scrollWidth - 8 });
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { row.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [row, scroller]);
  const step = (dir: number) => row?.scrollBy({ left: dir * Math.max(260, row.clientWidth * 0.8), behavior: "smooth" });
  return (
    <>
      <div className="flex items-end justify-between gap-4 px-6 md:px-0">
        {title && <p className="text-[0.8rem] font-black uppercase tracking-[0.14em]" style={{ color: bright }}>{title}</p>}
        {scroller && (
          <div className="hidden gap-2 md:flex">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => step(d)}
                disabled={d < 0 ? edge.start : edge.end}
                aria-label={d < 0 ? "Vorherige Reels" : "Nächste Reels"}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <ArrowRight size={18} className={d < 0 ? "rotate-180" : ""} aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        ref={setRow}
        className={
          scroller
            ? "mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mt-8 md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden"
            : "mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mt-8 md:grid md:gap-8 md:overflow-visible md:px-0 md:pb-0 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
        }
        style={{ ["--n" as string]: clips.length }}
      >
        {clips.map((p) => (
          <figure key={p.video} className={`flex-none snap-start ${scroller ? "w-[60%] sm:w-[34%] md:w-[230px] lg:w-[250px]" : "w-[60%] md:w-auto"}`}>
            <MiniPhone src={p.video!} poster={p.src} label={p.alt} className={`w-full ${scroller ? "" : "mx-auto md:max-w-[270px]"}`} />
            {p.label && (
              <figcaption className={`mt-5 ${scroller ? "" : "mx-auto md:max-w-[270px]"}`}>
                <p className="text-[1.05rem] font-bold tracking-[-0.03em] text-white md:text-[1.15rem]">{p.label}</p>
                {p.text && <p className="mt-1 text-[0.88rem] font-medium leading-snug text-white/65">{p.text}</p>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </>
  );
}

/* the centred hero title runs on two lines that never wrap: size it by the longer line so it always fits the screen */
function heroTitleSize(t: string) {
  const i = t.indexOf(", ");
  const longest = i < 0 ? t.length + 1 : Math.max(i + 1, t.length - i - 1);
  return `min(4.3rem, calc((100vw - 2.25rem) / ${(longest * 0.53).toFixed(2)}))`;
}

function rise(reduce: boolean | null, d = 0) {
  return reduce ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.7, delay: d, ease: EASE } };
}

const H2 = ({ children, accent }: { children: ReactNode; accent: string }) => (
  <h2 className="text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10]">
    {children}
    <span style={{ color: accent }}>.</span>
  </h2>
);

/* ---------- hero map: city blocks, two rivers, routes drawing in to the client's places in proportion to the real numbers ---------- */
function rand(seed: number) {
  let x = seed;
  return () => ((x = (x * 9301 + 49297) % 233280) / 233280);
}
function useCount(to: number, delay = 0.3, duration = 1.8) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return;
    const c = animate(0, to, { duration, delay, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to, delay, duration, reduce]);
  return v;
}
function PlaceLabel({ value, label, ink, i, shadow }: { value: number; label: string; ink: string; i: number; shadow: string }) {
  const v = useCount(value, 0.5 + i * 0.15, 1.7);
  return (
    <g transform="translate(0 24)" filter={`url(#${shadow})`}>
      <rect x="-108" y="0" width="216" height="64" rx="16" fill="#fff" />
      <text x="0" y="30" textAnchor="middle" fontSize="26" fontWeight="700" letterSpacing="-1" fill={ink} style={{ fontVariantNumeric: "tabular-nums" }}>{v.toLocaleString("de-DE")}</text>
      <text x="0" y="51" textAnchor="middle" fontSize="13.5" fontWeight="600" fill="#6b7280">{label}</text>
    </g>
  );
}
function HeroMap({ places, rivers = [], ink, accent, viewBox = "0 0 1440 760" }: { places: NonNullable<CaseConfig["map"]>["places"]; rivers?: string[]; ink: string; accent: string; viewBox?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, ""); // the map renders twice (phone and desktop): ids must not collide
  const total = places.reduce((n, p) => n + p.value, 0);
  // city blocks on a slightly turned grid: the gaps read as streets
  const blocks = useMemo(() => {
    const r = rand(11);
    const out: { x: number; y: number; w: number; h: number }[] = [];
    for (let gy = -80; gy < 860; gy += 74) {
      for (let gx = -120; gx < 1560; gx += 96) {
        if (r() < 0.16) continue;
        const w = 70 + r() * 18, h = 50 + r() * 14;
        out.push({ x: gx + (r() - 0.5) * 6, y: gy + (r() - 0.5) * 6, w, h });
      }
    }
    return out;
  }, []);
  // routes: start points spread evenly around each place, gentle S-curves in, count in proportion to the real numbers
  const routes = useMemo(() => {
    const r = rand(5);
    const out: { d: string; sx: number; sy: number; dur: number; begin: number; place: number }[] = [];
    places.forEach((p, pi) => {
      const n = Math.max(6, Math.round((p.value / total) * 30));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r() * 0.4;
        const dist = 230 + r() * 300;
        const sx = p.x + Math.cos(a) * dist, sy = p.y + Math.sin(a) * dist * 0.7;
        const bend = (r() - 0.5) * 120;
        const c1x = sx + (p.x - sx) * 0.35 + Math.sin(a) * bend, c1y = sy + (p.y - sy) * 0.35 - Math.cos(a) * bend;
        const c2x = sx + (p.x - sx) * 0.75 - Math.sin(a) * bend * 0.4, c2y = sy + (p.y - sy) * 0.75 + Math.cos(a) * bend * 0.4;
        out.push({ d: `M${sx.toFixed(0)} ${sy.toFixed(0)} C${c1x.toFixed(0)} ${c1y.toFixed(0)} ${c2x.toFixed(0)} ${c2y.toFixed(0)} ${p.x} ${p.y - 4}`, sx, sy, dur: 3.2 + r() * 2.6, begin: 2.2 + r() * 4, place: pi });
      }
    });
    return out;
  }, [places, total]);

  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={viewBox} preserveAspectRatio="xMidYMid slice" style={{ fontFamily: "Inter, sans-serif" }}>
      <defs>
        <filter id={`sh${uid}`} x="-30%" y="-30%" width="160%" height="190%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#001850" floodOpacity="0.16" /></filter>
        <radialGradient id={`gl${uid}`}><stop offset="0" stopColor={accent} stopOpacity="0.28" /><stop offset="1" stopColor={accent} stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="-200" y="-200" width="1840" height="1160" fill="#f5f8fe" />
      <g transform="rotate(-8 720 380)">
        {blocks.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="7" fill="#e8effb" />)}
      </g>
      {rivers.map((d, i) => <path key={i} d={d} stroke="#d4e4ff" strokeWidth={i ? 26 : 52} fill="none" strokeLinecap="round" />)}
      {places.map((p) => <circle key={p.name} cx={p.x} cy={p.y} r="190" fill={`url(#gl${uid})`} />)}

      {/* the routes: drawn in once, then people keep arriving */}
      {routes.map((rt, i) => (
        <g key={i}>
          <motion.path
            d={rt.d}
            fill="none"
            stroke={accent}
            strokeWidth={2.2}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.38 }}
            transition={{ duration: 1.3, delay: 0.35 + (i % 12) * 0.07 + rt.place * 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle cx={rt.sx} cy={rt.sy} r="4.5" fill="#fff" stroke={accent} strokeWidth="2" initial={reduce ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 + (i % 12) * 0.07 }} />
          {!reduce && (
            <circle r="5.5" fill={accent} opacity="0">
              <animateMotion dur={`${rt.dur}s`} begin={`${rt.begin}s`} repeatCount="indefinite" path={rt.d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
              <animate attributeName="opacity" dur={`${rt.dur}s`} begin={`${rt.begin}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.1;0.85;1" />
            </circle>
          )}
        </g>
      ))}

      {places.map((p, i) => (
        <g key={p.name} transform={`translate(${p.x} ${p.y})`}>
          {!reduce && [0, 1].map((k) => (
            <circle key={k} r="26" fill="none" stroke={accent} strokeWidth="2" opacity="0">
              <animate attributeName="r" values="22;70" dur="2.4s" begin={`${1.8 + k * 1.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.55;0" dur="2.4s" begin={`${1.8 + k * 1.2}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <motion.g initial={reduce ? false : { y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 + i * 0.15 }}>
            <ellipse cx="0" cy="2" rx="12" ry="4" fill={ink} opacity="0.18" />
            <path d="M0 0C-17-24-24-34-24-46a24 24 0 1 1 48 0c0 12-7 22-24 46z" fill={accent} stroke={ink} strokeWidth="3" />
            <path d="M0-61c-7 9-11 15-11 20a11 11 0 0 0 22 0c0-5-4-11-11-20z" fill="#fff" />
          </motion.g>
          <motion.g initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}>
            <PlaceLabel value={p.value} label={p.label} ink={ink} i={i} shadow={`sh${uid}`} />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

function Counter({ to }: { to: number }) {
  const v = useCount(to, 0.4, 2.0);
  return <>{v.toLocaleString("de-DE")}</>;
}

/* ---------- hero variant: a washing machine; the drum turns, the door shows the number, the display cycles the places ---------- */
function Washer({ value, unit, display, ink, accent }: { value: number; unit: string; display: string[]; ink: string; accent: string }) {
  const reduce = useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduce || display.length < 2) return;
    const t = setInterval(() => setK((x) => (x + 1) % display.length), 2200);
    return () => clearInterval(t);
  }, [display.length, reduce]);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className="wb-washer relative mx-auto w-[300px] md:w-[380px]"
    >
      {/* body */}
      <div className="relative overflow-hidden rounded-[34px] bg-white shadow-[0_60px_120px_-50px_rgba(0,24,80,0.45),0_0_0_1px_rgba(0,24,80,0.07)] md:rounded-[40px]">
        {/* control panel */}
        <div className="flex h-[70px] items-center gap-3 border-b border-[#e7edf7] px-5 md:h-[84px] md:px-7">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#eef3fb] md:h-11 md:w-11">
            <span className="wb-knob block h-6 w-6 rounded-full border-[3px] border-[#c9d5ea] md:h-7 md:w-7" style={{ borderTopColor: accent }} />
          </span>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          <span className="h-2.5 w-2.5 rounded-full bg-[#dfe6f2]" />
          <span className="ml-auto flex h-9 min-w-[124px] items-center justify-center overflow-hidden rounded-[10px] px-3 font-mono text-[0.85rem] font-bold tracking-[0.06em] md:h-10 md:min-w-[148px] md:text-[0.95rem]" style={{ background: ink, color: accent }}>
            <motion.span key={k} initial={reduce ? false : { y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, ease: EASE }}>
              {display[k]}
            </motion.span>
          </span>
        </div>
        {/* door */}
        <div className="flex items-center justify-center px-6 pb-9 pt-8 md:pb-11 md:pt-10">
          <div className="relative aspect-square w-[236px] rounded-full bg-[conic-gradient(from_200deg,#e9eef6,#c9d3e3,#f4f7fb,#cfd8e7,#e9eef6)] p-[14px] shadow-[inset_0_2px_6px_rgba(255,255,255,0.8),0_10px_30px_-12px_rgba(0,24,80,0.35)] md:w-[300px] md:p-[18px]">
            <div className="relative h-full w-full overflow-hidden rounded-full" style={{ background: `radial-gradient(circle at 35% 28%, #7fb2ff 0%, ${accent} 38%, ${ink} 100%)` }}>
              {/* tumbling laundry */}
              <div className="wb-drum absolute inset-0">
                {[["16%", "64%", "24%", "15%", "#ffffff", "40% 60% 55% 45%"], ["58%", "66%", "22%", "14%", "#cfe2ff", "55% 45% 40% 60%"], ["36%", "10%", "20%", "13%", "#ffffff", "45% 55% 60% 40%"], ["68%", "26%", "16%", "15%", "#9cc6ff", "50% 50% 45% 55%"], ["8%", "30%", "14%", "12%", "#cfe2ff", "50% 50% 45% 55%"]].map(([l, t, w, h, c, br], i) => (
                  <span key={i} className="absolute opacity-45" style={{ left: l, top: t, width: w, height: h, background: c, borderRadius: br }} />
                ))}
              </div>
              {/* water */}
              <svg className="absolute inset-x-0 bottom-0 h-[46%] w-full" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden>
                <path className="wb-wave" d="M0 20 Q 25 8 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V 90 H 0 Z" fill="#9cc6ff" opacity="0.55" />
                <path className="wb-wave2" d="M0 30 Q 25 18 50 30 T 100 30 T 150 30 T 200 30 T 250 30 T 300 30 T 350 30 T 400 30 V 90 H 0 Z" fill="#cfe2ff" opacity="0.5" />
              </svg>
              {/* glass highlight */}
              <span className="absolute left-[14%] top-[10%] h-[36%] w-[22%] -rotate-[30deg] rounded-full bg-white/25 blur-[2px]" />
              {/* the number, on a soft scrim */}
              <span className="absolute inset-[18%] rounded-full" style={{ background: `radial-gradient(closest-side, ${ink}88, ${ink}00)` }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[3.3rem] font-bold leading-none tracking-[-0.07em] text-white tabular-nums [text-shadow:0_4px_24px_rgba(0,24,80,0.45)] md:text-[4.2rem]">
                  <Counter to={value} />
                </span>
                <span className="mt-1.5 text-[0.8rem] font-semibold tracking-[-0.01em] text-white/85 md:text-[0.92rem]">{unit}</span>
              </div>
            </div>
          </div>
        </div>
        <span className="absolute bottom-0 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-t-full bg-[#e7edf7]" />
      </div>
      {/* feet */}
      <div className="mx-auto flex w-[80%] justify-between">
        <span className="h-3 w-10 rounded-b-[8px] bg-[#dfe6f2]" />
        <span className="h-3 w-10 rounded-b-[8px] bg-[#dfe6f2]" />
      </div>
    </motion.div>
  );
}

const WASHER_CSS = `
.wb-drum{animation:wbspin 7s linear infinite}
@keyframes wbspin{to{transform:rotate(360deg)}}
.wb-knob{animation:wbspin 9s linear infinite}
.wb-wave{animation:wbwave 3.2s linear infinite}
.wb-wave2{animation:wbwave 4.6s linear infinite reverse}
@keyframes wbwave{from{transform:translateX(0)}to{transform:translateX(-100px)}}
.wb-washer{animation:wbhum 0.18s ease-in-out infinite alternate;animation-play-state:paused}
.wb-bubble{position:absolute;border-radius:9999px;border:1.5px solid rgba(72,144,248,.35);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9),rgba(72,144,248,.08));animation:wbrise linear infinite}
@keyframes wbrise{0%{transform:translateY(0) scale(.8);opacity:0}12%{opacity:1}100%{transform:translateY(-520px) scale(1.15);opacity:0}}
.wb-float{animation:wbfloat 5s ease-in-out infinite}
@keyframes wbfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@media (prefers-reduced-motion: reduce){.wb-drum,.wb-knob,.wb-wave,.wb-wave2,.wb-bubble,.wb-float{animation:none}}
`;

/* ---------- task section: statement, two columns, the customer's journey in four steps ---------- */
function JourneyVisual({ step, ink, accent, client }: { step: NonNullable<CaseConfig["task"]["journey"]>[number]; ink: string; accent: string; client: string }) {
  if (step.kind === "washer")
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative w-[58%] max-w-[170px] rounded-[22px] bg-white p-3 shadow-[0_24px_50px_-26px_rgba(0,24,80,0.45)]">
          <div className="flex items-center gap-1.5 border-b border-[#eef2f8] pb-2">
            <span className="h-3 w-3 rounded-full bg-[#e6ecf6]" />
            <span className="ml-auto rounded-[5px] bg-[#0e1a33] px-1.5 py-0.5 font-mono text-[0.62rem] font-bold text-[#ff6b63]">E-21</span>
          </div>
          <div className="mx-auto mt-3 aspect-square w-[74%] rounded-full bg-[#dfe5ee] p-[9%]">
            <div className="h-full w-full rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, #a9c7f0, #5c77a3)` }} />
          </div>
          <span className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#ff3b30] text-[1.1rem] font-black text-white shadow-[0_10px_20px_-8px_rgba(255,59,48,0.6)]">!</span>
        </div>
      </div>
    );
  if (step.kind === "result")
    return (
      <div className="flex h-full items-center justify-center px-3 pt-7 md:px-4 md:pt-0">
        <div className="w-full max-w-[260px] rounded-[14px] bg-white p-2.5 shadow-[0_24px_50px_-26px_rgba(0,24,80,0.45)] md:rounded-[18px] md:p-4">
          <p className="text-[0.55rem] font-bold text-[#202124] md:text-[0.68rem]">Gesponsert</p>
          <p className="mt-0.5 text-[0.78rem] font-semibold leading-tight tracking-[-0.01em] text-[#202124] md:text-[1.05rem]">{client} · SB Waschsalon</p>
          <p className="mt-0.5 text-[0.6rem] text-[#5f6368] md:text-[0.75rem]"><span className="font-semibold text-[#188038]">Geöffnet</span> · ab 2 €</p>
          <div className="mt-2 flex gap-1 md:mt-3 md:gap-1.5">
            <span className="flex h-6 items-center gap-1 rounded-full bg-[#0b57d0] px-2 text-[0.6rem] font-semibold text-white md:h-8 md:px-3 md:text-[0.75rem]">➜ Route</span>
            <span className="hidden h-8 items-center rounded-full border border-[#dadce0] px-3 text-[0.75rem] font-semibold text-[#0b57d0] md:flex">Anrufen</span>
          </div>
          <div className="mt-3 hidden space-y-1.5 border-t border-[#f0f1f3] pt-3 md:block">
            <span className="block h-2 w-2/3 rounded-full bg-[#eceef1]" />
            <span className="block h-2 w-1/2 rounded-full bg-[#eceef1]" />
          </div>
        </div>
      </div>
    );
  return (
    <div className="relative h-full overflow-hidden">
      <img src={step.img} alt={step.alt ?? ""} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${step.kind === "photo" ? "object-[52%_40%]" : "object-center"}`} />
      {step.kind === "arrival" && (
        <svg className="absolute left-1/2 top-[12%] h-14 w-12 -translate-x-1/2 drop-shadow-[0_10px_14px_rgba(0,24,80,0.35)]" viewBox="0 0 120 150" aria-hidden>
          <path d="M60 146C24 96 6 74 6 52a54 54 0 1 1 108 0c0 22-18 44-54 94z" fill={accent} stroke={ink} strokeWidth="6" />
          <path d="M60 22c-12 15-18 25-18 33a18 18 0 0 0 36 0c0-8-6-18-18-33z" fill="#fff" />
        </svg>
      )}
    </div>
  );
}

/* ---------- hero variant: the client's real ad on a phone; results arrive as notifications, the count runs up ---------- */
function PhoneHero({ img, alt, value, unit, toasts, ink, accent, screenBg = "#000" }: { img: string; alt: string; value: number; unit: string; toasts: { title: string; sub: string }[]; ink: string; accent: string; screenBg?: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? toasts.length : 0);
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setN((x) => (x >= toasts.length ? 0 : x + 1)), n >= toasts.length ? 2600 : n === 0 ? 1400 : 1100);
    return () => clearTimeout(t);
  }, [n, reduce, toasts.length]);
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} className="relative mx-auto w-[260px] md:w-[300px]">
      <div className="relative aspect-[9/19] rounded-[44px] bg-[#0e0e10] p-[10px] shadow-[0_60px_120px_-50px_rgba(15,42,74,0.6)]">
        <div className="relative h-full overflow-hidden rounded-[36px]" style={{ background: screenBg }}>
          <img src={img} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
          <span className="absolute left-1/2 top-2.5 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
          <div className="absolute inset-x-3 top-9 flex gap-1">{[0, 1, 2, 3].map((k) => <span key={k} className={`h-[3px] flex-1 rounded-full ${k === 0 ? "bg-white" : "bg-white/40"}`} />)}</div>
          {/* the notifications */}
          <div className="absolute inset-x-2.5 bottom-3 space-y-1.5">
            <AnimatePresence initial={false}>
              {toasts.slice(0, n).slice(-3).map((t, i) => (
                <motion.div key={t.title + t.sub + i + n} initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
                  className="flex items-center gap-2.5 rounded-[16px] bg-white/95 p-2.5 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] backdrop-blur">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] text-[0.9rem] font-black text-white" style={{ background: accent }}>✓</span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[0.78rem] text-[#0e0e10]">{t.title}</b>
                    <span className="block truncate text-[0.68rem] text-[#6b7280]">{t.sub}</span>
                  </span>
                  <span className="text-[0.62rem] text-[#86868b]">jetzt</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* the count, pinned to the phone */}
      <div className="absolute -bottom-10 left-1/2 flex w-max max-w-[300px] -translate-x-1/2 items-center gap-3 rounded-[20px] px-5 py-3.5 text-white shadow-[0_30px_60px_-30px_rgba(15,42,74,0.7)] md:bottom-auto md:left-0 md:top-[12%] md:block md:w-auto md:-translate-x-[82%] md:py-4" style={{ background: ink }}>
        <p className="text-[2.4rem] font-bold leading-none tracking-[-0.06em] text-white tabular-nums md:text-[3.2rem]"><Counter to={value} /></p>
        <p className="max-w-[18ch] text-[0.78rem] font-semibold leading-snug text-white/75 md:mt-1 md:max-w-[12ch]">{unit}</p>
      </div>
    </motion.div>
  );
}

export default function CaseStudyV2({ cfg }: { cfg: CaseConfig }) {
  const reduce = useReducedMotion();
  const r = (d = 0) => rise(reduce, d);
  const { ink, accent, soft } = cfg.theme;
  const bright = cfg.theme.bright ?? accent;
  const brand = cfg.gallery.postBrand ?? { name: cfg.client, avatar: cfg.logo.light };
  const stills = cfg.gallery.photos.filter((p) => !p.video);
  const clips = cfg.gallery.photos.filter((p) => p.video);
  // the detailed grid (months, places, searches) only renders when no ratios are given
  const N = cfg.numbers as Required<Pick<NumbersCfg, "months" | "monthsTitle" | "drop" | "places" | "searches" | "small">> & NumbersCfg;
  const max = Math.max(1, ...(cfg.numbers.months ?? []).map((m) => m.value));
  const top = cfg.numbers.searches?.[0]?.clicks ?? 1;

  const galleryEl = cfg.gallery.photos.length === 0 ? null : (
  <section className="bg-[#f5f5f7] py-20 md:py-28">
    <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
      <motion.div {...r()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
        <H2 accent={accent}>{cfg.gallery.title}</H2>
        <p className="max-w-[44ch] text-[1.02rem] font-medium leading-[1.5] text-[#6b7280]">{cfg.gallery.text}</p>
      </motion.div>
      {clips.length ? (
        <>
          {/* stills at their own aspect (first one wide), so no ad gets cropped */}
          {stills.length > 0 && (
          <div
            className="mt-10 grid grid-cols-2 gap-2.5 md:mt-14 md:gap-4 md:[grid-template-columns:var(--cols)]"
            style={{ ["--cols" as string]: `1.875fr ${"1fr ".repeat(Math.max(0, stills.length - 1))}` }}
          >
            {stills.map((p, i) => (
              <motion.img key={p.src} {...r(0.04 + i * 0.05)} src={p.src} alt={p.alt} loading="lazy" className={`w-full rounded-[22px] object-cover ${i === 0 ? "col-span-2 aspect-[3/2] md:col-span-1" : "aspect-[4/5]"}`} />
            ))}
          </div>
          )}
          {/* the videos, whole, in phones */}
          <motion.div {...r(0.06)} className={`overflow-hidden rounded-[28px] py-8 md:p-12 ${stills.length ? "mt-2.5 md:mt-4" : "mt-10 md:mt-14"}`} style={{ background: ink }}>
            <ClipRow clips={clips} title={cfg.gallery.videosTitle} bright={bright} />
          </motion.div>
        </>
      ) : (
      <div className="mt-10 grid grid-cols-2 gap-2.5 md:mt-14 md:grid-cols-4 md:gap-4">
        {cfg.gallery.photos.map((p, i) =>
          p.video ? (
            <motion.video key={p.src} {...r(0.04 + i * 0.05)} src={p.video} poster={p.src} autoPlay muted loop playsInline aria-label={p.alt} className={`w-full rounded-[22px] bg-[#0e0e10] object-cover ${i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto md:h-full" : "aspect-[3/4]"}`} />
          ) : (
            <motion.img key={p.src} {...r(0.04 + i * 0.05)} src={p.src} alt={p.alt} loading="lazy" className={`w-full rounded-[22px] object-cover ${i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto md:h-full" : "aspect-[3/4]"}`} />
          ),
        )}
      </div>
      )}
    </div>
  </section>
  );

  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} current={REFS} />
      </div>
      <main className="bg-white text-[#0e0e10]">
        {(cfg.machine || cfg.phone || cfg.browser) && cfg.headline ? (
          /* hero: centred story, the washing machine in the middle, the key figures floating around it */
          <section className="relative overflow-hidden pb-14 md:pb-24">
            <style>{WASHER_CSS + SITE_CSS}</style>
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58%] h-[900px] w-[1300px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(closest-side, ${soft}, rgba(255,255,255,0))` }} />
            {[["18%", 9, 0], ["30%", 14, 2.5], ["64%", 11, 1.2], ["76%", 16, 3.6], ["44%", 8, 4.4], ["58%", 12, 5.6]].map(([l, sz, d], i) => (
              cfg.machine && <span key={i} aria-hidden className="wb-bubble hidden md:block" style={{ left: l as string, bottom: "8%", width: (sz as number) * 2, height: (sz as number) * 2, animationDuration: `${7 + i}s`, animationDelay: `${d}s` }} />
            ))}
            <div className="relative mx-auto w-full max-w-[1360px] px-4 pt-6 md:px-8 md:pt-8">
              <motion.a {...r()} href={REFS} className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-[#6b7280] transition-opacity hover:opacity-60">
                <ArrowRight size={15} className="rotate-180" /> Alle Referenzen
              </motion.a>
              <motion.div {...r(0.04)} className="mx-auto mt-6 flex max-w-[900px] flex-col items-center text-center md:mt-4">
                <img src={cfg.logo.light} alt={cfg.logo.alt} className={cfg.logo.square ? "h-20 w-auto md:h-24" : "h-9 w-auto md:h-11"} />
                <p className="mt-5 text-[0.88rem] font-medium text-[#6b7280]">{cfg.eyebrow}</p>
                {/* always two lines: split after the comma, sized to the screen so neither line wraps */}
                <h1 className="mt-4 font-bold leading-[1] tracking-[-0.06em] text-[#0e0e10]" style={{ fontSize: heroTitleSize(cfg.headline.statement ?? cfg.headline.unit) }}>
                  {(() => {
                    const t = cfg.headline.statement ?? cfg.headline.unit;
                    const i = t.indexOf(", ");
                    return i < 0 ? (
                      <span className="whitespace-nowrap">{t}<span style={{ color: accent }}>.</span></span>
                    ) : (
                      <>
                        <span className="block whitespace-nowrap">{t.slice(0, i + 1)}</span>
                        <span className="block whitespace-nowrap">{t.slice(i + 2)}<span style={{ color: accent }}>.</span></span>
                      </>
                    );
                  })()}
                </h1>
                <p className="mt-5 max-w-[48ch] text-[1.02rem] font-medium leading-[1.55] tracking-[-0.012em] text-[#6b7280] md:text-[1.1rem]">{cfg.intro}</p>
              </motion.div>

              {/* the machine, with the figures around it */}
              <div className="relative mx-auto mt-12 max-w-[1100px] md:mt-14">
                {cfg.machine ? (
                  <Washer value={cfg.headline.value} unit={cfg.headline.caption ?? cfg.headline.unit} display={cfg.machine.display} ink={ink} accent={accent} />
                ) : cfg.browser ? (
                  <BrowserHero scroll={cfg.browser.scroll} url={cfg.browser.url} alt={cfg.browser.alt} phone={cfg.browser.phone} phoneAlt={cfg.browser.phoneAlt} phoneVideo={cfg.browser.phoneVideo} value={cfg.headline.value} unit={cfg.headline.caption ?? cfg.headline.unit} ink={ink} />
                ) : cfg.phone ? (
                  <PhoneHero img={cfg.phone.img} alt={cfg.phone.alt} screenBg={cfg.phone.screenBg} value={cfg.headline.value} unit={cfg.headline.caption ?? cfg.headline.unit} toasts={cfg.phone.toasts} ink={ink} accent={accent} />
                ) : null}
                <div className={`${cfg.browser ? "mt-24 grid grid-cols-2 gap-2.5 md:mt-28 lg:grid-cols-4 lg:gap-4" : `${cfg.phone ? "mt-16" : "mt-8"} grid grid-cols-2 gap-2.5 lg:mt-0`}`}>
                  {cfg.stats.map((st, i) => (
                    <motion.div
                      key={st.label}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: EASE }}
                      className={cfg.browser ? "" : `lg:absolute lg:w-[230px] ${["lg:left-0 lg:top-[12%]", "lg:right-0 lg:top-[6%]", "lg:left-[4%] lg:top-[58%]", "lg:right-[4%] lg:top-[54%]"][i] ?? ""}`}
                    >
                      <div className="wb-float rounded-[20px] bg-white p-5 shadow-[0_30px_60px_-34px_rgba(0,24,80,0.4),0_0_0_1px_rgba(0,24,80,0.06)]" style={{ animationDelay: `${i * 0.9}s` }}>
                        <p className="text-[clamp(1.7rem,2.6vw,2.3rem)] font-bold leading-none tracking-[-0.055em] tabular-nums" style={{ color: ink }}>
                          {st.value}
                          {st.star && <sup className="ml-0.5 align-super text-[0.45em] font-semibold" style={{ color: accent }}>*</sup>}
                        </p>
                        <p className="mt-2 text-[0.88rem] font-medium leading-snug text-[#6b7280]">{st.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <p className="mx-auto mt-8 max-w-[70ch] text-center text-[0.78rem] font-medium leading-snug text-[#9a9aa0] md:mt-12">* {cfg.starNote}</p>
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.85rem] font-semibold" style={{ color: ink }}>
                {cfg.services.map((sv, i) => (
                  <span key={sv} className="flex items-center gap-2.5">
                    {i > 0 && <span className="h-1 w-1 rounded-full" style={{ background: accent }} />}
                    {sv}
                  </span>
                ))}
              </p>
            </div>
          </section>
        ) : (
          <>
        {/* hero: the routes themselves, flowing in to the client's places; the number counts up */}
        <section className="relative flex flex-col overflow-hidden md:block">
          {cfg.map && (
            <div className="relative order-2 h-[340px] md:absolute md:inset-0 md:h-auto">
              {/* phones: framed tightly around the places; wider screens: the whole map behind the text */}
              <div className="absolute inset-0 md:hidden">
                <HeroMap places={cfg.map.places} rivers={cfg.map.rivers} ink={ink} accent={accent} viewBox={(() => { const xs = cfg.map.places.map((p) => p.x), ys = cfg.map.places.map((p) => p.y); const w = Math.max(...xs) - Math.min(...xs) + 480, h = w / 1.1; const cy = (Math.min(...ys) + Math.max(...ys)) / 2 + 20; return `${Math.min(...xs) - 240} ${cy - h / 2} ${w} ${h}`; })()} />
              </div>
              <div className="absolute inset-0 hidden md:block">
                <HeroMap places={cfg.map.places} rivers={cfg.map.rivers} ink={ink} accent={accent} />
              </div>
              <div aria-hidden className="absolute inset-0 hidden md:block bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.94)_30%,rgba(255,255,255,0.4)_52%,rgba(255,255,255,0)_70%)]" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0),#ffffff)] md:h-24" />
              <div aria-hidden className="absolute inset-x-0 top-0 h-12 bg-[linear-gradient(0deg,rgba(255,255,255,0),#ffffff)] md:hidden" />
            </div>
          )}
          <div className="relative order-1 mx-auto w-full max-w-[1360px] px-4 pb-4 pt-8 md:min-h-[700px] md:px-8 md:pb-16 md:pt-10">
            <motion.a {...r()} href={REFS} className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-[#6b7280] transition-opacity hover:opacity-60">
              <ArrowRight size={15} className="rotate-180" /> Alle Referenzen
            </motion.a>
            <motion.div {...r(0.04)} className="mt-8 max-w-[600px] md:mt-12">
              <div className="flex items-center gap-4">
                <img src={cfg.logo.light} alt={cfg.logo.alt} className="h-9 w-auto md:h-10" />
                <span className="h-8 w-px bg-black/10" />
                <span className="text-[0.88rem] font-medium leading-snug text-[#6b7280]">{cfg.eyebrow}</span>
              </div>
              {cfg.headline ? (
                <>
                  <div className="mt-10 flex items-end gap-5 md:mt-12">
                    <span className="text-[clamp(4.6rem,10.5vw,8.6rem)] font-bold leading-[0.78] tracking-[-0.075em] tabular-nums" style={{ color: ink }}>
                      <Counter to={cfg.headline.value} />
                    </span>
                    {cfg.headline.caption && (
                      <span className="mb-1 max-w-[16ch] border-l-2 pl-3 text-[0.92rem] font-semibold leading-[1.25] text-[#424245] md:mb-2" style={{ borderColor: accent }}>
                        {cfg.headline.caption}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-7 max-w-[22ch] text-[clamp(1.9rem,3.4vw,2.9rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#0e0e10]">
                    {cfg.headline.statement ?? cfg.headline.unit}
                    <span style={{ color: accent }}>.</span>
                  </h1>
                </>
              ) : (
                <h1 className="mt-6 text-[clamp(2.6rem,6.4vw,5.6rem)] font-bold leading-[0.92] tracking-[-0.065em]" style={{ color: ink }}>{cfg.title}</h1>
              )}
              <p className="mt-5 max-w-[42ch] text-[1.02rem] font-medium leading-[1.55] tracking-[-0.012em] text-[#6b7280] md:text-[1.08rem]">{cfg.intro}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.85rem] font-semibold" style={{ color: ink }}>
                {cfg.services.map((sv, i) => (
                  <span key={sv} className="flex items-center gap-2.5">
                    {i > 0 && <span className="h-1 w-1 rounded-full" style={{ background: accent }} />}
                    {sv}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>
        </section>

        {/* key figures, an open row */}
        <section className="pb-14 md:pb-20">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...r(0.1)} className="grid grid-cols-2 border-t border-black/10 lg:grid-cols-4">
              {cfg.stats.map((st, i) => (
                <div key={st.label} className={`py-6 md:py-8 ${i % 2 ? "border-l border-black/10 pl-5 md:pl-8" : "pr-5"} ${i >= 2 ? "border-t border-black/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i === 1 ? "" : ""}`}>
                  <p className="text-[clamp(1.9rem,3vw,2.7rem)] font-bold leading-none tracking-[-0.055em] tabular-nums" style={{ color: ink }}>
                    {st.value}
                    {st.star && <sup className="ml-0.5 align-super text-[0.42em] font-semibold" style={{ color: accent }}>*</sup>}
                  </p>
                  <p className="mt-2.5 text-[0.9rem] font-medium leading-snug text-[#6b7280]">{st.label}</p>
                </div>
              ))}
            </motion.div>
            <p className="mt-1 text-[0.78rem] font-medium leading-snug text-[#9a9aa0]">* {cfg.starNote}</p>
          </div>
        </section>

          </>
        )}

        {cfg.video && <ServiceVideo base="" prefix={cfg.video.prefix} title={cfg.video.title} accent={ink} />}

        {/* the task: the moments people need the client, each with a search people really typed */}
        {cfg.catalog ? (
          <>
          {/* the website: every product on its own page, the special pages around it */}
          <section className="relative overflow-hidden py-20 md:py-28" style={{ background: soft }}>
            <style>{SITE_CSS}</style>
            <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <motion.div {...r()}>
                  <p className={LABEL} style={{ color: accent }}>{cfg.catalog.title}</p>
                  <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,3.9rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[#0e0e10]">
                    {cfg.catalog.statement}
                    <span style={{ color: accent }}>.</span>
                  </h2>
                </motion.div>
                <div className="mt-8 space-y-6">
                  {(cfg.task.columns ?? []).map((c, i) => (
                    <motion.div key={c.title} {...r(0.06 + i * 0.06)} className="border-l-2 pl-5" style={{ borderColor: i ? accent : "#0e0e1022" }}>
                      <p className="text-[1rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{c.title}</p>
                      <p className="mt-1.5 max-w-[46ch] text-[0.98rem] font-medium leading-[1.55] text-[#424245]">{c.text}</p>
                    </motion.div>
                  ))}
                </div>
                {cfg.catalog.features && (
                  <motion.ul {...r(0.14)} className="mt-8 flex flex-wrap gap-2">
                    {cfg.catalog.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[0.85rem] font-semibold text-[#0e0e10] ring-1 ring-black/5">
                        <Check size={14} style={{ color: accent }} aria-hidden /> {f}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
              <motion.div {...r(0.06)}>
                <ProductWall products={cfg.catalog.products} count={cfg.catalog.count} label={cfg.catalog.countLabel} ink={ink} wide={cfg.catalog.wallWide} />
              </motion.div>
            </div>
            {/* the special pages, each as it looks live */}
            {/* phones: a row to swipe through; wider screens: a grid */}
            <div className="mx-auto mt-14 w-full max-w-[1360px] px-4 md:mt-24 md:px-8">
            <p className="mb-4 flex items-center gap-1.5 text-[0.8rem] font-semibold text-[#86868b] sm:hidden">So sehen die Seiten live aus, zum Wischen <ArrowRight size={13} aria-hidden /></p>
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">
              {cfg.catalog.pages.map((pg, i) => (
                <motion.a key={pg.title} {...r(0.04 + (i % 3) * 0.06)} href={pg.url} target="_blank" rel="noreferrer" className="group block w-[82%] flex-none snap-start sm:w-auto">
                  <BrowserFrame url={pg.url?.replace(/^https?:\/\/(www\.)?/, "") ?? ""} className="shadow-[0_30px_60px_-34px_rgba(29,27,24,0.45)] transition-transform duration-500 group-hover:-translate-y-1">
                    <img src={pg.img} alt={pg.title} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
                  </BrowserFrame>
                  <p className="mt-4 flex items-center gap-1.5 text-[1.05rem] font-bold tracking-[-0.03em] text-[#0e0e10]">{pg.title} <ArrowUpRight size={15} className="opacity-40 transition-opacity group-hover:opacity-100" aria-hidden /></p>
                  <p className="mt-1 max-w-[42ch] text-[0.92rem] font-medium leading-snug text-[#6b7280]">{pg.text}</p>
                </motion.a>
              ))}
            </div>
            </div>
          </section>
          {cfg.tour && (
            /* the 360° tour, live on the page */
            <section className="py-20 md:py-28" style={{ background: ink }}>
              <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
                <motion.div {...r()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
                  <div>
                    <p className={LABEL} style={{ color: bright }}>{cfg.tour.title}</p>
                    <h2 className="mt-4 max-w-[16ch] text-[clamp(2.2rem,4.8vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.06em] text-white">
                      {cfg.tour.statement}
                      <span style={{ color: bright }}>.</span>
                    </h2>
                  </div>
                  <p className="max-w-[44ch] text-[1.02rem] font-medium leading-[1.55] text-white/70">{cfg.tour.text}</p>
                </motion.div>
                <TourStage tour={cfg.tour} accent={bright} ink={ink} />
                <div className="mt-6 grid grid-cols-3 gap-2.5 md:mt-8 md:gap-4">
                  {cfg.tour.facts.map((f) => (
                    <div key={f.label} className="rounded-[20px] bg-white/[0.06] p-4 md:p-6">
                      <p className="text-[clamp(1.6rem,3vw,2.6rem)] font-bold leading-none tracking-[-0.055em] text-white">{f.value}</p>
                      <p className="mt-2 text-[0.8rem] font-medium leading-snug text-white/65 md:text-[0.92rem]">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          </>
        ) : cfg.task.moments ? (
          <section className="relative overflow-hidden bg-[#f5f5f7] py-20 md:py-28">
            <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <motion.div {...r()}>
                  <p className="text-[0.8rem] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{cfg.task.title}</p>
                  <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,3.9rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[#0e0e10]">
                    {cfg.task.statement}
                    <span style={{ color: accent }}>.</span>
                  </h2>
                </motion.div>
                <div className="mt-8 space-y-6">
                  {(cfg.task.columns ?? []).map((c, i) => (
                    <motion.div key={c.title} {...r(0.06 + i * 0.06)} className="border-l-2 pl-5" style={{ borderColor: i ? accent : "#0e0e1022" }}>
                      <p className="text-[1rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{c.title}</p>
                      <p className="mt-1.5 max-w-[46ch] text-[0.98rem] font-medium leading-[1.55] text-[#424245]">{c.text}</p>
                    </motion.div>
                  ))}
                </div>
                {cfg.task.badge && (
                  <motion.div {...r(0.14)} className="mt-9 flex items-center gap-4">
                    <img src={cfg.task.badge.src} alt={cfg.task.badge.alt} className="h-24 w-24 drop-shadow-[0_18px_30px_rgba(0,24,80,0.3)] md:h-28 md:w-28" />
                    <p className="max-w-[24ch] text-[0.95rem] font-semibold leading-snug text-[#0e0e10]">{cfg.task.badge.text}</p>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 md:gap-4">
                {cfg.task.moments.map((m, i) =>
                  m.shape ? (
                  /* an ad creative shown whole, caption underneath so nothing sits on the ad's own text */
                  <motion.figure key={m.title} {...r(0.05 + i * 0.07)} className={`group flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_60px_-34px_rgba(15,42,74,0.45)] ${i % 2 ? "md:translate-y-10" : ""}`}>
                    <div className="relative grid aspect-[4/5] place-items-center overflow-hidden" style={{ background: soft }}>
                      <span aria-hidden className="absolute -bottom-1/4 left-1/2 h-3/4 w-3/4 -translate-x-1/2 rounded-full blur-3xl" style={{ background: `${accent}26` }} />
                      <div className="relative transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-[1.02]">
                        {m.shape === "phone" && m.video ? (
                          <MiniPhone src={m.video} poster={m.img} label={m.alt} className="h-[clamp(190px,30vw,400px)]" />
                        ) : (
                          <AdPost img={m.img} alt={m.alt} brand={brand} aspect={m.shape === "portrait" ? "portrait" : "square"} className={m.shape === "portrait" ? "w-[clamp(118px,15vw,230px)]" : "w-[clamp(136px,19vw,290px)]"} />
                        )}
                      </div>
                    </div>
                    <figcaption className="flex flex-1 flex-col p-4 md:p-6">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <span className="rounded-full px-2.5 py-1 text-[0.62rem] font-bold tabular-nums text-white md:text-[0.74rem]" style={{ background: ink }}>{m.stat ?? `${(m.clicks ?? 0).toLocaleString("de-DE")} ${m.unit ?? "Klicks"}`}</span>
                        <span className="text-[0.66rem] font-semibold text-[#86868b] md:text-[0.78rem]">{m.search}</span>
                      </div>
                      <p className="mt-2.5 text-[0.98rem] font-bold leading-[1.18] tracking-[-0.03em] text-[#0e0e10] md:text-[1.3rem]">{m.title}</p>
                    </figcaption>
                  </motion.figure>
                  ) : (
                  <motion.figure key={m.title} {...r(0.05 + i * 0.07)} className={`group relative overflow-hidden rounded-[24px] ${i % 2 ? "md:translate-y-10" : ""}`}>
                    <img src={m.img} alt={m.alt} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(0,24,80,0)_0%,rgba(0,24,80,0.7)_100%)]" />
                    {/* the search people really typed, with its clicks */}
                    <div className="absolute inset-x-2.5 top-2.5 flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-3 pr-1.5 shadow-[0_10px_24px_-14px_rgba(0,24,80,0.5)] md:inset-x-4 md:top-4 md:py-2">
                      {m.review ? (
                        <svg width="14" height="14" viewBox="0 0 48 48" className="flex-none" aria-hidden><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.2z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.7 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.3C2.8 17.1 2 20.5 2 24s.8 6.9 2.3 9.9l7.4-5.7z"/><path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 7.9 6.9 4.3 14.1l7.4 5.7c1.7-5.2 6.6-9.1 12.3-9.1z"/></svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 44 44" className="flex-none" aria-hidden><circle cx="19" cy="19" r="13" stroke="#9aa0a6" strokeWidth="4" fill="none" /><path d="M29 29l11 11" stroke="#9aa0a6" strokeWidth="4" /></svg>
                      )}
                      <span className="min-w-0 flex-1 truncate text-[0.7rem] font-semibold text-[#202124] md:text-[0.85rem]">{m.search}</span>
                      <span className="flex-none rounded-full px-2 py-0.5 text-[0.62rem] font-bold tabular-nums text-white md:text-[0.72rem]" style={{ background: ink }}>{m.stat ?? `${(m.clicks ?? 0).toLocaleString("de-DE")} ${m.unit ?? "Klicks"}`}</span>
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                      {m.fact && <p className="text-[0.66rem] font-black uppercase tracking-[0.14em] text-white/75 md:text-[0.72rem]">{m.fact}</p>}
                      <p className="mt-1.5 text-[0.98rem] font-bold leading-[1.15] tracking-[-0.03em] text-white md:text-[1.35rem]">{m.title}</p>
                    </figcaption>
                  </motion.figure>
                  ),
                )}
              </div>
            </div>
            {cfg.task.momentsNote && <p className="mx-auto mt-14 w-full max-w-[1360px] px-4 text-[0.78rem] font-medium text-[#9a9aa0] md:mt-20 md:px-8">{cfg.task.momentsNote}</p>}
          </section>
        ) : cfg.task.journey ? (
          <section className="bg-[#f5f5f7] py-20 md:py-28">
            <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
                <motion.div {...r()}>
                  <p className="text-[0.8rem] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{cfg.task.title}</p>
                  <h2 className="mt-4 text-[clamp(2.2rem,4.8vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[#0e0e10]">
                    {cfg.task.statement}
                    <span style={{ color: accent }}>.</span>
                  </h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                  {(cfg.task.columns ?? []).map((c, i) => (
                    <motion.div key={c.title} {...r(0.06 + i * 0.06)} className="border-t-2 pt-4" style={{ borderColor: i ? accent : "#0e0e1022" }}>
                      <p className="text-[1rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{c.title}</p>
                      <p className="mt-2 text-[0.98rem] font-medium leading-[1.55] text-[#424245]">{c.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* the journey */}
              <div className="relative mt-12 md:mt-16">
                <div aria-hidden className="absolute left-[6%] right-[6%] top-[38%] hidden h-[2px] lg:block" style={{ backgroundImage: `linear-gradient(90deg, ${accent} 50%, transparent 50%)`, backgroundSize: "14px 2px", opacity: 0.45 }} />
                <ol className="relative grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
                  {cfg.task.journey.map((st, i) => (
                    <motion.li key={st.title} {...r(0.05 + i * 0.08)} className="flex flex-col overflow-hidden rounded-[24px] bg-white">
                      <div className="relative aspect-[4/3.6]" style={{ background: st.kind === "photo" || st.kind === "arrival" ? undefined : soft }}>
                        <JourneyVisual step={st} ink={ink} accent={accent} client={cfg.client} />
                        <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-[0.8rem] font-black tabular-nums shadow-[0_6px_16px_-8px_rgba(0,24,80,0.4)] md:left-4 md:top-4" style={{ color: ink }}>{i + 1}</span>
                        {st.chip && (
                          <span className="absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[0.7rem] font-bold text-white md:bottom-4 md:right-4 md:text-[0.75rem]" style={{ background: ink }}>{st.chip}</span>
                        )}
                      </div>
                      <div className="flex-1 p-4 md:p-6">
                        <p className="text-[1.02rem] font-bold leading-tight tracking-[-0.03em] text-[#0e0e10] md:text-[1.2rem]">{st.title}</p>
                        <p className="mt-1.5 text-[0.85rem] font-medium leading-[1.45] text-[#6b7280] md:text-[0.92rem]">{st.text}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        ) : (
        /* the task, next to the real place */
        <section className="bg-[#f5f5f7] py-20 md:py-28">
          <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <motion.div {...r()}>
              <H2 accent={accent}>{cfg.task.title}</H2>
              {cfg.task.text.map((t, i) => (
                <p key={i} className="mt-5 max-w-[50ch] text-[1.05rem] font-medium leading-[1.55] tracking-[-0.015em] text-[#424245] md:text-[1.1rem]">{t}</p>
              ))}
            </motion.div>
            <div className="grid grid-cols-[1.4fr_1fr] gap-2.5 md:gap-4">
              {cfg.task.photos.map((p, i) => (
                <motion.img key={p.src} {...r(0.06 + i * 0.06)} src={p.src} alt={p.alt} loading="lazy" className={`h-full w-full rounded-[22px] object-cover ${i === 0 ? "row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[460px]" : "aspect-[4/5]"}`} />
              ))}
            </div>
          </div>
        </section>

        )}

        {cfg.blog && (
          /* the publishing rhythm: week by week, then every article as it looks live */
          <section className="py-20 md:py-28">
            <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
              <motion.div {...r()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
                <div>
                  <p className={LABEL} style={{ color: accent }}>{cfg.blog.title}</p>
                  <h2 className="mt-4 max-w-[18ch] text-[clamp(2.2rem,4.8vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[#0e0e10]">
                    {cfg.blog.statement}
                    <span style={{ color: accent }}>.</span>
                  </h2>
                </div>
                <p className="max-w-[44ch] text-[1.02rem] font-medium leading-[1.55] text-[#6b7280]">{cfg.blog.text}</p>
              </motion.div>
              {/* the weeks */}
              <motion.ol {...r(0.06)} className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-14 md:grid md:overflow-visible md:pb-0 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ["--n" as string]: cfg.blog.weeks.length }}>
                {cfg.blog.weeks.map((w, i) => (
                  <li
                    key={w.date}
                    className={`relative min-w-[132px] flex-none rounded-[18px] p-4 md:min-w-0 md:p-5 ${w.next ? "border-2 border-dashed border-black/15" : ""}`}
                    style={w.next ? undefined : { background: i === 0 ? ink : soft }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: w.next ? "#d4d0ca" : bright }} />
                      <span className={`text-[0.72rem] font-black uppercase tracking-[0.12em] ${i === 0 && !w.next ? "text-white/60" : "text-[#86868b]"}`}>{w.next ? "Nächste Woche" : i === 0 ? "Start" : "Neuer Artikel"}</span>
                    </span>
                    <p className={`mt-3 text-[1.25rem] font-bold leading-none tracking-[-0.04em] ${i === 0 && !w.next ? "text-white" : "text-[#0e0e10]"}`}>{w.date}</p>
                    {w.note && <p className={`mt-1.5 text-[0.82rem] font-medium leading-snug ${i === 0 && !w.next ? "text-white/70" : "text-[#6b7280]"}`}>{w.note}</p>}
                  </li>
                ))}
              </motion.ol>
              {/* every article */}
              <div className="mt-10 md:mt-14">
              <p className="mb-4 flex items-center gap-1.5 text-[0.8rem] font-semibold text-[#86868b] sm:hidden">Alle Artikel, zum Wischen <ArrowRight size={13} aria-hidden /></p>
              <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">
                {cfg.blog.posts.map((pg, i) => (
                  <motion.a key={pg.url} {...r(0.04 + (i % 3) * 0.06)} href={pg.url} target="_blank" rel="noreferrer" className="group block w-[82%] flex-none snap-start sm:w-auto">
                    <BrowserFrame url={pg.url.replace(/^https?:\/\/(www\.)?/, "")} className="shadow-[0_30px_60px_-34px_rgba(31,26,22,0.45)] transition-transform duration-500 group-hover:-translate-y-1">
                      <img src={pg.img} alt={pg.title} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
                    </BrowserFrame>
                    <p className="mt-4 flex items-center gap-2 text-[0.78rem] font-bold">
                      <span className="rounded-full px-2.5 py-1 text-white" style={{ background: ink }}>{pg.date}</span>
                      <span style={{ color: accent }}>{pg.tag}</span>
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-[1.05rem] font-bold leading-snug tracking-[-0.03em] text-[#0e0e10]">{pg.title} <ArrowUpRight size={15} className="mt-1 flex-none opacity-40 transition-opacity group-hover:opacity-100" aria-hidden /></p>
                  </motion.a>
                ))}
              </div>
              </div>
              <motion.a {...r(0.1)} href={cfg.blog.allUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 border-b-2 pb-0.5 text-[1rem] font-bold tracking-[-0.03em] text-[#0e0e10] transition-opacity hover:opacity-60 md:mt-14" style={{ borderColor: ink }}>
                Zum Ratgeber <ArrowUpRight size={16} aria-hidden />
              </motion.a>
            </div>
          </section>
        )}

        {cfg.galleryFirst && galleryEl}

        {/* the evidence */}
        {!cfg.numbers.hide && (
        <section
          className="relative py-20 md:py-28"
          style={cfg.numbers.bg ? { backgroundImage: `url(${cfg.numbers.bg})`, backgroundRepeat: "repeat", backgroundSize: "auto 1200px", backgroundPosition: "center top" } : undefined}
        >
          {cfg.numbers.bg && <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,4,0.45)_0%,rgba(20,12,4,0.12)_30%,rgba(20,12,4,0.25)_100%)]" />}
          <div className="relative mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...r()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
              {cfg.numbers.bg ? (
                <h2 className="text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.06em] text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]">
                  {cfg.numbers.title}
                  <span style={{ color: accent }}>.</span>
                </h2>
              ) : (
                <H2 accent={accent}>{cfg.numbers.title}</H2>
              )}
              <p className={`max-w-[46ch] text-[1.02rem] font-medium leading-[1.5] ${cfg.numbers.bg ? "text-white/85" : "text-[#6b7280]"}`}>{cfg.numbers.intro}</p>
            </motion.div>

            {cfg.numbers.meta ? (
              <MetaGrid x={cfg.numbers.meta} reduce={reduce} ink={ink} accent={accent} bright={bright} soft={soft} />
            ) : cfg.numbers.ratios ? (
              <RatioGrid x={cfg.numbers.ratios} reduce={reduce} ink={ink} accent={accent} soft={soft} />
            ) : (
            <div className="mt-10 grid gap-2.5 md:mt-14 md:grid-cols-12 md:gap-4">
              {/* month by month */}
              <motion.div {...r(0.04)} className="rounded-[24px] p-6 shadow-[0_30px_60px_-30px_rgba(20,12,4,0.55)] md:col-span-7 md:p-8" style={{ background: soft }}>
                <p className="text-[0.8rem] font-black uppercase tracking-[0.14em]" style={{ color: ink }}>{N.monthsTitle}</p>
                <div className="mt-6 flex h-[240px] items-end gap-1.5 sm:gap-4 md:h-[280px] md:gap-6">
                  {N.months.map((m, i) => (
                    <div key={m.label} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                      <p className={`mb-2 text-center font-bold tracking-[-0.05em] text-[#0e0e10] tabular-nums ${N.months.length > 4 ? "text-[clamp(0.72rem,2.4vw,2.1rem)]" : "text-[clamp(1.4rem,2.4vw,2.1rem)]"}`}>{m.value.toLocaleString("de-DE")}</p>
                      <motion.div
                        initial={reduce ? false : { scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                        className="origin-bottom rounded-t-[14px] rounded-b-[6px]"
                        style={{ height: `${Math.max(4, (m.value / max) * 100)}%`, background: i === N.months.length - 1 ? accent : `${accent}55` }}
                      />
                      <p className="mt-3 text-center text-[0.78rem] font-semibold text-[#6b7280] sm:text-[0.9rem]">{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* cost per visit, falling */}
              <motion.div {...r(0.08)} className="flex flex-col justify-between rounded-[24px] p-6 text-white shadow-[0_30px_60px_-30px_rgba(20,12,4,0.55)] md:col-span-5 md:p-8" style={{ background: ink }}>
                <p className="text-[0.8rem] font-black uppercase tracking-[0.14em]" style={{ color: accent }}>{N.drop.title ?? "Kosten pro Ladenbesuch*"}</p>
                <div className="mt-8">
                  {N.drop.from && (
                    <>
                      <p className="text-[1.5rem] font-bold tracking-[-0.04em] text-white/45 line-through decoration-[#ff3b30] decoration-[3px] tabular-nums">{N.drop.from}</p>
                      <p className="text-[0.85rem] font-semibold text-white/45">{N.drop.fromLabel}</p>
                    </>
                  )}
                  <p className="mt-4 text-[clamp(4rem,7vw,6rem)] font-bold leading-[0.85] tracking-[-0.07em] text-white tabular-nums">{N.drop.to}</p>
                  <p className="mt-2 text-[0.95rem] font-semibold" style={{ color: accent }}>{N.drop.toLabel}</p>
                </div>
                <p className="mt-6 text-[0.95rem] font-medium leading-[1.5] text-white/70">{N.drop.text}</p>
              </motion.div>

              {/* the two places */}
              <motion.div {...r(0.04)} className="rounded-[24px] bg-[#f5f5f7] p-6 shadow-[0_30px_60px_-30px_rgba(20,12,4,0.55)] md:col-span-5 md:p-8">
                <p className="text-[0.8rem] font-black uppercase tracking-[0.14em]" style={{ color: ink }}>{N.placesTitle ?? "Pro Standort"}</p>
                <div className="mt-5 space-y-3">
                  {N.places.map((p) => (
                    <div key={p.name} className="rounded-[18px] bg-white p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[1.25rem] font-bold tracking-[-0.035em] text-[#0e0e10]">{p.name}</p>
                        <p className="text-[0.78rem] font-semibold text-[#86868b]">seit {p.since}</p>
                      </div>
                      <p className="text-[0.88rem] font-medium text-[#6b7280]">{p.how}</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <p><b className="block text-[1.8rem] font-bold leading-none tracking-[-0.05em] text-[#0e0e10] tabular-nums">{p.a}</b><span className="text-[0.82rem] font-semibold text-[#86868b]">{p.aLabel}</span></p>
                        <p><b className="block text-[1.8rem] font-bold leading-none tracking-[-0.05em] tabular-nums" style={{ color: accent }}>{p.b}</b><span className="text-[0.82rem] font-semibold text-[#86868b]">{p.bLabel}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {N.ai ? (
                /* first recommendation in AI chats */
                <motion.div {...r(0.08)} className="grid gap-6 rounded-[24px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(20,12,4,0.55)] md:col-span-7 md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-8">
                  <div>
                    <p className="flex items-center gap-2 text-[0.8rem] font-black uppercase tracking-[0.14em]" style={{ color: ink }}>
                      <Sparkles size={15} style={{ color: accent }} aria-hidden /> {N.ai.title}
                    </p>
                    <p className="mt-4 text-[clamp(4rem,7vw,6rem)] font-bold leading-[0.85] tracking-[-0.07em] tabular-nums" style={{ color: ink }}>{N.ai.rank}</p>
                    <p className="mt-4 max-w-[30ch] text-[0.98rem] font-medium leading-[1.5] text-[#424245]">{N.ai.text}</p>
                    <p className="mt-3 text-[0.78rem] font-semibold text-[#9a9aa0]">{N.ai.note}</p>
                  </div>
                  <div className="rounded-[20px] bg-[#f5f5f7] p-4">
                    <p className="ml-auto w-fit max-w-[90%] rounded-[16px] rounded-br-[6px] px-3.5 py-2.5 text-[0.88rem] font-medium leading-snug text-white" style={{ background: ink }}>{N.ai.question}</p>
                    <div className="mt-3 rounded-[16px] rounded-bl-[6px] bg-white p-3.5">
                      <p className="flex items-center gap-1.5 text-[0.72rem] font-bold text-[#86868b]"><Sparkles size={12} aria-hidden /> KI-Assistent</p>
                      <div className="mt-2.5 flex items-start gap-3 rounded-[12px] p-2.5" style={{ background: soft }}>
                        <span className="grid h-7 w-7 flex-none place-items-center rounded-full text-[0.8rem] font-black text-white" style={{ background: accent }}>1</span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-x-2">
                            <b className="text-[0.95rem] text-[#0e0e10]">{N.ai.place}</b>
                            <span className="rounded-full px-2 py-0.5 text-[0.62rem] font-bold text-white" style={{ background: ink }}>Empfohlen</span>
                          </span>
                          <span className="mt-0.5 block text-[0.8rem] leading-snug text-[#6b7280]">{N.ai.detail}</span>
                        </span>
                      </div>
                      {[2, 3].map((n) => (
                        <div key={n} className="mt-2 flex items-center gap-3 px-2.5 py-1.5 opacity-60">
                          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#e3e6ec] text-[0.72rem] font-bold text-[#86868b]">{n}</span>
                          <span className="h-2.5 rounded-full bg-[#e3e6ec] blur-[1px]" style={{ width: `${n === 2 ? 58 : 44}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
              /* what people actually searched */
              <motion.div {...r(0.08)} className="rounded-[24px] bg-[#f5f5f7] p-6 md:col-span-7 md:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[0.8rem] font-black uppercase tracking-[0.14em]" style={{ color: ink }}>{N.searchesTitle ?? "Echte Suchen"}</p>
                  <p className="text-[0.78rem] font-semibold text-[#86868b]">{N.searchesUnit ?? "Klicks"}</p>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {N.searches.map((s) => (
                    <li key={s.q} className="relative flex items-center justify-between overflow-hidden rounded-[14px] bg-white px-4 py-3">
                      <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: `${(s.clicks / top) * 100}%`, background: `${accent}22` }} />
                      <span className="relative flex items-center gap-2.5 text-[0.98rem] font-semibold text-[#202124]">
                        {N.searchesIcon !== false && <svg width="15" height="15" viewBox="0 0 44 44" aria-hidden><circle cx="19" cy="19" r="13" stroke="#9aa0a6" strokeWidth="4" fill="none" /><path d="M29 29l11 11" stroke="#9aa0a6" strokeWidth="4" /></svg>}
                        {s.q}
                      </span>
                      <span className="relative text-[0.98rem] font-bold tabular-nums text-[#0e0e10]">{s.clicks}</span>
                    </li>
                  ))}
                </ul>
                {N.searchNote && (
                  <p className="mt-5 flex items-center gap-2 text-[0.95rem] font-semibold text-[#0e0e10]">
                    <Smartphone size={18} style={{ color: accent }} aria-hidden /> {N.searchNote}
                  </p>
                )}
              </motion.div>

              )}

              {N.small.map((s, i) => (
                <motion.div key={s.label} {...r(0.04 + i * 0.04)} className="rounded-[24px] p-6 shadow-[0_30px_60px_-30px_rgba(20,12,4,0.55)] md:col-span-4 md:p-8" style={{ background: soft }}>
                  <p className="text-[clamp(2.4rem,4vw,3.4rem)] font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums">{s.value}</p>
                  <p className="mt-3 text-[1rem] font-bold tracking-[-0.02em] text-[#0e0e10]">{s.label}</p>
                  <p className="mt-1 text-[0.88rem] font-medium leading-snug text-[#6b7280]">{s.sub}</p>
                </motion.div>
              ))}
            </div>
            )}
            <p className={`mt-4 text-[0.8rem] font-medium leading-snug ${cfg.numbers.bg ? "text-white/75" : "text-[#86868b]"}`}>{cfg.numbers.source}</p>
          </div>
        </section>
        )}

        {/* the client's pictures and videos (before the numbers when galleryFirst) */}
        {!cfg.galleryFirst && galleryEl}

        {/* what we did: grouped by area, with the real platforms */}
        {cfg.work ? (
          <section className="py-20 md:py-28">
            <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
              <motion.div {...r()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
                <H2 accent={accent}>{cfg.work.title}</H2>
                {cfg.work.intro && <p className="max-w-[46ch] text-[1.02rem] font-medium leading-[1.5] text-[#6b7280]">{cfg.work.intro}</p>}
              </motion.div>
              <div className="mt-10 md:mt-14">
              <p className="mb-4 flex items-center gap-1.5 text-[0.8rem] font-semibold text-[#86868b] sm:hidden">Alle Bausteine, zum Wischen <ArrowRight size={13} aria-hidden /></p>
              <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {cfg.work.groups.map((g, i) => (
                  <motion.div key={g.title} {...r(0.04 + (i % 3) * 0.06)} className="flex w-[82%] flex-none snap-start flex-col rounded-[24px] bg-[#f5f5f7] p-6 sm:w-auto md:p-8">
                    <div className="flex items-center gap-2">
                      {g.logos?.map((l) => (
                        <span key={l} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_8px_20px_-12px_rgba(0,24,80,0.35)]">
                          <img src={l} alt="" className="h-5 w-5 object-contain" />
                        </span>
                      ))}
                      {g.icon && (
                        <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: g.icon === "report" ? ink : accent }}>
                          {g.icon === "web" ? <Globe size={20} strokeWidth={2.2} /> : g.icon === "blog" ? <BookOpen size={20} strokeWidth={2.2} /> : g.icon === "form" ? <FileText size={20} strokeWidth={2.2} /> : g.icon === "image" ? <ImageIcon size={20} strokeWidth={2.2} /> : g.icon === "video" ? <Clapperboard size={20} strokeWidth={2.2} /> : <BarChart3 size={20} strokeWidth={2.2} />}
                        </span>
                      )}
                    </div>
                    <p className="mt-6 text-[1.35rem] font-bold leading-tight tracking-[-0.04em] text-[#0e0e10]">{g.title}</p>
                    <ul className="mt-4 space-y-2.5">
                      {g.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-[0.97rem] font-medium leading-[1.45] text-[#424245]">
                          <Check size={17} strokeWidth={2.6} className="mt-[3px] flex-none" style={{ color: accent }} aria-hidden />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
              </div>
            </div>
          </section>
        ) : (
        /* what we did, dated */
        <section className="py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...r()}>
              <H2 accent={accent}>{cfg.timeline.title}</H2>
            </motion.div>
            <ol className="mt-10 grid gap-x-12 md:mt-14 md:grid-cols-2">
              {cfg.timeline.items.map((t, i) => (
                <motion.li key={t.date + i} {...r(0.02 * i)} className="flex gap-5 border-t border-black/10 py-5">
                  <span className="w-[76px] flex-none text-[0.95rem] font-bold tabular-nums" style={{ color: accent }}>{t.date}</span>
                  <span className="text-[1.02rem] font-medium leading-[1.5] text-[#0e0e10]">{t.text}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
        )}

        {/* the website, then the owner's words */}
        {(cfg.site || cfg.quote) && (
          <section className="pb-20 md:pb-28">
            <div className="mx-auto grid w-full max-w-[1360px] gap-2.5 px-4 md:grid-cols-12 md:gap-4 md:px-8">
              {cfg.site && (
                <motion.a {...r()} href={cfg.site.url} target="_blank" rel="noreferrer" className="group relative min-h-[320px] overflow-hidden rounded-[24px] md:col-span-7 md:min-h-[460px]">
                  <img src={cfg.site.img} alt={cfg.site.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(14,14,16,0),rgba(14,14,16,0.7))]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <span>
                      <span className="block text-[1.5rem] font-bold tracking-[-0.04em] text-white">Die Website</span>
                      <span className="mt-1 block max-w-[40ch] text-[0.95rem] font-medium text-white/80">{cfg.site.text}</span>
                    </span>
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-white text-[#0e0e10]"><ArrowUpRight size={20} /></span>
                  </div>
                </motion.a>
              )}
              {cfg.quote && (
                <motion.figure {...r(0.06)} className={`flex flex-col justify-between rounded-[24px] p-7 md:p-10 ${cfg.site ? "md:col-span-5" : "md:col-span-12 md:flex-row md:items-end md:gap-12"}`} style={{ background: soft }}>
                  <img src={cfg.logo.light} alt={cfg.logo.alt} className="h-9 w-auto self-start" />
                  <blockquote className="mt-10 text-[clamp(1.5rem,2.4vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.04em] text-[#0e0e10]">„{cfg.quote.text}“</blockquote>
                  <figcaption className="mt-6 text-[0.95rem] font-semibold text-[#6b7280]">{cfg.quote.who}</figcaption>
                </motion.figure>
              )}
            </div>
          </section>
        )}

        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}
