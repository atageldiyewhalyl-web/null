import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { NavBar } from "./HeroV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { LANDMARKS } from "./CityPageV2";
import { CITIES, SERVICE_LABEL, SERVICE_SLUG, type ServiceKey } from "./cities";

/*
 * /standorte: the overview of every city page (Halyl, 12 Nov 2026), built like the Referenzen page:
 * a centred intro, then one card per city with its drawn landmark, the districts and towns it covers,
 * and a link to each service page in that city. Data: cities.ts (a new city shows up here by itself).
 */

const EASE = [0.22, 1, 0.36, 1] as const;
// soft tint per city, behind the landmark
const TINT: Record<string, string> = {
  mannheim: "#fbf1ea",
  frankfurt: "#eef3fb",
  heidelberg: "#f6efe9",
  berlin: "#f1f2f5",
  hamburg: "#edf3f7",
  muenchen: "#f0f5f1",
  koeln: "#f2f1ef",
  stuttgart: "#f0f6ec",
  duesseldorf: "#eef2f8",
};

export const STANDORTE = "/standorte";

export default function StandorteV2() {
  const reduce = useReducedMotion();
  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} />
      </div>
      <main className="bg-white text-[#0e0e10]">
        <section className="pb-24 pt-12 md:pb-32 md:pt-20">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="mx-auto max-w-[900px] text-center">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Standorte</p>
              <h1 className="mx-auto mt-4 max-w-[17ch] text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
                Gefunden werden, wo deine Kunden suchen<span className="text-[#007aff]">.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-[48ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">
                Websites, SEO, Google Ads, KI-Sichtbarkeit und Content für Betriebe in {CITIES.length} Städten. Wähle deine Stadt und deine Leistung.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-5">
              {CITIES.map((c, i) => {
                const Landmark = LANDMARKS[c.landmark ?? "wasserturm"];
                const services = (Object.keys(SERVICE_SLUG) as ServiceKey[]).filter((k) => c.pages[k]);
                return (
                  <motion.article
                    key={c.slug}
                    id={c.slug}
                    initial={reduce ? false : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: reduce ? 0 : (i % 3) * 0.08, ease: EASE }}
                    className="flex scroll-mt-28 flex-col overflow-hidden rounded-[24px] bg-[var(--tint)]"
                    style={{ "--tint": TINT[c.slug] ?? "#f5f5f7" } as React.CSSProperties}
                  >
                    {/* the landmark, cropped to its upper part on phones */}
                    <div aria-hidden className="relative flex h-[150px] items-end justify-center overflow-hidden pt-4 md:h-[280px] md:pt-6">
                      <Landmark className="h-[210px] w-auto translate-y-[18%] md:h-[360px]" />
                    </div>
                    <div className="flex flex-1 flex-col bg-white/70 px-6 pb-6 pt-5 backdrop-blur-sm md:px-7 md:pb-7">
                      <h2 className="text-[clamp(1.9rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.055em]">
                        {c.name}
                        <span className="text-[#007aff]">.</span>
                      </h2>
                      <p className="mt-2 flex items-start gap-1.5 text-[0.88rem] font-semibold leading-snug text-[#6b7280]">
                        <MapPin size={15} strokeWidth={2.4} className="mt-0.5 flex-none text-[#007aff]" />
                        <span>
                          {c.districts.length} Stadtteile, dazu {c.nearby.slice(0, 3).join(", ")} und mehr
                        </span>
                      </p>
                      <ul className="mt-4 grid grid-cols-2 gap-1.5 md:mt-5 md:grid-cols-1 md:gap-1">
                        {services.map((k) => (
                          <li key={k}>
                            <a
                              href={`/leistungen/${SERVICE_SLUG[k]}/${c.slug}`}
                              className="group flex items-center justify-between gap-1 rounded-[12px] bg-white px-3 py-2 text-[0.86rem] font-semibold tracking-[-0.02em] text-[#0e0e10] transition-colors hover:bg-white md:bg-transparent md:py-2.5 md:text-[0.98rem]"
                            >
                              <span>
                                {SERVICE_LABEL[k]}
                                <span className="hidden md:inline"> in {c.name}</span>
                              </span>
                              <ArrowUpRight size={16} strokeWidth={2.4} className="flex-none text-[#007aff] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}
