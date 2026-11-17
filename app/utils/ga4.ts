// Google Analytics 4 for nuell-agentur.com: property "nüll. Website (nuell-agentur.com)" (564783733) in the
// "nüll tracking" account. It loads only after the visitor accepts "analytics" in the cookie banner; before that
// nothing is sent to Google. If the visitor withdraws consent later, tracking stops and the _ga cookies are removed.
//
// It runs on its own data layer (gaLayer), apart from the GTM container (GTM-PGRDT988) that keeps the Google Ads
// tags, so the two can't interfere. Page views of the client-side route changes are counted by GA4's enhanced
// measurement (browser history events), which is on for this web stream.
// Key events set up in GA4: form_submit, website_check_submit, phone_click, whatsapp_click, email_click.
import { COOKIE_CONSENT_EVENT, runWithCookieConsent, type CookieConsentState } from "./cookieConsent";

export const GA4_ID = "G-0PD5HPZT5K";

type Gtag = (...args: unknown[]) => void;
type GaWindow = typeof window & { gaGtag?: Gtag; gaLayer?: unknown[] };

// event names on the site carry where they happened (whatsapp_click_home_v2, phone_click_blog, form_submit_home_v2):
// GA4 gets the plain name as the key event and the rest as "placement"
const BASE_EVENTS = ["form_submit", "whatsapp_click", "phone_click", "email_click"];

function load() {
  const w = window as GaWindow;
  (w as unknown as Record<string, boolean>)[`ga-disable-${GA4_ID}`] = false;
  if (w.gaGtag) return;
  w.gaLayer = w.gaLayer || [];
  w.gaGtag = function gaGtag() {
    // gtag.js reads the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    (w.gaLayer as unknown[]).push(arguments);
  };
  w.gaGtag("js", new Date());
  w.gaGtag("config", GA4_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}&l=gaLayer`;
  document.head.appendChild(script);
}

function clearGaCookies() {
  const host = location.hostname.replace(/^www\./, "");
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/** Starts GA4 once analytics consent is given (production only). Returns a cleanup function. */
export function startGa4() {
  if (typeof window === "undefined" || !import.meta.env.PROD) return () => {};
  const stopWaiting = runWithCookieConsent("analytics", load);
  const onChange = (event: Event) => {
    const consent = (event as CustomEvent<CookieConsentState>).detail;
    if (consent?.analytics) return load();
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA4_ID}`] = true;
    clearGaCookies();
  };
  window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
  return () => {
    stopWaiting();
    window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  };
}

/** Sends an event to GA4; does nothing while GA4 isn't loaded (no consent yet). */
export function sendGa4Event(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as GaWindow).gaGtag;
  if (!gtag) return;
  const base = BASE_EVENTS.find((b) => name === b || name.startsWith(`${b}_`));
  gtag("event", base || name, base ? { ...params, placement: name.slice(base.length + 1) || "page" } : params);
}
