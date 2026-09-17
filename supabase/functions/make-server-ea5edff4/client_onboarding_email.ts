// Pure helpers for client onboarding (no Deno/npm imports, so they can be tested with Node).

export type OnboardingClientConfig = { name: string; recipients: string[] };

/** Only these slugs are accepted; recipients live server-side so nobody can redirect the email. */
export const ONBOARDING_CLIENTS: Record<string, OnboardingClientConfig> = {
  "bergstone-keramiksan": {
    name: "Bergstone Keramiksan",
    recipients: ["halyl@xn--nll-hoa.com"],
  },
};

export type AnswerRow = {
  question_id: string;
  question_key: string;
  section_key: string;
  question_label: string;
  number: number;
  is_follow_up: boolean;
  position: number;
  value: unknown;
  value_text: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_BODY_BYTES = 400_000;

export function validateBase(body: any): string | null {
  if (!body || typeof body !== "object") return "Invalid body";
  if (!ONBOARDING_CLIENTS[body.slug]) return "Unknown questionnaire";
  if (typeof body.submissionId !== "string" || !UUID_RE.test(body.submissionId)) return "Invalid submission id";
  if (typeof body.resumeToken !== "string" || body.resumeToken.length < 32) return "Invalid token";
  if (typeof body.questionnaireId !== "string" || !Number.isInteger(body.questionnaireVersion)) return "Invalid questionnaire";
  if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) return "Invalid answers";
  if (body.contact && typeof body.contact !== "object") return "Invalid contact";
  return null;
}

export function validateSubmit(body: any): string | null {
  const base = validateBase(body);
  if (base) return base;
  if (!body.definition || body.definition.id !== body.questionnaireId) return "Invalid definition";
  if (!body.structured || body.structured.client !== body.slug) return "Invalid structured payload";
  if (!Array.isArray(body.rows) || body.rows.length === 0) return "Missing answers";
  if (!String(body.contact?.name ?? "").trim()) return "Missing contact name";
  if (!EMAIL_RE.test(String(body.contact?.email ?? "").trim())) return "Invalid contact email";
  return null;
}

export const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const nl2br = (value: string) => escapeHtml(value).replace(/\n/g, "<br>");

type EmailInput = {
  clientName: string;
  title: string;
  project: string;
  submissionId: string;
  completedAt: string;
  language?: string;
  contact: Record<string, string | undefined>;
  sections: { key: string; title: string }[];
  rows: AnswerRow[];
};

export function renderSubmissionEmail(input: EmailInput) {
  const ink = "#0e0e10";
  const muted = "#6b7280";
  const blue = "#007aff";
  const hairline = "#e5e7eb";
  const date = new Date(input.completedAt).toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

  const contactRows = [
    ["Name", input.contact.name],
    ["Position", input.contact.role],
    ["E-Mail", input.contact.email],
    ["Telefon", input.contact.phone],
    ["Sprache", input.language === "tr" ? "Türkisch (Freitext-Antworten auf Türkisch)" : "Deutsch"],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(
      ([label, v]) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:${muted};font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:6px 0;color:${ink};font-size:15px;font-weight:600;">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("");

  const sectionHtml = input.sections
    .map((section) => {
      const rows = input.rows
        .filter((r) => r.section_key === section.key)
        .sort((a, b) => a.position - b.position);
      if (!rows.length) return "";
      const items = rows
        .map(
          (r) => `
          <tr>
            <td style="padding:${r.is_follow_up ? "4px" : "20px"} 0 0 0;border-top:${r.is_follow_up ? "0" : `1px solid ${hairline}`};">
              <p style="margin:${r.is_follow_up ? "8px" : "0"} 0 6px 0;font-size:13px;line-height:1.45;color:${muted};">
                ${r.is_follow_up ? "↳ " : `<span style="color:${blue};font-weight:700;">${r.number}</span>&nbsp;&nbsp;`}${escapeHtml(r.question_label)}
              </p>
              <p style="margin:0 0 ${r.is_follow_up ? "16px" : "18px"} 0;font-size:15px;line-height:1.55;color:${ink};font-weight:600;">${nl2br(r.value_text || "—")}</p>
            </td>
          </tr>`,
        )
        .join("");
      return `
        <h2 style="margin:40px 0 8px 0;font-size:22px;letter-spacing:-0.03em;color:${ink};">${escapeHtml(section.title)}<span style="color:${blue};">.</span></h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${items}</table>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="de"><body style="margin:0;background:#f5f5f7;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
    <div style="background:#ffffff;border:1px solid ${hairline};border-radius:8px;padding:32px 28px;">
      <p style="margin:0 0 28px 0;font-size:22px;font-weight:700;letter-spacing:-0.03em;color:${ink};">nüll<span style="color:${blue};">.</span></p>
      <p style="margin:0 0 6px 0;font-size:13px;color:${muted};">Client Onboarding abgeschlossen · ${escapeHtml(input.project)}</p>
      <h1 style="margin:0 0 20px 0;font-size:30px;line-height:1.05;letter-spacing:-0.045em;color:${ink};">${escapeHtml(input.clientName)}</h1>
      <table role="presentation" cellspacing="0" cellpadding="0">${contactRows}</table>
      ${sectionHtml}
      <p style="margin:36px 0 0 0;padding-top:16px;border-top:1px solid ${hairline};font-size:12px;line-height:1.6;color:${muted};">
        ${escapeHtml(input.title)}<br>
        Eingereicht: ${escapeHtml(date)}<br>
        Submission ID: ${escapeHtml(input.submissionId)}<br>
        Die komplette Auswertung als JSON (für AI-Workflows) hängt an dieser E-Mail an.
      </p>
    </div>
  </div>
</body></html>`;

  const subject = `Onboarding abgeschlossen: ${input.clientName} – ${input.project}`;
  return { subject, html };
}

/** Base64 for UTF-8 text without blowing the call stack on large payloads. */
export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}
