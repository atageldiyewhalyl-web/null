import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Camera, Plus } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

/*
 * "Unser Prozess." A static 5-week calendar, built in code after the Nano Banana draft.
 * No motion. Every mark explains itself in a small box on hover and keyboard focus (desktop).
 * Below 1024 px the board becomes the old homepage's process accordion (ProcessAccordion): six steps, one open at a time.
 */

const CTA_HREF = "#contact";

const WEEKS = ["Woche 1", "Woche 2", "Woche 3", "Woche 4", "Woche 5"];
const ROWS = ["Dein Teil", "Website &\nGoogle-Profil", "Google Ads &\nMeta Ads", "Blogartikel", "Reels &\nBeiträge", "Dreh vor Ort", "Monatsbericht"];

const LIVE_AT = 1.45; // website goes live in the middle of week 2 (week units, 0..5)
const pct = (w: number) => `${(w / 5) * 100}%`;

// what each mark means
const TIPS = {
  gespraech: { title: "Gespräch", text: "Wir lernen deinen Betrieb kennen und sagen dir ehrlich, was du brauchst und was nicht." },
  formular: { title: "Formular", text: "Ein Link mit Fragen zu deinem Betrieb, deinen Leistungen und deinen Kunden. Einmal ausfüllen, wann es dir passt. Daraus bauen wir alles." },
  freigabe1: { title: "Erste Freigabe", text: "Du siehst den Entwurf deiner Website und sagst uns, was passt und was wir ändern sollen." },
  freigabe2: { title: "Zweite Freigabe", text: "Ein letzter Blick auf die fertige Seite. Erst mit deinem Okay geht sie online." },
  aufbau: { title: "Aufbau, 7 Tage", text: "Wir bauen deine Website und richten dein Google-Unternehmensprofil ein. Live 7 Tage nach dem Formular." },
  live: { title: "Live", text: "Deine Website ist online und dein Google-Profil ist sichtbar. Ab jetzt können Kunden dich finden und anfragen." },
  ads: { title: "Google Ads & Meta Ads", text: "Wir richten deine Werbung ein und betreuen sie laufend. Werbebudget ab 450 € im Monat pro Plattform, direkt an Google oder Meta. Je nach Paket." },
  blog: { title: "Blogartikel", text: "Neue Artikel zu Fragen, die deine Kunden bei Google stellen. Bis zu 8 im Monat, ab dem SEO-Paket." },
  reels: { title: "Reels & Beiträge", text: "Kurze Videos und Grafiken für Instagram und Facebook. Bis zu 20 Videos und 12 Grafiken im Monat, im Content-Paket." },
  dreh: { title: "Dreh vor Ort", text: "Nach dem Formular filmen wir bei dir vor Ort. Daraus schneiden wir deine Reels, danach drehen wir jeden Monat neu. Im Content-Paket." },
  bericht: { title: "Monatsbericht", text: "Am Monatsende zeigen wir dir echte Zahlen: Besucher, Anfragen und was die Werbung gebracht hat. In jedem Paket." },
} as const;
type TipId = keyof typeof TIPS | `${"blog" | "reels"}-${number}`;

const OpenCtx = createContext<{ open: string | null; setOpen: (id: string | null) => void }>({ open: null, setOpen: () => {} });

