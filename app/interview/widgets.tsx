import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import { RankingField } from "../onboarding/components/fields";
import { EASE } from "../onboarding/components/ui";
import { UI, UiTextContext } from "../onboarding/i18n";
import type { RankingAnswer } from "../onboarding/types";
import type { Lang, Widget } from "./api";
import type { ChatText } from "./i18n";

const slug = (s: string, i: number) => `item-${i}-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`;

function SubmitButton({ children, disabled, onClick }: { children: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#007aff] px-5 text-[0.78rem] font-black uppercase tracking-[0.12em] text-white transition-[opacity,transform] duration-150 active:scale-[0.98] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
    >
      {children}
    </button>
  );
}

function Choices({ widget, t, onSubmit, disabled }: { widget: Extract<Widget, { type: "choices" }>; t: ChatText; onSubmit: (text: string) => void; disabled: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherOn, setOtherOn] = useState(false);
  const [other, setOther] = useState("");
  const atMax = widget.multi && widget.max ? selected.length + (otherOn ? 1 : 0) >= widget.max : false;

  const toggle = (option: string) => {
    if (!widget.multi) {
      onSubmit(option);
      return;
    }
    setSelected((s) => (s.includes(option) ? s.filter((o) => o !== option) : atMax ? s : [...s, option]));
  };
  const submit = () => {
    const parts = [...selected, ...(otherOn && other.trim() ? [`${t.other}: ${other.trim()}`] : [])];
    if (parts.length) onSubmit(widget.multi ? `${t.selected}: ${parts.join(", ")}` : parts[0]);
  };

  const chip =
    "min-h-11 rounded-full border px-4 py-2 text-left text-[0.95rem] font-medium leading-snug tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]";
  return (
    <div role="group" aria-disabled={disabled || undefined}>
      {widget.multi && widget.max ? <p className="mb-2 text-[0.85rem] text-[#6b7280]">{t.upTo(widget.max)}</p> : null}
      <div className="flex flex-wrap gap-2">
        {widget.options.map((option) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={widget.multi ? on : undefined}
              disabled={disabled || (!on && atMax)}
              onClick={() => toggle(option)}
              className={cn(chip, on ? "border-[#007aff] bg-[#007aff] text-white" : "border-black/[0.14] bg-white text-[#0e0e10] [@media(hover:hover)]:hover:border-black/35")}
            >
              {option}
            </button>
          );
        })}
        {widget.allowOther ? (
          <button
            type="button"
            aria-pressed={otherOn}
            disabled={disabled || (!otherOn && atMax)}
            onClick={() => setOtherOn((v) => !v)}
            className={cn(chip, otherOn ? "border-[#007aff] bg-[#f3f8ff] text-[#0e0e10]" : "border-dashed border-black/25 bg-white text-[#4b5563]")}
          >
            {t.other} …
          </button>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {otherOn ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: EASE }} className="overflow-hidden">
            <input
              autoFocus
              value={other}
              onChange={(e) => setOther(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (widget.multi) submit();
                  else if (other.trim()) onSubmit(other.trim());
                }
              }}
              placeholder={t.otherPlaceholder}
              maxLength={200}
              className="mt-3 h-11 w-full rounded-[8px] border border-black/[0.15] bg-white px-3.5 text-[1rem] focus:border-[#007aff] focus:outline-none"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {widget.multi || otherOn ? (
        <SubmitButton disabled={disabled || (!selected.length && !(otherOn && other.trim()))} onClick={widget.multi ? submit : () => onSubmit(other.trim())}>
          {t.sendSelection}
        </SubmitButton>
      ) : null}
    </div>
  );
}

function Ranking({ widget, t, lang, onSubmit, disabled }: { widget: Extract<Widget, { type: "ranking" }>; t: ChatText; lang: Lang; onSubmit: (text: string) => void; disabled: boolean }) {
  const options = widget.items.map((label, i) => ({ value: slug(label, i), label }));
  const [value, setValue] = useState<RankingAnswer>({ order: options.map((o) => o.value), touched: false });
  const labelOf = (v: string) => value.custom?.[v] ?? options.find((o) => o.value === v)?.label ?? v;
  return (
    <UiTextContext.Provider
      value={{
        ...UI[lang],
        addCustomLabel: lang === "tr" ? "Listede olmayan bir şey mi var? Ekleyin." : "Fehlt etwas? Fügen Sie es hinzu.",
        addCustomPlaceholder: lang === "tr" ? "Kendi girişiniz" : "Eigener Eintrag",
      }}
    >
      <div aria-disabled={disabled || undefined} className={cn(disabled && "pointer-events-none opacity-50")}>
        <RankingField
          id={`chat-${widget.fieldId}`}
          field={{ type: "ranking", key: widget.fieldId, label: "", options, allowCustom: widget.allowAdd }}
          value={value}
          onChange={(v) => setValue(v as RankingAnswer)}
          labelledBy=""
        />
        <SubmitButton disabled={disabled} onClick={() => onSubmit(`${t.order}: ${value.order.map((v, i) => `${i + 1}. ${labelOf(v)}`).join(", ")}`)}>
          {t.sendOrder}
        </SubmitButton>
      </div>
    </UiTextContext.Provider>
  );
}

export function Alternatives({ t, whatsappHref, formHref }: { t: ChatText; whatsappHref: string | null; formHref: string | null }) {
  const link =
    "flex min-h-12 items-center justify-between gap-3 rounded-[8px] border border-black/[0.12] bg-white px-4 text-[0.98rem] font-semibold tracking-[-0.015em] text-[#0e0e10] transition-colors [@media(hover:hover)]:hover:border-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]";
  return (
    <div className="grid gap-2">
      {whatsappHref ? (
        <a href={whatsappHref} target="_blank" rel="noreferrer" className={link}>
          {t.callHalyl}
          <span aria-hidden="true" className="text-[#007aff]">↗</span>
        </a>
      ) : null}
      {formHref ? (
        <a href={formHref} className={link}>
          {t.useForm}
          <span aria-hidden="true" className="text-[#007aff]">↗</span>
        </a>
      ) : null}
    </div>
  );
}

export function WidgetView(props: {
  widget: Widget;
  t: ChatText;
  lang: Lang;
  disabled: boolean;
  onSubmit: (text: string) => void;
  whatsappHref: string | null;
  formHref: string | null;
}) {
  const { widget } = props;
  if (widget.type === "choices") return <Choices widget={widget} t={props.t} onSubmit={props.onSubmit} disabled={props.disabled} />;
  if (widget.type === "ranking") return <Ranking widget={widget} t={props.t} lang={props.lang} onSubmit={props.onSubmit} disabled={props.disabled} />;
  return <Alternatives t={props.t} whatsappHref={props.whatsappHref} formHref={props.formHref} />;
}
