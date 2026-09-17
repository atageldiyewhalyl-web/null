import { UI, type ValidationMessages } from "./i18n";
import type {
  AnswerValue,
  Answers,
  ChoiceAnswer,
  Condition,
  Contact,
  FieldDef,
  FollowUpDef,
  Lang,
  OptionDef,
  QuestionDef,
  Questionnaire,
  RankingAnswer,
  SectionDef,
} from "./types";

/* ---------- Screens ---------- */

export type Screen =
  | { kind: "intro"; id: "intro" }
  | { kind: "contact"; id: "contact" }
  | { kind: "section"; id: string; section: SectionDef; sectionIndex: number }
  | {
      kind: "question";
      id: string;
      section: SectionDef;
      sectionIndex: number;
      question: QuestionDef;
      /** Topic label in effect for this question. */
      group?: string;
      /** 1-based number across the whole questionnaire. */
      number: number;
    }
  | { kind: "final"; id: "final" };

export function buildScreens(q: Questionnaire): Screen[] {
  const screens: Screen[] = [
    { kind: "intro", id: "intro" },
    { kind: "contact", id: "contact" },
  ];
  let number = 0;
  q.sections.forEach((section, sectionIndex) => {
    if (section.intro) screens.push({ kind: "section", id: `section:${section.key}`, section, sectionIndex });
    let group: string | undefined;
    section.questions.forEach((question) => {
      number += 1;
      group = question.group ?? group;
      screens.push({ kind: "question", id: `q:${question.id}`, section, sectionIndex, question, group, number });
    });
  });
  screens.push({ kind: "final", id: "final" });
  return screens;
}

export const countQuestions = (q: Questionnaire) =>
  q.sections.reduce((total, section) => total + section.questions.length, 0);

/** Share of questions completed before this screen, 0–1. */
export function progressAt(screens: Screen[], index: number, total: number): number {
  const screen = screens[index];
  if (!screen) return 0;
  if (screen.kind === "final") return 1;
  const before = screens.slice(0, index).filter((s) => s.kind === "question").length;
  return total ? before / total : 0;
}

/* ---------- Answers ---------- */

export const followUpId = (question: QuestionDef, followUp: FollowUpDef) => `${question.id}.${followUp.key}`;

export const isChoice = (value: AnswerValue | undefined): value is ChoiceAnswer =>
  typeof value === "object" && value !== null && "selected" in value;

export const isRanking = (value: AnswerValue | undefined): value is RankingAnswer =>
  typeof value === "object" && value !== null && "order" in value;

export function conditionMet(condition: Condition, parent: AnswerValue | undefined): boolean {
  if (condition.type === "always") return true;
  const selected = isChoice(parent) ? parent.selected : [];
  switch (condition.type) {
    case "includes":
      return selected.includes(condition.value);
    case "startsWith":
      return selected.some((value) => value.startsWith(condition.prefix));
    case "minSelected":
      return selected.length >= condition.count;
  }
}

export const visibleFollowUps = (question: QuestionDef, answers: Answers) =>
  (question.followUps ?? []).filter((f) => conditionMet(f.when, answers[question.id]));

/** Options to render, honouring `optionsFrom` (narrow to what was chosen elsewhere). */
export function resolveOptions(field: FieldDef, answers: Answers): OptionDef[] {
  if (!("options" in field)) return [];
  if (field.type !== "single" || !field.optionsFrom) return field.options;
  const source = answers[field.optionsFrom];
  const chosen = isChoice(source) ? source.selected : [];
  const narrowed = field.options.filter((o) => chosen.includes(o.value) && !o.other);
  return narrowed.length >= 2 ? narrowed : field.options;
}

export function defaultRanking(field: FieldDef): RankingAnswer {
  return { order: "options" in field ? field.options.map((o) => o.value) : [], touched: false };
}

/** Marks client-added ranking entries in stored/emailed results. */
export const CUSTOM_ENTRY_NOTE = "vom Kunden ergänzt";

/* ---------- Validation ---------- */

function fieldError(field: FieldDef, value: AnswerValue | undefined, m: ValidationMessages): string | null {
  switch (field.type) {
    case "single":
    case "multi": {
      const selected = isChoice(value) ? value.selected : [];
      if (field.required && selected.length === 0) {
        return field.type === "single" ? m.selectOne : m.selectAtLeastOne;
      }
      if (field.type === "multi" && field.max && selected.length > field.max) {
        return m.selectAtMost(field.max);
      }
      return null;
    }
    case "ranking":
      return null;
    case "scale":
      return field.required && typeof value !== "number" ? m.scale(field.min, field.max) : null;
    case "text":
    case "longtext":
      return field.required && !(typeof value === "string" && value.trim())
        ? m.required
        : null;
  }
}

