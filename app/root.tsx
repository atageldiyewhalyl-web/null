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
        {/* Google Tag Manager */}
        {shouldLoadAnalytics && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PGRDT988');`,
            }}
          />
        )}
        <Meta />
        <Links />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        {shouldLoadAnalytics && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PGRDT988" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
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
    location.pathname.startsWith("/mandate-kanzlei-mannheim") ||
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
        <AnchorScrollProvider pathname={location.pathname} />
        <SmoothScrollProvider pathname={location.pathname} />
      </div>
    </LanguageProvider>
  );
}

function AnchorScrollProvider({ pathname }: { pathname: string }) {
  useEffect(() => {
    const scrollToHash = (hash: string, updateHistory = false) => {
      if (!hash || hash === "#") {
        return false;
      }

      const targetId = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(targetId);

      if (!target) {
        return false;
      }

      if (updateHistory) {
        window.history.pushState(null, "", hash);
      }

      window.requestAnimationFrame(() => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        const distance = Math.abs(targetTop - window.scrollY);
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion || distance > window.innerHeight * 1.5 ? "auto" : "smooth",
        });
      });

      return true;
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      const hash = link?.getAttribute("href");

      if (!hash) {
        return;
      }

      if (scrollToHash(hash, true)) {
        event.preventDefault();
      }
    };

    const handleHashChange = () => {
      scrollToHash(window.location.hash);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", handleHashChange);

    if (window.location.hash) {
      window.setTimeout(() => scrollToHash(window.location.hash), 0);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return null;
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
        duration: 0.7,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.45,
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
