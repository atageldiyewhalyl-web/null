import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Lock, ShoppingBag, Users } from "lucide-react";

/*
 * Preise: three one-off starts (Onepager / Website / Onlineshop, Halyl 2026-11-10), one monthly website package, two Meta add-ons.
 * The one-off visuals are neutral coded mockups of a made-up "Dein Betrieb" site: never a client's website (Halyl).
 * Every card opens with a visual of what you pay for: official platform logos (Wikimedia Commons, /assets/v2/brands)
 * plus our real client work and real results (same sources as the cases section).
 * All prices net plus VAT (PAngV: state it). Minimum term 6 months for monthly packages.
 * Confirmed by Halyl: monthly report in every tier; Meta/Content bookable without a website; min. ad budget 450 €/month
 * per platform. Guarantee (Halyl, 2026-11-10): only in "SEO & Google Ads", no monthly fee until we bring the first enquiry.
 * Other packages bill monthly from the start.
 * Prepay (Halyl, 2026-11-10): monthly packages and add-ons can be paid 6 months up front at 20 % off. Exact amounts, no
 * rounding. Ad budget is never part of it. "SEO & Google Ads" keeps its guarantee: the 6 paid months start with the first enquiry.
 */

const CTA_HREF = "#contact";
const EASE = [0.22, 1, 0.36, 1] as const;
const BR = "/assets/v2/brands";
const CS = "/assets/v2/cases";

/* ---------- hover (after systrastudios.de/preise): a soft blue glow fades in straight down from the top of the text area ---------- */
const CARD_HOVER = "group transition-shadow duration-500 hover:shadow-[0_30px_60px_-36px_rgba(15,23,42,0.35)]";
const GLOW =
  "relative isolate before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[12px] before:bg-[linear-gradient(180deg,rgba(0,122,255,0.13)_0%,rgba(0,122,255,0.05)_38%,transparent_72%)] before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100";

// "Beliebteste Wahl" label on the top edge of a card (after systrastudios.de/preise)
const PopularBadge = () => (
  <span className="absolute left-1/2 top-0 z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#0e0e10] shadow-[0_0_0_1px_rgba(0,122,255,0.18),0_10px_24px_-10px_rgba(0,122,255,0.45)]">
    <Users size={13} strokeWidth={2.2} className="text-[#007aff]" />
    Beliebteste Wahl
  </span>
);

/* ---------- small visual pieces ---------- */

const Chip = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`absolute z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] bg-white px-2.5 py-1.5 text-[0.8rem] font-semibold tracking-[-0.01em] text-[#0e0e10] shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] ${className}`}>
    {children}
  </span>
);
const Proof = ({ n, t, className = "" }: { n: string; t: string; className?: string }) => (
  <Chip className={className}>
    <span className="font-bold">{n}</span>
    <span className="font-medium text-[#6b7280]">{t}</span>
  </Chip>
);
const Logo = ({ src, size = 44, className = "" }: { src: string; size?: number; className?: string }) => (
  <span className={`absolute z-10 grid place-items-center rounded-[14px] bg-white shadow-[0_12px_28px_-14px_rgba(15,23,42,0.4)] ${className}`} style={{ width: size + 24, height: size + 24 }}>
    <img src={src} alt="" style={{ width: size, height: size }} className="object-contain" draggable={false} />
  </span>
);
const Panel = ({ children, tall = false }: { children: ReactNode; tall?: boolean }) => (
  <div className={`relative overflow-hidden rounded-[12px] bg-[#f5f5f7] ${tall ? "h-[260px] md:h-full md:min-h-[300px]" : "h-[210px]"}`}>{children}</div>
);

