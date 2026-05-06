export type CookieConsentCategory = "analytics" | "marketing" | "externalMedia";

export type CookieConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  externalMedia: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = "nuell_cookie_consent_v1";
export const COOKIE_CONSENT_EVENT = "nuell:cookie-consent";
export const COOKIE_SETTINGS_EVENT = "nuell:open-cookie-settings";

const defaultConsent: CookieConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  externalMedia: false,
  updatedAt: "",
};

function isConsentState(value: unknown): value is CookieConsentState {
  if (!value || typeof value !== "object") return false;

  const consent = value as Partial<CookieConsentState>;
  return (
    consent.necessary === true &&
    typeof consent.analytics === "boolean" &&
    typeof consent.marketing === "boolean" &&
    typeof consent.externalMedia === "boolean"
  );
}

export function getStoredCookieConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return isConsentState(parsed) ? parsed : null;
  } catch (error) {
    console.warn("Cookie consent could not be read:", error);
    return null;
  }
}

export function storeCookieConsent(consent: Omit<CookieConsentState, "necessary" | "updatedAt">) {
  const nextConsent: CookieConsentState = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    externalMedia: consent.externalMedia,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(nextConsent));
      window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: nextConsent }));
    } catch (error) {
      console.warn("Cookie consent could not be stored:", error);
    }
  }

  return nextConsent;
}

export function hasCookieConsent(category: CookieConsentCategory) {
  return getStoredCookieConsent()?.[category] === true;
}

export function runWithCookieConsent(category: CookieConsentCategory, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  if (hasCookieConsent(category)) {
    callback();
    return () => {};
  }

  const handleConsentChange = (event: Event) => {
    const consent = (event as CustomEvent<CookieConsentState>).detail;
    if (consent?.[category]) {
      callback();
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    }
  };

  window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
}

export function loadScriptWithCookieConsent(
  category: CookieConsentCategory,
  src: string,
  attributes: Record<string, string> = {},
) {
  return runWithCookieConsent(category, () => {
    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    document.head.appendChild(script);
  });
}

export function getDefaultCookieConsent(): CookieConsentState {
  return defaultConsent;
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
