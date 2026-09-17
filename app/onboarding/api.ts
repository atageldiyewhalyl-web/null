import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { AnswerRow, StructuredSubmission } from "./logic";
import type { Answers, Contact, Lang, Questionnaire } from "./types";

const API_BASE =
  import.meta.env.VITE_ONBOARDING_API_BASE ??
  `https://${projectId}.supabase.co/functions/v1/make-server-ea5edff4`;

/**
 * The Supabase function can't run locally (no Docker), so dev uses an in-browser
 * mock unless VITE_ONBOARDING_MOCK=false. Production always hits the function.
 */
const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_ONBOARDING_MOCK !== "false";

type Base = {
  slug: string;
  submissionId: string;
  resumeToken: string;
  questionnaireId: string;
  questionnaireVersion: number;
  answers: Answers;
  contact: Contact;
  currentStep: string;
  currentStepIndex: number;
  startedAt: string;
  language: Lang;
  device: { userAgent: string; viewport: string; language: string };
};

export type ProgressPayload = Base;

export type SubmitPayload = Base & {
  definition: Questionnaire;
  structured: StructuredSubmission;
  rows: AnswerRow[];
};

export const deviceInfo = () => ({
  userAgent: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  language: navigator.language,
});

async function post(path: string, body: unknown, keepalive = false) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
    body: JSON.stringify(body),
    keepalive,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as { success: true; id: string; emailSent?: boolean };
}

export async function saveProgress(payload: ProgressPayload, { keepalive = false } = {}) {
  if (USE_MOCK) return { success: true as const, id: payload.submissionId };
  return post("/client-onboarding/progress", payload, keepalive);
}

export async function submitOnboarding(payload: SubmitPayload) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info("[onboarding mock] submission", payload.structured);
    try {
      window.localStorage.setItem("null-onboarding:mock:last-submission", JSON.stringify(payload));
    } catch {
      // Mock only.
    }
    return { success: true as const, id: payload.submissionId, emailSent: false };
  }
  return post("/client-onboarding/submit", payload);
}
