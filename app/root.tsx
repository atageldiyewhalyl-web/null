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
  const isOnboarding = location.pathname.startsWith("/onboarding");

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

export function meta() {
  return [
    { title: "Nüll. - Consultant Marketing & Webdesign" },
    { name: "description", content: "Exzellentes Webdesign und digitale Positionierung für deutsch-türkische Berater in Deutschland. Wir machen Ihr Unternehmen zur digitalen Autorität." },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Nüll. - Consultant Marketing & Webdesign" },
    { property: "og:description", content: "Exzellentes Webdesign und digitale Positionierung für deutsch-türkische Berater in Deutschland. Wir machen Ihr Unternehmen zur digitalen Autorität." },
    { property: "og:url", content: "https://xn--nll-hoa.com" },
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

export function links() {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "canonical", href: "https://xn--nll-hoa.com" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "alternate", hrefLang: "de", href: "https://xn--nll-hoa.com" },
    { rel: "alternate", hrefLang: "en", href: "https://xn--nll-hoa.com" },
    { rel: "alternate", hrefLang: "tr", href: "https://xn--nll-hoa.com" },
    { rel: "alternate", hrefLang: "x-default", href: "https://xn--nll-hoa.com" },
  ];
}
