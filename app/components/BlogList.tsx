import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StructuredData } from "./SEO";
import { useLanguage } from "./LanguageContext";
import { blogPosts } from "./blogData";

export function BlogList() {
  const { lang } = useLanguage();

  // Filter posts to show only one version per groupId, matching the current language
  const displayedPosts = Object.values(
    blogPosts.reduce((acc, post) => {
      const existing = acc[post.groupId];
      // If we haven't found a post for this group yet, or if this post matches the current language
      if (!existing || post.lang === lang) {
        acc[post.groupId] = post;
      }
      // If the existing one isn't the current language but this one is, override
      if (existing && existing.lang !== lang && post.lang === lang) {
        acc[post.groupId] = post;
      }
      return acc;
    }, {} as Record<string, typeof blogPosts[0]>)
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nüll. Insights - Premium Digital Strategy",
    description:
      "Insights on webdesign, digital positioning, and growth for businesses.",
    url: "https://xn--nll-hoa.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Nüll.",
      url: "https://xn--nll-hoa.com",
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
        item: "https://xn--nll-hoa.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://xn--nll-hoa.com/blog",
      },
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData data={breadcrumbData} />

      <main className="pt-32 pb-32 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[0.75rem] font-black uppercase tracking-[0.2em] mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                Insights
              </div>
              <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold tracking-[-0.05em] leading-[1] mb-8 text-gradient font-outfit">
                Digital Presence & Authority.
              </h1>

              <p className="text-[1.25rem] text-neutral-500 max-w-xl leading-relaxed font-medium">
                Strategies and insights to help you transform your expertise into a premium digital brand that commands respect.
              </p>
            </motion.div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {displayedPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block space-y-6"
                >
                  {/* Image Container */}
                  <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-neutral-100 ring-1 ring-black/5 shadow-sm group-hover:shadow-2xl group-hover:shadow-black/10 transition-all duration-700 relative group-hover:-translate-y-2">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Content */}
                  <div className="px-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[0.75rem] font-black uppercase tracking-[0.15em] text-[#0071e3]">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span className="flex items-center gap-1.5 text-[0.875rem] font-bold text-neutral-400">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-[1.75rem] font-bold tracking-[-0.03em] leading-[1.2] group-hover:text-[#0071e3] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-[1rem] text-neutral-500 line-clamp-3 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[0.875rem] font-black uppercase tracking-widest text-black group-hover:text-[#0071e3] transition-colors">
                      Read insight
                      <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-[#0071e3] group-hover:border-[#0071e3] group-hover:text-white transition-all">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
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
