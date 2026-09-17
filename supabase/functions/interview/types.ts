// Shared shapes for the interview function. `ParsedBrief` is produced by the
// brief parser in Agency OS and stored in interview_briefs.parsed.

export type ChecklistItem = {
  id: string;
  label: string;
  required: boolean;
  /** Widget hint for the agent: free text, pick from options, or rank options. */
  kind: "text" | "choices" | "single" | "ranking";
  options?: string[];
  max?: number;
};

export type ParsedBrief = {
  slug: string;
  client: string;
  title: string;
  language: string;
  languages: string[];
  maxTurns: number;
  duration: string;
  formUrl?: string;
  whatsapp?: string;
  logo?: string;
  mark?: string;
  outputLanguage: string;
  context: string;
  goal: string;
  checklist: ChecklistItem[];
  rules: string;
};

export type BriefRow = {
  id: string;
  slug: string;
  client_name: string;
  title: string;
  status: string;
  version: number;
  parsed: ParsedBrief;
  notify_emails: string[];
};

export type SessionRow = {
  id: string;
  brief_id: string;
  brief_version: number;
  slug: string;
  client_name: string;
  language: string;
  status: "active" | "completed" | "abandoned";
  resume_token_hash: string;
  respondent_name: string | null;
  client_turns: number;
  required_total: number;
  required_done: number;
  busy_until: string | null;
  transcriptions: number;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  started_at: string;
  completed_at: string | null;
};

export type MessageRow = {
  seq: number;
  role: "user" | "assistant" | "system";
  kind: "start" | "client" | "status" | "assistant" | "tool_results";
  content: unknown;
  visible_text: string | null;
  ui: Widget | null;
  created_at: string;
};

export type AnswerRow = { field_id: string; value: string; quote: string | null; updated_at: string };

export type Widget =
  | { type: "choices"; fieldId: string; options: string[]; multi: boolean; max?: number; allowOther: boolean }
  | { type: "ranking"; fieldId: string; items: string[]; allowAdd: boolean }
  | { type: "alternatives" };

/** NDJSON events streamed to the chat page. */
export type StreamEvent =
  | { t: string }
  | { widget: Widget }
  | { progress: { done: number; total: number } }
  | { completed: true }
  | { error: string }
  | { done: true };
