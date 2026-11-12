import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { COOKIE_CONSENT_EVENT, COOKIE_SETTINGS_EVENT, getStoredCookieConsent, type CookieConsentState } from "../../utils/cookieConsent";

/*
 * A real Google map (standard embed, no API key), loaded only with consent, as German privacy law expects:
 * with "Externe Medien" allowed in the cookie banner it shows straight away; otherwise a placeholder
 * with "Karte laden" loads it for this visit only (the saved choice stays as it is).
 * Google receives data (IP address) once the map loads: Datenschutz should name Google Maps.
 */
export default function GoogleMap({ query, zoom = 12, title, placeholder }: { query: string; zoom?: number; title: string; placeholder?: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [once, setOnce] = useState(false);

  useEffect(() => {
    setAllowed(!!getStoredCookieConsent()?.externalMedia);
    const on = (e: Event) => setAllowed(!!(e as CustomEvent<CookieConsentState>).detail?.externalMedia);
    window.addEventListener(COOKIE_CONSENT_EVENT, on);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, on);
  }, []);

  if (allowed || once) {
    return (
      <iframe
        title={title}
        src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(query).replace(/%20/g, "+")}!6i${zoom}!3m1!1sde!5m1!1sde`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  const load = () => setOnce(true);
  const settings = () => window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#f5f5f7]">
      {/* the drawn sketch: fully visible on phones, faded behind the card on desktop */}
      {placeholder && <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center md:opacity-60">{placeholder}</div>}

      {/* phones: a slim bar at the bottom, the sketch stays visible */}
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-[18px] bg-white/95 p-2.5 pl-3.5 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.05)] backdrop-blur md:hidden">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#eaf3ff] text-[#007aff]">
          <MapPin size={17} strokeWidth={2.4} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.9rem] font-bold tracking-[-0.02em] text-[#0e0e10]">Google Maps</span>
          <button type="button" onClick={settings} className="block truncate text-left text-[0.72rem] font-medium text-[#6b7280]">
            Daten gehen an Google · Einstellungen
          </button>
        </span>
        <button type="button" onClick={load} className="inline-flex min-h-10 flex-none items-center rounded-full bg-[#007aff] px-4 text-[0.74rem] font-black uppercase tracking-[0.1em] text-white">
          Karte laden
        </button>
      </div>

      {/* desktop: the centred card */}
      <div className="relative mx-4 hidden max-w-[420px] rounded-[22px] bg-white p-6 text-center shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.05)] md:block">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#eaf3ff] text-[#007aff]">
          <MapPin size={20} strokeWidth={2.4} aria-hidden />
        </span>
        <p className="mt-3 text-[1.15rem] font-bold tracking-[-0.03em] text-[#0e0e10]">{title}</p>
        <p className="mt-1.5 text-[0.86rem] font-medium leading-snug text-[#6b7280]">Beim Laden der Karte werden Daten an Google übertragen.</p>
        <button
          type="button"
          onClick={load}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#007aff] px-6 text-[0.8rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
        >
          Karte laden
        </button>
        <button type="button" onClick={settings} className="mt-3 block w-full text-[0.8rem] font-semibold text-[#6b7280] underline-offset-2 hover:underline">
          Cookie-Einstellungen
        </button>
      </div>
    </div>
  );
}
