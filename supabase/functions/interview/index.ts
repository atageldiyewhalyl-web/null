// AI interview agent: Claude runs the conversation, code owns the checklist,
// completion check, result file and email. See prompt.ts for the agent brief.
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { buildStatusNote, buildSystemPrompt, missingRequired } from "./prompt.ts";
import { buildResult, renderEmail, utf8ToBase64 } from "./result.ts";
import type { AnswerRow, BriefRow, MessageRow, ParsedBrief, SessionRow, StreamEvent, Widget } from "./types.ts";

const MODEL = "claude-opus-5";
const FROM = '"nüll. Interview" <interview@forms.xn--nll-hoa.com>';
const MAX_TEXT = 4000;
const MAX_TRANSCRIPTIONS = 30;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const LANGS = new Set(["de", "tr", "en"]);

const app = new Hono();
app.use("*", cors({ origin: "*", allowHeaders: ["Content-Type", "Authorization"], allowMethods: ["GET", "POST", "OPTIONS"] }));

const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
type DB = ReturnType<typeof db>;

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function loadBrief(supabase: DB, where: { slug?: string; id?: string }) {
  let query = supabase.from("interview_briefs").select("id, slug, client_name, title, status, version, parsed, notify_emails");
  query = where.id ? query.eq("id", where.id) : query.eq("slug", where.slug!);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.status === "archived") throw new HttpError(404, "Interview not found");
  return data as BriefRow;
}

async function loadSession(supabase: DB, sessionId: unknown, token: unknown) {
  if (typeof sessionId !== "string" || typeof token !== "string" || token.length < 32) throw new HttpError(401, "Invalid session");
  const { data, error } = await supabase.from("interview_sessions").select("*").eq("id", sessionId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.resume_token_hash !== (await sha256(token))) throw new HttpError(401, "Invalid session");
  return data as SessionRow;
}

async function loadMessages(supabase: DB, sessionId: string) {
  const { data, error } = await supabase
    .from("interview_messages")
    .select("seq, role, kind, content, visible_text, ui, created_at")
    .eq("session_id", sessionId)
    .order("seq");
  if (error) throw new Error(error.message);
  return (data ?? []) as MessageRow[];
}

async function loadAnswers(supabase: DB, sessionId: string) {
  const { data, error } = await supabase.from("interview_answers").select("field_id, value, quote, updated_at").eq("session_id", sessionId);
  if (error) throw new Error(error.message);
  return (data ?? []) as AnswerRow[];
}

function publicBrief(brief: ParsedBrief) {
  return {
    client: brief.client,
    title: brief.title,
    duration: brief.duration,
    languages: brief.languages,
    logo: brief.logo ?? null,
    mark: brief.mark ?? null,
    formUrl: brief.formUrl ?? null,
    whatsapp: brief.whatsapp ?? null,
  };
}

function publicState(brief: BriefRow, session: SessionRow, messages: MessageRow[], answers: AnswerRow[]) {
  // Consecutive assistant rows (text → tool call → more text) read as one message, like in the live stream.
  const visible: { seq: number; role: "client" | "assistant"; text: string; widget: Widget | null }[] = [];
  for (const m of messages) {
    if (m.kind === "client") {
      visible.push({ seq: m.seq, role: "client", text: m.visible_text ?? "", widget: null });
    } else if (m.kind === "assistant" && (m.visible_text?.trim() || m.ui)) {
      const last = visible.at(-1);
      if (last?.role === "assistant") {
        if (m.visible_text?.trim()) last.text = [last.text, m.visible_text.trim()].filter(Boolean).join("\n\n");
        if (m.ui) last.widget = m.ui;
      } else {
        visible.push({ seq: m.seq, role: "assistant", text: m.visible_text?.trim() ?? "", widget: m.ui ?? null });
      }
    }
  }
  const lastClient = messages.findLast((m) => m.kind === "client")?.seq ?? -1;
  const pending = messages.findLast((m) => m.kind === "assistant" && m.ui && m.seq > lastClient)?.ui ?? null;
  const total = brief.parsed.checklist.filter((i) => i.required).length;
  return {
    brief: publicBrief(brief.parsed),
    session: { id: session.id, status: session.status, language: session.language },
    messages: visible,
    pendingWidget: session.status === "completed" ? null : pending,
    progress: { done: total - missingRequired(brief.parsed, answers).length, total },
  };
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function handle(fn: () => Promise<Response>) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) return json(err.status, { error: err.message });
    console.error("interview error", err);
    return json(500, { error: "Internal error" });
  }
}

