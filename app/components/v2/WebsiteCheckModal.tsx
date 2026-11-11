import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { trackGaEvent } from "../../utils/tracking";
import { QuickCheckForm } from "./WebsiteCheckForm";

/*
 * The website check as a pop-up, mounted once in app/root.tsx so every page can use it.
 * Ways to open it:
 *   - openWebsiteCheck({ url, source }) from any component (e.g. the homepage section)
 *   - any link to "#website-check" (works in blog text and old pages, no code needed)
 *   - a page URL ending in #website-check (e.g. shared links, ads)
 * The visitor stays on the page; after sending, the pop-up shows the live "verschickt" state and can be closed.
 * Desktop: centred panel. Phones: a sheet from the bottom.
 */

const EVENT = "nuell:website-check";
const HASH = "#website-check";
const EASE = [0.22, 1, 0.36, 1] as const;

export function openWebsiteCheck(detail: { url?: string; source?: string } = {}) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail }));
}

export default function WebsiteCheckModal() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ url: string; source: string; key: number } | null>(null);
  const [desktop, setDesktop] = useState(true);
  const [sent, setSent] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((url = "", source = "unknown") => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setSent(false);
    setState({ url, source, key: Date.now() });
    trackGaEvent("website_check_open", { source });
  }, []);

  const close = useCallback(() => {
    setState(null);
    if (window.location.hash === HASH) history.replaceState(null, "", window.location.pathname + window.location.search);
    lastFocus.current?.focus?.({ preventScroll: true });
  }, []);

  // open: custom event, #website-check links (also same-hash clicks), #website-check on load
  useEffect(() => {
    const onEvent = (e: Event) => {
      const d = (e as CustomEvent<{ url?: string; source?: string }>).detail ?? {};
      show(d.url ?? "", d.source ?? "button");
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      if (!href.endsWith(HASH)) return;
      const path = href.slice(0, -HASH.length);
      if (path && path !== window.location.pathname) return; // a link to another page: let it navigate, that page opens it
      e.preventDefault();
      show("", a?.dataset.source ?? `link:${window.location.pathname}`);
    };
    // the hash can also change without a click (typed into the address bar, history back/forward)
    const onHash = () => window.location.hash === HASH && show("", `url:${window.location.pathname}`);
    window.addEventListener(EVENT, onEvent);
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    if (window.location.hash === HASH) show("", `url:${window.location.pathname}`);
    return () => {
      window.removeEventListener(EVENT, onEvent);
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, [show]);

  // phone sheet vs desktop panel
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const set = () => setDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // while open: Escape closes, the page behind does not scroll, Tab stays inside
  useEffect(() => {
    if (!state) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([tabindex='-1']), select, textarea")].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [state, close]);

  const sheet = !desktop;

  return (
    <AnimatePresence>
      {state && (
        <motion.div key="wc-modal" className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}>
          <button type="button" aria-label="Schließen" onClick={close} className="absolute inset-0 cursor-default bg-[#0e0e10]/45 backdrop-blur-[3px]" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wc-modal-title"
            initial={reduce ? false : sheet ? { opacity: 1, y: "100%", scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%", scale: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
            className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 text-[#0e0e10] shadow-[0_40px_100px_-30px_rgba(15,23,42,0.5)] sm:max-w-[560px] sm:rounded-[28px] sm:px-9 sm:pb-9 sm:pt-9"
          >
            {sheet && <span aria-hidden className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-[#d8dde7]" />}
            <button type="button" onClick={close} aria-label="Website-Check schließen" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#f5f5f7] text-[#0e0e10] transition-colors hover:bg-[#e9edf3] sm:right-5 sm:top-5">
              <X size={19} strokeWidth={2.4} aria-hidden />
            </button>

            {sent ? (
              <h2 id="wc-modal-title" className="sr-only">Website-Check gestartet</h2>
            ) : (
              <>
                <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Kostenloser Website-Check</p>
                <h2 id="wc-modal-title" className="mt-3 pr-10 text-[clamp(1.9rem,7vw,2.6rem)] font-bold leading-[0.98] tracking-[-0.06em]">
                  <span className="text-[#0e0e10]/30">Wie gut ist</span> deine Website<span className="text-[#007aff]">?</span>
                </h2>
                <p className="mt-3 text-[1rem] font-medium leading-[1.45] tracking-[-0.015em] text-[#424245]">
                  Eine Note von 0 bis 100 und deine drei wichtigsten Baustellen. In etwa einer Minute per E-Mail, kostenlos.
                </p>
              </>
            )}

            <div className={sent ? "pt-6" : "mt-7"}>
              <QuickCheckForm key={state.key} initialUrl={state.url} source={state.source} onSent={() => setSent(true)} />
            </div>
            {sent && (
              <div className="mt-8 text-center">
                <button type="button" onClick={close} className="border-b-2 border-[#111111] pb-0.5 text-[1.02rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
                  Weiter lesen
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
