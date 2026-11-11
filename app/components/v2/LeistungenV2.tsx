import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, MonitorSmartphone } from "lucide-react";
import { NavBar, SERVICE_NAV, ServiceMark } from "./HeroV2";
import FooterV2 from "./FooterV2";
import { ADDONS, STARTS, TIERS } from "./PreiseV2";
import { SERVICE, SERVICES } from "./links";

/*
 * /leistungen: every service on one page, so a visitor can pick (draft, noindex like the rest of v2).
 * Headlines and results come from the service pages (app/routes/v2-*.tsx); each result keeps the source
 * written there. Prices are read from the price list (PreiseV2: TIERS, ADDONS, STARTS), so they never drift.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const price = (name: string, list: { name: string; price: string }[]) => list.find((t) => t.name === name)?.price ?? "";

// one big background logo per card; Google Ads uses the symbol without its wordmark
const BG_LOGO: Record<string, string> = { [SERVICE.ads]: "/assets/v2/brands/google-ads-mark.svg" };

type Card = {
  href: string;
  muted: string;
  title: string;
  text: string;
  stat: string;
  statText: string;
  price: string;
  per: string;
  tint: string;
  span: string;
};

const CARDS: Card[] = [
  {
    href: SERVICE.web,
    muted: "Wer dich findet,",
    title: "fragt dich an",
    text: "Eine Website, die Besucher zur Anfrage führt: per Formular, Anruf oder WhatsApp.",
    stat: "7 Tage",
    statText: "bis deine Website live ist",
    price: price("Onepager", STARTS),
    per: "einmalig",
    tint: "#e9f2ff",
    span: "lg:col-span-3",
  },
  {
    href: SERVICE.seo,
    muted: "Wer sucht,",
    title: "findet dich",
    text: "Gefunden werden, wenn jemand in deiner Stadt sucht, was du anbietest.",
    stat: "Seite 1",
    statText: "bei Google für „Umzugsunternehmen Mannheim“, Herkules Umzüge, Oktober 2026",
    price: price("SEO", TIERS),
    per: "im Monat",
    tint: "#eef3fb",
    span: "lg:col-span-3",
  },
  {
    href: SERVICE.ads,
    muted: "Anzeigen, die",
    title: "Anfragen bringen",
    text: "Ganz oben stehen, genau dann, wenn jemand sucht. Gemessen bis zur Anfrage.",
    stat: "2.491",
    statText: "Routenanfragen in 3 Monaten, Waschbar, August bis November 2026",
    price: price("SEO & Google Ads", TIERS),
    per: "im Monat, mit SEO",
    tint: "#e9f2ff",
    span: "lg:col-span-2",
  },
  {
    href: SERVICE.ai,
    muted: "Wer fragt,",
    title: "hört deinen Namen",
    text: "Von ChatGPT, Claude und Gemini empfohlen werden, wenn Kunden nach einem Betrieb fragen.",
    stat: "392",
    statText: "Einblendungen in Googles KI-Antworten, Herkules Umzüge, August 2026",
    price: price("SEO", TIERS),
    per: "im Monat, im SEO-Paket",
    tint: "#f1eefc",
    span: "lg:col-span-2",
  },
  {
    href: SERVICE.content,
    muted: "Wer dich sieht,",
    title: "fragt dich an",
    text: "Videos und Posts, die zeigen, was du kannst. Für Instagram, Facebook und deine Website.",
    stat: "19",
    statText: "Videos in zwei Wochen für Bergstone Keramiksan, Oktober bis November 2026",
    price: price("Content & Meta Ads", ADDONS),
    per: "im Monat",
    tint: "#fdf1f4",
    span: "md:col-span-2 lg:col-span-2",
  },
];

function ServiceCard({ c, n }: { c: Card; n: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const nav = SERVICE_NAV.find((s) => s.href === c.href)!;
  const big = c.span.includes("col-span-3");
  return (
    <motion.a
      ref={ref}
      href={c.href}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: reduce ? 0 : (n % 3) * 0.07, ease: EASE }}
      className={`group relative flex flex-col overflow-hidden rounded-[24px] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8 ${c.span}`}
      style={{ background: c.tint }}
    >
      {/* the platform logo, big and faded in the corner (same treatment as the step cards on the service pages) */}
      <span aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-[#007aff] opacity-[0.07] md:-right-16 md:-top-16 md:h-64 md:w-64" />
      {nav.logos.length === 0 ? (
        <MonitorSmartphone aria-hidden strokeWidth={1.6} className="pointer-events-none absolute -right-8 -top-6 h-44 w-44 rotate-[-12deg] text-[#007aff] opacity-[0.13] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105 md:-right-10 md:h-56 md:w-56" />
      ) : (
        <img src={BG_LOGO[c.href] ?? nav.logos[0]} alt="" aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rotate-[-12deg] select-none object-contain opacity-[0.14] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105 md:-right-12 md:-top-12 md:h-56 md:w-56" />
      )}
      <div className="relative flex items-center justify-between gap-4">
        <span className="flex items-center gap-3">
          <ServiceMark logos={nav.logos} />
          <span className="text-[0.78rem] font-black uppercase tracking-[0.16em] text-[#0e0e10]">{nav.label}</span>
        </span>
        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white text-[#0e0e10] transition-colors duration-300 group-hover:bg-[#007aff] group-hover:text-white">
          <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden />
        </span>
      </div>

      <h2 className={`relative mt-8 font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10] ${big ? "text-[clamp(2.1rem,3.6vw,3.4rem)]" : "text-[clamp(1.9rem,2.6vw,2.5rem)]"}`}>
        <span className="text-[#0e0e10]/35">{c.muted}</span> {c.title}
        <span className="text-[#007aff]">.</span>
      </h2>
      <p className="relative mt-4 max-w-[44ch] text-[1.02rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#424245]">{c.text}</p>

      <div className="relative mt-auto pt-10">
        <div className="flex items-end gap-3 border-t border-black/[0.08] pt-5">
          <span className="whitespace-nowrap text-[clamp(2rem,3vw,2.6rem)] font-bold leading-none tracking-[-0.06em] tabular-nums text-[#0e0e10]">{c.stat}</span>
          <span className="pb-0.5 text-[0.86rem] font-medium leading-[1.35] text-[#6b7280]">{c.statText}</span>
        </div>
        <p className="mt-5 text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">
          ab <span className="text-[1.15rem] font-bold">{c.price} €</span> <span className="font-medium text-[#6b7280]">{c.per}, netto</span>
        </p>
      </div>
    </motion.a>
  );
}

