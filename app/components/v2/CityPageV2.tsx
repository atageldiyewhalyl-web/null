import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, MapPin, Plus } from "lucide-react";
import { NavBar, Orbit, PROOFS, type Ring } from "./HeroV2";
import WasserturmV2 from "./WasserturmV2";
import FrankfurtSkylineV2 from "./FrankfurtSkylineV2";
import HeidelbergV2 from "./HeidelbergV2";
import { BerlinV2, DuesseldorfV2, HamburgV2, KoelnV2, MuenchenV2, StuttgartV2 } from "./CityLandmarks";
import GoogleMap from "./GoogleMap";
import CaseTile from "./CaseTile";
import WebsiteCheckTeaserV2 from "./WebsiteCheckTeaserV2";
import ClientShowcase from "./ClientShowcase";
import FaqV2 from "./FaqV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { PackageSection, WebPackage } from "./ServiceV2";
import { ScrollVideo } from "./ExplainerV2";
import { ADDONS, STARTS, TIERS } from "./PreiseV2";
import { CASE_LIST } from "./caseList";
import { SERVICE, SERVICES } from "./links";
import { CITIES, SERVICE_LABEL, SERVICE_SLUG, type City, type CityData, type ServiceKey, type StepArtKind } from "./cities";

// the drawn landmark in the middle of each city's hero
export const LANDMARKS: Record<NonNullable<CityData["landmark"]>, (p: { className?: string }) => ReactNode> = {
  wasserturm: WasserturmV2,
  frankfurt: FrankfurtSkylineV2,
  heidelberg: HeidelbergV2,
  berlin: BerlinV2,
  hamburg: HamburgV2,
  muenchen: MuenchenV2,
  koeln: KoelnV2,
  stuttgart: StuttgartV2,
  duesseldorf: DuesseldorfV2,
};

/*
 * Each city's own drawn map (placeholder until the visitor allows Google Maps, and the small maps in the drawings).
 * 640 x 460, not to scale; places only roughly where they are. mini: the three towns shown in the small "area" drawing.
 */
type AreaMapData = {
  aria: string;
  rivers: Array<{ d: string; w: number; label?: [string, number, number] }>;
  hills?: Array<{ d: string; label?: [string, number, number] }>;
  towns: Array<[string, number, number, "start" | "end" | "middle"]>;
  centre: [number, number];
  extra?: "quadrate" | "skyline" | "bridge";
  mini: [string, string, string];
};
const MAPS: Record<string, AreaMapData> = {
  mannheim: {
    aria: "Karte: Mannheim zwischen Rhein und Neckar, mit Ludwigshafen, Heidelberg, Viernheim, Weinheim, Ladenburg und Schwetzingen",
    rivers: [
      { d: "M150 470 C 190 400, 150 340, 190 280 S 230 170, 200 110 S 170 20, 210 -10", w: 22, label: ["Rhein", 160, 440] },
      { d: "M640 340 C 580 330, 540 300, 500 250 S 410 200, 350 190 S 260 175, 214 160", w: 14, label: ["Neckar", 560, 300] },
    ],
    towns: [
      ["Ludwigshafen", 118, 268, "end"],
      ["Frankenthal", 112, 104, "end"],
      ["Lampertheim", 300, 54, "middle"],
      ["Viernheim", 448, 124, "middle"],
      ["Weinheim", 548, 66, "middle"],
      ["Ladenburg", 452, 214, "middle"],
      ["Heidelberg", 540, 358, "middle"],
      ["Schwetzingen", 352, 412, "middle"],
    ],
    centre: [278, 230],
    extra: "quadrate",
    mini: ["Ludwigshafen", "Viernheim", "Heidelberg"],
  },
  frankfurt: {
    aria: "Karte: Frankfurt am Main, mit Offenbach, Bad Homburg, Oberursel, Eschborn, Bad Vilbel, Neu-Isenburg und Hanau",
    rivers: [{ d: "M-10 300 C 110 292, 200 246, 300 258 S 470 306, 560 262 S 620 230, 650 236", w: 18, label: ["Main", 70, 330] }],
    hills: [{ d: "M-10 90 C 80 40, 200 30, 300 10 L 300 -10 L -10 -10 Z", label: ["Taunus", 60, 40] }],
    towns: [
      ["Bad Homburg", 318, 74, "middle"],
      ["Oberursel", 196, 104, "middle"],
      ["Eschborn", 150, 210, "end"],
      ["Bad Vilbel", 470, 130, "middle"],
      ["Offenbach", 470, 318, "middle"],
      ["Neu-Isenburg", 318, 396, "middle"],
      ["Hanau", 600, 186, "middle"],
    ],
    centre: [318, 244],
    extra: "skyline",
    mini: ["Offenbach", "Bad Homburg", "Eschborn"],
  },
  heidelberg: {
    aria: "Karte: Heidelberg am Neckar vor dem Odenwald, mit Mannheim, Schwetzingen, Eppelheim, Dossenheim, Leimen, Wiesloch und Neckargemünd",
    rivers: [{ d: "M650 250 C 570 262, 500 214, 420 222 S 300 258, 200 236 S 60 196, -10 206", w: 14, label: ["Neckar", 520, 270] }],
    hills: [{ d: "M420 -10 C 430 90, 400 150, 440 200 S 470 330, 430 470 L 650 470 L 650 -10 Z", label: ["Odenwald", 560, 120] }],
    towns: [
      ["Mannheim", 70, 110, "middle"],
      ["Schwetzingen", 140, 330, "middle"],
      ["Eppelheim", 236, 290, "middle"],
      ["Dossenheim", 352, 86, "middle"],
      ["Leimen", 368, 360, "middle"],
      ["Wiesloch", 330, 430, "middle"],
      ["Neckargemünd", 572, 220, "middle"],
    ],
    centre: [372, 226],
    extra: "bridge",
    mini: ["Mannheim", "Schwetzingen", "Leimen"],
  },
  berlin: {
    aria: "Karte: Berlin an Spree und Havel, mit Potsdam, Falkensee, Oranienburg, Bernau, Strausberg, Königs Wusterhausen und Teltow",
    rivers: [
      { d: "M650 300 C 560 290, 480 250, 400 246 S 300 226, 240 236 S 150 250, 120 230", w: 14, label: ["Spree", 520, 300] },
      { d: "M110 -10 C 130 80, 100 170, 130 250 S 90 380, 60 470", w: 18, label: ["Havel", 40, 420] },
    ],
    hills: [{ d: "M150 300 C 190 280, 230 300, 220 350 S 160 380, 140 350 Z", label: ["Grunewald", 150, 400] }],
    towns: [
      ["Potsdam", 110, 380, "middle"],
      ["Falkensee", 60, 170, "middle"],
      ["Oranienburg", 260, 40, "middle"],
      ["Bernau", 470, 60, "middle"],
      ["Strausberg", 590, 160, "middle"],
      ["Königs Wusterhausen", 470, 410, "middle"],
      ["Teltow", 250, 400, "middle"],
    ],
    centre: [340, 222],
    mini: ["Potsdam", "Bernau", "Oranienburg"],
  },
  hamburg: {
    aria: "Karte: Hamburg an der Elbe, mit Norderstedt, Pinneberg, Ahrensburg, Reinbek, Buxtehude, Stade und Lüneburg",
    rivers: [
      { d: "M-10 300 C 90 290, 180 300, 260 280 S 420 250, 520 280 S 610 330, 650 330", w: 26, label: ["Elbe", 80, 330] },
      { d: "M330 250 C 340 210, 320 180, 336 140", w: 10, label: ["Alster", 344, 130] },
    ],
    towns: [
      ["Norderstedt", 330, 50, "middle"],
      ["Pinneberg", 150, 120, "middle"],
      ["Ahrensburg", 520, 110, "middle"],
      ["Reinbek", 560, 230, "middle"],
      ["Buxtehude", 150, 390, "middle"],
      ["Stade", 40, 230, "middle"],
      ["Lüneburg", 500, 420, "middle"],
    ],
    centre: [318, 236],
    mini: ["Norderstedt", "Pinneberg", "Ahrensburg"],
  },
  muenchen: {
    aria: "Karte: München an der Isar, mit Dachau, Freising, Garching, Ismaning, Unterhaching, Germering und Starnberg",
    rivers: [{ d: "M420 470 C 400 400, 380 340, 340 280 S 300 170, 330 90 S 400 10, 420 -10", w: 14, label: ["Isar", 430, 430] }],
    hills: [{ d: "M-10 470 C 80 430, 180 440, 260 470 Z", label: ["Richtung Alpen", 60, 455] }],
    towns: [
      ["Dachau", 140, 90, "middle"],
      ["Freising", 400, 40, "middle"],
      ["Garching", 380, 120, "middle"],
      ["Ismaning", 500, 160, "middle"],
      ["Unterhaching", 400, 360, "middle"],
      ["Germering", 110, 290, "middle"],
      ["Starnberg", 190, 410, "middle"],
    ],
    centre: [300, 236],
    mini: ["Dachau", "Garching", "Germering"],
  },
  koeln: {
    aria: "Karte: Köln am Rhein, mit Leverkusen, Bergisch Gladbach, Pulheim, Frechen, Hürth, Brühl und Troisdorf",
    rivers: [{ d: "M520 -10 C 470 70, 420 120, 380 180 S 300 280, 300 340 S 340 430, 380 470", w: 24, label: ["Rhein", 400, 440] }],
    hills: [{ d: "M560 120 C 600 160, 660 180, 650 470 L 520 470 C 540 360, 520 240, 560 120 Z", label: ["Bergisches Land", 520, 300] }],
    towns: [
      ["Leverkusen", 470, 60, "middle"],
      ["Bergisch Gladbach", 540, 180, "middle"],
      ["Pulheim", 160, 110, "middle"],
      ["Frechen", 110, 250, "middle"],
      ["Hürth", 190, 340, "middle"],
      ["Brühl", 240, 420, "middle"],
      ["Troisdorf", 520, 400, "middle"],
    ],
    centre: [330, 226],
    mini: ["Leverkusen", "Frechen", "Bergisch Gladbach"],
  },
  stuttgart: {
    aria: "Karte: Stuttgart im Neckartal, mit Ludwigsburg, Waiblingen, Esslingen, Böblingen, Sindelfingen, Leonberg und Filderstadt",
    rivers: [{ d: "M650 360 C 560 340, 500 300, 440 250 S 380 150, 360 80 S 330 10, 300 -10", w: 14, label: ["Neckar", 540, 380] }],
    hills: [{ d: "M150 160 C 200 120, 300 130, 330 200 S 300 330, 220 330 S 120 250, 150 160 Z", label: ["Talkessel", 190, 300] }],
    towns: [
      ["Ludwigsburg", 330, 40, "middle"],
      ["Waiblingen", 510, 130, "middle"],
      ["Esslingen", 530, 300, "middle"],
      ["Böblingen", 110, 360, "middle"],
      ["Sindelfingen", 90, 280, "middle"],
      ["Leonberg", 80, 150, "middle"],
      ["Filderstadt", 330, 410, "middle"],
    ],
    centre: [250, 226],
    mini: ["Ludwigsburg", "Esslingen", "Böblingen"],
  },
  duesseldorf: {
    aria: "Karte: Düsseldorf am Rhein, mit Neuss, Meerbusch, Ratingen, Erkrath, Hilden, Langenfeld und Krefeld",
    rivers: [{ d: "M300 -10 C 240 60, 200 120, 240 190 S 360 260, 330 320 S 220 400, 260 470", w: 24, label: ["Rhein", 200, 440] }],
    towns: [
      ["Neuss", 150, 300, "middle"],
      ["Meerbusch", 140, 140, "middle"],
      ["Ratingen", 460, 90, "middle"],
      ["Erkrath", 540, 240, "middle"],
      ["Hilden", 500, 360, "middle"],
      ["Langenfeld", 430, 430, "middle"],
      ["Krefeld", 60, 50, "middle"],
    ],
    centre: [370, 220],
    mini: ["Neuss", "Ratingen", "Meerbusch"],
  },
};