export default function AblaufV2() {
  const [open, setOpen] = useState<string | null>(null);

  // tap outside or Escape closes the box
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest("[data-tip]")) setOpen(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <OpenCtx.Provider value={{ open, setOpen }}>
      <section id="ablauf" className="relative bg-white py-20 text-[#0e0e10] md:py-28">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.065em]">
                Unser Prozess<span className="text-[#007aff]">.</span>
              </h2>
              <p className="mt-6 max-w-[52ch] text-[1.1rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">
                Du führst ein Gespräch, füllst ein Formular aus und gibst zwei Freigaben. Den Rest machen wir, Woche für Woche.
              </p>
            </div>
            <a href={CTA_HREF} className="hidden w-max border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55 lg:block">
              Anfrage starten
            </a>
          </div>
          <p className="mt-14 hidden text-[0.88rem] font-medium text-[#6b7280] lg:block">Fahr mit der Maus über einen Eintrag, um mehr zu erfahren.</p>
        </div>

        {/* phones and tablets: the step-by-step accordion from the old homepage */}
        <ProcessAccordion />

        {/* desktop: the board */}
        <div className="mx-auto mt-4 hidden w-full max-w-[1360px] px-8 lg:block">
          <div>
            <div className="relative min-w-[900px] select-none">
              {/* header */}
              <div className="grid h-[72px] grid-cols-[190px_repeat(5,1fr)] border-b-[1.5px] border-[#d4d7dd] md:grid-cols-[230px_repeat(5,1fr)]">
                <div />
                {WEEKS.map((w) => (
                  <div key={w} className="flex items-center justify-center border-l-[1.5px] border-[#d4d7dd] text-[1.45rem] font-bold tracking-[-0.035em] md:text-[1.6rem]">
                    {w}
                  </div>
                ))}
              </div>

              {/* rows */}
              {ROWS.map((r) => (
                <div key={r} className="grid h-[96px] grid-cols-[190px_repeat(5,1fr)] border-b-[1.5px] border-[#d4d7dd] md:grid-cols-[230px_repeat(5,1fr)]">
                  <div className="flex items-center whitespace-pre-line pr-3 text-[1.3rem] font-bold leading-[1.12] tracking-[-0.03em] md:text-[1.45rem]">{r}</div>
                  {WEEKS.map((w) => (
                    <div key={w} className="border-l-[1.5px] border-[#d4d7dd]" />
                  ))}
                </div>
              ))}

              {/* marks, positioned in week units over the 5 week columns */}
              <div className="pointer-events-none absolute bottom-0 right-0 top-[72px] left-[190px] md:left-[230px]">
                <Row i={0}>
                  <Step x={0.27} id="gespraech" />
                  <Step x={0.73} id="formular" />
                  <Step x={1.27} id="freigabe1" label="Freigabe" />
                  <Step x={1.73} id="freigabe2" label="Freigabe" />
                </Row>

                <Row i={1}>
                  <Tip
                    id="aufbau"
                    className="absolute top-1/2 flex h-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-[#007aff] text-[1.15rem] font-bold tracking-[-0.02em] text-white"
                    style={{ left: pct(0.06), width: pct(LIVE_AT - 0.08) }}
                    place="below"
                  >
                    Aufbau, 7 Tage
                  </Tip>
                  <Tip id="live" className="absolute top-1/2 flex -translate-y-1/2 items-center gap-3" style={{ left: pct(LIVE_AT) }} place="below">
                    <span className="block bg-[#0e0e10] py-1.5 pl-3 pr-6 text-[1rem] font-black tracking-[0.04em] text-white [clip-path:polygon(0_0,100%_0,80%_50%,100%_100%,0_100%)]">
                      LIVE
                    </span>
                    <Laptop />
                  </Tip>
                </Row>

                <Row i={2}>
                  <Tip id="ads" className="absolute top-1/2 h-[28px] -translate-y-1/2" style={{ left: pct(LIVE_AT), right: 0 }} place="below" anchor={pct(0.6)}>
                    <span className="absolute left-0 right-0 top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[#007aff]" />
                  </Tip>
                </Row>

                <Row i={3}>
                  {[1.5, 2.5, 3.5, 4.5].map((x) => (
                    <At key={x} x={x}>
                      <Tip id={`blog-${x}`} tip="blog" align={x > 4 ? "end" : "center"}><Doc /></Tip>
                    </At>
                  ))}
                </Row>

                <Row i={4}>
                  {[2.5, 3.5, 4.5].map((x) => (
                    <At key={x} x={x}>
                      <Tip id={`reels-${x}`} tip="reels" className="flex gap-2" align={x > 4 ? "end" : "center"}><Phone /><Phone /></Tip>
                    </At>
                  ))}
                </Row>

                <Row i={5}>
                  <At x={1.5}>
                    <Tip id="dreh">
                      <span className="grid h-[50px] w-[58px] place-items-center rounded-[10px] bg-[#0e0e10] text-white">
                        <Camera size={30} strokeWidth={2.2} />
                      </span>
                    </Tip>
                  </At>
                </Row>

                <Row i={6}>
                  <At x={4.5}>
                    <Tip id="bericht" align="end"><Report /></Tip>
                  </At>
                </Row>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1360px] px-4 md:px-8">
          <p className="max-w-[80ch] text-[0.82rem] leading-snug text-[#6b7280]">
            Je nach Paket: Website im Start, Blog ab SEO, Google Ads im Paket SEO & Google Ads, Meta Ads mit Meta oder Content, Reels und Dreh mit Content, Bericht in jedem Paket. Live 7 Tage nach dem Onboarding, wenn Inhalte und Freigaben zügig kommen.
          </p>
        </div>
      </section>
    </OpenCtx.Provider>
  );
}

