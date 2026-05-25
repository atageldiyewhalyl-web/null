import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  overlayTextClassName?: string;
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  className?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#111111] transition-opacity hover:opacity-55"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#111111] transition-opacity hover:opacity-55"
  >
    <Icon className="h-5 w-5 stroke-[2.15]" />
  </a>
);

const CursorPlaceholder = () => (
  <div className="pointer-events-none absolute left-[52%] top-[56%] z-20 h-[17rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rotate-[-36deg] md:h-[22rem] md:w-[15rem] lg:h-[25rem] lg:w-[17rem]">
    <div className="absolute inset-0 rounded-[2.4rem] bg-black shadow-[0_28px_42px_rgba(0,0,0,0.22)] [clip-path:polygon(0_0,100%_56%,61%_66%,83%_100%,57%_100%,38%_71%,13%_100%)]" />
    <div className="absolute inset-[0.55rem] rounded-[2rem] bg-[linear-gradient(145deg,#3d3d3d,#050505_62%)] [clip-path:polygon(0_0,100%_56%,61%_66%,83%_100%,57%_100%,38%_71%,13%_100%)]" />
  </div>
);

const ClickRay = ({ className }: { className: string }) => (
  <span
    className={cn(
      "absolute z-30 block h-5 w-14 rounded-full bg-white shadow-[0_9px_16px_rgba(0,0,0,0.13)] md:h-6 md:w-16",
      className,
    )}
  />
);

export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  imageClassName,
  overlayText,
  overlayTextClassName,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col overflow-hidden bg-white px-7 py-7 font-sans text-[#111111] md:px-14 md:py-10",
        className,
      )}
    >
      <header className="relative z-40 flex w-full items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="text-[1.8rem] font-bold tracking-[-0.03em] text-[#0e0e10]"
        >
          {logoText.replace(/\.$/, "")}
          <span className="text-[#007aff]">.</span>
        </motion.div>
        <nav className="hidden items-center gap-16 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <motion.button
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex min-h-11 min-w-11 flex-col items-end justify-center gap-1.5 md:hidden"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="block h-0.5 w-7 bg-[#111111]" />
          <span className="block h-0.5 w-7 bg-[#111111]" />
          <span className="block h-0.5 w-5 bg-[#111111]" />
        </motion.button>
      </header>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#007aff] px-6 pb-8 pt-6 text-white md:hidden"
        >
          <div className="flex items-center justify-between">
            <a
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[1.85rem] font-bold tracking-[-0.04em] text-white"
            >
              {logoText.replace(/\.$/, "")}
              <span className="text-white/55">.</span>
            </a>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30"
              aria-label="Close menu"
            >
              <span className="absolute h-0.5 w-8 rotate-45 bg-white" />
              <span className="absolute h-0.5 w-8 -rotate-45 bg-white" />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="mt-16 flex flex-1 flex-col justify-center">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex min-h-[5.75rem] items-center justify-between border-t border-white/25 py-6 text-white last:border-b"
              >
                <span className="text-[clamp(3rem,14vw,5.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.075em]">
                  {link.label}
                </span>
                <span className="ml-4 text-[2.75rem] font-light leading-none transition-transform group-hover:translate-x-1">
                  {index === 0 ? "" : ">"}
                </span>
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-6 text-[1rem] font-bold tracking-[-0.02em] text-[#007aff]"
          >
            Let's Talk
          </a>
        </motion.div>
      )}

      <main className="relative z-10 grid flex-1 grid-cols-1 items-center gap-5 pt-8 md:grid-cols-[0.72fr_1.22fr_1.08fr] md:gap-6 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="z-30 order-2 max-w-[16.5rem] text-left md:order-1 md:mt-28"
        >
          <p className="text-[1.08rem] font-semibold leading-[1.28] tracking-[-0.035em] text-[#101010] md:text-[1.25rem] md:leading-[1.42]">
            {mainText}
          </p>
          <a
            href={readMoreLink}
            className="mt-5 inline-block border-b-2 border-[#111111] pb-0.5 text-[1.1rem] font-black tracking-[-0.04em] text-[#111111] md:mt-8 md:text-[1.25rem]"
          >
            Read More
          </a>
        </motion.div>

        <div className="relative order-1 flex min-h-[18rem] items-center justify-center md:order-2 md:min-h-[42rem]">
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute z-0 h-[17.5rem] w-[17.5rem] rounded-full bg-[#0755ff] shadow-[inset_36px_18px_90px_rgba(255,255,255,0.08),inset_-36px_-30px_80px_rgba(0,0,0,0.08)] md:h-[34rem] md:w-[34rem] lg:h-[39rem] lg:w-[39rem]"
          />
          {imageSrc ? (
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className={cn(
                "relative z-20 h-auto w-[15.25rem] translate-x-10 translate-y-14 object-contain md:w-[28rem] md:translate-x-24 md:translate-y-28 lg:w-[34rem]",
                imageClassName,
              )}
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <CursorPlaceholder />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.6 }}
          className="z-30 order-3 text-center md:text-left"
        >
          <h1
            className={cn(
              "flex flex-col text-[clamp(3.75rem,17vw,5.25rem)] font-extrabold leading-[0.82] tracking-[-0.065em] text-[#050505] md:text-[clamp(4.6rem,7.5vw,8.6rem)] md:leading-[0.86]",
              overlayTextClassName,
            )}
          >
            <span className="block whitespace-nowrap">
              {overlayText.part1.replace(/\.$/, "")}
              <span className="text-[#007aff]">.</span>
            </span>
            <span className="block whitespace-nowrap">
              {overlayText.part2.replace(/\.$/, "")}
              <span className="text-[#007aff]">.</span>
            </span>
          </h1>
        </motion.div>
      </main>

      <footer className="relative z-40 hidden w-full items-end justify-between pt-6 md:flex">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.8 }}
          className="flex items-center gap-7"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={`${link.href}-${index}`} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.9 }}
          className="text-right text-[1.02rem] font-bold tracking-[-0.035em] text-[#111111]"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
