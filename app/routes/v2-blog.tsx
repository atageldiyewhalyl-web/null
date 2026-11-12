import BlogIndexV2 from "../components/v2/BlogIndexV2";
import { withSocial } from "../utils/seoMeta";

// /blog: the blog overview in the v2 design .
export function meta() {
  return withSocial("/blog", [
    { title: "Blog: Wissen, das Anfragen bringt | nüll." },
    { name: "description", content: "Artikel zu Websites, SEO, Google Ads und Online-Marketing für Handwerk, Kanzleien, Praxen und Dienstleister. Ehrlich erklärt." },
  ]);
}

export default function BlogV2Route() {
  return <BlogIndexV2 />;
}
