import type { BlogPost } from "../../../types";
import { batch as a } from "./batch-a";
import { batch as b } from "./batch-b";
import { batch as c } from "./batch-c";
import { batch as d } from "./batch-d";
import { batch as e } from "./batch-e";
import { batch as f } from "./batch-f";

/*
 * The Mannheim Handwerk article cluster (Nov 2026). Each batch file holds five German articles in the BlogPost format.
 * Content blocks follow the blog's small markdown dialect; "[CTA: web|seo|ads|ai|content|meta | optional headline]" is the
 * mid-article call to action, rendered by both the live blog (BlogPost.tsx) and the v2 blog (BlogArticleV2.tsx).
 */
export const handwerkPosts: BlogPost[] = [...a, ...b, ...c, ...d, ...e, ...f];
