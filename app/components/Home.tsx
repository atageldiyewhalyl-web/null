import { Suspense, lazy, useEffect, useState } from 'react';
import { Hero } from "./Hero";
import { StructuredData } from "./SEO";
import { LeadCapture } from "./LeadCapture";

import { Problem } from "./Problem";
import { Services } from "./Services";
import { Work } from "./Work";
import { Pricing } from "./Pricing";
import { Contact } from "./Contact";



const organizationData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nüll.",
  description:
    "A client acquisition system for businesses, consultants, and law firms.",
  url: "https://xn--nll-hoa.com",
  email: "info@nüll.com",
  logo: "https://xn--nll-hoa.com/favicon.svg",
  areaServed: [
    { "@type": "Country", name: "Germany" },
    { "@type": "AdministrativeArea", name: "Europe" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mannheim",
    addressCountry: "DE",
  },
  priceRange: "€220 - €1500",
  serviceType: [
    "Business web design",
    "Consultant web design",
    "Law firm web design",
    "Client acquisition systems",
    "SEO and digital positioning",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Professional Website Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Business Starter",
        price: "220",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Authority Growth",
        price: "2400",
        priceCurrency: "EUR",
      },
    ],
  },
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nüll.",
  url: "https://xn--nll-hoa.com",
  publisher: {
    "@type": "Organization",
    name: "Nüll.",
    logo: "https://xn--nll-hoa.com/favicon.svg",
  },
};

export function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    document.title = "nüll. - Your client acquisition system";
  }, []);

  return (
    <>
      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />
      <Hero />
      <Problem />
      <Services />
      <Work />
      <Pricing onOpenQuote={() => setIsQuoteOpen(true)} />
      <Contact />
      <LeadCapture isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />

    </>
  );
}