/* ---------- one-off visuals: neutral mockups, no client sites ---------- */
const Bar = ({ w, c = "#e3e6ec", h = 6 }: { w: string; c?: string; h?: number }) => <span className="block rounded-full" style={{ width: w, height: h, background: c }} />;
const Browser = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`absolute overflow-hidden rounded-[10px] bg-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.45)] ${className}`} style={style}>
    <div className="flex h-5 items-center gap-1 border-b border-black/[0.06] px-2">
      {[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 rounded-full bg-[#d4d7dd]" />)}
    </div>
    {children}
  </div>
);

// one long page in a phone, gently scrolling
const VOnepager = () => {
  const reduce = useReducedMotion();
  return (
    <Panel>
      <div className="absolute left-1/2 top-5 h-[260px] w-[124px] -translate-x-1/2 rounded-[22px] bg-[#0e0e10] p-[5px] shadow-[0_24px_48px_-24px_rgba(15,23,42,0.6)]">
        <div className="relative h-full overflow-hidden rounded-[18px] bg-white">
          <motion.div className="space-y-3 px-2.5 pt-3" animate={reduce ? undefined : { y: [0, -150, 0] }} transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}>
            <div className="flex items-center justify-between">
              <span className="text-[0.5rem] font-bold tracking-[-0.03em] text-[#0e0e10]">Dein Betrieb<span className="text-[#007aff]">.</span></span>
              <span className="h-1.5 w-3 rounded-full bg-[#d4d7dd]" />
            </div>
            <div className="space-y-1.5 rounded-[8px] bg-[#eef3fb] p-2">
              <Bar w="85%" c="#0e0e10" h={5} />
              <Bar w="60%" c="#0e0e10" h={5} />
              <Bar w="70%" h={3} />
              <span className="mt-1 block h-3 w-12 rounded-full bg-[#007aff]" />
            </div>
            <div className="grid grid-cols-3 gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-8 rounded-[5px] bg-[#f0f1f3]" />)}</div>
            <div className="space-y-1"><Bar w="50%" c="#0e0e10" h={4} /><Bar w="90%" h={3} /><Bar w="75%" h={3} /></div>
            <div className="rounded-[6px] bg-[#f7f8fa] p-1.5 text-[0.45rem] text-[#f5a623]">★★★★★<div className="mt-1 space-y-1"><Bar w="80%" h={3} /><Bar w="55%" h={3} /></div></div>
            <div className="space-y-1 rounded-[6px] border border-black/[0.08] p-1.5"><Bar w="40%" c="#0e0e10" h={4} /><span className="block h-3 rounded-[3px] border border-black/[0.08]" /><span className="block h-3 rounded-[3px] border border-black/[0.08]" /><span className="block h-3 rounded-full bg-[#007aff]" /></div>
            <div className="h-10 rounded-[6px] bg-[#0e0e10]" />
          </motion.div>
        </div>
      </div>
      <Chip className="bottom-3 left-3"><span className="font-bold">1 Seite</span></Chip>
    </Panel>
  );
};

