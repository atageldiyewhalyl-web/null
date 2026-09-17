import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "motion/react";
import { cn } from "@/components/ui/utils";
import { defaultRanking, isChoice, isRanking } from "../logic";
import type {
  AnswerValue,
  ChoiceAnswer,
  MultiSelectField,
  OptionDef,
  RankingField as RankingFieldDef,
  ScaleField as ScaleFieldDef,
  SingleSelectField,
} from "../types";
import { useUiText } from "../i18n";
import { EASE, FieldError } from "./ui";

type FieldProps<F, V> = {
  id: string;
  field: F;
  value: V | undefined;
  onChange: (value: AnswerValue) => void;
  error?: string;
  labelledBy: string;
};

const errorId = (id: string) => `${id}-error`;
const domId = (id: string) => `field-${id.replace(/\./g, "-")}`;
export const fieldDomId = domId;

/** Scroll a focused control into view once the on-screen keyboard has opened. */
export function revealOnFocus(el: HTMLElement) {
  if (window.matchMedia("(max-width: 767px)").matches) {
    window.setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 280);
  }
}

/* ---------- Single & multi select ---------- */

export function ChoiceField({
  id,
  field,
  value,
  options,
  onChange,
  error,
  labelledBy,
}: FieldProps<SingleSelectField | MultiSelectField, AnswerValue> & { options: OptionDef[] }) {
  const t = useUiText();
  const answer: ChoiceAnswer = isChoice(value) ? value : { selected: [] };
  const multi = field.type === "multi";
  const max = multi ? field.max : undefined;
  const atMax = !!max && answer.selected.length >= max;
  const twoColumns = options.length > 5 && options.every((o) => o.label.length <= 30);
  const hintId = `${domId(id)}-hint`;

  const toggle = (option: OptionDef) => {
    let selected: string[];
    if (!multi) selected = [option.value];
    else if (answer.selected.includes(option.value)) selected = answer.selected.filter((v) => v !== option.value);
    else if (atMax) return;
    else selected = [...answer.selected, option.value];

    const next: ChoiceAnswer = { selected };
    const otherStillSelected = options.some((o) => o.other && selected.includes(o.value));
    if (answer.other && otherStillSelected) next.other = answer.other;
    onChange(next);

    if (option.other && selected.includes(option.value)) {
      window.setTimeout(() => document.getElementById(`${domId(id)}-other`)?.focus(), 240);
    }
  };

  return (
    <fieldset
      id={domId(id)}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      aria-describedby={[max ? hintId : "", error ? errorId(domId(id)) : ""].filter(Boolean).join(" ") || undefined}
      aria-invalid={!!error || undefined}
      className="min-w-0 outline-none"
      data-options={options.map((o) => o.value).join(",")}
    >
      {max ? (
        <p id={hintId} className="mb-4 flex items-baseline justify-between gap-4 text-[0.92rem] font-medium text-[#6b7280]">
          <span>{t.selectUpTo(max)}</span>
          <span aria-live="polite" className={cn("tabular-nums transition-colors", atMax && "text-[#0e0e10]")}>
            {t.selectedOf(answer.selected.length, max)}
          </span>
        </p>
      ) : null}

      <div className={cn("grid gap-2.5", twoColumns && "sm:grid-cols-2")}>
        {options.map((option, index) => {
          const checked = answer.selected.includes(option.value);
          const disabled = multi && atMax && !checked;
          const showOther = !!option.other && checked;
          return (
            <div key={option.value} className={cn(showOther && twoColumns && "sm:col-span-2")}>
              <label
                className={cn(
                  "group relative flex min-h-14 cursor-pointer select-none items-center gap-3.5 rounded-[8px] border border-black/[0.12] bg-white px-4 py-3 transition-[border-color,background-color,transform] duration-150 ease-out lg:min-h-[3.25rem] lg:py-2.5",
                  "active:scale-[0.99] [@media(hover:hover)]:hover:border-black/30",
                  "has-[input:checked]:border-[#007aff] has-[input:checked]:bg-[#f3f8ff] [@media(hover:hover)]:has-[input:checked]:hover:border-[#007aff]",
                  "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#007aff]",
                  "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-45",
                  showOther && "rounded-b-none border-b-transparent has-[input:checked]:border-b-transparent",
                )}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={domId(id)}
                  value={option.value}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(option)}
                  data-option-index={index}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-[1.375rem] w-[1.375rem] flex-none items-center justify-center border-2 border-black/25 bg-white transition-colors duration-150",
                    multi ? "rounded-[5px]" : "rounded-full",
                    "group-has-[input:checked]:border-[#007aff] group-has-[input:checked]:bg-[#007aff]",
                  )}
                >
                  {multi ? (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 scale-50 fill-none stroke-white stroke-[2.4] opacity-0 transition-[opacity,transform] duration-150 group-has-[input:checked]:scale-100 group-has-[input:checked]:opacity-100">
                      <path d="M3.5 8.4 6.6 11.4 12.6 4.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="h-2 w-2 scale-50 rounded-full bg-white opacity-0 transition-[opacity,transform] duration-150 group-has-[input:checked]:scale-100 group-has-[input:checked]:opacity-100" />
                  )}
                </span>
                <span className="flex-1 text-[1rem] font-medium leading-[1.35] tracking-[-0.015em] text-[#0e0e10]">
                  {option.label}
                </span>
                {index < 26 ? (
                  <kbd
                    aria-hidden="true"
                    className="hidden h-6 min-w-6 flex-none items-center justify-center rounded-[5px] border border-black/10 px-1 font-sans text-[0.72rem] font-bold text-[#6b7280] group-has-[input:checked]:border-[#007aff]/30 group-has-[input:checked]:text-[#007aff] [@media(hover:hover)_and_(min-width:768px)]:inline-flex"
                  >
                    {String.fromCharCode(65 + index)}
                  </kbd>
                ) : null}
              </label>

              <AnimatePresence initial={false}>
                {showOther ? (
                  <motion.div
                    key="other"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-[8px] border border-t-0 border-[#007aff] bg-[#f3f8ff] px-4 pb-4">
                      <label htmlFor={`${domId(id)}-other`} className="sr-only">
                        {t.otherSrLabel(option.label)}
                      </label>
                      <input
                        id={`${domId(id)}-other`}
                        type="text"
                        value={answer.other ?? ""}
                        placeholder={t.otherPlaceholder}
                        onChange={(e) => onChange({ ...answer, other: e.target.value })}
                        onFocus={(e) => revealOnFocus(e.currentTarget)}
                        className="h-12 w-full rounded-[6px] border border-black/[0.12] bg-white px-3.5 text-[1rem] text-[#0e0e10] placeholder:text-[#8a8f98] focus:border-[#007aff] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#007aff]"
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <FieldError id={errorId(domId(id))}>{error}</FieldError>
    </fieldset>
  );
}

/* ---------- Ranking ---------- */

function GripIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
      {[5, 10, 15].flatMap((y) => [7, 13].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />))}
    </svg>
  );
}

function RankingRow({
  value,
  label,
  index,
  total,
  move,
  onRemove,
}: {
  value: string;
  label: string;
  index: number;
  total: number;
  move: (from: number, to: number) => void;
  onRemove?: () => void;
}) {
  const t = useUiText();
  const controls = useDragControls();
  const arrowButton =
    "flex h-11 w-11 flex-none items-center justify-center rounded-full text-[#0e0e10] transition-[background-color,opacity] duration-150 [@media(hover:hover)]:hover:bg-[#f2f2f7] active:bg-[#e8e8ed] disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#007aff]";
  return (
    <Reorder.Item
      value={value}
      as="li"
      dragListener={false}
      dragControls={controls}
      transition={{ duration: 0.28, ease: EASE }}
      whileDrag={{ scale: 1.02, boxShadow: "0 18px 48px rgba(15,23,42,0.16)", zIndex: 10 }}
      className="relative flex min-h-[4.25rem] items-center gap-1 rounded-[8px] border border-black/[0.12] bg-white py-1.5 pl-1 pr-1.5"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onPointerDown={(e) => controls.start(e)}
        className="flex h-12 w-9 flex-none cursor-grab touch-none items-center justify-center text-black/30 active:cursor-grabbing"
      >
        <GripIcon />
      </button>
      <span
        aria-hidden="true"
        className={cn(
          "w-7 flex-none text-[1.55rem] font-bold tabular-nums leading-none tracking-[-0.06em]",
          index === 0 ? "text-[#007aff]" : "text-[#0e0e10]",
        )}
      >
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 px-1.5 text-[0.98rem] font-medium leading-[1.3] tracking-[-0.015em] text-[#0e0e10]">
        <span className="sr-only">{t.rankPlace(index + 1)}</span>
        {label}
      </span>
      <button type="button" className={arrowButton} disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={t.moveUp(label)}>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M5 12.5 10 7.5l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={arrowButton} disabled={index === total - 1} onClick={() => move(index, index + 1)} aria-label={t.moveDown(label)}>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M5 7.5 10 12.5l5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {onRemove ? (
        <button type="button" className={cn(arrowButton, "text-[#6b7280]")} onClick={onRemove} aria-label={t.removeEntry(label)}>
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="m5.5 5.5 9 9m0-9-9 9" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </Reorder.Item>
  );
}

export function RankingField({ id, field, value, onChange, labelledBy }: FieldProps<RankingFieldDef, AnswerValue>) {
  const t = useUiText();
  const answer = isRanking(value) ? value : defaultRanking(field);
  const custom = answer.custom ?? {};
  const [announcement, setAnnouncement] = useState("");
  const [draft, setDraft] = useState("");
  const inputId = `${domId(id)}-add`;
  const limit = field.customLimit ?? 5;
  const customCount = Object.keys(custom).length;
  const atLimit = customCount >= limit;
  const labelOf = (v: string) => custom[v] ?? field.options.find((o) => o.value === v)?.label ?? v;

  const commit = (order: string[], nextCustom = answer.custom) =>
    onChange({ order, touched: true, ...(nextCustom && Object.keys(nextCustom).length ? { custom: nextCustom } : {}) });

  const move = (from: number, to: number) => {
    if (to < 0 || to >= answer.order.length) return;
    const order = [...answer.order];
    const [item] = order.splice(from, 1);
    order.splice(to, 0, item);
    commit(order);
    setAnnouncement(t.rankAnnounce(labelOf(item), to + 1, order.length));
    // At the top/bottom the pressed arrow disables itself; keep keyboard focus on the item.
    if (to === 0 || to === order.length - 1) {
      const label = to === 0 ? t.moveDown(labelOf(item)) : t.moveUp(labelOf(item));
      window.requestAnimationFrame(() =>
        document.querySelector<HTMLButtonElement>(`[aria-label="${CSS.escape(label)}"]`)?.focus(),
      );
    }
  };

  const add = () => {
    const label = draft.trim().replace(/\s+/g, " ").slice(0, 80);
    if (!label || atLimit) return;
    const exists = answer.order.some((v) => labelOf(v).toLocaleLowerCase() === label.toLocaleLowerCase());
    if (exists) {
      setDraft("");
      return;
    }
    let n = 1;
    while (`custom-${n}` in custom) n += 1;
    const key = `custom-${n}`;
    commit([...answer.order, key], { ...custom, [key]: label });
    setDraft("");
    setAnnouncement(t.customAdded(label, answer.order.length + 1));
  };

  const remove = (key: string) => {
    const { [key]: removed, ...rest } = custom;
    commit(
      answer.order.filter((v) => v !== key),
      rest,
    );
    setAnnouncement(t.customRemoved(removed ?? ""));
    window.requestAnimationFrame(() => document.getElementById(inputId)?.focus({ preventScroll: true }));
  };

  return (
    <div id={domId(id)} tabIndex={-1} role="group" aria-labelledby={labelledBy} className="outline-none">
      {field.topLabel ? <p className="mb-3 text-[0.92rem] font-medium text-[#6b7280]">1 = {field.topLabel}</p> : null}
      <Reorder.Group as="ol" axis="y" values={answer.order} onReorder={(order) => commit(order)} className="grid gap-2.5">
        {answer.order.map((v, index) => (
          <RankingRow
            key={v}
            value={v}
            label={labelOf(v)}
            index={index}
            total={answer.order.length}
            move={move}
            onRemove={custom[v] ? () => remove(v) : undefined}
          />
        ))}
      </Reorder.Group>
      {field.bottomLabel ? (
        <p className="mt-3 text-[0.92rem] font-medium text-[#6b7280]">
          {answer.order.length} = {field.bottomLabel}
        </p>
      ) : null}
      <p className="mt-5 text-[0.88rem] leading-snug text-[#6b7280]">{t.rankingHint}</p>

      {field.allowCustom ? (
        <div className="mt-8 border-t border-black/10 pt-6">
          <label htmlFor={inputId} className="block text-[1rem] font-semibold tracking-[-0.02em] text-[#0e0e10]">
            {t.addCustomLabel}
          </label>
          <div className="mt-3 flex gap-2">
            <input
              id={inputId}
              type="text"
              value={draft}
              maxLength={80}
              disabled={atLimit}
              placeholder={t.addCustomPlaceholder}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={(e) => revealOnFocus(e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                  // Enter adds the entry here instead of moving to the next question.
                  e.preventDefault();
                  add();
                }
              }}
              className="h-12 min-w-0 flex-1 rounded-[8px] border border-black/[0.15] bg-white px-4 text-[1rem] text-[#0e0e10] placeholder:text-[#8a8f98] focus:border-[#007aff] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] disabled:bg-[#f5f5f7]"
            />
            <button
              type="button"
              onClick={add}
              disabled={atLimit || !draft.trim()}
              className="h-12 flex-none rounded-full border border-[#0e0e10] px-5 text-[0.8rem] font-black uppercase tracking-[0.1em] text-[#0e0e10] transition-[background-color,color,opacity] duration-150 [@media(hover:hover)]:hover:bg-[#0e0e10] [@media(hover:hover)]:hover:text-white disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
            >
              {t.addCustomButton}
            </button>
          </div>
          {atLimit ? <p className="mt-2 text-[0.88rem] text-[#6b7280]">{t.customLimit(limit)}</p> : null}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

/* ---------- Scale ---------- */

export function ScaleField({ id, field, value, onChange, error, labelledBy }: FieldProps<ScaleFieldDef, AnswerValue>) {
  const current = typeof value === "number" ? value : undefined;
  const steps = Array.from({ length: field.max - field.min + 1 }, (_, i) => field.min + i);
  const anchors = Object.entries(field.anchors).map(([k, text]) => ({ step: Number(k), text }));

  return (
    <div
      id={domId(id)}
      tabIndex={-1}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={error ? errorId(domId(id)) : undefined}
      aria-invalid={!!error || undefined}
      className="outline-none"
    >
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step) => {
          const anchor = field.anchors[step];
          return (
            <label
              key={step}
              className={cn(
                "group flex h-[4.5rem] cursor-pointer select-none items-center justify-center rounded-[8px] border border-black/[0.12] bg-white text-[1.6rem] font-bold tabular-nums tracking-[-0.05em] text-[#0e0e10] transition-[border-color,background-color,color,transform] duration-150 md:h-20",
                "active:scale-[0.97] [@media(hover:hover)]:hover:border-black/30",
                "has-[input:checked]:border-[#007aff] has-[input:checked]:bg-[#007aff] has-[input:checked]:text-white",
                "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#007aff]",
              )}
            >
              <input
                type="radio"
                name={domId(id)}
                value={step}
                checked={current === step}
                onChange={() => onChange(step)}
                aria-label={anchor ? `${step} – ${anchor}` : String(step)}
                className="sr-only"
              />
              {step}
            </label>
          );
        })}
      </div>

      <ul className="mt-5 grid gap-2">
        {anchors.map(({ step, text }) => (
          <li
            key={step}
            className={cn(
              "flex items-start gap-3 rounded-[8px] px-3 py-2.5 text-[0.95rem] leading-snug transition-colors duration-200",
              current === step ? "bg-[#f3f8ff] text-[#0e0e10]" : "text-[#4b5563]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-px flex h-6 w-6 flex-none items-center justify-center rounded-full text-[0.8rem] font-bold tabular-nums",
                current === step ? "bg-[#007aff] text-white" : "bg-[#f2f2f7] text-[#0e0e10]",
              )}
            >
              {step}
            </span>
            <span className={cn(current === step && "font-semibold")}>{text}</span>
          </li>
        ))}
      </ul>
      <FieldError id={errorId(domId(id))}>{error}</FieldError>
    </div>
  );
}

/* ---------- Text ---------- */

export function TextAreaField({
  id,
  value,
  onChange,
  error,
  labelledBy,
  placeholder,
  required,
}: FieldProps<unknown, AnswerValue> & { placeholder?: string; required?: boolean }) {
  const t = useUiText();
  const hint = placeholder ?? t.answerPlaceholder;
  const ref = useRef<HTMLTextAreaElement>(null);
  const text = typeof value === "string" ? value : "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 132)}px`;
  }, [text]);

  return (
    <div>
      <textarea
        ref={ref}
        id={domId(id)}
        value={text}
        rows={4}
        placeholder={required || placeholder ? hint : `${hint} ${t.optionalSuffix}`}
        aria-labelledby={labelledBy}
        aria-describedby={error ? errorId(domId(id)) : undefined}
        aria-invalid={!!error || undefined}
        aria-required={required || undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => revealOnFocus(e.currentTarget)}
        className={cn(
          "block min-h-[8.25rem] w-full resize-none rounded-[8px] border border-black/[0.15] bg-white px-4 py-3.5 text-[1.0625rem] leading-[1.55] text-[#0e0e10] transition-colors duration-150 placeholder:text-[#8a8f98]",
          "focus:border-[#007aff] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]",
          error && "border-[#c2261c]",
        )}
      />
      <p className="mt-2 hidden text-[0.8rem] text-[#6b7280] [@media(hover:hover)_and_(min-width:768px)]:block">
        {t.ctrlEnter}
      </p>
      <FieldError id={errorId(domId(id))}>{error}</FieldError>
    </div>
  );
}

/* ---------- Layout helpers ---------- */

export function FollowUpBlock({
  labelId,
  label,
  help,
  optional,
  children,
}: {
  labelId: string;
  label: string;
  help?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const t = useUiText();
  return (
    <div className="mt-10 border-t border-black/10 pt-8">
      <p id={labelId} className="max-w-[40rem] text-[1.08rem] font-semibold leading-[1.35] tracking-[-0.02em] text-[#0e0e10] md:text-[1.15rem]">
        {label}
        {optional ? <span className="font-medium text-[#6b7280]"> {t.optionalSuffix}</span> : null}
      </p>
      {help ? <p className="mt-2 text-[0.95rem] leading-snug text-[#6b7280]">{help}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}
