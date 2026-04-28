import { Suspense, lazy, useState } from 'react';
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
    "Exklusives Business-Marketing und Webdesign für Unternehmen. Digitale Positionierung und Kundengewinnung.",
  url: "https://xn--nll-hoa.com",
  email: "hello@xn--nll-hoa.com",
  logo: "https://xn--nll-hoa.com/favicon.svg",
  areaServed: [
    { "@type": "City", name: "Mannheim" },
    { "@type": "Country", name: "Germany" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mannheim",
    addressCountry: "DE",
  },
  priceRange: "€220 - €1500",
  serviceType: [
    "Business Marketing",
    "Business Webdesign",
    "SEO für Unternehmen",
    "Digitale Positionierung",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Business Marketing Packages",
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
