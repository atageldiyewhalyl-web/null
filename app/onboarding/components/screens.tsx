import { forwardRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import { useUiText } from "../i18n";
import { followUpId, resolveOptions, visibleFollowUps } from "../logic";
import type { AnswerValue, Answers, Contact, FieldDef, Questionnaire, QuestionDef, SectionDef } from "../types";
import { ChoiceField, FollowUpBlock, RankingField, ScaleField, TextAreaField, fieldDomId, revealOnFocus } from "./fields";
import { ClientLogo, EASE, FieldError, PrimaryButton, Statement } from "./ui";

const headingBase = "font-bold text-[#0e0e10] outline-none [overflow-wrap:break-word]";

/** Screen heading that receives focus on step change so screen readers announce it. */
const ScreenHeading = forwardRef<HTMLHeadingElement, { id?: string; className?: string; children: ReactNode }>(
  ({ id, className, children }, ref) => (
    <h1 ref={ref} id={id} tabIndex={-1} className={cn(headingBase, className)}>
      {children}
    </h1>
  ),
);
ScreenHeading.displayName = "ScreenHeading";

/* ---------- Intro ---------- */

export const IntroScreen = forwardRef<
  HTMLHeadingElement,
  { q: Questionnaire; resumable: boolean; onStart: () => void; onResume: () => void; onRestart: () => void }
>(({ q, resumable, onStart, onResume, onRestart }, ref) => {
  const t = useUiText();
  return (
    <div className="max-w-[44rem] pb-8 lg:pt-4">
      <ClientLogo name={q.client.name} logo={q.client.logo} className="mb-8 max-h-20 md:mb-10 md:max-h-24" />
      <p className="text-[0.95rem] font-medium text-[#6b7280]">{t.clientOnboardingFor(q.client.name)}</p>
      <ScreenHeading
        ref={ref}
        className="mt-5 max-w-[12ch] text-[clamp(2.35rem,10.2vw,4.75rem)] leading-[0.94] tracking-[-0.065em] sm:max-w-[17ch]"
      >
        <Statement>{q.intro.headline}</Statement>
      </ScreenHeading>
      {q.intro.body.map((p) => (
        <p key={p.slice(0, 24)} className="mt-7 max-w-[36rem] text-[1.06rem] leading-[1.6] text-[#424245] md:text-[1.15rem]">
          {p}
        </p>
      ))}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        {resumable ? (
          <>
            <PrimaryButton onClick={onResume} className="w-full sm:w-auto">
              {t.resume}
            </PrimaryButton>
            <button
              type="button"
              onClick={onRestart}
              className="min-h-12 self-center border-b-2 border-transparent px-1 text-[0.98rem] font-bold tracking-[-0.02em] text-[#0e0e10] transition-[border-color,opacity] hover:border-[#0e0e10] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] sm:self-auto"
            >
              {t.restart}
            </button>
          </>
        ) : (
          <PrimaryButton onClick={onStart} className="w-full sm:w-auto">
            {t.start}
          </PrimaryButton>
        )}
      </div>
      <p className="mt-5 text-[0.92rem] text-[#6b7280]">{resumable ? t.welcomeBack : t.autosaveNote(q.intro.duration)}</p>
    </div>
  );
});
IntroScreen.displayName = "IntroScreen";

/* ---------- Contact ---------- */

export const ContactScreen = forwardRef<
  HTMLHeadingElement,
  { q: Questionnaire; contact: Contact; errors: Record<string, string>; onChange: (contact: Contact) => void }
>(({ q, contact, errors, onChange }, ref) => {
  const t = useUiText();
  return (
  <QuestionLayout
    meta={<span>{t.beforeStart}</span>}
    heading={
      <ScreenHeading ref={ref} id="screen-heading" className={questionHeadingSize(q.contact.title)}>
        {q.contact.title}
      </ScreenHeading>
    }
    help={q.contact.help}
  >
    <div className="grid gap-5 sm:grid-cols-2">
      {q.contact.fields.map((field) => {
        const id = `contact-${field.key}`;
        const error = errors[field.key];
        return (
          <div key={field.key} className={cn(field.key === "name" || field.key === "role" ? "sm:col-span-1" : "")}>
            <label htmlFor={fieldDomId(id)} className="mb-2 block text-[0.95rem] font-semibold tracking-[-0.015em] text-[#0e0e10]">
              {field.label}
              {!field.required ? <span className="font-medium text-[#6b7280]"> {t.optionalSuffix}</span> : null}
            </label>
            <input
              id={fieldDomId(id)}
              type={field.inputType}
              inputMode={field.inputType === "tel" ? "tel" : field.inputType === "email" ? "email" : undefined}
              autoComplete={field.autoComplete}
              value={contact[field.key] ?? ""}
              aria-required={field.required || undefined}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? `${fieldDomId(id)}-error` : undefined}
              onChange={(e) => onChange({ ...contact, [field.key]: e.target.value })}
              onFocus={(e) => revealOnFocus(e.currentTarget)}
              className={cn(
                "h-14 w-full rounded-[8px] border border-black/[0.15] bg-white px-4 text-[1.0625rem] text-[#0e0e10] transition-colors duration-150 placeholder:text-[#8a8f98]",
                "focus:border-[#007aff] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]",
                error && "border-[#c2261c]",
              )}
            />
            <FieldError id={`${fieldDomId(id)}-error`}>{error}</FieldError>
          </div>
        );
      })}
    </div>
    <div className="mt-6 rounded-[8px] bg-[#f5f5f7] px-4 py-3.5 text-[0.95rem] leading-snug text-[#4b5563]">
      {t.company}: <span className="font-semibold text-[#0e0e10]">{q.client.name}</span>
    </div>
  </QuestionLayout>
  );
});
ContactScreen.displayName = "ContactScreen";

