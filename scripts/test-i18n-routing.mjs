import assert from "node:assert/strict";
import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const routing = await server.ssrLoadModule("/app/utils/i18nRouting.ts");
  const { blogPosts } = await server.ssrLoadModule("/app/components/blogData.tsx");

  assert.equal(
    routing.getLocalizedPath("/blog/webdesign-fuer-anwaelte-kanzleien", "en"),
    "/blog/web-design-for-lawyers-law-firms",
  );
  assert.equal(
    routing.getLocalizedPath("/blog/freelancer-oder-agentur-website", "en"),
    "/blog/freelancer-vs-agency-website",
  );
  assert.equal(routing.getLocalizedPath("/blog/unknown", "en"), "/blog/unknown");
  assert.equal(routing.isLanguage("tr"), false);
  assert.equal(routing.getLocalizedPath("/pricing", "de"), "/pricing");
  assert.deepEqual(routing.validateBlogI18nData(), []);

  const duplicateSlug = [
    ...blogPosts,
    { ...blogPosts[0], groupId: "test-duplicate-slug", lang: "en" },
  ];
  assert.ok(
    routing.validateBlogI18nData(duplicateSlug).some((error) =>
      error.includes(`Duplicate blog slug: ${blogPosts[0].slug}`),
    ),
  );

  const duplicateLanguage = [
    ...blogPosts,
    { ...blogPosts[0], slug: "test-duplicate-language" },
  ];
  assert.ok(
    routing.validateBlogI18nData(duplicateLanguage).some((error) =>
      error.includes(`Duplicate ${blogPosts[0].lang} translation in blog group: ${blogPosts[0].groupId}`),
    ),
  );

  console.log("i18n routing tests passed");
} finally {
  await server.close();
}
