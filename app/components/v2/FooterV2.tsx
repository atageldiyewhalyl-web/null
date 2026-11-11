import { motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { trackGaEvent, getContactGoogleAdsConversion, trackGoogleAdsConversion } from "../../utils/tracking";
import { BLOG, CHECK, REFS, toHome } from "./links";

/*
 * Site footer: statement + CTA on the left, three link columns on the right, then the giant "nüll." wordmark
 * across the full width (the brand's signature: big, tight, blue full stop), and a slim legal bar.
 * Links point to real routes (app/routes.ts) and the page's own sections. No address here on purpose:
 * the Impressum still lists a US address, which needs checking (see note to Halyl).
 */

const WA = `https://wa.me/4915256569852?text=${encodeURIComponent("Hallo nüll., ich interessiere mich für ein Anfragesystem für meinen Betrieb.")}`;
const EASE = [0.22, 1, 0.36, 1] as const;

type L = { label: string; href: string; ext?: boolean; event?: string };
const COLS: { title: string; links: L[] }[] = [
  {
    title: "Leistungen",
    links: [
      { label: "Webdesign", href: "/leistungen/webdesign" },
      { label: "SEO", href: "/leistungen/seo" },
      { label: "Google Ads", href: "/leistungen/google-ads" },
      { label: "KI-Sichtbarkeit", href: "/leistungen/ki-sichtbarkeit" },
      { label: "Content", href: "/leistungen/content" },
      { label: "Preise", href: "/preise" },
    ],
  },
  {
    title: "nüll.",
    links: [
      { label: "Fälle", href: REFS },
      { label: "Website-Check", href: CHECK },
      { label: "Ablauf", href: "#ablauf" },
      { label: "Fragen", href: "#faq" },
      { label: "Blog", href: BLOG },
    ],
  },
  {
    title: "Kontakt",
    links: [
      { label: "WhatsApp", href: WA, ext: true, event: "whatsapp_click" },
      { label: "+49 1525 6569852", href: "tel:+4915256569852", event: "phone_click" },
      { label: "info@nüll.com", href: "mailto:info@nüll.com", event: "email_click" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/n%C3%BCll/", ext: true },
    ],
  },
];

const onLink = (event?: string) => {
  if (!event) return;
  trackGaEvent(`${event}_home_v2_footer`);
  const sendTo = getContactGoogleAdsConversion(event);
  if (sendTo) trackGoogleAdsConversion(sendTo);
};

export default function FooterV2({ onHome = true }: { onHome?: boolean }) {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  // wordmark cut at both ends: the top edge of the footer runs through the ü dots, the page bottom through the full stop
  const F = "clamp(7rem, 52vw, 50rem)";
  const H = `calc(${F} * 0.68)`; // visible height of the wordmark box, anchored to the bottom
  const FOOT = `calc(${F} * 0.58)`; // footer height: 0.1em shorter than the box, so the top of the dots is cut off

  return (
    <footer className="relative overflow-hidden bg-white text-[#0e0e10]">
      {/* the giant wordmark as a light watermark, cut off by the bottom edge; it rises out of the floor when it comes into view */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden select-none overflow-hidden md:block" style={{ height: H }}>
        <motion.p
          className="whitespace-nowrap text-center font-bold leading-[0.8] tracking-[-0.075em] text-[#eceef2]"
          style={{ fontSize: F }}
          {...(reduce ? {} : { initial: { y: "35%" }, whileInView: { y: "0%" }, viewport: { once: true, amount: 0.1 }, transition: { duration: 1.1, ease: EASE } })}
        >
          nüll<span className="text-[#007aff]">.</span>
        </motion.p>
      </div>

      {/* everything else sits on top of it, pushed to the bottom */}
      <div className="relative z-10 flex flex-col md:min-h-[var(--foot)]" style={{ "--foot": FOOT } as React.CSSProperties}>
        <div className="mx-auto my-auto w-full max-w-[1360px] px-4 pb-7 pt-10 md:px-8 md:py-10">
          <div className="grid gap-7 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-center lg:gap-16">
            <div>
              <p className="text-[clamp(1.8rem,3.4vw,3rem)] font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10]">
                Von null auf Anfrage<span className="text-[#007aff]">.</span>
              </p>
              <p className="mt-2 max-w-[34ch] text-[0.95rem] font-medium md:mt-3 md:text-[1rem] leading-[1.45] tracking-[-0.02em] text-[#424245]">
                Websites, SEO und Werbung für Betriebe in ganz Deutschland.
              </p>
            </div>

            {/* phones: one wrapped list of links, no column titles. Phone and e-mail are in the contact tiles right above. */}
            <nav aria-label="Fußzeile" className="flex flex-wrap gap-x-5 gap-y-2.5 sm:hidden">
              {COLS.flatMap((c) => c.links)
                .filter((l) => !l.href.startsWith("tel:") && !l.href.startsWith("mailto:"))
                .map((l) => (
                  <a
                    key={l.label}
                    href={toHome(l.href, onHome)}
                    target={l.ext ? "_blank" : undefined}
                    rel={l.ext ? "noopener noreferrer" : undefined}
                    onClick={() => onLink(l.event)}
                    className="text-[0.95rem] font-semibold tracking-[-0.02em] text-[#0e0e10]"
                  >
                    {l.label}
                  </a>
                ))}
            </nav>

            <nav aria-label="Fußzeile" className="hidden gap-x-6 gap-y-8 sm:grid sm:grid-cols-3">
              {COLS.map((c) => (
                <div key={c.title}>
                  <p className="text-[0.88rem] font-semibold tracking-[-0.01em] text-[#86868b]">{c.title}</p>
                  <ul className="mt-3 space-y-2">
                    {c.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={toHome(l.href, onHome)}
                          target={l.ext ? "_blank" : undefined}
                          rel={l.ext ? "noopener noreferrer" : undefined}
                          onClick={() => onLink(l.event)}
                          className="text-[0.98rem] font-semibold tracking-[-0.02em] text-[#0e0e10] transition-opacity hover:opacity-55"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* legal bar: all on the left so the blue full stop never sits behind a link */}
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/10 px-4 py-3.5 text-[0.85rem] md:gap-x-6 md:py-4 md:text-[0.88rem] font-medium text-[#6b7280] md:px-8">
          <p>© {year} nüll.</p>
          <a href="/impressum" className="transition-colors hover:text-[#0e0e10]">Impressum</a>
          <a href="/datenschutz" className="transition-colors hover:text-[#0e0e10]">Datenschutz</a>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }} className="inline-flex items-center gap-1.5 font-semibold text-[#0e0e10] transition-opacity hover:opacity-55">
            Nach oben <ArrowUp size={15} strokeWidth={2.4} aria-hidden />
          </a>
        </div>
      </div>

      {/* phones: the wordmark gets its own full-width block under the links, cut off by the page bottom */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden md:hidden" style={{ height: "calc(64vw * 0.72)" }}>
        <motion.p
          className="whitespace-nowrap text-center font-bold leading-[0.8] tracking-[-0.075em] text-[#eceef2]"
          style={{ fontSize: "64vw" }}
          {...(reduce ? {} : { initial: { y: "35%" }, whileInView: { y: "0%" }, viewport: { once: true, amount: 0.1 }, transition: { duration: 1.1, ease: EASE } })}
        >
          nüll<span className="text-[#007aff]">.</span>
        </motion.p>
      </div>
    </footer>
  );
}