/** Errors for a question screen, keyed by answer id. Only visible follow-ups are checked. */
export function validateQuestion(
  question: QuestionDef,
  answers: Answers,
  m: ValidationMessages = UI.de.errors,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const main = fieldError(question, answers[question.id], m);
  if (main) errors[question.id] = main;
  for (const followUp of visibleFollowUps(question, answers)) {
    const id = followUpId(question, followUp);
    const error = fieldError(followUp, answers[id], m);
    if (error) errors[id] = error;
  }
  return errors;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(
  q: Questionnaire,
  contact: Contact,
  m: ValidationMessages = UI.de.errors,
): Record<string, string> {
  const missing: Record<string, string> = { name: m.name, email: m.email };
  const errors: Record<string, string> = {};
  for (const field of q.contact.fields) {
    const value = contact[field.key]?.trim() ?? "";
    if (field.required && !value) errors[field.key] = missing[field.key] ?? m.required;
    else if (value && field.inputType === "email" && !EMAIL_RE.test(value)) errors[field.key] = m.emailInvalid;
  }
  return errors;
}

/** Everything required up to and including the final screen, for a last check before submit. */
export function firstInvalidScreen(q: Questionnaire, screens: Screen[], answers: Answers, contact: Contact): number {
  return screens.findIndex((screen) => {
    if (screen.kind === "contact") return Object.keys(validateContact(q, contact)).length > 0;
    if (screen.kind === "question") return Object.keys(validateQuestion(screen.question, answers)).length > 0;
    return false;
  });
}

/* ---------- Submission payload ---------- */

type Formatted = { value: unknown; text: string };

function formatField(field: FieldDef, value: AnswerValue | undefined, answers: Answers): Formatted {
  const labelOf = (v: string) => ("options" in field ? field.options.find((o) => o.value === v)?.label ?? v : v);
  switch (field.type) {
    case "single":
    case "multi": {
      if (!isChoice(value) || value.selected.length === 0) return { value: field.type === "multi" ? [] : null, text: "—" };
      const labels = field.options
        .filter((o) => value.selected.includes(o.value))
        .map((o) => (o.other && value.other?.trim() ? `${o.label}: ${value.other.trim()}` : o.label));
      return field.type === "single"
        ? { value: labels[0] ?? null, text: labels[0] ?? "—" }
        : { value: labels, text: labels.join("\n") };
    }
    case "ranking": {
      const answer = isRanking(value) ? value : defaultRanking(field);
      const labels = answer.order.map((v) =>
        answer.custom?.[v] ? `${answer.custom[v]} (${CUSTOM_ENTRY_NOTE})` : labelOf(v),
      );
      return { value: labels, text: labels.map((l, i) => `${i + 1}. ${l}`).join("\n") };
    }
    case "scale": {
      if (typeof value !== "number") return { value: null, text: "—" };
      const anchor = field.anchors[value];
      return {
        value: { value, min: field.min, max: field.max, ...(anchor ? { label: anchor } : {}) },
        text: `${value} von ${field.max}${anchor ? ` – ${anchor}` : ""}`,
      };
    }
    case "text":
    case "longtext": {
      const text = typeof value === "string" ? value.trim() : "";
      return { value: text || null, text: text || "—" };
    }
  }
}

export type AnswerRow = {
  question_id: string;
  question_key: string;
  section_key: string;
  question_label: string;
  /** Question number shown to the client; follow-ups share their parent's number. */
  number: number;
  is_follow_up: boolean;
  position: number;
  value: unknown;
  value_text: string;
};

export type StructuredEntry = {
  number: number;
  question: string;
  type: FieldDef["type"];
  answer: unknown;
  follow_up_of?: string;
  note?: string;
};

export type StructuredSubmission = {
  client: string;
  client_name: string;
  project: string;
  questionnaire: { id: string; version: number; title: string };
  submission_id: string;
  submitted_at: string;
  /** Language the client filled the form in; labels below are always German, free text is in this language. */
  language: Lang;
  contact: Contact;
} & Record<string, unknown>;

/**
 * Builds the AI-friendly JSON ({ client, social: {...}, website: {...} }) and
 * flat per-answer rows. Hidden follow-ups are dropped.
 */
export function buildSubmission(
  q: Questionnaire,
  answers: Answers,
  contact: Contact,
  meta: { submissionId: string; submittedAt: string; language?: Lang },
) {
  const structured: StructuredSubmission = {
    client: q.client.slug,
    client_name: q.client.name,
    project: q.project,
    questionnaire: { id: q.id, version: q.version, title: q.title },
    submission_id: meta.submissionId,
    submitted_at: meta.submittedAt,
    language: meta.language ?? "de",
    contact: Object.fromEntries(Object.entries(contact).filter(([, v]) => v?.trim())) as Contact,
  };
  const rows: AnswerRow[] = [];

  let number = 0;
  let position = 0;
  for (const section of q.sections) {
    const entries: Record<string, StructuredEntry> = {};

    for (const question of section.questions) {
      number += 1;
      const main = formatField(question, answers[question.id], answers);
      entries[question.key] = {
        number,
        question: question.label,
        type: question.type,
        answer: main.value,
        ...(question.type === "ranking" ? { note: "Reihenfolge: höchste Priorität zuerst" } : {}),
      };
      rows.push({
        question_id: question.id,
        question_key: question.key,
        section_key: section.key,
        question_label: question.label,
        number,
        is_follow_up: false,
        position: position++,
        value: main.value,
        value_text: main.text,
      });

      for (const followUp of visibleFollowUps(question, answers)) {
        const id = followUpId(question, followUp);
        const formatted = formatField(followUp, answers[id], answers);
        entries[followUp.key] = {
          number,
          question: followUp.label,
          type: followUp.type,
          answer: formatted.value,
          follow_up_of: question.key,
        };
        rows.push({
          question_id: id,
          question_key: followUp.key,
          section_key: section.key,
          question_label: followUp.label,
          number,
          is_follow_up: true,
          position: position++,
          value: formatted.value,
          value_text: formatted.text,
        });
      }
    }

    structured[section.key] = entries;
  }

  return { structured, rows };
}

/** Removes answers of follow-ups that are currently hidden, and unknown keys. */
export function pruneAnswers(q: Questionnaire, answers: Answers): Answers {
  const pruned: Answers = {};
  for (const section of q.sections) {
    for (const question of section.questions) {
      if (answers[question.id] !== undefined) pruned[question.id] = answers[question.id];
      for (const followUp of visibleFollowUps(question, answers)) {
        const id = followUpId(question, followUp);
        if (answers[id] !== undefined) pruned[id] = answers[id];
      }
    }
  }
  return pruned;
}
