import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SEO, StructuredData } from "./SEO";
import { blogPosts } from "./blogData";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen text-center">
        <h1 className="text-2xl mb-4" style={{ fontWeight: 600 }}>
          Post not found
        </h1>
        <Link to="/blog" className="text-[#0071e3] hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: {
      "@type": "ImageObject",
      url: post.image,
      width: 1080,
      height: 675,
    },
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Nüll.",
      url: "https://null.design",
      logo: "https://null.design/favicon.svg",
    },
    publisher: {
      "@type": "Organization",
      name: "Nüll.",
      url: "https://null.design",
      logo: {
        "@type": "ImageObject",
        url: "https://null.design/favicon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://null.design/blog/${post.slug}`,
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://null.design",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://null.design/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://null.design/blog/${post.slug}`,
      },
    ],
  };

  // Find related posts (exclude current, take 2)
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        type="article"
        image={post.image}
        publishedTime={post.date}
        author="Nüll."
      />
      <StructuredData data={structuredData} />
      <StructuredData data={breadcrumbData} />

      <main className="pt-28 pb-24 min-h-screen">
        <article>
          {/* Back link */}
          <div className="max-w-3xl mx-auto px-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> Back to blog
              </Link>
            </motion.div>
          </div>

          {/* Header */}
          <motion.header
            className="max-w-3xl mx-auto px-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground mb-4">
              <span className="uppercase tracking-[0.08em] text-[#0071e3]">
                {post.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
            <h1
              className="text-[clamp(1.75rem,4.5vw,2.75rem)] tracking-[-0.03em] leading-[1.15]"
              style={{ fontWeight: 600 }}
            >
              {post.title}
            </h1>
          </motion.header>

          {/* Hero image */}
          <motion.div
            className="max-w-4xl mx-auto px-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="aspect-[2/1] overflow-hidden rounded-2xl bg-neutral-100">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="max-w-3xl mx-auto px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {post.content.map((block, i) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="text-[1.375rem] tracking-[-0.02em] mt-10 mb-2"
                      style={{ fontWeight: 600 }}
                    >
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                return (
                  <p
                    key={i}
                    className="text-[1.0625rem] leading-[1.8] text-neutral-700"
                  >
                    {block}
                  </p>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-[#fafafa] rounded-2xl border border-black/5 text-center">
              <h3
                className="text-[1.25rem] mb-2"
                style={{ fontWeight: 600 }}
              >
                Need a website that delivers results?
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground mb-6">
                We design and build premium websites for businesses in Mannheim
                and across Germany.
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-[0.9375rem] hover:bg-foreground/90 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 mt-24">
            <h3
              className="text-[1.125rem] mb-8"
              style={{ fontWeight: 600 }}
            >
              More articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 mb-4">
                    <ImageWithFallback
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                    {r.category}
                  </p>
                  <h4
                    className="text-[1.0625rem] tracking-[-0.01em] leading-snug group-hover:text-[#0071e3] transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    {r.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
