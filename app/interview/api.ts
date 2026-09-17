import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE = `https://${projectId}.supabase.co/functions/v1/interview`;
const headers = { Authorization: `Bearer ${publicAnonKey}` };

export type Lang = "de" | "tr";

export type Widget =
  | { type: "choices"; fieldId: string; options: string[]; multi: boolean; max?: number; allowOther: boolean }
  | { type: "ranking"; fieldId: string; items: string[]; allowAdd: boolean }
  | { type: "alternatives" };

export type ChatMessage = { id: string; role: "client" | "assistant"; text: string; widget: Widget | null };

export type InterviewState = {
  token: string;
  brief: {
    client: string;
    title: string;
    duration: string;
    languages: string[];
    logo: string | null;
    mark: string | null;
    formUrl: string | null;
    whatsapp: string | null;
  };
  session: { id: string; status: "active" | "completed" | "abandoned"; language: string };
  messages: { seq: number; role: "client" | "assistant"; text: string; widget: Widget | null }[];
  pendingWidget: Widget | null;
  progress: { done: number; total: number };
};

export type StreamEvent =
  | { t: string }
  | { widget: Widget }
  | { progress: { done: number; total: number } }
  | { completed: true }
  | { error: string }
  | { done: true };

export class InterviewError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function openSession(input: { slug: string; sessionId?: string; token?: string; language: Lang }) {
  const res = await fetch(`${BASE}/session`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, userAgent: navigator.userAgent }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new InterviewError(res.status, data.error ?? "Request failed");
  return data as InterviewState;
}

/** Sends one turn and calls `onEvent` for every streamed NDJSON event. */
export async function sendTurn(
  input: { sessionId: string; token: string; language: Lang; text?: string; start?: boolean; retry?: boolean },
  onEvent: (event: StreamEvent) => void,
) {
  const res = await fetch(`${BASE}/message`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new InterviewError(res.status, data.error ?? "Request failed");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) onEvent(JSON.parse(line) as StreamEvent);
    }
  }
}

export async function transcribe(input: { sessionId: string; token: string; audio: Blob; filename: string }) {
  const form = new FormData();
  form.append("sessionId", input.sessionId);
  form.append("token", input.token);
  form.append("audio", input.audio, input.filename);
  const res = await fetch(`${BASE}/transcribe`, { method: "POST", headers, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new InterviewError(res.status, data.error ?? "Transcription failed");
  return String(data.text ?? "");
}
