import { useLanguage, type Language } from "./LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { lang, setLang, isHydrated } = useLanguage();

  if (!isHydrated) return null;

  return (
    <div
      className={`flex items-center bg-[#f2f2f7]/80 backdrop-blur-md rounded-full p-1 border border-[#d2d2d7]/30 shadow-sm relative z-50 ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      {(["en", "de", "tr"] as Language[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-4 py-2.5 rounded-full text-[0.75rem] md:text-[0.8125rem] font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center justify-center min-w-[3.5rem] relative z-50 ${
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
