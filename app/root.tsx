import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { LanguageProvider } from "./components/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CookieConsent } from "./components/CookieConsent";
import { getLanguageForPath, isLanguage } from "./utils/i18nRouting";
import { cn } from "./lib/utils";
import "./styles/index.css";

const shouldLoadAnalytics = import.meta.env.PROD;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const urlLang = url.searchParams.get("lang");
  if (urlLang === "tr") {
    url.searchParams.delete("lang");
    if (url.pathname === "/tr" || url.pathname.startsWith("/tr/")) {
      const rest = url.pathname.replace(/^\/tr\/?/, "");
      const targetPath = rest ? `/${rest}` : "/";
      return redirect(`${targetPath}${url.search}${url.hash}`, 301);
    }
    return redirect(`${url.pathname}${url.search}${url.hash}`, 301);
  }
  const pathLang = getLanguageForPath(url.pathname);
  const cookie = request.headers.get("Cookie");
  const match = cookie?.match(/nll_lang=([^;]+)/);
  const preferredLang = isLanguage(match?.[1]) ? match[1] : "de";
  const queryLang = isLanguage(urlLang) ? urlLang : null;
  const lang = pathLang ?? queryLang ?? preferredLang;
  return { lang };
}

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
  const { lang } = useLoaderData<typeof loader>() || { lang: "de" };
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isOnboarding = location.pathname.startsWith("/onboarding") || isAdmin;
  const isBlankCanvas =
    location.pathname === "/" ||
    location.pathname.startsWith("/new-landing") ||
    location.pathname.startsWith("/lawyers");

  return (
    <LanguageProvider initialLang={lang}>
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
      </div>
    </LanguageProvider>
  );
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
