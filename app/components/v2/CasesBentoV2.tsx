import { ArrowUpRight } from "lucide-react";
import { REFS } from "./links";

/*
 * "Ausgewählte Arbeiten." Four best cases as a bento (wide/narrow, narrow/wide),
 * after the systrastudios.de "Projekte" layout. All cases live on the Referenzen page.
 * Scene images: Higgsfield Nano Banana scenes built from real screenshots / real ads of each client.
 * Numbers come from our monthly reports (see CasesV2.tsx header for sources).
 */

const REFS_HREF = REFS;

type Tile = {
  slug: string;
  client: string;
  place: string;
  services: string;
  stat: string; // bold part of the right chip
  statRest: string;
  headline: string;
  img: string;
  alt: string;
  wide: boolean;
  page?: string; // its own reference page, if it has one
};

const B = "/assets/v2/bento";

const TILES: Tile[] = [
  {
    slug: "waschbar",
    client: "Waschbar",
    place: "Heidelberg & Ludwigshafen",
    services: "Website & Ads",
    stat: "2.491",
    statRest: "Routenanfragen in 3 Monaten",
    headline: "Aus Google-Suchen werden Besuche im Salon.",
    img: `${B}/waschbar.webp`,
    alt: "Laptop mit der Waschbar-Website in einem Waschsalon",
    wide: true,
    page: "/referenzen/waschbar",
  },
  {
    slug: "orchidee",
    client: "Pflegedienst Orchidee",
    place: "Koblenz",
    services: "Meta Ads",
    stat: "41",
    statRest: "Bewerbungen in 3 Wochen",
    headline: "Pflegekräfte bewerben sich, statt gesucht zu werden.",
    img: `${B}/orchidee.webp`,
    alt: "Smartphone mit einer Instagram-Anzeige von Pflegedienst Orchidee",
    wide: false,
    page: "/referenzen/orchidee",
  },
  {
    slug: "bergstone",
    client: "Bergstone Keramiksan",
    place: "Ludwigshafen",
    services: "Reels & Meta Ads",
    stat: "36.757",
    statRest: "Menschen erreicht",
    headline: "Reels, die zeigen, wie die Platten wirklich aussehen.",
    img: `${B}/bergstone.webp`,
    alt: "Drei Smartphones mit Instagram-Reels von Bergstone Keramiksan",
    wide: false,
    page: "/referenzen/bergstone",
  },
  {
    slug: "treu",
    client: "Treu Haustechnik",
    place: "Mannheim",
    services: "Website & SEO",
    stat: "Jede Woche",
    statRest: "ein neuer Blogartikel",
    headline: "Ein Meisterbetrieb, der online auch so aussieht.",
    img: `${B}/treu.webp`,
    alt: "Laptop mit der Website von Treu Haustechnik in einem Technikraum mit Wärmepumpe",
    wide: true,
    page: "/referenzen/treu",
  },
];

export default function CasesBentoV2() {
  return (
    <section id="faelle" className="relative bg-white py-20 text-[#0e0e10] md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
              Ausgewählte Arbeiten<span className="text-[#007aff]">.</span>
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1.08rem] font-medium leading-[1.42] tracking-[-0.02em] text-[#424245]">
              Vier Betriebe, echte Zahlen aus unseren Monatsberichten.
            </p>
          </div>
          <a href={REFS_HREF} className="w-max border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
            Alle Referenzen
          </a>
        </div>

        {/* phones: a 2-column bento. Wide cases span both columns, narrow ones sit side by side.
            The result is written on the picture, so each tile says one thing. */}
        <div className="mt-10 grid grid-cols-2 gap-2.5 md:hidden">
          {TILES.map((t) => (
            <a
              key={t.slug}
              href={t.page ?? `${REFS_HREF}#${t.slug}`}
              className={`relative block overflow-hidden rounded-[22px] bg-[#eef0f3] ${t.wide ? "col-span-2 aspect-[4/3.4]" : "col-span-1 aspect-[3/4.3]"}`}
            >
              <img src={t.img} alt={t.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,rgba(14,14,16,0)_0%,rgba(14,14,16,0.72)_100%)]" />
              <span aria-hidden className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#0e0e10]">
                <ArrowUpRight size={16} strokeWidth={2.4} />
              </span>
              <div className={`absolute inset-x-0 bottom-0 text-white ${t.wide ? "p-5" : "p-4"}`}>
                <p className={`font-bold leading-none tracking-[-0.05em] text-white ${t.wide ? "text-[2.4rem]" : "text-[1.9rem]"}`}>
                  {t.stat}
                </p>
                <p className={`mt-1.5 font-semibold leading-snug tracking-[-0.015em] text-white/90 ${t.wide ? "text-[0.95rem]" : "text-[0.82rem]"}`}>{t.statRest}</p>
                <p className="mt-2.5 text-[0.66rem] font-black uppercase tracking-[0.14em] text-white/70">{t.client}</p>
              </div>
            </a>
          ))}
        </div>

        {/* md+: the bento grid with headlines */}
        <div className="mt-16 hidden md:grid md:grid-cols-12 md:gap-x-4 md:gap-y-16">
          {TILES.map((t) => (
            <a
              key={t.slug}
              href={t.page ?? `${REFS_HREF}#${t.slug}`}
              className={`group block ${t.wide ? "md:col-span-7" : "md:col-span-5"}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-[#eef0f3] md:aspect-auto md:h-[clamp(340px,34vw,480px)]">
                <img
                  src={t.img}
                  alt={t.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-start gap-3 sm:inset-x-4 sm:bottom-4 md:justify-between">
                  <span className="hidden whitespace-nowrap rounded-[6px] bg-white/95 px-3 py-1.5 text-[0.82rem] font-semibold tracking-[-0.01em] text-[#0e0e10] md:inline">
                    {t.services}
                  </span>
                  <span className="whitespace-nowrap rounded-[6px] bg-white/95 px-2.5 py-1.5 text-[0.78rem] font-semibold tracking-[-0.01em] text-[#424245] md:px-3 md:text-[0.82rem]">
                    <span className="font-bold text-[#0e0e10]">{t.stat}</span> {t.statRest}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 md:mt-5 md:gap-6">
                <div>
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                    {t.client} · {t.place}
                  </p>
                  <h3 className="mt-2 max-w-[30ch] text-[clamp(1.15rem,1.9vw,1.6rem)] font-semibold leading-[1.2] tracking-[-0.035em]">
                    {t.headline}
                  </h3>
                </div>
                <span className="mt-1 grid h-11 w-11 flex-none place-items-center rounded-full border border-black/10 text-[#0e0e10] transition-colors duration-300 group-hover:border-[#0e0e10] group-hover:bg-[#0e0e10] group-hover:text-white">
                  <ArrowUpRight size={18} strokeWidth={2.2} />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 md:mt-16">
          <a
            href={REFS_HREF}
            className="inline-flex min-h-12 w-full md:w-auto items-center justify-center gap-3 rounded-full bg-[#007aff] px-6 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
          >
            Alle Referenzen ansehen
          </a>
        </div>
      </div>
    </section>
  );
}
