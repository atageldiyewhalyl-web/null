import { options } from "../options";
import type { Questionnaire } from "../types";
import { bergstoneKeramiksanTr } from "./bergstone-keramiksan.tr";

const socialLanguages = options("Deutsch", "Türkisch", "Englisch");

const websiteLanguages = options("Deutsch", "Türkisch", "Englisch");

export const bergstoneKeramiksan: Questionnaire = {
  id: "bergstone-keramiksan-content-website",
  version: 5,
  client: {
    slug: "bergstone-keramiksan",
    name: "Bergstone Keramiksan",
    logo: "/clients/bergstone-keramiksan/logo.png",
    mark: "/clients/bergstone-keramiksan/mark.png",
  },
  project: "Content + Website",
  title: "Bergstone Keramiksan – Content & Website Fragebogen",
  intro: {
    headline: "Content & Website Fragebogen",
    body: [
      "Damit wir Bergstone Keramiksan im Rahmen unseres Content-Pakets besser kennenlernen und Inhalte speziell für Sie erstellen können, bitten wir Sie, diese Fragen zu beantworten. Sie helfen uns sowohl bei der neuen Website als auch bei der Entwicklung von Content-Ideen.",
    ],
    duration: "Geschätzte Dauer: 7–10 Minuten",
  },
  contact: {
    title: "Wer füllt den Fragebogen aus?",
    help: "Damit wir bei Rückfragen direkt die richtige Person erreichen.",
    fields: [
      { key: "name", label: "Ihr Name", required: true, inputType: "text", autoComplete: "name" },
      { key: "role", label: "Position im Unternehmen", inputType: "text", autoComplete: "organization-title" },
      { key: "email", label: "E-Mail", required: true, inputType: "email", autoComplete: "email" },
      { key: "phone", label: "Telefon", inputType: "tel", autoComplete: "tel" },
    ],
  },
  sections: [
    {
      key: "social",
      title: "Social Media & Content",
      questions: [
        {
          id: "q1",
          group: "Ihre Kunden",
          key: "audience_priority",
          type: "ranking",
          required: true,
          label: "Welche Kundengruppen sind für Bergstone Keramiksan am wichtigsten?",
          help: "Bitte sortieren Sie nach Priorität: 1 = höchste Priorität.",
          allowCustom: true,
          options: options(
            "Fliesenleger",
            "Bauunternehmen / Handwerker",
            "Küchenstudios / Küchenverkäufer",
            "Architekten / Innenarchitekten / Projektentwickler",
            "Privatkunden / Endverbraucher",
          ),
        },
        {
          id: "q2",
          key: "reasons_customers_choose_us",
          type: "longtext",
          required: true,
          label: "Was macht euch aus? Warum bevorzugen Kunden euch – oder warum sollten sie euch statt anderer Fliesenhändler bevorzugen?",
          help: "Gern auch so, wie Ihre Kunden es selbst sagen.",
          placeholder: "z. B. „Bei euch bekomme ich Großformate sofort ab Lager.“",
        },
        {
          id: "q3",
          key: "customer_entry_channels",
          type: "multi",
          required: true,
          label: "Wie kommen neue Kunden typischerweise zu Ihnen?",
          options: options(
            "Sie besuchen direkt den Showroom",
            "Sie schreiben uns per WhatsApp",
            "Sie rufen uns an",
            "Sie schreiben uns über Instagram / Social Media",
            "Sie senden eine Anfrage per E-Mail oder über die Website",
            "Über Empfehlungen / Mundpropaganda",
            "Andere",
          ),
          followUps: [
            {
              key: "purchase_process_description",
              type: "longtext",
              when: { type: "always" },
              label: "Beschreiben Sie kurz den typischen Ablauf – von der ersten Anfrage bis zum Kauf.",
              help: "Falls es bei Privat- und Geschäftskunden unterschiedlich läuft, beschreiben Sie gern beides.",
              placeholder: "z. B. Fliesenleger schreiben per WhatsApp, kommen dann ins Lager und bestellen direkt …",
            },
          ],
        },
        {
          id: "q4",
          key: "preferred_contact_channels",
          type: "multi",
          required: true,
          max: 3,
          label: "Wie sollen Ihre Kunden Sie am liebsten erreichen?",
          options: options(
            "Den Showroom besuchen",
            "Uns anrufen",
            "Uns per WhatsApp kontaktieren",
            "Uns über Instagram / Social Media schreiben",
            "Ein Formular auf unserer Website ausfüllen",
            "Uns eine E-Mail senden",
            "Andere",
          ),
        },
        {
          id: "q5",
          key: "frequent_customer_questions",
          type: "longtext",
          label: "Welche Fragen stellen Ihre Kunden am häufigsten, bevor sie Fliesen kaufen?",
          help: "Zum Beispiel Preis pro Quadratmeter, Verfügbarkeit, passende Größe, Eignung fürs Badezimmer, Lieferung, Verlegung usw.",
        },
        {
          id: "q6",
          key: "b2b_customer_problems",
          type: "longtext",
          required: true,
          label:
            "Welche Probleme hören Sie am häufigsten von Ihren Geschäftskunden – zum Beispiel Fliesenlegern, Bauunternehmen oder Küchenstudios?",
          help: "Je konkreter, desto besser – aus solchen Situationen entstehen unsere Reels.",
          placeholder: "z. B. „Die 120er-Platten bekommen wir ohne Aufzug kaum in den 4. Stock.“",
        },
        {
          id: "q7",
          group: "Ihre Produkte",
          key: "priority_products",
          type: "longtext",
          required: true,
          label: "Welche Produkte oder Kollektionen möchten Sie in den nächsten 1–3 Monaten besonders verkaufen – und was ist daran besonders?",
          help: "Gern mit Produktnamen, Größen, Farben, Angeboten oder Links – und was diese Produkte auszeichnet, z. B. Gewicht, Format oder Verfügbarkeit ab Lager.",
          placeholder: "z. B. Pamesa Marmoroptik 60x120, sofort ab Lager …",
        },
        {
          id: "q8",
          group: "Verkauf & Lieferung",
          key: "delivery_countries",
          type: "multi",
          required: true,
          label: "In welche Länder liefern Sie aktuell Fliesen?",
          options: options("Deutschland", "Österreich", "Niederlande", "Belgien", "Schweiz", "Andere"),
        },
        {
          id: "q9",
          key: "international_delivery_process",
          type: "single",
          required: true,
          label:
            "Wie funktioniert der Bestell- und Lieferprozess für Kunden außerhalb Ihrer Region, insbesondere in Österreich und den Niederlanden?",
          options: options(
            "Der Kunde bestellt direkt bei uns und wir organisieren die Lieferung",
            "Der Kunde bestellt bei uns und organisiert den Transport selbst",
            "Die Lieferung erfolgt über eine Spedition / einen Logistikpartner",
            "Der Ablauf hängt von Bestellmenge und Zielort ab",
            "Andere",
          ),
          followUps: [
            {
              key: "delivery_conditions",
              type: "longtext",
              when: { type: "always" },
              label:
                "Gibt es Mindestbestellmengen, Lieferkosten, bestimmte Lieferzeiten oder andere wichtige Bedingungen, die wir bei der Bewerbung von Lieferungen nach Österreich, in die Niederlande oder andere Länder berücksichtigen sollten?",
            },
          ],
        },
        {
          id: "q10",
          group: "Content-Stil",
          key: "humor_openness",
          type: "scale",
          required: true,
          label: "Wie offen sind Sie für humorvolle, trendbasierte und etwas unkonventionellere Videos?",
          help: "Dazu können zum Beispiel aktuelle Social-Media-Trends, Mitarbeiter-Sketche, absichtlich gelangweilte Reaktionen, „Mein Chef zwingt mich, dieses Video zu drehen“-Konzepte oder humorvolle Interaktionen zwischen Mitarbeitern gehören.",
          min: 1,
          max: 5,
          anchors: {
            1: "Die Inhalte sollen ausschließlich seriös und professionell sein",
            3: "Eine ausgewogene Mischung aus professionell und unterhaltsam",
            5: "Sehr offen für Humor, Trends, Mitarbeiter-Sketche und ungewöhnliche Konzepte",
          },
        },
        {
          id: "q11",
          key: "on_camera_people",
          type: "multi",
          required: true,
          label: "Wer kann regelmäßig in unseren Reels vor der Kamera erscheinen?",
          options: options(
            "Geschäftsführer / Inhaber",
            "Verkaufsteam",
            "Mitarbeiter im Showroom",
            "Lager- / Logistikmitarbeiter",
            "Mehrere Mitarbeiter gemeinsam",
            "Grundsätzlich können alle Mitarbeiter auftreten",
            "Andere",
          ),
        },
        {
          id: "q12",
          key: "social_languages",
          type: "multi",
          required: true,
          label: "Welche Sprachen sollen wir für die Social-Media-Inhalte verwenden?",
          options: socialLanguages,
          followUps: [
            {
              key: "social_primary_language",
              type: "single",
              when: { type: "minSelected", count: 2 },
              label:
                "Falls mehrere Sprachen verwendet werden sollen: Welche Sprache soll die Hauptsprache des Social-Media-Accounts sein?",
              optionsFrom: "q12",
              options: socialLanguages,
            },
          ],
        },
        {
          id: "q13",
          key: "content_avoid_or_more",
          type: "longtext",
          label:
            "Gibt es etwas, das wir in den Inhalten unbedingt vermeiden sollten – oder etwas, das Sie besonders gerne häufiger sehen möchten?",
        },
      ],
    },
    {
      key: "website",
      title: "Neue Website",
      intro: {
        title: "Website Redesign",
        body: [
          "Wir werden die Website von Bergstone Keramiksan vollständig neu gestalten.",
          "Die neue Website soll nicht nur Ihre Kataloge zeigen, sondern als übersichtlicher Produktkatalog aufgebaut werden, über den Besucher verschiedene Fliesen, Kollektionen, Größen, Ausführungen und technische Informationen entdecken und anschließend eine Anfrage stellen können.",
          "Preise werden auf der Website nicht öffentlich angezeigt.",
        ],
      },
      questions: [
        {
          id: "q14",
          group: "Produktkatalog",
          key: "brands_manufacturers",
          type: "longtext",
          required: true,
          label: "Welche Marken / Hersteller verkaufen Sie aktuell und möchten Sie auf der neuen Website präsentieren?",
          help: "Bitte listen Sie alle aktuell relevanten Marken bzw. Hersteller auf. Falls bestimmte Marken stärker hervorgehoben werden sollen als andere, können Sie dies ebenfalls angeben.",
        },
        {
          id: "q15",
          group: "Sprachen",
          key: "website_languages",
          type: "multi",
          required: true,
          label: "In welchen Sprachen soll die neue Website verfügbar sein?",
          options: websiteLanguages,
          followUps: [
            {
              key: "website_default_language",
              type: "single",
              when: { type: "minSelected", count: 2 },
              label: "Welche Sprache soll die Hauptsprache bzw. Standardsprache der Website sein?",
              optionsFrom: "q15",
              options: websiteLanguages,
            },
          ],
        },
      ],
    },
  ],
  final: {
    title: "Kataloge & Website-Materialien",
    body: [
      "Für die neue Website stellen wir Ihnen zusätzlich einen Google-Drive-Ordner zur Verfügung.",
      "Bitte laden Sie dort alle aktuellen Kataloge hoch, die auf der neuen Website verwendet werden sollen.",
      "Bitte laden Sie möglichst keine veralteten Kataloge oder Kataloge von Produkten hoch, die Sie nicht mehr verkaufen.",
      "Wenn möglich, sortieren oder benennen Sie die Dateien nach Marke / Hersteller, damit wir die Kataloge und Produkte korrekt zuordnen können.",
    ],
    listTitle: "Sie können dort außerdem vorhandene Materialien wie folgende Dateien hochladen:",
    list: [
      "Produktbilder",
      "Showroom-Bilder",
      "Lagerbilder",
      "Teamfotos",
      "Projekt- / Referenzbilder",
      "Logos und Markenmaterialien",
    ],
    note: "Nach unserem aktuellen Stand bietet Bergstone Keramiksan keine Türen mehr an. Türen und entsprechende Tür-Kataloge werden daher nicht auf die neue Website übernommen.",
    // TODO: insert the Google Drive folder link once it exists.
    driveUrl: undefined,
    submitLabel: "Fragebogen absenden",
  },
  success: {
    title: "Vielen Dank!",
    body: [
      "Ihre Angaben wurden erfolgreich übermittelt.",
      "Unser Team wird Ihre Antworten nun auswerten und sowohl für die Content-Planung als auch für die Struktur Ihrer neuen Website berücksichtigen.",
      "Die Informationen zu Ihren Katalogen und Website-Materialien erhalten Sie separat über unseren Google-Drive-Ordner.",
    ],
  },
  translations: { tr: bergstoneKeramiksanTr },
};
