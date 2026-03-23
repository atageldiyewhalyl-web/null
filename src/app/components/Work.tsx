import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage, t } from "./LanguageContext";
import d3BeautyImage from "../../assets/473bb093f01af6c805c30e6d4d64e82d9ede35f4.png";
import besirYamanImage from "../../assets/screenshot_21_12_26.png";

const projects = [
  {
    title: "D3 Beauty Salon",
    categoryKey: "work.d3.category",
    descKey: "work.d3.desc",
    image: d3BeautyImage,
    link: "https://d3-beuty-salon.vercel.app",
  },
  {
    title: "Besir Yaman",
    categoryKey: "work.besir.category",
    descKey: "work.besir.desc",
    image: besirYamanImage,
    link: "https://besir-yaman-b2b.vercel.app",
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
          className="text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.02em] mb-12 md:mb-20"
        >
          {t("work.title", lang)}
        </motion.h2>

        <div className="space-y-16 md:space-y-24">
          {projects.map((project, i) => (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="block group"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl md:rounded-2xl bg-neutral-100 mb-5 md:mb-8">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-neutral-500 text-xs md:text-sm mb-1.5 md:mb-2">
                    {t(project.categoryKey, lang)}
                  </p>
                  <h3 className="mb-2 md:mb-3 text-[1.125rem] md:text-[1.5rem]">{project.title}</h3>
                  <p className="text-neutral-600 max-w-2xl text-[0.875rem] md:text-base">
                    {t(project.descKey, lang)}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 group-hover:text-black transition-colors mt-1 flex-shrink-0" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}