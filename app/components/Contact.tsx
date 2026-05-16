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
    <section id="contact" className="bg-[#fafafa] px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl border-b border-black/5 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl text-center"
        >
          <p className="mb-6 text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-[#0070e3]">
            {t("contact.label", lang)}
          </p>
          <h2
            className="mb-7 text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[0.98] tracking-[-0.035em]"
            style={{ fontWeight: 600 }}
          >
            <span className="block lg:whitespace-nowrap">{t("contact.title1", lang)}</span>
            <span className="block text-[#8e8e93] lg:whitespace-nowrap">{t("contact.title2", lang)}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[1.125rem] leading-relaxed text-muted-foreground">
            {t("contact.description", lang)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-2"
        >
          {contactMethods.map(({ title, description, href, action, Icon }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group rounded-[1.75rem] border border-black/5 bg-white/70 p-6 text-left shadow-[0_20px_60px_-35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_-35px_rgba(0,0,0,0.24)]"
            >
              <div className="mb-8 flex items-center justify-between">
                <Icon size={23} className="text-[#0071e3]" strokeWidth={1.9} />
                <ArrowUpRight
                  size={18}
                  className="text-[#8e8e93] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0071e3]"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="mb-2 text-[1.05rem] font-semibold tracking-[-0.01em] text-[#111111]">
                {title}
              </h3>
              <p className="mb-5 min-h-[2.6rem] text-[0.9rem] leading-relaxed text-muted-foreground">
                {description}
              </p>
              <span className="text-[0.9rem] font-semibold text-[#0071e3]">{action}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
