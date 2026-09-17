import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import { ClientLogo, ClientMark, EASE, PrimaryButton, Wordmark } from "../onboarding/components/ui";
import { InterviewError, openSession, sendTurn, transcribe, type ChatMessage, type InterviewState, type Lang, type Widget } from "./api";
import { TEXT, type ChatText } from "./i18n";
import { useRecorder } from "./useRecorder";
import { Alternatives, WidgetView } from "./widgets";

const storageKey = (slug: string) => `null-interview:${slug}`;
const readStored = (slug: string): { sessionId?: string; token?: string; lang?: Lang } => {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey(slug)) ?? "{}");
  } catch {
    return {};
  }
};
const writeStored = (slug: string, value: { sessionId: string; token: string; lang: Lang }) => {
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(value));
  } catch {
    // The session still works for this visit.
  }
};

/** Minimal formatting for assistant text: paragraphs, line breaks, **bold**, "- " lists. */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  const inline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold text-[#0e0e10]">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
    );
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
          return (
            <ul key={i} className="my-2 grid gap-1 pl-5 [list-style:disc]">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-•]\s+/, ""))}</li>)}
            </ul>
          );
        }
        return (
          <p key={i} className="[&+p]:mt-3">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Keeps the chat exactly as tall as the visible viewport, so the composer stays above the mobile keyboard. */
function useViewportHeight() {
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    const update = () => setHeight(Math.round(vv?.height ?? window.innerHeight));
    update();
    vv?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return height;
}

function LanguageSwitch({ lang, languages, onChange, label }: { lang: Lang; languages: string[]; onChange: (l: Lang) => void; label: string }) {
  const options = (["de", "tr"] as Lang[]).filter((l) => languages.includes(l));
  if (options.length < 2) return null;
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-black/[0.12] p-0.5">
      {options.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => onChange(l)}
          className={cn(
            "flex h-8 min-w-9 items-center justify-center rounded-full px-2 text-[0.72rem] font-black tracking-[0.08em] transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#007aff]",
            lang === l ? "bg-[#0e0e10] text-white" : "text-[#6b7280] [@media(hover:hover)]:hover:text-[#0e0e10]",
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#9ca3af]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

type Phase = "loading" | "intro" | "chat" | "notFound" | "loadFailed";

export function InterviewChat({ slug }: { slug: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [lang, setLang] = useState<Lang>("de");
  const [state, setState] = useState<InterviewState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<Widget | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const recorder = useRecorder();
  const t: ChatText = TEXT[lang];
  const height = useViewportHeight();
  const scroller = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);

  /* ----- Load / resume ----- */
  const load = useCallback(async () => {
    const stored = readStored(slug);
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const initialLang: Lang = fromUrl === "tr" || fromUrl === "de" ? fromUrl : stored.lang ?? "de";
    setLang(initialLang);
    try {
      const data = await openSession({ slug, sessionId: stored.sessionId, token: stored.token, language: initialLang });
      writeStored(slug, { sessionId: data.session.id, token: data.token, lang: initialLang });
      setState(data);
      setMessages(data.messages.map((m) => ({ id: `s${m.seq}`, role: m.role, text: m.text, widget: m.widget })));
      setPending(data.pendingWidget);
      setProgress(data.progress);
      setCompleted(data.session.status === "completed");
      setPhase(data.messages.length ? "chat" : "intro");
      if (!fromUrl && data.session.language === "tr") setLang("tr");
      const last = data.messages.at(-1);
      if (data.session.status === "active" && last?.role === "client") setFailed(true);
    } catch (err) {
      setPhase(err instanceof InterviewError && err.status === 404 ? "notFound" : "loadFailed");
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const changeLang = (next: Lang) => {
    setLang(next);
    if (state) writeStored(slug, { sessionId: state.session.id, token: state.token, lang: next });
    document.documentElement.lang = next;
  };
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* ----- Scrolling ----- */
  const onScroll = () => {
    const el = scroller.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, pending, busy, failed, completed, height]);

  /* ----- Sending ----- */
  const run = useCallback(
    async (input: { text?: string; start?: boolean; retry?: boolean }, attempt = 0) => {
      if (!state) return;
      setBusy(true);
      setFailed(false);
      setNotice(null);
      setPending(null);
      stickToBottom.current = true;
      const replyId = `a${Date.now()}`;
      if (input.text) setMessages((m) => [...m, { id: `c${Date.now()}`, role: "client", text: input.text!, widget: null }]);
      setMessages((m) => [...m, { id: replyId, role: "assistant", text: "", widget: null }]);
      const patchReply = (fn: (msg: ChatMessage) => ChatMessage) => setMessages((m) => m.map((msg) => (msg.id === replyId ? fn(msg) : msg)));
      let errored: string | null = null;
      try {
        await sendTurn({ sessionId: state.session.id, token: state.token, language: lang, ...input }, (event) => {
          if ("t" in event) patchReply((msg) => ({ ...msg, text: msg.text + event.t }));
          else if ("widget" in event) {
            patchReply((msg) => ({ ...msg, widget: event.widget }));
            if (event.widget.type !== "alternatives") setPending(event.widget);
          } else if ("progress" in event) setProgress(event.progress);
          else if ("completed" in event) setCompleted(true);
          else if ("error" in event) errored = event.error;
        });
      } catch (err) {
        if (err instanceof InterviewError && err.status === 409 && attempt < 3 && err.message === "Busy") {
          setMessages((m) => m.filter((msg) => msg.id !== replyId));
          setNotice(t.busy);
          await new Promise((r) => setTimeout(r, 2500));
          return run({ retry: true }, attempt + 1);
        }
        errored = "failed";
      }
      if (errored === "refusal") {
        patchReply((msg) => ({ ...msg, text: t.refusal, widget: null }));
      } else if (errored) {
        setMessages((m) => m.filter((msg) => msg.id !== replyId || msg.text.trim() || msg.widget));
        setFailed(true);
      } else {
        setMessages((m) => m.map((msg) => (msg.id === replyId ? { ...msg, text: msg.text.trim() } : msg)).filter((msg) => msg.id !== replyId || msg.text || msg.widget));
      }
      setNotice(null);
      setBusy(false);
      window.setTimeout(() => composer.current?.focus({ preventScroll: true }), 50);
    },
    [state, lang, t],
  );

  const start = async () => {
    setPhase("chat");
    await run({ start: true });
  };

  const submitDraft = () => {
    const text = draft.trim();
    if (!text || busy || completed) return;
    setDraft("");
    run({ text });
  };

  /* ----- Voice ----- */
  const toggleRecording = async () => {
    if (!state) return;
    if (recorder.state === "recording") {
      recorder.stop();
      return;
    }
    setNotice(null);
    const pendingRecording = recorder.start();
    const result = await pendingRecording;
    if (!result) {
      if (recorder.state === "denied") setNotice(t.micDenied);
      return;
    }
    setTranscribing(true);
    try {
      const text = await transcribe({ sessionId: state.session.id, token: state.token, audio: result.blob, filename: result.filename });
      if (text) setDraft((d) => (d.trim() ? `${d.trim()} ${text}` : text));
      window.setTimeout(() => composer.current?.focus(), 30);
    } catch (err) {
      setNotice(err instanceof InterviewError && err.status === 429 ? t.voiceLimit : t.voiceFailed);
    } finally {
      setTranscribing(false);
    }
  };
  useEffect(() => {
    if (recorder.state === "denied" || recorder.state === "unsupported") setNotice(t.micDenied);
  }, [recorder.state, t]);

  /* ----- Composer autogrow ----- */
  useLayoutEffect(() => {
    const el = composer.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  const brief = state?.brief;
  const whatsappHref = brief?.whatsapp
    ? `https://wa.me/${brief.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(t.whatsappText(brief.client))}`
    : null;
  const formHref = brief?.formUrl ? `${brief.formUrl}${lang === "tr" ? "?lang=tr" : ""}` : null;

  const header = (
    <header className="flex-none border-b border-black/[0.06] bg-white pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-[48rem] items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Wordmark className="text-[1.3rem]" />
          {brief ? (
            <>
              <span aria-hidden="true" className="h-5 w-px flex-none bg-black/15" />
              <ClientMark name={brief.client} mark={brief.mark ?? undefined} />
            </>
          ) : null}
        </div>
        <div className="flex flex-none items-center gap-2">
          {brief ? <LanguageSwitch lang={lang} languages={brief.languages} onChange={changeLang} label={t.language} /> : null}
          {phase === "chat" && brief ? (
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={t.menu}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#0e0e10] transition-colors [@media(hover:hover)]:hover:bg-[#f2f2f7] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#007aff]"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
                <circle cx="4" cy="10" r="1.6" />
                <circle cx="10" cy="10" r="1.6" />
                <circle cx="16" cy="10" r="1.6" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
      {phase === "chat" && progress.total ? (
        <div className="mx-auto flex max-w-[48rem] items-center gap-3 px-4 pb-2.5 md:px-6">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.done}
            aria-valuetext={t.topics(progress.done, progress.total)}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-black/[0.08]"
          >
            <motion.div
              className="h-full origin-left rounded-full bg-[#007aff]"
              initial={false}
              animate={{ scaleX: completed ? 1 : progress.done / progress.total }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          <span className="flex-none text-[0.78rem] font-medium tabular-nums text-[#6b7280]">
            {t.topics(completed ? progress.total : progress.done, progress.total)}
          </span>
        </div>
      ) : null}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden border-t border-black/[0.06]"
          >
            <div className="mx-auto max-w-[48rem] px-4 py-3 md:px-6">
              <p className="mb-2 text-[0.85rem] font-semibold text-[#0e0e10]">{t.alternativesTitle}</p>
              <Alternatives t={t} whatsappHref={whatsappHref} formHref={formHref} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );

  let body: ReactNode;
  if (phase === "loading") {
    body = (
      <div className="flex flex-1 items-center justify-center">
        <Dots />
      </div>
    );
  } else if (phase === "notFound" || phase === "loadFailed") {
    body = (
      <div className="mx-auto flex w-full max-w-[36rem] flex-1 flex-col justify-center px-6">
        <p className="text-[1.1rem] leading-relaxed text-[#424245]">{phase === "notFound" ? t.notFound : t.loadFailed}</p>
      </div>
    );
  } else if (phase === "intro" && brief) {
    body = (
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[40rem] px-5 pb-10 pt-8 md:pt-14">
          <ClientLogo name={brief.client} logo={brief.logo ?? undefined} className="mb-8 max-h-16 md:max-h-20" />
          <p className="text-[0.95rem] font-medium text-[#6b7280]">{t.eyebrow(brief.client)}</p>
          <h1 className="mt-4 text-[clamp(2.1rem,9vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[#0e0e10]">
            {t.title}
            <span className="text-[#007aff]">.</span>
          </h1>
          <p className="mt-6 text-[1.06rem] leading-[1.6] text-[#424245]">{t.body(brief.client)}</p>
          <ul className="mt-7 grid gap-3 border-y border-black/10 py-5">
            {[t.duration(brief.duration), t.pause, t.voice].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.98rem] font-medium leading-snug text-[#0e0e10]">
                <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 flex-none bg-[#007aff]" />
                {item}
              </li>
            ))}
          </ul>
          <PrimaryButton onClick={start} className="mt-8 w-full sm:w-auto" disabled={busy}>
            {t.start}
          </PrimaryButton>
          <p className="mt-4 text-[0.82rem] leading-relaxed text-[#6b7280]">
            {t.consent}{" "}
            <a href="/datenschutz" target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {t.privacy}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold">
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="border-b-2 border-transparent text-[#0e0e10] transition-colors hover:border-[#0e0e10]">
                {t.preferCall}
              </a>
            ) : null}
            {formHref ? (
              <a href={formHref} className="border-b-2 border-transparent text-[#0e0e10] transition-colors hover:border-[#0e0e10]">
                {t.preferForm}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
    body = (
      <>
        <div ref={scroller} onScroll={onScroll} className="flex-1 overflow-y-auto overscroll-contain" aria-live="polite" aria-busy={busy}>
          <div className="mx-auto grid w-full max-w-[48rem] gap-5 px-4 pb-6 pt-5 md:px-6 md:pt-8">
            {messages.map((m) => {
              const streaming = busy && m.id === lastAssistantId && m.role === "assistant";
              if (m.role === "client") {
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: EASE }} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[18px] rounded-br-[6px] bg-[#f2f2f7] px-4 py-2.5 text-[1rem] leading-[1.5] text-[#0e0e10]">
                      {m.text}
                    </div>
                  </motion.div>
                );
              }
              const showWidget = m.widget && (m.widget.type === "alternatives" || (pending && m.widget === pending && !completed));
              return (
                <div key={m.id} className="max-w-[92%]">
                  <p className="mb-1 text-[0.75rem] font-semibold tracking-[-0.01em] text-[#6b7280]">{t.assistant}</p>
                  <div className="break-words text-[1.02rem] leading-[1.6] text-[#1d1d1f]">
                    {m.text ? <RichText text={m.text} /> : streaming ? <Dots /> : null}
                  </div>
                  {showWidget ? (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }} className="mt-3">
                      <WidgetView
                        widget={m.widget!}
                        t={t}
                        lang={lang}
                        disabled={busy}
                        onSubmit={(text) => run({ text })}
                        whatsappHref={whatsappHref}
                        formHref={formHref}
                      />
                    </motion.div>
                  ) : null}
                </div>
              );
            })}
            {failed && !busy ? (
              <div role="alert" className="flex flex-wrap items-center gap-3 rounded-[8px] bg-[#fdf3f2] px-4 py-3 text-[0.95rem] text-[#8f1d15]">
                {t.failed}
                <button type="button" onClick={() => run({ retry: true })} className="font-bold underline underline-offset-2">
                  {t.retry}
                </button>
              </div>
            ) : null}
            {completed && !busy ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }} className="mt-4 rounded-[8px] border border-black/10 px-5 py-6">
                <p className="text-[1.6rem] font-bold tracking-[-0.05em] text-[#0e0e10]">
                  {t.completedTitle.replace(/!$/, "")}
                  <span className="text-[#007aff]">!</span>
                </p>
                <p className="mt-2 text-[1rem] leading-relaxed text-[#424245]">{t.completedBody}</p>
              </motion.div>
            ) : null}
          </div>
        </div>

        {!completed ? (
          <div className="flex-none border-t border-black/[0.06] bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
            <div className="mx-auto max-w-[48rem] px-3 md:px-6">
              {notice || transcribing ? (
                <p className="mb-2 px-1 text-[0.85rem] text-[#6b7280]" role="status">
                  {transcribing ? t.transcribing : notice}
                </p>
              ) : null}
              <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitDraft();
                }}
              >
                {recorder.state === "recording" ? (
                  <div className="flex min-h-12 flex-1 items-center gap-3 rounded-[24px] bg-[#fdf3f2] px-4">
                    <motion.span className="h-2.5 w-2.5 rounded-full bg-[#e5484d]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                    <span className="flex-1 text-[0.95rem] font-semibold tabular-nums text-[#8f1d15]">
                      {Math.floor(recorder.seconds / 60)}:{String(recorder.seconds % 60).padStart(2, "0")}
                    </span>
                    <button type="button" onClick={recorder.cancel} className="text-[0.85rem] font-semibold text-[#8f1d15] underline underline-offset-2">
                      {t.cancel}
                    </button>
                  </div>
                ) : (
                  <textarea
                    ref={composer}
                    value={draft}
                    rows={1}
                    maxLength={4000}
                    disabled={busy || transcribing}
                    placeholder={t.placeholder}
                    aria-label={t.placeholder}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(hover: hover)").matches) {
                        e.preventDefault();
                        submitDraft();
                      }
                    }}
                    className="min-h-12 flex-1 resize-none rounded-[24px] border border-black/[0.12] bg-white px-4 py-3 text-[1rem] leading-[1.4] text-[#0e0e10] placeholder:text-[#8a8f98] focus:border-[#007aff] focus:outline-none disabled:bg-[#f7f7f9]"
                  />
                )}
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={busy || transcribing}
                  aria-label={recorder.state === "recording" ? t.stop : t.record}
                  className={cn(
                    "flex h-12 w-12 flex-none items-center justify-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-95 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]",
                    recorder.state === "recording" ? "bg-[#e5484d] text-white" : "bg-[#f2f2f7] text-[#0e0e10]",
                  )}
                >
                  {recorder.state === "recording" ? (
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                      <rect x="5" y="5" width="10" height="10" rx="2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                      <rect x="7" y="2.5" width="6" height="10" rx="3" />
                      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
                {recorder.state !== "recording" ? (
                  <button
                    type="submit"
                    disabled={busy || transcribing || !draft.trim()}
                    aria-label={t.send}
                    className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#007aff] text-white transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.2]">
                      <path d="M10 16V4M5 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : null}
              </form>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        lang={lang}
        className="fixed inset-x-0 top-0 flex flex-col bg-white text-[#0e0e10] antialiased"
        style={{ height: height ? `${height}px` : "100dvh" }}
      >
        {header}
        {body}
      </div>
    </MotionConfig>
  );
}
