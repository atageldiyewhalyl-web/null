export function meta() {
  return [
    { title: "Datenschutzerklärung | nüll." },
    {
      name: "description",
      content: "Datenschutzerklärung von nüll.",
    },
    { property: "og:title", content: "Datenschutzerklärung | nüll." },
    {
      property: "og:description",
      content: "Datenschutzerklärung von nüll.",
    },
    { property: "og:type", content: "website" },
  ];
}

const accessData = [
  "IP-Adresse",
  "Datum und Uhrzeit der Anfrage",
  "Browsertyp und Browserversion",
  "Betriebssystem",
  "Referrer-URL",
  "Besuchte Seiten",
  "Hostname des zugreifenden Geräts",
];

const contactData = [
  "Name",
  "E-Mail-Adresse",
  "Telefonnummer",
  "Ort oder Stadt",
  "Unternehmensname",
  "Website-URL",
  "Angaben zum gewünschten Projekt oder Leistungsumfang",
  "Nachrichteninhalt",
];

const rights = [
  "Recht auf Auskunft",
  "Recht auf Berichtigung",
  "Recht auf Löschung",
  "Recht auf Einschränkung der Verarbeitung",
  "Recht auf Datenübertragbarkeit",
  "Recht auf Widerspruch gegen die Verarbeitung",
  "Recht auf Widerruf einer Einwilligung",
  "Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde",
];

