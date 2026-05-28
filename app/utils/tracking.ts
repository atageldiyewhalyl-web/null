export const googleAdsConversionSendTo = {
  formSubmit: "AW-18170315805/uovmCOWs9bQcEJ2IpNhD",
  whatsappClick: "AW-18170315805/pCdLCIe99bQcEJ2IpNhD",
  phoneClick: "AW-18170315805/ed4CCJLF9bQcEJ2IpNhD",
  emailClick: "AW-18170315805/Dz_eCO_R9bQcEJ2IpNhD",
} as const;

type GtagParams = Record<string, string | number | boolean | undefined>;

const getGtag = () => {
  if (typeof window === "undefined") return null;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  return typeof gtag === "function" ? gtag : null;
};

export function trackGaEvent(eventName: string, params: GtagParams = {}) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", eventName, params);
}

export function trackGoogleAdsConversion(sendTo: string, params: GtagParams = {}) {
  trackGaEvent("conversion", {
    send_to: sendTo,
    value: 1.0,
    currency: "USD",
    ...params,
  });
}

export function getContactGoogleAdsConversion(eventName: string) {
  if (eventName.includes("whatsapp_click")) return googleAdsConversionSendTo.whatsappClick;
  if (eventName.includes("phone_click")) return googleAdsConversionSendTo.phoneClick;
  if (eventName.includes("email_click")) return googleAdsConversionSendTo.emailClick;
  return null;
}
