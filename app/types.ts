export type Language = "en" | "de" | "tr";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Provider {
  rank?: number;
  badge?: string;
  name: string;
  logo?: string;
  rating?: number;
  ratingLabel?: string;
  pros: string[];
  cons?: string[];
  pricing?: string[];
  pricingIncludes?: string[];
  url?: string;
  highlight?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  faqs?: FAQItem[];
  faqTitle?: string;
  providers?: Provider[];
  category: string;
  date: string;
  readTime: string;
  image: string;
  lang: Language;
  groupId: string;
}