function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-neutral-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function DatenschutzRoute() {
  return (
    <main className="px-4 pb-20 pt-32 md:px-6 md:pb-28 md:pt-40">
      <article className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
          Datenschutz
        </p>
        <h1 className="mb-10 text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05]">
          Datenschutzerklärung
        </h1>

        <div className="space-y-10 text-[1rem] leading-7 text-neutral-700 md:text-[1.0625rem]">
          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <address className="mt-4 not-italic text-neutral-700">
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
            <p className="mt-4">
              Vertreten durch:
              <br />
              Halyberdi Atageldiyev
            </p>
            <p className="mt-4">
              E-Mail:{" "}
              <a className="text-primary transition-colors hover:text-foreground" href="mailto:info@nüll.com">
                info@nüll.com
              </a>
              <br />
              Telefon:{" "}
              <a className="text-primary transition-colors hover:text-foreground" href="tel:+17736561156">
                +1 773 656 1156
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">
              2. Allgemeine Hinweise zur Datenverarbeitung
            </h2>
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung dieser
              Website, zur Kommunikation mit Interessenten und Kunden sowie zur Erbringung unserer
              Leistungen erforderlich ist.
            </p>
            <p className="mt-4">
              Die Verarbeitung erfolgt auf Grundlage der Datenschutz-Grundverordnung (DSGVO).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">3. Zugriffsdaten und Hosting</h2>
            <p>
              Beim Besuch dieser Website werden automatisch technische Informationen erfasst. Dazu
              gehören insbesondere:
            </p>
            <LegalList items={accessData} />
            <p className="mt-4">
              Diese Daten werden verarbeitet, um die Sicherheit, Stabilität und technische
              Bereitstellung der Website sicherzustellen.
            </p>
            <p className="mt-4">Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
            <p className="mt-4">
              Diese Website wird über Hosting- und Infrastruktur-Dienstleister bereitgestellt. Dazu
              können insbesondere Vercel Inc. und Supabase Inc. gehören. Dabei können technische
              Zugriffsdaten, Server-Logs, Formulardaten und für den Betrieb erforderliche
              Metadaten verarbeitet werden.
            </p>
            <p className="mt-4">
              Informationen zu Vercel:{" "}
              <a
                className="text-primary transition-colors hover:text-foreground"
                href="https://vercel.com/legal/privacy-policy"
                rel="noreferrer"
                target="_blank"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">4. Kontaktaufnahme</h2>
            <p>
              Wenn Sie uns per E-Mail, Kontaktformular, Telefon, WhatsApp oder auf anderem Wege
              kontaktieren, verarbeiten wir die von Ihnen übermittelten Daten zur Bearbeitung Ihrer
              Anfrage.
            </p>
            <p className="mt-4">Dies kann insbesondere folgende Daten umfassen:</p>
            <LegalList items={contactData} />
            <p className="mt-4">
              Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage mit
              vorvertraglichen Maßnahmen oder einem Vertrag zusammenhängt.
            </p>
            <p className="mt-4">
              In allen übrigen Fällen erfolgt die Verarbeitung auf Grundlage unseres berechtigten
              Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">5. Kontaktformulare und Supabase</h2>
            <p>
              Für Kontakt-, Anfrage- und Onboarding-Formulare nutzen wir technische Infrastruktur
              von Supabase Inc. Die übermittelten Daten werden an Supabase übertragen und dort
              verarbeitet, um Ihre Anfrage zu speichern, zu bearbeiten und intern zuzuordnen.
            </p>
            <p className="mt-4">
              Anbieter:
              <br />
              Supabase Inc.
              <br />
              970 Toa Payoh North
              <br />
              #07-04
              <br />
              Singapore 318992
              <br />
              Singapore
            </p>
            <p className="mt-4">
              Weitere Informationen:{" "}
              <a
                className="text-primary transition-colors hover:text-foreground"
                href="https://supabase.com/privacy"
                rel="noreferrer"
                target="_blank"
              >
                https://supabase.com/privacy
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">6. E-Mail-Versand über Resend</h2>
            <p>
              Wenn Sie ein Formular absenden, können die Inhalte Ihrer Anfrage per E-Mail an uns
              weitergeleitet werden. Hierfür nutzen wir den Dienst Resend.
            </p>
            <p className="mt-4">
              Anbieter:
              <br />
              Resend
              <br />
              2261 Market Street #5039
              <br />
              San Francisco, CA 94114
              <br />
              USA
            </p>
            <p className="mt-4">
              Weitere Informationen:{" "}
              <a
                className="text-primary transition-colors hover:text-foreground"
                href="https://resend.com/legal/privacy-policy"
                rel="noreferrer"
                target="_blank"
              >
                https://resend.com/legal/privacy-policy
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">7. WhatsApp</h2>
            <p>
              Wenn Sie uns über einen WhatsApp-Link kontaktieren, verlassen Sie unsere Website und
              nutzen den Dienst WhatsApp. Dabei verarbeitet WhatsApp eigene personenbezogene Daten,
              insbesondere Ihre Telefonnummer, Kommunikationsinhalte, Metadaten und technische
              Informationen.
            </p>
            <p className="mt-4">
              Anbieter für Nutzer im Europäischen Raum:
              <br />
              WhatsApp Ireland Limited
              <br />
              4 Grand Canal Square
              <br />
              Grand Canal Harbour
              <br />
              Dublin 2
              <br />
              Ireland
            </p>
            <p className="mt-4">
              Weitere Informationen:{" "}
              <a
                className="text-primary transition-colors hover:text-foreground"
                href="https://www.whatsapp.com/legal/privacy-policy-eea"
                rel="noreferrer"
                target="_blank"
              >
                https://www.whatsapp.com/legal/privacy-policy-eea
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">8. Cookies und lokale Speicherung</h2>
            <p>
              Unsere Website verwendet technisch notwendige Cookies und lokale Speicherung im
              Browser. Dazu gehören insbesondere die Speicherung Ihrer Spracheinstellung und Ihrer
              Cookie-Auswahl.
            </p>
            <p className="mt-4">
              Sofern Analyse-, Marketing- oder Drittanbieter-Cookies verwendet werden, erfolgt dies
              ausschließlich auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">9. Google Fonts</h2>
            <p>
              Schriftarten werden lokal eingebunden. Beim Aufruf dieser Website wird keine
              automatische Verbindung zu Servern von Google Fonts hergestellt.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">10. Ihre Rechte</h2>
            <p>Sie haben nach der DSGVO folgende Rechte:</p>
            <LegalList items={rights} />
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">11. Datenübermittlung in Drittländer</h2>
            <p>
              Einige der von uns eingesetzten Dienstleister haben ihren Sitz außerhalb der
              Europäischen Union oder des Europäischen Wirtschaftsraums. Soweit personenbezogene
              Daten in Drittländer übertragen werden, erfolgt dies nur, wenn hierfür eine
              datenschutzrechtliche Grundlage besteht, insbesondere ein Angemessenheitsbeschluss,
              Standardvertragsklauseln oder sonstige geeignete Garantien gemäß Art. 44 ff. DSGVO.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">12. Speicherdauer</h2>
            <p>
              Personenbezogene Daten werden nur so lange gespeichert, wie dies zur Erfüllung der
              jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl md:text-3xl">
              14. Aktualität und Änderung dieser Datenschutzerklärung
            </h2>
            <p>Diese Datenschutzerklärung ist aktuell gültig.</p>
            <p className="mt-4">Stand: Mai 2026</p>
          </section>
        </div>
      </article>
    </main>
  );
}
