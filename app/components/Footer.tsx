import { Link } from "react-router";
import { useLanguage, t } from "./LanguageContext";

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="py-10 md:py-12 px-4 md:px-6 border-t border-black/5" role="contentinfo">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">
        <Link to="/" className="text-[1.125rem] tracking-[-0.03em]" style={{ fontWeight: 600 }}>
          nüll<span className="text-[#0071e3]">.</span>
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[0.8125rem] text-muted-foreground">
          <Link to="/#services" className="hover:text-foreground transition-colors">{t("nav.services", lang)}</Link>
          <Link to="/#work" className="hover:text-foreground transition-colors">{t("nav.work", lang)}</Link>
          <Link to="/blog" className="hover:text-foreground transition-colors">{t("nav.blog", lang)}</Link>
          <Link to="/#contact" className="hover:text-foreground transition-colors">{t("nav.contact", lang)}</Link>
        </nav>
        <p className="text-[0.75rem] md:text-[0.8125rem] text-muted-foreground text-center">
          &copy; 2026 nüll. {t("footer.rights", lang)} {t("contact.location", lang)}.
        </p>
      </div>
    </footer>
  );
}
