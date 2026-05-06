import { Link, useLocation } from "react-router";
import { useLanguage, t } from "./LanguageContext";
import { getLanguageForPath } from "../utils/i18nRouting";
import { openCookieSettings } from "../utils/cookieConsent";

export function Footer() {
  const { lang } = useLanguage();
  const location = useLocation();
  const displayLang = getLanguageForPath(location.pathname) ?? lang;

  return (
    <footer className="py-10 md:py-12 px-4 md:px-6 border-t border-black/5" role="contentinfo">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">
        <Link to="/" className="text-[1.125rem] tracking-[-0.03em] font-bold">
          nüll<span className="text-[#0071e3]">.</span>
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[0.8125rem] text-muted-foreground">
          <Link to="/#services" className="hover:text-foreground transition-colors">{t("nav.services", displayLang)}</Link>
          <Link to="/#work" className="hover:text-foreground transition-colors">{t("nav.work", displayLang)}</Link>
          <Link to="/blog" className="hover:text-foreground transition-colors">{t("nav.blog", displayLang)}</Link>
          <Link to="/#contact" className="hover:text-foreground transition-colors">{t("nav.contact", displayLang)}</Link>
          <Link to="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          <Link to="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
          <button type="button" className="hover:text-foreground transition-colors" onClick={openCookieSettings}>
            Cookie-Einstellungen
          </button>
        </nav>
        <p className="text-[0.75rem] md:text-[0.8125rem] text-muted-foreground text-center">
          &copy; 2026 nüll. {t("footer.rights", displayLang)} {t("contact.location", displayLang)}.
        </p>
      </div>
    </footer>
  );
}
