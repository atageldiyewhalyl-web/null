import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SEO, StructuredData } from "./SEO";
import { blogPosts } from "./blogData";

import { useParams, Link } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { blogPosts } from "./blogData";
import { useState, useEffect } from "react";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

  const formattedDate = new Date(post.date).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Find related posts (exclude current, take 2)
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Extract headers for TOC
  const headers = post.content
    .filter(block => block.startsWith("## "))
    .map(block => block.replace("## ", ""));

  return (
    <div className="bg-white">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#0071e3] origin-left z-[100]"
        style={{ scaleX }}
      />

      <main className="pt-32 pb-24 min-h-screen">
        <article>
          {/* Breadcrumbs & Actions */}
          <div className="max-w-4xl mx-auto px-6 mb-12 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-neutral-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={16} /> Back to Insights
              </Link>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500">
                <Share2 size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500">
                <Bookmark size={18} />
              </button>
            </div>
          </div>

          {/* Header Section */}
          <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 rounded-full bg-[#0071e3]/5 text-[#0071e3] text-[0.75rem] font-bold uppercase tracking-widest mb-6"
            >
              {post.category}
            </motion.div>
            
            <motion.h1
              className="text-[clamp(2.25rem,6vw,4rem)] tracking-[-0.04em] leading-[1.05] mb-8 font-semibold text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {post.title}
            </motion.h1>

            <motion.div 
              className="flex items-center justify-center gap-6 text-[0.875rem] text-neutral-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-neutral-400" />
                {formattedDate}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-neutral-400" />
                {post.readTime}
              </span>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="max-w-6xl mx-auto px-6 mb-20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-[21/9] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-2xl shadow-black/5 ring-1 ring-black/5">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
            {/* Sidebar / TOC (Desktop Only) */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-10">
                <div>
                  <h4 className="text-[0.75rem] font-bold uppercase tracking-widest text-neutral-400 mb-6">
                    Table of Contents
                  </h4>
                  <nav className="space-y-4">
                    {headers.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block text-[0.9375rem] text-neutral-500 hover:text-[#0071e3] transition-colors leading-relaxed"
                      >
                        {h}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <h4 className="text-[0.9375rem] font-semibold mb-3">Newsletter</h4>
                  <p className="text-[0.8125rem] text-neutral-500 mb-4 leading-normal">
                    Get the latest insights on digital growth delivered to your inbox.
                  </p>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-sm mb-2 focus:ring-2 focus:ring-[#0071e3] outline-none"
                  />
                  <button className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>

            {/* Post Content */}
            <div className="max-w-3xl">
              <div className="prose prose-neutral prose-lg max-w-none">
                {post.content.map((block, i) => {
                  if (block.startsWith("## ")) {
                    const text = block.replace("## ", "");
                    return (
                      <h2
                        key={i}
                        id={text.toLowerCase().replace(/\s+/g, "-")}
                        className="text-[1.75rem] tracking-[-0.02em] font-semibold mt-16 mb-6 text-black scroll-mt-32"
                      >
                        {text}
                      </h2>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className="text-[1.125rem] leading-[1.8] text-neutral-700 mb-8 font-normal"
                    >
                      {block}
                    </p>
                  );
                })}
              </div>

              {/* Author & Share */}
              <div className="mt-20 pt-10 border-t border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold text-lg">
                    N
                  </div>
                  <div>
                    <p className="text-[1rem] font-semibold">Nüll. Editorial Team</p>
                    <p className="text-[0.875rem] text-neutral-500">Design & Growth Experts</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[0.875rem] font-medium text-neutral-400 mr-2">Share:</span>
                  {['Twitter', 'LinkedIn', 'Facebook'].map(platform => (
                    <button key={platform} className="px-4 py-2 rounded-full border border-neutral-200 text-[0.8125rem] font-medium hover:bg-neutral-50 transition-colors">
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Major CTA Section */}
              <div className="mt-24 relative overflow-hidden rounded-[2.5rem] bg-neutral-900 text-white p-10 md:p-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071e3] opacity-20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-[2rem] md:text-[2.5rem] font-semibold tracking-tight leading-tight mb-6">
                    Ready to build your digital authority?
                  </h3>
                  <p className="text-[1.125rem] text-neutral-400 mb-10 leading-relaxed">
                    We help consultants and experts transform their expertise into a premium digital presence that attracts high-value clients.
                  </p>
                  <Link
                    to="/#contact"
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-[1rem] font-semibold hover:bg-[#0071e3] hover:text-white transition-all duration-300 group"
                  >
                    Start your project <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 mt-32">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[1.5rem] font-semibold tracking-tight">
                Recommended Reading
              </h3>
              <Link to="/blog" className="text-[0.9375rem] font-semibold text-[#0071e3] hover:underline">
                View all articles
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group block"
                >
                  <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 mb-6 shadow-sm group-hover:shadow-xl group-hover:shadow-black/5 transition-all duration-500">
                    <ImageWithFallback
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[0.75rem] font-bold uppercase tracking-widest text-[#0071e3]">
                      {r.category}
                    </p>
                    <h4 className="text-[1.5rem] font-semibold tracking-tight leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                    <p className="text-[0.9375rem] text-neutral-500 line-clamp-2 leading-relaxed">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

