import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Contact() {
  const { lang } = useLanguage();

  const contactMethods = [
    {
      title: "WhatsApp",
      description: t("contact.whatsapp.cta", lang),
      href: "https://wa.me/491627176334",
      action: lang === "tr" ? "Mesaj gönder" : lang === "de" ? "Nachricht senden" : "Send message",
      Icon: MessageSquare,
    },
    {
      title: "Email",
      description: t("contact.email.cta", lang),
      href: "mailto:info@nüll.com",
      action: "info@nüll.com",
      Icon: Mail,
    },
  ];

  return (
    <section id="contact" className="bg-[#fafafa] px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl border-b border-black/5 pb-10 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl text-center"
        >
          <p className="mb-5 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[#0070e3] md:mb-6 md:text-[0.8125rem] md:tracking-[0.15em]">
            {t("contact.label", lang)}
          </p>
          <h2
            className="mx-auto mb-5 max-w-[21rem] text-[clamp(2rem,8.8vw,2.35rem)] leading-[0.96] tracking-[-0.045em] md:mb-7 md:max-w-none md:text-[clamp(2.25rem,4.4vw,3.5rem)] md:leading-[0.98] md:tracking-[-0.035em]"
            style={{ fontWeight: 600 }}
          >
            <span className="block md:mx-auto md:max-w-[58rem] lg:whitespace-nowrap">{t("contact.title1", lang)}</span>
            <span className="block text-[#8e8e93] md:mx-auto md:max-w-[58rem] lg:whitespace-nowrap">{t("contact.title2", lang)}</span>
          </h2>
          <p className="mx-auto max-w-[19.5rem] text-[0.98rem] leading-[1.55] text-muted-foreground md:max-w-2xl md:text-[1.125rem] md:leading-relaxed">
            {t("contact.description", lang)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 md:mt-12 md:grid-cols-2"
        >
          {contactMethods.map(({ title, description, href, action, Icon }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex min-h-[6.75rem] items-center gap-4 rounded-[1.35rem] border border-black/5 bg-white/80 p-4 text-left shadow-[0_18px_45px_-34px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_-35px_rgba(0,0,0,0.24)] md:block md:min-h-0 md:rounded-[1.75rem] md:bg-white/70 md:p-6"
            >
              <div className="flex shrink-0 items-center justify-between md:mb-8">
                <Icon size={22} className="text-[#0071e3]" strokeWidth={1.9} />
                <ArrowUpRight
                  size={18}
                  className="hidden text-[#8e8e93] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0071e3] md:block"
                  strokeWidth={1.8}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="mb-1 text-[1rem] font-semibold tracking-[-0.01em] text-[#111111] md:mb-2 md:text-[1.05rem]">
                    {title}
                  </h3>
                  <ArrowUpRight
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8e8e93] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0071e3] md:hidden"
                    strokeWidth={1.8}
                  />
                </div>
                <p className="mb-2 text-[0.82rem] leading-snug text-muted-foreground md:mb-5 md:min-h-[2.6rem] md:text-[0.9rem] md:leading-relaxed">
                  {description}
                </p>
                <span className="text-[0.84rem] font-semibold text-[#0071e3] md:text-[0.9rem]">{action}</span>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
