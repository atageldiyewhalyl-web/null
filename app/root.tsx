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
import { LanguageProvider, type Language } from "./components/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./styles/index.css";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const match = cookie?.match(/nll_lang=([^;]+)/);
  const lang = (match ? match[1] : "de") as Language;
  return { lang };
}

// Layout is a pure shell — no hooks allowed here (no router context yet)
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
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

  return (
    <LanguageProvider initialLang={lang}>
      <div className="min-h-screen bg-white transition-colors duration-500">
        {!isOnboarding && <Navbar />}
        <Outlet />
        {!isOnboarding && <Footer />}
      </div>
    </LanguageProvider>
  );
}

export function meta(args: any) {
  const location = args?.location;
  const pathname = location?.pathname || "/";
  const isBlog = pathname.startsWith("/blog/");
  const title = "Nüll. - Consultant Marketing & Webdesign";
  const description = "Exzellentes Webdesign und digitale Positionierung für deutsch-türkische Berater in Deutschland. Wir machen Ihr Unternehmen zur digitalen Autorität.";
  const baseUrl = "https://xn--nll-hoa.com";
  const url = `${baseUrl}${pathname}`;

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: isBlog ? "article" : "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "Nüll. - Web Design Agentur Mannheim" },
    { property: "og:locale", content: "de_DE" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "theme-color", content: "#0071e3" },
    { name: "geo.region", content: "DE-BW" },
    { name: "geo.placename", content: "Mannheim" },
    { name: "geo.position", content: "49.4875;8.4660" },
    { name: "ICBM", content: "49.4875, 8.4660" },
  ];
}

import stylesheet from "./styles/index.css?url";

export function links(args: any) {
  const location = args?.location;
  const pathname = location?.pathname || "/";
  const baseUrl = "https://xn--nll-hoa.com";
  const url = `${baseUrl}${pathname}`;

  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" },
    { rel: "canonical", href: url },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "alternate", hrefLang: "de", href: url },

    { rel: "alternate", hrefLang: "en", href: url },
    { rel: "alternate", hrefLang: "tr", href: url },
    { rel: "alternate", hrefLang: "x-default", href: url },
  ];
}