/* ---------- Question ---------- */

export function questionHeadingSize(label: string) {
  return label.length > 105
    ? "text-[clamp(1.45rem,5.6vw,2.35rem)] leading-[1.1] tracking-[-0.04em]"
    : "text-[clamp(1.7rem,6.8vw,2.9rem)] leading-[1.04] tracking-[-0.05em]";
}

function QuestionLayout({ meta, heading, help, children }: { meta: ReactNode; heading: ReactNode; help?: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
      <div className="lg:sticky lg:top-36 lg:self-start">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.92rem] font-medium text-[#6b7280]">{meta}</p>
        <div className="mt-4">{heading}</div>
        {help ? <p className="mt-4 max-w-[34rem] text-[1rem] leading-[1.55] text-[#4b5563]">{help}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Field({
  id,
  field,
  answers,
  onAnswer,
  error,
  labelledBy,
}: {
  id: string;
  field: FieldDef;
  answers: Answers;
  onAnswer: (id: string, value: AnswerValue) => void;
  error?: string;
  labelledBy: string;
}) {
  const common = { id, value: answers[id], onChange: (v: AnswerValue) => onAnswer(id, v), error, labelledBy };
  switch (field.type) {
    case "single":
    case "multi":
      return <ChoiceField {...common} field={field} options={resolveOptions(field, answers)} />;
    case "ranking":
      return <RankingField {...common} field={field} />;
    case "scale":
      return <ScaleField {...common} field={field} />;
    case "text":
    case "longtext":
      return <TextAreaField {...common} field={field} required={field.required} placeholder={field.placeholder} />;
  }
}

export const QuestionScreen = forwardRef<
  HTMLHeadingElement,
  {
    question: QuestionDef;
    section: SectionDef;
    group?: string;
    number: number;
    total: number;
    answers: Answers;
    errors: Record<string, string>;
    onAnswer: (id: string, value: AnswerValue) => void;
  }
>(({ question, section, group, number, total, answers, errors, onAnswer }, ref) => {
  const t = useUiText();
  const followUps = visibleFollowUps(question, answers);
  return (
    <QuestionLayout
      meta={
        <>
          <span className="text-[#0e0e10]">{group ?? section.title}</span>
          <span aria-hidden="true" className="h-3 w-px translate-y-[1px] bg-black/20" />
          <span className="tabular-nums">
            {t.questionOf(number, total)}
          </span>
        </>
      }
      heading={
        <ScreenHeading ref={ref} id="screen-heading" className={questionHeadingSize(question.label)}>
          {question.label}
        </ScreenHeading>
      }
      help={question.help}
    >
      {!question.required && (question.type === "longtext" || question.type === "text") ? (
        <p className="mb-3 text-[0.92rem] font-medium text-[#6b7280]">{t.optional}</p>
      ) : null}
      <Field id={question.id} field={question} answers={answers} onAnswer={onAnswer} error={errors[question.id]} labelledBy="screen-heading" />

      <AnimatePresence initial={false}>
        {followUps.map((followUp) => {
          const id = followUpId(question, followUp);
          return (
            <motion.div
              key={id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden"
            >
              <FollowUpBlock
                labelId={`${fieldDomId(id)}-label`}
                label={followUp.label}
                help={followUp.help}
                optional={!followUp.required && (followUp.type === "text" || followUp.type === "longtext")}
              >
                <Field id={id} field={followUp} answers={answers} onAnswer={onAnswer} error={errors[id]} labelledBy={`${fieldDomId(id)}-label`} />
              </FollowUpBlock>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </QuestionLayout>
  );
});
QuestionScreen.displayName = "QuestionScreen";

/* ---------- Section transition ---------- */

export const SectionScreen = forwardRef<
  HTMLHeadingElement,
  { section: SectionDef; previous?: SectionDef }
>(({ section, previous }, ref) => {
  const t = useUiText();
  const body = section.intro?.body ?? [];
  return (
  <div className="grid gap-10 pb-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20 lg:pt-6">
    <div>
      {previous ? (
        <p className="flex items-center gap-2.5 text-[0.95rem] font-medium text-[#0e0e10]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#007aff]" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-white stroke-[2.4]">
              <path d="M3.5 8.4 6.6 11.4 12.6 4.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {t.sectionDone(previous.title, previous.questions.length)}
        </p>
      ) : null}
      <ScreenHeading ref={ref} className="mt-8 text-[clamp(2.5rem,11vw,5.25rem)] leading-[0.92] tracking-[-0.065em]">
        <Statement>{section.intro?.title ?? section.title}</Statement>
      </ScreenHeading>
      <div className="mt-8 grid max-w-[36rem] gap-4 text-[1.04rem] leading-[1.6] text-[#424245] md:text-[1.1rem]">
        {body.map((p, i) => (
          <p key={p.slice(0, 24)} className={cn(body.length > 1 && i === body.length - 1 && "font-semibold text-[#0e0e10]")}>
            {p}
          </p>
        ))}
      </div>
    </div>
    <aside className="self-end border-t border-black/10 pt-6 lg:border-t-0 lg:pt-0">
      <p className="text-[0.95rem] text-[#6b7280]">{t.upNext}</p>
      <p className="mt-2 flex items-baseline justify-between gap-4 text-[1.35rem] font-bold tracking-[-0.04em] text-[#0e0e10]">
        {section.title}
        <span className="text-[0.95rem] font-medium tracking-normal text-[#6b7280]">{t.questionsCount(section.questions.length)}</span>
      </p>
    </aside>
  </div>
  );
});
SectionScreen.displayName = "SectionScreen";

/* ---------- Final ---------- */

export const FinalScreen = forwardRef<HTMLHeadingElement, { q: Questionnaire; submitError?: string }>(({ q, submitError }, ref) => {
  const t = useUiText();
  return (
  <div className="grid gap-10 pb-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20 lg:pt-6">
    <div>
      <p className="text-[0.92rem] font-medium text-[#6b7280]">{t.lastStep}</p>
      <ScreenHeading ref={ref} className="mt-4 max-w-[16ch] text-[clamp(2.2rem,9.5vw,4.4rem)] leading-[0.95] tracking-[-0.06em]">
        <Statement>{q.final.title}</Statement>
      </ScreenHeading>
      <div className="mt-8 grid max-w-[36rem] gap-4 text-[1.02rem] leading-[1.6] text-[#424245]">
        {q.final.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      {q.final.driveUrl ? (
        <a
          href={q.final.driveUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex min-h-12 items-center border-b-2 border-[#111111] text-[1.05rem] font-black tracking-[-0.03em] text-[#111111] transition-opacity hover:opacity-55"
        >
          {t.openDrive}
        </a>
      ) : (
        <p className="mt-8 max-w-[36rem] text-[0.98rem] font-semibold leading-snug text-[#0e0e10]">
          {t.driveLater}
        </p>
      )}
    </div>

    <div className="grid content-start gap-8">
      {q.final.list ? (
        <div>
          <p className="text-[1rem] font-semibold leading-snug tracking-[-0.02em] text-[#0e0e10]">{q.final.listTitle}</p>
          <ul className="mt-4 grid grid-cols-1 border-t border-black/10 sm:grid-cols-2">
            {q.final.list.map((item) => (
              <li key={item} className="flex items-center gap-3 border-b border-black/10 py-3.5 text-[1rem] font-medium text-[#0e0e10] sm:odd:pr-4">
                <span aria-hidden="true" className="h-1.5 w-1.5 flex-none bg-[#007aff]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {q.final.note ? (
        <p className="rounded-[8px] bg-[#f5f5f7] px-5 py-4 text-[0.95rem] leading-[1.55] text-[#424245]">{q.final.note}</p>
      ) : null}
      {submitError ? (
        <div role="alert" className="rounded-[8px] border border-[#c2261c]/30 bg-[#fdf3f2] px-5 py-4 text-[0.95rem] leading-[1.5] text-[#8f1d15]">
          <p className="font-semibold">{t.submitFailed}</p>
          <p className="mt-1">{submitError}</p>
        </div>
      ) : null}
    </div>
  </div>
  );
});
FinalScreen.displayName = "FinalScreen";

/* ---------- Success ---------- */

export const SuccessScreen = forwardRef<HTMLHeadingElement, { q: Questionnaire; name?: string }>(({ q, name }, ref) => {
  const t = useUiText();
  return (
  <div className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[44rem] flex-col justify-center py-10">
    <motion.svg
      viewBox="0 0 64 64"
      className="h-16 w-16 md:h-20 md:w-20"
      aria-hidden="true"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <circle cx="32" cy="32" r="32" fill="#007aff" />
      <motion.path
        d="M19 33.5 28 42l17.5-19"
        fill="none"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
      />
    </motion.svg>
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}>
      <ScreenHeading ref={ref} className="mt-8 text-[clamp(3rem,14vw,6.5rem)] leading-[0.9] tracking-[-0.07em]">
        <Statement>{q.success.title}</Statement>
      </ScreenHeading>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.58 }}
      className="mt-8 grid gap-4 text-[1.04rem] leading-[1.6] text-[#424245] md:text-[1.12rem]"
    >
      <p className="text-[1.2rem] font-semibold tracking-[-0.025em] text-[#0e0e10] md:text-[1.35rem]">{q.success.body[0]}</p>
      {q.success.body.slice(1).map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
      <p className="mt-6 border-t border-black/10 pt-5 text-[0.92rem] text-[#6b7280]">
        {q.client.name}
        {name ? t.submittedBy(name) : ""}
      </p>
    </motion.div>
  </div>
  );
});
SuccessScreen.displayName = "SuccessScreen";
