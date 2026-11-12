import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Link2, X } from "lucide-react";
import type { BlogPost } from "../../types";
import { StructuredData } from "../SEO";
import { BFSGVisual, DsgvoVisual, MethodenQuick, PositivbeispielBlock, ProviderEditorialList } from "../BlogPost";
import { NavBar } from "./HeroV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { BLOG } from "./links";
import { CTA_SERVICES, cover, dePosts, fmtDate, fmtRead, postAudience, postService, postTag, slugify } from "./blogShared";
import { SERVICE } from "./links";
import { PostCard } from "./BlogIndexV2";
import { CheckStrip, ContactBand, ContactButtons, InquiryCalc, PHONE, ProofRow, SelfTest, SidebarLead, StickyBar, trackBlog, waLink } from "./BlogConversion";

/*
 * One article in the v2 design. The text comes from blogData.tsx as an array of blocks (a small markdown dialect):
 * "## " / "### " headings, "- " and "1. " lists, "- [ ]" checklists, "| " tables, "> " quotes (a first-block quote is the summary),
 * [BEFORE] … [AFTER] comparisons, [ASSET: …/file.png] images and a few named visuals ([BFSG_VISUAL] …) for the Kanzlei guide.
 * Desktop: text column with a sticky contents list and a service card beside it. Phones: contents fold into one button.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const LIVE = "https://nuell-agentur.com";

// **bold**, *italic*, [label](href)
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i} className="font-bold text-[#0e0e10]">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      // old internal blog links point at /blog/…; keep readers inside the v2 blog
      const svc: Record<string, string> = { "/leistungen/webdesign": SERVICE.web, "/leistungen/seo": SERVICE.seo, "/leistungen/google-ads": SERVICE.ads };
      const to = href.startsWith("/blog/") ? `${BLOG}/${href.slice(6)}` : svc[href] ?? href;
      const ext = /^https?:/.test(to);
      return (
        <a key={i} href={to} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} className="font-semibold text-[#007aff] underline decoration-[#007aff]/30 underline-offset-[3px] transition-colors hover:decoration-[#007aff]">
          {label}
        </a>
      );
    }
    return part;
  });
}

type Node =
  | { k: "h2"; text: string; id: string }
  | { k: "h3"; text: string }
  | { k: "p"; text: string }
  | { k: "quote"; text: string }
  | { k: "ul"; items: string[] }
  | { k: "ol"; items: { n: string; text: string }[] }
  | { k: "check"; items: string[] }
  | { k: "table"; head: string[]; rows: string[][] }
  | { k: "compare"; before: string; after: string }
  | { k: "img"; src: string; label: string }
  | { k: "visual"; name: string }
  | { k: "cta"; key: string; headline?: string }
  | { k: "mod"; name: Mod };

type Mod = "CHECK" | "PROOF" | "SELFTEST" | "CALC" | "CONTACT";

// Turns the flat block list into nodes, grouping consecutive list items and table lines.
function parse(blocks: string[]): Node[] {
  const out: Node[] = [];
  const ids = new Set<string>();
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (!b) continue;
    if (/^\[(PROVIDERS_CAROUSEL|BFSG_VISUAL|DSGVO_VISUAL|POSITIVBEISPIEL|METHODEN_QUICK)\]$/.test(b)) {
      out.push({ k: "visual", name: b.slice(1, -1) });
    } else if (/^\[CTA(:|\])/.test(b)) {
      const [key, headline] = b.replace(/^\[CTA:?\s*/, "").replace(/\]$/, "").split("|").map((x) => x.trim());
      out.push({ k: "cta", key: key || "web", headline: headline || undefined });
    } else if (/^\[(CHECK|PROOF|SELFTEST|CALC|CONTACT)\]$/.test(b)) {
      out.push({ k: "mod", name: b.slice(1, -1) as Mod });
    } else if (b === "[PRICING_TABLE]") {
      continue;
    } else if (b.startsWith("[ASSET:") || b.startsWith("[IMAGE")) {
      const src = b.match(/([^\s\]]+\.(png|jpe?g|webp|gif))/i)?.[1];
      const label = b.match(/\[(?:ASSET|IMAGE[^:]*?):\s*(.*?)\]/)?.[1]?.split("—").pop()?.replace(src ?? "", "").trim() || "";
      if (src) out.push({ k: "img", src: src.startsWith("/") ? src : `/assets/blog/${src}`, label });
    } else if (b.includes("[BEFORE]") && b.includes("[AFTER]")) {
      const m = b.match(/\[BEFORE\]\s*"?(.*?)"?\s*\[AFTER\]\s*"?(.*?)"?$/);
      if (m) out.push({ k: "compare", before: m[1], after: m[2] });
    } else if (b.startsWith("## ")) {
      const text = b.slice(3).trim();
      let id = slugify(text) || `abschnitt-${i}`;
      while (ids.has(id)) id += "-2";
      ids.add(id);
      out.push({ k: "h2", text, id });
    } else if (b.startsWith("### ")) {
      out.push({ k: "h3", text: b.slice(4).trim() });
    } else if (b.startsWith("> ")) {
      out.push({ k: "quote", text: b.slice(2) });
    } else if (b.startsWith("- [ ]") || b.startsWith("- [x]")) {
      const last = out[out.length - 1];
      const item = b.replace(/^- \[[ x]\]\s*/, "");
      if (last?.k === "check") last.items.push(item);
      else out.push({ k: "check", items: [item] });
    } else if (b.startsWith("- ") || b.startsWith("* ")) {
      const last = out[out.length - 1];
      if (last?.k === "ul") last.items.push(b.slice(2));
      else out.push({ k: "ul", items: [b.slice(2)] });
    } else if (/^\d+\.\s/.test(b)) {
      const n = b.match(/^\d+/)![0];
      const text = b.replace(/^\d+\.\s*/, "");
      const last = out[out.length - 1];
      if (last?.k === "ol") last.items.push({ n, text });
      else out.push({ k: "ol", items: [{ n, text }] });
    } else if (b.startsWith("|")) {
      const cells = b.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
      const last = out[out.length - 1];
      if (last?.k === "table" && blocks[i - 1]?.trim().startsWith("|")) last.rows.push(cells);
      else out.push({ k: "table", head: cells, rows: [] });
    } else {
      out.push({ k: "p", text: b });
    }
  }
  return out;
}

