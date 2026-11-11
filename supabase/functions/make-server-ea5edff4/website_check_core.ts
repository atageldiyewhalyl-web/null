/*
 * Website-Check: the checks and the score. No Deno or npm imports, only fetch, so the same file runs
 * in the edge function and in Node for local tests (scripts/website-check-test.ts).
 *
 * Sources:
 *  - Google PageSpeed Insights API v5 (Lighthouse lab data + CrUX field data when Google has it)
 *  - Our own fetch of the homepage (contact options, basics, Impressum/Datenschutz links, cookie banner)
 *  - Google Places API (New) Text Search: is there a business profile that links to this website?
 *
 * Legal items are reported as "gefunden / nicht gefunden" (found / not found) only, never as a legal verdict.
 */

export type Status = "ok" | "warn" | "fail" | "info";
export type AreaKey = "speed" | "seo" | "contact" | "local" | "legal" | "a11y";

export type Check = {
  id: string;
  area: AreaKey;
  status: Status;
  title: string; // short German result line
  detail: string; // why it matters / what to do (German, "du")
  impact: 1 | 2 | 3; // 3 = costs enquiries directly
  score?: number; // 0..1, overrides the status mapping for the area score
  weight?: number; // default 1
};

export type Area = { key: AreaKey; label: string; score: number | null; note?: string };

/* Websites nüll. built (from the case studies, app/components/v2/caseList.ts + app/routes/v2-referenz-*.tsx).
   The report shows a "Gebaut von nüll." badge with the real score. Scores are never changed for these sites.
   Orchidee is missing: its case study lists no website. */
export const BUILT_BY_NULL: Record<string, { client: string; slug: string | null }> = {
  "nuell-agentur.com": { client: "nüll.", slug: null },
  "xn--nll-hoa.com": { client: "nüll.", slug: null },
  "waschbar.eu": { client: "Waschbar", slug: "waschbar" },
  "keramiksan.de": { client: "Bergstone Keramiksan", slug: "bergstone" },
  "treu-haustechnik.de": { client: "Treu Haustechnik", slug: "treu" },
  "umzuege-herkules.de": { client: "Herkules Umzüge", slug: "herkules" },
  "hasandogru.de": { client: "Avukat Hasan Doğru", slug: "dogru" },
  "sg-laserzentrum.de": { client: "SG Laserzentrum", slug: "sg" },
  "beautyso.de": { client: "S&O Beauty", slug: "so" },
  "ftsicherheitstechnik.com": { client: "FT Sicherheitstechnik", slug: "ft" },
  "onkel-abwassertechnik.de": { client: "Onkel Abwassertechnik", slug: "onkel" },
  "besiryaman-mentoring.de": { client: "B.Y. Consulting", slug: "by" },
};

export type CheckResult = {
  inputUrl: string;
  finalUrl: string | null;
  host: string | null;
  reachable: boolean;
  score: number | null;
  band: "gut" | "ausbaufaehig" | "kritisch" | null;
  areas: Area[];
  checks: Check[];
  top: Check[];
  pagespeed: { mobile: PsiSummary | null; desktop: PsiSummary | null; error?: string };
  places: PlacesSummary | null;
  businessName: string | null;
  builtBy: { client: string; slug: string | null } | null;
  measuredScore: number | null; // the real score; differs from `score` only for nüll.-built sites
  durationMs: number;
  checkedAt: string;
};

export type PsiSummary = {
  performance: number | null;
  accessibility: number | null;
  seo: number | null;
  bestPractices: number | null;
  lcpMs: number | null;
  cls: number | null;
  tbtMs: number | null;
  field: { lcpMs: number | null; inpMs: number | null; cls: number | null } | null;
  opportunities: { title: string; savingsMs: number }[];
};

export type PlacesSummary = {
  queried: string[];
  match: { name: string; rating: number | null; reviews: number | null; mapsUrl: string | null; address: string | null } | null;
  error?: string;
};

export type CheckEnv = { pagespeedKey?: string; placesKey?: string; fetchImpl?: typeof fetch };

export const AREA_LABELS: Record<AreaKey, string> = {
  speed: "Ladezeit",
  seo: "Google-Grundlagen",
  contact: "Anfragen",
  local: "Google-Unternehmensprofil",
  legal: "Pflichtseiten & Technik",
  a11y: "Barrierefreiheit",
};
// Hygiene areas (legal, a11y) count little: almost every site passes them. Enquiry paths and speed count most.
const AREA_WEIGHTS: Record<AreaKey, number> = { speed: 22, seo: 20, contact: 25, local: 15, legal: 8, a11y: 5 };
export const AREA_ORDER: AreaKey[] = ["contact", "speed", "seo", "local", "legal", "a11y"];

const UA = "Mozilla/5.0 (compatible; nuell-website-check/1.0; +https://nuell-agentur.com/website-check)";

/* ---------------- URL safety ---------------- */

export function normalizeUrl(raw: string): URL | null {
  let s = String(raw ?? "").trim();
  if (!s || s.length > 300) return null;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (!isPublicHost(u)) return null;
  u.hash = "";
  return u;
}

// Blocks localhost, private/link-local IPs, internal names and odd ports, so the check can't be pointed at our own network.
export function isPublicHost(u: URL): boolean {
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  if (u.username || u.password) return false;
  if (u.port && u.port !== "80" && u.port !== "443") return false;
  const h = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!h.includes(".")) return false;
  if (h.startsWith("[") || h.includes(":")) return false; // IPv6 literal
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return false; // IPv4 literal: real businesses use a domain
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid|example)$/.test(h)) return false;
  if (!/^[a-z0-9.-]+$/.test(h)) return false; // punycode only; new URL() already converts umlaut domains
  return true;
}

