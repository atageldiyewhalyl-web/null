import { Hero } from "./Hero";
import { Services } from "./Services";
import { Work } from "./Work";
import { Pricing } from "./Pricing";
import { Contact } from "./Contact";
import { SEO, StructuredData } from "./SEO";

const organizationData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Null",
  description:
    "Premium web design, development, SEO, and branding agency for local businesses in Mannheim and throughout Germany.",
  url: "https://null.design",
  email: "hello@null.design",
  logo: "https://null.design/favicon.svg",
  areaServed: [
    { "@type": "City", name: "Mannheim" },
    { "@type": "Country", name: "Germany" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mannheim",
    addressCountry: "DE",
  },
  priceRange: "€250 - €600",
  serviceType: [
    "Web Design",
    "Web Development",
    "Search Engine Optimization",
    "Branding",
    "Website Maintenance",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web Design Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter",
        price: "250",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "400",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "600",
        priceCurrency: "EUR",
      },
    ],
  },
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Null",
  url: "https://null.design",
  publisher: {
    "@type": "Organization",
    name: "Null",
    logo: "https://null.design/favicon.svg",
  },
};

export function Home() {
  return (
    <>
      <SEO />
      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />
      <Hero />
      <Services />
      <Work />
      <Pricing />
      <Contact />
    </>
  );
}