// several pages of one site, stacked like tabs
const VWebsite = () => (
  <Panel>
    {[
      { t: "Kontakt", x: 66, y: 18, o: 0.55 },
      { t: "Über uns", x: 50, y: 30, o: 0.75 },
      { t: "Leistungen", x: 34, y: 42, o: 0.9 },
    ].map((p) => (
      <Browser key={p.t} className="h-[150px] w-[210px]" style={{ left: p.x, top: p.y, opacity: p.o }}>
        <div className="p-2.5"><Bar w="45%" c="#0e0e10" h={5} /><div className="mt-2 space-y-1"><Bar w="90%" h={3} /><Bar w="70%" h={3} /></div></div>
      </Browser>
    ))}
    <Browser className="h-[150px] w-[230px]" style={{ left: 16, top: 54 }}>
      <div className="flex items-center justify-between px-2.5 pt-2">
        <span className="text-[0.55rem] font-bold tracking-[-0.03em] text-[#0e0e10]">Dein Betrieb<span className="text-[#007aff]">.</span></span>
        <span className="flex gap-1.5 text-[0.42rem] font-semibold text-[#6b7280]"><span className="text-[#007aff]">Start</span><span>Leistungen</span><span>Über uns</span><span>Kontakt</span></span>
      </div>
      <div className="mt-2 grid grid-cols-[1.2fr_1fr] gap-2 px-2.5">
        <div className="space-y-1.5 pt-1"><Bar w="95%" c="#0e0e10" h={5} /><Bar w="70%" c="#0e0e10" h={5} /><Bar w="85%" h={3} /><span className="mt-1 block h-3 w-12 rounded-full bg-[#007aff]" /></div>
        <span className="h-[62px] rounded-[6px] bg-[#eef3fb]" />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 px-2.5">{[0, 1, 2].map((k) => <span key={k} className="h-6 rounded-[4px] bg-[#f0f1f3]" />)}</div>
    </Browser>
    <Chip className="bottom-3 right-3"><span className="font-bold">10+ Seiten</span></Chip>
  </Panel>
);

// a product grid, a cart and a secure checkout
const VShop = () => (
  <Panel>
    <Browser className="h-[186px] w-[250px]" style={{ left: 16, top: 14 }}>
      <div className="flex items-center justify-between px-2.5 pt-2">
        <span className="text-[0.55rem] font-bold tracking-[-0.03em] text-[#0e0e10]">Dein Shop<span className="text-[#007aff]">.</span></span>
        <span className="relative text-[#0e0e10]"><ShoppingBag size={11} strokeWidth={2.4} /><span className="absolute -right-1.5 -top-1.5 grid h-2.5 w-2.5 place-items-center rounded-full bg-[#007aff] text-[0.38rem] font-bold text-white">2</span></span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 px-2.5">
        {["#e8eef8", "#f3ece4", "#e6f1ea", "#f2e8ee", "#eceef2", "#f4efe2"].map((c, k) => (
          <div key={k}>
            <span className="block h-[38px] rounded-[5px]" style={{ background: c }} />
            <span className="mt-1 block"><Bar w="80%" h={3} /></span>
            <span className="mt-0.5 block text-[0.42rem] font-bold tabular-nums text-[#0e0e10]">{["29,90", "49,00", "19,90", "64,50", "34,90", "24,00"][k]} €</span>
          </div>
        ))}
      </div>
    </Browser>
    <div className="absolute bottom-4 right-4 w-[150px] rounded-[10px] bg-white p-2.5 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.5)]">
      <div className="flex items-baseline justify-between text-[0.6rem] font-semibold text-[#6b7280]"><span>Warenkorb · 2</span><span className="font-bold tabular-nums text-[#0e0e10]">78,90 €</span></div>
      <span className="mt-2 flex h-6 items-center justify-center gap-1 rounded-full bg-[#007aff] text-[0.58rem] font-bold text-white"><Lock size={9} strokeWidth={2.8} />Sicher bezahlen</span>
    </div>
  </Panel>
);
export const VWartung = () => (
  <Panel>
    <img src="/assets/v2/preise-wartung.webp" alt="Laptop mit Wartungsübersicht: Updates installiert, Backup gesichert, SSL-Zertifikat aktiv, Ladezeit geprüft" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
  </Panel>
);
export const VSeo = () => (
  <Panel>
    <Logo src={`${BR}/google-g.svg`} size={36} className="left-4 top-4" />
    <div className="absolute left-[92px] right-4 top-[26px] flex h-10 items-center gap-2 rounded-[8px] bg-white px-4 text-[0.82rem] text-[#202124] shadow-[0_8px_20px_-12px_rgba(15,23,42,0.3)]">
      <svg width="14" height="14" viewBox="0 0 44 44" aria-hidden className="flex-none"><circle cx="19" cy="19" r="13" stroke="#9aa0a6" strokeWidth="5" fill="none" /><path d="M29 29l11 11" stroke="#9aa0a6" strokeWidth="5" /></svg>
      <span className="truncate">Umzugsunternehmen Mannheim</span>
    </div>
    <div className="absolute inset-x-4 top-[92px] rounded-[10px] bg-white px-4 py-3 shadow-[inset_0_0_0_2px_#007aff]">
      <p className="text-[0.7rem] text-[#4d5156]">umzuege-herkules.de</p>
      <p className="truncate text-[0.95rem] font-medium text-[#1a0dab]">Herkules Umzüge · Umzugsfirma Mannheim</p>
    </div>
    <Proof n="Seite 1" t="bei Google, Herkules" className="bottom-3 left-3" />
  </Panel>
);
export const VAds = () => (
  <Panel>
    <Logo src={`${BR}/google-ads.svg`} size={56} className="left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2" />
    <Logo src={`${BR}/google-g.svg`} size={26} className="left-[calc(50%-122px)] top-[28%] -translate-y-1/2 rotate-[-6deg]" />
    <Logo src={`${BR}/google-maps.svg`} size={26} className="left-[calc(50%+68px)] top-[50%] -translate-y-1/2 rotate-[6deg]" />
    <Proof n="2.491" t="Routenanfragen, Waschbar" className="bottom-3 left-3" />
  </Panel>
);
const VMeta = () => (
  <Panel>
    <img src={`${CS}/orchidee-ad-2.webp`} alt="Anzeige von Pflegedienst Orchidee" className="absolute right-6 top-4 h-[150px] rotate-[4deg] rounded-[10px] sm:h-[170px] shadow-[0_18px_36px_-16px_rgba(15,23,42,0.5)]" draggable={false} />
    <img src={`${BR}/meta.webp`} alt="Meta" className="absolute left-5 top-6 h-7" draggable={false} />
    <Logo src={`${BR}/facebook.svg`} size={28} className="left-5 top-[70px]" />
    <Logo src={`${BR}/instagram.svg`} size={28} className="left-[86px] top-[70px]" />
    <Proof n="41" t="Bewerbungen, Orchidee" className="bottom-3 left-3" />
  </Panel>
);
const VContent = () => (
  <Panel>
    {[1, 2, 3].map((n, i) => (
      <img
        key={n}
        src={`${CS}/bergstone-reel-${n}.jpg`}
        alt={i === 1 ? "Reels von Bergstone Keramiksan" : ""}
        className="absolute top-4 h-[150px] rounded-[10px] shadow-[0_18px_36px_-16px_rgba(15,23,42,0.5)] sm:h-[170px]"
        style={{ right: `calc(${(2 - i) * 17}% + 18px)`, transform: `rotate(${(i - 1) * 4}deg) translateY(${i === 1 ? -4 : 6}px)`, zIndex: i === 1 ? 2 : 1 }}
        draggable={false}
      />
    ))}
    <Logo src={`${BR}/instagram.svg`} size={36} className="left-5 top-5" />
    <Proof n="36.757" t="erreicht, Bergstone" className="bottom-3 left-3" />
  </Panel>
);

/* ---------- data ---------- */

export type Tier = { name: string; short?: string; price: string; note: string; base?: string; items: string[]; fine?: string; guarantee?: string; pick?: boolean; visual: ReactNode };

export const TIERS: Tier[] = [
  { name: "Wartung", price: "99", note: "Damit deine Website läuft.", items: ["Hosting und technische Wartung", "Kleine Änderungen jeden Monat", "Monatsbericht mit echten Zahlen"], visual: <VWartung /> },
  {
    name: "SEO",
    price: "299",
    note: "Damit du bei Google gefunden wirst.",
    base: "Alles aus Wartung, plus:",
    items: ["Bis zu 8 Blogartikel im Monat", "Neue Seiten und Landingpages", "Laufende SEO-Optimierung"],
    visual: <VSeo />,
  },
  {
    name: "SEO & Google Ads",
    short: "SEO & Ads",
    price: "450",
    note: "Damit Anfragen planbar werden.",
    base: "Alles aus SEO, plus:",
    items: ["Einrichtung deiner Google-Ads-Kampagnen", "Laufendes Management deines Werbekontos"],
    fine: "Werbebudget ab 450 € im Monat, direkt an Google.",
    guarantee: "0 € Monatsgebühr, bis deine erste Anfrage kommt.",
    pick: true,
    visual: <VAds />,
  },
];

export type Addon = { name: string; short?: string; price: string; note: string; items: string[]; visual: ReactNode; tag?: string; perVideo?: string };
export const ADDONS: Addon[] = [
  { name: "Meta Ads", price: "399", note: "Werbung auf Facebook und Instagram.", items: ["Führung deines Werbekontos", "Statische Anzeigen von uns", "Laufende Optimierung"], visual: <VMeta /> },
  {
    name: "Content & Meta Ads",
    short: "Content & Meta",
    perVideo: "62,45 €",
    price: "1.249",
    note: "Videos und Posts, die zeigen, was du kannst.",
    tag: "Enthält Meta Ads",
    items: ["Bis zu 20 Videos im Monat", "12 statische Posts und Stories", "Dreh vor Ort, Schnitt inklusive"],
    visual: <VContent />,
  },
];

// one-off starts. Prices from Halyl (2026-11-10). Items marked "confirm" in the report: onepager profile + 7 days, shop details.
export const STARTS: { name: string; short?: string; price: string; note: string; items: string[]; visual: ReactNode; popular?: boolean }[] = [
  { name: "Onepager", price: "1.499", note: "Eine Seite, alles Wichtige auf einen Blick.", items: ["1 Seite mit allen wichtigen Infos", "Google-Unternehmensprofil optimiert", "Texte, Design und Technik", "Live in 7 Tagen"], visual: <VOnepager /> },
  { name: "Website", popular: true, price: "1.999", note: "Für Betriebe mit mehreren Leistungen.", items: ["Website mit 10+ Seiten", "Google-Unternehmensprofil optimiert", "Texte, Design und Technik", "Live in 7 Tagen"], visual: <VWebsite /> },
  { name: "Onlineshop", short: "Shop", price: "3.499", note: "Für alle, die online verkaufen.", items: ["Hunderte Produktseiten möglich", "Zahlungsabwicklung inklusive", "Warenkorb und Checkout", "Texte, Design und Technik"], visual: <VShop /> },
];

const PROMISES = [
  { n: "0 €", t: "Monatsgebühr, bis deine erste Anfrage kommt.", s: "Gilt im Paket SEO & Google Ads." },
  { n: "3", t: "Betriebe pro Branche und Stadt.", s: "Mehr nehmen wir nicht. So arbeiten wir nie gegen dich." },
  { n: "12", t: "Berichte im Jahr, mit echten Zahlen.", s: "Jeden Monat siehst du, was es gebracht hat." },
];

/* ---------- pieces ---------- */

const Tick = () => <Check size={18} strokeWidth={2.4} className="mt-[2px] flex-none text-[#0e0e10]" aria-hidden />;
const Price = ({ p, unit = "€ / Monat", size = "text-[3rem]", from = false }: { p: string; unit?: string; size?: string; from?: boolean }) => (
  <p className={`flex items-baseline gap-1.5 font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums ${size}`}>
    {from && <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">ab</span>}
    {p}
    <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">{unit}</span>
  </p>
);
// prepay maths: 6 months at once, 20 % off
const MONTHS = 6;
const OFF = 0.2;
const num = (p: string) => Number(p.replace(/\./g, "").replace(",", "."));
const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2, maximumFractionDigits: 2 });

