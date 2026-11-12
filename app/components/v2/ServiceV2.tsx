import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import ClientShowcase from "./ClientShowcase";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Mail, MapPin, MessageCircle, Phone, Search, Sparkles, Volume2, VolumeX } from "lucide-react";
import { NavBar } from "./HeroV2";
import { ADDONS, STARTS, TIERS, type Addon, type Tier } from "./PreiseV2";
import FaqV2, { type Faq } from "./FaqV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { REFS, SERVICE } from "./links";
import { CITIES, SERVICE_LABEL, SERVICE_SLUG, type ServiceKey } from "./cities";

// "Webdesign in Mannheim", "… in Frankfurt": every city page that exists for this service
const localPages = (kind: string) =>
  kind in SERVICE_SLUG ? CITIES.filter((c) => c.pages[kind as ServiceKey]).map((c) => ({ label: c.name, title: `${SERVICE_LABEL[kind as ServiceKey]} in ${c.name}`, href: `/leistungen/${SERVICE_SLUG[kind as ServiceKey]}/${c.slug}` })) : [];
import { useSoundVideo } from "./useSoundVideo";

/*
 * Service page template (v2): SEO, Google Ads and KI-Sichtbarkeit use the same structure so they read as one site.
 * Hero (statement + live graphic + one sourced result) → the problem in one sentence → four steps as a bento
 * → the matching package straight from PreiseV2's TIERS (prices can't drift) → real results → FAQ → contact → footer.
 * Copy in "du", no invented numbers: every result shown comes from a report (see HeroV2 PROOFS for sources).
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const CTA_HREF = "#contact";

export type StepArt = "search" | "structure" | "trust" | "measure" | "campaign" | "landing" | "ask" | "answer" | "data" | "aimeasure" | "plan" | "shoot" | "edit" | "publish" | "offer" | "design" | "contact" | "tracking";
export type ServiceKind = "seo" | "ads" | "ai" | "content" | "web";
export type ServiceConfig = {
  kind: ServiceKind; // picks the hero graphic, the logos on the step tiles and the phone in the package collage
  eyebrow: string;
  titleMuted: string; // first line, grey (like the homepage "Von null")
  title: string; // second line, ink, ends with the blue full stop
  intro: string;
  Visual: ComponentType;
  tint: string;
  proof: { value: string; text: string };
  problem: { strong: string; muted: string; text: string };
  video?: { base: string; title: string }; // /assets/v2/services/<base>-1080.mp4, -9x16.mp4, -poster.jpg, -poster-9x16.jpg
  photo?: { src: string; alt: string; chips?: string[] }; // the scene in the problem panel, with small "live" chips on it
  gaps?: { title: string; text: string; ghost: string; wrong?: boolean }[]; // "Was fehlt": what is missing (or wrong) today
  stepsTitle: string;
  steps: { title: string; body: string; art: StepArt }[];
  tier: string; // name in PreiseV2 TIERS or ADDONS
  packageNote: string;
  cases: { img: string; alt: string; client: string; stat: string; statRest: string }[];
  results?: { title: string; text: string }; // heading of the results section (default: Echte Ergebnisse)
  mentions?: { title: string; text: string; chip?: string; logos?: string[]; items: { img: string; client: string; place: string; href?: string }[] }; // a bento of client sites under the results; href = its case study
  cross: { label: string; title: string; text: string; href: string };
  faqs: Faq[];
};

/* ---------- small coded illustrations for the steps ---------- */
function Art({ kind }: { kind: StepArt }) {
  const box = "relative h-[88px] w-full overflow-hidden rounded-[14px] bg-white";
  switch (kind) {
    case "search":
      return (
        <div className={`${box} p-3`}>
          <div className="flex h-8 items-center gap-2 rounded-full px-3 text-[0.72rem] text-[#202124] shadow-[0_1px_6px_rgba(32,33,36,.2)]">
            <Search size={12} className="flex-none text-[#9aa0a6]" />
            <span className="truncate">Elektriker Notdienst Mannheim</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["Leistung", "Ort", "Dringend"].map((t) => (
              <span key={t} className="rounded-[6px] bg-[#eaf3ff] px-2 py-0.5 text-[0.62rem] font-bold text-[#007aff]">{t}</span>
            ))}
          </div>
        </div>
      );
    case "structure":
      return (
        <div className={`${box} flex items-center justify-center`}>
          <div className="flex flex-col items-center">
            <span className="h-5 w-16 rounded-[5px] bg-[#0e0e10]" />
            <span className="h-3 w-px bg-[#c9ccd2]" />
            <span className="h-px w-[120px] bg-[#c9ccd2]" />
            <div className="flex w-[136px] justify-between">
              {[0, 1, 2].map((k) => (
                <div key={k} className="flex flex-col items-center">
                  <span className="h-2.5 w-px bg-[#c9ccd2]" />
                  <span className={`h-5 w-10 rounded-[5px] ${k === 1 ? "bg-[#007aff]" : "bg-[#e3e6ec]"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "trust":
      return (
        <div className={`${box} p-3`}>
          <p className="text-[0.9rem] tracking-[2px] text-[#f5a623]">★★★★★</p>
          <div className="mt-2 space-y-1.5">
            <span className="block h-2 w-[85%] rounded-full bg-[#e3e6ec]" />
            <span className="block h-2 w-[60%] rounded-full bg-[#e3e6ec]" />
          </div>
          <span className="absolute bottom-3 right-3 rounded-full bg-[#007aff] px-2.5 py-1 text-[0.6rem] font-bold text-white">Anfrage senden</span>
        </div>
      );
    case "measure":
      return (
        <div className={`${box} flex items-end gap-2 px-4 pb-3 pt-4`}>
          {[0.35, 0.5, 0.45, 0.7, 0.62, 0.95].map((h, k) => (
            <span key={k} className={`flex-1 rounded-t-[4px] ${k === 5 ? "bg-[#007aff]" : "bg-[#d9e6fb]"}`} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
      );
    case "campaign":
      return (
        <div className={`${box} p-3`}>
          <p className="text-[0.62rem] font-bold text-[#202124]">Gesponsert</p>
          <p className="mt-0.5 truncate text-[0.8rem] font-medium text-[#1a0dab]">Elektriker Notdienst · 24/7</p>
          <div className="mt-2 flex gap-1.5">
            {[["Budget", "#eaf3ff", "#007aff"], ["Mannheim", "#f0f1f3", "#424245"], ["Keywords", "#f0f1f3", "#424245"]].map(([t, bg, fg]) => (
              <span key={t} className="rounded-[6px] px-2 py-0.5 text-[0.62rem] font-bold" style={{ background: bg, color: fg }}>{t}</span>
            ))}
          </div>
        </div>
      );
    case "landing":
      return (
        <div className={`${box} p-3`}>
          <span className="block h-2.5 w-[70%] rounded-full bg-[#0e0e10]" />
          <span className="mt-1.5 block h-2 w-[50%] rounded-full bg-[#e3e6ec]" />
          <div className="mt-3 flex gap-1.5">
            <span className="flex h-6 items-center gap-1 rounded-full bg-[#007aff] px-2.5 text-[0.6rem] font-bold text-white"><Phone size={10} strokeWidth={2.6} />Anrufen</span>
            <span className="flex h-6 items-center rounded-full border border-black/10 px-2.5 text-[0.6rem] font-bold text-[#0e0e10]">Anfrage</span>
          </div>
        </div>
      );
  }
}

/* ---------- bento illustrations for the steps: a white panel that runs off the bottom of the tile ---------- */
const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`absolute inset-x-5 bottom-[-24px] top-0 rounded-t-[18px] bg-white p-5 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)] md:inset-x-7 ${className}`}>{children}</div>
);
const Mag = () => <Search size={14} className="flex-none text-[#9aa0a6]" />;
function BentoArt({ kind }: { kind: StepArt }) {
  switch (kind) {
    case "search":
      return (
        <Panel>
          <div className="flex h-11 items-center gap-2.5 rounded-full px-4 text-[0.95rem] text-[#202124] shadow-[0_1px_6px_rgba(32,33,36,.22)]">
            <Mag /> <span className="truncate">Elektriker Mannheim</span><span className="h-5 w-[2px] animate-pulse bg-[#202124]" />
          </div>
          <ul className="mt-3 divide-y divide-black/[0.06] text-[0.88rem] text-[#202124]">
            {[["elektriker mannheim notdienst", "Dringend", "#eaf3ff", "#007aff"], ["elektriker mannheim kosten", "Preis", "#f0f1f3", "#424245"], ["elektriker in der nähe", "Ort", "#f0f1f3", "#424245"]].map(([q, tag, bg, fg]) => (
              <li key={q} className="flex items-center gap-2.5 py-2.5">
                <Mag /><span className="min-w-0 flex-1 truncate">{q}</span>
                <span className="flex-none rounded-[6px] px-2 py-0.5 text-[0.72rem] font-bold" style={{ background: bg, color: fg }}>{tag}</span>
              </li>
            ))}
          </ul>
        </Panel>
      );
    case "structure":
      return (
        <Panel className="flex flex-col items-center">
          <span className="rounded-[10px] bg-[#0e0e10] px-4 py-2 text-[0.85rem] font-bold text-white">Startseite</span>
          <span className="h-4 w-px bg-[#c9ccd2]" />
          <span className="h-px w-[72%] bg-[#c9ccd2]" />
          <div className="flex w-[86%] justify-between">
            {[["Leistung", true], ["Notdienst", false], ["Mannheim", false]].map(([t, on]) => (
              <div key={String(t)} className="flex flex-col items-center">
                <span className="h-4 w-px bg-[#c9ccd2]" />
                <span className={`rounded-[10px] px-3 py-2 text-[0.8rem] font-bold ${on ? "bg-[#007aff] text-white" : "bg-[#eef0f3] text-[#424245]"}`}>{t}</span>
                <span className="mt-2 block h-1.5 w-12 rounded-full bg-[#e3e6ec]" />
                <span className="mt-1.5 block h-1.5 w-8 rounded-full bg-[#e3e6ec]" />
              </div>
            ))}
          </div>
        </Panel>
      );
    case "trust":
      return (
        <Panel>
          {[["SK", "Schnell da, sauber gearbeitet."], ["TR", "Fester Preis, keine Überraschung."]].map(([n, q], k) => (
            <div key={n} className={`flex gap-3 rounded-[14px] bg-[#f7f8fa] p-3 ${k ? "mt-2" : ""}`}>
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#e3e6ec] text-[0.72rem] font-bold text-[#424245]">{n}</span>
              <span className="min-w-0">
                <span className="block text-[0.8rem] tracking-[1px] text-[#f5a623]">★★★★★</span>
                <span className="block truncate text-[0.85rem] font-medium text-[#424245]">„{q}“</span>
              </span>
            </div>
          ))}
          <span className="mt-3 flex h-10 items-center justify-center rounded-full bg-[#007aff] text-[0.85rem] font-bold text-white">Anfrage senden</span>
        </Panel>
      );
    case "measure":
      return (
        <Panel>
          <div className="flex items-baseline justify-between">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#007aff]">Monatsbericht</span>
            <span className="text-[0.75rem] font-semibold text-[#86868b]">Anrufe und Anfragen</span>
          </div>
          <div className="relative mt-4 flex h-[150px] items-end gap-2.5">
            {[0.28, 0.36, 0.33, 0.48, 0.55, 0.52, 0.7, 0.92].map((h, k) => (
              <span key={k} className={`flex-1 rounded-t-[6px] ${k === 7 ? "bg-[#007aff]" : "bg-[#d9e6fb]"}`} style={{ height: `${h * 100}%` }} />
            ))}
            <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points="6,74 18,66 30,69 42,54 54,47 66,50 78,32 94,10" fill="none" stroke="#0e0e10" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
            </svg>
          </div>
        </Panel>
      );
    case "campaign":
      return (
        <Panel>
          <p className="text-[0.75rem] font-bold text-[#202124]">Gesponsert · dein-betrieb.de</p>
          <p className="mt-0.5 truncate text-[1rem] font-medium text-[#1a0dab]">Elektriker Notdienst in Mannheim</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[0.8rem]">
            <div className="rounded-[12px] bg-[#f7f8fa] p-3">
              <p className="font-bold text-[#6b7280]">Suchbegriffe</p>
              <p className="mt-1.5 flex items-center gap-1.5 font-semibold text-[#0e0e10]"><Check size={13} strokeWidth={3} className="text-[#34c759]" />notdienst</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#0e0e10]"><Check size={13} strokeWidth={3} className="text-[#34c759]" />elektriker mannheim</p>
              <p className="mt-1 font-semibold text-[#9aa0a8] line-through decoration-[#ff9500]">gehalt</p>
            </div>
            <div className="rounded-[12px] bg-[#f7f8fa] p-3">
              <p className="font-bold text-[#6b7280]">Orte</p>
              <p className="mt-1.5 flex items-center gap-1.5 font-semibold text-[#0e0e10]"><MapPin size={13} strokeWidth={2.6} className="text-[#ea4335]" />Mannheim</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#0e0e10]"><MapPin size={13} strokeWidth={2.6} className="text-[#ea4335]" />Heidelberg</p>
            </div>
          </div>
        </Panel>
      );
    case "ask":
      return (
        <Panel className="space-y-2">
          {[["Welcher Elektriker in Mannheim ist gut?", "Empfehlung"], ["Was kostet ein E-Check?", "Preis"], ["Wer hat heute noch Zeit?", "Dringend"]].map(([q, tag], k) => (
            <div key={q} className={`flex items-center gap-2.5 ${k % 2 ? "justify-start" : "justify-end"}`}>
              <span className={`rounded-[16px] px-3.5 py-2 text-[0.85rem] font-medium text-[#0e0e10] ${k % 2 ? "bg-[#f3f1fb]" : "bg-[#f0f1f3]"}`}>{q}</span>
              <span className={`flex-none rounded-[6px] px-2 py-0.5 text-[0.7rem] font-bold ${k === 0 ? "bg-[#eaf3ff] text-[#007aff]" : "bg-[#f0f1f3] text-[#424245]"}`}>{tag}</span>
            </div>
          ))}
        </Panel>
      );
    case "answer":
      return (
        <Panel>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#86868b]">dein-betrieb.de/e-check</p>
          <p className="mt-2 text-[1.15rem] font-bold leading-tight tracking-[-0.03em] text-[#0e0e10]">Was kostet ein E-Check in Mannheim?</p>
          <p className="mt-2.5 rounded-[12px] bg-[#eaf3ff] px-3.5 py-3 text-[0.88rem] font-medium leading-snug text-[#0e0e10] shadow-[inset_3px_0_0_#007aff]">
            Die kurze Antwort steht ganz oben: klar, in zwei Sätzen, mit Ort und Leistung.
          </p>
          <span className="mt-3 block h-2 w-[80%] rounded-full bg-[#e3e6ec]" />
          <span className="mt-2 block h-2 w-[60%] rounded-full bg-[#e3e6ec]" />
        </Panel>
      );
    case "data":
      return (
        <Panel className="overflow-hidden font-mono text-[0.7rem] leading-[1.75] sm:text-[0.8rem] [&>p]:whitespace-nowrap">
          <p className="text-[#86868b]">{"<script type=\"application/ld+json\">"}</p>
          <p className="pl-4 text-[#0e0e10]"><span className="text-[#007aff]">"@type"</span>: "Electrician",</p>
          <p className="pl-4 text-[#0e0e10]"><span className="text-[#007aff]">"name"</span>: "Dein Betrieb",</p>
          <p className="pl-4 text-[#0e0e10]"><span className="text-[#007aff]">"areaServed"</span>: "Mannheim",</p>
          <p className="pl-4 text-[#0e0e10]"><span className="text-[#007aff]">"openingHours"</span>: "Mo-Fr 07:00-18:00"</p>
          <p className="text-[#86868b]">{"</script>"}</p>
        </Panel>
      );
    case "aimeasure":
      return (
        <Panel>
          <div className="flex items-baseline justify-between">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#007aff]">Monatsbericht</span>
            <span className="text-[0.75rem] font-semibold text-[#86868b]">KI-Einblendungen</span>
          </div>
          <div className="mt-4 flex h-[150px] items-end gap-2.5">
            {[0.06, 0.16, 0.3, 0.42, 0.58, 0.72, 0.84, 0.95].map((h, k) => (
              <span key={k} className={`flex-1 rounded-t-[6px] ${k === 7 ? "bg-[#7c5cff]" : "bg-[#e6e0ff]"}`} style={{ height: `${h * 100}%` }} />
            ))}
          </div>
        </Panel>
      );
    case "plan":
      return (
        <Panel>
          <div className="flex items-baseline justify-between">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#007aff]">Redaktionsplan</span>
            <span className="text-[0.75rem] font-semibold text-[#86868b]">Diese Woche</span>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {[["Mo", "Reel"], ["Di", "Post"], ["Mi", "Reel"], ["Do", "Story"], ["Fr", "Reel"]].map(([d, k]) => (
              <div key={d} className="rounded-[12px] bg-[#f7f8fa] p-2 text-center">
                <p className="text-[0.7rem] font-bold text-[#86868b]">{d}</p>
                <p className={`mt-2 rounded-[7px] py-1.5 text-[0.7rem] font-bold ${k === "Reel" ? "bg-[#007aff] text-white" : k === "Post" ? "bg-[#fdf1f4] text-[#c13584]" : "bg-[#f3f1fb] text-[#5b3fd6]"}`}>{k}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.82rem] font-medium text-[#424245]">Projekte, Team und Fragen deiner Kunden</p>
        </Panel>
      );
    case "shoot":
      return (
        <Panel className="!p-0 overflow-hidden">
          <img src="/assets/v2/services/pkg-lamp.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[75%_40%]" />
          <div className="absolute inset-4 md:inset-5">
            {["left-0 top-0 border-l-[3px] border-t-[3px]", "right-0 top-0 border-r-[3px] border-t-[3px]", "bottom-6 left-0 border-b-[3px] border-l-[3px]", "bottom-6 right-0 border-b-[3px] border-r-[3px]"].map((c) => (
              <span key={c} className={`absolute h-6 w-6 border-white ${c}`} />
            ))}
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[0.72rem] font-bold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff3b30]" /> REC 00:14
            </span>
            <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.72rem] font-bold text-white">4K · 9:16</span>
          </div>
        </Panel>
      );
    case "edit":
      return (
        <Panel>
          <div className="relative space-y-2">
            <div className="flex gap-1.5">
              {["pkg-lamp", "pkg-fusebox", "pkg-switch", "pkg-wallbox"].map((n, k) => (
                <img key={n} src={`/assets/v2/services/${n}.webp`} alt="" className={`h-12 rounded-[8px] object-cover ${["w-[30%]", "w-[22%]", "w-[26%]", "w-[18%]"][k]}`} />
              ))}
            </div>
            <div className="flex gap-1.5">
              {["Strom weg?", "Wir sind gleich da.", "Jetzt anrufen"].map((t, k) => (
                <span key={t} className={`truncate rounded-[7px] bg-[#fff6d6] px-2 py-1.5 text-[0.72rem] font-bold text-[#7a5b00] ${["w-[28%]", "w-[44%]", "w-[28%]"][k]}`}>{t}</span>
              ))}
            </div>
            <div className="flex h-9 items-center gap-[3px] rounded-[7px] bg-[#f3f1fb] px-2">
              {Array.from({ length: 48 }, (_, k) => (
                <span key={k} className="w-[3px] flex-none rounded-full bg-[#7c5cff]/60" style={{ height: `${20 + Math.abs(Math.sin(k * 1.7)) * 70}%` }} />
              ))}
            </div>
            <span className="absolute -bottom-1 -top-1 left-[46%] w-[2px] rounded bg-[#ff3b30]" />
          </div>
          <div className="mt-3 flex gap-2 text-[0.72rem] font-bold text-[#86868b]"><span>Video</span><span>·</span><span>Untertitel</span><span>·</span><span>Musik</span></div>
        </Panel>
      );
    case "publish":
      return (
        <Panel>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] p-[2px]"><span className="grid h-full w-full place-items-center rounded-full bg-white text-[0.7rem] font-black">DB</span></span>
            <span className="text-[0.88rem] font-bold text-[#0e0e10]">dein.betrieb</span>
            <span className="ml-auto rounded-[8px] bg-[#007aff] px-3 py-1 text-[0.72rem] font-bold text-white">Folgen</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1">
            {["pkg-lamp", "pkg-fusebox", "pkg-switch", "pkg-wallbox", "ai-scene", "pkg-fusebox"].map((n, k) => (
              <div key={k} className="relative aspect-square overflow-hidden rounded-[4px]">
                <img src={`/assets/v2/services/${n}.webp`} alt="" className="h-full w-full object-cover" />
                {k % 2 === 0 && <span className="absolute right-1 top-1 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />}
              </div>
            ))}
          </div>
        </Panel>
      );
    case "offer":
      return (
        <Panel className="space-y-2">
          {[["Was", "Elektroinstallation, Notdienst, E-Check"], ["Wo", "Mannheim, Heidelberg, Schwetzingen"], ["Für wen", "Privathaushalte und Gewerbe"], ["Nächster Schritt", "Anrufen oder Anfrage senden"]].map(([k, v], i) => (
            <div key={k} className="flex items-center gap-3 rounded-[12px] bg-[#f7f8fa] px-3.5 py-2.5">
              <span className={`w-[84px] flex-none text-[0.7rem] font-bold uppercase leading-tight tracking-[0.1em] sm:w-[118px] sm:text-[0.75rem] ${i === 3 ? "text-[#007aff]" : "text-[#86868b]"}`}>{k}</span>
              <span className="min-w-0 text-[0.85rem] font-semibold leading-snug text-[#0e0e10] sm:truncate sm:text-[0.88rem]">{v}</span>
            </div>
          ))}
        </Panel>
      );
    case "design":
      return (
        <Panel className="!p-0 overflow-hidden">
          <div className="grid h-full grid-cols-[1fr_0.9fr]">
            <div className="p-5">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Elektriker · Mannheim</p>
              <p className="mt-1.5 text-[1.35rem] font-bold leading-[1] tracking-[-0.05em] text-[#0e0e10]">Strom weg? Wir sind gleich da<span className="text-[#007aff]">.</span></p>
              <span className="mt-3 block h-1.5 w-[85%] rounded-full bg-[#e3e6ec]" />
              <span className="mt-1.5 block h-1.5 w-[60%] rounded-full bg-[#e3e6ec]" />
              <span className="mt-4 inline-flex rounded-full bg-[#007aff] px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.1em] text-white">Jetzt anrufen</span>
              <div className="mt-4 flex gap-1.5">
                {["#0e0e10", "#007aff", "#eef3fb", "#f5f5f7"].map((c) => <span key={c} className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: c }} />)}
                <span className="ml-1 text-[0.8rem] font-bold text-[#0e0e10]">Aa</span>
              </div>
            </div>
            <img src="/assets/v2/services/pkg-lamp.webp" alt="" className="h-full w-full object-cover object-[78%_50%]" />
          </div>
        </Panel>
      );
    case "contact":
      return (
        <Panel>
          <div className="grid grid-cols-3 gap-2">
            {[[<Phone key="p" size={16} strokeWidth={2.4} />, "Anrufen", "#34c759"], [<MessageCircle key="w" size={16} strokeWidth={2.4} />, "WhatsApp", "#25d366"], [<Mail key="m" size={16} strokeWidth={2.4} />, "Formular", "#007aff"]].map(([ic, t, c]) => (
              <span key={String(t)} className="flex flex-col items-center gap-1.5 rounded-[14px] bg-[#f7f8fa] py-3 text-[0.75rem] font-bold text-[#0e0e10]">
                <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: c as string }}>{ic}</span>
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 rounded-[14px] border border-black/[0.07] p-3.5">
            <p className="text-[0.72rem] font-bold text-[#86868b]">Schritt 2 von 3</p>
            <p className="mt-1 text-[0.95rem] font-bold text-[#0e0e10]">Worum geht es?</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Notdienst", "Installation", "E-Check"].map((t, k) => (
                <span key={t} className={`rounded-[8px] px-2.5 py-1 text-[0.75rem] font-semibold ${k === 0 ? "bg-[#007aff] text-white" : "bg-[#f0f1f3] text-[#424245]"}`}>{t}</span>
              ))}
            </div>
          </div>
        </Panel>
      );
    case "tracking":
      return (
        <Panel>
          <div className="flex items-baseline justify-between">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#007aff]">Gemessen</span>
            <span className="text-[0.75rem] font-semibold text-[#86868b]">Jede Anfrage zählt</span>
          </div>
          <ul className="mt-3 divide-y divide-black/[0.06]">
            {[["Formular gesendet", "#007aff"], ["Klick auf Telefonnummer", "#34c759"], ["WhatsApp geöffnet", "#25d366"], ["Route geplant", "#ea4335"]].map(([t, c]) => (
              <li key={t} className="flex items-center gap-3 py-2.5 text-[0.88rem] font-semibold text-[#0e0e10]">
                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: c }} />
                {t}
                <Check size={15} strokeWidth={3} className="ml-auto text-[#34c759]" aria-hidden />
              </li>
            ))}
          </ul>
        </Panel>
      );
    case "landing":
      return (
        <Panel>
          <p className="text-[0.72rem] font-bold tracking-[0.12em] text-[#007aff]">NOTDIENST · MANNHEIM</p>
          <p className="mt-1.5 text-[1.5rem] font-bold leading-[1.05] tracking-[-0.045em] text-[#0e0e10]">Strom weg? Wir kommen<span className="text-[#007aff]">.</span></p>
          <span className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-[#007aff] text-[0.9rem] font-bold text-white"><Phone size={15} strokeWidth={2.6} />Jetzt anrufen</span>
          <span className="mt-2 flex h-11 items-center justify-center rounded-full border-2 border-[#e3e6ec] text-[0.9rem] font-bold text-[#0e0e10]">WhatsApp</span>
        </Panel>
      );
  }
}

