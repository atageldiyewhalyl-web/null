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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-10 py-4 ${
        scrolled ? "md:py-4" : "md:py-8"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-500 ${
          scrolled 
            ? "bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
            : "bg-transparent px-2 py-2"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="text-2xl font-bold tracking-tighter text-white group flex items-center gap-1">
              nüll<span className="text-primary group-hover:animate-pulse">.</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.875rem] font-medium text-white/60 hover:text-white transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              {(["en", "de", "tr"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[0.75rem] font-semibold transition-all ${
                    lang === l 
                      ? "bg-white text-black shadow-lg" 
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            
            <a
              href="#contact"
              className="bg-white text-black px-6 py-2.5 rounded-full text-[0.875rem] font-semibold hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-white/10"
            >
              {t("nav.getStarted", lang)}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-medium text-white/80 hover:text-white"
              >
                {item.name}
              </a>
            ))}
            <hr className="border-white/10" />
            <div className="flex flex-col gap-4">
               <div className="flex justify-center gap-4 py-2">
                {(["en", "de", "tr"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setIsOpen(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      lang === l ? "bg-white text-black" : "bg-white/5 text-white/60"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white text-center py-4 rounded-2xl font-bold"
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