/*
 * <Service> in <city>: the local landing page (template for every city and service in cities.ts).
 * Built to be its own page, not a copy of /leistungen/webdesign: local clients, the area we cover, a local FAQ.
 * Prices come from PreiseV2 via WebPackage; client texts from caseList.ts as approved there.
 */

const SITE = "https://nuell-agentur.com";
const EASE = [0.22, 1, 0.36, 1] as const;
const CTA_HREF = "#contact";

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10]">
    {children}
    <span className="text-[#007aff]">.</span>
  </h2>
);

// the homepage ring around a landmark, with all our websites (same cards and captions as the homepage): wide on desktop, wider than the screen on phones
const RING_CITY: Ring = { rx: 0.42, ry: 0.44, lap: 110, numW: "w-[clamp(180px,15vw,250px)]", plainW: "w-[clamp(150px,12.5vw,200px)]" };
const RING_CITY_PHONE: Ring = { rx: 0.7, ry: 0.42, lap: 70, compact: true, numW: "w-[clamp(130px,36vw,170px)]", plainW: "w-[clamp(130px,36vw,170px)]" };


export default function CityPageV2({ city }: { city: City }) {
  const reduce = useReducedMotion();
  const rise = (d = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.7, delay: d, ease: EASE } };
  const label = SERVICE_LABEL[city.service];
  const url = `${SITE}/leistungen/${SERVICE_SLUG[city.service]}/${city.slug}`;
  const tierPrice = [...TIERS, ...ADDONS].find((t) => t.name === city.tier)?.price;
  const clients = city.clients.map((s) => CASE_LIST.find((c) => c.slug === s)).filter((c): c is (typeof CASE_LIST)[number] => !!c);
  // hero ring: the mockups of this city's clients (same cards as the homepage ring)
  const ring = city.showcase.filter((n) => !city.ringExclude?.includes(n)).map((n) => PROOFS.find((p) => p.src.endsWith(`/${n}.webp`))).filter((p): p is (typeof PROOFS)[number] => !!p);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${label} in ${city.name}`,
      serviceType: label,
      url,
      provider: { "@type": "Organization", "@id": `${SITE}/#organization`, name: "nüll.", url: `${SITE}/`, logo: `${SITE}/og-image.png` },
      areaServed: [{ "@type": "City", name: city.name }, ...city.nearby.map((n) => ({ "@type": "City", name: n }))],
      offers:
        city.service === "web"
          ? STARTS.map((t) => ({ "@type": "Offer", name: t.name, price: t.price.replace(/\./g, ""), priceCurrency: "EUR" }))
          : tierPrice
            ? [{ "@type": "Offer", name: `Paket ${city.tier}`, price: tierPrice.replace(/\./g, ""), priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: tierPrice.replace(/\./g, ""), priceCurrency: "EUR", unitText: "MONTH" } }]
            : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Leistungen", item: `${SITE}${SERVICES}` },
        { "@type": "ListItem", position: 2, name: label, item: `${SITE}${SERVICE[city.service]}` },
        { "@type": "ListItem", position: 3, name: city.name, item: url },
      ],
    },
    // the explainer: what it is about, for Google's video results
    ...(city.video
      ? [
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: city.video.title,
            description: city.video.description,
            thumbnailUrl: [`${SITE}${city.video.prefix}-poster.jpg`, `${SITE}${city.video.prefix}-poster-9x16.jpg`],
            uploadDate: city.video.uploadDate,
            duration: `PT${city.video.seconds}S`,
            contentUrl: `${SITE}${city.video.prefix}-1080.mp4`,
            inLanguage: "de-DE",
            transcript: city.video.transcript,
            publisher: { "@type": "Organization", "@id": `${SITE}/#organization`, name: "nüll.", url: `${SITE}/`, logo: `${SITE}/og-image.png` },
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bg-white">
        <NavBar onHome={false} current={`/leistungen/${SERVICE_SLUG[city.service]}/${city.slug}`} />
      </div>
      <main>
        {/* hero */}
        {city.landmark ? (
          <LandmarkHero city={city} ring={ring} reduce={reduce} />
        ) : (
          <section className="relative overflow-hidden bg-white pb-16 pt-8 text-[#0e0e10] md:pb-24 md:pt-12">
            <div className="relative mx-auto w-full max-w-[1360px] px-4 text-center md:px-8">
              <nav aria-label="Brotkrumen" className="flex items-center justify-center gap-1.5 text-[0.82rem] font-semibold text-[#6b7280]">
                <a href={SERVICES} className="transition-colors hover:text-[#0e0e10]">Leistungen</a>
                <ChevronRight size={14} aria-hidden />
                <a href={SERVICE[city.service]} className="transition-colors hover:text-[#0e0e10]">{SERVICE_LABEL[city.service]}</a>
                <ChevronRight size={14} aria-hidden />
                <span className="text-[#007aff]" aria-current="page">{city.name}</span>
              </nav>
              <h1 className="mx-auto mt-5 text-[clamp(2.9rem,8vw,6.6rem)] font-bold leading-[0.92] tracking-[-0.065em]">
                <span className="text-[#0e0e10]/30">{city.heroMuted}</span>
                <br />
                {city.heroTitle}<span className="text-[#007aff]">.</span>
              </h1>
              <ClientShowcase only={city.showcase} />
              <p className="mx-auto mt-9 max-w-[48ch] text-[1.05rem] font-medium leading-[1.5] tracking-[-0.02em] text-[#424245] md:text-[1.15rem]">
                {city.heroLine}
              </p>
              <div className="mt-8 flex justify-center">
                <a href={CTA_HREF} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white">
                  Anfrage starten <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* the city explainer grows to full width on scroll, like the homepage video */}
        {city.video && (
          <section className="bg-white">
            <ScrollVideo src={{ wide: `${city.video.prefix}-1080.mp4`, tall: `${city.video.prefix}-9x16.mp4`, poster: `${city.video.prefix}-poster.jpg`, posterTall: `${city.video.prefix}-poster-9x16.jpg`, captions: `${city.video.prefix}.de.vtt` }} />
          </section>
        )}

        <CityProblem city={city} rise={rise} />
        {/* right after "nobody finds you": check your own website (opens the website-check pop-up) */}
        <WebsiteCheckTeaserV2 source={`city-${city.slug}`} city={city.name} />
        <CitySteps city={city} rise={rise} />

        {/* local proof: our clients in this city */}
        <section className="bg-[#f5f5f7] py-20 text-[#0e0e10] md:py-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...rise()} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
              <div>
                <H2>{city.clientsTitle}</H2>
                <p className="mt-5 max-w-[50ch] text-[1.05rem] font-medium leading-[1.5] tracking-[-0.02em] text-[#424245] md:text-[1.12rem]">
                  {city.clientsText}
                </p>
              </div>
              <a href="/referenzen" className="inline-flex flex-none items-center gap-1.5 text-[1rem] font-bold tracking-[-0.02em] text-[#007aff] transition-opacity hover:opacity-55">
                Alle Referenzen <ArrowUpRight size={17} strokeWidth={2.4} />
              </a>
            </motion.div>
            {/* bento: wide + narrow, then narrow + wide; photo full-bleed, text on a soft dark fade */}
            <div className="mt-8 grid grid-cols-2 gap-2.5 md:hidden">
              {/* phones: bento, wide, two half, wide */}
              {clients.map((c, i) => (
                <CaseTile key={c.slug} c={c} wide={i % 3 === 0} place={city.clientPlaces?.[c.slug] ?? c.place} />
              ))}
            </div>
            <div className="mt-14 hidden gap-4 md:grid md:grid-cols-3">
              {clients.map((c, i) => {
                const wide = i === 0 || i === 3;
                const full = clients.length === 3 && i === 2; // three clients: the last one spans the row
                return (
                  <motion.a
                    key={c.slug}
                    {...rise(0.04 + i * 0.05)}
                    href={c.page}
                    aria-label={`Referenz ansehen: ${c.client}`}
                    className={`group relative flex flex-col overflow-hidden rounded-[24px] bg-white md:block md:h-[440px] md:bg-[#eef0f3] ${full ? "md:col-span-3" : wide ? "md:col-span-2" : "md:col-span-1"}`}
                  >
                    {/* phones: photo on top, text below on white; desktop: text over the photo */}
                    <div className="relative aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
                      <img src={c.img} alt={c.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
                      <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-[62%] bg-[linear-gradient(180deg,rgba(14,14,16,0)_0%,rgba(14,14,16,0.78)_100%)] md:block" />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[0.76rem] font-bold text-[#007aff] md:left-5 md:top-5">
                        <MapPin size={13} strokeWidth={2.6} aria-hidden /> {city.clientPlaces?.[c.slug] ?? c.place}
                      </span>
                      <span aria-hidden className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[#0e0e10] transition-colors duration-300 group-hover:bg-[#007aff] group-hover:text-white md:right-5 md:top-5">
                        <ArrowUpRight size={19} strokeWidth={2.4} />
                      </span>
                    </div>
                    <div className="relative p-5 md:absolute md:inset-x-0 md:bottom-0 md:p-7">
                      <p className="text-[1.45rem] font-bold leading-tight tracking-[-0.045em] text-[#0e0e10] md:text-[2rem] md:text-white">{c.client}</p>
                      <p className="mt-1 max-w-[42ch] text-[0.96rem] font-medium leading-snug text-[#424245] md:mt-1.5 md:text-[0.98rem] md:text-white/85">{c.headline}</p>
                      <div className="mt-3.5 flex flex-wrap gap-1.5 md:mt-4">
                        {c.services.map((sv) => (
                          <span key={sv} className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[0.76rem] font-semibold text-[#424245] md:bg-white/15 md:text-white md:backdrop-blur-sm">{sv}</span>
                        ))}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* the area: one centred block, the real map full width, the districts and towns underneath */}
        <section className="bg-white py-20 text-[#0e0e10] md:py-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div {...rise()} className="mx-auto max-w-[760px] md:text-center">
              <H2>Für ganz {city.name}</H2>
              <p className="mt-5 max-w-[60ch] text-[1.05rem] md:mx-auto font-medium leading-[1.55] tracking-[-0.02em] text-[#424245] md:text-[1.12rem]">{city.localText}</p>
            </motion.div>
            <motion.div {...rise(0.06)} className="relative mt-7 h-[320px] overflow-hidden rounded-[24px] bg-[#f5f5f7] md:mt-14 md:h-[560px] md:rounded-[28px]">
              <GoogleMap query={`${city.name}, Deutschland`} zoom={12} title={`Karte: ${city.name}`} placeholder={MAPS[city.slug] ? <AreaMap m={MAPS[city.slug]} name={city.name} /> : undefined} />
            </motion.div>
            <motion.div {...rise(0.08)} className="mx-auto mt-6 max-w-[980px] md:mt-12 md:text-center">
              <AreaChips city={city} />
            </motion.div>
          </div>
        </section>

        {/* what you get, then the price: Webdesign uses the Webdesign page's section, the others the package of their tier; city intro line */}
        {city.service === "web" ? (
          <WebPackage cfg={{ packageNote: city.packageNote, tint: "#e9f2ff" }} rise={rise} />
        ) : (
          <PackageSection cfg={{ kind: city.service as "seo" | "ads" | "ai" | "content", tier: city.tier ?? "SEO", packageNote: city.packageNote, tint: "#eef3fb" }} rise={rise} />
        )}

        {/* more for this city */}
        <section className="bg-white pt-20 text-[#0e0e10] md:pt-28">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.p {...rise()} className="text-[1.6rem] font-bold tracking-[-0.045em]">
              Mehr für Betriebe in {city.name}<span className="text-[#007aff]">.</span>
            </motion.p>
            <div className="mt-5 grid gap-2.5 md:grid-cols-2 md:gap-4">
              {related(city).map((x, i) => (
                <motion.a key={x.href} {...rise(0.04 + i * 0.05)} href={x.href} className="group flex items-center justify-between gap-6 rounded-[22px] bg-[#f5f5f7] p-6 md:p-8">
                  <span>
                    <span className="block text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">{x.label}</span>
                    <span className="mt-1.5 block text-[1.5rem] font-bold leading-tight tracking-[-0.04em] md:text-[1.9rem]">{x.title}</span>
                    <span className="mt-1.5 block max-w-[46ch] text-[0.95rem] font-medium leading-snug text-[#6b7280]">{x.text}</span>
                  </span>
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#0e0e10] text-white transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={20} strokeWidth={2.4} />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <FaqV2 items={city.faqs} />
        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}

/* the city's own drawn map: rivers, hills, the towns around, the city in the middle */
function AreaMap({ m, name }: { m: AreaMapData; name: string }) {
  const [cx, cy] = m.centre;
  return (
    <div className="absolute inset-0">
      {(["slice", "meet"] as const).map((fit) => (
      <svg key={fit} viewBox="0 0 640 460" preserveAspectRatio={`xMidYMid ${fit}`} role="img" aria-label={m.aria} className={`h-full w-full ${fit === "slice" ? "block md:hidden" : "hidden md:block"}`}>
        {m.hills?.map((h) => (
          <g key={h.d}>
            <path d={h.d} fill="#e4eedb" />
            {h.label && <text x={h.label[1]} y={h.label[2]} className="fill-[#8aa57a] text-[15px] font-bold italic">{h.label[0]}</text>}
          </g>
        ))}
        {m.rivers.map((r) => (
          <g key={r.d}>
            <path d={r.d} fill="none" stroke="#cfe3ff" strokeWidth={r.w} strokeLinecap="round" />
            {r.label && <text x={r.label[1]} y={r.label[2]} className="fill-[#6b9fe0] text-[15px] font-bold italic">{r.label[0]}</text>}
          </g>
        ))}
        {/* a small mark for the city itself: the Quadrate, the skyline, the old bridge */}
        {m.extra === "quadrate" && (
          <g transform={`translate(${cx - 42} ${cy - 34})`}>
            {Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => <rect key={`${r}-${c}`} x={c * 17} y={r * 17} width="13" height="13" rx="2.5" fill="#dfe4ec" />))}
          </g>
        )}
        {m.extra === "skyline" && (
          <g transform={`translate(${cx - 40} ${cy - 66})`} fill="#d5dde8">
            {[[0, 30, 14], [18, 8, 16], [38, 0, 18], [60, 18, 14], [78, 34, 12]].map(([x, y, w]) => <rect key={x} x={x} y={y} width={w} height={56 - y} rx="2" />)}
          </g>
        )}
        {m.extra === "bridge" && (
          <g transform={`translate(${cx - 46} ${cy - 22})`} fill="#e6c9bb">
            <rect x="0" y="0" width="92" height="7" rx="2" />
            {[6, 30, 54, 78].map((x) => <rect key={x} x={x} y="7" width="8" height="12" />)}
            <rect x="38" y="-16" width="6" height="16" /><rect x="48" y="-16" width="6" height="16" />
          </g>
        )}
        {m.towns.map(([t, x, y, anchor]) => (
          <g key={t}>
            <circle cx={x} cy={y} r="5" fill="#9aa0a8" />
            <text x={anchor === "end" ? x - 10 : x} y={anchor === "middle" ? y + 22 : y + 5} textAnchor={anchor} className="fill-[#424245] text-[14px] font-semibold">{t}</text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r="26" fill="#007aff" opacity="0.14" />
        <circle cx={cx} cy={cy} r="9" fill="#007aff" />
        <text x={cx} y={cy + 52} textAnchor="middle" className="fill-[#0e0e10] text-[20px] font-bold">{name}</text>
      </svg>
      ))}
    </div>
  );
}

/*
 * Hero for a city with a landmark (Halyl, 12 Nov 2026): for the first moments only the landmark, big and in colour,
 * building itself while the client websites already circle it. Then it steps back into the background and the
 * title comes in on top, centred. Same on desktop and phones (each with its own ring size). Reduced motion: final state.
 */
const TOWER_ALONE_MS = 2600;

function LandmarkHero({ city, ring, reduce }: { city: City; ring: typeof PROOFS; reduce: boolean | null }) {
  const Landmark = LANDMARKS[city.landmark ?? "wasserturm"];
  const [titled, setTitled] = useState(!!reduce);
  useEffect(() => {
    if (reduce) return setTitled(true);
    const t = setTimeout(() => setTitled(true), TOWER_ALONE_MS);
    return () => clearTimeout(t);
  }, [reduce]);

  const tower = (h: string, faded = 0.32) => (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
      initial={false}
      animate={titled ? { opacity: faded, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
    >
      <Landmark className={`${h} w-auto`} />
    </motion.div>
  );
  // the title block fades and rises in once the tower has stood alone for a moment
  const show = (d: number) => ({
    initial: false as const,
    animate: titled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: reduce ? 0 : 0.8, delay: titled && !reduce ? d : 0, ease: EASE },
  });
  const text = (big: boolean) => {
    const TitleTag = big ? motion.h1 : motion.div;
    return (
    <div className={`absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center ${big ? "w-[min(760px,54%)] [container-type:inline-size]" : "w-[min(88%,440px)]"}`}>
      <motion.nav {...show(0)} aria-label="Brotkrumen" className={`flex items-center justify-center gap-1.5 font-semibold text-[#6b7280] ${big ? "text-[0.85rem]" : "text-[0.78rem]"}`}>
        <a href={SERVICES} className="transition-colors hover:text-[#0e0e10]">Leistungen</a>
        <ChevronRight size={13} aria-hidden />
        <a href={SERVICE[city.service]} className="transition-colors hover:text-[#0e0e10]">{SERVICE_LABEL[city.service]}</a>
        <ChevronRight size={13} aria-hidden />
        <span className="text-[#007aff]" aria-current="page">{city.name}</span>
      </motion.nav>
      {/* desktop: always two lines, sized to the text block (cqw), so a narrower window never stacks it into four */}
      {/* one real <h1> in the HTML (desktop); the phone copy is a heading by role only, each is hidden at the other size */}
      <TitleTag {...show(0.08)} {...(big ? {} : { role: "heading", "aria-level": 1 })} style={big ? { fontSize: `min(${Math.min(8.4, 210 / Math.max(city.heroMuted.length, city.heroTitle.length + 1)).toFixed(2)}cqw, 5.4rem)` } : undefined} className={`font-bold leading-[0.92] tracking-[-0.065em] ${big ? "mt-5" : "mt-4 text-[clamp(2.5rem,11vw,4.2rem)]"}`}>
        <span className={big ? "whitespace-nowrap text-[#0e0e10]/30" : "text-[#0e0e10]/45"}>{city.heroMuted}</span>
        <br />
        <span className={big ? "whitespace-nowrap" : ""}>
          {city.heroTitle}<span className="text-[#007aff]">.</span>
        </span>
      </TitleTag>
      <motion.p {...show(0.18)} className={`mx-auto text-[#0e0e10]/65 ${big ? "mt-5 max-w-[30rem] text-[1.08rem] leading-[1.5]" : "mt-4 max-w-[22rem] text-[0.98rem] leading-[1.5]"}`}>
        {city.heroLine}
      </motion.p>
      <motion.div {...show(0.28)} className={`flex items-center justify-center gap-6 ${big ? "mt-8" : "mt-6"}`}>
        <a href={CTA_HREF} className="group inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.84rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
          Anfrage starten
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </a>
        {big && (
          <a href="/preise" className="border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
            Preise ansehen
          </a>
        )}
      </motion.div>
    </div>
  );
  };

  return (
    <section className="relative overflow-hidden bg-white text-[#0e0e10]">
      {/* desktop */}
      <div className="relative mx-auto hidden h-[calc(100dvh-72px)] min-h-[520px] w-full max-w-[1360px] px-8 lg:block">
        {tower("h-[min(640px,76dvh)]")}
        <Orbit items={ring} reduce={reduce} ring={RING_CITY} />
        {text(true)}
      </div>
      {/* phones and tablets */}
      <div className="relative h-[calc(100svh-64px)] min-h-[520px] w-full overflow-hidden lg:hidden">
        {tower("h-[min(560px,74svh)]", 0.18)}
        <Orbit items={ring} reduce={reduce} ring={RING_CITY_PHONE} />
        {text(false)}
      </div>
    </section>
  );
}

/* ---------- the problem, Mannheim version: a phone with a local search where your business is missing ---------- */
function CityProblem({ city, rise }: { city: City; rise: (d?: number) => object }) {
  const reduce = useReducedMotion();
  const p = city.problem;
  const inv = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 }, transition: { duration: 0.45, delay: d, ease: EASE } });
  return (
    <section className="bg-[#f5f5f7] py-16 text-[#0e0e10] md:py-24">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <motion.div {...rise()} className="grid overflow-hidden rounded-[28px] bg-white lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center px-6 pb-4 pt-9 md:px-10 lg:px-14 lg:py-16">
            <h2 className="text-[clamp(2.1rem,4.4vw,3.9rem)] font-bold leading-[1] tracking-[-0.055em]">
              {p.strong} <span className="text-[#0e0e10]/35">{p.muted}</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[1.02rem] font-medium leading-[1.55] tracking-[-0.015em] text-[#424245] md:text-[1.1rem]">{p.text}</p>
          </div>
          {/* the search: three neighbours at the top, your business nowhere */}
          {/* phones: like the homepage "… werden" cards, the phone runs off the bottom edge of the card */}
          <div className="relative flex h-[420px] items-start justify-center overflow-hidden bg-[radial-gradient(60%_60%_at_50%_50%,#e9f2ff_0%,#ffffff_100%)] px-4 pt-10 lg:h-auto lg:items-center lg:py-12">
            <div className="relative w-[290px] rounded-[44px] bg-[#0e0e10] p-[9px] shadow-[0_40px_80px_-36px_rgba(15,23,42,0.5)] md:w-[320px]">
              <div className="relative h-[560px] overflow-hidden rounded-[36px] bg-white px-4 pt-12">
{p.mode === "chat" ? (
<>
                <span className="absolute left-1/2 top-3 h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-[#0e0e10]" />
                {/* an AI chat: the question, three named businesses, yours missing */}
                <p className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[#0e0e10]">
                  <img src="/assets/v2/logos/openai.svg" alt="" className="h-4 w-4" /> ChatGPT
                </p>
                <motion.p {...inv(0.1)} className="ml-auto mt-4 w-fit max-w-[86%] rounded-[18px] bg-[#f0f1f3] px-3.5 py-2.5 text-[0.88rem] leading-snug text-[#0e0e10]">{p.query}</motion.p>
                <motion.p {...inv(0.3)} className="mt-4 text-[0.88rem] leading-[1.5] text-[#0e0e10]">In {city.name} werden oft diese Betriebe empfohlen:</motion.p>
                {city.spots.map((d, i) => `Betrieb ${"ABC"[i]} · ${d}`).map((t, i) => (
                  <motion.div key={t} {...inv(0.4 + i * 0.12)} className="mt-2 flex items-center gap-2.5 rounded-[12px] bg-[#f7f8fa] px-3 py-2.5 text-[0.86rem] font-semibold text-[#0e0e10]">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#0e0e10] text-[0.7rem] font-bold text-white">{i + 1}</span>
                    {t}
                  </motion.div>
                ))}
                <motion.div {...inv(0.8)} className="mt-2.5 rounded-[12px] border-2 border-dashed border-[#c9ccd2] px-3 py-2.5 text-[#9aa0a8]">
                  <span className="block text-[0.72rem]">Dein Betrieb</span>
                  <span className="block text-[0.88rem] font-semibold">Nicht genannt</span>
                </motion.div>
</>
) : p.mode === "insta" ? (
<>
                <span className="absolute left-1/2 top-3 h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-[#0e0e10]" />
                {/* two Instagram profiles: yours empty, the other one full of real work */}
                <div className="flex h-10 items-center gap-2 rounded-[12px] bg-[#f0f1f3] px-3.5 text-[0.86rem] text-[#6b7280]">
                  <svg width="15" height="15" viewBox="0 0 44 44" aria-hidden><circle cx="19" cy="19" r="13" stroke="#9aa0a6" strokeWidth="4" fill="none" /><path d="M29 29l11 11" stroke="#9aa0a6" strokeWidth="4" /></svg>
                  {p.query}
                </div>
                {[0, 1].map((k) => (
                  <motion.div key={k} {...inv(0.15 + k * 0.3)} className="mt-3 rounded-[16px] border border-black/[0.06] p-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-9 w-9 flex-none rounded-full ${k === 0 ? "bg-[#e3e6ec]" : "bg-[conic-gradient(#f58529,#dd2a7b,#8134af,#f58529)] p-[2px]"}`}>{k === 1 && <span className="block h-full w-full rounded-full border-2 border-white bg-[#ffd8c2]" />}</span>
                      <div className="min-w-0">
                        <p className="text-[0.84rem] font-bold leading-tight">{k === 0 ? "dein.betrieb" : `betrieb.b.${city.slug}`}</p>
                        <p className="text-[0.72rem] text-[#6b7280]">{k === 0 ? "0 Beiträge" : "214 Beiträge · 3.180 Follower"}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 grid grid-cols-3 gap-1">
                      {Array.from({ length: 6 }, (_, i) => (
                        <span key={i} className={`aspect-square rounded-[6px] ${k === 0 ? "border border-dashed border-[#d5d8dd]" : ["bg-[#d9c7b4]", "bg-[#b9cbe0]", "bg-[#cfd9c4]", "bg-[#e6d3c3]", "bg-[#c8c3d9]", "bg-[#d6cfc3]"][i]}`} />
                      ))}
                    </div>
                  </motion.div>
                ))}
</>
) : (
<>
                <span className="absolute left-1/2 top-3 h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-[#0e0e10]" />
                <div className="flex h-11 items-center gap-2 rounded-full border border-[#dfe1e5] px-4 text-[0.92rem] text-[#202124]">
                  <svg width="16" height="16" viewBox="0 0 44 44" aria-hidden><circle cx="19" cy="19" r="13" stroke="#9aa0a6" strokeWidth="4" fill="none" /><path d="M29 29l11 11" stroke="#9aa0a6" strokeWidth="4" /></svg>
                  {p.query}
                </div>
                <motion.div {...inv(0.1)} className="mt-3 hidden h-[130px] overflow-hidden rounded-[16px] lg:block">
                  <svg viewBox="0 0 300 130" className="h-full w-full" aria-hidden>
                    <rect width="300" height="130" fill="#eef2ea" />
                    <g transform="scale(0.47 0.283)">{(MAPS[city.slug]?.rivers ?? []).map((r) => <path key={r.d} d={r.d} stroke="#bcd8f5" strokeWidth={r.w * 1.6} fill="none" />)}</g>
                    {[[120, 86], [190, 40], [240, 98]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="7" fill="#ea4335" />)}
                  </svg>
                </motion.div>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} {...inv(0.25 + i * 0.12)} className="mt-2.5 rounded-[14px] border border-black/[0.06] px-3.5 py-3">
                    <span className="block h-[10px] rounded-full bg-[#3c4043]/80" style={{ width: `${[56, 48, 62][i]}%` }} />
                    <span className="mt-2 block text-[0.78rem] text-[#4d5156]"><span className="tracking-[1px] text-[#f9ab00]">★★★★★</span> 4,{[9, 8, 7][i]} · Geöffnet</span>
                  </motion.div>
                ))}
                <motion.div {...inv(0.7)} className="mt-2.5 rounded-[14px] border-2 border-dashed border-[#c9ccd2] px-3.5 py-3 text-[#9aa0a8]">
                  <span className="block text-[0.72rem]">dein-betrieb.de</span>
                  <span className="block text-[0.9rem] font-semibold">Nicht in den Ergebnissen</span>
                </motion.div>
</>
)}
              </div>
            </div>
            {p.chips.map((c, i) => (
              <motion.span
                key={c}
                {...(reduce ? {} : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.6 }, transition: { duration: 0.5, delay: 0.5 + i * 0.4, ease: EASE } })}
                className={`absolute inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[0.82rem] font-bold tracking-[-0.01em] shadow-[0_16px_36px_-18px_rgba(15,23,42,0.45)] md:text-[0.9rem] ${i === 0 ? "left-4 top-6 md:left-8 md:top-10" : "bottom-6 right-4 md:bottom-10 md:right-8"}`}
              >
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#ff9500]" : "bg-[#ea4335]"}`} />
                {c}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- four steps as one path (dots on a line), each with a small drawing ---------- */
// the city, then its three mini-map towns, as % positions in the small map drawing
function miniTowns(city: City): Array<[string, number, number]> {
  const m = MAPS[city.slug];
  if (!m) return [[city.name, 50, 50]];
  const pos = (x: number, y: number): [number, number] => [Math.min(86, Math.max(14, (x / 640) * 100)), Math.min(80, Math.max(6, (y / 460) * 100))];
  return [[city.name, ...pos(m.centre[0], m.centre[1] + 30)], ...m.mini.map((t) => { const w = m.towns.find((x) => x[0] === t)!; return [t, ...pos(w[1], w[2])] as [string, number, number]; })];
}

function StepArt({ art, city }: { art: StepArtKind; city: City }) {
  const box = "relative h-[180px] overflow-hidden rounded-[18px] bg-[#f5f5f7] p-4";
  if (art === "search")
    return (
      <div className={box}>
        <div className="flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-[0.82rem] text-[#202124] shadow-[0_1px_4px_rgba(32,33,36,.18)]">
          <svg width="14" height="14" viewBox="0 0 44 44" aria-hidden><circle cx="19" cy="19" r="13" stroke="#9aa0a6" strokeWidth="4" fill="none" /><path d="M29 29l11 11" stroke="#9aa0a6" strokeWidth="4" /></svg>
          {city.trade.term} {city.spots[2]}
        </div>
        <div className="mt-3 rounded-[12px] bg-[#eaf3ff] p-3 shadow-[inset_0_0_0_2px_#007aff]">
          <p className="text-[0.7rem] font-semibold text-[#4d5156]">dein-betrieb.de/{city.trade.page.toLowerCase().replace(/[^a-zäöüß]+/g, "-")}</p>
          <p className="mt-0.5 text-[0.92rem] font-semibold leading-tight text-[#1a0dab]">{city.trade.page} in {city.name}-{city.spots[2]}</p>
        </div>
        <span className="mt-3 block h-2 w-[70%] rounded-full bg-[#e3e6ec]" />
        <span className="mt-2 block h-2 w-[50%] rounded-full bg-[#e3e6ec]" />
      </div>
    );
  if (art === "clear")
    return (
      <div className={box}>
        <div className="h-full rounded-[12px] bg-white p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Dachdecker · {city.name}</p>
          <p className="mt-1.5 text-[1.25rem] font-bold leading-[1.02] tracking-[-0.045em]">Dach undicht? Wir kommen<span className="text-[#007aff]">.</span></p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Was", "Wo", "Wie erreichbar"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#f0f1f3] px-2.5 py-1 text-[0.7rem] font-semibold text-[#424245]"><Check size={11} strokeWidth={3} className="text-[#34c759]" />{t}</span>
            ))}
          </div>
        </div>
      </div>
    );
  if (art === "trust")
    return (
      <div className={box}>
        <div className="flex items-center gap-3 rounded-[12px] bg-white p-3">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,.06)]"><img src="/assets/v2/brands/google-g.svg" alt="" className="h-5 w-5" /></span>
          <span>
            <span className="block text-[0.95rem] font-bold leading-none">4,9 <span className="tracking-[1px] text-[#f5a623]">★★★★★</span></span>
            <span className="mt-1 block text-[0.72rem] font-medium text-[#6b7280]">Google-Profil · Beispiel</span>
          </span>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {["pkg-lamp", "pkg-fusebox", "pkg-switch"].map((n) => (
            <img key={n} src={`/assets/v2/services/${n}.webp`} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-[8px] object-cover" />
          ))}
        </div>
      </div>
    );
  if (art === "ask")
    return (
      <div className={box}>
        <div className="flex h-full flex-col justify-center gap-2">
          {[[`Welcher Fliesenleger in ${city.name} ist gut?`, "Empfehlung", true], ["Was kostet ein Bad neu fliesen?", "Preis", false], ["Wer hat diese Woche noch Zeit?", "Dringend", true]].map(([q, tag, right]) => (
            <div key={String(q)} className={`flex items-center gap-2 ${right ? "justify-end" : "justify-start"}`}>
              <span className={`max-w-[78%] rounded-[14px] px-3 py-2 text-[0.76rem] font-medium leading-snug text-[#0e0e10] ${right ? "bg-white" : "bg-[#f3f1fb]"}`}>{q}</span>
              <span className="flex-none rounded-[6px] bg-[#eaf3ff] px-1.5 py-0.5 text-[0.62rem] font-bold text-[#007aff]">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    );
  if (art === "data")
    return (
      <div className={box}>
        <div className="h-full overflow-hidden rounded-[12px] bg-white p-3.5 font-mono text-[0.68rem] leading-[1.7] [&>p]:whitespace-nowrap">
          <p className="text-[#86868b]">{"<script type=\"application/ld+json\">"}</p>
          <p className="pl-3 text-[#0e0e10]"><span className="text-[#007aff]">"@type"</span>: "HomeAndConstructionBusiness",</p>
          <p className="pl-3 text-[#0e0e10]"><span className="text-[#007aff]">"name"</span>: "Dein Betrieb",</p>
          <p className="pl-3 text-[#0e0e10]"><span className="text-[#007aff]">"areaServed"</span>: "{city.name}",</p>
          <p className="pl-3 text-[#0e0e10]"><span className="text-[#007aff]">"address"</span>: "{city.spots[0]}"</p>
          <p className="text-[#86868b]">{"</script>"}</p>
        </div>
      </div>
    );
  if (art === "aireport")
    return (
      <div className={box}>
        <div className="h-full rounded-[12px] bg-white p-3.5">
          <div className="flex items-baseline justify-between">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#7c5cff]">Monatsbericht</p>
            <p className="text-[0.66rem] font-semibold text-[#86868b]">KI-Einblendungen</p>
          </div>
          <div className="mt-3 flex h-[82px] items-end gap-1.5">
            {[0.12, 0.22, 0.34, 0.5, 0.68, 0.92].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t-[4px] ${i === 5 ? "bg-[#7c5cff]" : "bg-[#e6e0ff]"}`} style={{ height: `${h * 100}%` }} />
            ))}
          </div>
          <p className="mt-2 text-[0.66rem] font-semibold text-[#6b7280]">aus der Google Search Console · Beispiel</p>
        </div>
      </div>
    );
  if (art === "plan")
    return (
      <div className={box}>
        <div className="grid h-full grid-cols-4 gap-1.5 rounded-[12px] bg-white p-3">
          {["Mo", "Di", "Mi", "Do"].map((d, i) => (
            <div key={d} className="flex flex-col gap-1.5">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[#86868b]">{d}</span>
              <span className={`rounded-[7px] px-1.5 py-1.5 text-[0.62rem] font-bold leading-tight ${["bg-[#fdf1f4] text-[#c13584]", "bg-[#eaf3ff] text-[#007aff]", "bg-[#fdf1f4] text-[#c13584]", "bg-[#f1eefc] text-[#7c5cff]"][i]}`}>{["Projekt", "Team", "Baustelle", "Kundenfrage"][i]}</span>
              {i % 2 === 0 && <span className="h-6 rounded-[7px] bg-[#f5f5f7]" />}
            </div>
          ))}
        </div>
      </div>
    );
  if (art === "shoot")
    return (
      <div className={box}>
        <div className="relative h-full overflow-hidden rounded-[12px] bg-[#d9c7b4]">
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#c4ad95]" />
          {[0, 1, 2, 3, 4].map((k) => <span key={k} className="absolute bottom-[38%] h-[44%] w-[14%] rounded-t-[4px] bg-[#e9ded1]" style={{ left: `${8 + k * 18}%` }} />)}
          <span className="absolute inset-3 rounded-[10px] border-2 border-white/80" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.66rem] font-bold text-white"><span className="h-2 w-2 rounded-full bg-[#ff3b30]" />REC 00:12</span>
          <span className="absolute bottom-5 right-5 rounded-full bg-white px-2.5 py-1 text-[0.66rem] font-bold text-[#0e0e10]">{city.spots[1]}</span>
        </div>
      </div>
    );
  if (art === "edit")
    return (
      <div className={box}>
        <div className="flex h-full gap-3">
          <div className="relative w-[34%] overflow-hidden rounded-[12px] bg-[#cfd9c4]">
            <span className="absolute inset-x-2 bottom-3 rounded-[6px] bg-black/60 px-1.5 py-1 text-center text-[0.58rem] font-bold leading-tight text-white">So sieht ein neues Bad aus</span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 rounded-[12px] bg-white p-3">
            {[[0, 62, "#c13584"], [18, 40, "#007aff"], [8, 70, "#7c5cff"]].map(([l, w, c], k) => (
              <div key={k} className="relative h-5 rounded-[5px] bg-[#f5f5f7]"><span className="absolute top-0 h-5 rounded-[5px]" style={{ left: `${l}%`, width: `${w}%`, background: String(c), opacity: 0.85 }} /></div>
            ))}
            <span className="text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[#86868b]">Schnitt · Untertitel</span>
          </div>
        </div>
      </div>
    );
  if (art === "publish")
    return (
      <div className={box}>
        <div className="flex h-full items-center gap-3 rounded-[12px] bg-white p-3">
          <div className="grid w-[46%] grid-cols-3 gap-1">
            {["#d9c7b4", "#b9cbe0", "#cfd9c4", "#e6d3c3", "#c8c3d9", "#d6cfc3"].map((c) => <span key={c} className="aspect-[9/14] rounded-[4px]" style={{ background: c }} />)}
          </div>
          <div className="flex-1">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#c13584]">Meta Ads · {city.name}</p>
            <p className="mt-1 text-[1.5rem] font-bold leading-none tracking-[-0.04em]">+ Umkreis</p>
            <p className="mt-1.5 text-[0.7rem] font-semibold text-[#6b7280]">Wer in der Region wohnt, sieht deine Videos.</p>
          </div>
        </div>
      </div>
    );
  if (art === "area")
    return (
      <div className={box}>
        <div className="relative h-full overflow-hidden rounded-[12px] bg-[#eef2ea]">
          <svg viewBox="0 0 320 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <g transform="scale(0.5 0.326)">{(MAPS[city.slug]?.rivers ?? []).map((r) => <path key={r.d} d={r.d} stroke="#bcd8f5" strokeWidth={r.w * 1.4} fill="none" />)}</g>
            <circle cx="160" cy="76" r="62" fill="#007aff" fillOpacity="0.1" stroke="#007aff" strokeWidth="2" strokeDasharray="6 5" />
            <circle cx="160" cy="76" r="7" fill="#007aff" />
          </svg>
          {miniTowns(city).map(([t, left, top], k) => (
            <span key={t} style={{ left: `${left}%`, top: `${top}%` }} className={`absolute -translate-x-1/2 rounded-full px-2 py-0.5 text-[0.66rem] font-bold ${k === 0 ? "bg-[#007aff] text-white" : "bg-white text-[#424245]"}`}>{t}</span>
          ))}
        </div>
      </div>
    );
  if (art === "pages")
    return (
      <div className={box}>
        <div className="flex h-full flex-col items-center">
          <span className="rounded-[10px] bg-[#0e0e10] px-3.5 py-1.5 text-[0.78rem] font-bold text-white">Startseite</span>
          <span className="h-3 w-px bg-[#c9ccd2]" />
          <span className="h-px w-[78%] bg-[#c9ccd2]" />
          <div className="flex w-[90%] justify-between">
            {city.trade.pages.map((t, k) => (
              <div key={t} className="flex flex-col items-center">
                <span className="h-3 w-px bg-[#c9ccd2]" />
                <span className={`rounded-[9px] px-2.5 py-1.5 text-[0.7rem] font-bold ${k === 0 ? "bg-[#007aff] text-white" : "bg-white text-[#424245]"}`}>{t}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {city.spots.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-[#0e0e10]"><MapPin size={10} strokeWidth={2.6} className="text-[#ea4335]" />{t}</span>
            ))}
          </div>
        </div>
      </div>
    );
  if (art === "article")
    return (
      <div className={box}>
        <div className="h-full rounded-[12px] bg-white p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#86868b]">Ratgeber · 5 Min.</p>
          <p className="mt-1.5 text-[1.08rem] font-bold leading-[1.1] tracking-[-0.035em]">{city.trade.article}</p>
          <p className="mt-2.5 rounded-[10px] bg-[#eaf3ff] px-3 py-2 text-[0.74rem] font-medium leading-snug text-[#0e0e10] shadow-[inset_3px_0_0_#007aff]">Die kurze Antwort steht ganz oben, klar und mit Ort.</p>
          <span className="mt-2.5 block h-1.5 w-[80%] rounded-full bg-[#e3e6ec]" />
        </div>
      </div>
    );
  if (art === "report")
    return (
      <div className={box}>
        <div className="h-full rounded-[12px] bg-white p-3.5">
          <div className="flex items-baseline justify-between">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#007aff]">Monatsbericht</p>
            <p className="text-[0.66rem] font-semibold text-[#86868b]">„Maler {city.name}“</p>
          </div>
          <svg viewBox="0 0 260 96" className="mt-2 h-[100px] w-full" aria-hidden>
            {[16, 40, 64, 88].map((y) => <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="#eef0f3" strokeWidth="1.5" />)}
            <polyline points="8,86 50,78 92,70 134,52 176,40 218,24 252,14" fill="none" stroke="#007aff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="252" cy="14" r="5" fill="#007aff" />
          </svg>
          <p className="text-[0.66rem] font-semibold text-[#6b7280]">Position bei Google, Monat für Monat · Beispiel</p>
        </div>
      </div>
    );
  return (
    <div className={box}>
      <div className="grid grid-cols-3 gap-1.5">
        {[["Anrufen", "#34c759"], ["WhatsApp", "#25d366"], ["Formular", "#007aff"]].map(([t, c]) => (
          <span key={t} className="rounded-full py-2 text-center text-[0.7rem] font-bold text-white" style={{ background: c }}>{t}</span>
        ))}
      </div>
      <div className="mt-3 rounded-[12px] bg-white p-3">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#007aff]">Monatsbericht</p>
        <div className="mt-2 flex h-[64px] items-end gap-1.5">
          {[0.3, 0.42, 0.38, 0.55, 0.68, 0.9].map((h, i) => (
            <span key={i} className={`flex-1 rounded-t-[4px] ${i === 5 ? "bg-[#007aff]" : "bg-[#d9e6fb]"}`} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CitySteps({ city, rise }: { city: City; rise: (d?: number) => object }) {
  return (
    <section className="bg-white py-20 text-[#0e0e10] md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <motion.div {...rise()} className="lg:text-center">
          <H2>{city.stepsTitle}</H2>
        </motion.div>
        {/* one line down the page; desktop: the steps zig-zag left and right of it, phones: the line runs down the left */}
        {/* phones and tablets: the four steps as an accordion, like Unser Prozess */}
        <StepAccordion city={city} />
        <ol className="relative mt-20 hidden lg:block">
          <span aria-hidden className="absolute bottom-10 left-1/2 top-2 w-[2px] -translate-x-1/2 bg-[#dfe4ec]" />
          {city.steps.map((st, i) => {
            const flip = i % 2 === 1; // desktop: picture right, text left
            return (
              <motion.li key={st.title} {...rise(0.05)} className={`relative pb-14 pl-12 last:pb-0 lg:grid lg:grid-cols-2 lg:items-center lg:gap-24 lg:pb-24 lg:pl-0`}>
                <span className="absolute left-0 top-0 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#007aff] text-[0.8rem] font-bold tabular-nums text-white ring-[6px] ring-white lg:left-1/2 lg:top-1/2 lg:h-11 lg:w-11 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:text-[1rem]">
                  {i + 1}
                </span>
                <div className={`rounded-[26px] bg-[#f5f5f7] p-5 md:p-10 ${flip ? "lg:order-2" : ""}`}>
                  <div className="mx-auto max-w-[360px] md:origin-center md:scale-[1.12]">
                    <StepArt art={st.art} city={city} />
                  </div>
                </div>
                <div className={`mt-5 lg:mt-0 ${flip ? "lg:order-1 lg:text-right" : ""}`}>
                  <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Schritt {i + 1}</p>
                  <p className="mt-2 text-[clamp(1.5rem,2.6vw,2.3rem)] font-bold leading-[1.05] tracking-[-0.045em]">{st.title}</p>
                  <p className={`mt-3 max-w-[44ch] text-[1rem] font-medium leading-[1.55] tracking-[-0.015em] text-[#424245] md:text-[1.08rem] ${flip ? "lg:ml-auto" : ""}`}>{st.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* the areas: phones get one switch (Stadtteile | Umgebung) showing one full list; desktop shows both lists */
function AreaChips({ city }: { city: City }) {
  const [tab, setTab] = useState<"d" | "n">("d");
  const chip = "rounded-full px-3 py-1.5 text-[0.82rem] font-semibold tracking-[-0.01em] md:px-3.5 md:py-2 md:text-[0.9rem]";
  const list = (items: string[], outline: boolean, center = false) => (
    <ul className={`flex flex-wrap gap-1.5 md:gap-2 ${center ? "justify-center" : ""}`}>
      {items.map((d) => (
        <li key={d} className={`${chip} ${outline ? "border border-black/[0.08] text-[#424245]" : "bg-[#f5f5f7] text-[#0e0e10]"}`}>{d}</li>
      ))}
    </ul>
  );
  return (
    <>
      <div className="md:hidden">
        <div role="tablist" aria-label="Gebiete" className="grid grid-cols-2 gap-1 rounded-full bg-[#f5f5f7] p-1">
          {[["d", `Stadtteile (${city.districts.length})`], ["n", `Umgebung (${city.nearby.length})`]].map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k as "d" | "n")}
              className={`min-h-10 rounded-full text-[0.86rem] font-bold tracking-[-0.02em] transition-colors duration-300 ${tab === k ? "bg-white text-[#0e0e10] shadow-[0_2px_10px_-4px_rgba(15,23,42,0.3)]" : "text-[#6b7280]"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mt-4">
          {tab === "d" ? list(city.districts, false) : list(city.nearby, true)}
        </div>
      </div>
      <div className="hidden md:block">
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Alle Stadtteile</p>
        <div className="mt-4">{list(city.districts, false, true)}</div>
        <p className="mt-8 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#007aff]">Und drumherum</p>
        <div className="mt-4">{list(city.nearby, true, true)}</div>
      </div>
    </>
  );
}

/* phones: the four steps as an accordion, in the style of the homepage's "Unser Prozess" (one open at a time) */
function StepAccordion({ city }: { city: City }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);
  return (
    <ol className="mt-8 border-t border-[#d8dde7] lg:hidden">
      {city.steps.map((st, i) => {
        const on = open === i;
        return (
          <li key={st.title} className="border-b border-[#d8dde7]">
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? -1 : i)}
              className="flex w-full items-start gap-4 py-5 text-left"
            >
              <span className="mt-1.5 min-w-6 text-[0.75rem] font-bold tabular-nums text-[#0e0e10]/70">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex-1 text-[1.6rem] font-bold uppercase leading-[0.98] tracking-[-0.04em] transition-colors duration-200 ${on ? "text-[#007aff]" : "text-[#0e0e10]/[0.2]"}`}>{st.title}</span>
              <Plus aria-hidden size={20} className={`mt-1 flex-none transition-transform duration-200 ${on ? "rotate-45 text-[#007aff]" : "text-[#0e0e10]/30"}`} />
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pl-10">
                    <p className="text-[0.98rem] font-medium leading-[1.55] tracking-[-0.015em] text-[#6b7280]">{st.body}</p>
                    <div className="mt-4">
                      <StepArt art={st.art} city={city} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

/* "Mehr für Betriebe in <city>": the two services that fit next, linking to their city page where one exists */
const NEXT: Record<ServiceKey, [ServiceKey, ServiceKey]> = { web: ["seo", "ads"], seo: ["web", "ads"], ads: ["seo", "web"], ai: ["seo", "web"], content: ["web", "seo"] };
function related(city: City) {
  const text: Record<ServiceKey, { label: string; text: string }> = {
    web: { label: "Damit Besucher anfragen", text: `Eine Website für ${city.name}, die Besucher direkt zur Anfrage führt.` },
    seo: { label: "Damit dich mehr Leute finden", text: `Bei Google gefunden werden, wenn jemand in ${city.name} sucht, was du anbietest.` },
    ads: { label: "Damit sofort Anfragen kommen", text: "Anzeigen genau dort, wo deine Kunden suchen. Mit festem Budget und Monatsbericht." },
    ai: { label: "Damit KI-Assistenten dich kennen", text: "Klare Informationen über deinen Betrieb, die ChatGPT, Claude und Gemini nutzen." },
    content: { label: "Damit man dich kennt", text: "Videos und Posts, die zeigen, was du kannst. Gedreht bei dir vor Ort." },
  };
  const own = CITIES.find((c) => c.slug === city.slug);
  return NEXT[city.service].map((k) => ({
    href: own?.pages[k] ? `/leistungen/${SERVICE_SLUG[k]}/${city.slug}` : SERVICE[k],
    title: own?.pages[k] ? `${SERVICE_LABEL[k]} in ${city.name}` : SERVICE_LABEL[k],
    ...text[k],
  }));
}