/* ---------- Session: create or resume ---------- */

app.post("*/session", (c) =>
  handle(async () => {
    const body = await c.req.json().catch(() => ({}));
    const supabase = db();
    const brief = await loadBrief(supabase, { slug: String(body.slug ?? "") });

    if (body.sessionId && body.token) {
      try {
        const session = await loadSession(supabase, body.sessionId, body.token);
        if (session.brief_id === brief.id) {
          const [messages, answers] = await Promise.all([loadMessages(supabase, session.id), loadAnswers(supabase, session.id)]);
          return json(200, { token: body.token, ...publicState(brief, session, messages, answers) });
        }
      } catch (err) {
        if (!(err instanceof HttpError)) throw err;
      }
    }

    const token = crypto.randomUUID() + crypto.randomUUID();
    const language = LANGS.has(body.language) ? body.language : brief.parsed.language;
    const { data, error } = await supabase
      .from("interview_sessions")
      .insert({
        brief_id: brief.id,
        brief_version: brief.version,
        slug: brief.slug,
        client_name: brief.client_name,
        language,
        resume_token_hash: await sha256(token),
        required_total: brief.parsed.checklist.filter((i) => i.required).length,
        user_agent: String(body.userAgent ?? "").slice(0, 400) || null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return json(200, { token, ...publicState(brief, data as SessionRow, [], []) });
  }),
);

/* ---------- Tools ---------- */

const tools = [
  {
    name: "record_answer",
    description:
      "Save what the client told you for one checklist field. Call as soon as you have usable information; call again with the full corrected value if the client corrects it.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        field_id: { type: "string", description: "Checklist field id" },
        value: { type: "string", description: "Complete, factual summary of the answer for this field" },
        quote: { type: "string", description: "Optional verbatim quote from the client" },
      },
      required: ["field_id", "value"],
    },
  },
  {
    name: "show_choices",
    description:
      "Show tappable answer options under your message for a closed question. The client's selection comes back as their next message. Ask the question in your text; do not repeat the options there.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        field_id: { type: "string" },
        options: { type: "array", items: { type: "string" }, description: "2–14 short options" },
        multi: { type: "boolean", description: "Allow selecting several options" },
        max: { type: "integer", description: "Maximum selections when multi is true" },
        allow_other: { type: "boolean", description: "Let the client type an own answer" },
      },
      required: ["field_id", "options", "multi", "allow_other"],
    },
  },
  {
    name: "show_ranking",
    description:
      "Show a list the client can put in order of priority (drag or arrows) and optionally extend. The resulting order comes back as their next message.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        field_id: { type: "string" },
        items: { type: "array", items: { type: "string" }, description: "2–10 items to rank" },
        allow_add: { type: "boolean", description: "Let the client add own items" },
      },
      required: ["field_id", "items", "allow_add"],
    },
  },
  {
    name: "offer_alternatives",
    description:
      "Show buttons to call/WhatsApp Halyl or fill in a classic form instead. Use when the client is unsure about chatting with an AI or asks for another way.",
    eager_input_streaming: true,
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "finish",
    description:
      "Complete the interview. Only after all required fields are recorded, you summarized the key points and the client confirmed. Returns the missing fields if not complete.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: { confirmed_by_client: { type: "boolean" } },
      required: ["confirmed_by_client"],
    },
  },
];

const isStr = (v: unknown, max = 20000): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= max;
const strList = (v: unknown, min: number, maxLen: number) =>
  Array.isArray(v) && v.length >= min && v.length <= maxLen && v.every((s) => isStr(s, 160));

type ToolOutcome = { content: string; isError?: boolean; widget?: Widget; progressChanged?: boolean; completed?: boolean };

