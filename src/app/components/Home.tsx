import { Suspense, lazy } from 'react';
import { Hero } from "./Hero";
import { SEO, StructuredData } from "./SEO";

const Services = lazy(() => import("./Services").then(m => ({ default: m.Services })));
const Work = lazy(() => import("./Work").then(m => ({ default: m.Work })));
const Pricing = lazy(() => import("./Pricing").then(m => ({ default: m.Pricing })));
const Contact = lazy(() => import("./Contact").then(m => ({ default: m.Contact })));


const organizationData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nüll.",
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
        price: "400",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "650",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "1000",
        priceCurrency: "EUR",
      },
    ],
  },
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nüll.",
  url: "https://null.design",
  publisher: {
    "@type": "Organization",
    name: "Nüll.",
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
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Services />
        <Work />
        <Pricing />
        <Contact />
      </Suspense>
    </>
  );
}
