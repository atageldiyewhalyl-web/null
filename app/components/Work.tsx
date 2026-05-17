import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage, t } from "./LanguageContext";
import { ImageComparison } from "./ui/image-comparison-slider";

// @ts-ignore – vite-imagetools resolves these at build time
import dogruOld from "../assets/Dogru kanzlei/Dogru kanzlei old.png";
// @ts-ignore – vite-imagetools resolves these at build time
import dogruNew from "../assets/Dogru kanzlei/Dogru kanzlei new.png";
// @ts-ignore – vite-imagetools resolves these at build time
import dogruLogo from "../assets/Dogru kanzlei/logo.png";
// @ts-ignore – vite-imagetools resolves these at build time
import besirYamanImage from "../assets/Besir yaman /Besiryaman .png?format=webp&w=1400";
// @ts-ignore – vite-imagetools resolves these at build time
import besirYamanLogo from "../assets/Besir yaman /by-logo.png";
import herkulesHeroVideoMp4 from "../assets/Herkules/hero-video.mp4";
import herkulesHeroVideoPoster from "../assets/Herkules/hero-video-poster.webp";
import herkulesHeroVideoWebm from "../assets/Herkules/hero-video.webm";
// @ts-ignore – vite-imagetools resolves these at build time
import herkulesLogo from "../assets/Herkules/Herkules Logo.png";

const projects = [
  {
    id: "herkules",
    title: "Herkules Umzüge Mannheim",
    categoryKey: "work.herkules.category",
    descKey: "work.herkules.desc",
    videoMp4: herkulesHeroVideoMp4,
    videoPoster: herkulesHeroVideoPoster,
    videoWebm: herkulesHeroVideoWebm,
    clientLogo: herkulesLogo,
    clientLogoAlt: "Herkules Umzüge logo",
    clientLogoClassName: "h-8 md:h-9 w-auto",
    link: "https://www.umzuege-herkules.de/",
    isComparison: false
  },
  {
    id: "dogru",
    title: "Law Firm Website",
    categoryKey: "work.dogru.category",
    descKey: "work.dogru.desc",
    image: dogruNew,
    beforeImage: dogruOld,
    clientLogo: dogruLogo,
    clientLogoAlt: "Doğru Kanzlei logo",
    clientLogoClassName: "h-9 md:h-10 w-auto",
    link: "https://hasandogru.de",
    isComparison: true
  },
  {
    id: "besir",
    title: "Consultant Website",
    categoryKey: "work.besir.category",
    descKey: "work.besir.desc",
    image: besirYamanImage,
    clientLogo: besirYamanLogo,
    clientLogoAlt: "Besir Yaman logo",
    clientLogoClassName: "h-8 md:h-9 w-auto",
    link: "https://www.besiryaman-mentoring.de",
    isComparison: false
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
                className={`w-full overflow-hidden rounded-xl md:rounded-2xl bg-neutral-100 mb-5 md:mb-8 relative ${
                  project.videoWebm ? "aspect-[1904/982]" : "aspect-video"
                }`}
              >
                {project.videoWebm ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                    aria-label={project.title}
                  >
                    <video
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                      autoPlay
                      muted
                      playsInline
                      poster={project.videoPoster}
                      preload="metadata"
                    >
                      <source src={project.videoWebm} type="video/webm" />
                      <source src={project.videoMp4} type="video/mp4" />
                    </video>
                  </a>
                ) : project.isComparison ? (
                  <div className="w-full h-full pointer-events-auto">
                    <ImageComparison
                      beforeImage={project.beforeImage}
                      afterImage={project.image}
                      altBefore="Old website"
                      altAfter="Transformed website"
                    />
                  </div>
                ) : (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </a>
                )}
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