async function runTool(opts: {
  supabase: DB;
  brief: BriefRow;
  session: SessionRow;
  name: string;
  input: Record<string, unknown>;
}): Promise<ToolOutcome> {
  const { supabase, brief, session, name, input } = opts;
  const fieldIds = new Set(brief.parsed.checklist.map((i) => i.id));
  switch (name) {
    case "record_answer": {
      if (!isStr(input.field_id, 80) || !isStr(input.value)) return { content: "field_id and value are required strings.", isError: true };
      if (!fieldIds.has(input.field_id)) {
        return { content: `Unknown field_id "${input.field_id}". Valid ids: ${[...fieldIds].join(", ")}.`, isError: true };
      }
      const { error } = await supabase.from("interview_answers").upsert({
        session_id: session.id,
        field_id: input.field_id,
        value: input.value.trim(),
        quote: isStr(input.quote, 2000) ? input.quote.trim() : null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      if (input.field_id === "respondent") {
        await supabase.from("interview_sessions").update({ respondent_name: input.value.trim().slice(0, 200) }).eq("id", session.id);
      }
      const missing = missingRequired(brief.parsed, await loadAnswers(supabase, session.id)).map((i) => i.id);
      return { content: `Saved. Missing required: ${missing.length ? missing.join(", ") : "none"}.`, progressChanged: true };
    }
    case "show_choices": {
      if (!isStr(input.field_id, 80) || !strList(input.options, 2, 14) || typeof input.multi !== "boolean") {
        return { content: "Invalid show_choices input: need field_id, 2–14 options, multi.", isError: true };
      }
      const max = input.multi && Number.isInteger(input.max) && (input.max as number) > 0 ? (input.max as number) : undefined;
      return {
        content: "The options are now shown under your message. End your turn now without any further text.",
        widget: { type: "choices", fieldId: input.field_id, options: input.options as string[], multi: input.multi, max, allowOther: input.allow_other === true },
      };
    }
    case "show_ranking": {
      if (!isStr(input.field_id, 80) || !strList(input.items, 2, 10)) {
        return { content: "Invalid show_ranking input: need field_id and 2–10 items.", isError: true };
      }
      return {
        content: "The ranking list is now shown under your message. End your turn now without any further text.",
        widget: { type: "ranking", fieldId: input.field_id, items: input.items as string[], allowAdd: input.allow_add === true },
      };
    }
    case "offer_alternatives":
      return { content: "Buttons for a call/WhatsApp with Halyl and the classic form are now shown.", widget: { type: "alternatives" } };
    case "finish": {
      if (input.confirmed_by_client !== true) {
        return { content: "Summarize the key points for the client and wait for their confirmation before calling finish.", isError: true };
      }
      const answers = await loadAnswers(supabase, session.id);
      const missing = missingRequired(brief.parsed, answers);
      if (missing.length) {
        return {
          content: `Not complete yet. Missing required fields: ${missing.map((i) => `${i.id} (${i.label})`).join("; ")}. Ask the client for these first.`,
          isError: true,
        };
      }
      await completeSession({ supabase, brief, session, answers });
      return {
        content: "Interview completed and sent to Halyl. Now thank the client warmly in 1–2 sentences and say Halyl will get back to them. Do not call tools or ask questions.",
        completed: true,
        progressChanged: true,
      };
    }
    default:
      return { content: `Unknown tool ${name}.`, isError: true };
  }
}

async function completeSession(opts: { supabase: DB; brief: BriefRow; session: SessionRow; answers: AnswerRow[] }) {
  const { supabase, brief, session, answers } = opts;
  const completedAt = new Date().toISOString();
  const messages = await loadMessages(supabase, session.id);
  const { markdown, json: result } = buildResult({ brief: brief.parsed, briefVersion: session.brief_version, session, answers, messages, completedAt });
  const total = brief.parsed.checklist.filter((i) => i.required).length;
  const { error } = await supabase
    .from("interview_sessions")
    .update({ status: "completed", completed_at: completedAt, result_md: markdown, result_json: result, required_done: total, updated_at: completedAt })
    .eq("id", session.id);
  if (error) throw new Error(error.message);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  let emailError: string | null = resendKey ? null : "RESEND_API_KEY missing";
  if (resendKey) {
    const adminBase = Deno.env.get("AGENCY_OS_URL");
    const { subject, html } = renderEmail({
      brief: brief.parsed,
      sessionId: session.id,
      markdown,
      adminUrl: adminBase ? `${adminBase.replace(/\/$/, "")}/interviews/${session.id}` : undefined,
    });
    const day = completedAt.slice(0, 10);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: brief.notify_emails,
        subject,
        html,
        attachments: [
          { filename: `interview-${brief.slug}-${day}.md`, content: utf8ToBase64(markdown) },
          { filename: `interview-${brief.slug}-${day}.json`, content: utf8ToBase64(JSON.stringify(result, null, 2)) },
        ],
      }),
    });
    if (!res.ok) emailError = JSON.stringify(await res.json().catch(() => ({ status: res.status })));
  }
  await supabase
    .from("interview_sessions")
    .update(emailError ? { email_error: emailError } : { email_sent_at: new Date().toISOString(), email_error: null })
    .eq("id", session.id);
  if (emailError) console.error("interview email error", emailError);
}

