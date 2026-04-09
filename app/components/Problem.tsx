import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLanguage, t } from "./LanguageContext";

export function Problem() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-fidelity scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity1 = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0.3, 1, 0.3]);
  const scale1 = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0.95, 1, 0.95]);
  
  const opacity2 = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0.3, 1, 0.3]);
  const scale2 = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0.95, 1, 0.95]);
  
  const opacity3 = useTransform(scrollYProgress, [0.7, 0.85, 0.95], [0.3, 1, 0.3]);
  const scale3 = useTransform(scrollYProgress, [0.7, 0.85, 0.95], [0.95, 1, 0.95]);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 md:py-64 px-4 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Sticky Narrative Header */}
          <div className="lg:sticky lg:top-40 max-w-xl">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.875rem] tracking-[0.15em] uppercase text-[#007aff] font-bold mb-6"
            >
              The Reality
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-tight leading-[1.1] mb-8 text-[#0e0e10]"
            >
              {t("problem.header", lang)}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[1.25rem] md:text-[1.5rem] text-[#86868b] font-medium leading-relaxed"
            >
              {t("problem.subHeader", lang)}
            </motion.p>
          </div>

          {/* Scrolling Pain Points */}
          <div className="space-y-40 md:space-y-64 pt-20 lg:pt-0 pb-40">
            {/* Point 1 */}
            <motion.div 
              style={{ opacity: opacity1, scale: scale1 }}
              className="flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[1.25rem] font-bold text-[#0e0e10]">
                1
              </div>
              <p className="text-[1.75rem] md:text-[2.5rem] font-semibold leading-[1.3] tracking-tight text-[#0e0e10]">
                {t("problem.p1", lang)}
              </p>
            </motion.div>

            {/* Point 2 */}
            <motion.div 
              style={{ opacity: opacity2, scale: scale2 }}
              className="flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[1.25rem] font-bold text-[#0e0e10]">
                2
              </div>
              <p className="text-[1.75rem] md:text-[2.5rem] font-semibold leading-[1.3] tracking-tight text-[#0e0e10]">
                {t("problem.p2", lang)}
              </p>
            </motion.div>

            {/* Point 3 */}
            <motion.div 
              style={{ opacity: opacity3, scale: scale3 }}
              className="flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[1.25rem] font-bold text-[#0e0e10]">
                3
              </div>
              <p className="text-[1.75rem] md:text-[2.5rem] font-semibold leading-[1.3] tracking-tight text-[#0e0e10]">
                {t("problem.p3", lang)}
              </p>
            </motion.div>
          </div>
        </div>

        {/* The Turn (The Solution Bridge) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 md:mt-40 pt-20 border-t border-[#d2d2d7]/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-[#f5f5f7] rounded-[3rem] p-8 md:p-16">
            <h3 className="text-[2rem] md:text-[3rem] font-bold tracking-tight text-[#0e0e10] max-w-2xl leading-[1.1]">
              {t("problem.turn", lang)}
            </h3>
            <div className="h-px w-full md:w-20 bg-[#d2d2d7]" />
            <div className="shrink-0 p-8 rounded-full bg-white border border-[#d2d2d7]/50 shadow-xl">
               <div className="w-16 h-16 rounded-full bg-[#007aff] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-6 h-6 border-t-4 border-r-4 border-white rotate-45 ml-[-4px]"
                  />
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
