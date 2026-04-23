import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StructuredData } from "./SEO";
import { blogPosts } from "./blogData";

export function BlogList() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nüll. Blog - Web Design Insights",
    description:
      "Practical web design, SEO, and branding insights for local businesses and consultants.",
    url: "https://null.design/blog",
    publisher: {
      "@type": "Organization",
      name: "Nüll.",
      url: "https://null.design",
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
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData data={breadcrumbData} />

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#0071e3] text-[0.8125rem] uppercase tracking-[0.1em] mb-4">
              Blog
            </p>
            <h1 className="text-[clamp(2rem,5vw,3rem)] tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontWeight: 600 }}>
              Insights & Ideas
            </h1>
            <p className="text-[1.0625rem] text-muted-foreground max-w-xl mb-16">
              Practical advice on web design, SEO, and building a brand that attracts the right clients.
            </p>
          </motion.div>

          <div className="space-y-12">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 items-start"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="py-1">
                    <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground mb-3">
                      <span className="uppercase tracking-[0.08em]">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    <h2
                      className="text-[clamp(1.125rem,2.5vw,1.5rem)] tracking-[-0.02em] leading-[1.3] mb-3 group-hover:text-[#0071e3] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-[0.9375rem] text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[#0071e3] group-hover:gap-2.5 transition-all">
                      Read article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