async function withTimeout<T>(ms: number, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await run(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

type Fetched = { url: URL; status: number; html: string; ms: number; redirects: number; headers: Headers };

// Follows redirects by hand so every hop is checked against isPublicHost.
async function fetchPage(start: URL, f: typeof fetch, maxBytes = 2_000_000): Promise<Fetched> {
  let url = start;
  const t0 = Date.now();
  for (let hop = 0; hop <= 5; hop++) {
    const res = await withTimeout(15_000, (signal) =>
      f(url.toString(), { redirect: "manual", signal, headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "de-DE,de;q=0.9" } }),
    );
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const next = new URL(res.headers.get("location")!, url);
      await res.body?.cancel().catch(() => {});
      if (!isPublicHost(next)) throw new Error("redirect to a non-public host");
      url = next;
      continue;
    }
    const html = await readCapped(res, maxBytes);
    return { url, status: res.status, html, ms: Date.now() - t0, redirects: hop, headers: res.headers };
  }
  throw new Error("too many redirects");
}

async function readCapped(res: Response, maxBytes: number): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  await reader.cancel().catch(() => {});
  const buf = new Uint8Array(Math.min(total, maxBytes));
  let off = 0;
  for (const c of chunks) {
    const take = Math.min(c.length, buf.length - off);
    buf.set(c.subarray(0, take), off);
    off += take;
    if (off >= buf.length) break;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(buf);
}

async function exists(url: URL, f: typeof fetch, maxChars = 20_000): Promise<{ ok: boolean; body: string }> {
  try {
    return await withTimeout(8_000, async (signal) => {
      const res = await f(url.toString(), { redirect: "follow", signal, headers: { "User-Agent": UA } });
      const body = res.ok ? (await res.text()).slice(0, maxChars) : "";
      return { ok: res.ok, body };
    });
  } catch {
    return { ok: false, body: "" };
  }
}

/* ---------------- HTML helpers (regex: no DOM in the edge runtime) ---------------- */

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (s: string) => decode(s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));

