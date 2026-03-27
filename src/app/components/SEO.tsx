import { useEffect, useId } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  author?: string;
}

const SITE_NAME = "Nüll. - Web Design Agency Mannheim";
const BASE_URL = "https://null.design";
const DEFAULT_DESC =
  "Premium web design, development, SEO, and branding for local businesses in Mannheim and throughout Germany. Clean, conversion-focused websites that establish authority.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  type = "website",
  image = DEFAULT_IMAGE,
  publishedTime,
  author,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("robots", "index, follow, max-image-preview:large");

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", image, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "en_US", true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    if (publishedTime) {
      setMeta("article:published_time", publishedTime, true);
    }
    if (author) {
      setMeta("article:author", author, true);
    }

    // Canonical
    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
  }, [fullTitle, description, canonicalUrl, type, image, publishedTime, author]);

  return null;
}

export function StructuredData({ data }: { data: object }) {
  const id = useId();

  useEffect(() => {
    const existingScript = document.querySelector(`script[data-sd-id="${id}"]`);
    if (existingScript) {
      existingScript.textContent = JSON.stringify(data);
      return;
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-sd-id", id);
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data, id]);

  return null;
}
