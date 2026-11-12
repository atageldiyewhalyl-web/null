import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useSoundVideo } from "./useSoundVideo";
import { ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { AiVisual, EnquiryVisual, GoogleVisual, InstagramVisual } from "./SystemVisuals";

const BASE = "/assets/v2/explainer";

/*
 * Section under the hero: the 30 s "Lisa" explainer grows from a card to full width as the visitor scrolls,
 * then the four parts of the system follow as alternating rows (visual left, right, left, right),
 * each with its own live motion graphic (SystemVisuals.tsx).
 */
const PARTS = [
  { n: "01", tag: "SEO & Google Ads", title: "Gefunden werden", text: "Wenn jemand in deiner Stadt sucht, was du anbietest, stehst du bei Google ganz oben. Mit sauberem SEO und gezielten Google Ads.", link: { label: "Zu SEO & Google Ads", href: "/leistungen/seo" }, Visual: GoogleVisual, tint: "#eef3fb" },
  { n: "02", tag: "KI-Sichtbarkeit", title: "Empfohlen werden", text: "Immer mehr Kunden fragen ChatGPT, Claude oder Gemini. Wir bereiten deine Inhalte so auf, dass diese Assistenten dich kennen und empfehlen.", link: { label: "Zur KI-Sichtbarkeit", href: "/leistungen/ki-sichtbarkeit" }, Visual: AiVisual, tint: "#f3f1fb" },
  { n: "03", tag: "Content", title: "Gesehen werden", text: "Videos und Texte, die zeigen, was du kannst. Für deine Website und für Instagram, damit Kunden dich kennen, bevor sie anfragen.", link: { label: "Zum Content", href: "/leistungen/content" }, Visual: InstagramVisual, tint: "#fdf1f4", phone: true },
  { n: "04", tag: "Website & Tracking", title: "Angefragt werden", text: "Deine Website führt Besucher direkt zur Anfrage. Per Formular, Anruf oder WhatsApp. Und jeden Monat siehst du, was es gebracht hat.", link: { label: "Zum Webdesign", href: "/leistungen/webdesign" }, Visual: EnquiryVisual, tint: "#e9f2ff", phone: true },
];

// sources for the growing video (homepage: the Lisa explainer; city pages pass their own)
export type ScrollVideoSrc = { wide: string; wideSmall?: string; tall: string; poster: string; posterTall: string; captions?: string }; // captions: WebVTT, offered as a German track (off by default)
const HOME_VIDEO: ScrollVideoSrc = { wide: `${BASE}/explainer-1080.mp4`, wideSmall: `${BASE}/explainer-720.mp4`, tall: `${BASE}/explainer-9x16.mp4`, poster: `${BASE}/poster.jpg`, posterTall: `${BASE}/poster-9x16.jpg` };

// the video grows from a card to full width as the visitor scrolls (sticky), sound per useSoundVideo
export function ScrollVideo({ src = HOME_VIDEO }: { src?: ScrollVideoSrc }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  // phones get the 9:16 cut (same animation, same voice). Decided after mount, so the server always renders 16:9.
  const [tall, setTall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const on = () => setTall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], reduce ? [1, 1] : [0.56, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.6], reduce ? [24, 24] : [36, 0]);

  // plays only while on screen, with sound when the browser allows it, else from the visitor's first tap (useSoundVideo)
  const { muted, toggle: toggleSound } = useSoundVideo(video, tall);

  return (
    <div ref={wrap} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, borderRadius: radius }}
          className={`relative max-w-[100vw] overflow-hidden bg-[#f5f5f7] ${tall ? "aspect-[9/16] w-[min(100vw,56.25dvh)]" : "aspect-video w-full lg:w-[min(100vw,177.78dvh)]"}`}
        >
          {tall ? (
            <video key="tall" ref={video} className="h-full w-full object-cover" muted loop playsInline preload="metadata" poster={src.posterTall}>
              <source src={src.tall} type="video/mp4" />
              {src.captions && <track kind="captions" src={src.captions} srcLang="de" label="Deutsch" />}
            </video>
          ) : (
            <video key="wide" ref={video} className="h-full w-full object-cover" muted loop playsInline preload="metadata" poster={src.poster}>
              <source src={src.wide} type="video/mp4" media={src.wideSmall ? "(min-width: 1024px)" : undefined} />
              {src.wideSmall && <source src={src.wideSmall} type="video/mp4" />}
              {src.captions && <track kind="captions" src={src.captions} srcLang="de" label="Deutsch" />}
            </video>
          )}
          <button
            type="button"
            onClick={toggleSound}
            data-sound-toggle
            aria-label={muted ? "Ton einschalten" : "Ton ausschalten"}
            className={`absolute right-4 ${tall ? "top-4" : "bottom-4 md:bottom-6 md:right-6"} inline-flex min-h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#111111] shadow-[0_18px_48px_rgba(15,23,42,0.13)] backdrop-blur transition-opacity hover:opacity-80`}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? "Ton an" : "Ton aus"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function PartRow({ p, i }: { p: (typeof PARTS)[number]; i: number }) {
  const reduce = useReducedMotion();
  const visualRight = i % 2 === 1;
  const { Visual } = p;
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      // below desktop: a bento card in the part's tint, text on top, the live graphic below it, cut by the card's bottom edge.
      // desktop: wide card, graphic and text side by side.
      className="grid overflow-hidden rounded-[24px] bg-[var(--tint)] lg:min-h-[640px] lg:grid-cols-2 lg:bg-[linear-gradient(var(--dir),var(--tint)_0%,#ffffff_85%)]"
      style={{ "--tint": p.tint, "--dir": visualRight ? "270deg" : "90deg" } as React.CSSProperties}
    >
      <div className={`relative order-2 lg:h-auto lg:overflow-hidden lg:rounded-[24px] ${p.phone ? "h-[400px] sm:h-[460px]" : "h-[360px] sm:h-[420px]"} ${visualRight ? "lg:order-2" : "lg:order-1"}`}>
        <Visual />
      </div>
      <div className={`order-1 flex flex-col justify-center px-6 pb-6 pt-7 sm:px-10 sm:pt-10 lg:px-16 lg:py-16 ${visualRight ? "lg:order-1" : "lg:order-2"}`}>
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">
          {p.n} · {p.tag}
        </p>
        <h3 className="mt-3 text-[clamp(2.1rem,5vw,4.4rem)] font-bold leading-[0.92] tracking-[-0.065em] text-[#0e0e10] lg:mt-4">
          {p.title}
          <span className="text-[#007aff]">.</span>
        </h3>
        <p className="mt-3 max-w-[38ch] text-[0.98rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245] lg:mt-6 lg:text-[1.08rem]">{p.text}</p>
        {/* phones: a quiet text link; desktop: the blue button */}
        <a href={p.link.href} className="mt-4 inline-flex w-max items-center gap-1.5 text-[0.95rem] font-bold tracking-[-0.02em] text-[#007aff] lg:hidden">
          {p.link.label}
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </a>
        <a
          href={p.link.href}
          className="group mt-8 hidden min-h-12 w-max items-center gap-3 rounded-full bg-[#007aff] px-6 text-[0.8rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 lg:inline-flex"
        >
          {p.link.label}
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.article>
  );
}

export default function ExplainerV2() {
  return (
    <section id="so-funktionierts" className="relative bg-white text-[#0e0e10]">
      <ScrollVideo />
      <div className="mx-auto w-full max-w-[1360px] px-4 pb-24 pt-10 md:px-8 md:pb-32">
        <h2 className="mx-auto max-w-[16ch] text-center text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
          So funktioniert dein Anfragesystem<span className="text-[#007aff]">.</span>
        </h2>
        <div className="mt-10 flex flex-col gap-3 lg:mt-14 lg:gap-12">
          {PARTS.map((p, i) => (
            <PartRow key={p.n} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
