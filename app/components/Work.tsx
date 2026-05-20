import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage, t } from "./LanguageContext";

// @ts-ignore – vite-imagetools resolves these at build time
import dogruHeroDemo from "../assets/Hasan Hero Demo.webp";
// @ts-ignore – vite-imagetools resolves these at build time
import besirYamanHeroDemo from "../assets/BY Hero Demo.webp";
// @ts-ignore – vite-imagetools resolves these at build time
import besirYamanLogo from "../assets/Besir yaman /by-logo.png";
// @ts-ignore – vite-imagetools resolves these at build time
import herkulesHeroDemo from "../assets/Herkules Hero Demo.webp";
// @ts-ignore – vite-imagetools resolves these at build time
import herkulesLogo from "../assets/Herkules/Herkules Logo.png";
// @ts-ignore – vite-imagetools resolves these at build time
import dogruLogo from "../assets/Dogru kanzlei/logo.png";
// @ts-ignore – vite-imagetools resolves these at build time
import spineHeroDemo from "../assets/spine demo.webp";

const projects = [
  {
    id: "herkules",
    title: "Herkules Umzüge Mannheim",
    categoryKey: "work.herkules.category",
    descKey: "work.herkules.desc",
    image: herkulesHeroDemo,
    clientLogo: herkulesLogo,
    clientLogoAlt: "Herkules Umzüge logo",
    clientLogoClassName: "h-8 md:h-9 w-auto",
    link: "https://www.umzuege-herkules.de/",
  },
  {
    id: "besir",
    title: "Consultant Website",
    categoryKey: "work.besir.category",
    descKey: "work.besir.desc",
    image: besirYamanHeroDemo,
    clientLogo: besirYamanLogo,
    clientLogoAlt: "Besir Yaman logo",
    clientLogoClassName: "h-8 md:h-9 w-auto",
    link: "https://www.besiryaman-mentoring.de",
  },
  {
    id: "dogru",
    title: "Law Firm Website",
    categoryKey: "work.dogru.category",
    descKey: "work.dogru.desc",
    image: dogruHeroDemo,
    clientLogo: dogruLogo,
    clientLogoAlt: "Doğru Kanzlei logo",
    clientLogoClassName: "h-9 md:h-10 w-auto",
    link: "https://hasandogru.de",
  },
  {
    id: "spine",
    title: "Spine Robotics",
    categoryKey: "work.spine.category",
    descKey: "work.spine.desc",
    image: spineHeroDemo,
    clientLogo: null,
    clientLogoAlt: "",
    clientLogoClassName: "",
    link: "https://spine-robotics.vercel.app/",
  },
];

export function Work() {
  const { lang } = useLanguage();

  return (
    <section id="work" className="py-20 md:py-32 px-4 md:px-12 lg:px-24" aria-label="Selected work">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#0071e3] text-[0.8125rem] uppercase tracking-[0.1em] mb-4"
        >
          {t("work.label", lang)}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 whitespace-nowrap text-[clamp(1.42rem,6vw,1.68rem)] tracking-[-0.06em] md:mb-20 md:text-[clamp(1.75rem,4vw,2.75rem)] md:tracking-[-0.02em]"
        >
          {t("work.title", lang)}
        </motion.h2>

        <div className="space-y-16 md:space-y-24">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="block group"
            >
              {project.clientLogo ? (
                <div className="mb-4 flex items-center gap-3 md:gap-4">
                  <img
                    src={project.clientLogo}
                    alt={project.clientLogoAlt}
                    className={`${project.clientLogoClassName} object-contain`}
                  />
                  <span className="text-[1.05rem] font-semibold text-neutral-300" aria-hidden="true">
                    ×
                  </span>
                  <span className="text-[1.35rem] font-bold tracking-[-0.03em] text-[#0e0e10]">
                    nüll<span className="text-[#0071e3]">.</span>
                  </span>
                </div>
              ) : null}
              <div
                className="relative mb-5 aspect-video w-full overflow-visible md:mb-8"
              >
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </a>
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-1">
                  <p className="text-neutral-500 text-xs md:text-sm mb-1.5 md:mb-2">
                    {t(project.categoryKey, lang)}
                  </p>
                  <h3 className="mb-2 md:mb-3 text-[1.125rem] md:text-[1.5rem] group-hover:text-[#0071e3] transition-colors">{project.title}</h3>
                  <p className="text-neutral-600 max-w-2xl text-[0.875rem] md:text-base">
                    {t(project.descKey, lang)}
                  </p>
                </a>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 group-hover:text-black transition-colors mt-1 flex-shrink-0" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