/* ---------- Message: one client turn, streamed ---------- */

app.post("*/message", (c) =>
  handle(async () => {
    const body = await c.req.json().catch(() => ({}));
    const supabase = db();
    let session = await loadSession(supabase, body.sessionId, body.token);
    if (session.status !== "active") throw new HttpError(409, "Interview already completed");
    const brief = await loadBrief(supabase, { id: session.brief_id });

    const isStart = body.start === true;
    // Retry re-runs the reply to the last stored client message (e.g. after a network drop).
    const isRetry = body.retry === true;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!isStart && !isRetry && !text) throw new HttpError(400, "Empty message");
    if (text.length > MAX_TEXT) throw new HttpError(400, "Message too long");
    if (session.client_turns >= brief.parsed.maxTurns + 10) throw new HttpError(429, "Message limit reached");

    // One turn at a time per session.
    const now = new Date();
    const { data: locked } = await supabase
      .from("interview_sessions")
      .update({ busy_until: new Date(now.getTime() + 120_000).toISOString() })
      .eq("id", session.id)
      .or(`busy_until.is.null,busy_until.lt.${now.toISOString()}`)
      .select("*")
      .maybeSingle();
    if (!locked) throw new HttpError(409, "Busy");
    session = locked as SessionRow;

    const messages = await loadMessages(supabase, session.id);
    if (isStart && messages.length) {
      await supabase.from("interview_sessions").update({ busy_until: null }).eq("id", session.id);
      throw new HttpError(409, "Already started");
    }
    if (isRetry && (!messages.length || messages.at(-1)!.kind === "assistant")) {
      await supabase.from("interview_sessions").update({ busy_until: null }).eq("id", session.id);
      throw new HttpError(409, "Nothing to retry");
    }
    if (!isStart && !messages.length) {
      await supabase.from("interview_sessions").update({ busy_until: null }).eq("id", session.id);
      throw new HttpError(400, "Interview not started");
    }

    if (LANGS.has(body.language) && body.language !== session.language) {
      session.language = body.language;
      await supabase.from("interview_sessions").update({ language: body.language }).eq("id", session.id);
    }

    const answers = await loadAnswers(supabase, session.id);
    const clientTurns = session.client_turns + (isStart || isRetry ? 0 : 1);
    let seq = (messages.at(-1)?.seq ?? -1) + 1;
    const append = async (row: Omit<MessageRow, "seq" | "created_at">) => {
      const record = { session_id: session.id, seq: seq++, ...row };
      const { error } = await supabase.from("interview_messages").insert(record);
      if (error) throw new Error(error.message);
      messages.push({ ...record, created_at: new Date().toISOString() } as MessageRow);
    };

    if (!isRetry) {
      await append(
        isStart
          ? { role: "user", kind: "start", content: [{ type: "text", text: "(The client opened the interview.)" }], visible_text: null, ui: null }
          : { role: "user", kind: "client", content: [{ type: "text", text }], visible_text: text, ui: null },
      );
      await append({
        role: "system",
        kind: "status",
        content: buildStatusNote({ brief: brief.parsed, answers, clientTurns, language: session.language, isStart }),
        visible_text: null,
        ui: null,
      });
      await supabase.from("interview_sessions").update({ client_turns: clientTurns, updated_at: new Date().toISOString() }).eq("id", session.id);
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
    const system = [{ type: "text", text: buildSystemPrompt(brief.parsed), cache_control: { type: "ephemeral" } }];
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: StreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        const usage = { input: 0, output: 0, cacheRead: 0 };
        let completed = false;
        try {
          for (let round = 0; round < 8; round += 1) {
            // deno-lint-ignore no-explicit-any
            const params: any = {
              model: MODEL,
              max_tokens: 8000,
              thinking: { type: "adaptive" },
              output_config: { effort: "medium" },
              betas: ["server-side-fallback-2026-07-01"],
              fallbacks: "default",
              system,
              tools,
              messages: messages.map((m) => ({ role: m.role, content: m.content })),
            };
            const response = anthropic.beta.messages.stream(params);
            response.on("text", (delta: string) => send({ t: delta }));

            let final;
            try {
              final = await response.finalMessage();
            } catch (err) {
              if (err instanceof Anthropic.APIError) throw err;
              if (round < 2) continue; // unparseable tool input: re-issue the turn
              throw err;
            }
            usage.input += final.usage.input_tokens ?? 0;
            usage.output += final.usage.output_tokens ?? 0;
            usage.cacheRead += final.usage.cache_read_input_tokens ?? 0;

            if (final.stop_reason === "refusal") {
              send({ error: "refusal" });
              break;
            }

            const assistantText = final.content
              // deno-lint-ignore no-explicit-any
              .filter((b: any) => b.type === "text")
              // deno-lint-ignore no-explicit-any
              .map((b: any) => b.text)
              .join("")
              .trim();
            // deno-lint-ignore no-explicit-any
            const toolUses = final.content.filter((b: any) => b.type === "tool_use");

            if (final.stop_reason === "max_tokens" && toolUses.length) {
              if (round < 2) continue;
              throw new Error("Tool input truncated");
            }

            // Run tools first so the widget can be stored with this assistant message.
            // deno-lint-ignore no-explicit-any
            const results: any[] = [];
            let widget: Widget | null = null;
            for (const use of toolUses) {
              const outcome = await runTool({ supabase, brief, session, name: use.name, input: (use.input ?? {}) as Record<string, unknown> });
              results.push({ type: "tool_result", tool_use_id: use.id, content: outcome.content, ...(outcome.isError ? { is_error: true } : {}) });
              if (outcome.widget) {
                widget = outcome.widget;
                send({ widget: outcome.widget });
              }
              if (outcome.progressChanged) {
                const total = brief.parsed.checklist.filter((i) => i.required).length;
                const done = total - missingRequired(brief.parsed, await loadAnswers(supabase, session.id)).length;
                await supabase.from("interview_sessions").update({ required_done: done }).eq("id", session.id);
                send({ progress: { done, total } });
              }
              if (outcome.completed) {
                completed = true;
                send({ completed: true });
              }
            }

            await append({ role: "assistant", kind: "assistant", content: final.content, visible_text: assistantText || null, ui: widget });
            if (!toolUses.length) break;
            await append({ role: "user", kind: "tool_results", content: results, visible_text: null, ui: null });
            // A widget is the question: stop here and wait for the client instead of letting the model add filler text.
            if (widget && !completed && assistantText) break;
            if (assistantText) send({ t: "\n\n" });
          }
        } catch (err) {
          console.error("interview turn error", err);
          send({ error: err instanceof Anthropic.RateLimitError ? "busy" : "failed" });
        } finally {
          await supabase
            .from("interview_sessions")
            .update({
              busy_until: null,
              input_tokens: session.input_tokens + usage.input,
              output_tokens: session.output_tokens + usage.output,
              cache_read_tokens: session.cache_read_tokens + usage.cacheRead,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.id);
          send({ done: true });
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
  }),
);

/* ---------- Voice dictation ---------- */

app.post("*/transcribe", (c) =>
  handle(async () => {
    const form = await c.req.formData();
    const supabase = db();
    const session = await loadSession(supabase, form.get("sessionId"), form.get("token"));
    if (session.status !== "active") throw new HttpError(409, "Interview already completed");
    if (session.transcriptions >= MAX_TRANSCRIPTIONS) throw new HttpError(429, "Voice limit reached");
    const audio = form.get("audio");
    if (!(audio instanceof File) || audio.size === 0) throw new HttpError(400, "No audio");
    if (audio.size > MAX_AUDIO_BYTES) throw new HttpError(413, "Recording too long");

    const upstream = new FormData();
    upstream.append("model", "gpt-transcribe");
    upstream.append("file", audio, audio.name || "recording.webm");
    upstream.append("prompt", `Interview mit ${session.client_name} über Kunden, Produkte, Social Media und Website.`);
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}` },
      body: upstream,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("transcription error", res.status, JSON.stringify(data).slice(0, 500));
      throw new HttpError(502, "Transcription failed");
    }
    await supabase.from("interview_sessions").update({ transcriptions: session.transcriptions + 1 }).eq("id", session.id);
    return json(200, { text: String(data.text ?? "").trim() });
  }),
);

Deno.serve(app.fetch);
