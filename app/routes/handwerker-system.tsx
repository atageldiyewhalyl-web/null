import {
  IconArrowRight,
  IconCalendarTime,
  IconCoinEuro,
  IconLockOpen,
  IconRefresh,
} from "@tabler/icons-react";

const bookingUrl =
  "https://calendly.com/feyza-xn-nll-hoa/kostenloses-beratungsgesprach?month=2026-10";

const guarantees = [
  {
    Icon: IconCalendarTime,
    title: "In 7 Tagen startklar",
    description: "Wir setzen das System zügig für Ihren Betrieb auf.",
  },
  {
    Icon: IconCoinEuro,
    title: "1. Monat kostenlos",
    description: "Sie testen den Ansatz ohne Einstiegskosten.",
  },
  {
    Icon: IconRefresh,
    title: "Keine Anfrage?",
    description: "Dann ist auch der zweite Monat kostenlos.",
  },
  {
    Icon: IconLockOpen,
    title: "Keine Bindung",
    description: "Alles, was wir aufbauen, bleibt bei Ihnen.",
  },
];

export function meta() {
  return [
    { title: "Das nüll System für Handwerksbetriebe" },
    {
      name: "description",
      content:
        "Ein kurzer Überblick über das nüll System für planbare, qualifizierte Anfragen im Handwerk.",
    },
    { name: "robots", content: "noindex, nofollow, noarchive" },
    { name: "googlebot", content: "noindex, nofollow, noarchive" },
  ];
}

export default function HandwerkerSystemRoute() {
  return (
    <main className="min-h-[100dvh] bg-[#f7f7f5] text-[#111113] dark:bg-[#0e0e10] dark:text-[#f5f5f7]">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="/handwerker-system"
          aria-label="nüll Startseite des Handwerker-Systems"
          className="text-[1.75rem] font-bold tracking-[-0.075em] text-[#111113] no-underline dark:text-[#f5f5f7]"
        >
          nüll<span className="text-[#007aff]">.</span>
        </a>
        <span className="text-sm font-semibold tracking-[-0.02em] text-[#626269] dark:text-[#a7a7ad]">
          Für Handwerksbetriebe
        </span>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:pb-28">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="whitespace-nowrap text-[clamp(1.25rem,6.6vw,5.4rem)] font-bold leading-[0.96] tracking-[-0.065em] text-[#111113] dark:text-[#f5f5f7]">
            Das System für mehr Anfragen.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[clamp(1.05rem,2vw,1.35rem)] font-medium leading-relaxed tracking-[-0.025em] text-[#56565d] dark:text-[#b6b6bc]">
            Sehen Sie zuerst das Video an. Danach entscheiden Sie in Ruhe, ob ein Gespräch sinnvoll ist.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#d8d8dc] bg-[#101114] shadow-[0_28px_80px_-38px_rgba(0,53,128,0.45)] dark:border-[#2c2c31] sm:mt-12">
          <video
            className="block aspect-[1710/1108] w-full bg-[#101114] object-contain"
            controls
            playsInline
            preload="metadata"
            poster="/assets/handwerker-system/system-poster.jpg"
            aria-label="Das nüll System für mehr qualifizierte Anfragen im Handwerk"
          >
            <source src="/assets/handwerker-system/system.mp4" type="video/mp4" />
            Ihr Browser unterstützt die Videowiedergabe nicht.
          </video>
        </div>

        <section
          aria-label="Unsere Garantie"
          className="mt-12 hidden border-y border-[#d8d8dc] py-3 dark:border-[#2c2c31] md:block"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map(({ Icon, title, description }, index) => (
              <article
                key={title}
                className={`flex gap-4 px-1 py-6 sm:px-6 lg:px-7 ${
                  index > 0 ? "lg:border-l lg:border-[#d8d8dc] lg:dark:border-[#2c2c31]" : ""
                } ${index % 2 === 1 ? "sm:border-l sm:border-[#d8d8dc] sm:dark:border-[#2c2c31]" : ""}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#007aff]/10 text-[#007aff]">
                  <Icon size={23} stroke={1.8} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-[-0.03em] text-[#111113] dark:text-[#f5f5f7]">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#66666d] dark:text-[#a7a7ad]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl text-center sm:mt-24">
          <h2 className="text-[clamp(2.2rem,4vw,4.2rem)] font-bold leading-[1] tracking-[-0.055em] text-[#111113] md:whitespace-nowrap dark:text-[#f5f5f7]">
            Bauen Sie jetzt Ihr Anfragesystem auf.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#5c5c63] dark:text-[#b6b6bc]">
            Im kostenlosen Erstgespräch prüfen wir Standort, Leistungen und Kapazitäten und sagen Ihnen ehrlich, was realistisch ist.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-[#0071e3] px-7 text-base font-bold tracking-[-0.025em] text-white no-underline shadow-[0_16px_38px_-18px_rgba(0,113,227,0.78)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0068d1] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
          >
            Erstgespräch anfragen
            <IconArrowRight size={20} stroke={2} aria-hidden="true" />
          </a>
          <p className="mt-4 text-sm font-medium text-[#77777e] dark:text-[#96969d]">
            Kostenlos, unverbindlich und ohne Verkaufsdruck.
          </p>
        </section>
      </section>

      <footer className="border-t border-[#dedee1] px-5 py-8 text-[#73737a] dark:border-[#29292e] dark:text-[#96969d] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p className="!text-[#73737a] dark:!text-[#96969d]">
            © {new Date().getFullYear()} nüll. Alle Rechte vorbehalten.
          </p>
          <nav aria-label="Rechtliche Informationen" className="flex items-center gap-5">
            <a className="text-inherit underline-offset-4 hover:underline" href="/impressum">
              Impressum
            </a>
            <a className="text-inherit underline-offset-4 hover:underline" href="/datenschutz">
              Datenschutz
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
