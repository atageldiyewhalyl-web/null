import type { BlogPost } from "../../../types";
import { batch as a } from "./batch-a";
import { batch as b } from "./batch-b";
import { batch as c } from "./batch-c";
import { batch as d } from "./batch-d";
import { batch as e } from "./batch-e";
import { batch as f } from "./batch-f";
import { batch as g } from "./batch-g";
import { batch as h } from "./batch-h";
import { batch as i } from "./batch-i";
import { batch as j } from "./batch-j";

/*
 * The 50 long-form guides (Nov 2026): Kanzleien, Arztpraxen, Berater und Dienstleister, Handwerk (Lücken) and
 * Website-Themen für alle. Each batch file holds five German articles in the BlogPost format.
 * Images are existing site assets where one fits; generated photos are in public/assets/blog/guides.
 */
export const guidePosts: BlogPost[] = [...a, ...b, ...c, ...d, ...e, ...f, ...g, ...h, ...i, ...j];
