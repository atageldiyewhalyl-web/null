import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useLanguage, t, Language } from "./LanguageContext";

const langFlags: Record<Language, string> = { en: "EN", de: "DE", tr: "TR" };
const langOrder: Language[] = ["en", "de", "tr"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { lang, setLang } = useLanguage();

  const navLinks = [
    { label: t("nav.services", lang), href: "/#services" },
    { label: t("nav.work", lang), href: "/#work" },
    { label: t("nav.pricing", lang), href: "/#pricing" },
    { label: t("nav.blog", lang), href: "/blog" },
    { label: t("nav.contact", lang), href: "/#contact" },
  ];

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#") && isHome) {
      const el = document.querySelector(href.replace("/", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-[1.25rem] tracking-[-0.03em]" style={{ fontWeight: 600 }}>
          null<span className="text-[#0071e3]">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-[0.875rem] text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Language Toggle */}
          <div className="flex items-center bg-[#f5f5f7] rounded-full p-0.5 gap-0.5">
            {langOrder.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[0.75rem] px-2.5 py-1 rounded-full transition-all font-medium ${
                  lang === l
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {langFlags[l]}
              </button>
            ))}
          </div>

          <Link
            to="/#contact"
            onClick={() => handleNavClick("/#contact")}
            className="text-[0.875rem] bg-[#0071e3] text-white px-5 py-2 rounded-full hover:bg-[#0077ed] transition-colors"
          >
            {t("nav.getStarted", lang)}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile Language Toggle */}
          <div className="flex items-center bg-[#f5f5f7] rounded-full p-0.5 gap-0.5">
            {langOrder.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[0.6875rem] px-2 py-0.5 rounded-full transition-all font-medium ${
                  lang === l
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {langFlags[l]}
              </button>
            ))}
          </div>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-black/5 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block text-[0.9375rem] text-muted-foreground hover:text-foreground"
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#contact"
            className="block text-center text-[0.9375rem] bg-foreground text-background px-5 py-2.5 rounded-full"
            onClick={() => handleNavClick("/#contact")}
          >
            {t("nav.getStarted", lang)}
          </Link>
        </div>
      )}
    </nav>
  );
}
