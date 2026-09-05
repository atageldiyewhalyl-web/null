// All analytics now runs through Google Tag Manager (GTM-PGRDT988).
// These helpers push structured events onto window.dataLayer; the actual
// GA4 / Google Ads tags are configured inside the GTM container and fire
// off custom-event triggers matching the `event` names pushed here.

export const googleAdsConversionSendTo = {
  formSubmit: "AW-18170315805/uovmCOWs9bQcEJ2IpNhD",
  whatsappClick: "AW-18170315805/pCdLCIe99bQcEJ2IpNhD",
  phoneClick: "AW-18170315805/ed4CCJLF9bQcEJ2IpNhD",
  emailClick: "AW-18170315805/Dz_eCO_R9bQcEJ2IpNhD",
} as const;

type DataLayerParams = Record<string, string | number | boolean | undefined>;

const pushToDataLayer = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
};

export function trackGaEvent(eventName: string, params: DataLayerParams = {}) {
  pushToDataLayer({ event: eventName, ...params });
}

export function trackGoogleAdsConversion(sendTo: string, params: DataLayerParams = {}) {
  pushToDataLayer({
    event: "google_ads_conversion",
    send_to: sendTo,
    value: 1.0,
    currency: "EUR",
    ...params,
  });
}

export function getContactGoogleAdsConversion(eventName: string) {
  if (eventName.includes("whatsapp_click")) return googleAdsConversionSendTo.whatsappClick;
  if (eventName.includes("phone_click")) return googleAdsConversionSendTo.phoneClick;
  if (eventName.includes("email_click")) return googleAdsConversionSendTo.emailClick;
  return null;
}