// monthly price, or the prepay price: monthly equivalent with the normal price struck through, then the 6-month total
const MonthlyPrice = ({ p, prepay }: { p: string; prepay: boolean }) => {
  const m = num(p);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={prepay ? "pre" : "mon"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: EASE }}>
        {prepay ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums text-[3rem]">
              <span className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#a1a1a6] line-through decoration-[1.5px]">{p}</span>
              {eur(m * (1 - OFF))}
              <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#86868b]">€ / Monat</span>
            </p>
            <p className="mt-2.5 text-[0.92rem] font-medium leading-snug text-[#6b7280]">
              <span className="whitespace-nowrap font-bold text-[#0e0e10]">{eur(m * MONTHS * (1 - OFF))} €</span> für {MONTHS} Monate im Voraus · <span className="whitespace-nowrap">du sparst <span className="font-semibold text-[#007aff]">{eur(m * MONTHS * OFF)} €</span></span>
            </p>
          </>
        ) : (
          <Price p={p} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// phones and tablets: pick a package from a segmented control (name + price), the full card shows below.
// Opens on the most popular package. Desktop shows all cards side by side instead.
function Chooser({ tabs, start, render, className = "" }: { tabs: { label: string; sub: string; popular?: boolean }[]; start: number; render: (k: number) => ReactNode; className?: string }) {
  const [k, setK] = useState(Math.max(0, start));
  const reduce = useReducedMotion();
  return (
    <div className={`mt-5 ${className}`}>
      <div role="tablist" className="grid gap-1 rounded-[16px] bg-[#e8e8ed] p-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === k}
            onClick={() => setK(i)}
            className={`rounded-[12px] px-1.5 py-2.5 text-center transition-[background-color,box-shadow] duration-300 ${i === k ? "bg-white shadow-[0_2px_8px_rgba(15,23,42,0.12)]" : ""}`}
          >
            <span className="flex items-center justify-center gap-1.5 truncate text-[0.88rem] font-bold tracking-[-0.02em] text-[#0e0e10]">
              {t.popular && <span aria-label="Beliebteste Wahl" className="h-1.5 w-1.5 flex-none rounded-full bg-[#007aff]" />}
              {t.label}
            </span>
            <span className={`mt-0.5 block truncate text-[0.72rem] font-semibold tabular-nums ${i === k ? "text-[#007aff]" : "text-[#86868b]"}`}>{t.sub}</span>
          </button>
        ))}
      </div>
      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={k} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
            {render(k)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// phones and tablets: the prepay choice as one calm settings row
const PrepayRow = ({ on, set, className = "" }: { on: boolean; set: (v: boolean) => void; className?: string }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className={`flex w-full items-center justify-between gap-4 rounded-[16px] bg-white px-4 py-3 text-left ${className}`}>
    <span>
      <span className="block text-[0.95rem] font-bold tracking-[-0.02em] text-[#0e0e10]">6 Monate im Voraus</span>
      <span className="block text-[0.8rem] font-semibold text-[#007aff]">20 % günstiger</span>
    </span>
    <span aria-hidden className={`relative h-8 w-[52px] flex-none rounded-full transition-colors duration-300 ${on ? "bg-[#007aff]" : "bg-[#d4d7dd]"}`}>
      <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.25)] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${on ? "translate-x-5" : ""}`} />
    </span>
  </button>
);

// "Monatlich / 6 Monate im Voraus" switch
const PrepaySwitch = ({ on, set }: { on: boolean; set: (v: boolean) => void }) => (
  <div className="flex items-center gap-3">
    <button type="button" onClick={() => set(false)} className={`text-[0.95rem] font-semibold tracking-[-0.02em] transition-colors ${on ? "text-[#86868b]" : "text-[#0e0e10]"}`}>
      Monatlich
    </button>
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="6 Monate im Voraus zahlen, 20 % günstiger"
      onClick={() => set(!on)}
      className={`relative h-8 w-[52px] flex-none rounded-full transition-colors duration-300 ${on ? "bg-[#007aff]" : "bg-[#d4d7dd]"}`}
    >
      <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.25)] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${on ? "translate-x-5" : ""}`} />
    </button>
    <button type="button" onClick={() => set(true)} className={`flex items-center gap-2 text-[0.95rem] font-semibold tracking-[-0.02em] transition-colors ${on ? "text-[#0e0e10]" : "text-[#86868b]"}`}>
      <span className="whitespace-nowrap">6 Monate<span className="hidden sm:inline"> im Voraus</span></span>
      <span className="whitespace-nowrap rounded-[6px] bg-[#eaf3ff] px-2 py-0.5 text-[0.78rem] font-bold text-[#007aff]">−20 %</span>
    </button>
  </div>
);