/* ---------- phones and tablets: the process accordion from the old homepage (Halyl, 11 Nov 2026) ---------- */
// Same six steps, titles and design as the old site's "Prozess" section; the texts switched from "Sie" to "du" like the rest of the site.
const STEPS = [
  { n: "01", title: "Onboarding, Discovery & Strategie", text: "Wir lernen dein Unternehmen, deine Zielgruppe, deine Ziele und deine aktuelle Ausgangslage kennen. Daraus entwickeln wir eine klare Strategie für Sichtbarkeit, Vertrauen und qualifizierte Anfragen." },
  { n: "02", title: "Struktur, Layout & Freigabe", text: "Unser Team erstellt die erste Seitenstruktur, das Layout und die visuelle Richtung. Du siehst früh, wie dein Auftritt aufgebaut wird, gibst Feedback und bestätigst die Grundlage." },
  { n: "03", title: "Content, Design & Markenwirkung", text: "Wir entwickeln Texte, Bilder, Content-Ideen und das finale Design. Deine Expertise wird klar verständlich, professionell und überzeugend inszeniert." },
  { n: "04", title: "Technische Umsetzung & Fundament", text: "Wir setzen die Website sauber um: responsiv, schnell, stabil und suchmaschinenfreundlich. Struktur, Performance, Tracking und SEO-Grundlagen werden direkt mitgedacht." },
  { n: "05", title: "Review, Feinschliff & Zufriedenheit", text: "Gemeinsam prüfen wir die fertige Website, optimieren Inhalte, Design und Nutzerführung und nehmen letzte Anpassungen vor. Erst wenn alles stimmig ist, geht der Auftritt live." },
  { n: "06", title: "Wachstum, SEO & laufende Betreuung", text: "Nach dem Launch betreuen wir dein System weiter: SEO, Wartung, technische Pflege, Content-Optimierung und auf Wunsch Google Ads Kampagnen jeden Monat." },
];

