import { useLanguage, type Language } from "./LanguageContext";
import { useLocation, useNavigate } from "react-router";
import { getLanguageForPath, getLocalizedPath, isLanguage } from "../utils/i18nRouting";

interface LanguageSwitcherProps {
  className?: string;
  languages?: Language[];
}

const defaultLanguages: Language[] = ["en", "de", "tr"];

export function LanguageSwitcher({ className = "", languages = defaultLanguages }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const routeLang = getLanguageForPath(location.pathname);
  const queryLang = new URLSearchParams(location.search).get("lang");
  const urlLang = isLanguage(queryLang) ? queryLang : null;
  const resolvedLang = routeLang ?? urlLang ?? lang;
  const activeLang = languages.includes(resolvedLang) ? resolvedLang : languages[0];

  const getLanguageTarget = (nextLang: Language) => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : location.pathname;
    const currentSearch = typeof window !== "undefined" ? window.location.search : location.search;
    const currentHash = typeof window !== "undefined" ? window.location.hash : location.hash;
    const targetPath = getLocalizedPath(currentPath, nextLang);
    const targetRouteLang = getLanguageForPath(targetPath);

    if (targetPath !== currentPath) {
      return `${targetPath}${currentHash}`;
    }

    if (!targetRouteLang) {
      const searchParams = new URLSearchParams(currentSearch);
      searchParams.set("lang", nextLang);
      const nextSearch = searchParams.toString();
      return `${currentPath}${nextSearch ? `?${nextSearch}` : ""}${currentHash}`;
    }

    return `${currentPath}${currentSearch}${currentHash}`;
  };

  return (
    <div
      className={`flex items-center bg-[#f2f2f7] rounded-full p-1 border border-[#d2d2d7] relative z-[9999999] ${className}`}
      style={{ touchAction: "manipulation" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {languages.map((l) => (
        <a
          key={l}
          href={getLanguageTarget(l)}
          onClick={(e) => {
            e.stopPropagation();
            if (l === activeLang) {
              e.preventDefault();
              return;
            }

            const target = getLanguageTarget(l);
            setLang(l);
            e.preventDefault();
            navigate(target);
          }}
          className={`appearance-none border-0 px-3 md:px-4 py-2 rounded-full text-[0.7rem] md:text-[0.8rem] font-black transition-all duration-200 cursor-pointer select-none active:scale-90 flex items-center justify-center min-w-[3rem] ${
            activeLang === l
              ? "bg-white text-[#007aff] shadow-sm scale-[1.02]"
              : "bg-transparent text-[#86868b] hover:text-[#0e0e10] hover:bg-black/5"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
            cursor: "pointer"
          }}
          aria-label={`Switch to ${l.toUpperCase()}`}
          aria-current={activeLang === l ? "true" : undefined}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
