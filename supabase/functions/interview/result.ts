import type { AnswerRow, MessageRow, ParsedBrief, SessionRow } from "./types.ts";
const LANGUAGE_LABELS: Record<string, string> = { de: "Deutsch", tr: "Türkisch", en: "Englisch", nl: "Niederländisch" };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium", timeStyle: "short" });

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Readable transcript: client messages and assistant text only. */
export function transcriptOf(messages: MessageRow[]) {
  return messages
    .filter((m) => (m.kind === "client" || m.kind === "assistant") && m.visible_text?.trim())
    .map((m) => ({ role: m.kind === "client" ? "client" : "assistant", text: m.visible_text!.trim(), at: m.created_at }));
}

/** Built by code from recorded answers + transcript, so nothing depends on the model summarising correctly. */
export function buildResult(opts: {
  brief: ParsedBrief;
  briefVersion: number;
  session: SessionRow;
  answers: AnswerRow[];
  messages: MessageRow[];
  completedAt: string;
}) {
  const { brief, briefVersion, session, answers, messages, completedAt } = opts;
  const byId = new Map(answers.map((a) => [a.field_id, a]));
  const transcript = transcriptOf(messages);
  const minutes = Math.max(1, Math.round((Date.parse(completedAt) - Date.parse(session.started_at)) / 60000));
  const extra = answers.filter((a) => !brief.checklist.some((i) => i.id === a.field_id));

  const md: string[] = [
    `# Interview – ${brief.client}`,
    "",
    `- **Interview:** ${brief.title} (Brief v${briefVersion})`,
    `- **Ausgefüllt von:** ${session.respondent_name ?? byId.get("respondent")?.value ?? "—"}`,
    `- **Sprache:** ${LANGUAGE_LABELS[session.language] ?? session.language}`,
    `- **Abgeschlossen:** ${fmtDate(completedAt)} (Dauer ca. ${minutes} min, ${transcript.filter((t) => t.role === "client").length} Nachrichten)`,
    `- **Session:** ${session.id}`,
    "",
    "## Ergebnisse",
    "",
  ];
  brief.checklist.forEach((item, i) => {
    const a = byId.get(item.id);
    md.push(`### ${i + 1}. ${item.label}${item.required ? "" : " *(optional)*"}`);
    md.push("");
    md.push(a ? a.value : "— nicht erfasst —");
    if (a?.quote) {
      md.push("");
      md.push(`> „${a.quote}“`);
    }
    md.push("");
  });
  if (extra.length) {
    md.push("## Weitere Angaben", "");
    for (const a of extra) {
      md.push(`### ${a.field_id}`, "", a.value, ...(a.quote ? ["", `> „${a.quote}“`] : []), "");
    }
  }
  md.push("## Gesprächsverlauf", "");
  for (const t of transcript) {
    md.push(`**${t.role === "client" ? "Kunde" : "nüll. Assistent"}:** ${t.text.replace(/\n+/g, "  \n")}`, "");
  }

  const json = {
    client: brief.slug,
    client_name: brief.client,
    interview: brief.title,
    brief_version: briefVersion,
    session_id: session.id,
    language: session.language,
    started_at: session.started_at,
    completed_at: completedAt,
    respondent: session.respondent_name ?? byId.get("respondent")?.value ?? null,
    answers: Object.fromEntries(
      brief.checklist.map((item) => {
        const a = byId.get(item.id);
        return [item.id, { label: item.label, required: item.required, value: a?.value ?? null, quote: a?.quote ?? null }];
      }),
    ),
    extra: Object.fromEntries(extra.map((a) => [a.field_id, { value: a.value, quote: a.quote }])),
    transcript,
  };

  return { markdown: md.join("\n"), json };
}

export function renderEmail(opts: { brief: ParsedBrief; sessionId: string; markdown: string; adminUrl?: string }) {
  const { brief, markdown, adminUrl } = opts;
  const results = markdown.split("## Gesprächsverlauf")[0];
  const body = results
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1 style="margin:0 0 16px;font-size:26px;letter-spacing:-0.04em;color:#0e0e10">${escapeHtml(line.slice(2))}<span style="color:#007aff">.</span></h1>`;
      if (line.startsWith("## ")) return `<h2 style="margin:28px 0 8px;font-size:19px;letter-spacing:-0.03em;color:#0e0e10">${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith("### ")) return `<p style="margin:20px 0 4px;font-size:13px;color:#6b7280">${escapeHtml(line.slice(4))}</p>`;
      if (line.startsWith("> ")) return `<p style="margin:6px 0;padding-left:10px;border-left:3px solid #007aff;font-size:14px;color:#424245;font-style:italic">${escapeHtml(line.slice(2))}</p>`;
      if (line.startsWith("- ")) return `<p style="margin:2px 0;font-size:13px;color:#4b5563">${escapeHtml(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
      if (!line.trim()) return "";
      return `<p style="margin:0;font-size:15px;line-height:1.55;color:#0e0e10;font-weight:600">${escapeHtml(line)}</p>`;
    })
    .join("\n");
  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#f5f5f7;font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
<div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:28px">
<p style="margin:0 0 20px;font-size:22px;font-weight:700;letter-spacing:-0.03em">nüll<span style="color:#007aff">.</span></p>
${body}
<p style="margin:28px 0 0;padding-top:14px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">Vollständiges Interview inkl. Gesprächsverlauf als .md und .json im Anhang.${adminUrl ? ` <a href="${escapeHtml(adminUrl)}">In Agency OS öffnen</a>` : ""}</p>
</div></div></body></html>`;
  return { subject: `Interview abgeschlossen: ${brief.client} – ${brief.title}`, html };
}

export function utf8ToBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