function ProcessAccordion() {
  return (
    <div className="mx-auto mt-10 w-full max-w-[1360px] px-4 md:px-8 lg:hidden">
      <Accordion.Root type="single" defaultValue="01" collapsible className="w-full">
        {STEPS.map((s) => (
          <Accordion.Item key={s.n} value={s.n} className="border-b border-[#d8dde7] first:border-t">
            <Accordion.Header className="flex">
              <Accordion.Trigger className="group flex min-h-[5rem] flex-1 cursor-pointer items-start justify-between gap-4 py-4 text-left text-[#0e0e10]/[0.18] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#007aff] data-[state=open]:min-h-[5.5rem] data-[state=open]:text-[#007aff] md:min-h-[5.85rem]">
                <span className="flex flex-1 items-start gap-4 md:gap-7">
                  <span className="mt-2 min-w-8 text-xs font-bold tracking-[-0.02em] text-[#0e0e10]/75">{s.n}</span>
                  <span className="-mt-1 text-left text-[1.9rem] font-bold uppercase leading-[0.96] tracking-[-0.04em] md:text-[2.55rem]">{s.title}</span>
                </span>
                <Plus aria-hidden className="mt-2 h-5 w-5 shrink-0 text-current transition-transform duration-200 group-data-[state=open]:rotate-45" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <p className="pb-7 pl-12 text-[1rem] font-medium leading-relaxed tracking-[-0.02em] text-[#86868b] md:pl-[3.75rem] md:pr-20">{s.text}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <a
        href={CTA_HREF}
        className="mt-10 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#007aff] px-9 text-[1rem] font-bold tracking-[-0.025em] text-white no-underline transition-transform hover:-translate-y-0.5"
      >
        <span aria-hidden>→</span>
        Erstgespräch planen
      </a>
    </div>
  );
}

/* ---------- pieces ---------- */

/** A mark that explains itself: hover / focus on desktop, tap on phones. */
function Tip({
  id,
  tip,
  children,
  className = "",
  style,
  place = "above",
  align = "center",
  anchor,
}: {
  id: TipId;
  tip?: keyof typeof TIPS;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  place?: "above" | "below";
  align?: "center" | "end";
  anchor?: string; // horizontal anchor of the box inside wide marks (e.g. the ads line)
}) {
  const { open, setOpen } = useContext(OpenCtx);
  const t = TIPS[(tip ?? id) as keyof typeof TIPS];
  const isOpen = open === id;
  const boxId = `ablauf-tip-${id}`;

  const pos: CSSProperties = {
    ...(place === "above" ? { bottom: "calc(100% + 12px)" } : { top: "calc(100% + 12px)" }),
    ...(align === "end" ? { right: -8 } : { left: anchor ?? "50%", translate: "-50% 0" }),
  };

  return (
    <button
      type="button"
      data-tip
      aria-describedby={boxId}
      aria-expanded={isOpen}
      onClick={() => setOpen(isOpen ? null : id)}
      className={`group pointer-events-auto cursor-help rounded-[6px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-4 ${className} ${isOpen ? "z-40" : "hover:z-40 focus-visible:z-40"}`}
      style={{ position: className.includes("absolute") ? undefined : "relative", ...style }}
    >
      {children}
      <span
        id={boxId}
        role="tooltip"
        className={`pointer-events-none absolute z-50 block w-[236px] rounded-[8px] md:w-[270px] border border-black/10 bg-white p-4 text-left text-[#0e0e10] shadow-[0_18px_48px_rgba(15,23,42,0.13)] transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
        style={pos}
      >
        <span className="block text-[1rem] font-bold tracking-[-0.02em]">{t.title}</span>
        <span className="mt-1.5 block whitespace-normal text-[0.9rem] font-medium leading-[1.4] tracking-[-0.01em] text-[#424245]">{t.text}</span>
      </span>
    </button>
  );
}

function Row({ i, children }: { i: number; children: ReactNode }) {
  return (
    <div className="absolute left-0 right-0 h-[96px] has-[[data-tip]:hover]:z-40 has-[[data-tip]:focus-visible]:z-40 has-[[aria-expanded=true]]:z-40" style={{ top: i * 96 }}>
      {children}
    </div>
  );
}

function At({ x, children }: { x: number; children: ReactNode }) {
  return (
    <div className="absolute top-1/2 has-[[data-tip]:hover]:z-40 has-[[data-tip]:focus-visible]:z-40 has-[[aria-expanded=true]]:z-40" style={{ left: pct(x), translate: "-50% -50%" }}>
      {children}
    </div>
  );
}

function Step({ x, id, label }: { x: number; id: keyof typeof TIPS; label?: string }) {
  return (
    <At x={x}>
      <Tip id={id} className="flex flex-col items-center px-1" place="below">
        <span className="h-[26px] w-[26px] rounded-full border-[3px] border-[#0e0e10] transition-colors group-hover:bg-[#007aff]/15" />
        <span className="mt-1.5 whitespace-nowrap text-[0.95rem] font-semibold tracking-[-0.01em]">{label ?? TIPS[id].title}</span>
      </Tip>
    </At>
  );
}

function Laptop() {
  return (
    <span className="block w-[70px]">
      <span className="block h-[44px] rounded-t-[5px] border-[2.5px] border-b-0 border-[#0e0e10] bg-white p-1.5">
        <span className="block h-[9px] w-full rounded-[2px] bg-[#007aff]" />
        <span className="mt-1 flex gap-1">
          <span className="block h-[16px] flex-1 rounded-[2px] bg-[#007aff]/25" />
          <span className="block flex-1 space-y-[3px] pt-[2px]">
            <span className="block h-[3px] rounded bg-[#0e0e10]/60" />
            <span className="block h-[3px] w-[70%] rounded bg-[#0e0e10]/30" />
          </span>
        </span>
      </span>
      <span className="mx-[-6px] block h-[5px] rounded-b-[3px] bg-[#0e0e10]" />
    </span>
  );
}

function Doc() {
  return (
    <span className="relative block h-[52px] w-[42px] rounded-[4px] bg-[#f0f1f3] [clip-path:polygon(0_0,72%_0,100%_22%,100%_100%,0_100%)]">
      <span className="absolute right-0 top-0 h-[12px] w-[12px] bg-[#c9ccd2] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      <span className="absolute left-[8px] right-[8px] top-[20px] block space-y-[4px]">
        <span className="block h-[3px] rounded bg-[#9ca1a9]" />
        <span className="block h-[3px] rounded bg-[#9ca1a9]" />
        <span className="block h-[3px] w-[70%] rounded bg-[#9ca1a9]" />
      </span>
    </span>
  );
}

function Phone() {
  return <span className="block h-[58px] w-[30px] rounded-[7px] border-[2.5px] border-[#0e0e10] bg-[#e4e6ea]" />;
}

function Report() {
  const bars = [0.4, 0.65, 0.5, 1];
  return (
    <span className="block h-[56px] w-[46px] rounded-[4px] bg-[#f0f1f3] p-[7px]">
      <span className="block h-[3px] w-[70%] rounded bg-[#9ca1a9]" />
      <span className="mt-[3px] block h-[3px] w-[50%] rounded bg-[#9ca1a9]" />
      <span className="mt-[5px] flex h-[24px] items-end gap-[3px]">
        {bars.map((h, i) => (
          <span key={i} className="block flex-1 rounded-[1px] bg-[#007aff]" style={{ height: `${h * 100}%` }} />
        ))}
      </span>
    </span>
  );
}
