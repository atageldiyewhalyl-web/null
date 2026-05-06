import { useEffect, useMemo, useState } from "react";
import { Settings2, ShieldCheck, X } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_EVENT,
  CookieConsentState,
  getDefaultCookieConsent,
  getStoredCookieConsent,
  storeCookieConsent,
} from "../utils/cookieConsent";

type OptionalConsent = Pick<CookieConsentState, "analytics" | "marketing" | "externalMedia">;

const categories: Array<{
  id: keyof OptionalConsent;
  title: string;
  description: string;
}> = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Hilft uns zu verstehen, wie die Website genutzt wird, damit wir Inhalte verbessern können.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Erlaubt Marketing-, Remarketing- oder Kampagnenmessung, falls solche Dienste eingebunden werden.",
  },
  {
    id: "externalMedia",
    title: "Externe Medien",
    description: "Erlaubt Inhalte und Dienste von Drittanbietern wie eingebettete Medien oder Buchungstools.",
  },
];

function publishConsent(consent: CookieConsentState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
}

export function CookieConsent() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [choices, setChoices] = useState<OptionalConsent>({
    analytics: false,
    marketing: false,
    externalMedia: false,
  });

  useEffect(() => {
    setIsMounted(true);
    const storedConsent = getStoredCookieConsent();

    if (storedConsent) {
      setChoices({
        analytics: storedConsent.analytics,
        marketing: storedConsent.marketing,
        externalMedia: storedConsent.externalMedia,
      });
      publishConsent(storedConsent);
    } else {
      setIsVisible(true);
    }

    const handleOpenSettings = () => {
      const latestConsent = getStoredCookieConsent() ?? getDefaultCookieConsent();
      setChoices({
        analytics: latestConsent.analytics,
        marketing: latestConsent.marketing,
        externalMedia: latestConsent.externalMedia,
      });
      setShowSettings(true);
      setIsVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  const allOptionalAccepted = useMemo(
    () => choices.analytics && choices.marketing && choices.externalMedia,
    [choices],
  );

  const saveConsent = (nextChoices: OptionalConsent) => {
    storeCookieConsent(nextChoices);
    setChoices(nextChoices);
    setIsVisible(false);
    setShowSettings(false);
  };

  const rejectOptional = () => {
    saveConsent({
      analytics: false,
      marketing: false,
      externalMedia: false,
    });
  };

  const acceptAll = () => {
    saveConsent({
      analytics: true,
      marketing: true,
      externalMedia: true,
    });
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-5xl rounded-[1.5rem] border border-black/10 bg-white/95 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-[1.125rem] font-semibold leading-tight tracking-normal text-foreground">
                Cookie-Einstellungen
              </h2>
              <p className="mt-2 max-w-3xl text-[0.9375rem] leading-6 text-neutral-600">
                Wir verwenden Cookies und ähnliche Technologien, um unsere Website bereitzustellen,
                die Nutzung zu analysieren und Inhalte zu verbessern. Einige Dienste können
                personenbezogene Daten in Drittländer übertragen.
              </p>
              <p className="mt-2 text-[0.875rem] leading-6 text-neutral-500">
                Sie können Ihre Auswahl jederzeit ändern.
              </p>
            </div>
          </div>

          {showSettings && (
            <button
              type="button"
              aria-label="Einstellungen schließen"
              className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-foreground"
              onClick={() => setShowSettings(false)}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showSettings && (
          <div className="mt-5 grid gap-3 border-t border-black/5 pt-5">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-neutral-50 p-4">
              <div>
                <h3 className="text-[0.9375rem] font-semibold tracking-normal text-foreground">
                  Notwendige Cookies
                </h3>
                <p className="mt-1 text-[0.8125rem] leading-5 text-neutral-500">
                  Erforderlich für Sicherheit, Spracheinstellungen und Grundfunktionen der Website.
                </p>
              </div>
              <span className="shrink-0 text-[0.8125rem] font-medium text-neutral-500">Immer aktiv</span>
            </div>

            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-black/5 p-4"
              >
                <div>
                  <h3 className="text-[0.9375rem] font-semibold tracking-normal text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] leading-5 text-neutral-500">
                    {category.description}
                  </p>
                </div>
                <Switch
                  aria-label={`${category.title} ein- oder ausschalten`}
                  checked={choices[category.id]}
                  onCheckedChange={(checked) =>
                    setChoices((current) => ({ ...current, [category.id]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-neutral-600 hover:text-foreground"
            onClick={() => setShowSettings((current) => !current)}
          >
            <Settings2 size={16} />
            Einstellungen
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-black/10 px-5"
              onClick={rejectOptional}
            >
              Ablehnen
            </Button>
            {showSettings && (
              <Button
                type="button"
                variant={allOptionalAccepted ? "outline" : "default"}
                className="rounded-full px-5"
                onClick={() => saveConsent(choices)}
              >
                Auswahl speichern
              </Button>
            )}
            <Button type="button" className="rounded-full px-5" onClick={acceptAll}>
              Alle akzeptieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
