import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage, t, type Language } from "./LanguageContext";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getLanguageForPath } from "../utils/i18nRouting";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const displayLang = getLanguageForPath(location.pathname) ?? lang;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("nav.services", displayLang), href: "#services" },
    { name: t("nav.work", displayLang), href: "#work" },
    { name: t("nav.pricing", displayLang), href: "#pricing" },
    { name: t("nav.blog", displayLang), href: "/blog" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999999] transition-all duration-300 px-4 md:px-10 py-5 ${
        scrolled ? "md:py-3" : "md:py-6"
      }`}
    >
      <div 
        className={`max-w-[1240px] mx-auto transition-all duration-500 rounded-[1.25rem] px-6 py-2.5 ${
          scrolled 
            ? "bg-white/70 backdrop-blur-xl border border-[#d2d2d7] shadow-[0_4px_20px_rgba(0,0,0,0.05)]" 
            : "bg-transparent px-2"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <a href="/" className="text-[1.5rem] font-bold tracking-[-0.03em] text-[#0e0e10] group">
              nüll<span className="text-[#007aff]">.</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.875rem] font-semibold text-[#86868b] hover:text-[#0e0e10] transition-colors flex items-center gap-1"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            
            <a
              href="/#pricing"
              className="bg-[#0e0e10] text-white px-6 py-2.5 rounded-full text-[0.875rem] font-bold hover:bg-[#1c1c1e] transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              {t("nav.getStarted", displayLang)}
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
               onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1.5 text-[#0e0e10] hover:bg-black/5 rounded-full transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 bg-white border border-[#d2d2d7] rounded-[2rem] p-8 flex flex-col gap-6 md:hidden shadow-2xl pointer-events-auto z-[100000]"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-[#0e0e10]"
              >
                {item.name}
              </a>
            ))}
            <hr className="border-[#f2f2f7]" />
            <div className="flex flex-col gap-4">
              <a
                href="/#pricing"
                onClick={() => setIsOpen(false)}
                className="bg-[#007aff] text-white text-center py-5 rounded-2xl font-bold"
              >
                {t("nav.getStarted", displayLang)}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
