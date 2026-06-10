import { Link, useLocation } from "react-router";
import { useLanguage, t } from "./LanguageContext";
import { getLanguageForPath } from "../utils/i18nRouting";
import { openCookieSettings } from "../utils/cookieConsent";

export function Footer() {
  const { lang } = useLanguage();
  const location = useLocation();
  const displayLang = getLanguageForPath(location.pathname) ?? lang;

  return (
    <footer className="border-t border-black/5 bg-white px-5 py-6 md:px-8" role="contentinfo">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <Link to="/" className="shrink-0 text-[1.25rem] font-bold tracking-[-0.04em] text-[#0e0e10]">
          nüll<span className="text-[#0071e3]">.</span>
        </Link>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] font-medium text-muted-foreground"
        >
          <Link to="/leistungen/webdesign" className="hover:text-foreground transition-colors">
            {t("nav.services", displayLang)}
          </Link>
          <Link to="/#work" className="hover:text-foreground transition-colors">
            {t("nav.work", displayLang)}
          </Link>
          <Link to="/blog" className="hover:text-foreground transition-colors">
            {t("nav.blog", displayLang)}
          </Link>
          <Link to="/#contact" className="hover:text-foreground transition-colors">
            {t("nav.contact", displayLang)}
          </Link>
          <Link to="/datenschutz" className="hover:text-foreground transition-colors">
            Datenschutz
          </Link>
          <Link to="/impressum" className="hover:text-foreground transition-colors">
            Impressum
          </Link>
          <button type="button" className="hover:text-foreground transition-colors" onClick={openCookieSettings}>
            Cookies
          </button>
        </nav>

        <p className="shrink-0 text-[0.78rem] font-medium text-muted-foreground">
          &copy; 2026 nüll.
        </p>
      </div>
    </footer>
  );
}
