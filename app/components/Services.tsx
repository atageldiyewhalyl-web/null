import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Services() {
  const { lang } = useLanguage();

  const cardBase =
    "group rounded-[2rem] bg-[#fafafa] border border-black/[0.06] p-7 md:p-8 flex flex-col justify-between min-h-[17rem] relative overflow-hidden transition-shadow hover:shadow-md";

  return (
    <section id="services" className="py-24 md:py-36 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-20 items-end mb-16 md:mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-6"
            >
              {t("services.label", lang)}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-[#0e0e10]"
            >
              {t("services.title1", lang)}{" "}
              <span className="text-[#86868b]">{t("services.title2", lang)}</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-[1.0625rem] md:text-[1.1875rem] text-[#86868b] leading-relaxed font-medium"
          >
            {t("services.description", lang)}
          </motion.p>
        </div>

        {/* ── Bento Grid ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">

          {/* Card 1 — Law Firm Website (large) */}
          <motion.div
            className={`lg:col-span-7 ${cardBase}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-[0.75rem] tracking-[0.14em] uppercase text-[#007aff] font-bold mb-3 opacity-70">
                01
              </p>
              <h3 className="text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 text-[#0e0e10]">
                {t("services.webdesign", lang)}
              </h3>
              <p className="text-[0.9375rem] text-[#86868b] leading-relaxed max-w-md">
                {t("services.webdesign.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-6 text-[0.875rem] font-semibold text-[#007aff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={15} />
            </div>
          </motion.div>

          {/* Card 2 — Technical Development */}
          <motion.div
            className={`lg:col-span-5 ${cardBase}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div>
              <p className="text-[0.75rem] tracking-[0.14em] uppercase text-[#007aff] font-bold mb-3 opacity-70">
                02
              </p>
              <h3 className="text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 text-[#0e0e10]">
                {t("services.development", lang)}
              </h3>
              <p className="text-[0.9375rem] text-[#86868b] leading-relaxed">
                {t("services.development.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-6 text-[0.875rem] font-semibold text-[#007aff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={15} />
            </div>
          </motion.div>

          {/* Card 3 — SEO (upsell) */}
          <motion.div
            className={`lg:col-span-4 ${cardBase} border-[#007aff]/20 bg-[#f0f7ff]`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            {/* Upsell badge */}
            <span className="absolute top-6 right-6 text-[0.6875rem] font-bold tracking-wide bg-[#007aff] text-white px-3 py-1 rounded-full">
              {t("services.seo.upsell", lang)}
            </span>
            <div>
              <p className="text-[0.75rem] tracking-[0.14em] uppercase text-[#007aff] font-bold mb-3 opacity-70">
                03
              </p>
              <h3 className="text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 text-[#0e0e10]">
                {t("services.seo", lang)}
              </h3>
              <p className="text-[0.9375rem] text-[#86868b] leading-relaxed">
                {t("services.seo.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-6 text-[0.875rem] font-semibold text-[#007aff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={15} />
            </div>
          </motion.div>

          {/* Card 4 — Brand Identity */}
          <motion.div
            className={`lg:col-span-4 ${cardBase}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <div>
              <p className="text-[0.75rem] tracking-[0.14em] uppercase text-[#007aff] font-bold mb-3 opacity-70">
                04
              </p>
              <h3 className="text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 text-[#0e0e10]">
                {t("services.branding", lang)}
              </h3>
              <p className="text-[0.9375rem] text-[#86868b] leading-relaxed">
                {t("services.branding.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-6 text-[0.875rem] font-semibold text-[#007aff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={15} />
            </div>
          </motion.div>

          {/* Card 5 — Monthly Care (dark retainer) */}
          <motion.div
            className="lg:col-span-4 group rounded-[2rem] bg-[#0e0e10] border border-white/5 p-7 md:p-8 flex flex-col justify-between min-h-[17rem] relative overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <div>
              <p className="text-[0.75rem] tracking-[0.14em] uppercase text-white/30 font-bold mb-3">
                05
              </p>
              <h3 className="text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 text-white">
                {t("services.maintenance", lang)}
              </h3>
              <p className="text-[0.9375rem] text-white/50 leading-relaxed">
                {t("services.maintenance.desc", lang)}
              </p>
            </div>
            {/* Retainer badge */}
            <div className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t("services.maintenance.badge", lang)}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}