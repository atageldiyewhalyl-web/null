import { type LoaderFunctionArgs } from "react-router";
import { BlogPost } from "../components/BlogPost";
import { blogPosts } from "../components/blogData";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return { post };
}

export function meta({ data }: { data: { post: any } }) {
  if (!data || !data.post) return [];
  const { post } = data;
  const baseUrl = "https://xn--nll-hoa.com";
  
  return [
    { title: `${post.title} | Nüll. Blog` },
    { name: "description", content: post.excerpt },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    { property: "og:image", content: post.image },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `${baseUrl}/blog/${post.slug}` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.excerpt },
    { name: "twitter:image", content: post.image },
  ];
}

export default function BlogPostRoute() {
  return <BlogPost />;
}

