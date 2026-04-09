import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage, t, type Language } from "./LanguageContext";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("nav.services", lang), href: "#services" },
    { name: t("nav.work", lang), href: "#work" },
    { name: t("nav.pricing", lang), href: "#pricing" },
    { name: t("nav.blog", lang), href: "/blog" },
    { name: t("nav.contact", lang), href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-10 py-5 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="text-2xl font-bold tracking-tighter text-slate-900 group flex items-center gap-1">
            nüll<span className="text-[#0071e3] transition-transform group-hover:scale-125">.</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.9375rem] font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#0071e3] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
            {(["en", "de", "tr"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-[0.75rem] font-semibold transition-all ${
                  lang === l 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          
          <a
            href="#contact"
            className="bg-[#0071e3] text-white px-6 py-2.5 rounded-full text-[0.875rem] font-semibold hover:bg-[#0077ed] transition-all active:scale-95 shadow-md shadow-blue-200"
          >
            {t("nav.getStarted", lang)}
          </a>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-slate-900"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-4 right-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 md:hidden shadow-2xl"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-900"
              >
                {item.name}
              </a>
            ))}
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-4">
               <div className="flex justify-center gap-4 py-2">
                {(["en", "de", "tr"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setIsOpen(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      lang === l ? "bg-slate-100 text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="bg-[#0071e3] text-white text-center py-4 rounded-xl font-bold"
              >
                {t("nav.getStarted", lang)}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
