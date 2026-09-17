import type { Answers, Contact, Lang, Questionnaire } from "./types";

export type Draft = {
  submissionId: string;
  resumeToken: string;
  answers: Answers;
  contact: Contact;
  screenId: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  lang?: Lang;
};

const keyFor = (q: Questionnaire) => `null-onboarding:${q.id}:v${q.version}`;

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

export function newDraft(): Draft {
  const now = new Date().toISOString();
  return {
    submissionId: uuid(),
    resumeToken: uuid(),
    answers: {},
    contact: {},
    screenId: "intro",
    startedAt: now,
    updatedAt: now,
  };
}

/** Browser storage can be unavailable (private mode, blocked site data); the flow must still work. */
export function loadDraft(q: Questionnaire): Draft | null {
  try {
    const raw = window.localStorage.getItem(keyFor(q));
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft?.submissionId && draft?.resumeToken ? draft : null;
  } catch {
    return null;
  }
}

export function saveDraft(q: Questionnaire, draft: Draft) {
  try {
    window.localStorage.setItem(keyFor(q), JSON.stringify(draft));
  } catch {
    // Server-side progress saving still covers this session.
  }
}

export function clearDraft(q: Questionnaire) {
  try {
    window.localStorage.removeItem(keyFor(q));
  } catch {
    // Nothing to clear.
  }
}
