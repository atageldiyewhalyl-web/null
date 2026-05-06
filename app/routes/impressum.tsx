export function meta() {
  return [
    { title: "Impressum | nüll." },
    {
      name: "description",
      content: "Impressum und Anbieterkennzeichnung von nüll.",
    },
    { property: "og:title", content: "Impressum | nüll." },
    {
      property: "og:description",
      content: "Impressum und Anbieterkennzeichnung von nüll.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function ImpressumRoute() {
  return (
    <main className="px-4 pb-20 pt-32 md:px-6 md:pb-28 md:pt-40">
      <article className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
          Anbieterkennzeichnung
        </p>
        <h1 className="mb-10 text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05]">
          Impressum
        </h1>

        <div className="space-y-10 text-[1rem] leading-7 text-neutral-700 md:text-[1.0625rem]">
          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Angaben gemäß § 5 DDG</h2>
            <address className="not-italic text-neutral-700">
              HB Smart Software Solutions Inc.
              <br />
              69 Brown Street
              <br />
              #2260
              <br />
              Providence, RI 02912
              <br />
              United States
            </address>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Vertreten durch</h2>
            <p>Halyberdi Atageldiyev</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a className="text-primary transition-colors hover:text-foreground" href="mailto:hello@xn--nll-hoa.com">
                hello@xn--nll-hoa.com
              </a>
              <br />
              Telefon:{" "}
              <a className="text-primary transition-colors hover:text-foreground" href="tel:+17736561156">
                +1 773 656 1156
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Website</h2>
            <p>
              <a className="text-primary transition-colors hover:text-foreground" href="https://nüll.com">
                https://nüll.com
              </a>
              <br />
              <a className="text-primary transition-colors hover:text-foreground" href="https://xn--nll-hoa.com">
                https://xn--nll-hoa.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <address className="not-italic text-neutral-700">
              Halyberdi Atageldiyev
              <br />
              HB Smart Software Solutions Inc.
              <br />
              69 Brown Street
              <br />
              #2260
              <br />
              Providence, RI 02912
              <br />
              United States
            </address>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                className="text-primary transition-colors hover:text-foreground"
                href="https://ec.europa.eu/consumers/odr/"
                rel="noreferrer"
                target="_blank"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-4">
              Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich.
            </p>
            <p className="mt-4">
              Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">Haftung für Links</h2>
            <p>
              Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
              übernehmen.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