const Items = ({ items }: { items: string[] }) => (
  <ul className="space-y-2.5">
    {items.map((it) => (
      <li key={it} className="flex items-start gap-2.5 text-[0.98rem] font-medium leading-snug tracking-[-0.015em] text-[#0e0e10]">
        <Tick />
        {it}
      </li>
    ))}
  </ul>
);
const Cta = ({ primary = false }: { primary?: boolean }) =>
  primary ? (
    <a href={CTA_HREF} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#007aff] px-6 text-[0.84rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
      Anfrage starten <ArrowRight size={16} strokeWidth={2.6} />
    </a>
  ) : (
    <a href={CTA_HREF} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-black/15 px-6 text-[0.84rem] font-black uppercase tracking-[0.12em] text-[#111111] transition-colors hover:bg-black/[0.04]">
      Anfrage starten
    </a>
  );

// standalone: the section is the whole /preise page, so the title is the page's h1 and the top padding sits closer to the nav
export default function PreiseV2({ standalone = false }: { standalone?: boolean }) {
  const reduce = useReducedMotion();
  const [prepay, setPrepay] = useState(false);
  const Title = standalone ? "h1" : "h2";
  const rise = (d = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.7, delay: d, ease: EASE } };

  // each card is written once and used by both the desktop grid and the phone chooser
  const startCard = (t: (typeof STARTS)[number], i: number, reveal: boolean, badge = true) => (
    <motion.div key={t.name} {...(reveal ? rise(0.05 + i * 0.05) : {})} className={`relative flex h-full flex-col rounded-[16px] bg-white p-3 ${CARD_HOVER}`}>
      {t.popular && badge && <PopularBadge />}
      {t.visual}
      <div className={`flex flex-1 flex-col px-4 pb-4 pt-6 ${GLOW}`}>
        <p className="text-[1.35rem] font-bold leading-[1.12] tracking-[-0.035em] text-[#0e0e10]">{t.name}</p>
        <p className="mt-1 text-[0.98rem] font-medium text-[#6b7280]">{t.note}</p>
        <div className="mt-5">
          <Price p={t.price} unit="€ einmalig" from />
        </div>
        <div className="my-6 h-px bg-black/[0.07]" />
        <Items items={t.items} />
      </div>
    </motion.div>
  );
  const tierCard = (t: Tier, i: number, reveal: boolean, badge = true) => (
    <motion.div
      key={t.name}
      {...(reveal ? rise(0.06 + i * 0.05) : {})}
      className={`relative flex h-full flex-col rounded-[16px] bg-white p-3 ${t.pick ? "group shadow-[0_0_0_2px_#007aff,0_30px_60px_-30px_rgba(0,122,255,0.35)] transition-shadow duration-500 hover:shadow-[0_0_0_2px_#007aff,0_36px_70px_-30px_rgba(0,122,255,0.5)]" : CARD_HOVER}`}
    >
      {t.pick && badge && <PopularBadge />}
      {t.visual}
      <div className={`flex flex-1 flex-col px-4 pb-4 pt-6 ${GLOW}`}>
        <p className="text-[1.35rem] font-bold leading-[1.12] tracking-[-0.035em] text-[#0e0e10]">{t.name}</p>
        <p className="mt-1 text-[0.98rem] font-medium text-[#6b7280]">{t.note}</p>
        <div className="mt-5">
          <MonthlyPrice p={t.price} prepay={prepay} />
        </div>
        {t.guarantee && (
          <p className="mt-3 text-[0.98rem] font-semibold tracking-[-0.015em] text-[#007aff]">
            {prepay ? "Deine 6 Monate starten erst mit deiner ersten Anfrage." : t.guarantee}
          </p>
        )}
        <div className="my-6 h-px bg-black/[0.07]" />
        {t.base && <p className="mb-3 text-[0.9rem] font-semibold text-[#6b7280]">{t.base}</p>}
        <Items items={t.items} />
        {t.fine && <p className="mt-4 text-[0.85rem] leading-snug text-[#6b7280]">{t.fine}</p>}
        <div className="mt-auto pt-7">
          <Cta primary={t.pick} />
        </div>
      </div>
    </motion.div>
  );
  const addonCard = (a: (typeof ADDONS)[number], i: number, reveal: boolean) => (
    <motion.div key={a.name} {...(reveal ? rise(0.06 + i * 0.05) : {})} className={`flex h-full flex-col rounded-[16px] bg-white p-3 ${CARD_HOVER}`}>
      {a.visual}
      <div className={`flex flex-1 flex-col px-4 pb-4 pt-6 ${GLOW}`}>
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-[1.35rem] font-bold tracking-[-0.035em] text-[#0e0e10]">{a.name}</p>
          {a.tag && <span className="rounded-[6px] bg-[#eaf3ff] px-2 py-0.5 text-[0.75rem] font-bold text-[#007aff]">{a.tag}</span>}
        </div>
        <p className="mt-1 text-[0.98rem] font-medium text-[#6b7280]">{a.note}</p>
        <div className="mt-5">
          <MonthlyPrice p={a.price} prepay={prepay} />
          {a.perVideo && (
            <p className="mt-3 text-[0.98rem] font-semibold tracking-[-0.02em] text-[#0e0e10]">
              Nur <span className="text-[#007aff]">{eur((num(a.price) * (prepay ? 1 - OFF : 1)) / 20)} € pro Video</span>
              <span className="font-medium text-[#6b7280]"> bei 20 Videos im Monat, Posts und Meta Ads inklusive.</span>
            </p>
          )}
        </div>
        <div className="my-6 h-px bg-black/[0.07]" />
        <Items items={a.items} />
        <p className="mt-4 text-[0.85rem] leading-snug text-[#6b7280]">Werbebudget ab 450 € im Monat, direkt an Meta.</p>
        <div className="mt-auto pt-7">
          <Cta />
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="preise" className={`relative bg-[#f5f5f7] text-[#0e0e10] ${standalone ? "pb-20 pt-14 md:pb-28 md:pt-20" : "py-20 md:py-28"}`}>
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        {/* phones: the heading stays in the page for search engines and screen readers, but takes no space */}
        <motion.div {...rise()} className="mx-auto max-w-[900px] text-center max-md:h-0 max-md:overflow-hidden">
          <Title className="text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.065em]">
            Unsere Preise<span className="text-[#007aff]">.</span>
          </Title>
          <p className="mx-auto mt-6 max-w-[48ch] text-[1.1rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">
            Einmal starten, dann ein Monatspaket für deine Website. Social kannst du dazubuchen.
          </p>
        </motion.div>

        {/* phones and tablets: how the price is made, at a glance; each tile jumps to its part */}
        <motion.div {...rise(0.02)} className="mt-9 hidden grid-cols-2 gap-2.5 md:grid lg:hidden">
          {[
            { n: "01", t: "Einmal starten", p: "ab 1.499 €", u: "einmalig", href: "#einmal" },
            { n: "02", t: "Monatspaket", p: "ab 99 €", u: "im Monat", href: "#monatlich" },
          ].map((x) => (
            <a key={x.n} href={x.href} className="flex flex-col justify-between rounded-[22px] bg-white p-5">
              <span className="text-[0.8rem] font-bold tabular-nums text-[#007aff]">{x.n}</span>
              <span className="mt-6 block">
                <span className="block text-[1.05rem] font-bold leading-tight tracking-[-0.03em] text-[#0e0e10]">{x.t}</span>
                <span className="mt-1.5 block text-[1.5rem] font-bold leading-none tracking-[-0.05em] text-[#0e0e10] tabular-nums">{x.p}</span>
                <span className="mt-1 block text-[0.8rem] font-semibold text-[#86868b]">{x.u}</span>
              </span>
            </a>
          ))}
          <a href="#social" className="col-span-2 flex items-center justify-between gap-4 rounded-[22px] border border-dashed border-black/15 px-5 py-4">
            <span>
              <span className="block text-[0.8rem] font-bold text-[#86868b]">Optional</span>
              <span className="block text-[1rem] font-bold tracking-[-0.03em] text-[#0e0e10]">+ Social &amp; Meta Ads</span>
            </span>
            <span className="text-right">
              <span className="block text-[1.05rem] font-bold tracking-[-0.04em] text-[#0e0e10] tabular-nums">ab 399 €</span>
              <span className="block text-[0.8rem] font-semibold text-[#86868b]">im Monat</span>
            </span>
          </a>
        </motion.div>

        {/* the three promises. Phones: one tile, three rows (number, promise). md+: one row of big numbers. */}
        <motion.ul {...rise(0.04)} aria-label="Unsere Versprechen" className="grid gap-3 md:hidden">
          <li className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#007aff] p-7 text-white">
            <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-[320px] w-[320px] rounded-full bg-white/[0.08]" />
            <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-[200px] w-[200px] rounded-full bg-white/[0.08]" />
            <span className="relative text-[0.72rem] font-black uppercase tracking-[0.2em] text-white/70">Unser Versprechen</span>
            <span className="relative mt-10 block">
              <span className="block text-[5.5rem] font-bold leading-[0.85] tracking-[-0.07em] tabular-nums">{PROMISES[0].n}</span>
              <span className="mt-5 block max-w-[20ch] text-[1.4rem] font-bold leading-[1.1] tracking-[-0.04em] text-white">{PROMISES[0].t}</span>
              <span className="mt-2 block max-w-[34ch] text-[0.95rem] font-medium leading-snug text-white/75">{PROMISES[0].s}</span>
            </span>
          </li>
          {PROMISES.slice(1).map(({ n, t, s: sub }) => (
            <li key={t} className="flex min-h-[190px] flex-col justify-between rounded-[28px] bg-white p-7">
              <span className="block text-[3.8rem] font-bold leading-[0.85] tracking-[-0.065em] text-[#0e0e10] tabular-nums">{n}</span>
              <span className="mt-6 block">
                <span className="block max-w-[26ch] text-[1.1rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#0e0e10]">{t}</span>
                <span className="mt-1.5 block max-w-[38ch] text-[0.9rem] font-medium leading-snug text-[#6b7280]">{sub}</span>
              </span>
            </li>
          ))}
        </motion.ul>
        <motion.ul {...rise(0.04)} className="mx-auto mt-14 hidden max-w-[1160px] border-y border-black/10 md:grid md:grid-cols-3">
          {PROMISES.map(({ n, t, s: sub }, i) => (
            <li key={t} className={`px-8 py-10 text-center ${i > 0 ? "border-l border-black/10" : ""}`}>
              <p className="text-[clamp(3.4rem,6vw,5rem)] font-bold leading-none tracking-[-0.065em] text-[#0e0e10] tabular-nums">
                {n}
              </p>
              <p className="mx-auto mt-4 max-w-[24ch] text-[1.08rem] font-semibold leading-snug tracking-[-0.025em] text-[#0e0e10]">{t}</p>
              <p className="mx-auto mt-1.5 max-w-[30ch] text-[0.92rem] font-medium leading-snug text-[#6b7280]">{sub}</p>
            </li>
          ))}
        </motion.ul>

        {/* one-off: three ways to start */}
        <div className="relative pt-10 md:pt-16">
          <span id="einmal" aria-hidden className="absolute top-[-28px]" />
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff] lg:hidden">Schritt 1</p>
          <p className="mt-1 text-[1.6rem] font-bold tracking-[-0.045em] text-[#0e0e10] lg:mt-0">
            Einmal starten<span className="text-[#007aff]">.</span>
          </p>
        </div>
        <Chooser
          className="lg:hidden"
          start={STARTS.findIndex((t) => t.popular)}
          tabs={STARTS.map((t) => ({ label: t.short ?? t.name, sub: `ab ${t.price} €`, popular: t.popular }))}
          render={(k) => startCard(STARTS[k], k, false, false)}
        />
        <div className="mt-5 hidden gap-4 lg:grid lg:grid-cols-3">{STARTS.map((t, i) => startCard(t, i, true))}</div>

        <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-14 md:pt-16">
          <span id="monatlich" aria-hidden className="absolute top-[-28px]" />
          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff] lg:hidden">Schritt 2</p>
            <p className="mt-1 text-[1.6rem] font-bold tracking-[-0.045em] text-[#0e0e10] lg:mt-0">
              Dann dein Monatspaket<span className="text-[#007aff]">.</span>
            </p>
          </div>
          <div className="hidden lg:block">
            <PrepaySwitch on={prepay} set={setPrepay} />
          </div>
        </div>
        <PrepayRow on={prepay} set={setPrepay} className="mt-5 lg:hidden" />
        <Chooser
          className="lg:hidden"
          start={TIERS.findIndex((t) => t.pick)}
          tabs={TIERS.map((t) => ({ label: t.short ?? t.name, sub: `${prepay ? eur(num(t.price) * (1 - OFF)) : t.price} € / Mon.`, popular: t.pick }))}
          render={(k) => tierCard(TIERS[k], k, false, false)}
        />
        <div className="mt-5 hidden gap-4 lg:grid lg:grid-cols-3">{TIERS.map((t, i) => tierCard(t, i, true))}</div>

        {/* add-ons; same switch, same state as above the monthly packages */}
        <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-14 md:pt-16">
          <span id="social" aria-hidden className="absolute top-[-28px]" />
          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff] lg:hidden">Optional</p>
            <p className="mt-1 text-[1.6rem] font-bold tracking-[-0.045em] text-[#0e0e10] lg:mt-0">
              Dazubuchen: Social &amp; Meta<span className="text-[#007aff]">.</span>
            </p>
            <p className="mt-1 text-[0.95rem] font-medium text-[#6b7280]">Auch ohne Website buchbar.</p>
          </div>
          <div className="hidden md:block">
            <PrepaySwitch on={prepay} set={setPrepay} />
          </div>
        </div>
        <PrepayRow on={prepay} set={setPrepay} className="mt-5 md:hidden" />
        <Chooser
          className="md:hidden"
          start={0}
          tabs={ADDONS.map((a) => ({ label: a.short ?? a.name, sub: `${prepay ? eur(num(a.price) * (1 - OFF)) : a.price} € / Mon.` }))}
          render={(k) => addonCard(ADDONS[k], k, false)}
        />
        <div className="mt-5 hidden gap-4 md:grid md:grid-cols-2">{ADDONS.map((a, i) => addonCard(a, i, true))}</div>

        <p className="mt-10 text-center text-[0.8rem] text-[#86868b]">Alle Preise netto zzgl. 19 % MwSt. Monatspakete mit 6 Monaten Mindestlaufzeit. Im Voraus: 6 Monate auf einmal, 20 % günstiger. Werbebudget immer extra, direkt an Google oder Meta.</p>
      </div>
    </section>
  );
}
