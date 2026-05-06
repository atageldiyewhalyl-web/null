export type Language = "en" | "de" | "tr";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  faqs?: FAQItem[];
  faqTitle?: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  lang: Language;
  groupId: string;
}
