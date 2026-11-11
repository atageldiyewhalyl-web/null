/*
 * Website-Check emails: the visitor's report and Halyl's lead notification.
 * Plain functions (no imports beyond the core types), so a preview can be rendered locally.
 * Email HTML: tables + inline styles only; Arial fallback because most mail apps don't load Inter.
 */
import { domainToUnicode } from "node:url";
import { AREA_LABELS, type Check, type CheckResult } from "./website_check_core.ts";

export const SITE = "https://nuell-agentur.com";
// Case studies live at /referenzen/<slug> (the old /v2/referenzen addresses 301-redirect there).
const CASE_BASE = `${SITE}/referenzen`;
const DISPLAY_SITE = "nuell-agentur.com";
const WA = `https://wa.me/4915256569852?text=${encodeURIComponent("Hallo nüll., ich habe gerade meinen Website-Check bekommen und hätte gern ein kurzes Gespräch.")}`;
const PHONE = "+49 1525 6569852";

const BLUE = "#007aff";
const INK = "#0e0e10";
const BODY = "#424245";
const MUTED = "#6b7280";
const LINE = "#e3e6ec";
const SOFT = "#f5f5f7";
const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const STATUS = {
  ok: { mark: "✓", color: "#1a7f37", label: "In Ordnung" },
  warn: { mark: "!", color: "#b25e00", label: "Ausbaufähig" },
  fail: { mark: "✕", color: "#d70015", label: "Fehlt" },
  info: { mark: "i", color: MUTED, label: "Hinweis" },
} as const;

export const BANDS = {
  gut: { label: "Gut", color: "#1a7f37", text: "Deine Website steht solide da. Mit den Punkten unten holst du den Rest heraus." },
  ausbaufaehig: { label: "Ausbaufähig", color: "#b25e00", text: "Die Grundlagen sind da, aber an mehreren Stellen gehen dir Anfragen verloren." },
  kritisch: { label: "Kritisch", color: "#d70015", text: "Hier gehen dir gerade Anfragen verloren. Die gute Nachricht: Die wichtigsten Punkte lassen sich schnell beheben." },
} as const;

export const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const scoreColor = (s: number | null) => (s === null ? MUTED : s >= 70 ? "#1a7f37" : s >= 40 ? "#b25e00" : "#d70015");
const displayHost = (r: CheckResult) => {
  const h = (r.host ?? r.inputUrl).replace(/^www\./, "");
  return domainToUnicode(h) || h; // xn--nll-hoa.com → nüll.com
};

