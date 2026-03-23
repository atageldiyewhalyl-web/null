import { ArrowRight } from "lucide-react";
import { ContainerScroll } from "./ContainerScroll";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Compare } from "./ui/compare";
import { useLanguage, t } from "./LanguageContext";
import oldAzazi from "../../assets/old_azazi.png";
import newAzazi from "../../assets/new_azazi.png";
import mobileOldAzazi from "../../assets/dolmetscher_azazi_old.png";
import mobileNewAzazi from "../../assets/dolmetscher_azazi_new.png";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section aria-label="Hero" className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground bg-[#f5f5f7] px-3.5 py-1.5 rounded-full mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
              {t("hero.badge", lang)}
            </span>

            <h1
              className="text-[clamp(2.125rem,10vw,3.5rem)] md:text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.2] md:leading-[1.18] tracking-[-0.02em] md:tracking-[-0.03em] mb-4 md:mb-8"
              style={{ fontWeight: 600 }}
            >
              <span className="block md:inline">{t("hero.line1", lang)}</span>
              {" "}
              <span className="block md:inline">{t("hero.line2", lang)}</span>
              <br className="hidden md:block" />
              <span className="text-[#0071e3] block md:inline mt-1 md:mt-0">{t("hero.line3", lang)}</span>
            </h1>

            <p
              className="text-[0.9375rem] md:text-[1.125rem] text-muted-foreground max-w-[40ch] md:max-w-xl mb-8 md:mb-10 leading-[1.6] md:leading-[1.7] px-4 md:px-0"
              style={{ fontWeight: 400 }}
            >
              {t("hero.description", lang)}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-7 py-3.5 rounded-full text-[0.9375rem] hover:bg-[#0077ed] transition-colors shadow-[0_2px_16px_rgba(0,113,227,0.3)] w-full sm:w-auto"
              >
                {t("hero.cta", lang)} <ArrowRight size={16} />
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 text-[0.9375rem] text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto"
              >
                {t("hero.secondary", lang)}
              </a>
            </div>
          </div>
        }
      >
        {/* Desktop Compare */}
        <div className="hidden md:block w-full h-full">
          <Compare
            firstImage={oldAzazi}
            secondImage={newAzazi}
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="w-full h-full"
            slideMode="hover"
            autoplay
            autoplayDuration={4000}
          />
        </div>
        {/* Mobile Compare */}
        <div className="block md:hidden w-full h-full">
          <Compare
            firstImage={mobileOldAzazi}
            secondImage={mobileNewAzazi}
            firstImageClassName="object-cover object-top"
            secondImageClassname="object-cover object-top"
            className="w-full h-full"
            slideMode="drag"
            autoplay
            autoplayDuration={4000}
          />
        </div>
      </ContainerScroll>
    </section>
  );
}
