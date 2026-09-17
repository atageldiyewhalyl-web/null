import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/components/ui/utils";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1.45rem] font-bold leading-none tracking-[-0.03em] text-[#0e0e10]", className)} aria-label="nüll.">
      nüll<span className="text-[#007aff]">.</span>
    </span>
  );
}

/** Loads an image and reports whether it decoded (the file may not exist yet, and SSR can't know). */
function useImageReady(src?: string) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!src) return;
    const probe = new Image();
    probe.onload = () => setReady(probe.naturalWidth > 0);
    probe.src = src;
    return () => {
      probe.onload = null;
    };
  }, [src]);
  return ready;
}

/** Header client mark: compact icon plus the client name. */
export function ClientMark({ name, mark }: { name: string; mark?: string }) {
  const ready = useImageReady(mark);
  return (
    <span className="flex min-w-0 items-center gap-2">
      {mark && ready ? <img src={mark} alt={name} className="h-6 w-auto flex-none" /> : null}
      <span
        className={cn(
          "truncate text-[0.9rem] font-semibold tracking-[-0.02em] text-[#4b5563]",
          mark && ready && "hidden sm:inline",
        )}
      >
        {name}
      </span>
    </span>
  );
}

/** Full client logo for the intro; renders nothing until it has loaded. */
export function ClientLogo({ name, logo, className }: { name: string; logo?: string; className?: string }) {
  const ready = useImageReady(logo);
  if (!logo || !ready) return null;
  return <img src={logo} alt={name} className={cn("h-auto w-auto object-contain", className)} />;
}

/** A statement heading ending in the nüll blue full stop. */
export function Statement({ children }: { children: string }) {
  const text = children.replace(/[.!]$/, "");
  const ending = children.endsWith("!") ? "!" : ".";
  return (
    <>
      {text}
      <span className="text-[#007aff]">{ending}</span>
    </>
  );
}

export function PrimaryButton({
  children,
  className,
  loading,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#007aff] px-6 text-[0.8rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-[transform,background-color,opacity] duration-200 ease-out",
        "hover:bg-[#006dff] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#007aff]",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-3 flex items-start gap-2 text-[0.92rem] font-semibold leading-snug text-[#c2261c]">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-[0.15rem] h-4 w-4 flex-none fill-current">
        <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 4a.9.9 0 0 1 .9.9v4.2a.9.9 0 1 1-1.8 0V6.4a.9.9 0 0 1 .9-.9Zm0 9.2a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1Z" />
      </svg>
      {children}
    </p>
  );
}
