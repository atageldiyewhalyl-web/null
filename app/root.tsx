import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { LanguageProvider } from "./components/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <LanguageProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            {children}
            <Footer />
          </div>
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function meta() {
  return [
    { title: "Nüll. - Web Design Agentur Mannheim" },
    { name: "description", content: "Premium Webdesign, Entwicklung, SEO und Branding für lokale Unternehmen in Mannheim und ganz Deutschland. Klare, conversion-orientierte Websites, die Autorität schaffen." },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Nüll. - Web Design Agentur Mannheim" },
    { property: "og:description", content: "Premium Webdesign, Entwicklung, SEO und Branding für lokale Unternehmen in Mannheim und ganz Deutschland. Klare, conversion-orientierte Websites, die Autorität schaffen." },
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

export function links() {
  return [
    { rel: "canonical", href: "https://xn--nll-hoa.com" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "alternate", hrefLang: "de", href: "https://xn--nll-hoa.com" },
    { rel: "alternate", hrefLang: "en", href: "https://xn--nll-hoa.com" },
    { rel: "alternate", hrefLang: "tr", href: "https://xn--nll-hoa.com" },
    { rel: "alternate", hrefLang: "x-default", href: "https://xn--nll-hoa.com" },
  ];
}
