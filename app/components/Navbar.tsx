import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 px-4 md:px-10 py-5 ${
        scrolled ? "md:py-3" : "md:py-6"
      }`}
    >
      <div 
        className={`max-w-[1240px] mx-auto transition-all duration-500 rounded-[1.25rem] px-6 py-2.5 pointer-events-auto ${
          scrolled 
            ? "bg-white/70 backdrop-blur-xl border border-[#d2d2d7] shadow-[0_4px_20px_rgba(0,0,0,0.05)]" 
            : "bg-transparent px-2"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="text-[1.5rem] font-bold tracking-[-0.03em] text-[#0e0e10] group flex items-center gap-1">
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

          <div className="hidden md:flex items-center gap-6">
            <div className="relative z-[10000] flex items-center bg-[#f2f2f7] rounded-full p-1 border border-[#d2d2d7]/30 shadow-inner">
              {(["en", "de", "tr"] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Language click:", l);
                    setLang(l);
                  }}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[0.75rem] font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    lang === l 
                      ? "bg-white text-[#0e0e10] shadow-md" 
                      : "text-[#86868b] hover:text-[#0e0e10]"
                  }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            
            <a
              href="#contact"
              className="bg-[#0e0e10] text-white px-6 py-2.5 rounded-full text-[0.875rem] font-bold hover:bg-[#1c1c1e] transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              {t("nav.getStarted", lang)}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#0e0e10]"
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
            className="absolute top-20 left-4 right-4 bg-white border border-[#d2d2d7] rounded-[2rem] p-8 flex flex-col gap-6 md:hidden shadow-2xl"
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
               <div className="flex justify-center gap-4 py-2 bg-[#f2f2f7] rounded-2xl p-2">
                {(["en", "de", "tr"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setIsOpen(false); }}
                    className={`px-6 py-2 rounded-xl text-sm font-bold ${
                      lang === l ? "bg-white text-black shadow-sm" : "text-[#86868b]"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="bg-[#007aff] text-white text-center py-5 rounded-2xl font-bold"
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
