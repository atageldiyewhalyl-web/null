import { Search, Fingerprint, BarChart3, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface PricingProps {
  onOpenQuote: () => void;
}

export function Pricing({ onOpenQuote }: PricingProps) {
  const { lang } = useLanguage();

  const diagnosticItems = [
    { icon: Search, text: lang === 'tr' ? 'Piyasa ve rakip analizi' : (lang === 'de' ? 'Markt & Konkurrenzanalyse' : 'Market & competitor analysis') },
    { icon: Fingerprint, text: lang === 'tr' ? 'İşletme otorite skorlaması' : (lang === 'de' ? 'Business-Autoritäts-Scoring' : 'Business authority scoring') },
    { icon: BarChart3, text: lang === 'tr' ? 'Büyüme potansiyeli simülasyonu' : (lang === 'de' ? 'Wachstumspotenzial-Simulation' : 'Growth potential simulation') },
  ];

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
            {lang === 'tr' ? 'İşletmenizin ihtiyaçlarına göre şekillenen, şeffaf ve kesin bir fiyatlandırma deneyimi.' : (lang === 'de' ? 'Eine transparente und präzise Preisgestaltung, die sich an den Bedürfnissen Ihres Unternehmens orientiert.' : 'A transparent and precise pricing experience tailored exactly to your business needs.')}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Backdrop Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,122,255,0.06)_0%,transparent_60%)] blur-3xl -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left side: Sales Copy */}
            <div className="order-2 lg:order-1">
              <h3 className="text-[2rem] md:text-[2.75rem] font-bold text-[#0e0e10] leading-[1.1] mb-10 tracking-tight text-balance">
                 {lang === 'tr' ? 'Karmaşık paketler değil, ihtiyacınız olan çözüm.' : (lang === 'de' ? 'Keine Paket-Wüste, sondern Ihre Lösung.' : 'No guessing games. Just your precise solution.')}
              </h3>

              <div className="space-y-8 mb-14">
                {diagnosticItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#0e0e10] shadow-sm">
                      <item.icon size={22} />
                    </div>
                    <span className="text-[1.125rem] font-bold text-[#1d1d1f] tracking-tight">{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenQuote}
                 className="group/btn w-full md:w-auto inline-flex items-center justify-center gap-4 bg-[#0e0e10] text-white px-12 py-6 rounded-full text-[1.25rem] font-bold hover:bg-[#2c2c2e] transition-all hover:scale-[1.05] active:scale-95 shadow-2xl shadow-black/10"
              >
                {t("quote.teaser.cta", lang)}
                <ArrowRight size={24} className="transition-transform group-hover/btn:translate-x-1.5" />
              </button>
            </div>

            {/* Right side: Static Static Premium Card (Unboxed) */}
            <div className="order-1 lg:order-2">
              <div className="relative group/card">
                <div className="relative overflow-hidden aspect-square flex flex-col items-center justify-center text-center">
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-10">
                    <Zap className="text-[#007aff]/20" size={120} strokeWidth={1} />
                  </div>
                  <div className="absolute bottom-0 left-0 p-10">
                     <ShieldCheck className="text-[#34c759]/10" size={100} strokeWidth={1} />
                  </div>

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-black/[0.02] flex items-center justify-center mx-auto mb-10 border border-black/[0.02]">
                       <div className="text-[2.5rem] font-black tracking-tighter text-[#0e0e10]">
                         n<span className="text-[#007aff]">.</span>
                       </div>
                    </div>

                    <h4 className="text-[2.25rem] md:text-[2.75rem] font-bold text-[#0e0e10] leading-tight tracking-tight mb-8">
                      {lang === 'tr' ? 'Size Özel\nTeklif' : (lang === 'de' ? 'Ihr individueller\nPreis' : 'Your Individual\nPrice')}
                    </h4>
                  </div>

                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
