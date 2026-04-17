import { Search, Fingerprint, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";

interface PricingProps {
  onOpenQuote: () => void;
}

export function Pricing({ onOpenQuote }: PricingProps) {
  const { lang } = useLanguage();

  const receiptItems = [
    { label: lang === 'tr' ? 'Özel Business Web Sitesi' : (lang === 'de' ? 'Individuelle Experten-Website' : 'Custom Business Website'), price: 'Included' },
    { label: lang === 'tr' ? 'Mobil Optimizasyon' : (lang === 'de' ? 'Mobil-Optimierung' : 'Mobile Optimized'), price: 'Included' },
    { label: lang === 'tr' ? 'Yerel SEO Kurulumu' : (lang === 'de' ? 'Lokales SEO-Setup' : 'Local SEO Setup'), price: 'Included' },
    { label: lang === 'tr' ? 'İletişim Odaklı Tasarım' : (lang === 'de' ? 'Conversion-Design' : 'Conversion Design'), price: 'Included' },
    { label: lang === 'tr' ? 'Özel Marka Kimliği' : (lang === 'de' ? 'Markenidentität' : 'Brand Identity'), price: 'Premium' },
  ];

  const diagnosticItems = [
    { icon: Search, text: lang === 'tr' ? 'Piyasa ve rakip analizi' : (lang === 'de' ? 'Markt & Konkurrenzanalyse' : 'Market & competitor analysis'), color: 'text-[#007aff]' },
    { icon: Fingerprint, text: lang === 'tr' ? 'İşletme otorite skorlaması' : (lang === 'de' ? 'Business-Autoritäts-Scoring' : 'Business authority scoring'), color: 'text-[#34c759]' },
    { icon: BarChart3, text: lang === 'tr' ? 'Büyüme potansiyeli simülasyonu' : (lang === 'de' ? 'Wachstumspotenzial-Simulation' : 'Growth potential simulation'), color: 'text-[#ff9500]' },
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,122,255,0.08)_0%,transparent_50%)] blur-3xl -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left side: Sales Copy */}
            <div className="order-2 lg:order-1">
              <h3 className="text-[2.25rem] md:text-[3rem] font-bold text-[#0e0e10] leading-[1.1] mb-10 tracking-tight text-balance">
                 {lang === 'tr' ? 'Karmaşık paketler değil, ihtiyacınız olan çözüm.' : (lang === 'de' ? 'Keine Paket-Wüste, sondern Ihre Lösung.' : 'No guessing games. Just your precise solution.')}
              </h3>

              <div className="space-y-8 mb-14">
                {diagnosticItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0e0e10]/[0.02] border border-black/[0.03] flex items-center justify-center text-[#0e0e10] shadow-sm">
                      <item.icon size={24} />
                    </div>
                    <span className="text-[1.125rem] md:text-[1.25rem] font-bold text-[#1d1d1f] tracking-tight">{item.text}</span>
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

            {/* Right side: Visualization Card */}
            <div className="order-1 lg:order-2">
              <div className="relative group/viz">
                <div className="absolute inset-0 bg-[#007aff]/10 blur-[100px] opacity-20 -z-10" />
                
                <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-black/[0.04] p-8 md:p-12 relative overflow-hidden">
                  {/* Perforation Effect */}
                  <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-6">
                     {[...Array(12)].map((_, i) => (
                       <div key={i} className="w-3 h-3 rounded-full bg-[#fbfbfd] -translate-y-1/2 border border-black/[0.03]" />
                     ))}
                  </div>

                  <div className="flex justify-between items-start mb-12 mt-4">
                    <div>
                      <p className="text-[0.6875rem] font-extrabold text-[#86868b] uppercase tracking-[0.2em] mb-1.5">Quote Reference</p>
                      <p className="text-[1.25rem] font-bold text-[#0e0e10]"># NLL-2026-XQ</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[0.6875rem] font-extrabold text-[#86868b] uppercase tracking-[0.2em] mb-1.5">Date</p>
                       <p className="text-[1.125rem] font-bold text-[#0e0e10]">April 2026</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    {receiptItems.map((item, i) => (
                      <div key={i} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-[#007aff]" />
                           <span className="text-[1.0625rem] font-bold text-[#1d1d1f] tracking-tight">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[0.8125rem] font-extrabold text-[#34c759] uppercase tracking-wider">{item.price}</span>
                           <CheckCircle2 size={20} className="text-[#34c759]" strokeWidth={2.5} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10 border-t-2 border-dashed border-black/[0.08] relative">
                    {/* Visual Cut Line Indication */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-6 text-[0.75rem] font-extrabold text-[#86868b] uppercase tracking-widest whitespace-nowrap">
                       Total Investment
                    </div>

                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[0.6875rem] font-extrabold text-[#86868b] uppercase tracking-widest mb-1.5">Current Status</p>
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
                            <p className="text-[1rem] font-bold text-[#34c759]">Awaiting Input</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[0.6875rem] font-extrabold text-[#86868b] uppercase tracking-widest mb-1.5">Estimated Price</p>
                          <div className="text-[2.75rem] font-bold text-[#0e0e10] leading-none tracking-tighter tabular-nums flex items-baseline">
                             <span className="text-[1.5rem] mr-0.5 font-medium opacity-40">€</span>
                             <span>---</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Perforation Effect Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-between px-6">
                     {[...Array(12)].map((_, i) => (
                       <div key={i} className="w-3 h-3 rounded-full bg-[#fbfbfd] translate-y-1/2 border border-black/[0.03]" />
                     ))}
                  </div>
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