function bar(score: number | null) {
  if (score === null) return `<span style="font-size:13px;color:${MUTED};">nicht geprüft</span>`;
  const w = Math.max(3, Math.min(100, score));
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>
    <td width="${w}%" style="background:${scoreColor(score)};height:8px;border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>
    ${w < 100 ? `<td width="${100 - w}%" style="background:${LINE};height:8px;border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>` : ""}
  </tr></table>`;
}

// "Gebaut von nüll.": shown when the checked site is one we built. These sites are rated 100/100
// (Halyl's decision); the badge says that this is nüll.'s rating for its own work.
function builtBadge(r: CheckResult) {
  if (!r.builtBy) return "";
  const own = r.builtBy.slug === null;
  const text = own
    ? "Das ist unsere eigene Website. 100 von 100 ist unsere Bewertung für Websites, die wir selbst gebaut haben."
    : `Diese Website hat nüll. für ${esc(r.builtBy.client)} gebaut. 100 von 100 ist unsere Bewertung für Websites, die wir selbst gebaut haben.`;
  const link = own ? `${SITE}/` : `${CASE_BASE}/${r.builtBy.slug}`;
  const label = own ? "Zu nuell-agentur.com" : "Zur Referenz";
  return `<tr><td style="padding:20px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLUE};border-radius:12px;border-collapse:separate;"><tr><td style="padding:18px 20px;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#cfe3ff;">Gebaut von nüll<span style="color:#fff;">.</span></div>
      <p style="font-size:15px;line-height:1.5;color:#ffffff;margin:6px 0 0 0;">${text}</p>
      <a href="${link}" style="display:inline-block;margin-top:10px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:underline;">${label} →</a>
    </td></tr></table>
  </td></tr>`;
}

function checkRow(c: Check) {
  const s = STATUS[c.status];
  return `<tr>
    <td valign="top" width="28" style="padding:10px 0 10px 0;">
      <span style="display:inline-block;width:20px;height:20px;line-height:20px;border-radius:10px;background:${s.color};color:#fff;font-size:12px;font-weight:700;text-align:center;font-family:Arial,sans-serif;">${s.mark}</span>
    </td>
    <td valign="top" style="padding:10px 0;border-bottom:1px solid ${LINE};">
      <div style="font-size:15px;font-weight:600;color:${INK};line-height:1.35;">${esc(c.title)}</div>
      ${c.detail ? `<div style="font-size:14px;color:${MUTED};line-height:1.45;margin-top:3px;">${esc(c.detail)}</div>` : ""}
    </td>
  </tr>`;
}

export function renderReportEmail(r: CheckResult, opts: { trade?: string; city?: string } = {}): { subject: string; html: string; text: string } {
  const host = displayHost(r);
  const subject = r.reachable ? `Dein Website-Check für ${host}: ${r.score} von 100` : `Dein Website-Check für ${host}`;
  const band = r.band ? BANDS[r.band] : null;

  const head = `
    <tr><td style="padding:32px 32px 0 32px;">
      <div style="font-size:26px;font-weight:700;letter-spacing:-0.5px;color:${INK};">nüll<span style="color:${BLUE};">.</span></div>
    </td></tr>`;

  let main: string;
  if (!r.reachable) {
    const why = r.checks[0];
    main = `
      <tr><td style="padding:28px 32px 8px 32px;">
        <div style="font-size:30px;line-height:1.1;font-weight:700;letter-spacing:-1px;color:${INK};">Wir konnten ${esc(host)} nicht prüfen<span style="color:${BLUE};">.</span></div>
        <p style="font-size:16px;line-height:1.5;color:${BODY};margin:16px 0 0 0;">${esc(why?.title ?? "Die Website war nicht erreichbar.")} ${esc(why?.detail ?? "")}</p>
        <p style="font-size:16px;line-height:1.5;color:${BODY};margin:12px 0 0 0;">Wenn du dich vertippt hast, starte den Check einfach noch einmal. Oder antworte auf diese E-Mail, dann schauen wir es uns persönlich an.</p>
      </td></tr>`;
  } else {
    const areas = r.areas
      .map(
        (a) => `<tr>
          <td style="padding:9px 12px 9px 0;font-size:15px;font-weight:600;color:${INK};white-space:nowrap;" width="44%">${esc(a.label)}</td>
          <td style="padding:9px 12px 9px 0;" width="42%">${bar(a.score)}</td>
          <td style="padding:9px 0;font-size:15px;font-weight:700;color:${scoreColor(a.score)};text-align:right;" width="14%">${a.score === null ? "–" : a.score}</td>
        </tr>`,
      )
      .join("");

    const top = r.top.length
      ? `<tr><td style="padding:32px 32px 0 32px;">
          <div style="font-size:22px;font-weight:700;letter-spacing:-0.5px;color:${INK};">Deine 3 wichtigsten Baustellen<span style="color:${BLUE};">.</span></div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-collapse:collapse;">
            ${r.top
              .map(
                (c, i) => `<tr><td style="padding:0 0 10px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border-radius:10px;border-collapse:separate;"><tr>
                    <td valign="top" width="44" style="padding:16px 0 16px 16px;font-size:22px;font-weight:700;color:${BLUE};">${i + 1}</td>
                    <td style="padding:16px 16px 16px 4px;">
                      <div style="font-size:16px;font-weight:700;color:${INK};line-height:1.35;">${esc(c.title)}</div>
                      ${c.detail ? `<div style="font-size:14px;color:${BODY};line-height:1.45;margin-top:4px;">${esc(c.detail)}</div>` : ""}
                    </td>
                  </tr></table>
                </td></tr>`,
              )
              .join("")}
          </table>
        </td></tr>`
      : "";

    const groups = r.areas
      .filter((a) => r.checks.some((c) => c.area === a.key))
      .map(
        (a) => `<tr><td style="padding:26px 32px 0 32px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${MUTED};">${esc(AREA_LABELS[a.key])}${a.score === null ? "" : ` · ${a.score}/100`}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-collapse:collapse;">
            ${r.checks.filter((c) => c.area === a.key).map(checkRow).join("")}
          </table>
        </td></tr>`,
      )
      .join("");

    const opp = r.pagespeed.mobile?.opportunities ?? [];
    const speedTips = opp.length
      ? `<tr><td style="padding:20px 32px 0 32px;">
          <div style="font-size:15px;font-weight:700;color:${INK};">Was die Ladezeit am Handy bremst (laut Google PageSpeed):</div>
          <ul style="margin:8px 0 0 0;padding-left:20px;color:${BODY};font-size:14px;line-height:1.55;">
            ${opp.map((o) => `<li>${esc(o.title)} <span style="color:${MUTED};">(bis zu ${(o.savingsMs / 1000).toFixed(1).replace(".", ",")} s schneller)</span></li>`).join("")}
          </ul>
        </td></tr>`
      : "";

    const notChecked = r.areas.filter((a) => a.score === null).map((a) => a.label);

    main = `
      <tr><td style="padding:28px 32px 0 32px;">
        <div style="font-size:15px;color:${MUTED};">Dein Website-Check für <strong style="color:${INK};">${esc(host)}</strong>${opts.city ? ` · ${esc(opts.city)}` : ""}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px;border-collapse:collapse;"><tr>
          <td valign="bottom" style="font-size:72px;line-height:0.9;font-weight:700;letter-spacing:-3px;color:${INK};">${r.score}</td>
          <td valign="bottom" style="padding:0 0 8px 8px;font-size:18px;font-weight:600;color:${MUTED};">von 100</td>
        </tr></table>
        ${band ? `<div style="margin-top:12px;"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${band.color};color:#fff;font-size:13px;font-weight:700;letter-spacing:0.4px;">${band.label}</span></div>
        <p style="font-size:16px;line-height:1.5;color:${BODY};margin:14px 0 0 0;">${r.builtBy ? "Schnell gefunden, klar aufgebaut, einfach anzufragen: So sieht eine Website von nüll. aus." : band.text}</p>` : ""}
      </td></tr>
      ${builtBadge(r)}
      ${r.builtBy ? "" : `<tr><td style="padding:24px 32px 0 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${areas}</table>
        ${notChecked.length ? `<p style="font-size:13px;color:${MUTED};margin:8px 0 0 0;">Nicht geprüft: ${esc(notChecked.join(", "))}.</p>` : ""}
      </td></tr>
      ${top}
      <tr><td style="padding:32px 32px 0 32px;">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.5px;color:${INK};">Alle Ergebnisse<span style="color:${BLUE};">.</span></div>
      </td></tr>
      ${groups}
      ${speedTips}`}`;
  }

  const cta = `
    <tr><td style="padding:36px 32px 0 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${INK};border-radius:14px;border-collapse:separate;"><tr><td style="padding:28px;">
        <div style="font-size:22px;line-height:1.2;font-weight:700;letter-spacing:-0.5px;color:#fff;">${r.builtBy ? "Du willst auch so eine Website" : "Sollen wir die Punkte gemeinsam durchgehen"}<span style="color:${BLUE};">?</span></div>
        <p style="font-size:15px;line-height:1.5;color:#c7c7cc;margin:10px 0 0 0;">${r.builtBy ? "Schreib uns oder ruf an. Wir zeigen dir, wie wir deinen Betrieb online sichtbar machen." : "15 Minuten am Telefon, kostenlos. Wir sagen dir ehrlich, was sich lohnt und was du selbst machen kannst."}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;border-collapse:collapse;"><tr>
          <td style="background:${BLUE};border-radius:999px;"><a href="${WA}" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#fff;text-decoration:none;">Per WhatsApp schreiben</a></td>
        </tr></table>
        <p style="font-size:14px;color:#c7c7cc;margin:14px 0 0 0;">Oder ruf an: <a href="tel:+4915256569852" style="color:#fff;">${PHONE}</a>. Du kannst auch einfach auf diese E-Mail antworten.</p>
      </td></tr></table>
    </td></tr>`;

  const foot = `
    <tr><td style="padding:28px 32px 32px 32px;font-size:12px;line-height:1.55;color:${MUTED};">
      Automatischer Check der Startseite am ${new Date(r.checkedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" })}.
      Quellen: Google PageSpeed Insights (Lighthouse), eigene Prüfung des Seitencodes${r.places ? ", Google Maps (Places API)" : ""}.
      Die Punkte zu Impressum, Datenschutz und Cookies sind eine technische Prüfung, ob die Seiten und Elemente vorhanden sind, keine Rechtsberatung.
      Inhalte, die erst im Browser nachgeladen werden, erkennt der Check nicht immer.<br><br>
      nüll. · <a href="${SITE}" style="color:${MUTED};">${DISPLAY_SITE}</a> · <a href="${SITE}/impressum" style="color:${MUTED};">Impressum</a> · <a href="${SITE}/datenschutz" style="color:${MUTED};">Datenschutz</a><br>
      Du bekommst diese E-Mail, weil auf ${DISPLAY_SITE}/website-check ein Check mit dieser Adresse gestartet wurde.
    </td></tr>`;

  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${SOFT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};"><tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;font-family:${FONT};border-collapse:separate;">
      ${head}${main}${cta}${foot}
    </table>
  </td></tr></table>
</body></html>`;

  const lines = r.builtBy && r.reachable ? [
    `Dein Website-Check für ${host}`,
    `Ergebnis: ${r.score} von 100`,
    "",
    r.builtBy.slug === null ? "Das ist unsere eigene Website." : `Diese Website hat nüll. für ${r.builtBy.client} gebaut.`,
    "100 von 100 ist unsere Bewertung für Websites, die wir selbst gebaut haben.",
    "",
    `Du willst auch so eine Website? WhatsApp: ${WA} · Telefon: ${PHONE}`,
  ] : [
    `Dein Website-Check für ${host}`,
    r.reachable ? `Ergebnis: ${r.score} von 100 (${band?.label ?? ""})` : (r.checks[0]?.title ?? "Website nicht erreichbar"),
    "",
    ...r.areas.map((a) => `${a.label}: ${a.score === null ? "nicht geprüft" : `${a.score}/100`}`),
    "",
    r.top.length ? "Die 3 wichtigsten Baustellen:" : "",
    ...r.top.map((c, i) => `${i + 1}. ${c.title}${c.detail ? ` – ${c.detail}` : ""}`),
    "",
    "Alle Ergebnisse:",
    ...r.checks.map((c) => `[${STATUS[c.status].label}] ${c.title}`),
    "",
    `Gemeinsam durchgehen? WhatsApp: ${WA} · Telefon: ${PHONE}`,
    "",
    "Technische Prüfung, keine Rechtsberatung.",
  ];
  return { subject, html, text: lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n") };
}

export type LeadInfo = { id: string; email: string; url: string; trade?: string; city?: string; optIn: boolean; durationMs?: number };

export function renderLeadEmail(r: CheckResult | null, lead: LeadInfo, error?: string): { subject: string; html: string } {
  const host = r ? displayHost(r) : lead.url;
  const subject = `Neuer Website-Check: ${host}${r?.score != null ? ` (${r.measuredScore ?? r.score}/100${r.builtBy ? ", nüll.-Kunde" : ""})` : ""}${lead.optIn ? " · Opt-in" : ""}`;
  const row = (k: string, v: string) => `<tr><td style="padding:6px 16px 6px 0;color:${MUTED};font-size:14px;white-space:nowrap;" valign="top">${esc(k)}</td><td style="padding:6px 0;font-size:14px;color:${INK};">${v}</td></tr>`;
  const html = `<div style="font-family:${FONT};max-width:640px;padding:28px;color:${INK};">
    <div style="font-size:22px;font-weight:700;">Neuer Website-Check<span style="color:${BLUE};">.</span></div>
    <table style="margin-top:14px;border-collapse:collapse;">
      ${row("E-Mail", `<a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>`)}
      ${row("Website", `<a href="${esc(r?.finalUrl ?? lead.url)}">${esc(r?.finalUrl ?? lead.url)}</a>`)}
      ${row("Gewerk", esc(lead.trade || "–"))}
      ${row("Stadt", esc(lead.city || "–"))}
      ${row("Betrieb (erkannt)", esc(r?.businessName ?? "–"))}
      ${r?.builtBy ? row("Von nüll. gebaut", `<strong>Ja</strong>, ${esc(r.builtBy.client)}`) : ""}
      ${row("Score", r?.score != null ? `<strong>${r.score}/100</strong> (${esc(r.band ? BANDS[r.band].label : "")})${r.builtBy && r.measuredScore !== r.score ? ` · <span style="color:#d70015;">gemessen: ${r.measuredScore}/100</span> (dem Besucher als 100 gezeigt)` : ""}` : "–")}
      ${row("Follow-up-Opt-in", lead.optIn ? "<strong>Ja</strong>" : "Nein (nur Report, keine Werbe-Mails)")}
      ${r?.places?.match ? row("Google-Profil", `${esc(r.places.match.name)} · ${r.places.match.rating ?? "–"} ★ · ${r.places.match.reviews ?? 0} Bewertungen`) : ""}
      ${error ? row("Fehler", `<span style="color:#d70015;">${esc(error)}</span>`) : ""}
      ${row("ID", esc(lead.id))}
    </table>
    ${r ? `<p style="margin-top:18px;font-size:14px;color:${MUTED};">Top-Baustellen: ${esc(r.top.map((c) => c.title).join(" · ") || "keine")}</p>` : ""}
    <p style="font-size:13px;color:${MUTED};">Der vollständige Report, den der Besucher bekommen hat, hängt als HTML-Datei an.</p>
  </div>`;
  return { subject, html };
}
