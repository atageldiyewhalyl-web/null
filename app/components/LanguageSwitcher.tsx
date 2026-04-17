import { useEffect, useState } from "react";
import type { Language } from "./LanguageContext";

function getStoredLang(): Language {
  if (typeof document === "undefined") return "de";
  try {
    const match = document.cookie.match(/nll_lang=([^;]+)/);
    if (match && ["en", "de", "tr"].includes(match[1])) return match[1] as Language;
    const ls = localStorage.getItem("nll_lang");
    if (ls && ["en", "de", "tr"].includes(ls)) return ls as Language;
  } catch (_) {}
  return "de";
}

function persistLang(lang: Language) {
  try {
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `nll_lang=${lang}; expires=${expires}; path=/; SameSite=Lax`;
    localStorage.setItem("nll_lang", lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("nll-lang-change", { detail: lang }));
  } catch (_) {}
}

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const [lang, setLang] = useState<Language>("de");

  useEffect(() => {
    // Hydrate from storage once on mount
    setLang(getStoredLang());

    // Keep in sync when context changes the language
    const onLangChange = (e: Event) => {
      const newLang = (e as CustomEvent<Language>).detail;
      if (["en", "de", "tr"].includes(newLang)) {
        setLang(newLang);
      }
    };
    window.addEventListener("nll-lang-change", onLangChange);
    return () => window.removeEventListener("nll-lang-change", onLangChange);
  }, []);

  const handleClick = (newLang: Language) => {
    setLang(newLang);
    persistLang(newLang);
  };

  return (
    <div
      className={`flex items-center bg-[#f2f2f7]/80 backdrop-blur-md rounded-full p-1 border border-[#d2d2d7]/30 shadow-sm ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      {(["en", "de", "tr"] as Language[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => handleClick(l)}
          suppressHydrationWarning
          className={`px-4 py-2.5 rounded-full text-[0.75rem] md:text-[0.8125rem] font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center justify-center min-w-[3.5rem] ${
            lang === l
              ? "bg-white text-[#0e0e10] shadow-[0_2px_8px_rgba(0,0,0,0.12)] scale-[1.05]"
              : "text-[#86868b] hover:text-[#0e0e10] hover:bg-black/5"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
            WebkitAppearance: "none",
          }}
          aria-label={`Switch to ${l.toUpperCase()}`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
