import { ArrowUpRight, Phone } from "lucide-react";
import { motion } from "motion/react";
import gmailIcon from "../assets/icons/gmail-icon.webp";
import whatsappIcon from "../assets/icons/whatsapp-icon.webp";
import { useLanguage, t } from "./LanguageContext";
import { getContactGoogleAdsConversion, trackGaEvent, trackGoogleAdsConversion } from "../utils/tracking";

type ContactMethod = {
  title: string;
  description: string;
  href: string;
  action: string;
  icon?: string;
  Icon?: typeof Phone;
  eventName: string;
};

const whatsappPrefilledMessage =
  "Hallo%20n%C3%BCll%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20neue%20Website%20f%C3%BCr%20meine%20Praxis.%20K%C3%B6nnen%20Sie%20mir%20kurz%20sagen%2C%20wie%20eine%20Zusammenarbeit%20abl%C3%A4uft%3F";

export function Contact() {
  const { lang } = useLanguage();

  const contactMethods: ContactMethod[] = [
    {
      title: "WhatsApp",
      description: t("contact.whatsapp.cta", lang),
      href: `https://wa.me/4915256569852?text=${whatsappPrefilledMessage}`,
      action: lang === "tr" ? "Mesaj gönder" : lang === "de" ? "Nachricht senden" : "Send message",
      icon: whatsappIcon,
      eventName: "whatsapp_click",
    },
    {
      title: lang === "de" ? "Anrufen" : lang === "tr" ? "Ara" : "Call",
      description:
        lang === "de"
          ? "Sprechen Sie direkt mit uns."
          : lang === "tr"
            ? "Bizimle direkt konuşun."
            : "Talk to us directly.",
      href: "tel:+4915256569852",
      action: "+49 1525 6569852",
      Icon: Phone,
      eventName: "phone_click",
    },
    {
      title: "Gmail",
      description: t("contact.email.cta", lang),
      href: "mailto:info@nüll.com",
      action: "info@nüll.com",
      icon: gmailIcon,
      eventName: "email_click",
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
            className="mx-auto mb-5 max-w-[22rem] text-[clamp(2rem,8.2vw,2.35rem)] leading-[0.98] tracking-[-0.035em] md:mb-7 md:max-w-none md:text-[clamp(2.25rem,4.4vw,3.5rem)] md:leading-[0.98] md:tracking-[-0.035em]"
            style={{ fontWeight: 600 }}
          >
            {lang === "de" ? (
              <>
                <span className="block whitespace-nowrap md:hidden">Mehr Anfragen.</span>
                <span className="hidden md:mx-auto md:block md:w-fit md:max-w-none lg:whitespace-nowrap">
                  {t("contact.title1", lang)}
                </span>
                <span className="mt-2 block text-[#8e8e93] md:mx-auto md:mt-0 md:w-fit md:max-w-none lg:whitespace-nowrap">
                  <span className="block whitespace-nowrap md:hidden">Aus Ihrer Expertise.</span>
                  <span className="hidden md:inline">{t("contact.title2", lang)}</span>
                </span>
              </>
            ) : (
              <>
                <span className="block md:mx-auto md:w-fit md:max-w-none lg:whitespace-nowrap">{t("contact.title1", lang)}</span>
                <span className="mt-2 block text-[#8e8e93] md:mx-auto md:mt-0 md:w-fit md:max-w-none lg:whitespace-nowrap">
                  {t("contact.title2", lang)}
                </span>
              </>
            )}
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
          className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 md:mt-12 md:grid-cols-3"
        >
          {contactMethods.map(({ title, description, href, action, icon, Icon, eventName }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={() => {
                const contactConversion = getContactGoogleAdsConversion(eventName);
                if (contactConversion) {
                  trackGoogleAdsConversion(contactConversion, {
                    event_category: "contact",
                    event_label: eventName,
                  });
                }
                trackGaEvent(eventName, { event_category: "contact" });
              }}
              className="group flex min-h-[6.75rem] items-center gap-4 rounded-[1.35rem] border border-black/5 bg-white/80 p-4 text-left shadow-[0_18px_45px_-34px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_-35px_rgba(0,0,0,0.24)] md:block md:min-h-0 md:rounded-[1.75rem] md:bg-white/70 md:p-6"
            >
              <div className="flex shrink-0 items-center justify-between md:mb-8">
                {Icon ? (
                  <span className="flex h-[1.55rem] w-[1.55rem] items-center justify-center rounded-full bg-[#0071e3] text-white shadow-[0_5px_10px_rgba(0,113,227,0.16)]">
                    <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                ) : (
                  <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="h-[1.55rem] w-[1.55rem] object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.08)]"
                  />
                )}
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
