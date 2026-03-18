import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { LanguageProvider } from "./LanguageContext";

export function Layout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </LanguageProvider>
  );
}