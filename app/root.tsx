import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { LanguageProvider } from "./components/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CookieConsent } from "./components/CookieConsent";
import { getLanguageForPath, isLanguage } from "./utils/i18nRouting";
import { cn } from "./lib/utils";
import { useEffect } from "react";
import "./styles/index.css";

const shouldLoadAnalytics = import.meta.env.PROD;

// Layout is a pure shell — no hooks allowed here (no router context yet)
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {shouldLoadAnalytics && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-7WB0JX9VN2" />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7WB0JX9VN2');gtag('config','AW-18170315805');`,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// App has full router context — hooks are safe here
export default function App() {
  const location = useLocation();
  const queryLang = new URLSearchParams(location.search).get("lang");
  const lang = getLanguageForPath(location.pathname) ?? (isLanguage(queryLang) ? queryLang : "de");
  const isAdmin = location.pathname.startsWith("/admin");
  const isOnboarding = location.pathname.startsWith("/onboarding") || isAdmin;
  const isBlankCanvas =
    location.pathname === "/" ||
    location.pathname.startsWith("/new-landing") ||
    location.pathname.startsWith("/hasan") ||
    location.pathname.startsWith("/website-analyse") ||
    location.pathname.startsWith("/kanzlei-websites") ||
    location.pathname.startsWith("/lawyers") ||
    location.pathname.startsWith("/arztpraxis-websites") ||
    location.pathname.startsWith("/doctors");

  return (
    <LanguageProvider initialLang={lang} pathname={location.pathname} search={location.search}>
      <div
        className={cn(
          "min-h-screen w-full bg-white transition-colors duration-500",
          isBlankCanvas ? "new-landing-shell" : "max-w-[100vw] overflow-x-clip",
        )}
      >
        {!isOnboarding && !isBlankCanvas && <Navbar />}
        <Outlet />
        {!isOnboarding && !isBlankCanvas && <Footer />}
        {!isAdmin && <CookieConsent />}
        <SmoothScrollProvider pathname={location.pathname} />
        <CustomCursor />
      </div>
    </LanguageProvider>
  );
}

function SmoothScrollProvider({ pathname }: { pathname: string }) {
  useEffect(() => {
    const isAdminOrOnboarding = pathname.startsWith("/admin") || pathname.startsWith("/onboarding");
    const isTouchOnlyDevice = navigator.maxTouchPoints > 0 && window.matchMedia("(hover: none)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallViewport = window.innerWidth < 768;

    if (isAdminOrOnboarding || isTouchOnlyDevice || prefersReducedMotion || isSmallViewport) {
      return;
    }

    let isMounted = true;
    let animationFrame = 0;
    let isLenisStopped = false;
    let lenisInstance: { raf: (time: number) => void; destroy: () => void; start?: () => void; stop?: () => void } | null = null;

    const setupLenis = async () => {
      const Lenis = (await import("lenis")).default;

      if (!isMounted) {
        return;
      }

      lenisInstance = new Lenis({
        duration: 1.45,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.82,
        syncTouch: false,
      });

      const raf = (time: number) => {
        const bodyOverflowY = window.getComputedStyle(document.body).overflowY;
        const shouldPause = bodyOverflowY === "hidden";

        if (shouldPause && !isLenisStopped) {
          lenisInstance?.stop?.();
          isLenisStopped = true;
        } else if (!shouldPause && isLenisStopped) {
          lenisInstance?.start?.();
          isLenisStopped = false;
        }

        lenisInstance?.raf(time);
        animationFrame = requestAnimationFrame(raf);
      };

      animationFrame = requestAnimationFrame(raf);
    };

    setupLenis();

    return () => {
      isMounted = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, [pathname]);

  return null;
}

function CustomCursor() {
  useEffect(() => {
    const isTouchOnlyDevice = navigator.maxTouchPoints > 0 && window.matchMedia("(hover: none)").matches;
    if (isTouchOnlyDevice) {
      return;
    }

    let cursor = document.getElementById("custom-cursor");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = "custom-cursor";
      document.body.appendChild(cursor);
    }
    document.documentElement.classList.add("custom-cursor-ready");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isHoveringClickable = false;
    let isVisible = false;
    let animationFrame = 0;

    const clickableSelector = "a, button, input, textarea, select, summary, [role='button'], [data-cursor='pointer']";
    const brandBlue = { r: 0, g: 122, b: 255 };

    const parseRgb = (value: string) => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
      };
    };

    const isCloseToBrandBlue = (value: string) => {
      const rgb = parseRgb(value);
      if (!rgb) return false;

      const distance = Math.sqrt(
        (rgb.r - brandBlue.r) ** 2 +
          (rgb.g - brandBlue.g) ** 2 +
          (rgb.b - brandBlue.b) ** 2,
      );

      return distance < 70;
    };

    const getVisibleBackground = (element: Element | null) => {
      let current = element;

      while (current && current !== document.documentElement) {
        const backgroundColor = window.getComputedStyle(current).backgroundColor;
        if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
          return backgroundColor;
        }
        current = current.parentElement;
      }

      return window.getComputedStyle(document.body).backgroundColor;
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      const size = isHoveringClickable ? 62 : 30;
      const scale = isHoveringClickable ? 1 : 1;
      cursor!.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0) scale(${scale})`;
      cursor!.style.width = `${size}px`;
      cursor!.style.height = `${size}px`;
      cursor!.style.opacity = isVisible ? (isHoveringClickable ? "0.55" : "1") : "0";

      animationFrame = requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      isVisible = true;
      const hoveredElement = event.target as Element | null;
      isHoveringClickable = Boolean(hoveredElement?.closest(clickableSelector));
      cursor!.classList.toggle("is-on-brand-blue", isCloseToBrandBlue(getVisibleBackground(hoveredElement)));
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrame = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrame);
      document.documentElement.classList.remove("custom-cursor-ready");
      cursor?.remove();
    };
  }, []);

  return null;
}

export function meta(args: any) {
  const location = args?.location;
  const pathname = location?.pathname || "/";
  const isBlog = pathname.startsWith("/blog/");
  const title = "nüll. - Your client acquisition system";
  const description = "High-converting websites for businesses, consultants, and law firms built to earn trust and turn visitors into qualified enquiries.";
  const baseUrl = "https://xn--nll-hoa.com";
  const url = `${baseUrl}${pathname}`;
  const image = `${baseUrl}/og-image.png`;

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: isBlog ? "article" : "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "nüll. logo on a minimal branded background" },
    { property: "og:site_name", content: "nüll. - Your client acquisition system" },
    { property: "og:locale", content: "de_DE" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "nüll. logo on a minimal branded background" },
    { name: "theme-color", content: "#0071e3" },
    { name: "geo.region", content: "DE-BW" },
    { name: "geo.placename", content: "Mannheim" },
    { name: "geo.position", content: "49.4875;8.4660" },
    { name: "ICBM", content: "49.4875, 8.4660" },
  ];
}

import stylesheet from "./styles/index.css?url";

export function links(args: any) {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "image_src", href: "/og-image.png" },
  ];
}
