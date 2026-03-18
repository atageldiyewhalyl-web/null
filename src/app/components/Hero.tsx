import { ArrowRight } from "lucide-react";
import { ContainerScroll } from "./ContainerScroll";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Compare } from "./ui/compare";
import { useLanguage, t } from "./LanguageContext";
import d3BeautyImage from "figma:asset/473bb093f01af6c805c30e6d4d64e82d9ede35f4.png";
import besirYamanImage from "figma:asset/1f4c4e77ddd345f7d1a5e23c5495771814d1ca1f.png";
import d3BeautyMobile from "figma:asset/fbe8286d4fda872ae933fe2b0da1a3cc56d11943.png";
import besirYamanMobile from "figma:asset/60ce2e9d07e1dfb48ed5fab776f6bf1453a9d568.png";

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
              className="text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.18] tracking-[-0.03em] mb-5 md:mb-8"
              style={{ fontWeight: 600 }}
            >
              {t("hero.line1", lang)}
              <br />
              {t("hero.line2", lang)}
              <br />
              <span className="text-[#0071e3]">{t("hero.line3", lang)}</span>
            </h1>

            <p
              className="text-[0.9375rem] md:text-[1.125rem] text-muted-foreground max-w-xl mb-6 md:mb-10 leading-[1.7] px-2 md:px-0"
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
            firstImage={d3BeautyImage}
            secondImage={besirYamanImage}
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
            firstImage={d3BeautyMobile}
            secondImage={besirYamanMobile}
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
