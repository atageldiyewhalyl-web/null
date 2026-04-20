import { ArrowRight, ShieldCheck, Zap, Rocket, Search, Building2, Sparkles, Monitor } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface PricingProps {
  onOpenQuote: () => void;
}

export function Pricing({ onOpenQuote }: PricingProps) {
  const { lang } = useLanguage();



  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <p className="text-[0.8125rem] tracking-[0.2em] uppercase text-[#007aff] font-bold mb-6">
            {lang === 'tr' ? 'DİNAMİK TEKLİF' : (lang === 'de' ? 'DYNAMISCHES ANGEBOT' : 'DYNAMIC QUOTE')}
          </p>
          <h2 className="text-[clamp(2.25rem,6.5vw,4rem)] tracking-tight leading-[1.1] mb-8 font-bold text-[#0e0e10] whitespace-pre-line">
            {lang === 'tr' ? 'Size özel teklifiniz\n60 saniyede hazır.' : (lang === 'de' ? 'Ihr individuelles Angebot\nin nur 60 Sekunden.' : 'Your individual offer\nin 60 seconds.')}
          </h2>
          <p className="text-[1.25rem] md:text-[1.5rem] text-[#86868b] leading-relaxed font-medium text-balance">
            {lang === 'tr' ? 'İşletmenizin ihtiyaçlarına göre şekillenen, şeffaf aylık abonelik modeli.' : (lang === 'de' ? 'Ein transparentes monatliches Abonnement-Modell, das sich an den Bedürfnissen Ihres Unternehmens orientiert.' : 'A transparent monthly subscription model tailored exactly to your business needs.')}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Backdrop Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,122,255,0.06)_0%,transparent_60%)] blur-3xl -z-10" />
          
          <div className="flex flex-col items-center justify-center">
            {/* Branding & Title */}
            <div className="relative group/card mb-12 w-full max-w-lg">
              <div className="relative overflow-hidden flex flex-col items-center justify-center text-center py-16 px-4">
                
                {/* Colorful Decorative Icons */}
                <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                  <Zap className="text-[#007aff]" size={100} strokeWidth={1} />
                </div>
                <div className="absolute top-4 left-4 p-4 opacity-15 -rotate-12">
                  <Rocket className="text-[#af52de]" size={80} strokeWidth={1} />
                </div>
                <div className="absolute bottom-4 right-10 p-4 opacity-15 rotate-45">
                   <Sparkles className="text-[#ff2d55]" size={90} strokeWidth={1} />
                </div>
                <div className="absolute bottom-0 left-0 p-8 opacity-10 -rotate-12">
                   <ShieldCheck className="text-[#34c759]" size={100} strokeWidth={1} />
                </div>
                <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 opacity-10">
                   <Search className="text-[#34c759]" size={70} strokeWidth={1} />
                </div>
                <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 opacity-10">
                   <Building2 className="text-[#ff9500]" size={70} strokeWidth={1} />
                </div>

                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-[2.25rem] bg-white shadow-2xl shadow-black/[0.05] flex items-center justify-center mx-auto mb-10 border border-black/[0.03]">
                     <div className="text-[3rem] font-black tracking-tighter text-[#0e0e10] leading-none">
                       n<span className="text-[#007aff]">.</span>
                     </div>
                  </div>

                  <h4 className="text-[2.25rem] md:text-[3.25rem] font-extrabold text-[#0e0e10] leading-tight tracking-tight">
                    {lang === 'tr' ? 'Size Özel Teklif' : (lang === 'de' ? 'Ihr individueller Preis' : 'Your Individual Price')}
                  </h4>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenQuote}
              className="group/btn inline-flex items-center justify-center gap-4 bg-[#0e0e10] text-white px-14 py-7 rounded-full text-[1.25rem] md:text-[1.375rem] font-bold hover:bg-[#2c2c2e] transition-all hover:scale-[1.05] active:scale-95 shadow-2xl shadow-black/20"
            >
              {t("quote.teaser.cta", lang)}
              <ArrowRight size={24} className="transition-transform group-hover/btn:translate-x-1.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