export default function LeistungenV2() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } });

  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} current={SERVICES} />
      </div>
      <main className="bg-white text-[#0e0e10]">
        <section className="pb-24 pt-24 md:pb-32 lg:pt-16">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <div className="mx-auto max-w-[1100px] text-center [container-type:inline-size]">
              <motion.p {...rise(0)} className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Leistungen</motion.p>
              {/* one line at every width: the size follows the column (container query) */}
              <motion.h1 {...rise(0.06)} className="mt-5 whitespace-nowrap text-[min(8cqw,5.6rem)] font-bold leading-[0.95] tracking-[-0.07em]">
                <span className="text-[#0e0e10]/30">Alles, was</span> Anfragen bringt<span className="text-[#007aff]">.</span>
              </motion.h1>
              <motion.p {...rise(0.14)} className="mx-auto mt-6 max-w-[46ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245] md:text-[1.2rem]">
                Fünf Leistungen, ein System. Nimm, was du gerade brauchst, oder kombinier sie. Jeden Monat siehst du, was es gebracht hat.
              </motion.p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-6">
              {CARDS.map((c, n) => <ServiceCard key={c.href} c={c} n={n} />)}
            </div>
            <p className="mt-5 text-center text-[0.85rem] font-medium text-[#86868b]">
              Alle Preise netto. Werbebudget für Google und Meta zahlst du direkt an die Plattform.{" "}
              <a href="/preise" className="underline underline-offset-2 hover:text-[#0e0e10]">Alle Preise ansehen</a>
            </p>
          </div>
        </section>

      </main>
      <FooterV2 onHome={false} />
    </>
  );
}
