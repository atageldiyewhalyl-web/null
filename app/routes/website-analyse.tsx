import { useState, type FormEvent } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const industries = ["Kanzlei", "Arztpraxis", "Handwerk", "Immobilien", "Beratung", "Anderes"];

const valueItems = [
  {
    title: "Sichtbarkeit",
    text: "Wir prüfen, wie du bei Google rankst und wo Mitbewerber dich überholen.",
  },
  {
    title: "Conversion",
    text: "Wir schauen uns an, warum Besucher deine Seite verlassen ohne anzufragen.",
  },
  {
    title: "Nächste Schritte",
    text: "Du bekommst 2-3 konkrete Maßnahmen, die du sofort umsetzen kannst.",
  },
];

const faqItems = [
  {
    q: "Was passiert nach meiner Anfrage?",
    a: "Wir schauen uns deine Website vor dem Gespräch an und melden uns innerhalb von 24 Stunden mit einem Terminvorschlag. Das Gespräch dauert 20 Minuten: per Video oder Telefon.",
  },
  {
    q: "Ist das wirklich kostenlos?",
    a: "Ja. Kein versteckter Upsell, kein Pflichtabo. Wenn wir zusammenarbeiten wollen, besprechen wir das offen. Wenn nicht, hast du trotzdem konkrete Antworten.",
  },
  {
    q: "Für wen ist das geeignet?",
    a: "Für Anwälte, Ärzte, Handwerker, Makler und Berater in Deutschland, die bereits eine Website haben, aber kaum Anfragen darüber bekommen.",
  },
];

