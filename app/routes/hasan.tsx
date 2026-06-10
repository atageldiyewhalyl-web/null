export function meta() {
  return [
    { title: "Doğru Kanzlei Portfolio | Hasan" },
    { name: "description", content: "Portfolio concept page for Hasan Doğru and Doğru Kanzlei." },
  ];
}

export default function HasanPortfolio() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#1C3829] text-[#FDFCFB]">
      <section className="relative min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <header className="relative z-20 flex items-start justify-between">
          <a
            href="/hasan"
            aria-label="Doğru Kanzlei portfolio home"
            className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border border-[#B8963E]/40 bg-[#F7F5F0] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:h-24 sm:w-24"
          >
            <img
              src="/assets/hasan/dogru-logo.png"
              alt="Doğru Kanzlei logo"
              className="h-full w-full object-contain"
            />
          </a>

          <nav
            aria-label="Portfolio navigation"
            className="absolute left-1/2 top-0 hidden -translate-x-1/2 rounded-full border border-[#B8963E]/25 bg-[#F7F5F0]/95 px-3 py-2 text-sm font-semibold text-[#1C3829] shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur md:flex"
          >
            {["Projekt", "Kanzlei", "System", "Kontakt"].map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-full px-5 py-3 transition-colors hover:bg-[#B8963E] hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F5F0] text-[#1C3829] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-transform hover:scale-105 sm:h-16 sm:w-16"
          >
            <span className="flex w-7 flex-col gap-1.5">
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
            </span>
          </button>
        </header>

        <div className="relative z-10 flex min-h-[56vh] flex-col justify-end pb-8 pt-20 sm:min-h-[58vh] sm:pb-10 lg:min-h-[62vh] lg:pt-28">
          <div className="grid items-end gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <p className="mb-7 text-[clamp(1rem,1.35vw,1.35rem)] font-medium text-[#D9C27A]">
                Doğru Kanzlei
              </p>
              <h1 className="max-w-[12ch] text-[clamp(4rem,11vw,12.5rem)] font-black leading-[0.86] tracking-[-0.085em] text-[#F7F5F0]">
                Sichtbar sein.
                <br />
                Gewählt werden.
              </h1>
            </div>

            <div className="max-w-xl justify-self-start pb-2 lg:justify-self-end">
              <p className="text-[clamp(1.4rem,2.3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-[#F7F5F0]">
                Wie wir Doğru Kanzlei zur meistgefundenen türkisch-deutschen Kanzlei in
                Deutschland gemacht haben.
              </p>
            </div>
          </div>

          <div className="mt-10 grid items-end gap-7 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-wrap gap-2">
              {["Legal Website", "Brand System", "SEO", "Client Acquisition"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#B8963E]/70 px-3 py-1 text-sm font-semibold text-[#F7F5F0]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="max-w-lg text-lg font-medium leading-[1.35] text-[#D7D0C2] lg:justify-self-start">
              Eine Solo-Kanzlei in Mannheim. Spezialisiert auf türkisch-deutsches Recht. Und jetzt
              online dominanter als jede Grosskanzlei im selben Markt.
            </p>
          </div>
        </div>

        <div className="relative z-10 min-h-[38rem] overflow-hidden rounded-[1.5rem] border border-[#B8963E]/35 bg-[#B8963E] shadow-[0_40px_120px_rgba(0,0,0,0.28)] sm:rounded-[2rem] lg:min-h-[42rem]">
          <img
            src="/assets/new-landing/hasan-dogru-main-hero-1.webp"
            alt="Hasan Doğru"
            className="absolute inset-y-0 left-0 h-full w-full object-cover object-[18%_center] opacity-95 grayscale-[8%] saturate-[0.9] lg:w-[58%]"
          />
          <div className="absolute inset-y-0 left-0 w-full bg-[#B8963E]/38 lg:w-[58%]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(184,150,62,0.08)_0%,rgba(184,150,62,0.42)_38%,rgba(184,150,62,0.94)_62%)]" />

          <div className="relative flex min-h-[38rem] items-end p-6 sm:p-10 lg:min-h-[42rem] lg:items-center lg:justify-end lg:p-16">
            <figure className="max-w-3xl text-[#1C3829] lg:w-[54%]">
              <p className="mb-8 text-xs font-black uppercase tracking-[0.38em] text-[#1C3829]/65">
                Kundenstimme
              </p>
              <blockquote className="text-[clamp(2.35rem,5vw,6.25rem)] font-black leading-[0.9] tracking-[-0.075em]">
                “Seit der Zusammenarbeit mit nüll. werde ich täglich online gefunden. Von Mandanten,
                die ich sonst nie erreicht hätte.”
              </blockquote>
              <figcaption className="mt-10 border-t border-[#1C3829]/25 pt-5 text-base font-semibold text-[#1C3829]/80 sm:text-lg">
                Hasan Doğru, Anwalt
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="relative bg-[#F7F5F0] px-4 py-20 text-[#1C3829] sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-[92rem]">
          <div className="mx-auto max-w-[82rem] space-y-8 text-[clamp(1.05rem,1.25vw,1.55rem)] font-medium leading-[1.35] tracking-[-0.02em] text-[#1C3829]/82">
            <p>
              Hasan Doğru ist gut in seinem Job. Das war er immer. Über 70 Mandanten, fünf Sterne,
              echte Ergebnisse. Aber wer nach einem türkisch-deutschen Anwalt gegoogelt hat, fand
              ihn nicht. Seine Website existierte, arbeitete aber nicht für ihn. Neue Mandanten
              kamen fast ausschließlich durch Empfehlungen. Zuverlässig, aber nicht skalierbar.
            </p>
            <p>
              Wir haben uns seinen Markt angesehen und etwas entdeckt, das alle anderen ignoriert
              hatten. Tausende Menschen in Deutschland suchen jeden Monat auf Türkisch, auf Deutsch
              und auf Englisch nach einem Anwalt. Gleichzeitig. Und fast niemand hatte Inhalte in
              allen drei Sprachen. Wir haben Hasans Website neu aufgebaut, mehrsprachige Inhalte zu
              jedem relevanten Rechtsgebiet veröffentlicht und präzise Google Ads Kampagnen
              gestartet, die genau die Menschen erreichen, die gerade eine rechtliche Lösung
              brauchen.
            </p>
            <p>
              Heute rankt Doğru Kanzlei unter den Top 3 auf Google, deutschlandweit, gegen Kanzleien
              mit jahrelangem Vorsprung. Auf ChatGPT ist er die Nummer-eins-Empfehlung für
              türkisches Recht in Mannheim. Und jeden Monat kommen 115 neue Mandantenanfragen rein,
              bei einem Preis von €8,22 pro Anfrage, während der Branchendurchschnitt bei €40 bis
              €80 liegt. Hasan macht denselben Job wie vorher. Er ist jetzt einfach der, den alle
              finden.
            </p>
          </div>

          <div className="mx-auto mt-24 grid max-w-7xl gap-8 border-t border-[#1C3829]/12 pt-10 text-sm font-semibold text-[#1C3829]/58 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Kunde", "Doğru Kanzlei"],
              ["Services", "Webdesign\nSEO\nPositionierung\nGoogle Ads"],
              ["Fokus", "Türkisch-deutsches Recht"],
              ["Website", "hasandogru.de"],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="mb-5 inline-flex rounded-full border border-[#1C3829]/18 px-3 py-1 text-xs text-[#1C3829]/48">
                  {label}
                </span>
                <p className="whitespace-pre-line leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F0] px-3 pb-24 sm:px-4 sm:pb-32 lg:px-6 lg:pb-44">
        <div className="mx-auto max-w-[112rem] space-y-4 sm:space-y-6">
          <img
            src="/assets/hasan/hasan-hero-demo.webp"
            alt="Doğru Kanzlei website hero mockup"
            className="block h-auto w-full rounded-[1.25rem] sm:rounded-[1.75rem]"
          />
          <img
            src="/assets/hasan/typo-image-hasan.webp"
            alt="Doğru Kanzlei typography system"
            className="block h-auto w-full rounded-[1.25rem] sm:rounded-[1.75rem]"
          />
          <img
            src="/assets/hasan/color-pallete.webp"
            alt="Doğru Kanzlei color palette"
            className="block h-auto w-full rounded-[1.25rem] sm:rounded-[1.75rem]"
          />
        </div>
      </section>
    </main>
  );
}
