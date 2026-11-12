// The homepage (the v2 design is the live site since 11 Nov 2026; old /* addresses 301-redirect here, see vercel.json).
export const HOME = "/";

// Section anchors (#faelle, #faq …) only exist on the homepage; from any other page they need the homepage path in front.
export const toHome = (href: string, onHome: boolean) => (!onHome && href.startsWith("#") ? `${HOME === "/" ? "/" : HOME}${href}` : href);

// The Referenzen page (all clients) and one case study each at /referenzen/<slug>.
export const REFS = "/referenzen";

// The blog.
export const BLOG = "/blog";

export const SERVICE = { seo: "/leistungen/seo", ads: "/leistungen/google-ads", ai: "/leistungen/ki-sichtbarkeit", content: "/leistungen/content", web: "/leistungen/webdesign" } as const;

// free website check (lead magnet)
export const CHECK = "/website-check";

// all services on one page (the "Leistungen" menu and its "Alles im Überblick" tile)
export const SERVICES = "/leistungen";
