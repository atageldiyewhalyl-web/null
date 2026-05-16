import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Code2,
  MessageSquare,
  MonitorSmartphone,
  Palette,
  RefreshCw,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, t } from "./LanguageContext";

export function Services() {
  const { lang } = useLanguage();

  const systemSteps = [
    {
      number: "01",
      label: t("services.flow.intent", lang),
      description: t("services.flow.intent.desc", lang),
    },
    {
      number: "02",
      label: t("services.flow.visibility", lang),
      description: t("services.flow.visibility.desc", lang),
    },
    {
      number: "03",
      label: t("services.flow.trust", lang),
      description: t("services.flow.trust.desc", lang),
    },
    {
      number: "04",
      label: t("services.flow.enquiry", lang),
      description: t("services.flow.enquiry.desc", lang),
    },
  ];

  const flowVisualCopy = {
    serpUrl: lang === "de" ? "ihrewebsite.de" : lang === "tr" ? "siteniz.de" : "yourwebsite.de",
    serpTitle:
      lang === "de"
        ? "Ihre Leistung in Ihrer Stadt"
        : lang === "tr"
          ? "Şehrinizde sunduğunuz hizmet"
          : "Your service in your city",
    serpDescription:
      lang === "de"
        ? "Klarer Auftritt. Direkt Anfrage erhalten."
        : lang === "tr"
          ? "Net görünüm. Doğrudan talep alın."
          : "Clear presence. Turn visitors into enquiries.",
    secondResult:
      lang === "de" ? "Mitbewerber Website" : lang === "tr" ? "Rakip web sitesi" : "Competitor website",
    before: lang === "de" ? "Vorher" : lang === "tr" ? "Önce" : "Before",
    after: lang === "de" ? "Nachher" : lang === "tr" ? "Sonra" : "After",
    reviewName: "Maria K.",
    review:
      lang === "de"
        ? "Ich habe die Website gefunden und sofort gewusst: Das passt."
        : lang === "tr"
          ? "Web sitesini buldum ve hemen doğru yer olduğunu anladım."
          : "I found the website and immediately knew this was the right fit.",
    verified:
      lang === "de" ? "Verifizierte Bewertung" : lang === "tr" ? "Doğrulanmış yorum" : "Verified review",
    incoming:
      lang === "de"
        ? "Guten Tag, ich habe Ihre Website gefunden und würde gerne eine Beratung anfragen..."
        : lang === "tr"
          ? "Merhaba, web sitenizi buldum ve danışmanlık almak istiyorum..."
          : "Hi, I found your website and would like to request a consultation...",
    outgoing:
      lang === "de" ? "Sehr gerne. Wann passt es Ihnen?" : lang === "tr" ? "Memnuniyetle. Ne zaman uygunsunuz?" : "Of course. What time works for you?",
    time: lang === "de" ? "Heute, 10:42" : lang === "tr" ? "Bugün, 10:42" : "Today, 10:42",
  };

  const cards = [
    {
      number: "01",
      title: t("services.webdesign", lang),
      description: t("services.webdesign.desc", lang),
      Icon: MonitorSmartphone,
      className: "lg:col-span-5",
    },
    {
      number: "02",
      title: t("services.development", lang),
      description: t("services.development.desc", lang),
      Icon: Code2,
      className: "lg:col-span-4",
    },
    {
      number: "03",
      title: t("services.branding", lang),
      description: t("services.branding.desc", lang),
      Icon: Palette,
      className: "lg:col-span-3",
    },
    {
      number: "04",
      title: t("services.seo", lang),
      description: t("services.seo.desc", lang),
      Icon: Search,
      className: "lg:col-span-4",
    },
    {
      number: "05",
      title: t("services.ai", lang),
      description: t("services.ai.desc", lang),
      Icon: Bot,
      badge: t("services.ai.badge", lang),
      dark: true,
      className: "lg:col-span-4",
    },
    {
      number: "06",
      title: t("services.maintenance", lang),
      description: t("services.maintenance.desc", lang),
      Icon: RefreshCw,
      footer: t("services.maintenance.badge", lang),
      className: "lg:col-span-4",
    },
  ];

  const cardBase =
    "group relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border p-6 md:p-7 transition-all duration-300";

  return (
    <section id="services" className="scroll-mt-28 py-24 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mb-32 md:mb-48"
          aria-label={t("services.flow.aria", lang)}
        >
          <div className="mb-10 md:mb-14">
            <p className="mb-5 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#007aff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
              {t("services.flow.label", lang)}
            </p>
            <h3 className="max-w-5xl text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#0e0e10] md:whitespace-nowrap">
              {t("services.flow.title1", lang)}{" "}
              <span className="text-[#007aff]">{t("services.flow.title2", lang)}</span>
            </h3>
            <p className="mt-5 max-w-2xl text-[1rem] font-medium leading-relaxed text-[#86868b] md:text-[1.125rem]">
              {t("services.flow.subtitle", lang)}
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-4 lg:gap-7">
              {systemSteps.map(({ number, label, description }, index) => (
                <article
                  key={label}
                  className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-5 lg:block"
                >
                  <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-[0.875rem] font-bold tracking-[0.04em] text-[#86868b] lg:mb-8">
                    {number}
                  </div>
                  <div>
                    <div className="relative overflow-hidden rounded-[1.35rem] border border-black/[0.07] bg-[#f8f9fb] p-4 shadow-[0_18px_60px_rgba(15,23,42,0.035)]">
                      <div className="h-[10.5rem]">
                        {index === 0 && (
                          <div className="relative flex h-full flex-col gap-2">
                            <span className="absolute right-0 top-0 rounded-full bg-[#007aff] px-2 py-1 text-[0.625rem] font-bold text-white">#1</span>
                            <div className="rounded-xl border border-[#007aff]/40 bg-white p-3 shadow-[0_0_0_4px_rgba(0,122,255,0.06)]">
                              <p className="text-[0.625rem] font-bold text-emerald-500">{flowVisualCopy.serpUrl}</p>
                              <p className="mt-1 text-[0.75rem] font-bold leading-tight text-[#007aff]">{flowVisualCopy.serpTitle}</p>
                              <p className="mt-1 text-[0.625rem] leading-snug text-[#86868b]">{flowVisualCopy.serpDescription}</p>
                            </div>
                            {[flowVisualCopy.secondResult, "Anwaltsverzeichnis"].map((result) => (
                              <div key={result} className="rounded-xl border border-black/[0.05] bg-white/70 p-3 opacity-55">
                                <p className="h-2 w-20 rounded-full bg-emerald-200" />
                                <p className="mt-2 text-[0.6875rem] font-bold text-[#007aff]">{result}</p>
                                <p className="mt-2 h-2 w-32 rounded-full bg-black/10" />
                              </div>
                            ))}
                          </div>
                        )}

                        {index === 1 && (
                          <div className="relative flex h-full items-center gap-2">
                            <div className="relative h-[8.1rem] flex-1 overflow-hidden rounded-xl border border-black/[0.06] bg-white opacity-50 grayscale">
                              <div className="flex h-6 items-center gap-1 border-b border-black/[0.04] bg-black/[0.035] px-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
                                <span className="h-1.5 w-1.5 rounded-full bg-black/10" />
                                <span className="h-1.5 w-1.5 rounded-full bg-black/10" />
                              </div>
                              <div className="p-3 pb-8">
                                <span className="mb-3 block h-3 w-[4.5rem] rounded-full bg-black/10" />
                                <span className="mb-2 block h-2 w-full rounded-full bg-black/10" />
                                <span className="mb-2 block h-2 w-3/4 rounded-full bg-black/[0.08]" />
                                <span className="mb-2 block h-2 w-5/6 rounded-full bg-black/[0.08]" />
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="h-5 rounded-md bg-black/[0.06]" />
                                  <span className="h-5 rounded-md bg-black/[0.06]" />
                                </div>
                              </div>
                              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.5625rem] font-black uppercase tracking-[0.08em] text-[#86868b]">
                                {flowVisualCopy.before}
                              </span>
                            </div>

                            <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#007aff]/20 bg-white text-[#007aff] shadow-[0_8px_24px_rgba(0,122,255,0.12)]">
                              <ArrowRight size={15} strokeWidth={2.2} />
                            </div>

                            <div className="relative h-[8.1rem] flex-1 overflow-hidden rounded-xl border border-[#007aff]/45 bg-white shadow-[0_0_0_4px_rgba(0,122,255,0.06)]">
                              <div className="flex h-6 items-center justify-between border-b border-[#007aff]/10 bg-[#f2f8ff] px-2">
                                <div className="flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]/25" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]/25" />
                                </div>
                                <span className="h-2 w-9 rounded-full bg-[#007aff]/20" />
                              </div>
                              <div className="p-3 pb-8">
                                <span className="mb-2 block h-3 w-[4.75rem] rounded-full bg-[#007aff]" />
                                <span className="mb-2 block h-2 w-full rounded-full bg-[#bfdbfe]" />
                                <span className="mb-3 block h-2 w-2/3 rounded-full bg-[#bfdbfe]" />
                                <div className="mb-2 h-6 rounded-lg bg-gradient-to-r from-[#007aff] to-[#54a6ff]" />
                                <div className="grid grid-cols-3 gap-1.5">
                                  <span className="h-4 rounded-md bg-[#eaf3ff]" />
                                  <span className="h-4 rounded-md bg-[#eaf3ff]" />
                                  <span className="h-4 rounded-md bg-[#eaf3ff]" />
                                </div>
                              </div>
                              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.5625rem] font-black uppercase tracking-[0.08em] text-[#007aff]">
                                {flowVisualCopy.after}
                              </span>
                            </div>
                          </div>
                        )}

                        {index === 2 && (
                          <div className="flex h-full flex-col gap-3">
                            <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white p-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf3ff] text-[0.875rem]">M</div>
                              <div>
                                <p className="text-[0.75rem] font-bold text-[#0e0e10]">{flowVisualCopy.reviewName}</p>
                                <p className="text-[0.8125rem] tracking-[0.08em] text-[#007aff]">★★★★★</p>
                              </div>
                            </div>
                            <div className="rounded-xl border border-black/[0.06] bg-white p-3 text-[0.6875rem] italic leading-relaxed text-[#86868b]">
                              "{flowVisualCopy.review}"
                            </div>
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[0.625rem] font-bold text-emerald-700">
                              ✓ {flowVisualCopy.verified}
                            </div>
                          </div>
                        )}

                        {index === 3 && (
                          <div className="relative flex h-full flex-col justify-end gap-2">
                            <div className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#007aff] text-white shadow-[0_0_0_8px_rgba(0,122,255,0.09)]">
                              <MessageSquare size={16} strokeWidth={2} />
                            </div>
                            <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-black/[0.06] bg-white p-3 text-[0.6875rem] font-medium leading-relaxed text-[#0e0e10]">
                              {flowVisualCopy.incoming}
                            </div>
                            <p className="text-[0.5625rem] font-medium text-[#86868b]">{flowVisualCopy.time}</p>
                            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#007aff] p-3 text-[0.6875rem] font-bold leading-relaxed text-white">
                              {flowVisualCopy.outgoing}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="mt-7 text-[1.35rem] font-bold tracking-[-0.03em] text-[#0e0e10]">
                      {label}
                    </h4>
                    <p className="mt-3 max-w-[18rem] text-[0.95rem] font-medium leading-relaxed text-[#86868b]">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Header ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-20 items-end mb-16 md:mb-20">
          <div>
            <motion.p
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-6"
            >
              {t("services.label", lang)}
            </motion.p>
            <motion.h2
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="max-w-full text-[clamp(2.15rem,5.5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-[#0e0e10] break-words hyphens-auto"
            >
              {t("services.title1", lang)}{" "}
              <span className="text-[#86868b]">{t("services.title2", lang)}</span>
            </motion.h2>
          </div>
          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-[1.0625rem] md:text-[1.1875rem] text-[#86868b] leading-relaxed font-medium"
          >
            {t("services.description", lang)}
          </motion.p>
        </div>

        {/* ── System Cards ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">
          {cards.map((card, index) => {
            const Icon = card.Icon;
            const isDark = card.dark;

            return (
          <motion.a
            key={card.number}
            href="/services"
            className={`${card.className} ${cardBase} ${
              isDark
                ? "border-[#0e0e10] bg-[#0e0e10] text-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] hover:shadow-[0_28px_80px_rgba(0,0,0,0.2)]"
                : "border-black/[0.06] bg-[#fafafa] text-[#0e0e10] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            } no-underline`}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            {card.badge && (
              <span className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-bold tracking-wide text-white ring-1 ring-white/10">
                {card.badge}
              </span>
            )}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Icon
                  className={`h-8 w-8 shrink-0 ${isDark ? "text-white" : "text-[#007aff]"}`}
                  strokeWidth={1.8}
                />
                <span
                  className={`text-[0.75rem] font-black uppercase tracking-[0.14em] ${
                    isDark ? "text-white/35" : "text-[#007aff]/70"
                  }`}
                >
                  {card.number}
                </span>
              </div>
              <h3
                className={`text-[1.25rem] md:text-[1.4375rem] font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-[#0e0e10]"
                }`}
              >
                {card.title}
              </h3>
              <p className={`text-[0.9375rem] leading-relaxed ${isDark ? "text-white/55" : "text-[#86868b]"}`}>
                {card.description}
              </p>
            </div>
            {card.footer ? (
              <div className={`mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-semibold ${isDark ? "text-white/70" : "text-[#0e0e10]/60"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
                {card.footer}
              </div>
            ) : (
              <div
                className={`flex items-center gap-1.5 mt-6 text-[0.875rem] font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  isDark ? "text-white" : "text-[#007aff]"
                }`}
              >
                {t("services.learnMore", lang)} <ArrowUpRight size={15} />
              </div>
            )}
          </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
