import { ArrowUpRight } from "lucide-react";
import type { CaseEntry } from "./caseList";

/*
 * Client tile for the phone bento (/referenzen and the city pages): the photo carries the tile,
 * with a small white label (name, place) in the corner and an arrow to the case study. No text blocks.
 * wide: spans both columns (16:10); otherwise a square.
 */
export default function CaseTile({ c, place, wide = false }: { c: CaseEntry; place?: string; wide?: boolean }) {
  const body = (
    <>
      <img src={c.img} alt={c.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {c.page && (
        <span aria-hidden className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#0e0e10]">
          <ArrowUpRight size={15} strokeWidth={2.6} />
        </span>
      )}
      <span className="absolute bottom-2.5 left-2.5 block w-fit max-w-[calc(100%-1.25rem)] rounded-[12px] bg-white/95 px-3 py-2 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.5)]">
        <span className={`block font-bold leading-tight tracking-[-0.025em] text-[#0e0e10] ${wide ? "text-[0.98rem]" : "line-clamp-2 text-[0.84rem]"}`}>{c.client}</span>
        <span className="mt-0.5 block truncate text-[0.7rem] font-semibold text-[#6b7280]">{place ?? c.place}</span>
      </span>
    </>
  );
  const cls = `relative block overflow-hidden rounded-[18px] bg-[#eef0f3] ${wide ? "col-span-2 aspect-[16/10]" : "aspect-square"}`;
  return c.page ? (
    <a href={c.page} aria-label={`Referenz ansehen: ${c.client}`} className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
