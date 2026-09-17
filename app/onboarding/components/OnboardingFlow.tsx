import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { cn } from "@/components/ui/utils";
import { deviceInfo, saveProgress, submitOnboarding } from "../api";
import { LANGS, UI, UiTextContext, isLang, localizeQuestionnaire, type UiText } from "../i18n";
import {
  buildScreens,
  buildSubmission,
  countQuestions,
  firstInvalidScreen,
  isChoice,
  progressAt,
  pruneAnswers,
  resolveOptions,
  validateContact,
  validateQuestion,
  type Screen,
} from "../logic";
import { clearDraft, loadDraft, newDraft, saveDraft, type Draft } from "../storage";
import type { AnswerValue, Contact, Lang, Questionnaire } from "../types";
import { fieldDomId } from "./fields";
import { ContactScreen, FinalScreen, IntroScreen, QuestionScreen, SectionScreen, SuccessScreen } from "./screens";
import { ClientMark, EASE, PrimaryButton, Wordmark } from "./ui";

type SubmitState = "idle" | "submitting" | "error" | "done";

const screenVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 28 : -20 }),
  center: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -16 : 20, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }),
};

export function OnboardingFlow({ q: base }: { q: Questionnaire }) {
  const [lang, setLang] = useState<Lang>("de");
  const q = useMemo(() => localizeQuestionnaire(base, lang), [base, lang]);
  const t = UI[lang];
  const screens = useMemo(() => buildScreens(q), [q]);
  const total = useMemo(() => countQuestions(q), [q]);

  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resumable, setResumable] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string>();
  const [saved, setSaved] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const draftRef = useRef<Draft | null>(null);
  draftRef.current = draft;

  const screen = screens[index] as Screen;

  /* ----- Restore ----- */
  useEffect(() => {
    const existing = loadDraft(base);
    // A ?lang=tr link wins, then the language the client picked last time.
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const initialLang: Lang = isLang(fromUrl) ? fromUrl : existing?.lang ?? "de";
    setLang(initialLang);
    if (existing) {
      setDraft({ ...existing, lang: initialLang });
      if (existing.completedAt) setSubmitState("done");
      else setResumable(existing.screenId !== "intro");
    } else {
      setDraft({ ...newDraft(), lang: initialLang });
    }
    setReady(true);
  }, [base]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLanguage = (next: Lang) => {
    setLang(next);
    setDraft((d) => (d ? { ...d, lang: next } : d));
    setErrors({});
    try {
      const url = new URL(window.location.href);
      if (next === "de") url.searchParams.delete("lang");
      else url.searchParams.set("lang", next);
      window.history.replaceState(window.history.state, "", url);
    } catch {
      // URL sync is a convenience only.
    }
  };

  /* ----- Autosave locally (debounced) ----- */
  useEffect(() => {
    if (!draft || !ready) return;
    const t = window.setTimeout(() => {
      saveDraft(base, draft);
      setSaved(true);
    }, 350);
    setSaved(false);
    return () => window.clearTimeout(t);
  }, [draft, ready, base]);

  const progressPayload = useCallback(
    (d: Draft, stepIndex: number) => ({
      slug: q.client.slug,
      submissionId: d.submissionId,
      resumeToken: d.resumeToken,
      questionnaireId: q.id,
      questionnaireVersion: q.version,
      answers: d.answers,
      contact: d.contact,
      currentStep: screens[stepIndex]?.id ?? d.screenId,
      currentStepIndex: stepIndex,
      startedAt: d.startedAt,
      language: d.lang ?? "de",
      device: deviceInfo(),
    }),
    [q, screens],
  );

  /* ----- Autosave to the server on step change (never blocks) ----- */
  const syncServer = useCallback(
    (d: Draft, stepIndex: number, keepalive = false) => {
      if (d.completedAt || stepIndex < 2) return;
      saveProgress(progressPayload(d, stepIndex), { keepalive }).catch(() => {
        // Local draft still holds everything; the next step retries.
      });
    },
    [progressPayload],
  );

  useEffect(() => {
    const onHide = () => {
      const d = draftRef.current;
      if (d && d.screenId !== "intro") syncServer(d, screens.findIndex((s) => s.id === d.screenId), true);
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [screens, syncServer]);

  /* ----- Focus + scroll on step change ----- */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(t);
  }, [index, submitState]);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(next);
      setErrors({});
      setDraft((d) => {
        if (!d) return d;
        const updated = { ...d, screenId: screens[next].id, updatedAt: new Date().toISOString() };
        syncServer(updated, next);
        return updated;
      });
    },
    [screens, syncServer],
  );

  const focusFirstError = (errs: Record<string, string>) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    window.setTimeout(() => {
      const id = screen.kind === "contact" ? fieldDomId(`contact-${first}`) : fieldDomId(first);
      const el = document.getElementById(id);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 30);
  };

  const next = () => {
    if (!draft) return;
    let errs: Record<string, string> = {};
    if (screen.kind === "contact") errs = validateContact(q, draft.contact, t.errors);
    if (screen.kind === "question") errs = validateQuestion(screen.question, draft.answers, t.errors);
    if (Object.keys(errs).length) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }
    if (screen.kind === "final") return submit();
    goTo(Math.min(index + 1, screens.length - 1), 1);
  };

  const back = () => index > 0 && goTo(index - 1, -1);

  const submit = async () => {
    if (!draft || submitState === "submitting") return;
    const invalid = firstInvalidScreen(q, screens, draft.answers, draft.contact);
    if (invalid !== -1) {
      const target = screens[invalid];
      goTo(invalid, -1);
      const errs =
        target.kind === "contact"
          ? validateContact(q, draft.contact, t.errors)
          : target.kind === "question"
            ? validateQuestion(target.question, draft.answers, t.errors)
            : {};
      window.setTimeout(() => setErrors(errs), 50);
      return;
    }

    setSubmitState("submitting");
    setSubmitError(undefined);
    const answers = pruneAnswers(base, draft.answers);
    const submittedAt = new Date().toISOString();
    // Labels in the stored/emailed result stay German for every language, so answers are comparable.
    const { structured, rows } = buildSubmission(base, answers, draft.contact, {
      submissionId: draft.submissionId,
      submittedAt,
      language: lang,
    });

    try {
      await submitOnboarding({ ...progressPayload({ ...draft, answers }, index), definition: base, structured, rows });
      const done = { ...draft, completedAt: submittedAt, screenId: "final" };
      setDraft(done);
      saveDraft(base, done);
      setDirection(1);
      setSubmitState("done");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(navigator.onLine ? t.submitRetry : t.submitOffline);
      console.error("Onboarding submit failed", err);
    }
  };

  const setAnswer = (id: string, value: AnswerValue) => {
    setDraft((d) => (d ? { ...d, answers: { ...d.answers, [id]: value }, updatedAt: new Date().toISOString() } : d));
    if (errors[id]) setErrors(({ [id]: _removed, ...rest }) => rest);
  };

  const setContact = (contact: Contact) => {
    setDraft((d) => (d ? { ...d, contact, updatedAt: new Date().toISOString() } : d));
    if (Object.keys(errors).length) {
      setErrors((errs) => Object.fromEntries(Object.entries(errs).filter(([k]) => !contact[k as keyof Contact]?.trim())));
    }
  };

  const restart = () => {
    clearDraft(base);
    setDraft({ ...newDraft(), lang });
    setResumable(false);
    goTo(1, 1);
  };

  const resume = () => {
    if (!draft) return;
    const target = Math.max(0, screens.findIndex((s) => s.id === draft.screenId));
    setResumable(false);
    goTo(target, 1);
  };

  /* ----- Keyboard ----- */
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (submitState === "done" || e.defaultPrevented || e.isComposing) return;
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const typing = tag === "TEXTAREA" || (tag === "INPUT" && !["checkbox", "radio"].includes((target as HTMLInputElement).type));

      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        nextRef.current();
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && tag !== "TEXTAREA" && tag !== "BUTTON" && tag !== "A") {
        if (screen.kind === "intro") return;
        e.preventDefault();
        nextRef.current();
        return;
      }
      // Letter shortcuts for options (desktop).
      if (!typing && screen.kind === "question" && /^[a-z]$/i.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const { question } = screen;
        if (question.type !== "single" && question.type !== "multi") return;
        const options = resolveOptions(question, draftRef.current?.answers ?? {});
        const option = options[e.key.toUpperCase().charCodeAt(0) - 65];
        if (!option) return;
        const input = document.querySelector<HTMLInputElement>(
          `#${fieldDomId(question.id)} input[value="${option.value}"]`,
        );
        if (input && !input.disabled) {
          e.preventDefault();
          input.click();
          input.focus({ preventScroll: true });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, submitState]);

  /* ----- Render ----- */
  const done = submitState === "done";
  const showChrome = ready && !done && screen.kind !== "intro";
  const progress = done ? 1 : progressAt(screens, index, total);
  const answered = screen.kind === "question" && isAnsweredForButton(screen, draft);

  let body: React.ReactNode = null;
  if (!ready || !draft) {
    // Server/prerender output: the intro, so there's no blank page before hydration.
    body = <IntroScreen ref={headingRef} q={q} resumable={false} onStart={() => undefined} onResume={() => undefined} onRestart={() => undefined} />;
  } else if (done) {
    body = <SuccessScreen ref={headingRef} q={q} name={draft.contact.name} />;
  } else if (screen.kind === "intro") {
    body = <IntroScreen ref={headingRef} q={q} resumable={resumable} onStart={() => goTo(1, 1)} onResume={resume} onRestart={restart} />;
  } else if (screen.kind === "contact") {
    body = <ContactScreen ref={headingRef} q={q} contact={draft.contact} errors={errors} onChange={setContact} />;
  } else if (screen.kind === "section") {
    body = <SectionScreen ref={headingRef} section={screen.section} previous={q.sections[screen.sectionIndex - 1]} />;
  } else if (screen.kind === "question") {
    body = (
      <QuestionScreen
        ref={headingRef}
        question={screen.question}
        section={screen.section}
        group={screen.group}
        number={screen.number}
        total={total}
        answers={draft.answers}
        errors={errors}
        onAnswer={setAnswer}
      />
    );
  } else if (screen.kind === "final") {
    body = <FinalScreen ref={headingRef} q={q} submitError={submitState === "error" ? submitError : undefined} />;
  }

  const nextLabel = screen.kind === "final" ? q.final.submitLabel : t.next;

  return (
    <UiTextContext.Provider value={t}>
    <MotionConfig reducedMotion="user">
      <div lang={lang} className="relative min-h-[100dvh] bg-white text-[#0e0e10] antialiased">
        <header className="fixed inset-x-0 top-0 z-40 bg-white pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex h-16 max-w-[76rem] items-center justify-between gap-4 px-5 md:h-20 md:px-10">
            <div className="flex min-w-0 items-center gap-3 md:gap-4">
              <Wordmark />
              <span aria-hidden="true" className="h-5 w-px flex-none bg-black/15" />
              <ClientMark name={q.client.name} mark={q.client.mark} />
            </div>
            <div className="flex flex-none items-center gap-4">
              {showChrome ? (
                <p aria-live="polite" className="hidden items-center gap-1.5 text-[0.82rem] font-medium text-[#6b7280] sm:flex">
                  <span
                    aria-hidden="true"
                    className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", saved ? "bg-[#1f9d55]" : "bg-black/20")}
                  />
                  {saved ? t.saved : t.saving}
                </p>
              ) : null}
              {!done && base.translations ? <LanguageSwitch lang={lang} onChange={changeLanguage} t={t} /> : null}
            </div>
          </div>
          {showChrome || done ? <ProgressRail q={q} progress={progress} t={t} /> : <div className="h-[3px]" />}
          <div className="h-2 md:h-3" aria-hidden="true" />
        </header>

        <main
          className={cn(
            "mx-auto max-w-[76rem] px-5 pt-[calc(6.25rem+env(safe-area-inset-top))] md:px-10 md:pt-[calc(9rem+env(safe-area-inset-top))]",
            showChrome ? "pb-[calc(7.5rem+env(safe-area-inset-bottom))]" : "pb-16",
          )}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={done ? "success" : screen.id}
              custom={direction}
              variants={screenVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {body}
            </motion.div>
          </AnimatePresence>
        </main>

        {showChrome ? (
          <nav
            aria-label={t.navLabel}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:pb-5 md:pt-4"
          >
            <div className="mx-auto flex max-w-[76rem] items-center gap-3 px-5 md:px-10">
              <button
                type="button"
                onClick={back}
                aria-label={t.back}
                className="flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-black/[0.12] px-3.5 text-[0.95rem] font-bold tracking-[-0.02em] text-[#0e0e10] transition-[background-color,border-color] duration-150 [@media(hover:hover)]:hover:border-black/30 active:bg-[#f2f2f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] md:px-5"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="M12.5 5 7.5 10l5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only md:not-sr-only">{t.back}</span>
              </button>

              <p className="ml-1 hidden flex-1 text-[0.85rem] text-[#6b7280] [@media(hover:hover)_and_(min-width:768px)]:block">
                {screen.kind === "question" && answered ? (
                  <>
                    <kbd className="font-sans font-semibold text-[#0e0e10]">Enter</kbd> {t.orPress}
                  </>
                ) : null}
              </p>

              <PrimaryButton
                type="button"
                onClick={next}
                loading={submitState === "submitting"}
                disabled={submitState === "submitting"}
                className="ml-auto flex-1 md:flex-none md:min-w-[12rem]"
              >
                {submitState === "submitting" ? (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 animate-spin fill-none stroke-current stroke-[2.5]">
                      <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
                    </svg>
                    {t.sending}
                  </>
                ) : (
                  <>
                    {nextLabel}
                    {screen.kind !== "final" ? (
                      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[2.4]">
                        <path d="M7.5 5 12.5 10l-5 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </>
                )}
              </PrimaryButton>
            </div>
          </nav>
        ) : null}
      </div>
    </MotionConfig>
    </UiTextContext.Provider>
  );
}

function LanguageSwitch({ lang, onChange, t }: { lang: Lang; onChange: (lang: Lang) => void; t: UiText }) {
  return (
    <div role="group" aria-label={t.languageLabel} className="flex rounded-full border border-black/[0.12] p-0.5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-pressed={lang === l.code}
          aria-label={l.name}
          onClick={() => onChange(l.code)}
          className={cn(
            "flex h-9 min-w-10 items-center justify-center rounded-full px-2.5 text-[0.75rem] font-black tracking-[0.08em] transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#007aff]",
            lang === l.code ? "bg-[#0e0e10] text-white" : "text-[#6b7280] [@media(hover:hover)]:hover:text-[#0e0e10]",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function isAnsweredForButton(screen: Extract<Screen, { kind: "question" }>, draft: Draft | null) {
  if (!draft) return false;
  const value = draft.answers[screen.question.id];
  if (screen.question.type === "ranking") return true;
  if (isChoice(value)) return value.selected.length > 0;
  return value !== undefined && value !== "";
}

/** Two-segment progress: one segment per section, sized by question count. */
function ProgressRail({ q, progress, t }: { q: Questionnaire; progress: number; t: UiText }) {
  const total = countQuestions(q);
  let offset = 0;
  const segments = q.sections.map((section) => {
    const share = section.questions.length / total;
    const start = offset;
    offset += share;
    const fill = Math.min(1, Math.max(0, (progress - start) / share));
    return { key: section.key, title: section.title, share, fill };
  });
  const answered = Math.round(progress * total);

  return (
    <div
      role="progressbar"
      aria-label={t.progressLabel}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={answered}
      aria-valuetext={t.progressText(answered, total)}
      className="mx-auto flex max-w-[76rem] gap-1 px-5 md:px-10"
    >
      {segments.map((s) => (
        <div key={s.key} className="h-[3px] overflow-hidden rounded-full bg-black/[0.08]" style={{ flexGrow: s.share, flexBasis: 0 }}>
          <motion.div
            className="h-full origin-left rounded-full bg-[#007aff]"
            initial={false}
            animate={{ scaleX: s.fill }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        </div>
      ))}
    </div>
  );
}
