"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  linkHref: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768);
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gridStyle = React.useMemo(() => {
      if (activeIndex === null) return {};

      if (isDesktop) {
        const columns = items
          .map((_, index) => (index === activeIndex ? "5fr" : "1fr"))
          .join(" ");
        return { gridTemplateColumns: columns };
      }

      const rows = items
        .map((_, index) => (index === activeIndex ? "minmax(18rem, 1fr)" : "4.75rem"))
        .join(" ");
      return { gridTemplateRows: rows };
    }, [activeIndex, items, isDesktop]);

    const handleInteraction = (index: number) => {
      setActiveIndex(index);
    };

    return (
      <ul
        className={cn(
          "grid h-[52rem] w-full max-w-6xl gap-3 transition-[grid-template-columns,grid-template-rows] duration-500 ease-out md:h-[500px] md:gap-2",
          className
        )}
        style={{
          ...gridStyle,
          ...(isDesktop ? { gridTemplateRows: "1fr" } : { gridTemplateColumns: "1fr" }),
        }}
        ref={ref}
        {...props}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/20 bg-white/10 text-white shadow-sm outline-none transition-[border-color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-white/80",
              "data-[active=true]:border-white/35 data-[active=true]:shadow-[0_22px_70px_rgba(0,0,0,0.22)] md:min-w-[80px] md:rounded-lg md:data-[active=true]:shadow-sm"
            )}
            onMouseEnter={() => handleInteraction(index)}
            onFocus={() => handleInteraction(index)}
            onClick={() => handleInteraction(index)}
            tabIndex={0}
            data-active={activeIndex === index}
          >
            <img
              src={item.imgSrc}
              alt={item.title}
              className="absolute inset-0 h-full w-full scale-105 object-cover object-center grayscale transition-all duration-500 ease-out group-data-[active=true]:scale-100 group-data-[active=true]:grayscale-0 md:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 transition-opacity duration-500 group-data-[active=true]:bg-gradient-to-t group-data-[active=true]:from-black/78 group-data-[active=true]:via-black/25 group-data-[active=true]:to-black/5 md:bg-gradient-to-t md:from-black/80 md:via-black/20 md:to-black/5 md:group-data-[active=true]:from-black/70 md:group-data-[active=true]:via-black/15 md:group-data-[active=true]:to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/35 opacity-70" />

            <article className="absolute inset-0 flex flex-col justify-end gap-2 p-4 md:p-4">
              <div className="flex items-center gap-3 transition-all duration-300 group-data-[active=true]:mb-auto group-data-[active=true]:opacity-0 md:hidden">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/55">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="truncate text-[1.08rem] font-bold leading-tight tracking-[-0.035em] text-white">
                    {item.title}
                  </h3>
                </div>
              </div>

              <h3 className="hidden origin-left rotate-90 text-sm font-light uppercase tracking-wider text-white/80 opacity-100 transition-all duration-300 ease-out group-data-[active=true]:opacity-0 md:block">
                {item.title}
              </h3>

              <div className="text-white/90 opacity-0 transition-all delay-75 duration-300 ease-out group-data-[active=true]:opacity-100 [&_svg]:h-7 [&_svg]:w-7 md:[&_svg]:h-auto md:[&_svg]:w-auto">
                {item.icon}
              </div>

              <h3 className="max-w-[18rem] text-[1.55rem] font-bold leading-[1.02] tracking-[-0.045em] text-white opacity-0 transition-all delay-150 duration-300 ease-out group-data-[active=true]:opacity-100 md:text-xl md:leading-normal md:tracking-normal">
                {item.title}
              </h3>

              <p className="w-full max-w-[20rem] text-[0.95rem] font-medium leading-relaxed tracking-[-0.02em] text-white/78 opacity-0 transition-all delay-[225ms] duration-300 ease-out group-data-[active=true]:opacity-100 md:max-w-xs md:text-sm md:font-normal md:leading-normal md:tracking-normal md:text-white/80">
                {item.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    );
  }
);

ExpandingCards.displayName = "ExpandingCards";