/*
 * Puts the conversion modules into an article that doesn't place them itself, so every post (also future ones) gets them:
 *   check strip after the intro, client proof at about 40 %, a free tool at about 70 % (Selbsttest for website topics,
 *   Rechner for Google, SEO and marketing topics). Each goes in front of a "##" heading and never right next to
 *   another call to action. The contact band is added after the body (before the FAQ) in BlogArticleV2.
 * A module the post already contains as a block ([CHECK], [PROOF], [SELFTEST], [CALC], [CONTACT]) is not added twice.
 */
function planModules(nodes: Node[], service: string): Node[] {
  const has = (m: Mod) => nodes.some((n) => n.k === "mod" && n.name === m);
  const tool: Mod = service === "Webdesign" ? "SELFTEST" : "CALC";
  const hasTool = has("SELFTEST") || has("CALC");
  const out = [...nodes];
  const heads = () => out.map((n, i) => (n.k === "h2" ? i : -1)).filter((i) => i > 0);
  const nearCta = (at: number) => out.slice(Math.max(0, at - 2), at + 1).some((n) => n.k === "cta" || n.k === "mod");
  const put = (mod: Mod, share: number) => {
    const hs = heads();
    if (!hs.length) return;
    const want = Math.round((out.length - 1) * share);
    const order = [...hs].sort((a, b) => Math.abs(a - want) - Math.abs(b - want));
    const at = order.find((h) => !nearCta(h)) ?? order[0];
    out.splice(at, 0, { k: "mod", name: mod });
  };
  if (!has("CHECK")) {
    const firstP = out.findIndex((n) => n.k === "p");
    out.splice(firstP >= 0 ? firstP + 1 : 0, 0, { k: "mod", name: "CHECK" });
  }
  if (!has("PROOF")) put("PROOF", 0.4);
  if (!hasTool) put(tool, 0.7);
  return out;
}

function Checklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div className="my-10 rounded-[20px] bg-[#f5f5f7] p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-4 px-1">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Zum Abhaken</p>
        <p className="text-[0.9rem] font-bold tabular-nums text-[#0e0e10]">
          {count} <span className="text-[#86868b]">von {items.length}</span>
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[#007aff] transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)]" style={{ width: `${(count / items.length) * 100}%` }} />
      </div>
      <ul className="mt-4 grid gap-1.5">
        {items.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={!!done[i]}
              onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
              className="flex w-full items-start gap-3.5 rounded-[12px] bg-white p-3.5 text-left transition-transform active:scale-[0.99]"
            >
              <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-[7px] border-2 transition-colors duration-300 ${done[i] ? "border-[#007aff] bg-[#007aff] text-white" : "border-[#d8dde7] text-transparent"}`}>
                <Check size={14} strokeWidth={3} />
              </span>
              <span className={`text-[1rem] font-medium leading-[1.45] transition-colors ${done[i] ? "text-[#0e0e10]" : "text-[#424245]"}`}>{inline(it)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  // a column for nüll. or a specialist agency is the recommended one: tint it
  const rec = head.findIndex((c) => /spezialagentur|nüll/i.test(c));
  const plain = (t: string) => inline(t.replace(/\*\*/g, ""));
  return (
    <div className="my-10 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <table className="w-full min-w-[560px] border-separate border-spacing-0 overflow-hidden rounded-[16px] text-left ring-1 ring-black/[0.08]">
        <thead>
          <tr>
            {head.map((c, i) => (
              <th key={i} className={`px-4 py-3.5 text-[0.82rem] font-bold tracking-[-0.01em] ${i === rec ? "bg-[#007aff] text-white" : "bg-[#f5f5f7] text-[#0e0e10]"}`}>
                {plain(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`border-t border-black/[0.07] px-4 py-3.5 align-top text-[0.95rem] leading-[1.45] ${ci === 0 ? "font-semibold text-[#0e0e10]" : ci === rec ? "bg-[#007aff]/[0.05] font-semibold text-[#0e0e10]" : "font-medium text-[#424245]"}`}
                >
                  {plain(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Body({ nodes, post }: { nodes: Node[]; post: BlogPost }) {
  const firstP = nodes.findIndex((n) => n.k === "p");
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.k) {
          case "h2":
            return (
              <h2 key={i} id={n.id} className="mt-16 scroll-mt-28 text-[clamp(1.65rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0e0e10] first:mt-0">
                {n.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-10 text-[1.3rem] font-bold leading-[1.2] tracking-[-0.035em] text-[#0e0e10]">
                {inline(n.text)}
              </h3>
            );
          case "p":
            return (
              <p key={i} className={`mt-5 font-medium leading-[1.7] tracking-[-0.011em] ${i === firstP ? "text-[1.2rem] text-[#0e0e10]" : "text-[1.08rem] text-[#424245]"}`}>
                {inline(n.text)}
              </p>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-8 border-l-[3px] border-[#007aff] pl-5 text-[1.15rem] font-semibold leading-[1.55] tracking-[-0.02em] text-[#0e0e10]">
                {inline(n.text)}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="mt-5 grid gap-2.5">
                {n.items.map((it, j) => (
                  <li key={j} className="flex gap-3.5 text-[1.08rem] font-medium leading-[1.6] text-[#424245]">
                    <span aria-hidden className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-[#007aff]" />
                    <span>{inline(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-5 grid gap-3">
                {n.items.map((it, j) => (
                  <li key={j} className="flex gap-3.5 text-[1.08rem] font-medium leading-[1.6] text-[#424245]">
                    <span className="mt-[0.1em] grid h-7 w-7 flex-none place-items-center rounded-full bg-[#007aff]/10 text-[0.82rem] font-bold tabular-nums text-[#007aff]">{it.n}</span>
                    <span>{inline(it.text)}</span>
                  </li>
                ))}
              </ol>
            );
          case "check":
            return <Checklist key={i} items={n.items} />;
          case "table":
            return <Table key={i} head={n.head} rows={n.rows} />;
          case "compare":
            return (
              <div key={i} className="my-8 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-[18px] bg-[#f5f5f7] p-5">
                  <p className="flex items-center gap-2 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#86868b]">
                    <X size={14} strokeWidth={3} /> Lieber nicht
                  </p>
                  <p className="mt-3 text-[1.08rem] font-semibold leading-[1.4] tracking-[-0.02em] text-[#86868b]">„{n.before}“</p>
                </div>
                <div className="rounded-[18px] bg-[#007aff]/[0.07] p-5 ring-1 ring-[#007aff]/20">
                  <p className="flex items-center gap-2 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#007aff]">
                    <Check size={14} strokeWidth={3} /> Besser so
                  </p>
                  <p className="mt-3 text-[1.08rem] font-bold leading-[1.4] tracking-[-0.02em] text-[#0e0e10]">„{n.after}“</p>
                </div>
              </div>
            );
          case "img":
            return (
              <figure key={i} className="my-10">
                <img src={n.src} alt={n.label} loading="lazy" className="w-full rounded-[16px] ring-1 ring-black/[0.08]" />
                {n.label && <figcaption className="mt-3 text-[0.88rem] font-medium text-[#6b7280]">{n.label}</figcaption>}
              </figure>
            );
          case "cta": {
            const s = CTA_SERVICES[n.key] ?? CTA_SERVICES.web;
            return (
              <aside key={i} className="my-12 overflow-hidden rounded-[20px] bg-[#007aff] p-6 text-white shadow-[0_18px_44px_rgba(0,122,255,0.25)] sm:p-8">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-white/70">{s.label} mit nüll.</p>
                <p className="mt-3 max-w-[26ch] text-[clamp(1.4rem,2.4vw,1.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-white">{n.headline ?? s.headline}</p>
                <p className="mt-3 max-w-[48ch] text-[0.98rem] font-medium leading-[1.5] text-white/85">{s.cta}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a href="#contact" onClick={() => trackBlog("form_cta", `mid-${n.key}`, post.slug)} className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white px-5 text-[0.76rem] font-black uppercase tracking-[0.12em] text-[#007aff] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                    Anfrage starten <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a href={s.href} className="border-b-2 border-white/80 pb-0.5 text-[0.95rem] font-black tracking-[-0.03em] text-white transition-opacity hover:opacity-70">
                    Mehr zu {s.label}
                  </a>
                </div>
                <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/20 pt-4 text-[0.9rem] font-semibold text-white/85">
                  Oder direkt:
                  <a href={waLink(post)} target="_blank" rel="noopener noreferrer" onClick={() => trackBlog("whatsapp_click", `mid-${n.key}`, post.slug)} className="underline decoration-white/40 underline-offset-[3px] hover:decoration-white">WhatsApp</a>
                  <a href={`tel:${PHONE}`} onClick={() => trackBlog("phone_click", `mid-${n.key}`, post.slug)} className="underline decoration-white/40 underline-offset-[3px] hover:decoration-white">Anrufen</a>
                  <a href="#website-check" data-source={`blog:${post.slug}:mid-${n.key}`} onClick={() => trackBlog("check_cta", `mid-${n.key}`, post.slug)} className="underline decoration-white/40 underline-offset-[3px] hover:decoration-white">Gratis Website-Check</a>
                </p>
              </aside>
            );
          }
          case "mod":
            if (n.name === "CHECK") return <CheckStrip key={i} post={post} />;
            if (n.name === "PROOF") return <ProofRow key={i} post={post} />;
            if (n.name === "SELFTEST") return <SelfTest key={i} post={post} />;
            if (n.name === "CALC") return <InquiryCalc key={i} post={post} />;
            return <ContactBand key={i} post={post} where="inline" />;
          case "visual":
            if (n.name === "PROVIDERS_CAROUSEL") return post.providers?.length ? <ProviderEditorialList key={i} providers={post.providers} /> : null;
            if (n.name === "BFSG_VISUAL") return <BFSGVisual key={i} />;
            if (n.name === "DSGVO_VISUAL") return <DsgvoVisual key={i} />;
            if (n.name === "POSITIVBEISPIEL") return <PositivbeispielBlock key={i} />;
            if (n.name === "METHODEN_QUICK") return <MethodenQuick key={i} />;
            return null;
        }
      })}
    </>
  );
}

// Highlights the section being read in the contents list.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (ids.length === 0) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Faqs({ faqs, title }: { faqs: { question: string; answer: string }[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <section className="mt-20" aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-[clamp(1.65rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0e0e10]">
        {(title ?? "Häufige Fragen").replace(/\s*\(FAQ\)\s*$/, "")}
      </h2>
      <div className="mt-6 border-t border-black/[0.08]">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-black/[0.08]">
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span className="text-[1.08rem] font-bold leading-[1.35] tracking-[-0.025em] text-[#0e0e10]">{f.question}</span>
              <ChevronDown size={20} strokeWidth={2.4} className={`mt-0.5 flex-none text-[#007aff] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-10 text-[1.02rem] font-medium leading-[1.65] text-[#424245]">{inline(f.answer)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

// Related articles: same audience first (Kanzlei with Kanzlei), then same service, then the rest.
const relScore = (p: BlogPost, cur: BlogPost) => (postAudience(p) && postAudience(p) === postAudience(cur) ? 2 : 0) + (postService(p).label === postService(cur).label ? 1 : 0);

// Legal and health topics get a visible note: general information, not advice
const NEEDS_NOTE = /kanzlei|anwael|rechtsanw|steuerberater|praxis|arztpraxen|zahnarzt|impressum|dsgvo|datenschutz|heilmittel|cookie|whatsapp|agenturvertrag|barrierefreiheit|43b/i;

function ShareButton({ title }: { title: string }) {
  const [state, setState] = useState<"idle" | "done">("idle");
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await navigator.clipboard.writeText(url);
      setState("done");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      /* closed share sheet or no clipboard: nothing to do */
    }
  };
  return (
    <button type="button" onClick={share} aria-live="polite" className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-[#6b7280] transition-colors hover:text-[#0e0e10]">
      {state === "done" ? <Check size={15} strokeWidth={2.6} className="text-[#007aff]" /> : <Link2 size={15} strokeWidth={2.4} />}
      {state === "done" ? "Link kopiert" : "Teilen"}
    </button>
  );
}

export default function BlogArticleV2({ post }: { post: BlogPost }) {
  const reduce = useReducedMotion();
  const all = useMemo(() => post.content, [post]);
  // a quote as the very first block is the summary box
  const summary = all[0]?.startsWith("> ") ? all[0].slice(2).replace(/\*\*(Zusammenfassung|Key Takeaways):\*\*/i, "").trim() : null;
  const service = postService(post);
  const nodes = useMemo(() => planModules(parse(summary ? all.slice(1) : all), service.label), [all, summary, service.label]);
  const toc = nodes.filter((n): n is Extract<Node, { k: "h2" }> => n.k === "h2");
  const ids = useMemo(() => toc.map((t) => t.id), [toc]);
  const active = useActiveSection(ids);
  const [tocOpen, setTocOpen] = useState(false);
  const related = dePosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => relScore(b, post) - relScore(a, post))
    .slice(0, 3);
  const rise = reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE } };

  const url = `${LIVE}/blog/${post.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        author: { "@type": "Organization", "@id": `${LIVE}/#organization`, name: "nüll.", url: LIVE },
        publisher: { "@type": "Organization", "@id": `${LIVE}/#organization`, name: "nüll.", url: LIVE, logo: { "@type": "ImageObject", url: `${LIVE}/apple-touch-icon.png`, width: 180, height: 180 } },
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "de-DE",
        articleSection: post.category,
        image: { "@type": "ImageObject", url: `${LIVE}${cover(post)}`, width: 1536, height: 1024 },
        isPartOf: { "@id": `${LIVE}/#website` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: `${LIVE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${LIVE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
  const faqLd = post.faqs?.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }
    : null;

  return (
    <>
      <StructuredData data={ld} />
      {faqLd && <StructuredData data={faqLd} />}
      <div className="bg-white">
        <NavBar onHome={false} current={BLOG} />
      </div>
      <main className="bg-white text-[#0e0e10]">
        <article>
          {/* header */}
          <motion.header {...rise} className="mx-auto w-full max-w-[1100px] px-4 pt-8 md:px-8 md:pt-14">
            <a href={BLOG} className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-[#6b7280] transition-colors hover:text-[#0e0e10]">
              <ArrowLeft size={16} strokeWidth={2.4} /> Alle Artikel
            </a>
            <p className="mt-8 text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff] md:mt-10">{postTag(post)}</p>
            <h1 className="mt-4 max-w-[22ch] text-[clamp(2.1rem,5.2vw,4.3rem)] font-bold leading-[0.98] tracking-[-0.055em]">{post.title}</h1>
            <p className="mt-6 max-w-[60ch] text-[1.12rem] font-medium leading-[1.5] tracking-[-0.02em] text-[#424245] md:text-[1.2rem]">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9rem] font-semibold text-[#6b7280]">
              <span>{fmtDate(post.date)}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-[#c7c9cf]" />
              <span>{fmtRead(post.readTime)}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-[#c7c9cf]" />
              <ShareButton title={post.title} />
            </div>
          </motion.header>

          <motion.div {...rise} transition={{ duration: 0.9, delay: reduce ? 0 : 0.1, ease: EASE }} className="mx-auto mt-10 w-full max-w-[1100px] px-4 md:mt-14 md:px-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#f5f5f7] md:aspect-[2/1] md:rounded-[24px]">
              <img src={cover(post)} alt={post.title} width={1536} height={1024} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </motion.div>

          <div className="mx-auto grid w-full max-w-[1100px] gap-12 px-4 pb-8 pt-10 md:px-8 md:pt-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
            <div className="min-w-0 max-w-[700px]">
              {/* phones and tablets: contents behind one button */}
              {toc.length > 2 && (
                <div className="mb-10 rounded-[16px] bg-[#f5f5f7] lg:hidden">
                  <button type="button" aria-expanded={tocOpen} onClick={() => setTocOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                    <span className="text-[0.98rem] font-bold tracking-[-0.02em]">
                      Inhalt <span className="font-semibold text-[#86868b]">· {toc.length} Abschnitte</span>
                    </span>
                    <ChevronDown size={20} strokeWidth={2.4} className={`text-[#007aff] transition-transform duration-300 ${tocOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {tocOpen && (
                      <motion.ol
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                        className="overflow-hidden px-4"
                      >
                        {toc.map((t, i) => (
                          <li key={t.id} className="border-t border-black/[0.06] first:border-t-0">
                            <a href={`#${t.id}`} onClick={() => setTocOpen(false)} className="flex gap-3 py-2.5 text-[0.95rem] font-semibold leading-[1.3] text-[#424245]">
                              <span className="w-5 flex-none tabular-nums text-[#a1a1a6]">{i + 1}</span>
                              {t.text}
                            </a>
                          </li>
                        ))}
                        <li className="h-2" aria-hidden />
                      </motion.ol>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {NEEDS_NOTE.test(post.slug) && (
                <p className="mb-6 rounded-[14px] bg-[#f5f5f7] px-4 py-3 text-[0.92rem] font-medium leading-[1.5] text-[#424245]">
                  <strong className="font-bold text-[#0e0e10]">Allgemeine Information, keine Rechts- oder Fachberatung.</strong> Stand: {new Date(post.date).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}. Gesetze und Rechtsprechung ändern sich, prüf den aktuellen Stand und lass Einzelfälle von einer fachkundigen Person beurteilen.
                </p>
              )}

              {summary && (
                <div className="mb-12 rounded-[20px] bg-[#007aff]/[0.06] p-5 ring-1 ring-[#007aff]/15 sm:p-6">
                  <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Kurz gesagt</p>
                  <p className="mt-3 text-[1.08rem] font-semibold leading-[1.55] tracking-[-0.02em] text-[#0e0e10]">{inline(summary)}</p>
                </div>
              )}

              <Body nodes={nodes} post={post} />

              {/* direct contact before the FAQ, unless the post placed its own */}
              {!nodes.some((n) => n.k === "mod" && n.name === "CONTACT") && <ContactBand post={post} where="after-article" />}

              {post.faqs && post.faqs.length > 0 && <Faqs faqs={post.faqs} title={post.faqTitle} />}

              {/* end of article: the matching service, three ways to get in touch, and the free check */}
              <div className="mt-20 overflow-hidden rounded-[24px] bg-[#0e0e10] p-7 text-white sm:p-10">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#5aa9ff]">{service.label} mit nüll.</p>
                <p className="mt-4 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.05em] text-white">
                  Willst du das für deinen Betrieb<span className="text-[#007aff]">?</span>
                </p>
                <p className="mt-4 max-w-[46ch] text-[1.02rem] font-medium leading-[1.5] text-white/70">{service.cta}</p>
                <div className="mt-7">
                  <ContactButtons post={post} where="end" dark />
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
                  <a href="#website-check" data-source={`blog:${post.slug}:end`} onClick={() => trackBlog("check_cta", "end", post.slug)} className="border-b-2 border-white pb-0.5 text-[1rem] font-black tracking-[-0.04em] text-white transition-opacity hover:opacity-60">
                    Erst mal gratis prüfen lassen
                  </a>
                  <a href={service.href} className="text-[0.95rem] font-semibold text-white/70 underline decoration-white/30 underline-offset-[3px] transition-colors hover:text-white">
                    Mehr zu {service.label}
                  </a>
                </div>
              </div>
            </div>

            {/* desktop: contents and the service card stay in view */}
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                {toc.length > 0 && (
                  <nav aria-label="Inhalt">
                    <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#86868b]">Inhalt</p>
                    <ol className="mt-4 grid max-h-[50vh] gap-0.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
                      {toc.map((t) => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            aria-current={active === t.id ? "location" : undefined}
                            className={`block border-l-2 py-1.5 pl-3.5 text-[0.88rem] font-semibold leading-[1.3] transition-colors duration-300 ${active === t.id ? "border-[#007aff] text-[#0e0e10]" : "border-black/[0.08] text-[#86868b] hover:text-[#0e0e10]"}`}
                          >
                            {t.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <SidebarLead post={post} />
              </div>
            </aside>
          </div>
        </article>

        {/* more articles */}
        <section className="border-t border-black/[0.06] bg-white py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.06em]">
                Weiterlesen<span className="text-[#007aff]">.</span>
              </h2>
              <a href={BLOG} className="border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
                Alle Artikel
              </a>
            </div>
            <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              {related.map((p) => (
                <div key={p.slug} className="w-[82%] flex-none snap-start md:w-auto">
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactV2 />
      </main>
      <StickyBar post={post} />
      <FooterV2 onHome={false} />
    </>
  );
}

