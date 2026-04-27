import { useEffect } from "react";
import { useLanguage, type Language } from "./LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  languages?: Language[];
}

const defaultLanguages: Language[] = ["en", "de", "tr"];

export function LanguageSwitcher({ className = "", languages = defaultLanguages }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    if (!languages.includes(lang)) {
      setLang(languages[0]);
    }
  }, [lang, languages, setLang]);

  return (
    <div
      className={`flex items-center bg-[#f2f2f7] rounded-full p-1 border border-[#d2d2d7] relative z-[9999999] ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      {languages.map((l) => (
        <button
          key={l}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLang(l);
          }}
          className={`px-3 md:px-4 py-2 rounded-full text-[0.7rem] md:text-[0.8rem] font-black transition-all duration-200 cursor-pointer select-none active:scale-90 flex items-center justify-center min-w-[3rem] ${
            lang === l
              ? "bg-white text-[#007aff] shadow-sm scale-[1.02]"
              : "text-[#86868b] hover:text-[#0e0e10] hover:bg-black/5"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
            cursor: "pointer"
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
