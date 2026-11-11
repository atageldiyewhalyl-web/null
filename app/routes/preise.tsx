import { NavBar } from "../components/v2/HeroV2";
import PreiseV2 from "../components/v2/PreiseV2";
import FaqV2 from "../components/v2/FaqV2";
import ContactV2 from "../components/v2/ContactV2";
import FooterV2 from "../components/v2/FooterV2";

/*
 * /preise: the pricing section from the homepage as its own page, followed by the FAQ
 * (Laufzeit, Kündigung, Paketwechsel) and the contact form, so "Anfrage starten" stays on the page.
 */

export function meta() {
  return [
    { title: "Preise | nüll." },
    { name: "description", content: "Was eine Website, SEO, Google Ads und Social bei nüll. kosten. Alle Preise netto." },
  ];
}

export default function PreiseRoute() {
  return (
    <>
      <div className="bg-[#f5f5f7]">
        <NavBar onHome={false} current="/preise" />
      </div>
      <main>
        <PreiseV2 standalone />
        <FaqV2 />
        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}
