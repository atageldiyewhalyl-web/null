import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Services() {
  const { lang } = useLanguage();

  return (
    <section id="services" className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-10 md:mb-12">
          <p className="text-[0.875rem] tracking-[0.1em] uppercase text-[#0071e3] mb-4">
            {t("services.label", lang)}
          </p>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] leading-[1.15] mb-6"
            style={{ fontWeight: 600 }}
          >
            {t("services.title1", lang)}
            <br />
            {t("services.title2", lang)}
          </h2>
          <p className="text-[1.0625rem] text-muted-foreground leading-relaxed">
            {t("services.description", lang)}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">
          {/* Web Design */}
          <motion.div
            className="lg:col-span-7 group rounded-3xl bg-[#fafafa] border border-black/5 p-7 md:p-8 flex flex-col justify-between min-h-[16rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h3
                className="text-[1.1875rem] md:text-[1.3125rem] tracking-[-0.02em] mb-2"
                style={{ fontWeight: 600 }}
              >
                {t("services.webdesign", lang)}
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed max-w-md">
                {t("services.webdesign.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[0.875rem] text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={14} />
            </div>
          </motion.div>

          {/* Development */}
          <motion.div
            className="lg:col-span-5 group rounded-3xl bg-[#fafafa] border border-black/5 p-7 md:p-8 flex flex-col justify-between min-h-[16rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div>
              <h3
                className="text-[1.1875rem] md:text-[1.3125rem] tracking-[-0.02em] mb-2"
                style={{ fontWeight: 600 }}
              >
                {t("services.development", lang)}
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
                {t("services.development.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[0.875rem] text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={14} />
            </div>
          </motion.div>

          {/* SEO */}
          <motion.div
            className="lg:col-span-4 group rounded-3xl bg-[#fafafa] border border-black/5 p-7 md:p-8 flex flex-col justify-between min-h-[14rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div>
              <h3
                className="text-[1.125rem] tracking-[-0.01em] mb-2"
                style={{ fontWeight: 600 }}
              >
                {t("services.seo", lang)}
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
                {t("services.seo.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[0.8125rem] text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={14} />
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div
            className="lg:col-span-4 group rounded-3xl bg-[#fafafa] border border-black/5 p-7 md:p-8 flex flex-col justify-between min-h-[14rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <div>
              <h3
                className="text-[1.125rem] tracking-[-0.01em] mb-2"
                style={{ fontWeight: 600 }}
              >
                {t("services.branding", lang)}
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
                {t("services.branding.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[0.8125rem] text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={14} />
            </div>
          </motion.div>

          {/* Maintenance */}
          <motion.div
            className="lg:col-span-4 group rounded-3xl bg-[#fafafa] border border-black/5 p-7 md:p-8 flex flex-col justify-between min-h-[14rem]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <div>
              <h3
                className="text-[1.125rem] tracking-[-0.01em] mb-2"
                style={{ fontWeight: 600 }}
              >
                {t("services.maintenance", lang)}
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
                {t("services.maintenance.desc", lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[0.8125rem] text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t("services.learnMore", lang)} <ArrowUpRight size={14} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}