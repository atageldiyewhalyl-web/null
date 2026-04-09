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
    "Exklusives Kanzlei-Marketing und Webdesign für deutsch-türkische Rechtsanwälte. Digitale Positionierung und Mandantengewinnung.",
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
  priceRange: "€500 - €2500",
  serviceType: [
    "Kanzlei Marketing",
    "Anwalts Webdesign",
    "SEO für Anwälte",
    "Digitale Positionierung",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Law Firm Marketing Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Lawyer Starter",
        price: "1200",
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
