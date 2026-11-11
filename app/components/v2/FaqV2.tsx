import { useState } from "react";
import { Plus } from "lucide-react";

/*
 * "Häufige Fragen." Answers from Halyl (2026-11-10). Left: title and a way to ask; right: accordion.
 * Open/close animates with grid-template-rows (no JS height measuring). First question open by default.
 * FAQPage JSON-LD is emitted from the same data, so text and schema can never disagree.
 * Guarantee (Halyl, 2026-11-10): only "SEO & Google Ads" is free until the first enquiry; the others bill from the start.
 * Still to confirm with Halyl: the transfer fee for website ownership; must match the contract.
 */

const CTA_HREF = "#contact";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Was zählt bei euch als Ergebnis?",
    a: "Eine Anfrage. Also ein Anruf, eine Nachricht oder ein Formular von einem echten Interessenten. Darauf ist unser ganzes System ausgelegt. Mit dem SEO-Paket braucht das etwas Zeit, mit Google Ads geht es schneller, weil deine Anzeigen sofort sichtbar sind. Im Paket SEO & Google Ads zahlst du die Monatsgebühr erst, wenn deine erste Anfrage kommt. Die anderen Pakete laufen ab dem Start.",
  },
  {
    q: "Wie schnell ist meine Website live?",
    a: "7 Tage nach dem Onboarding, wenn deine Inhalte und Freigaben zügig kommen. Dein Teil ist ein Gespräch, ein Formular und zwei Freigaben.",
  },
  {
    q: "Wann beginnt die Mindestlaufzeit?",
    a: "Mit deiner Unterschrift. Die Mindestlaufzeit beträgt 6 Monate.",
  },
  {
    q: "Warum 6 Monate, und was passiert danach?",
    a: "Bis ein Anfragesystem echte Anfragen bringt, dauert es meist 2 bis 3 Monate. Deshalb starten wir mit 6 Monaten. Danach kannst du mit 2 Wochen Frist kündigen. Sonst verlängert sich der Vertrag um jeweils 3 Monate.",
  },
  {
    q: "Gehört mir die Website?",
    a: "Solange du ein Monatspaket hast, läuft deine Website bei uns und wir kümmern uns um alles. Möchtest du sie später selbst übernehmen und hosten, übertragen wir sie dir gegen eine einmalige Gebühr.",
  },
  {
    q: "Muss ich Texte oder Fotos liefern?",
    a: "Die Texte schreiben wir. Von dir brauchen wir nur Fotos deiner Arbeit, die du schon hast, zum Beispiel aus deiner Galerie. Fotoshootings für die Website machen wir nicht. Im Content-Paket drehen wir Videos bei dir vor Ort.",
  },
  {
    q: "Was sind „kleine Änderungen“ im Wartungspaket?",
    a: "Zum Beispiel ein neues Foto, eine neue Telefonnummer, ein angepasster Preis oder eine Änderung im Impressum. Neue Seiten oder neue Abschnitte gehören ins SEO-Paket.",
  },
  {
    q: "Kann ich das Paket wechseln?",
    a: "Ja. Du kannst in ein größeres oder kleineres Paket wechseln. Sag uns einfach Bescheid.",
  },
  {
    q: "Wer bezahlt das Werbebudget?",
    a: "Du, direkt an Google oder Meta, mit deiner eigenen Karte. Das Budget läuft nie über uns, so siehst du jeden Euro selbst.",
  },
  {
    q: "Arbeitet ihr nur in Mannheim?",
    a: "Nein. Wir sitzen in Mannheim und arbeiten mit Betrieben in ganz Deutschland.",
  },
];

export type Faq = { q: string; a: string };

// items: page-specific questions (service pages); defaults to the homepage set. Schema is built from the same list.
export default function FaqV2({ items = FAQS }: { items?: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <section id="faq" className="relative bg-white py-20 text-[#0e0e10] md:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.065em]">
            Häufige Fragen<span className="text-[#007aff]">.</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-[1.1rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">
            Deine Frage ist nicht dabei? Schreib uns, wir antworten persönlich.
          </p>
          <a href={CTA_HREF} className="mt-8 inline-block border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
            Frage stellen
          </a>
        </div>

        <ul className="border-t border-black/10">
          {items.map(({ q, a }, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <li key={q} className="border-b border-black/10">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
                  >
                    <span className="text-[1.2rem] font-semibold leading-snug tracking-[-0.03em] text-[#0e0e10] transition-opacity group-hover:opacity-60 md:text-[1.4rem]">
                      {q}
                    </span>
                    <Plus
                      size={24}
                      strokeWidth={2}
                      aria-hidden
                      className={`mt-1 flex-none text-[#0e0e10] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-7 pr-10 text-[1.05rem] font-medium leading-[1.6] tracking-[-0.015em] text-[#424245]">{a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