export function meta() {
  const title = "Kostenlose Website-Analyse | nüll.";
  const description =
    "Wir zeigen dir in 20 Minuten, warum deine Website keine Anfragen bringt. Kostenlos, konkret und ohne Pitch.";
  const url = "https://xn--nll-hoa.com/website-analyse";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function WebsiteAnalyseRoute() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const canSubmit =
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    city.trim() &&
    websiteUrl.trim() &&
    industry &&
    !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!projectId || !publicAnonKey) {
        throw new Error("Supabase configuration missing.");
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4/onboarding-discovery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            lang: "de",
            onboardingType: "website-analysis-request",
            formData: { name, email, phone, city, websiteUrl, industry },
            answers: {
              requestType: "Kostenlose Website-Analyse",
              name,
              email,
              phone,
              city,
              websiteUrl,
              industry,
              "websiteAnalysis.name": name,
              "websiteAnalysis.email": email,
              "websiteAnalysis.phone": phone,
              "websiteAnalysis.city": city,
              "websiteAnalysis.websiteUrl": websiteUrl,
              "websiteAnalysis.industry": industry,
            },
            sections: [
              {
                id: "websiteAnalysis",
                title: "Website-Analyse",
                enTitle: "Website Analysis Request",
                deTitle: "Website-Analyse Anfrage",
                fields: [
                  { label: "Name", value: name },
                  { label: "E-Mail", value: email },
                  { label: "Telefonnummer", value: phone },
                  { label: "Stadt", value: city },
                  { label: "Website-URL", value: websiteUrl },
                  { label: "Branche", value: industry },
                ],
                questions: [
                  { id: "name", en: "Name", de: "Name" },
                  { id: "email", en: "Email", de: "E-Mail" },
                  { id: "phone", en: "Phone", de: "Telefonnummer" },
                  { id: "city", en: "City", de: "Stadt" },
                  { id: "websiteUrl", en: "Website URL", de: "Website-URL" },
                  { id: "industry", en: "Industry", de: "Branche" },
                ],
              },
            ],
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.error ? String(result.error) : `Submission failed with status ${response.status}`,
        );
      }

      setIsComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Senden fehlgeschlagen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0e0e10]">
      <section className="relative mx-auto grid w-full max-w-[118rem] gap-10 px-5 pb-16 pt-24 sm:px-8 md:px-12 lg:min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(25rem,33rem)] lg:items-center lg:gap-16 lg:pb-20 lg:pt-24">
        <a
          href="/"
          aria-label="nüll. Startseite"
          className="absolute left-5 top-7 inline-flex text-[1.8rem] font-bold tracking-[-0.04em] text-[#0e0e10] sm:left-8 md:left-12"
        >
          nüll<span className="text-[#007aff]">.</span>
        </a>

        <div className="min-w-0">
          <p className="text-[0.78rem] font-black uppercase tracking-[0.28em] text-[#007aff]">
            Kostenlose Website-Analyse
          </p>

          <h1 className="mt-5 max-w-[74rem] text-[clamp(2.35rem,8vw,3.55rem)] font-bold leading-[0.96] tracking-[-0.065em] sm:text-[clamp(2.65rem,4vw,3.85rem)] lg:text-[clamp(3rem,3.15vw,3.95rem)]">
            Wir zeigen dir in 20 Minuten, warum deine Website keine Anfragen bringt
            <span className="text-[#007aff]">.</span>
          </h1>

          <p className="mt-6 max-w-3xl text-[clamp(1.05rem,3.8vw,1.22rem)] font-medium leading-relaxed tracking-[-0.035em] text-[#5f6673] lg:text-[1.18rem]">
            Keine Präsentation. Kein Pitch. Nur konkrete Antworten: was fehlt, was schadet,
            und was du als erstes ändern solltest.
          </p>

          <div className="mt-12 max-w-5xl border-y border-[#dfe4ee]">
            {valueItems.map((item, index) => (
              <div
                key={item.title}
                className="grid gap-3 border-b border-[#dfe4ee] py-6 last:border-b-0 sm:grid-cols-[5.75rem_minmax(0,0.45fr)_minmax(0,1fr)] sm:items-baseline sm:gap-7 lg:py-7"
              >
                <span className="text-[0.88rem] font-black uppercase tracking-[0.18em] text-[#007aff]">
                  0{index + 1}
                </span>
                <h2 className="text-[clamp(1.25rem,1.55vw,1.55rem)] font-bold tracking-[-0.04em] text-[#0e0e10]">
                  {item.title}
                </h2>
                <p className="text-[clamp(1.05rem,1.25vw,1.22rem)] font-medium leading-relaxed tracking-[-0.025em] text-[#5f6673]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-4xl border-l-[3px] border-[#007aff] pl-5 text-[clamp(1.2rem,1.55vw,1.45rem)] font-bold leading-snug tracking-[-0.04em] text-[#15171c]">
            Über 20 Websites analysiert. Kanzleien, Arztpraxen, Handwerksbetriebe und
            Beratungsunternehmen in Deutschland.
          </p>
        </div>

        <aside className="min-w-0">
          <div className="rounded-[8px] border border-[#dfe4ee] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-6 lg:p-7">
            {isComplete ? (
              <div className="flex min-h-[28rem] flex-col justify-center text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#007aff] text-white">
                  <Check size={30} strokeWidth={2.4} />
                </div>
                <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.055em]">
                  Anfrage ist da.
                </h2>
                <p className="mx-auto mt-4 max-w-sm text-[1rem] font-medium leading-relaxed text-[#687080]">
                  Wir schauen uns deine Website an und melden uns innerhalb von 24 Stunden mit
                  einem Terminvorschlag.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-[0.78rem] font-black uppercase tracking-[0.18em] text-[#007aff]">
                  Wo sollen wir hinschauen?
                </p>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-[0.86rem] font-bold text-[#242936]">Dein Name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-2 h-[3.25rem] w-full rounded-[8px] border border-[#dfe4ee] bg-[#fbfcff] px-4 text-[1rem] font-semibold outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                      placeholder="Max Mustermann"
                      autoComplete="name"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[0.86rem] font-bold text-[#242936]">Deine E-Mail</span>
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 h-[3.25rem] w-full rounded-[8px] border border-[#dfe4ee] bg-[#fbfcff] px-4 text-[1rem] font-semibold outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                        placeholder="name@firma.de"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[0.86rem] font-bold text-[#242936]">Telefonnummer</span>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="mt-2 h-[3.25rem] w-full rounded-[8px] border border-[#dfe4ee] bg-[#fbfcff] px-4 text-[1rem] font-semibold outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                        placeholder="+49 ..."
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-[0.86rem] font-bold text-[#242936]">Deine Stadt</span>
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="mt-2 h-[3.25rem] w-full rounded-[8px] border border-[#dfe4ee] bg-[#fbfcff] px-4 text-[1rem] font-semibold outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                      placeholder="Mannheim"
                      autoComplete="address-level2"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[0.86rem] font-bold text-[#242936]">Deine Website-URL</span>
                    <input
                      value={websiteUrl}
                      onChange={(event) => setWebsiteUrl(event.target.value)}
                      className="mt-2 h-[3.25rem] w-full rounded-[8px] border border-[#dfe4ee] bg-[#fbfcff] px-4 text-[1rem] font-semibold outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                      placeholder="https://deine-website.de"
                      inputMode="url"
                      autoComplete="url"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[0.86rem] font-bold text-[#242936]">Deine Branche</span>
                    <select
                      value={industry}
                      onChange={(event) => setIndustry(event.target.value)}
                      className="mt-2 h-[3.25rem] w-full appearance-none rounded-[8px] border border-[#dfe4ee] bg-[#fbfcff] px-4 text-[1rem] font-semibold text-[#0e0e10] outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                    >
                      <option value="">Bitte wählen</option>
                      {industries.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {submitError ? (
                  <p className="mt-4 rounded-[8px] bg-red-50 px-4 py-3 text-[0.9rem] font-semibold text-red-700">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#007aff] px-6 text-[1rem] font-bold text-white transition hover:bg-[#0066d6] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
                >
                  {isSubmitting ? "Wird gesendet..." : "Analyse jetzt anfragen"}
                  <ArrowRight size={18} />
                </button>

                <p className="mt-3 text-center text-[0.86rem] font-semibold leading-relaxed text-[#687080]">
                  Kostenlos. Keine Verpflichtung. Wir melden uns innerhalb von 24 Stunden.
                </p>

                <a
                  href="https://wa.me/4915256569852"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#dfe4ee] px-4 text-[0.95rem] font-bold text-[#0e0e10] transition hover:border-[#007aff] hover:text-[#007aff]"
                >
                  <MessageCircle size={18} />
                  Lieber direkt schreiben? → WhatsApp
                </a>
              </form>
            )}
          </div>

        </aside>
      </section>

      <section className="border-t border-[#e5e7eb] bg-[#fbfcff] px-5 py-14 sm:px-8 md:px-12 lg:py-[4.5rem]">
        <div className="mx-auto grid max-w-[118rem] gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-3 text-[0.95rem] font-bold tracking-[-0.03em] text-[#0e0e10]">
              <span className="text-[1.15rem] font-black text-[#007aff]">→</span>
              Fragen
            </p>
            <h2 className="mt-6 max-w-xl text-[clamp(2.35rem,8vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.07em] lg:text-[clamp(3.6rem,4.2vw,5.2rem)]">
              Kurz geklärt<span className="text-[#007aff]">.</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {faqItems.map((item) => (
              <article key={item.q} className="rounded-[8px] border border-[#dfe4ee] bg-white p-5 shadow-[0_16px_46px_rgba(15,23,42,0.05)]">
                <h3 className="text-[1rem] font-bold leading-snug tracking-[-0.025em]">{item.q}</h3>
                <p className="mt-4 text-[0.95rem] font-medium leading-relaxed tracking-[-0.02em] text-[#687080]">
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#007aff] px-5 py-10 text-center sm:py-12">
        <p className="mx-auto max-w-4xl text-[clamp(1.7rem,5vw,3.35rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#ffffff]">
          Jede Woche ohne funktionierende Website sind Anfragen, die woanders landen.
        </p>
      </div>
    </main>
  );
}
