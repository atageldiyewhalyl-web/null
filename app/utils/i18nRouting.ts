import type { BlogPost, Language } from "../types";
import { blogPosts } from "../components/blogData";

const DEFAULT_LANGUAGE: Language = "de";

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "de" || value === "tr";
}

export function getBlogSlugFromPath(pathname: string): string | null {
  const cleanPath = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  const [, section, slug] = cleanPath.split("/");

  if (section !== "blog" || !slug) return null;

  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function getBlogPostBySlug(slug: string | undefined | null): BlogPost | null {
  if (!slug) return null;
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getBlogPostLanguage(pathname: string): Language | null {
  return getBlogPostBySlug(getBlogSlugFromPath(pathname))?.lang ?? null;
}

export function getBlogTranslations(postOrSlug: BlogPost | string | null | undefined): BlogPost[] {
  const post = typeof postOrSlug === "string" ? getBlogPostBySlug(postOrSlug) : postOrSlug;
  if (!post) return [];
  return blogPosts.filter((candidate) => candidate.groupId === post.groupId);
}

export function getBlogTranslationPath(pathname: string, targetLang: Language): string {
  const currentPost = getBlogPostBySlug(getBlogSlugFromPath(pathname));
  if (!currentPost) return pathname;

  const translation = getBlogTranslations(currentPost).find((post) => post.lang === targetLang);
  return translation ? `/blog/${translation.slug}` : pathname;
}

export function getLanguageForPath(pathname: string): Language | null {
  return getBlogPostLanguage(pathname);
}

export function getLocalizedPath(pathname: string, targetLang: Language): string {
  return getBlogTranslationPath(pathname, targetLang);
}

export function getPreferredPostForGroup(groupId: string, lang: Language): BlogPost | null {
  const posts = blogPosts.filter((post) => post.groupId === groupId);
  return (
    posts.find((post) => post.lang === lang) ??
    posts.find((post) => post.lang === DEFAULT_LANGUAGE) ??
    posts[0] ??
    null
  );
}

export function getXDefaultPost(post: BlogPost): BlogPost {
  return getBlogTranslations(post).find((translation) => translation.lang === DEFAULT_LANGUAGE) ?? post;
}

export function validateBlogI18nData(posts: BlogPost[] = blogPosts): string[] {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();
  const groupLanguages = new Map<string, Set<Language>>();

  for (const post of posts) {
    if (!post.slug.trim()) {
      errors.push(`Missing blog slug in group: ${post.groupId}`);
    }

    if (seenSlugs.has(post.slug)) {
      errors.push(`Duplicate blog slug: ${post.slug}`);
    }
    seenSlugs.add(post.slug);

    if (!isLanguage(post.lang)) {
      errors.push(`Invalid language for blog slug ${post.slug}: ${String(post.lang)}`);
      continue;
    }

    const languages = groupLanguages.get(post.groupId) ?? new Set<Language>();
    if (languages.has(post.lang)) {
      errors.push(`Duplicate ${post.lang} translation in blog group: ${post.groupId}`);
    }
    languages.add(post.lang);
    groupLanguages.set(post.groupId, languages);
  }

  return errors;
}
