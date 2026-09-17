/**
 * Schema for nüll. client onboarding questionnaires.
 * A questionnaire is plain data: the renderer, validation, autosave and the
 * submission payload are all derived from it, so a new client flow is a new
 * config file in ./questionnaires, not new components.
 */

export type OptionDef = {
  /** Stored value. Keep stable once a questionnaire is live. */
  value: string;
  label: string;
  /** Selecting this option reveals an optional free-text field ("Andere"). */
  other?: boolean;
};

/** When a follow-up field is shown. Evaluated against the parent question's answer. */
export type Condition =
  | { type: "always" }
  | { type: "includes"; value: string }
  | { type: "startsWith"; prefix: string }
  | { type: "minSelected"; count: number };

type BaseField = {
  /** Stable machine key, used in the structured JSON for AI consumers. */
  key: string;
  label: string;
  help?: string;
  required?: boolean;
};

export type SingleSelectField = BaseField & {
  type: "single";
  options: OptionDef[];
  /**
   * Narrow the options to what was picked in another question (e.g. "main
   * language" only lists the languages chosen). Falls back to all options
   * when fewer than two match.
   */
  optionsFrom?: string;
};

export type MultiSelectField = BaseField & {
  type: "multi";
  options: OptionDef[];
  max?: number;
};

export type RankingField = BaseField & {
  type: "ranking";
  options: OptionDef[];
  /** Labels for the top and bottom of the list. */
  topLabel?: string;
  bottomLabel?: string;
  /** Let the client add their own entries to the list (e.g. a customer group we didn't list). */
  allowCustom?: boolean;
  customLimit?: number;
};

export type ScaleField = BaseField & {
  type: "scale";
  min: number;
  max: number;
  anchors: Record<number, string>;
};

export type TextField = BaseField & {
  type: "text" | "longtext";
  placeholder?: string;
};

export type FieldDef = SingleSelectField | MultiSelectField | RankingField | ScaleField | TextField;

export type FollowUpDef = FieldDef & { when: Condition };

export type QuestionDef = FieldDef & {
  /** Globally unique within the questionnaire, e.g. "q1". */
  id: string;
  /** Topic shown above the question. Carries forward to following questions until the next group. */
  group?: string;
  followUps?: FollowUpDef[];
};

export type SectionDef = {
  /** Top-level key in the structured JSON, e.g. "social", "website". */
  key: string;
  title: string;
  /** Optional transition screen shown before the section's first question. */
  intro?: { title: string; body: string[] };
  questions: QuestionDef[];
};

export type ContactFieldDef = {
  key: "name" | "role" | "email" | "phone";
  label: string;
  required?: boolean;
  inputType: "text" | "email" | "tel";
  autoComplete: string;
};

export type Lang = "de" | "tr";

/** Text overrides for one field; option labels are listed in the same order as the base options. */
export type FieldTranslation = {
  group?: string;
  label?: string;
  help?: string;
  placeholder?: string;
  options?: string[];
  anchors?: Record<number, string>;
};

/**
 * A translation of a questionnaire. Only text changes: ids, option values and
 * logic come from the base (German) config, so answers stay comparable.
 */
export type QuestionnaireTranslation = {
  title?: string;
  intro?: Partial<Questionnaire["intro"]>;
  contact?: { title?: string; help?: string; fields?: Partial<Record<ContactFieldDef["key"], string>> };
  sections?: Record<string, { title?: string; intro?: { title?: string; body?: string[] } }>;
  questions?: Record<string, FieldTranslation & { followUps?: Record<string, FieldTranslation> }>;
  final?: Partial<Questionnaire["final"]>;
  success?: Partial<Questionnaire["success"]>;
};

export type Questionnaire = {
  id: string;
  version: number;
  /** `logo`: full client logo (intro). `mark`: compact icon for the header. */
  client: { slug: string; name: string; logo?: string; mark?: string };
  project: string;
  title: string;
  intro: {
    headline: string;
    body: string[];
    duration: string;
  };
  contact: {
    title: string;
    help?: string;
    fields: ContactFieldDef[];
  };
  sections: SectionDef[];
  final: {
    title: string;
    body: string[];
    listTitle?: string;
    list?: string[];
    note?: string;
    driveUrl?: string;
    submitLabel: string;
  };
  success: {
    title: string;
    body: string[];
  };
  /** Base language is German; additional languages the client can switch to. */
  translations?: Partial<Record<Exclude<Lang, "de">, QuestionnaireTranslation>>;
};

/* ---------- Answers ---------- */

export type ChoiceAnswer = { selected: string[]; other?: string };
export type RankingAnswer = {
  order: string[];
  touched: boolean;
  /** Entries the client added themselves, keyed by their generated value (e.g. "custom-1"). */
  custom?: Record<string, string>;
};
export type AnswerValue = ChoiceAnswer | RankingAnswer | number | string;

/** Keyed by question id, or `${questionId}.${followUpKey}` for follow-ups. */
export type Answers = Record<string, AnswerValue | undefined>;

export type Contact = Partial<Record<ContactFieldDef["key"], string>>;
