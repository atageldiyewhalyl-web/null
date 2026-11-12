import HeroV2 from "../components/v2/HeroV2";
import ExplainerV2 from "../components/v2/ExplainerV2";
import CasesBentoV2 from "../components/v2/CasesBentoV2";
import StimmenV2 from "../components/v2/StimmenV2";
import WebsiteCheckTeaserV2 from "../components/v2/WebsiteCheckTeaserV2";
import AblaufV2 from "../components/v2/AblaufV2";
import PreiseTeaserV2 from "../components/v2/PreiseTeaserV2";
import FaqV2 from "../components/v2/FaqV2";
import BlogV2 from "../components/v2/BlogV2";
import ContactV2 from "../components/v2/ContactV2";
import FooterV2 from "../components/v2/FooterV2";

const URL = "https://nuell-agentur.com/";
const IMAGE = "https://nuell-agentur.com/og-image.png";
const TITLE = "nüll. | Webdesign, SEO & Google Ads aus Mannheim";
const DESCRIPTION =
  "nüll. baut Websites, SEO und Google Ads für Handwerk, Kanzleien, Praxen und Berater, die mehr Anfragen wollen. Aus Mannheim, für ganz Deutschland.";

export function meta() {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: URL },
    { property: "og:image", content: IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "de_DE" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE },
    { name: "twitter:description", content: DESCRIPTION },
    { name: "twitter:image", content: IMAGE },
    { tagName: "link", rel: "canonical", href: URL },
  ];
}

// carried over from the old homepage (organisation + website schema)
const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://nuell-agentur.com/#organization",
    name: "nüll.",
    url: URL,
    alternateName: ["nuell", "nüll Agentur Mannheim", "nuell-agentur"],
    logo: { "@type": "ImageObject", url: "https://nuell-agentur.com/apple-touch-icon.png", width: 180, height: 180 },
    image: IMAGE,
    email: "info@xn--nll-hoa.com",
    telephone: "+4915256569852",
    address: { "@type": "PostalAddress", addressLocality: "Mannheim", addressCountry: "DE" },
    areaServed: [{ "@type": "City", name: "Mannheim" }, { "@type": "AdministrativeArea", name: "Rhein-Neckar" }, { "@type": "Country", name: "Deutschland" }],
    knowsAbout: ["Webdesign", "Suchmaschinenoptimierung", "Google Ads", "Lokale SEO", "KI-Sichtbarkeit"],
    sameAs: ["https://www.linkedin.com/company/n%C3%BCll/"],
    description: "nüll. baut Websites, SEO und Google Ads für mehr qualifizierte Anfragen.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://nuell-agentur.com/#website",
    name: "nüll.",
    url: URL,
    publisher: { "@id": "https://nuell-agentur.com/#organization" },
    inLanguage: "de-DE",
  },
];

export default function HomeV2Route() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
    <main>
      <HeroV2 />
      <ExplainerV2 />
      <CasesBentoV2 />
      <StimmenV2 />
      <WebsiteCheckTeaserV2 />
      <AblaufV2 />
      <PreiseTeaserV2 />
      <FaqV2 />
      <BlogV2 />
      <ContactV2 />
    </main>
    <FooterV2 />
    </>
  );
}
