import { ReactNode } from "react";
import { Link } from "react-router";
import { useLanguage, t, type Language } from "./LanguageContext";
import { motion } from "motion/react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function OnboardingLayout({ 
  children, 
  isLong = false,
  isCentered = false,
  showSecureMessage = false,
  languages,
}: { 
  children: ReactNode;
  isLong?: boolean;
  isCentered?: boolean;
  showSecureMessage?: boolean;
  languages?: Language[];
}) {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#007aff]/10 selection:text-[#007aff]">
      {/* Fixed Header with Safe Area for iOS Notch/Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-[999999] px-6 md:px-12 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 md:py-8 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-[1.5rem] font-bold tracking-[-0.03em] text-[#0e0e10] hover:opacity-70 transition-opacity"
        >
          nüll<span className="text-[#007aff]">.</span>
        </Link>

        <LanguageSwitcher languages={languages} />
      </header>

      {/* Main Content Area */}
      <main className={`relative z-0 min-h-screen flex flex-col items-center px-6 transition-all duration-700 ${
        isCentered ? "justify-center py-20" : "justify-start pt-[18vh] pb-32"
      }`}>
        <motion.div
          key={isLong ? "long" : "short"}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-none px-6 md:px-12"
        >
          {children}
        </motion.div>
      </main>

      {/* Subtle Progress Area (Optional footer) */}
      {showSecureMessage && (
        <footer className="fixed bottom-0 left-0 right-0 py-8 px-6 text-center">
           <p className="text-[0.7rem] font-medium text-[#86868b] tracking-wide uppercase opacity-30">
             {t("onboarding.intro.secure", lang)}
           </p>
        </footer>
      )}
    </div>
  );
}
