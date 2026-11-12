import { useParams } from "react-router";
import BlogArticleV2 from "../components/v2/BlogArticleV2";
import { blogPosts } from "../components/blogData";
import { BLOG } from "../components/v2/links";
import { SITE, articleDescription, articleTitle, withSocial } from "../utils/seoMeta";

// /blog/:slug: one German article in the v2 design.
const find = (slug?: string) => blogPosts.find((p) => p.slug === slug && p.lang === "de");

export function meta({ params }: { params: { slug?: string } }) {
  const post = find(params.slug);
  if (!post) return [{ title: "Artikel nicht gefunden | nüll." }, { name: "robots", content: "noindex, nofollow" }];
  return withSocial(
    `/blog/${post.slug}`,
    [
      { title: articleTitle(post.title) },
      { name: "description", content: articleDescription(post.excerpt) },
      { tagName: "link", rel: "canonical", href: `${SITE}/blog/${post.slug}` },
    ],
    {
      type: "article",
      image: `${SITE}${post.image}`,
      extra: [
        { property: "article:published_time", content: post.date },
        { property: "article:modified_time", content: post.date },
        { property: "article:section", content: post.category },
      ],
    },
  );
}

export default function BlogPostV2Route() {
  const { slug } = useParams();
  const post = find(slug);
  if (!post) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-white px-4 text-center">
        <div>
          <h1 className="text-[2.4rem] font-bold tracking-[-0.05em] text-[#0e0e10]">Artikel nicht gefunden<span className="text-[#007aff]">.</span></h1>
          <a href={BLOG} className="mt-6 inline-block border-b-2 border-[#111111] pb-0.5 font-black tracking-[-0.04em] text-[#111111]">Alle Artikel</a>
        </div>
      </main>
    );
  }
  return <BlogArticleV2 key={post.slug} post={post} />;
}