function metaContent(html: string, key: string): string | null {
  const re = new RegExp(`<meta\\b[^>]*(?:name|property)\\s*=\\s*["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  const c = tag.match(/content\s*=\s*("([^"]*)"|'([^']*)')/i);
  return c ? decode(c[2] ?? c[3] ?? "") : "";
}

type Link = { href: string; text: string };
function links(html: string): Link[] {
  const out: Link[] = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < 2000) {
    const href = m[1].match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const label = m[1].match(/aria-label\s*=\s*("([^"]*)"|'([^']*)')/i);
    out.push({ href: decode(href ? href[2] ?? href[3] ?? href[4] ?? "" : ""), text: stripTags(m[2]) || decode(label?.[2] ?? label?.[3] ?? "") });
  }
  return out;
}

function jsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch {
      /* broken JSON-LD counts as missing */
    }
  }
  return out;
}

function schemaNodes(blocks: unknown[]): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (o["@type"]) nodes.push(o);
      if (o["@graph"]) walk(o["@graph"]);
    }
  };
  blocks.forEach(walk);
  return nodes;
}

const BUSINESS_TYPES =
  /LocalBusiness|Organization|Corporation|ProfessionalService|HomeAndConstructionBusiness|Electrician|Plumber|HVACBusiness|RoofingContractor|GeneralContractor|HousePainter|Locksmith|MovingCompany|AutoRepair|Attorney|LegalService|Dentist|Physician|MedicalClinic|BeautySalon|HairSalon|Restaurant|Store|Store$|Notary|AccountingService|RealEstateAgent|Florist|Bakery|CleaningService|Contractor/;

const typesOf = (n: Record<string, unknown>) => ([] as unknown[]).concat(n["@type"] ?? []).map(String);
const isLocal = (n: Record<string, unknown>) => typesOf(n).some((t) => BUSINESS_TYPES.test(t) && t !== "Organization" && t !== "Corporation");
const isOrg = (n: Record<string, unknown>) => typesOf(n).some((t) => BUSINESS_TYPES.test(t));

// Known consent tools (script hosts or markers). Presence = "Cookie-Banner gefunden".
const CMP =
  /cookiebot|usercentrics|borlabs|complianz|cookieyes|cookie-law-info|onetrust|klaro|consentmanager|ccm19|real-cookie-banner|iubenda|termly|cookiefirst|cookie-script|didomi|quantcast|osano|axeptio|tarteaucitron|cookieconsent|cookie-notice|moove_gdpr|cmplz|gdpr-cookie|cookie_banner|cookie-banner|cookiebanner|consent-banner|data-cookieconsent/i;
const TRACKERS: [RegExp, string][] = [
  [/googletagmanager\.com\/gtag\/js|google-analytics\.com\/(analytics|ga)\.js|gtag\(\s*['"]config['"]\s*,\s*['"]G-/i, "Google Analytics"],
  [/googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{4,}/i, "Google Tag Manager"],
  [/connect\.facebook\.net|fbq\(\s*['"]init/i, "Meta Pixel"],
  [/googleadservices\.com|gtag\(\s*['"]config['"]\s*,\s*['"]AW-/i, "Google Ads"],
  [/static\.hotjar\.com|hotjar/i, "Hotjar"],
  [/analytics\.tiktok\.com/i, "TikTok Pixel"],
  [/snap\.licdn\.com/i, "LinkedIn Insight"],
];

/* ---------------- PageSpeed ---------------- */

async function pagespeed(url: string, strategy: "mobile" | "desktop", key: string | undefined, f: typeof fetch): Promise<PsiSummary> {
  const q = new URLSearchParams({ url, strategy, locale: "de" });
  for (const c of ["performance", "accessibility", "seo", "best-practices"]) q.append("category", c);
  if (key) q.set("key", key);
  const res = await withTimeout(70_000, (signal) => f(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal }));
  if (!res.ok) throw new Error(`PageSpeed ${strategy} ${res.status}`);
  // deno-lint-ignore no-explicit-any
  const data: any = await res.json();
  const lh = data.lighthouseResult ?? {};
  const cat = lh.categories ?? {};
  const audits = lh.audits ?? {};
  const s = (k: string) => (typeof cat[k]?.score === "number" ? Math.round(cat[k].score * 100) : null);
  const n = (k: string) => (typeof audits[k]?.numericValue === "number" ? audits[k].numericValue : null);
  const fm = data.loadingExperience?.metrics;
  const field = fm
    ? {
        lcpMs: fm.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
        inpMs: fm.INTERACTION_TO_NEXT_POINT?.percentile ?? null,
        cls: typeof fm.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile === "number" ? fm.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : null,
      }
    : null;
  const opportunities = Object.values(audits)
    // deno-lint-ignore no-explicit-any
    .filter((a: any) => a?.details?.type === "opportunity" && (a.details.overallSavingsMs ?? 0) >= 300 && (a.score ?? 1) < 0.9)
    // deno-lint-ignore no-explicit-any
    .map((a: any) => ({ title: String(a.title), savingsMs: Math.round(a.details.overallSavingsMs) }))
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, 4);
  return {
    performance: s("performance"),
    accessibility: s("accessibility"),
    seo: s("seo"),
    bestPractices: s("best-practices"),
    lcpMs: n("largest-contentful-paint"),
    cls: n("cumulative-layout-shift"),
    tbtMs: n("total-blocking-time"),
    field: field && (field.lcpMs || field.inpMs || field.cls !== null) ? field : null,
    opportunities,
  };
}

/* ---------------- Places ---------------- */

const rootHost = (h: string) => h.toLowerCase().replace(/^www\./, "");

async function places(queries: string[], host: string, key: string, f: typeof fetch): Promise<PlacesSummary> {
  const summary: PlacesSummary = { queried: [], match: null };
  for (const textQuery of queries) {
    summary.queried.push(textQuery);
    const res = await withTimeout(10_000, (signal) =>
      f("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri",
        },
        body: JSON.stringify({ textQuery, languageCode: "de", regionCode: "DE", pageSize: 5 }),
      }),
    );
    if (!res.ok) throw new Error(`Places ${res.status}`);
    // deno-lint-ignore no-explicit-any
    const data: any = await res.json();
    // deno-lint-ignore no-explicit-any
    const hit = (data.places ?? []).find((p: any) => {
      try {
        return p.websiteUri && rootHost(new URL(p.websiteUri).hostname) === rootHost(host);
      } catch {
        return false;
      }
    });
    if (hit) {
      summary.match = {
        name: hit.displayName?.text ?? textQuery,
        rating: typeof hit.rating === "number" ? hit.rating : null,
        reviews: typeof hit.userRatingCount === "number" ? hit.userRatingCount : null,
        mapsUrl: hit.googleMapsUri ?? null,
        address: hit.formattedAddress ?? null,
      };
      return summary;
    }
  }
  return summary;
}

/* ---------------- sitemap: how many pages does the site tell Google about? ---------------- */

const countUrls = (xml: string) => (xml.match(/<url\b/gi) ?? []).length;
const locs = (xml: string) => [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\s\]]+)/gi)].map((m) => m[1]);

async function sitemapPageCount(start: URL, body: string, f: typeof fetch): Promise<number | null> {
  if (/<urlset\b/i.test(body)) return countUrls(body);
  if (!/<sitemapindex\b/i.test(body)) return null;
  // Index: follow up to 8 child sitemaps on the same site.
  const children = locs(body)
    .map((u) => {
      try {
        return new URL(u, start);
      } catch {
        return null;
      }
    })
    .filter((u): u is URL => !!u && isPublicHost(u) && rootHost(u.hostname) === rootHost(start.hostname))
    .slice(0, 8);
  const bodies = await Promise.all(children.map((u) => exists(u, f, 3_000_000)));
  return bodies.reduce((n, b) => n + (b.ok ? countUrls(b.body) : 0), 0);
}

/* ---------------- the check ---------------- */

export type CheckInput = { url: string; trade?: string; city?: string };

export async function runWebsiteCheck(input: CheckInput, env: CheckEnv = {}): Promise<CheckResult> {
  const f = env.fetchImpl ?? fetch;
  const t0 = Date.now();
  const start = normalizeUrl(input.url);
  const result: CheckResult = {
    inputUrl: input.url,
    finalUrl: null,
    host: start?.hostname ?? null,
    reachable: false,
    score: null,
    band: null,
    areas: [],
    checks: [],
    top: [],
    pagespeed: { mobile: null, desktop: null },
    places: null,
    businessName: null,
    builtBy: BUILT_BY_NULL[start?.hostname.toLowerCase().replace(/^www\./, "") ?? ""] ?? null,
    measuredScore: null,
    durationMs: 0,
    checkedAt: new Date().toISOString(),
  };
  if (!start) throw new Error("invalid url");

  // PageSpeed runs in parallel with everything else; it is the slow part (20–60 s).
  const psiPromise = Promise.allSettled([pagespeed(start.toString(), "mobile", env.pagespeedKey, f), pagespeed(start.toString(), "desktop", env.pagespeedKey, f)]);

  let page: Fetched | null = null;
  let fetchError = "";
  try {
    page = await fetchPage(start, f);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }
  // Some sites only answer on www. or only on http.
  if ((!page || page.status >= 400) && !start.hostname.startsWith("www.")) {
    try {
      const alt = new URL(start.toString());
      alt.hostname = `www.${start.hostname}`;
      const p2 = await fetchPage(alt, f);
      if (p2.status < 400) page = p2;
    } catch {
      /* keep the first error */
    }
  }

  const add = (c: Check) => result.checks.push(c);

  if (!page || page.status >= 400) {
    result.checks.push({
      id: "reachable",
      area: "legal",
      status: "fail",
      title: "Website nicht erreichbar",
      detail: page ? `Deine Startseite antwortet mit Fehler ${page.status}. Besucher und Google sehen dann nichts.` : `Wir konnten deine Startseite nicht laden (${fetchError || "keine Antwort"}).`,
      impact: 3,
    });
    await psiPromise; // let it settle so nothing keeps running
    return finish(result, t0);
  }

  // Parked / placeholder domains (STRATO, IONOS, Sedo …): no real website to check.
  const pageTitle = decode(page.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (/domain (reserved|reserviert|parked|geparkt|is for sale|steht zum verkauf)|parked domain|baustelle|coming soon|under construction|website in arbeit|hier entsteht/i.test(`${pageTitle} ${stripTags(page.html).slice(0, 600)}`) && stripTags(page.html).length < 3000) {
    result.finalUrl = page.url.toString();
    result.checks.push({ id: "reachable", area: "legal", status: "fail", title: "Unter dieser Adresse ist keine fertige Website", detail: `Die Seite zeigt nur einen Platzhalter („${pageTitle.slice(0, 80) || "ohne Titel"}“). Prüf, ob die Adresse stimmt.`, impact: 3 });
    await psiPromise;
    return finish(result, t0);
  }

  result.reachable = true;
  result.finalUrl = page.url.toString();
  result.builtBy = BUILT_BY_NULL[page.url.hostname.toLowerCase().replace(/^www\./, "")] ?? result.builtBy;
  result.host = page.url.hostname;
  const html = page.html;
  const lower = html.toLowerCase();
  const all = links(html);
  const text = stripTags(html);
  const nodes = schemaNodes(jsonLd(html));

  /* contact */
  const tel = all.find((l) => /^tel:/i.test(l.href));
  const phoneInText = /(\+49|0049|\(0\d{2,5}\)|\b0\d{2,5})[\s/-]?\d[\d\s/-]{4,}\d/.test(text);
  add(
    tel
      ? { id: "tel", area: "contact", status: "ok", title: "Telefonnummer zum Antippen gefunden", detail: "Auf dem Handy reicht ein Tipp, und der Anruf startet.", impact: 3, weight: 3 }
      : phoneInText
        ? { id: "tel", area: "contact", status: "warn", title: "Telefonnummer steht da, ist aber nicht antippbar", detail: "Mach daraus einen tel:-Link. Auf dem Handy muss man die Nummer sonst abtippen, und viele tun das nicht.", impact: 3, weight: 3 }
        : { id: "tel", area: "contact", status: "fail", title: "Keine Telefonnummer auf der Startseite gefunden", detail: "Wer schnell Hilfe braucht, ruft an. Zeig deine Nummer gut sichtbar und als tel:-Link.", impact: 3, weight: 3 },
  );
  const hasForm = /<form\b|<textarea\b|<input\b[^>]*type\s*=\s*["']?(email|tel)\b/i.test(html) || /typeform|jotform|hubspot.*forms|formspree|tally\.so|calendly|cognitoforms|wpforms|contact-form-7|wpcf7|gravityforms|ninja-forms|elementor-form/i.test(html);
  const contactPage = all.find((l) => /kontakt|contact|anfrage|angebot/i.test(`${l.href} ${l.text}`) && !/^(mailto|tel):/i.test(l.href));
  add(
    hasForm
      ? { id: "form", area: "contact", status: "ok", title: "Anfrageformular auf der Startseite gefunden", detail: "Gut: Wer nicht anrufen will, kann direkt schreiben.", impact: 3, weight: 3 }
      : contactPage
        ? { id: "form", area: "contact", status: "warn", title: "Kein Formular direkt auf der Startseite erkannt, nur ein Link zur Kontaktseite", detail: "Jeder zusätzliche Klick kostet Anfragen. Ein kurzes Formular direkt auf der Startseite hilft.", impact: 2, weight: 3 }
        : { id: "form", area: "contact", status: "fail", title: "Kein Anfrageformular erkannt", detail: "Viele Kunden schreiben lieber, als anzurufen, vor allem abends. Ein kurzes Formular fängt diese Anfragen auf.", impact: 3, weight: 3 },
  );
  const wa = all.some((l) => /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/|chat\.whatsapp\.com/i.test(l.href)) || /wa\.me\/\d/i.test(html);
  add(
    wa
      ? { id: "whatsapp", area: "contact", status: "ok", title: "WhatsApp-Kontakt gefunden", detail: "Für viele Kunden der einfachste Weg, ein Foto vom Problem zu schicken.", impact: 1, weight: 1 }
      : { id: "whatsapp", area: "contact", status: "warn", title: "Kein WhatsApp-Kontakt gefunden", detail: "Ein WhatsApp-Button senkt die Hürde: Kunden schicken schnell ein Foto statt anzurufen.", impact: 1, weight: 1 },
  );
  const mail = all.some((l) => /^mailto:/i.test(l.href));
  add(
    mail
      ? { id: "mailto", area: "contact", status: "ok", title: "E-Mail-Adresse zum Anklicken gefunden", detail: "", impact: 1, weight: 1 }
      : { id: "mailto", area: "contact", status: "warn", title: "Keine anklickbare E-Mail-Adresse gefunden", detail: "Ein mailto:-Link öffnet direkt das Mailprogramm.", impact: 1, weight: 1 },
  );

  /* trust: reviews or customer quotes on the homepage */
  const reviewText = /kundenstimmen|kundenbewertung|bewertungen|rezension|referenzen|das sagen unsere kunden|erfahrungen unserer kunden|testimonial|google-bewertung|zufriedene kunden|★|⭐/i.test(text);
  const reviewWidget = /trustindex|elfsight|provenexpert|trustpilot|ekomi|reviews\.io|wp-google-reviews|google-reviews|grw-review|ti-widget|trust-badge/i.test(html);
  const reviewSchema = nodes.some((n) => n.aggregateRating || n.review);
  add(
    reviewText || reviewWidget || reviewSchema
      ? { id: "reviews", area: "contact", status: "ok", title: "Bewertungen oder Kundenstimmen auf der Startseite gefunden", detail: "Gut: Fremde Stimmen überzeugen mehr als eigene Versprechen.", impact: 2, weight: 2 }
      : { id: "reviews", area: "contact", status: "fail", title: "Keine Bewertungen oder Kundenstimmen auf der Startseite", detail: "Neue Kunden wollen sehen, dass andere zufrieden waren. Zeig deine Google-Bewertungen oder zwei, drei echte Kundenstimmen.", impact: 2, weight: 2 },
  );

  /* first screen: is there a clear way to get in touch before scrolling?
     Approximation without a browser: position of the first call-to-action in the page's visible text. */
  const bodyStart = Math.max(0, html.search(/<body\b/i));
  const bodyHtml = html.slice(bodyStart, bodyStart + 400_000).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const CTA_WORDS = /anfrage|anfragen|angebot|kontakt|termin|beratung|rückruf|anrufen|jetzt|kostenlos|buchen|vereinbaren|schreib|whatsapp|loslegen/i;
  const FIRST_SCREEN = 900; // visible characters: roughly navigation + hero
  let strongAt = -1;
  let weakAt = -1;
  const ctaRe = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let cm: RegExpExecArray | null;
  let seen = 0;
  while ((cm = ctaRe.exec(bodyHtml)) && seen++ < 300) {
    const attrs = cm[2];
    const label = stripTags(cm[3]) || decode(attrs.match(/aria-label\s*=\s*["']([^"']*)/i)?.[1] ?? "");
    const isDirect = /href\s*=\s*["']?(tel:|https?:\/\/(wa\.me|api\.whatsapp))/i.test(attrs);
    // A button by tag, by class name (btn, cta, Elementor, WordPress blocks) or by Tailwind styling (rounded + filled or outlined).
    const cls = attrs.match(/class\s*=\s*["']([^"']*)/i)?.[1] ?? "";
    const looksLikeButton =
      cm[1].toLowerCase() === "button" ||
      /\b(btn|button|cta)/i.test(cls) ||
      (/\brounded/.test(cls) && /\b(bg-|border-)/.test(cls)) ||
      /style\s*=\s*["'][^"']*background/i.test(attrs);
    const words = CTA_WORDS.test(label);
    if (!isDirect && !words) continue;
    const at = stripTags(bodyHtml.slice(0, cm.index)).length;
    if (at > FIRST_SCREEN * 3) break;
    if ((isDirect || (looksLikeButton && words)) && strongAt < 0) strongAt = at;
    if (words && weakAt < 0) weakAt = at;
    if (strongAt >= 0) break;
  }
  add(
    strongAt >= 0 && strongAt <= FIRST_SCREEN
      ? { id: "cta_top", area: "contact", status: "ok", title: "Anfrage-Button oder Telefon gleich oben auf der Seite", detail: "Besucher sehen sofort, wie sie dich erreichen.", impact: 3, weight: 2 }
      : weakAt >= 0 && weakAt <= FIRST_SCREEN
        ? { id: "cta_top", area: "contact", status: "warn", title: "Oben auf der Seite nur ein unauffälliger Kontakt-Link", detail: "Ein deutlicher Button wie „Angebot anfragen“ oder „Jetzt anrufen“ direkt im ersten Bildschirm bringt mehr Anfragen als ein Link im Menü.", impact: 3, weight: 2 }
        : { id: "cta_top", area: "contact", status: "fail", title: "Kein Anfrage-Button im ersten Bildschirm erkannt", detail: "Wer auf deine Seite kommt, sollte ohne Scrollen sehen, wie er dich erreicht: ein Button wie „Angebot anfragen“ oder „Jetzt anrufen“.", impact: 3, weight: 2 },
  );

  /* seo basics */
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  add(
    !title
      ? { id: "title", area: "seo", status: "fail", title: "Kein Seitentitel gefunden", detail: "Der Titel ist die blaue Überschrift bei Google. Ohne ihn erfindet Google selbst einen.", impact: 3, weight: 2 }
      : title.length < 20 || title.length > 70
        ? { id: "title", area: "seo", status: "warn", title: `Seitentitel ist ${title.length < 20 ? "sehr kurz" : "zu lang"} (${title.length} Zeichen)`, detail: `„${title.slice(0, 90)}“. Ideal sind etwa 30 bis 60 Zeichen mit Leistung und Stadt, z. B. „Elektriker in Mannheim | Betrieb“.`, impact: 2, weight: 2 }
        : { id: "title", area: "seo", status: "ok", title: "Seitentitel vorhanden", detail: `„${title}“`, impact: 2, weight: 2 },
  );
  if (input.city && title) {
    const inTitle = title.toLowerCase().includes(input.city.trim().toLowerCase());
    add(
      inTitle
        ? { id: "title_city", area: "seo", status: "ok", title: `„${input.city.trim()}“ steht im Seitentitel`, detail: "", impact: 2, weight: 1 }
        : { id: "title_city", area: "seo", status: "warn", title: `„${input.city.trim()}“ steht nicht im Seitentitel`, detail: "Kunden suchen mit Stadt, z. B. „Dachdecker Mannheim“. Die Stadt im Titel hilft, genau dafür gefunden zu werden.", impact: 2, weight: 1 },
    );
  }
  const desc = metaContent(html, "description");
  add(
    !desc
      ? { id: "description", area: "seo", status: "warn", title: "Keine Meta-Beschreibung gefunden", detail: "Das ist der graue Text unter dem Titel bei Google. Ein guter Satz mit Leistung, Ort und Vorteil bringt mehr Klicks.", impact: 2 }
      : { id: "description", area: "seo", status: desc.length < 70 || desc.length > 170 ? "warn" : "ok", title: desc.length < 70 ? "Meta-Beschreibung ist sehr kurz" : desc.length > 170 ? "Meta-Beschreibung wird bei Google abgeschnitten" : "Meta-Beschreibung vorhanden", detail: `„${desc.slice(0, 170)}“`, impact: 1 },
  );
  const h1s = (html.match(/<h1\b[\s\S]*?<\/h1>/gi) ?? []).map(stripTags).filter(Boolean);
  add(
    h1s.length === 0
      ? { id: "h1", area: "seo", status: "fail", title: "Keine Hauptüberschrift (H1) gefunden", detail: "Die H1 sagt Google und Besuchern in einem Satz, worum es auf der Seite geht.", impact: 2, weight: 2 }
      : h1s.length > 1
        ? { id: "h1", area: "seo", status: "warn", title: `${h1s.length} Hauptüberschriften (H1) statt einer`, detail: "Eine klare H1 pro Seite ist für Google eindeutiger.", impact: 1, weight: 2 }
        : { id: "h1", area: "seo", status: "ok", title: "Eine klare Hauptüberschrift (H1)", detail: `„${h1s[0].slice(0, 120)}“`, impact: 1, weight: 2 },
  );
  const robotsMeta = (metaContent(html, "robots") ?? "") + " " + (page.headers.get("x-robots-tag") ?? "");
  if (/noindex/i.test(robotsMeta)) {
    add({ id: "noindex", area: "seo", status: "fail", title: "Startseite ist für Google gesperrt (noindex)", detail: "Die Seite sagt Google ausdrücklich, sie nicht anzuzeigen. Das ist meist ein Überbleibsel aus der Bauphase.", impact: 3, weight: 3 });
  }
  const viewport = /<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(html);
  add(
    viewport
      ? { id: "viewport", area: "seo", status: "ok", title: "Für Handys eingerichtet (Viewport)", detail: "", impact: 2 }
      : { id: "viewport", area: "seo", status: "fail", title: "Nicht für Handys eingerichtet (kein Viewport)", detail: "Ohne diese Angabe zeigt das Handy eine winzige Desktop-Version. Die meisten Kunden suchen am Handy.", impact: 3, weight: 2 },
  );
  const local = nodes.find(isLocal);
  const org = nodes.find(isOrg);
  add(
    local
      ? { id: "schema", area: "seo", status: "ok", title: `Strukturierte Firmendaten gefunden (${typesOf(local).join(", ")})`, detail: "Google kann Name, Adresse und Telefon sicher zuordnen.", impact: 1 }
      : org
        ? { id: "schema", area: "seo", status: "warn", title: "Strukturierte Daten vorhanden, aber nicht als lokaler Betrieb", detail: "Mit dem Typ LocalBusiness (oder z. B. Electrician, Plumber) samt Adresse versteht Google, wo du arbeitest.", impact: 1 }
        : { id: "schema", area: "seo", status: "warn", title: "Keine strukturierten Firmendaten (LocalBusiness) gefunden", detail: "Unsichtbar für Besucher, aber Google liest daraus Name, Adresse, Telefon und Öffnungszeiten.", impact: 1 },
  );
  const origin = new URL("/", page.url);
  const [sitemap, robots] = await Promise.all([exists(new URL("/sitemap.xml", origin), f), exists(new URL("/robots.txt", origin), f)]);
  const sitemapViaRobots = /sitemap:\s*https?:\/\//i.test(robots.body);
  add(
    (sitemap.ok && /<(urlset|sitemapindex)\b/i.test(sitemap.body)) || sitemapViaRobots
      ? { id: "sitemap", area: "seo", status: "ok", title: "Sitemap gefunden", detail: "Google findet damit alle Seiten.", impact: 1 }
      : { id: "sitemap", area: "seo", status: "warn", title: "Keine Sitemap gefunden", detail: "Eine sitemap.xml listet alle Seiten für Google auf. Neue Seiten werden so schneller gefunden.", impact: 1 },
  );
  // How many pages? Few pages = few searches the site can be found for (one page per service and per town).
  let smBody = sitemap.ok && /<(urlset|sitemapindex)\b/i.test(sitemap.body) ? sitemap.body : "";
  if (!smBody && sitemapViaRobots) {
    try {
      const u = new URL(robots.body.match(/sitemap:\s*(https?:\/\/\S+)/i)![1], origin);
      if (isPublicHost(u) && rootHost(u.hostname) === rootHost(origin.hostname)) smBody = (await exists(u, f, 3_000_000)).body;
    } catch {
      /* no count */
    }
  } else if (smBody && /<urlset\b/i.test(smBody) && smBody.length >= 19_000) {
    smBody = (await exists(new URL("/sitemap.xml", origin), f, 3_000_000)).body; // first read was cut off
  }
  const pages = smBody ? await sitemapPageCount(origin, smBody, f) : null;
  if (pages !== null && pages > 0) {
    const pageTip = "Eine eigene Seite für jede Leistung und jede Stadt, in der du arbeitest, bringt dich bei viel mehr Suchanfragen nach vorn.";
    add(
      pages < 6
        ? { id: "pages", area: "seo", status: "fail", title: `Deine Website hat nur ${pages} Seite${pages === 1 ? "" : "n"}`, detail: `Gezählt in deiner Sitemap. ${pageTip}`, impact: 2, weight: 2 }
        : pages < 15
          ? { id: "pages", area: "seo", status: "warn", title: `Deine Website hat ${pages} Seiten`, detail: `Gezählt in deiner Sitemap. ${pageTip}`, impact: 2, weight: 2 }
          : { id: "pages", area: "seo", status: "ok", title: `${pages} Seiten in deiner Sitemap`, detail: "Genug Seiten, um für viele Suchanfragen gefunden zu werden.", impact: 1, weight: 2 },
    );
  }

  /* legal + tech (technical presence check only) */
  add(
    page.url.protocol === "https:"
      ? { id: "https", area: "legal", status: "ok", title: "Verschlüsselt (HTTPS)", detail: "", impact: 3, weight: 2 }
      : { id: "https", area: "legal", status: "fail", title: "Nicht verschlüsselt (kein HTTPS)", detail: "Browser zeigen „Nicht sicher“ an. Das schreckt Besucher ab, besonders vor dem Absenden eines Formulars.", impact: 3, weight: 2 },
  );
  const impressum = all.some((l) => /impressum|imprint|legal-notice/i.test(`${l.href} ${l.text}`));
  add(
    impressum
      ? { id: "impressum", area: "legal", status: "ok", title: "Link zum Impressum gefunden", detail: "", impact: 2, weight: 2 }
      : { id: "impressum", area: "legal", status: "fail", title: "Kein Link zum Impressum gefunden", detail: "Wir haben auf der Startseite keinen Link „Impressum“ gefunden. Prüf, ob er gut erreichbar ist.", impact: 2, weight: 2 },
  );
  const privacy = all.some((l) => /datenschutz|privacy|dsgvo/i.test(`${l.href} ${l.text}`));
  add(
    privacy
      ? { id: "datenschutz", area: "legal", status: "ok", title: "Link zur Datenschutzerklärung gefunden", detail: "", impact: 2, weight: 2 }
      : { id: "datenschutz", area: "legal", status: "fail", title: "Kein Link zur Datenschutzerklärung gefunden", detail: "Wir haben auf der Startseite keinen Link „Datenschutz“ gefunden. Prüf, ob er gut erreichbar ist.", impact: 2, weight: 2 },
  );
  const trackers = TRACKERS.filter(([re]) => re.test(html)).map(([, name]) => name);
  // Own-built banners: look for the usual button wording or a "Cookies" settings button.
  const cmp = CMP.test(lower) || /alle akzeptieren|nur notwendige|alle ablehnen|accept all|reject all|cookie-?einstellungen|cookie settings|einwilligung verwalten|>\s*cookies\s*</i.test(html);
  if (trackers.length) {
    add(
      cmp
        ? { id: "cookies", area: "legal", status: "ok", title: "Cookie-Banner gefunden", detail: `Gefundene Tracking-Dienste: ${trackers.join(", ")}.`, impact: 1 }
        : { id: "cookies", area: "legal", status: "warn", title: "Tracking gefunden, aber kein bekanntes Cookie-Banner", detail: `Gefunden: ${trackers.join(", ")}. Wir haben kein bekanntes Cookie-Banner erkannt. Prüf, ob vor dem Laden eine Einwilligung abgefragt wird.`, impact: 2 },
    );
  } else {
    add({ id: "cookies", area: "legal", status: cmp ? "ok" : "info", title: cmp ? "Cookie-Banner gefunden" : "Keine Tracking-Dienste auf der Startseite erkannt", detail: cmp ? "" : "Ohne Tracking siehst du allerdings auch nicht, woher deine Anfragen kommen.", impact: 1 });
  }
  const year = new Date().getFullYear();
  const copyright = text.match(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/i);
  if (copyright && Number(copyright[1]) <= year - 2) {
    add({ id: "copyright", area: "contact", status: "fail", title: `Im Fußbereich steht noch „© ${copyright[1]}“`, detail: "Sieht nach Kleinigkeit aus, aber Besucher lesen daraus: Um diese Seite kümmert sich niemand mehr. Das kostet Vertrauen.", impact: 2, weight: 1 });
  }

  /* accessibility (own part) */
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const noAlt = imgs.filter((t) => !/\balt\s*=/i.test(t)).length;
  if (imgs.length) {
    add(
      noAlt === 0
        ? { id: "alt", area: "a11y", status: "ok", title: "Alle Bilder haben einen Alternativtext", detail: "", impact: 1 }
        : { id: "alt", area: "a11y", status: noAlt / imgs.length > 0.3 ? "fail" : "warn", title: `${noAlt} von ${imgs.length} Bildern ohne Alternativtext`, detail: "Screenreader und Google können diese Bilder nicht verstehen. Eine kurze Beschreibung pro Bild reicht.", impact: 1 },
    );
  }
  const lang = /<html\b[^>]*\blang\s*=/i.test(html);
  add(
    lang
      ? { id: "lang", area: "a11y", status: "ok", title: "Sprache der Seite angegeben", detail: "", impact: 1 }
      : { id: "lang", area: "a11y", status: "warn", title: "Sprache der Seite nicht angegeben", detail: "Ohne lang=\"de\" lesen Vorleseprogramme den Text womöglich mit englischer Aussprache.", impact: 1 },
  );

  /* business name for Places: schema name > og:site_name > title part > domain */
  const schemaName = (local ?? org)?.name;
  const ogName = metaContent(html, "og:site_name");
  const titlePart = title.split(/\s[|–—·:-]\s/).map((s) => s.trim()).filter((s) => s.length >= 3 && s.length <= 50);
  const domainName = page.url.hostname.replace(/^www\./, "").split(".")[0].replace(/-/g, " ");
  result.businessName = (typeof schemaName === "string" && schemaName.trim()) || ogName || titlePart.at(-1) || domainName;

  /* places */
  if (env.placesKey) {
    const city = input.city?.trim() ?? "";
    const qs = [...new Set([`${result.businessName} ${city}`.trim(), `${domainName} ${city}`.trim(), input.trade && city ? `${result.businessName} ${input.trade} ${city}` : ""].filter(Boolean))].slice(0, 2);
    try {
      result.places = await places(qs, page.url.hostname, env.placesKey, f);
    } catch (e) {
      result.places = { queried: qs, match: null, error: e instanceof Error ? e.message : String(e) };
    }
    const m = result.places.match;
    if (result.places.error) {
      // no checks: the area is shown as "nicht geprüft"
    } else if (!m) {
      add({ id: "gbp", area: "local", status: "fail", title: "Kein Google-Unternehmensprofil mit Link zu dieser Website gefunden", detail: "Entweder fehlt das Profil, oder dort ist keine Website eingetragen. Das Profil ist das, was Kunden bei Google Maps und ganz oben in der Suche sehen.", impact: 3, weight: 3 });
    } else {
      add({ id: "gbp", area: "local", status: "ok", title: `Google-Unternehmensprofil gefunden: ${m.name}`, detail: m.address ?? "", impact: 3, weight: 3 });
      if (m.rating !== null) {
        add({ id: "rating", area: "local", status: m.rating >= 4.5 ? "ok" : m.rating >= 4 ? "warn" : "fail", title: `Bewertung: ${m.rating.toFixed(1).replace(".", ",")} Sterne`, detail: m.rating >= 4.5 ? "" : "Kunden vergleichen die Sterne direkt in Google Maps. Frag zufriedene Kunden gleich nach dem Auftrag nach einer Bewertung.", impact: 2, score: Math.max(0, Math.min(1, (m.rating - 3.5) / 1.3)), weight: 2 });
      }
      const r = m.reviews ?? 0;
      add({ id: "reviews", area: "local", status: r >= 50 ? "ok" : r >= 15 ? "warn" : "fail", title: `${r} Google-Bewertung${r === 1 ? "" : "en"}`, detail: r >= 50 ? "" : "Laut Google fließen Anzahl und Note der Bewertungen in das lokale Ranking ein. Ein fester Ablauf nach jedem Auftrag hilft.", impact: 2, score: Math.min(1, r / 60), weight: 2 });
    }
  }

  /* pagespeed */
  const [m, d] = await psiPromise;
  result.pagespeed.mobile = m.status === "fulfilled" ? m.value : null;
  result.pagespeed.desktop = d.status === "fulfilled" ? d.value : null;
  if (m.status === "rejected") result.pagespeed.error = String(m.reason?.message ?? m.reason);
  const mob = result.pagespeed.mobile;
  const desk = result.pagespeed.desktop;
  const band3 = (v: number) => (v >= 90 ? "ok" : v >= 50 ? "warn" : "fail") as Status;
  if (mob?.performance != null) {
    add({ id: "psi_mobile", area: "speed", status: band3(mob.performance), title: `Ladezeit-Wert am Handy: ${mob.performance} von 100`, detail: mob.performance >= 90 ? "Sehr gut." : "Jede Sekunde Wartezeit kostet Besucher. Und Google bezieht die Ladezeit (Core Web Vitals) in die Bewertung deiner Seite ein.", impact: mob.performance < 50 ? 3 : 2, score: mob.performance / 100, weight: 3 });
  }
  const lcp = mob?.field?.lcpMs ?? mob?.lcpMs ?? null;
  if (lcp != null) {
    const sec = (lcp / 1000).toFixed(1).replace(".", ",");
    add({ id: "lcp", area: "speed", status: lcp <= 2500 ? "ok" : lcp <= 4000 ? "warn" : "fail", title: `Hauptinhalt am Handy sichtbar nach ${sec} s${mob?.field?.lcpMs ? " (echte Besucher)" : ""}`, detail: "Google empfiehlt höchstens 2,5 Sekunden (Largest Contentful Paint).", impact: lcp > 4000 ? 3 : 2, weight: 2 });
  }
  const cls = mob?.field?.cls ?? mob?.cls ?? null;
  if (cls != null) {
    add({ id: "cls", area: "speed", status: cls <= 0.1 ? "ok" : cls <= 0.25 ? "warn" : "fail", title: cls <= 0.1 ? "Seite springt beim Laden nicht" : "Inhalte verschieben sich beim Laden", detail: cls <= 0.1 ? "" : "Wenn Buttons beim Laden springen, tippen Besucher daneben (Cumulative Layout Shift).", impact: 1 });
  }
  if (desk?.performance != null) {
    add({ id: "psi_desktop", area: "speed", status: band3(desk.performance), title: `Ladezeit-Wert am Computer: ${desk.performance} von 100`, detail: "", impact: 1, score: desk.performance / 100, weight: 1 });
  }
  if (mob?.seo != null) add({ id: "psi_seo", area: "seo", status: band3(mob.seo), title: `Google-Technik-Wert (Lighthouse SEO): ${mob.seo} von 100`, detail: "", impact: 1, score: mob.seo / 100, weight: 2 });
  if (mob?.accessibility != null) add({ id: "psi_a11y", area: "a11y", status: band3(mob.accessibility), title: `Barrierefreiheits-Wert (Lighthouse): ${mob.accessibility} von 100`, detail: mob.accessibility >= 90 ? "" : "Typisch sind zu schwache Kontraste, fehlende Beschriftungen an Buttons und zu kleine Tippflächen.", impact: 1, score: mob.accessibility / 100, weight: 3 });

  return finish(result, t0);
}

function finish(result: CheckResult, t0: number): CheckResult {
  const val = (c: Check) => (typeof c.score === "number" ? c.score : c.status === "ok" ? 1 : c.status === "warn" ? 0.4 : 0);
  // Very slow phones cap the speed area: a good desktop score must not hide a 10-second mobile page.
  const lcp = result.pagespeed.mobile?.field?.lcpMs ?? result.pagespeed.mobile?.lcpMs ?? null;
  const speedCap = lcp === null ? 100 : lcp > 8000 ? 25 : lcp > 4000 ? 40 : 100;
  // No Places key (or no Places run): leave the Google-profile area out instead of showing "nicht geprüft".
  result.areas = AREA_ORDER.filter((key) => key !== "local" || result.places !== null).map((key) => {
    const cs = result.checks.filter((c) => c.area === key && c.status !== "info");
    if (!cs.length) return { key, label: AREA_LABELS[key], score: null, note: "nicht geprüft" };
    const w = cs.reduce((s, c) => s + (c.weight ?? 1), 0);
    const raw = Math.round((cs.reduce((s, c) => s + val(c) * (c.weight ?? 1), 0) / w) * 100);
    return { key, label: AREA_LABELS[key], score: key === "speed" ? Math.min(raw, speedCap) : raw };
  });
  const scored = result.areas.filter((a) => a.score !== null);
  if (result.reachable && scored.length) {
    const w = scored.reduce((s, a) => s + AREA_WEIGHTS[a.key], 0);
    result.score = Math.round(scored.reduce((s, a) => s + (a.score as number) * AREA_WEIGHTS[a.key], 0) / w);
  } else {
    result.score = result.reachable ? null : 0;
  }
  result.measuredScore = result.score;
  // Halyl's decision (11 Nov 2026): sites nüll. built are rated 100/100 in the visitor's report.
  // The report labels this as nüll.'s rating and hides the breakdown; the measured score stays in
  // `measuredScore`, in the database and in the lead email.
  if (result.reachable && result.builtBy && result.score !== null) result.score = 100;
  result.band = result.score === null ? null : result.score >= 70 ? "gut" : result.score >= 40 ? "ausbaufaehig" : "kritisch";
  const rank = { fail: 0, warn: 1, ok: 2, info: 3 } as const;
  result.top = result.checks
    .filter((c) => c.status === "fail" || c.status === "warn")
    .sort((a, b) => b.impact - a.impact || rank[a.status] - rank[b.status])
    .slice(0, 3);
  result.durationMs = Date.now() - t0;
  return result;
}
