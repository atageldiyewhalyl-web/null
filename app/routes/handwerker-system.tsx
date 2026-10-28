import {
  IconCalendarTime,
  IconCoinEuro,
  IconLockOpen,
  IconRefresh,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const resetVideo = () => {
      video.pause();
      video.currentTime = 0;
    };

    resetVideo();
    video.addEventListener("loadedmetadata", resetVideo);
    window.addEventListener("pageshow", resetVideo);

    return () => {
      video.removeEventListener("loadedmetadata", resetVideo);
      window.removeEventListener("pageshow", resetVideo);
    };
  }, []);

  return (
    <main className="min-h-[100dvh] bg-white text-[#111113]">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="/handwerker-system"
          aria-label="nüll Startseite des Handwerker-Systems"
          className="text-[1.75rem] font-bold tracking-[-0.075em] text-[#111113] no-underline"
        >
          nüll<span className="text-[#007aff]">.</span>
        </a>
        <span className="text-sm font-semibold tracking-[-0.02em] text-[#626269]">
          Für Handwerksbetriebe
        </span>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:pb-28">
        <div className="mx-auto max-w-6xl text-center">
          <p className="whitespace-nowrap text-[clamp(1.25rem,6.6vw,5.4rem)] font-bold leading-[0.96] tracking-[-0.065em] text-[#111113]">
            Das System für mehr Anfragen.
          </p>
          <p className="mx-auto mt-7 max-w-2xl text-[clamp(1.05rem,2vw,1.35rem)] font-medium leading-relaxed tracking-[-0.025em] text-[#56565d]">
            Sehen Sie zuerst das Video an. Danach entscheiden Sie in Ruhe, ob ein Gespräch sinnvoll ist.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#d8d8dc] bg-[#101114] shadow-[0_28px_80px_-38px_rgba(0,53,128,0.45)] sm:mt-12">
          <video
            ref={videoRef}
            className="block aspect-[1710/1108] w-full bg-[#101114] object-contain"
            controls
            controlsList="nodownload"
            onContextMenu={(event) => event.preventDefault()}
            playsInline
            preload="metadata"
            poster="/assets/handwerker-system/system-poster.jpg"
            aria-label="Das nüll System für mehr qualifizierte Anfragen im Handwerk"
          >
            <source src="/assets/handwerker-system/system-safari.mp4" type="video/mp4" />
            Ihr Browser unterstützt die Videowiedergabe nicht.
          </video>
        </div>

        <section
          aria-label="Unsere Garantie"
          className="mt-12 hidden border-y border-[#d8d8dc] py-3 md:block"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map(({ Icon, title, description }, index) => (
              <article
                key={title}
                className={`flex gap-4 px-1 py-6 sm:px-6 lg:px-7 ${
                  index > 0 ? "lg:border-l lg:border-[#d8d8dc]" : ""
                } ${index % 2 === 1 ? "sm:border-l sm:border-[#d8d8dc]" : ""}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#007aff]/10 text-[#007aff]">
                  <Icon size={23} stroke={1.8} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-[-0.03em] text-[#111113]">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#66666d]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl text-center sm:mt-24">
          <h1 className="mx-auto max-w-5xl text-[clamp(2.35rem,5.4vw,5rem)] font-bold leading-[1] tracking-[-0.06em] text-[#111113]">
            Was ist für Ihren Betrieb realistisch?
          </h1>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex min-h-16 w-full max-w-md items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-[#0071e3] px-7 text-lg font-bold tracking-[-0.03em] text-white no-underline transition-colors duration-200 hover:bg-[#0068d1] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] sm:w-auto sm:px-10"
          >
            <IconCalendarTime size={22} stroke={2} aria-hidden="true" />
            Kostenloses Erstgespräch buchen
          </a>
          <p className="mt-4 text-sm font-medium text-[#6b6b72]">
            Kostenlos. Unverbindlich. Ohne Verkaufsdruck.
          </p>
        </section>
      </section>

      <footer className="border-t border-[#dedee1] px-5 py-8 text-[#73737a] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p className="!text-[#73737a]">
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