/* ---------- Google Ads hero graphic: a sponsored result on top, enquiries coming in ---------- */
const INCOMING = [
  { icon: <Phone size={14} strokeWidth={2.4} />, bg: "#34c759", t: "Anruf über deine Anzeige", s: "Notdienst, heute noch" },
  { icon: <MapPin size={14} strokeWidth={2.4} />, bg: "#ea4335", t: "Route zu deinem Betrieb", s: "über Google Maps" },
  { icon: <ArrowUpRight size={14} strokeWidth={2.4} />, bg: "#007aff", t: "Neue Anfrage", s: "Formular · Elektroinstallation" },
];
export function AdsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? INCOMING.length : 0);
  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setN((x) => (x >= INCOMING.length ? 0 : x + 1)), n >= INCOMING.length ? 2800 : 1100);
    return () => clearTimeout(t);
  }, [n, inView, reduce]);
  return (
    <div ref={ref} className="relative flex h-full w-full items-start justify-center overflow-hidden px-5 lg:items-center lg:p-10">
      <div className="w-full max-w-[460px]">
        <div className="rounded-[18px] bg-white p-4 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="flex h-10 items-center gap-2 rounded-full px-4 text-[0.9rem] text-[#202124] shadow-[0_1px_6px_rgba(32,33,36,.22)]">
            <Search size={15} className="flex-none text-[#9aa0a6]" />
            <span className="truncate">Elektriker Notdienst Mannheim</span>
          </div>
          <div className="mt-4 rounded-[12px] bg-[#eaf3ff] p-3 shadow-[inset_0_0_0_2px_#007aff]">
            <p className="text-[0.72rem] font-bold text-[#202124]">Gesponsert</p>
            <p className="text-[0.72rem] text-[#4d5156]">dein-betrieb.de</p>
            <p className="mt-0.5 text-[1rem] font-medium leading-snug text-[#1a0dab]">Dein Betrieb: Elektriker Notdienst in Mannheim</p>
            <p className="mt-1 text-[0.75rem] text-[#4d5156]">Rund um die Uhr erreichbar · Festpreis vorab</p>
          </div>
          <div className="mt-3 space-y-2 px-1">
            <span className="block h-2 w-[55%] rounded-full bg-[#e8eaed]" />
            <span className="block h-2 w-[80%] rounded-full bg-[#e8eaed]" />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <AnimatePresence initial={false}>
            {INCOMING.slice(0, n).map((x) => (
              <motion.div
                key={x.t}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex items-center gap-3 rounded-[14px] bg-white p-2.5 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.4)]"
              >
                <span className="grid h-8 w-8 flex-none place-items-center rounded-[9px] text-white" style={{ background: x.bg }}>{x.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.82rem] font-bold text-[#0e0e10]">{x.t}</span>
                  <span className="block truncate text-[0.72rem] text-[#6b7280]">{x.s}</span>
                </span>
                <span className="flex-none text-[0.66rem] text-[#86868b]">jetzt</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- hero search: real searches type in, "Dein Betrieb" lands on top (organic, or sponsored on the Ads page) ---------- */
const SEARCHES = [
  { q: "Elektriker Mannheim", t: "Elektriker in Mannheim", s: "Notdienst · Heute geöffnet" },
  { q: "Umzugsfirma Heidelberg", t: "Umzüge in Heidelberg", s: "Festpreis · Angebot in 24 Stunden" },
  { q: "Steuerberater Köln", t: "Steuerberatung in Köln", s: "Termine diese Woche frei" },
  { q: "Fliesenleger Frankfurt", t: "Fliesenleger in Frankfurt", s: "Bad und Küche · Beratung vor Ort" },
  { q: "Kanzlei Familienrecht München", t: "Familienrecht in München", s: "Erstberatung vereinbaren" },
];
const G = () => (
  <span className="font-medium tracking-[-0.02em]" style={{ fontFamily: "'Product Sans','Avenir Next',Arial,sans-serif" }}>
    <span className="text-[#4285f4]">G</span><span className="text-[#ea4335]">o</span><span className="text-[#fbbc05]">o</span><span className="text-[#4285f4]">g</span><span className="text-[#34a853]">l</span><span className="text-[#ea4335]">e</span>
  </span>
);
function HeroSearch({ ad }: { ad: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(reduce ? SEARCHES[0].q.length : 0);
  const s = SEARCHES[i];
  const done = typed >= s.q.length;
  useEffect(() => {
    if (reduce || !inView) return;
    const t = done
      ? setTimeout(() => { setI((x) => (x + 1) % SEARCHES.length); setTyped(0); }, 3200)
      : setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 450 : 55);
    return () => clearTimeout(t);
  }, [typed, done, inView, reduce]);

  return (
    <div ref={ref} className="relative mx-auto mt-10 w-full max-w-[680px] text-left md:mt-12">
      {/* floating context cards (wide screens only) */}
      <AnimatePresence>
        {done && (
          <>
            <motion.div key={`a${i}`} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.5 }}
              className="absolute -left-[210px] top-[110px] hidden items-center gap-3 rounded-[16px] bg-white p-3 pr-4 shadow-[0_20px_44px_-24px_rgba(15,23,42,0.45)] lg:flex">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#34c759] text-white"><Phone size={16} strokeWidth={2.4} /></span>
              <span><b className="block text-[0.85rem] text-[#0e0e10]">Neuer Anruf</b><span className="block text-[0.75rem] text-[#6b7280]">über Google</span></span>
            </motion.div>
            <motion.div key={`b${i}`} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.8 }}
              className="absolute -right-[200px] top-[160px] hidden items-center gap-3 rounded-[16px] bg-white p-3 pr-4 shadow-[0_20px_44px_-24px_rgba(15,23,42,0.45)] lg:flex">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#ea4335] text-white"><MapPin size={16} strokeWidth={2.4} /></span>
              <span><b className="block text-[0.85rem] text-[#0e0e10]">Route geplant</b><span className="block text-[0.75rem] text-[#6b7280]">zu deinem Betrieb</span></span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* the search bar */}
      <div className="flex h-16 items-center gap-3 rounded-full bg-white pl-5 pr-2 shadow-[0_2px_10px_rgba(32,33,36,0.14),0_24px_60px_-30px_rgba(15,23,42,0.4)] md:h-[72px] md:pl-6">
        <img src="/assets/v2/brands/google-g.svg" alt="" className="h-6 w-6 flex-none sm:hidden" />
        <span className="hidden text-[1.6rem] sm:inline"><G /></span>
        <span className="hidden h-7 w-px bg-black/10 sm:block" />
        <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[1.05rem] text-[#202124] md:text-[1.2rem]">
          {s.q.slice(0, typed)}
          {!done && <span className="ml-0.5 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-[#202124]" />}
        </span>
        <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#007aff] text-white md:h-14 md:w-14"><Search size={20} strokeWidth={2.6} /></span>
      </div>

      {/* the first result */}
      <div className="relative mt-3 min-h-[124px]">
        <AnimatePresence mode="wait">
          {done && (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="rounded-[22px] bg-white p-5 shadow-[inset_0_0_0_2px_#007aff,0_24px_60px_-34px_rgba(0,122,255,0.55)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#007aff] text-[0.7rem] font-black text-white">1</span>
                <span className="min-w-0 truncate text-[0.82rem] text-[#4d5156]">
                  {ad && <b className="mr-1.5 font-bold text-[#202124]">Gesponsert ·</b>}
                  dein-betrieb.de
                </span>
              </div>
              <p className="mt-1.5 truncate text-[1.15rem] font-medium leading-snug text-[#1a0dab] md:text-[1.3rem]">Dein Betrieb · {s.t}</p>
              <p className="mt-1 truncate text-[0.85rem] text-[#4d5156]">
                <span className="text-[#f9ab00]">★★★★★</span> 4,9 · {s.s}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- AI hero: real questions are asked, the assistant answers with "Dein Betrieb" and shows your site as the source ---------- */
const LOGO = "/assets/v2/logos";
const ASKS = [
  { who: "ChatGPT", logo: "openai", q: "Welchen Elektriker in Mannheim empfiehlst du?", a: ["Ich", "empfehle", "**Dein Betrieb.**", "Notdienst", "rund", "um", "die", "Uhr", "und", "klare", "Preise", "vorab."] },
  { who: "Claude", logo: "claude", q: "Wer macht gute Umzüge in Heidelberg?", a: ["Eine", "gute", "Wahl", "ist", "**Dein Betrieb.**", "Festpreis,", "Angebot", "innerhalb", "von", "24", "Stunden."] },
  { who: "Gemini", logo: "googlegemini", q: "Guter Steuerberater in Köln für Selbstständige?", a: ["Passend", "für", "Selbstständige:", "**Dein Betrieb.**", "Termine", "auch", "kurzfristig."] },
  { who: "ChatGPT", logo: "openai", q: "Fliesenleger in Frankfurt mit freien Terminen?", a: ["Frag", "bei", "**Dein Betrieb**", "an.", "Bad", "und", "Küche,", "Beratung", "vor", "Ort."] },
];
function HeroAsk() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(reduce ? ASKS[0].q.length : 0);
  const [words, setWords] = useState(reduce ? 99 : 0);
  const s = ASKS[i];
  const asked = typed >= s.q.length;
  const answered = words >= s.a.length;
  useEffect(() => {
    if (reduce || !inView) return;
    const t = !asked
      ? setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 450 : 45)
      : !answered
        ? setTimeout(() => setWords((n) => n + 1), words === 0 ? 700 : 110)
        : setTimeout(() => { setI((x) => (x + 1) % ASKS.length); setTyped(0); setWords(0); }, 3200);
    return () => clearTimeout(t);
  }, [typed, words, asked, answered, inView, reduce]);

  return (
    <div ref={ref} className="relative mx-auto mt-10 w-full max-w-[680px] text-left md:mt-12">
      {/* which assistant is answering */}
      <div className="mb-3 flex justify-center gap-1.5">
        {["ChatGPT", "Claude", "Gemini"].map((n) => {
          const on = s.who === n;
          const logo = ASKS.find((x) => x.who === n)!.logo;
          return (
            <span key={n} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold transition-colors duration-300 ${on ? "bg-white text-[#0e0e10] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)]" : "text-[#86868b]"}`}>
              <img src={`${LOGO}/${logo}.svg`} alt="" className={`h-4 w-4 ${on ? "" : "opacity-50 grayscale"}`} />
              {n}
            </span>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <>
            <motion.div key={`a${i}`} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
              className="absolute -left-[210px] top-[150px] hidden items-center gap-3 rounded-[16px] bg-white p-3 pr-4 shadow-[0_20px_44px_-24px_rgba(15,23,42,0.45)] lg:flex">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#007aff] text-white"><ArrowUpRight size={16} strokeWidth={2.4} /></span>
              <span><b className="block text-[0.85rem] text-[#0e0e10]">Neue Anfrage</b><span className="block text-[0.75rem] text-[#6b7280]">nach Empfehlung</span></span>
            </motion.div>
            <motion.div key={`b${i}`} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.6 }}
              className="absolute -right-[200px] top-[230px] hidden items-center gap-3 rounded-[16px] bg-white p-3 pr-4 shadow-[0_20px_44px_-24px_rgba(15,23,42,0.45)] lg:flex">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#34c759] text-white"><Phone size={16} strokeWidth={2.4} /></span>
              <span><b className="block text-[0.85rem] text-[#0e0e10]">Neuer Anruf</b><span className="block text-[0.75rem] text-[#6b7280]">heute, 14:12</span></span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* the question */}
      <div className="flex min-h-16 items-center gap-3 rounded-[32px] bg-white py-2 pl-5 pr-2 shadow-[0_2px_10px_rgba(32,33,36,0.1),0_24px_60px_-30px_rgba(15,23,42,0.4)] md:min-h-[72px] md:pl-6">
        <img src={`${LOGO}/${s.logo}.svg`} alt="" className="h-6 w-6 flex-none" />
        <span className="min-w-0 flex-1 text-[1rem] leading-snug text-[#0e0e10] md:text-[1.15rem]">
          {s.q.slice(0, typed)}
          {!asked && <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-[#0e0e10]" />}
          {typed === 0 && <span className="text-[#9aa0a6]">Frag irgendwas</span>}
        </span>
        <span className={`grid h-12 w-12 flex-none place-items-center rounded-full text-white transition-colors md:h-14 md:w-14 ${asked ? "bg-[#0e0e10]" : "bg-[#d1d1d6]"}`}>
          <ArrowUpRight size={20} strokeWidth={2.6} className="-rotate-45" />
        </span>
      </div>

      {/* the answer, with your website as the source */}
      <div className="relative mt-3 min-h-[150px]">
        <AnimatePresence mode="wait">
          {asked && (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="rounded-[24px] bg-white p-5 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.4)] md:p-6"
            >
              <div className="flex items-center gap-2 text-[0.85rem] font-semibold text-[#0e0e10]">
                <img src={`${LOGO}/${s.logo}.svg`} alt="" className="h-5 w-5" />
                {s.who}
              </div>
              <p className="mt-3 min-h-[3.2em] text-[1.05rem] leading-[1.55] text-[#0e0e10] md:text-[1.15rem]">
                {s.a.slice(0, words).map((w, k) =>
                  w.startsWith("**") ? (
                    <b key={k} className="rounded-[6px] bg-[#eaf3ff] px-1 font-semibold text-[#007aff]">{w.replace(/\*\*/g, "")}</b>
                  ) : (
                    <span key={k}> {w} </span>
                  ),
                )}
                {!answered && words > 0 && <span className="ml-1 inline-block h-3 w-3 animate-pulse rounded-full bg-[#0e0e10] align-middle" />}
              </p>
              <motion.div initial={false} animate={{ opacity: answered ? 1 : 0, y: answered ? 0 : 6 }} transition={{ duration: 0.35, ease: EASE }} className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3.5">
                <span className="text-[0.75rem] font-semibold text-[#86868b]">Quellen</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[0.75rem] font-semibold text-[#0e0e10]">
                  <span className="h-2 w-2 rounded-full bg-[#007aff]" /> dein-betrieb.de
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[0.75rem] font-semibold text-[#0e0e10]">
                  <img src="/assets/v2/brands/google-maps.svg" alt="" className="h-3 w-3" /> Google-Unternehmensprofil
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- content hero: real reels we filmed for clients, fanned out; the middle one plays ---------- */
const CS = "/assets/v2/cases";
const REEL_FAN = [
  { img: `${CS}/treu-reel-1.jpg`, who: "Treu Haustechnik" },
  { img: `${CS}/bergstone-reel-2.jpg`, who: "Bergstone Keramiksan" },
  { img: `${CS}/bergstone-reel-1.jpg`, video: `${CS}/bergstone-reel-1.mp4`, who: "Bergstone Keramiksan" },
  { img: `${CS}/treu-reel-2.jpg`, who: "Treu Haustechnik" },
  { img: `${CS}/bergstone-reel-3.jpg`, who: "Bergstone Keramiksan" },
];
function HeroReels() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-10 h-[400px] w-full max-w-[900px] md:mt-12 md:h-[470px]">
      {REEL_FAN.map((r, i) => {
        const d = i - 2; // -2 … 2
        const big = d === 0;
        return (
          <div
            key={i}
            className={`absolute top-1/2 ${Math.abs(d) === 2 ? "hidden sm:block" : ""}`}
            style={{ left: "50%", width: big ? 230 : 190, height: big ? 410 : 338, zIndex: 10 - Math.abs(d), transform: `translate(calc(-50% + ${d * 150}px), -50%) rotate(${d * 4}deg)` }}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + Math.abs(d) * 0.1, ease: EASE }}
              className="relative h-full w-full overflow-hidden rounded-[26px] bg-[#0e0e10] shadow-[0_40px_80px_-40px_rgba(15,23,42,0.55)]"
            >
              {r.video ? (
                <video src={r.video} poster={r.img} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <img src={r.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.55))]" />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-white">
                <span className="min-w-0 truncate text-[0.75rem] font-bold">{r.who}</span>
              </div>
              <span className="absolute left-3 top-3 text-[0.75rem] font-bold text-white">Reels</span>
            </motion.div>
          </div>
        );
      })}
      <motion.div initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
        className="absolute left-[-30px] top-[60%] z-20 hidden items-center gap-3 rounded-[16px] bg-white p-3 pr-4 shadow-[0_20px_44px_-24px_rgba(15,23,42,0.45)] lg:flex">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] text-white"><ArrowUpRight size={16} strokeWidth={2.4} /></span>
        <span><b className="block text-[0.85rem] text-[#0e0e10]">Neue Anfrage</b><span className="block text-[0.75rem] text-[#6b7280]">über Instagram</span></span>
      </motion.div>
      <motion.div initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 1.4, ease: EASE }}
        className="absolute right-[-30px] top-[22%] z-20 hidden items-center gap-3 rounded-[16px] bg-white p-3 pr-4 shadow-[0_20px_44px_-24px_rgba(15,23,42,0.45)] lg:flex">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#0e0e10] text-white">▶</span>
        <span><b className="block text-[0.85rem] text-[#0e0e10]">Dreh vor Ort</b><span className="block text-[0.75rem] text-[#6b7280]">Schnitt inklusive</span></span>
      </motion.div>
    </div>
  );
}

/* ---------- webdesign hero: the example site on laptop and phone, enquiries arrive ---------- */
/* ---------- explainer video: 16:9, or 9:16 on phones held upright; plays with sound while on screen ---------- */
export function ServiceVideo({ base, title, prefix, accent = "#007aff" }: { base: string; title: string; prefix?: string; accent?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [tall, setTall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const on = () => setTall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  // starts with sound when the browser allows it, else on the visitor's first tap (useSoundVideo)
  const { muted, toggle } = useSoundVideo(video, tall);
  const B = prefix ?? "/assets/v2/services/" + base; // files: <B>-1080.mp4, -9x16.mp4, -poster.jpg, -poster-9x16.jpg
  return (
    <section className="bg-white pb-16 text-[#0e0e10] md:pb-24">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <p className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>{title}</p>
        <div className={`relative mx-auto overflow-hidden rounded-[24px] bg-[#f5f5f7] ${tall ? "aspect-[9/16] w-full max-w-[460px]" : "aspect-video w-full"}`}>
          <video key={tall ? "t" : "w"} ref={video} className="h-full w-full object-cover" muted loop playsInline preload="metadata" poster={`${B}-poster${tall ? "-9x16" : ""}.jpg`}>
            <source src={`${B}-${tall ? "9x16" : "1080"}.mp4`} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={toggle}
            data-sound-toggle
            aria-label={muted ? "Ton einschalten" : "Ton ausschalten"}
            className={`absolute right-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#111111] shadow-[0_18px_48px_rgba(15,23,42,0.13)] backdrop-blur transition-opacity hover:opacity-80 ${tall ? "top-4" : "bottom-4 md:bottom-6 md:right-6"}`}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? "Ton an" : "Ton aus"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- the page ---------- */
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10]">
    {children}
    <span className="text-[#007aff]">.</span>
  </h2>
);

/* ---------- "Was du bekommst": what we actually deliver, laid out as real work samples, then the price as an open row ---------- */
const PKG = "/assets/v2/services/pkg-";
const BLOGS = [
  { img: `${PKG}fusebox.webp`, title: "Was kostet ein E-Check in Mannheim?", min: 4 },
  { img: `${PKG}wallbox.webp`, title: "Wallbox nachrüsten: Was du wissen musst", min: 6 },
  { img: `${PKG}switch.webp`, title: "Smart Home im Altbau: Geht das?", min: 5 },
];

// renders a fixed-size composition and scales it to the container width, so the collage keeps its exact layout
// the case study behind a client image (/assets/v2/bento/<name>.webp); every client tile links to it
const CASE_SLUGS = ["waschbar", "orchidee", "bergstone", "treu", "herkules", "dogru", "sg", "so", "ft", "onkel", "by"];
const CASE_ALIAS: Record<string, string> = { hasan: "dogru", "bergstone-web": "bergstone" };
function caseHref(img: string) {
  const name = img.split("/").pop()?.replace(/\.\w+$/, "") ?? "";
  const slug = CASE_ALIAS[name] ?? name;
  return CASE_SLUGS.includes(slug) ? `${REFS}/${slug}` : undefined;
}

function Scaled({ w, h, className = "", children }: { w: number; h: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / w || 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className={className} style={{ height: h * k }}>
      <div className="relative" style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: "0 0" }}>
        {children}
      </div>
    </div>
  );
}

const Tag = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`absolute z-30 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0e0e10] px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] text-white ${className}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-[#4da3ff]" />
    {children}
  </span>
);

function Browser({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute overflow-hidden rounded-[14px] bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.06)] ${className}`}>
      <div className="flex h-9 items-center gap-1.5 border-b border-black/[0.06] bg-[#fafafa] px-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e3e4e8]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e3e4e8]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e3e4e8]" />
        <span className="mx-auto rounded-[6px] bg-[#f0f1f3] px-10 py-1 text-[11px] font-medium text-[#6b7280]">dein-betrieb.de/elektriker-mannheim</span>
      </div>
      <div className="grid h-[calc(100%-36px)] grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col justify-center px-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#007aff]">Elektriker · Mannheim</p>
          <p className="mt-2 text-[30px] font-bold leading-[0.98] tracking-[-0.05em] text-[#0e0e10]">Strom weg? Wir sind gleich da.</p>
          <p className="mt-3 text-[12px] font-medium leading-snug text-[#6b7280]">Notdienst, E-Check und Smart Home in Mannheim und Umgebung.</p>
          <div className="mt-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#007aff] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white">
              <Phone size={11} strokeWidth={2.6} /> Jetzt anrufen
            </span>
            <span className="rounded-full bg-[#f0f1f3] px-3.5 py-2 text-[10px] font-bold text-[#0e0e10]">WhatsApp</span>
          </div>
          <div className="mt-6 flex gap-1.5">
            {["Notdienst", "E-Check", "Wallbox"].map((t) => (
              <span key={t} className="rounded-[6px] border border-black/[0.08] px-2 py-1 text-[10px] font-semibold text-[#424245]">{t}</span>
            ))}
          </div>
        </div>
        <img src={`${PKG}lamp.webp`} alt="" className="h-full w-full object-cover object-[78%_50%]" />
      </div>
    </div>
  );
}

function BlogStack({ className = "", small = false }: { className?: string; small?: boolean }) {
  const shown = small ? BLOGS.slice(0, 2) : BLOGS;
  return (
    <div className={`absolute ${className}`}>
      {shown
        .map((b, i) => (
          <div
            key={b.title}
            className="absolute left-0 top-0 w-full overflow-hidden rounded-[14px] bg-white shadow-[0_30px_60px_-34px_rgba(15,23,42,0.4),0_0_0_1px_rgba(15,23,42,0.05)]"
            style={{ transform: `translate(${i * 26}px, ${i * -22}px) scale(${1 - i * 0.05})`, transformOrigin: "0 0", zIndex: 10 - i }}
          >
            <img src={b.img} alt="" className={`w-full object-cover ${small ? "h-[96px]" : "h-[150px]"}`} />
            <div className={small ? "p-3" : "p-4"}>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#86868b]">Ratgeber · {b.min} Min.</p>
              <p className={`mt-1.5 font-bold leading-tight tracking-[-0.03em] text-[#0e0e10] ${small ? "text-[13px]" : "text-[16px]"}`}>{b.title}</p>
            </div>
          </div>
        ))
        .reverse()}
    </div>
  );
}

function PhoneShot({ ad, ai = false, className = "" }: { ad: boolean; ai?: boolean; className?: string }) {
  if (ai)
    return (
      <div className={`absolute rounded-[36px] bg-[#0e0e10] p-[7px] shadow-[0_40px_80px_-30px_rgba(15,23,42,0.5)] ${className}`}>
        <div className="relative h-full overflow-hidden rounded-[30px] bg-white px-3 pt-10">
          <span className="absolute left-1/2 top-2 h-[18px] w-[64px] -translate-x-1/2 rounded-full bg-[#0e0e10]" />
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0e0e10]">
            <img src={`${LOGO}/openai.svg`} alt="" className="h-3.5 w-3.5" /> ChatGPT
          </div>
          <p className="ml-auto mt-3 w-fit max-w-[88%] rounded-[14px] bg-[#f0f1f3] px-2.5 py-1.5 text-[10.5px] leading-snug text-[#0e0e10]">Welchen Elektriker in Mannheim empfiehlst du?</p>
          <p className="mt-3 text-[11px] leading-[1.5] text-[#0e0e10]">
            Ich empfehle <b className="rounded bg-[#eaf3ff] px-0.5 font-semibold text-[#007aff]">Dein Betrieb</b>. Notdienst rund um die Uhr und klare Preise vorab.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[9px] font-semibold text-[#0e0e10]">dein-betrieb.de</span>
            <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[9px] font-semibold text-[#0e0e10]">Google-Profil</span>
          </div>
          <div className="absolute inset-x-3 bottom-4 flex h-8 items-center rounded-full border border-[#e3e4e8] px-3 text-[10px] text-[#9aa0a6]">Frag irgendwas</div>
        </div>
      </div>
    );
  return (
    <div className={`absolute rounded-[36px] bg-[#0e0e10] p-[7px] shadow-[0_40px_80px_-30px_rgba(15,23,42,0.5)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[30px] bg-white px-3 pt-9">
        <span className="absolute left-1/2 top-2 h-[18px] w-[64px] -translate-x-1/2 rounded-full bg-[#0e0e10]" />
        <p className="text-center text-[22px] font-semibold tracking-[-0.03em]">
          <span className="text-[#4285f4]">G</span><span className="text-[#ea4335]">o</span><span className="text-[#fbbc05]">o</span><span className="text-[#4285f4]">g</span><span className="text-[#34a853]">l</span><span className="text-[#ea4335]">e</span>
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-[#dfe1e5] px-3 py-1.5 text-[10.5px] text-[#202124]">
          <Search size={11} className="text-[#9aa0a6]" /> Elektriker Mannheim
        </div>
        <div className="mt-3 rounded-[12px] bg-[#eaf3ff] p-2.5 shadow-[inset_0_0_0_1.5px_#007aff]">
          <p className="text-[9px] font-bold text-[#202124]">{ad ? "Gesponsert · " : ""}dein-betrieb.de</p>
          <p className="mt-0.5 text-[12px] font-medium leading-tight text-[#1a0dab]">{ad ? "Elektriker Notdienst in Mannheim" : "Dein Betrieb · Elektriker in Mannheim"}</p>
          <p className="mt-1 text-[9.5px] leading-snug text-[#4d5156]">Notdienst · Heute geöffnet</p>
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="mt-3 px-1">
            <span className="block h-[6px] w-1/3 rounded bg-[#eceef1]" />
            <span className="mt-1.5 block h-[7px] w-5/6 rounded bg-[#e4e6ea]" />
            <span className="mt-1.5 block h-[6px] w-2/3 rounded bg-[#eceef1]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportSheet({ ad, ai = false, className = "" }: { ad: boolean; ai?: boolean; className?: string }) {
  return (
    <div className={`absolute rounded-[14px] bg-white p-5 shadow-[0_30px_60px_-34px_rgba(15,23,42,0.4),0_0_0_1px_rgba(15,23,42,0.05)] ${className}`}>
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#007aff]">{ad ? "Werbekonto" : "Monatsbericht"}</p>
        <p className="text-[10px] font-semibold text-[#86868b]">nüll<span className="text-[#007aff]">.</span></p>
      </div>
      {ad ? (
        <div className="mt-3 divide-y divide-black/[0.06]">
          {[
            { k: "elektriker notdienst", v: "läuft", c: "text-[#0e0e10]" },
            { k: "elektriker kosten", v: "Gebot angepasst", c: "text-[#007aff]" },
            { k: "elektriker gehalt", v: "ausgeschlossen", c: "text-[#c96a00]" },
          ].map((r, i) => (
            <div key={r.k} className="flex items-center justify-between gap-3 py-2 text-[11px]">
              <span className={`font-medium text-[#424245] ${i === 2 ? "line-through decoration-[#c96a00]/60" : ""}`}>{r.k}</span>
              <span className={`font-bold ${r.c}`}>{r.v}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 flex h-[78px] items-end gap-2">
            {[34, 42, 40, 55, 63, 78].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t-[4px] ${i === 5 ? "bg-[#007aff]" : "bg-[#d6e8ff]"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {["Anrufe", "Formulare", ai ? "KI-Einblendungen" : "Klicks aus Google"].map((t, i) => (
              <div key={t} className="flex items-center gap-2 text-[10.5px] font-semibold text-[#424245]">
                <span className="w-[92px]">{t}</span>
                <span className="h-[5px] flex-1 rounded bg-[#f0f1f3]">
                  <span className="block h-full rounded bg-[#007aff]/70" style={{ width: `${[62, 44, 80][i]}%` }} />
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CallToast({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute flex items-center gap-2.5 rounded-[16px] bg-white/95 p-2.5 pr-4 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.5),0_0_0_1px_rgba(15,23,42,0.05)] ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#34c759] text-white">
        <Phone size={14} strokeWidth={2.6} />
      </span>
      <span>
        <span className="block text-[11.5px] font-bold text-[#0e0e10]">Neuer Anruf</span>
        <span className="block text-[10px] font-medium text-[#6b7280]">über deine Anzeige</span>
      </span>
    </div>
  );
}

/* ---------- content collage: reels, posts, the shoot and the ad, all for the example "Dein Betrieb" ---------- */
const SV = "/assets/v2/services";
function Reel({ img, cap, className = "", style }: { img: string; cap: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute overflow-hidden rounded-[24px] bg-[#0e0e10] shadow-[0_40px_80px_-40px_rgba(15,23,42,0.55)] ${className}`} style={style}>
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
      <span className="absolute left-3 top-3 text-[11px] font-bold text-white">Reels</span>
      <p className="absolute inset-x-3 top-[42%] text-center text-[17px] font-black leading-tight tracking-[-0.03em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">{cap}</p>
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[8px] font-black text-[#0e0e10]">DB</span>
        <span className="text-[11px] font-bold">dein.betrieb</span>
      </div>
    </div>
  );
}
function PostGrid({ className = "", small = false }: { className?: string; small?: boolean }) {
  const t = small ? "text-[11px]" : "text-[15px]";
  return (
    <div className={`absolute grid grid-cols-2 gap-2 ${className}`}>
      <img src={`${SV}/pkg-wallbox.webp`} alt="" className="aspect-[4/5] w-full rounded-[10px] object-cover shadow-[0_20px_40px_-26px_rgba(15,23,42,0.45)]" />
      <div className={`flex aspect-[4/5] flex-col justify-between rounded-[10px] bg-[#007aff] p-3 text-white shadow-[0_20px_40px_-26px_rgba(15,23,42,0.45)]`}>
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">Tipp</span>
        <span className={`${t} font-black leading-tight tracking-[-0.03em]`}>Was kostet ein E-Check?</span>
      </div>
      <div className={`flex aspect-[4/5] flex-col justify-between rounded-[10px] bg-white p-3 shadow-[0_20px_40px_-26px_rgba(15,23,42,0.45)]`}>
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#86868b]">Vorher · Nachher</span>
        <span className={`${t} font-black leading-tight tracking-[-0.03em] text-[#0e0e10]`}>Neuer Sicherungs&shy;kasten in Mannheim</span>
      </div>
      <img src={`${SV}/pkg-switch.webp`} alt="" className="aspect-[4/5] w-full rounded-[10px] object-cover object-[60%_50%] shadow-[0_20px_40px_-26px_rgba(15,23,42,0.45)]" />
    </div>
  );
}
function ShootCard({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute flex items-center gap-3 rounded-[16px] bg-white p-3 pr-5 shadow-[0_30px_60px_-34px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.05)] ${className}`}>
      <span className="grid h-11 w-11 flex-none place-items-center rounded-[12px] bg-[#0e0e10] text-[11px] font-black text-white">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff3b30]" />
      </span>
      <span>
        <b className="block text-[14px] text-[#0e0e10]">Drehtag bei dir</b>
        <span className="block text-[12px] text-[#6b7280]">Baustelle, Team, Werkstatt</span>
      </span>
    </div>
  );
}
function AdCard({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute overflow-hidden rounded-[16px] bg-white shadow-[0_30px_60px_-34px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.05)] ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] p-[2px]"><span className="grid h-full w-full place-items-center rounded-full bg-white text-[8px] font-black">DB</span></span>
        <span className="leading-tight"><b className="block text-[12px] text-[#0e0e10]">dein.betrieb</b><span className="block text-[10px] text-[#6b7280]">Gesponsert</span></span>
      </div>
      <img src={`${SV}/pkg-lamp.webp`} alt="" className="aspect-square w-full object-cover object-[75%_50%]" />
      <div className="flex items-center justify-between bg-[#f5f5f7] px-3 py-2.5 text-[12px] font-bold text-[#0e0e10]">Jetzt anrufen <ArrowRight size={14} strokeWidth={2.6} /></div>
    </div>
  );
}
function ContentCollage({ pop, tint, rise }: { pop: (d: number) => object; tint: string; rise: (d?: number) => object }) {
  return (
    <>
      <Scaled w={1240} h={600} className="mt-12 hidden lg:block">
        <div aria-hidden className="absolute left-[40%] top-[50%] h-[520px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(closest-side, ${tint}, rgba(245,245,247,0))` }} />
        <motion.div {...pop(0.05)}>
          <Reel img={`${SV}/pkg-fusebox.webp`} cap="Neuer Sicherungskasten" className="left-[20px] top-[110px] h-[360px] w-[200px]" style={{ transform: "rotate(-5deg)" }} />
          <Reel img={`${SV}/pkg-lamp.webp`} cap="Strom weg? Wir sind gleich da." className="left-[190px] top-[60px] z-10 h-[420px] w-[236px]" />
          <Reel img={`${SV}/pkg-switch.webp`} cap="Smart Home im Altbau" className="left-[400px] top-[120px] h-[360px] w-[200px]" style={{ transform: "rotate(5deg)" }} />
          <Tag className="left-[40px] top-[20px]">Bis zu 20 Videos im Monat</Tag>
        </motion.div>
        <motion.div {...pop(0.2)}>
          <PostGrid className="left-[660px] top-[70px] w-[330px]" />
          <Tag className="left-[660px] top-[20px]">12 statische Posts und Stories</Tag>
        </motion.div>
        <motion.div {...pop(0.32)}>
          <AdCard className="left-[1020px] top-[150px] w-[210px]" />
          <Tag className="left-[1040px] top-[100px]">Enthält Meta Ads</Tag>
        </motion.div>
        <motion.div {...pop(0.44)}>
          <ShootCard className="left-[300px] top-[500px] z-20" />
          <Tag className="left-[560px] top-[520px]">Dreh vor Ort, Schnitt inklusive</Tag>
        </motion.div>
      </Scaled>

      <Rail
        tint={tint}
        rise={rise}
        items={[
          {
            title: "Bis zu 20 Videos im Monat",
            w: 520,
            h: 450,
            pad: 0.94,
            node: (
              <>
                <Reel img={`${SV}/pkg-fusebox.webp`} cap="Neuer Sicherungskasten" className="left-[10px] top-[55px] h-[340px] w-[190px]" style={{ transform: "rotate(-5deg)" }} />
                <Reel img={`${SV}/pkg-switch.webp`} cap="Smart Home im Altbau" className="left-[320px] top-[55px] h-[340px] w-[190px]" style={{ transform: "rotate(5deg)" }} />
                <Reel img={`${SV}/pkg-lamp.webp`} cap="Strom weg? Wir sind gleich da." className="left-[142px] top-[10px] z-10 h-[430px] w-[236px]" />
              </>
            ),
          },
          { title: "12 statische Posts und Stories", w: 330, h: 420, node: <PostGrid className="left-0 top-0 w-[330px]" /> },
          { title: "Enthält Meta Ads", w: 260, h: 310, node: <AdCard className="left-[25px] top-0 w-[210px]" /> },
          {
            title: "Dreh vor Ort, Schnitt inklusive",
            w: 300,
            h: 300,
            node: (
              <>
                <img src={`${SV}/pkg-lamp.webp`} alt="" className="absolute left-0 top-0 h-[250px] w-[300px] rounded-[20px] object-cover object-[75%_45%] shadow-[0_30px_60px_-34px_rgba(15,23,42,0.45)]" />
                <ShootCard className="left-[24px] top-[218px] z-10" />
              </>
            ),
          },
        ]}
      />
    </>
  );
}

/* ---------- webdesign package: what you get as work samples, then the three ways to start, then the monthly package ---------- */
// a photoreal device (AI body, real rendered screen, transparent webp) placed on the Scaled stage; drifts gently
function Cutout({ src, alt, className = "", float = 0 }: { src: string; alt: string; className?: string; float?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.img
      src={`/assets/v2/services/${src}.webp`}
      alt={alt}
      draggable={false}
      animate={reduce ? {} : { y: [0, -7, 0] }}
      transition={{ duration: 6 + float, repeat: Infinity, ease: "easeInOut", delay: float * 0.8 }}
      className={`absolute select-none drop-shadow-[0_30px_40px_rgba(15,23,42,0.22)] ${className}`}
    />
  );
}

/* ---------- phones: the deliverables as a swipe row of cards, one sample per card, big enough to read ---------- */
// scales a fixed-size stage (w x h, children positioned absolutely) to fit the box it sits in
function Fit({ w, h, pad = 0.86, children }: { w: number; h: number; pad?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(Math.min((el.clientWidth * pad) / w, (el.clientHeight * pad) / h)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, pad]);
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      <div style={{ width: w * k, height: h * k, opacity: k ? 1 : 0 }}>
        <div className="relative" style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: "0 0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

type RailItem = { title: string; w: number; h: number; pad?: number; node: ReactNode };
function Rail({ items, tint, rise }: { items: RailItem[]; tint: string; rise: (d?: number) => object }) {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const onScroll = () => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    setAt(Math.min(items.length - 1, Math.round(el.scrollLeft / (card.offsetWidth + 12))));
  };
  const go = (n: number) => {
    const el = ref.current;
    const card = el?.children[n] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: "smooth" });
  };
  return (
    <motion.div {...rise(0.04)} className="mt-9 lg:hidden">
      <div
        ref={ref}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
        aria-label="Was du bekommst"
      >
        {items.map((it, k) => (
          <figure key={it.title} className="w-[84%] max-w-[380px] flex-none snap-start overflow-hidden rounded-[26px] bg-white">
            <div className="relative h-[340px] overflow-hidden" style={{ background: `radial-gradient(70% 62% at 50% 50%, ${tint} 0%, #ffffff 100%)` }}>
              <Fit w={it.w} h={it.h} pad={it.pad}>{it.node}</Fit>
            </div>
            <figcaption className="flex items-start gap-3 px-5 pb-5 pt-4">
              <span className="mt-[3px] text-[0.78rem] font-bold tabular-nums text-[#007aff]">{String(k + 1).padStart(2, "0")}</span>
              <span className="text-[1.08rem] font-bold leading-snug tracking-[-0.03em] text-[#0e0e10]">{it.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {/* where you are in the row; tap to jump */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {items.map((it, k) => (
          <button
            key={it.title}
            type="button"
            onClick={() => go(k)}
            aria-label={`${k + 1}: ${it.title}`}
            className="grid h-6 place-items-center"
          >
            <span className={`block h-1.5 rounded-full transition-all duration-300 ${k === at ? "w-6 bg-[#0e0e10]" : "w-1.5 bg-[#c9ccd2]"}`} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// a cut-out device filling its stage
const Shot = ({ src, alt }: { src: string; alt: string }) => (
  <img src={`/assets/v2/services/${src}.webp`} alt={alt} draggable={false} className="absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_24px_30px_rgba(15,23,42,0.22)]" />
);

// phones: the three ways to start as a switch, one package at a time (the popular one first)
export function StartSwitch() {
  const [sel, setSel] = useState(Math.max(0, STARTS.findIndex((t) => t.popular)));
  const t = STARTS[sel];
  return (
    <div className="md:hidden">
      <div role="tablist" aria-label="Website-Pakete" className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-white p-1 shadow-[0_0_0_1px_rgba(14,14,16,0.06)]">
        {STARTS.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={i === sel}
            onClick={() => setSel(i)}
            className={`min-h-11 truncate rounded-full px-2 text-[0.86rem] font-bold tracking-[-0.02em] transition-colors duration-300 ${i === sel ? "bg-[#0e0e10] text-white" : "text-[#424245]"}`}
          >
            {s.short ?? s.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={t.name}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-3 rounded-[24px] bg-white p-6"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-[1.5rem] font-bold leading-tight tracking-[-0.045em] text-[#0e0e10]">{t.name}</p>
            {t.popular && <span className="rounded-full bg-[#007aff] px-3 py-1 text-[0.72rem] font-bold text-white">Beliebteste Wahl</span>}
          </div>
          <p className="mt-1 text-[0.95rem] font-medium text-[#6b7280]">{t.note}</p>
          <p className="mt-5 flex items-baseline gap-1.5 font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums">
            <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">ab</span>
            <span className="text-[3rem]">{t.price}</span>
            <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">€ einmalig</span>
          </p>
          <ul className="mt-5 space-y-2.5">
            {t.items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-[0.98rem] font-medium leading-snug tracking-[-0.015em] text-[#0e0e10]">
                <Check size={18} strokeWidth={2.4} className="mt-[2px] flex-none text-[#007aff]" aria-hidden />
                {it}
              </li>
            ))}
          </ul>
          <a href={CTA_HREF} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#007aff] px-6 text-[0.8rem] font-black uppercase tracking-[0.12em] text-white">
            Anfrage starten <ArrowRight size={16} strokeWidth={2.6} />
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// also used by the city pages (CityPageV2), with their own intro line
export function WebPackage({ cfg, rise }: { cfg: Pick<ServiceConfig, "packageNote" | "tint">; rise: (d?: number) => object }) {
  const reduce = useReducedMotion();
  const monthly = TIERS[0];
  const pop = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.8, delay: d, ease: EASE } };
  return (
    <section className="overflow-hidden bg-[#f5f5f7] pb-20 pt-20 text-[#0e0e10] md:pb-28 md:pt-28">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <motion.div {...rise()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <H2>Was du bekommst</H2>
            <p className="mt-5 max-w-[48ch] text-[1.05rem] font-medium leading-[1.5] tracking-[-0.02em] text-[#424245] md:text-[1.12rem]">{cfg.packageNote}</p>
          </div>
          <a href="/preise" className="inline-flex flex-none items-center gap-1.5 text-[1rem] font-bold tracking-[-0.02em] text-[#007aff] transition-opacity hover:opacity-55">
            Alle Preise ansehen <ArrowUpRight size={17} strokeWidth={2.4} />
          </a>
        </motion.div>

        {/* what we deliver: photoreal cut-out objects floating like the old mock-ups
            (AI-generated on white, cut out: .resolve-work/null-services-assets/web_deliverables.py + cutout.py) */}
        <Scaled w={1240} h={730} className="mt-12 hidden lg:block">
          <div aria-hidden className="absolute left-[50%] top-[48%] h-[560px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(closest-side, ${cfg.tint}, rgba(245,245,247,0))` }} />
          <motion.div {...pop(0.05)}>
            <Tag className="left-[300px] top-[120px]">Texte, Design und Technik</Tag>
            <Cutout src="dev-laptop" alt="MacBook mit der Website eines Elektrikers" className="left-[250px] top-[170px] w-[740px]" float={0} />
          </motion.div>
          <motion.div {...pop(0.2)}>
            <Cutout src="dev-phone-site" alt="iPhone mit der mobilen Website und Anruf-Button" className="left-[948px] top-[104px] z-10 h-[500px]" float={1} />
            <Tag className="left-[968px] top-[632px]">Für jedes Handy gebaut</Tag>
          </motion.div>
          <motion.div {...pop(0.32)}>
            <Tag className="left-[0px] top-[22px]">Anfrage per Formular, Anruf, WhatsApp</Tag>
            <Cutout src="dev-phone-form" alt="iPhone mit einem Anfrageformular" className="left-[40px] top-[72px] h-[300px]" float={2} />
          </motion.div>
          <motion.div {...pop(0.44)}>
            <Tag className="left-[0px] top-[396px]">Google-Profil optimiert</Tag>
            <Cutout src="dev-phone-maps" alt="iPhone mit dem Google-Unternehmensprofil" className="left-[40px] top-[444px] h-[280px]" float={3} />
          </motion.div>
        </Scaled>

        <Rail
          tint={cfg.tint}
          rise={rise}
          items={[
            { title: "Texte, Design und Technik", w: 1400, h: 796, pad: 0.94, node: <Shot src="dev-laptop" alt="MacBook mit der Website eines Elektrikers" /> },
            { title: "Für jedes Handy gebaut", w: 708, h: 1400, node: <Shot src="dev-phone-site" alt="iPhone mit der mobilen Website und Anruf-Button" /> },
            { title: "Anfrage per Formular, Anruf, WhatsApp", w: 708, h: 1400, node: <Shot src="dev-phone-form" alt="iPhone mit einem Anfrageformular" /> },
            { title: "Google-Profil optimiert", w: 708, h: 1400, node: <Shot src="dev-phone-maps" alt="iPhone mit dem Google-Unternehmensprofil" /> },
          ]}
        />

        {/* step 1: three ways to start, open columns */}
        <motion.div {...rise(0.06)} className="mt-14 border-t border-black/10 pt-10 md:mt-16 md:pt-12">
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Einmal starten</p>
          <StartSwitch />
          <div className="mt-6 hidden gap-10 md:grid md:grid-cols-3 md:gap-0 md:divide-x md:divide-black/10">
            {STARTS.map((t, i) => (
              <div key={t.name} className={`flex flex-col ${i === 0 ? "md:pr-10" : i === 2 ? "md:pl-10" : "md:px-10"}`}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="text-[1.6rem] font-bold leading-tight tracking-[-0.045em] text-[#0e0e10]">{t.name}</p>
                  {t.popular && <span className="rounded-full bg-[#007aff] px-3 py-1 text-[0.72rem] font-bold text-white">Beliebteste Wahl</span>}
                </div>
                <p className="mt-1 text-[0.95rem] font-medium text-[#6b7280]">{t.note}</p>
                <p className="mt-5 flex items-baseline gap-1.5 font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums">
                  <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">ab</span>
                  <span className="text-[3.2rem]">{t.price}</span>
                  <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">€ einmalig</span>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {t.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-[0.98rem] font-medium leading-snug tracking-[-0.015em] text-[#0e0e10]">
                      <Check size={18} strokeWidth={2.4} className="mt-[2px] flex-none text-[#007aff]" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <a href={CTA_HREF} className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[0.8rem] font-black uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 ${t.popular ? "bg-[#007aff] text-white" : "bg-white text-[#0e0e10] shadow-[0_0_0_1.5px_rgba(14,14,16,0.12)]"}`}>
                    Anfrage starten <ArrowRight size={16} strokeWidth={2.6} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* step 2: the monthly package keeps it running */}
        <motion.div {...rise(0.08)} className="mt-12 flex flex-col gap-4 rounded-[22px] bg-white p-6 md:mt-14 md:flex-row md:items-center md:gap-10 md:p-8">
          <div className="flex-none">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Dann monatlich</p>
            <p className="mt-1.5 flex items-baseline gap-1.5 font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums">
              <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">ab</span>
              <span className="text-[2.6rem]">{monthly.price}</span>
              <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">€ / Monat</span>
            </p>
          </div>
          <p className="flex-1 text-[0.98rem] font-medium leading-[1.55] text-[#424245]">
            {monthly.name}: {monthly.items.join(", ")}. Mit SEO, Google Ads oder Content wächst die Website weiter.
          </p>
          <a href="/preise#monatlich" className="inline-flex flex-none items-center gap-1.5 text-[1rem] font-bold tracking-[-0.02em] text-[#007aff] transition-opacity hover:opacity-55">
            Monatspakete <ArrowUpRight size={17} strokeWidth={2.4} />
          </a>
        </motion.div>
        <p className="mt-4 text-center text-[0.8rem] font-medium text-[#86868b]">Alle Preise netto zzgl. 19 % MwSt. Monatspakete mit 6 Monaten Mindestlaufzeit.</p>
      </div>
    </section>
  );
}

// also used by the city pages (CityPageV2) for SEO, Google Ads, KI-Sichtbarkeit and Content
export function PackageSection({ cfg, rise }: { cfg: Pick<ServiceConfig, "tier" | "kind" | "packageNote" | "tint">; rise: (d?: number) => object }) {
  // monthly packages (TIERS) or the social add-ons (ADDONS), straight from the price list
  const inTiers = TIERS.find((t) => t.name === cfg.tier);
  const inAddons = ADDONS.find((a) => a.name === cfg.tier);
  const tier: (Partial<Tier> & Partial<Addon> & { name: string; price: string; note: string; items: string[] }) | undefined = inTiers ?? inAddons;
  const reduce = useReducedMotion();
  if (!tier) return null;
  const ad = cfg.kind === "ads";
  const ai = cfg.kind === "ai";
  const content = cfg.kind === "content";
  // everything from the smaller packages is included
  const always = inTiers ? TIERS.slice(0, TIERS.indexOf(inTiers)).flatMap((t) => t.items) : inAddons ? ADDONS.slice(0, ADDONS.indexOf(inAddons)).flatMap((a) => a.items) : [];
  const fine = tier.fine ?? (inAddons ? "Werbebudget ab 450 € im Monat, direkt an Meta." : "");
  const perVideo = tier.perVideo ? (Number(tier.price.replace(/\./g, "")) * 0.8 / 20).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
  const pre = Number(tier.price.replace(/\./g, "")) * 0.8;
  const prepay = pre.toLocaleString("de-DE", { minimumFractionDigits: pre % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const pop = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.8, delay: d, ease: EASE } };
  const tags = ad
    ? { site: "Neue Seiten und Landingpages", blog: "Bis zu 8 Blogartikel im Monat", phone: "Deine Google-Ads-Kampagnen", sheet: "Laufendes Management" }
    : ai
      ? { site: "Neue Seiten und Landingpages", blog: "Bis zu 8 Blogartikel im Monat", phone: "Inhalte für ChatGPT, Claude und Gemini", sheet: "Monatsbericht mit echten Zahlen" }
      : { site: "Neue Seiten und Landingpages", blog: "Bis zu 8 Blogartikel im Monat", phone: "Laufende SEO-Optimierung", sheet: "Monatsbericht mit echten Zahlen" };

  return (
    <section className="overflow-hidden bg-[#f5f5f7] pb-20 pt-20 text-[#0e0e10] md:pb-28 md:pt-28">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <motion.div {...rise()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <H2>Was du bekommst</H2>
            <p className="mt-5 max-w-[48ch] text-[1.05rem] font-medium leading-[1.5] tracking-[-0.02em] text-[#424245] md:text-[1.12rem]">{cfg.packageNote}</p>
          </div>
          <a href="/preise" className="inline-flex flex-none items-center gap-1.5 text-[1rem] font-bold tracking-[-0.02em] text-[#007aff] transition-opacity hover:opacity-55">
            Alle Preise ansehen <ArrowUpRight size={17} strokeWidth={2.4} />
          </a>
        </motion.div>

        {content && <ContentCollage pop={pop} tint={cfg.tint} rise={rise} />}

        {/* the work itself, no boxes: a landing page, articles, the Google result and the report, as we hand them over */}
        {!content && <>
        <Scaled w={1240} h={630} className="mt-12 hidden lg:block">
          <div aria-hidden className="absolute left-[38%] top-[48%] h-[520px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(closest-side, ${cfg.tint}, rgba(245,245,247,0))` }} />
          <motion.div {...pop(0.05)}>
            <Browser className="left-0 top-[46px] h-[440px] w-[700px]" />
            <Tag className="left-[24px] top-[16px]">{tags.site}</Tag>
          </motion.div>
          <motion.div {...pop(0.2)}>
            <BlogStack className="left-[860px] top-[92px] h-[260px] w-[300px]" />
            <Tag className="left-[860px] top-[16px]">{tags.blog}</Tag>
          </motion.div>
          <motion.div {...pop(0.32)}>
            <PhoneShot ad={ad} ai={ai} className="left-[600px] top-[200px] h-[400px] w-[200px]" />
            <Tag className="left-[470px] top-[540px]">{tags.phone}</Tag>
            {ad && <CallToast className="left-[452px] top-[420px] z-20" />}
          </motion.div>
          <motion.div {...pop(0.44)}>
            <ReportSheet ad={ad} ai={ai} className="left-[880px] top-[352px] w-[330px]" />
            <Tag className="left-[880px] top-[588px]">{tags.sheet}</Tag>
          </motion.div>
        </Scaled>

        <Rail
          tint={cfg.tint}
          rise={rise}
          items={[
            { title: tags.site, w: 700, h: 440, pad: 0.92, node: <Browser className="left-0 top-0 h-[440px] w-[700px]" /> },
            {
              title: tags.phone,
              w: 300,
              h: 420,
              node: (
                <>
                  <PhoneShot ad={ad} ai={ai} className="left-[50px] top-[10px] h-[400px] w-[200px]" />
                  {ad && <CallToast className="left-0 top-[290px] z-20" />}
                </>
              ),
            },
            { title: tags.blog, w: 360, h: 300, node: <BlogStack className="left-0 top-[52px] h-[248px] w-[300px]" /> },
            { title: tags.sheet, w: 330, h: ad ? 170 : 240, pad: 0.88, node: <ReportSheet ad={ad} ai={ai} className="left-0 top-0 w-[330px]" /> },
          ]}
        />
        </>}

        {/* the price, as an open row */}
        <motion.div {...rise(0.06)} className="mt-14 border-t border-black/10 pt-10 md:mt-16 md:pt-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto_minmax(0,22rem)] lg:items-end lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[1.6rem] font-bold leading-tight tracking-[-0.045em] text-[#0e0e10] md:text-[2rem]">{tier.name}</p>
                {tier.pick && <span className="rounded-full bg-[#007aff] px-3 py-1 text-[0.72rem] font-bold text-white">Beliebteste Wahl</span>}
                {tier.tag && <span className="rounded-full bg-[#0e0e10] px-3 py-1 text-[0.72rem] font-bold text-white">{tier.tag}</span>}
              </div>
              {always.length > 0 && <p className="mt-2 hidden max-w-[60ch] text-[0.95rem] font-medium leading-[1.55] text-[#6b7280] lg:block">Immer dabei: {always.join(", ")}.</p>}
            </div>
            <div>
              <p className="flex items-baseline gap-2 font-bold leading-[0.85] tracking-[-0.07em] text-[#0e0e10] tabular-nums">
                <span className="text-[clamp(4.2rem,7vw,6rem)]">{tier.price}</span>
                <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#86868b]">€ / Monat</span>
              </p>
              {tier.guarantee ? (
                <p className="mt-3 text-[0.98rem] font-semibold tracking-[-0.015em] text-[#007aff]">{tier.guarantee}</p>
              ) : (
                <p className="mt-3 text-[0.95rem] font-medium text-[#6b7280]">
                  Oder 6 Monate im Voraus: <span className="font-bold text-[#0e0e10]">{prepay} € / Monat</span>
                </p>
              )}
              {tier.perVideo && (
                <p className="mt-1 text-[0.95rem] font-medium text-[#6b7280]">
                  Nur <span className="font-bold text-[#007aff]">{tier.perVideo} pro Video</span>, im Voraus {perVideo} €
                </p>
              )}
            </div>
            <div>
              <a href={CTA_HREF} className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
                Anfrage starten <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <p className="mt-3 text-center text-[0.8rem] font-medium leading-snug text-[#86868b]">
                Netto zzgl. 19 % MwSt. 6 Monate Mindestlaufzeit.{fine ? ` ${fine}` : ""}
              </p>
            </div>
            {always.length > 0 && <p className="border-t border-black/10 pt-6 text-[0.95rem] font-medium leading-[1.55] text-[#6b7280] lg:hidden">Immer dabei: {always.join(", ")}.</p>}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ServiceV2({ cfg, current }: { cfg: ServiceConfig; current: string }) {
  const reduce = useReducedMotion();
  const rise = (d = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.7, delay: d, ease: EASE } };
  const { Visual } = cfg;

  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} current={current} />
      </div>
      <main>
        {/* hero: centred, built around a live Google search */}
        <section className="relative overflow-hidden bg-white pb-16 pt-10 text-[#0e0e10] md:pb-24 md:pt-16">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] h-[720px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(closest-side, ${cfg.tint}, rgba(255,255,255,0))` }} />
          <div className="relative mx-auto w-full max-w-[1360px] px-4 text-center md:px-8">
            <motion.p {...rise()} className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">{cfg.eyebrow}</motion.p>
            <motion.h1 {...rise(0.04)} className="mx-auto mt-4 text-[clamp(2.9rem,8vw,6.6rem)] font-bold leading-[0.92] tracking-[-0.065em]">
              <span className="text-[#0e0e10]/30">{cfg.titleMuted}</span>
              <br />
              {cfg.title}
              <span className="text-[#007aff]">.</span>
            </motion.h1>

            <motion.div {...rise(0.1)}>
              {cfg.kind === "ai" ? <HeroAsk /> : cfg.kind === "content" ? <HeroReels /> : cfg.kind === "web" ? <ClientShowcase /> : <HeroSearch ad={cfg.kind === "ads"} />}
            </motion.div>

            <motion.p {...rise(0.14)} className="mx-auto mt-9 max-w-[46ch] text-[1.05rem] font-medium leading-[1.5] tracking-[-0.02em] text-[#424245] md:text-[1.15rem]">{cfg.intro}</motion.p>
            <motion.div {...rise(0.18)} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <a href={CTA_HREF} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
                Anfrage starten
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="/preise" className="border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
                Preise ansehen
              </a>
            </motion.div>
            {/* the city pages for this service (cities.ts): one link each */}
            {localPages(cfg.kind).length > 0 && (
              <motion.p {...rise(0.22)} className="mt-6 text-[0.92rem] font-semibold text-[#6b7280]">
                In deiner Stadt:{" "}
                {localPages(cfg.kind).map((c, i) => (
                  <span key={c.href}>
                    {i > 0 && <span aria-hidden> · </span>}
                    <a href={c.href} title={c.title} className="text-[#007aff] underline-offset-4 hover:underline">{c.label}</a>
                  </span>
                ))}
              </motion.p>
            )}
            {/* the sourced result lives in "Echte Ergebnisse" further down */}
          </div>
        </section>

        {cfg.video && <ServiceVideo base={cfg.video.base} title={cfg.video.title} />}

        {/* the problem: a bright panel (statement + daylight scene), then what is missing as three tiles */}
        <section className="bg-[#f5f5f7] py-16 text-[#0e0e10] md:py-24">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...rise()} className="relative grid overflow-hidden rounded-[28px] bg-white lg:min-h-[560px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              {cfg.photo && (
                <div className="relative order-1 aspect-[4/3] lg:order-2 lg:aspect-auto">
                  <img src={cfg.photo.src} alt={cfg.photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  {/* fades into the dark panel: down on phones, left on desktop */}
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_60%,#ffffff_100%)] lg:bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.5)_18%,rgba(255,255,255,0)_42%)]" />
                  {cfg.photo.chips?.map((c, i) => (
                    <motion.span
                      key={c}
                      {...(reduce ? {} : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.6 }, transition: { duration: 0.5, delay: 0.4 + i * 0.35, ease: EASE } })}
                      className={`absolute inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[0.8rem] font-bold tracking-[-0.01em] text-[#0e0e10] shadow-[0_16px_36px_-18px_rgba(15,23,42,0.45)] md:text-[0.88rem] ${i === 0 ? "left-4 top-4 md:left-6 md:top-6 lg:left-auto lg:right-6" : "bottom-6 right-4 md:right-6 lg:bottom-8"}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#ff9500]" : "bg-[#007aff]"}`} />
                      {c}
                    </motion.span>
                  ))}
                </div>
              )}
              <div className="relative order-2 flex flex-col justify-center px-6 pb-9 pt-2 md:px-10 md:pb-12 lg:order-1 lg:px-14 lg:py-16">
                <p className="text-[clamp(2.1rem,4.4vw,3.9rem)] font-bold leading-[1] tracking-[-0.055em] text-[#0e0e10]">
                  {cfg.problem.strong} <span className="text-[#0e0e10]/35">{cfg.problem.muted}</span>
                </p>
                <p className="mt-6 max-w-[46ch] text-[1.02rem] font-medium leading-[1.55] tracking-[-0.015em] text-[#424245] md:text-[1.1rem]">{cfg.problem.text}</p>
              </div>
            </motion.div>

            {cfg.gaps && (
              <>
                <motion.p {...rise()} className="mt-12 text-[1.6rem] font-bold tracking-[-0.045em] text-[#0e0e10] md:mt-16">
                  Was heute fehlt<span className="text-[#007aff]">.</span>
                </motion.p>
                <div className="mt-5 grid gap-2.5 md:grid-cols-3 md:gap-4">
                  {cfg.gaps.map((g, i) => (
                    <motion.div key={g.title} {...rise(0.05 + i * 0.06)} className="rounded-[22px] bg-white p-4 pb-6">
                      <div className="relative flex h-[96px] items-center justify-center overflow-hidden rounded-[14px] bg-[#f5f5f7]">
                        <span className={`rounded-[10px] px-4 py-2.5 text-[1rem] font-bold tracking-[-0.02em] ${g.wrong ? "bg-white text-[#9aa0a8] line-through decoration-[#ff9500] decoration-2" : "border-2 border-dashed border-[#c9ccd2] text-[#a1a1a6]"}`}>
                          {g.ghost}
                        </span>
                        <span className="absolute right-3 top-3 rounded-[6px] bg-[#fff2e0] px-2 py-0.5 text-[0.72rem] font-bold text-[#c96a00]">{g.wrong ? "falsch" : "fehlt"}</span>
                      </div>
                      <p className="mt-5 px-1 text-[1.25rem] font-bold leading-tight tracking-[-0.035em] text-[#0e0e10]">{g.title}</p>
                      <p className="mt-2 px-1 text-[0.95rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#424245]">{g.text}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* four steps */}
        <section className="bg-white py-20 text-[#0e0e10] md:py-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...rise()}>
              <H2>{cfg.stepsTitle}</H2>
            </motion.div>
            {/* bento: wide, narrow / narrow, wide. Text on top, the illustration runs off the bottom edge */}
            <div className="mt-10 grid gap-2.5 md:mt-14 md:grid-cols-12 md:gap-4">
              {cfg.steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  {...rise(0.04 + i * 0.05)}
                  className={`relative flex flex-col overflow-hidden rounded-[24px] bg-[#f5f5f7] ${["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"][i] ?? "md:col-span-6"}`}
                >
                  {/* the real platform mark as a large, cropped watermark in the corner */}
                  {cfg.kind === "web" ? (
                    <span aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#007aff] opacity-[0.08] md:-right-14 md:-top-14 md:h-56 md:w-56" />
                  ) : (
                  <img
                    src={cfg.kind === "ai" ? `${LOGO}/${["openai", "claude", "googlegemini", "google"][i % 4]}.svg` : cfg.kind === "content" ? `/assets/v2/brands/${i % 2 ? "facebook" : "instagram"}.svg` : cfg.kind === "ads" ? "/assets/v2/brands/google-ads.svg" : "/assets/v2/brands/google-g.svg"}
                    alt=""
                    aria-hidden
                    className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-[-12deg] select-none object-contain md:-right-12 md:-top-12 md:h-56 md:w-56 ${cfg.kind === "ai" ? "opacity-[0.2]" : "opacity-[0.13]"}`}
                    draggable={false}
                  />
                  )}
                  <div className="relative px-6 pt-7 md:px-8 md:pt-9">
                    <p className="text-[0.8rem] font-bold tabular-nums text-[#007aff]">{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-1.5 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-[-0.045em] text-[#0e0e10]">{s.title}</p>
                    <p className="mt-2.5 max-w-[42ch] text-[0.98rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#424245]">{s.body}</p>
                  </div>
                  <div className="relative mt-7 h-[230px] md:mt-9 md:h-[250px]">
                    <BentoArt kind={s.art} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* the package, straight from the price list */}
        {cfg.kind === "web" ? <WebPackage cfg={cfg} rise={rise} /> : <PackageSection cfg={cfg} rise={rise} />}

        {/* real results */}
        <section className="bg-white py-20 text-[#0e0e10] md:py-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...rise()}>
              <H2>{cfg.results?.title ?? "Echte Ergebnisse"}</H2>
              <p className="mt-5 max-w-[46ch] text-[1.05rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">{cfg.results?.text ?? "Aus unseren Monatsberichten, nicht aus einer Werbebroschüre."}</p>
            </motion.div>
            <div className={`grid gap-2.5 md:gap-4 ${cfg.cases.length ? "mt-10 md:mt-14" : ""} ${cfg.cases.length > 1 ? "md:grid-cols-2" : ""}`}>
              {cfg.cases.map((c, i) => (
                <motion.a key={c.client} {...rise(0.05 + i * 0.05)} href={caseHref(c.img)} aria-label={caseHref(c.img) ? `Referenz ansehen: ${c.client}` : undefined} className={`group relative block overflow-hidden rounded-[22px] bg-[#eef0f3] aspect-[4/3.4] ${cfg.cases.length % 2 === 1 && i === 0 ? "md:col-span-2 md:aspect-[21/9]" : "md:aspect-[4/3]"}`}>
                  <img src={c.img} alt={c.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
                  {caseHref(c.img) && (
                    <span aria-hidden className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[#0e0e10] transition-colors duration-300 group-hover:bg-[#007aff] group-hover:text-white md:right-5 md:top-5">
                      <ArrowUpRight size={19} strokeWidth={2.4} />
                    </span>
                  )}
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,rgba(14,14,16,0)_0%,rgba(14,14,16,0.75)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <p className="text-[2.4rem] font-bold leading-none tracking-[-0.05em] text-white md:text-[3.2rem]">{c.stat}</p>
                    <p className="mt-2 max-w-[36ch] text-[0.98rem] font-semibold leading-snug text-white/90 md:text-[1.08rem]">{c.statRest}</p>
                    <p className="mt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/70">{c.client}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* AI mentions as a bento: a title tile with the assistants, then the client sites */}
            {cfg.mentions && (
              <div className={`grid grid-cols-2 gap-2.5 md:grid-cols-12 md:gap-4 ${cfg.cases.length ? "mt-2.5 md:mt-4" : "mt-10 md:mt-14"}`}>
                <motion.div {...rise()} className="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-[22px] p-6 md:col-span-4 md:min-h-[380px] md:p-8" style={{ background: cfg.kind === "ai" ? "#f1eefc" : cfg.tint }}>
                  <div className="flex -space-x-2">
                    {(cfg.mentions.logos ?? []).map((l) => (
                      <span key={l} className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_10px_24px_-14px_rgba(60,30,140,0.45)] ring-4 ring-[#f1eefc]">
                        <img src={l} alt="" className="h-6 w-6" />
                      </span>
                    ))}
                  </div>
                  <div className="mt-10 md:mt-0">
                    <p className="text-[clamp(1.7rem,2.6vw,2.3rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#0e0e10]">
                      {cfg.mentions.title}
                      <span className="text-[#007aff]">.</span>
                    </p>
                    <p className="mt-3 max-w-[36ch] text-[0.98rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#424245]">{cfg.mentions.text}</p>
                  </div>
                </motion.div>
                {cfg.mentions.items.map((m, i) => {
                  // first site wide next to the title, the rest share the next row(s)
                  const rest = cfg.mentions!.items.length - 1;
                  // rows of three; a row of two gets wider tiles
                  const md = rest === 1 ? "md:col-span-12" : rest % 3 === 0 ? "md:col-span-4" : rest % 3 === 2 && i > rest - 2 ? "md:col-span-6" : rest % 3 === 1 && i === rest ? "md:col-span-12" : rest === 2 || rest === 4 ? "md:col-span-6" : "md:col-span-4";
                  const span = i === 0 ? "col-span-2 md:col-span-8 md:min-h-[380px]" : i === rest && i % 2 === 1 ? `col-span-2 ${md}` : `col-span-1 ${md}`;
                  return (
                    <motion.a key={m.client} {...rise(0.05 + i * 0.05)} href={m.href ?? caseHref(m.img)} aria-label={(m.href ?? caseHref(m.img)) ? `Referenz ansehen: ${m.client}` : undefined} className={`group relative block min-h-[230px] overflow-hidden rounded-[22px] bg-[#eef0f3] md:min-h-[340px] ${span}`}>
                      <img src={m.img} alt={`Website von ${m.client}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
                      {(m.href ?? caseHref(m.img)) && (
                        <span aria-hidden className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#0e0e10] transition-colors duration-300 group-hover:bg-[#007aff] group-hover:text-white md:right-4 md:top-4">
                          <ArrowUpRight size={18} strokeWidth={2.4} />
                        </span>
                      )}
                      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,rgba(14,14,16,0)_0%,rgba(14,14,16,0.66)_100%)]" />
                      {cfg.mentions!.chip && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[0.72rem] font-bold text-[#5b3fd6] md:left-4 md:top-4 md:text-[0.78rem]">
                          <Sparkles size={13} strokeWidth={2.4} aria-hidden /> {cfg.mentions!.chip}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                        <p className={`font-bold leading-tight tracking-[-0.04em] text-white ${i === 0 ? "text-[1.6rem] md:text-[2.1rem]" : "text-[1.15rem] md:text-[1.5rem]"}`}>{m.client}</p>
                        <p className="mt-0.5 text-[0.8rem] font-semibold text-white/75 md:text-[0.9rem]">{m.place}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            )}

            {/* the other service */}
            <motion.a {...rise(0.08)} href={cfg.cross.href} className="group mt-2.5 flex items-center justify-between gap-6 rounded-[22px] bg-[#f5f5f7] p-6 md:mt-4 md:p-8">
              <span>
                <span className="block text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">{cfg.cross.label}</span>
                <span className="mt-1.5 block text-[1.5rem] font-bold leading-tight tracking-[-0.04em] text-[#0e0e10] md:text-[1.9rem]">{cfg.cross.title}</span>
                <span className="mt-1.5 block max-w-[52ch] text-[0.95rem] font-medium leading-snug text-[#6b7280]">{cfg.cross.text}</span>
              </span>
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#0e0e10] text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={20} strokeWidth={2.4} />
              </span>
            </motion.a>
          </div>
        </section>

        <FaqV2 items={cfg.faqs} />
        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}

export { SERVICE };
