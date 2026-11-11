import type { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { normalizeUrl, runWebsiteCheck, type CheckResult } from "./website_check_core.ts";
import { renderLeadEmail, renderReportEmail } from "./website_check_email.ts";

/*
 * POST …/make-server-ea5edff4/website-check  { url, email, trade?, city?, optIn?, website (honeypot) }
 * Answers at once ("report kommt per E-Mail") and runs the check in the background (EdgeRuntime.waitUntil).
 * Secrets: RESEND_API_KEY, PAGESPEED_API_KEY, GOOGLE_PLACES_API_KEY (optional: Places is skipped without it),
 *          NOTIFICATION_EMAIL (lead alert), WEBSITE_CHECK_SALT (optional, for hashing IPs).
 * Table: public.website_checks (migration 20261111120000).
 */

const FROM = '"nüll. Website-Check" <check@forms.xn--nll-hoa.com>';
const REPLY_TO = "halyl@xn--nll-hoa.com";
const LIMIT_PER_EMAIL = 3; // per 24 h
const LIMIT_PER_IP = 10; // per 24 h

// Shown next to the unticked checkbox on /website-check. Stored with every opt-in, so keep both in sync.
export const OPT_IN_TEXT =
  "Ja, schickt mir gelegentlich Tipps für mehr Anfragen über meine Website per E-Mail. Abmelden geht jederzeit mit einem Klick.";

const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

// Throwaway inbox providers: a report there is never read, so these are refused.
const DISPOSABLE = new Set([
  "mailinator.com", "mailinator.net", "10minutemail.com", "10minutemail.net", "10minutemail.de", "guerrillamail.com", "guerrillamail.de",
  "guerrillamail.net", "guerrillamailblock.com", "sharklasers.com", "grr.la", "pokemail.net", "spam4.me", "yopmail.com", "yopmail.fr",
  "yopmail.net", "temp-mail.org", "tempmail.com", "tempmail.de", "tempmailo.com", "tempr.email", "temp-mail.io", "trashmail.com",
  "trashmail.de", "trashmail.net", "wegwerfmail.de", "wegwerfmail.net", "wegwerfemail.de", "einrot.com", "spambog.com", "spambog.de",
  "throwawaymail.com", "getnada.com", "nada.email", "dispostable.com", "maildrop.cc", "mohmal.com", "emailondeck.com", "fakeinbox.com",
  "mintemail.com", "mytemp.email", "inboxkitten.com", "burnermail.io", "33mail.com", "spamgourmet.com", "discard.email", "mailnesia.com",
  "mail-temp.com", "luxusmail.org", "byom.de", "trash-mail.com", "muellmail.com", "emailtemporanea.com", "1secmail.com", "1secmail.net",
]);

// Does the domain accept mail? An MX record, or an A record as the fallback mail host (RFC 5321).
// A "null MX" ("0 .", RFC 7505) means the domain takes no mail at all.
// Asked over DNS-over-HTTPS; if the lookup itself fails we let the address through rather than block a real person.
async function domainAcceptsMail(domain: string): Promise<boolean> {
  // deno-lint-ignore no-explicit-any
  const ask = async (type: "MX" | "A"): Promise<any | null> => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3500);
    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
        headers: { accept: "application/dns-json" },
        signal: ctrl.signal,
      });
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    } finally {
      clearTimeout(t);
    }
  };
  const mx = await ask("MX");
  if (!mx) return true; // lookup failed: don't block
  if (mx.Status === 3) return false; // NXDOMAIN: the domain does not exist
  const records: string[] = (mx.Answer ?? []).filter((r: { type: number }) => r.type === 15).map((r: { data: string }) => String(r.data).trim());
  if (records.length) return records.some((d) => !/^0\s+\.$/.test(d)); // only a null MX: no mail
  const a = await ask("A");
  if (!a) return true;
  return (a.Answer ?? []).some((r: { type: number }) => r.type === 1);
}

function utf8ToBase64(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function sendEmail(payload: Record<string, unknown>) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

type Job = { id: string; url: string; email: string; trade: string; city: string; optIn: boolean };

async function processCheck(job: Job) {
  const supabase = db();
  let result: CheckResult | null = null;
  let error = "";
  try {
    result = await runWebsiteCheck(
      { url: job.url, trade: job.trade || undefined, city: job.city || undefined },
      { pagespeedKey: Deno.env.get("PAGESPEED_API_KEY"), placesKey: Deno.env.get("GOOGLE_PLACES_API_KEY") },
    );
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    console.error("website-check failed", job.id, error);
  }

  await supabase
    .from("website_checks")
    .update({
      status: result ? "done" : "failed",
      completed_at: new Date().toISOString(),
      final_url: result?.finalUrl ?? null,
      score: result?.score ?? null,
      results: result,
      error: error || null,
    })
    .eq("id", job.id);

  // Visitor report (also when the site was unreachable: the email says so).
  let emailSent = false;
  let emailError = "";
  let reportHtml = "";
  if (result) {
    const report = renderReportEmail(result, { trade: job.trade, city: job.city });
    reportHtml = report.html;
    try {
      await sendEmail({ from: FROM, to: job.email, reply_to: REPLY_TO, subject: report.subject, html: report.html, text: report.text });
      emailSent = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
      console.error("website-check report email failed", job.id, emailError);
    }
  }

  // Lead alert to Halyl, with the visitor's report attached.
  let notified = false;
  const to = Deno.env.get("NOTIFICATION_EMAIL") || REPLY_TO;
  try {
    const lead = renderLeadEmail(result, { id: job.id, email: job.email, url: job.url, trade: job.trade, city: job.city, optIn: job.optIn }, error || emailError || undefined);
    const replyOk = /^[\x20-\x7e]+$/.test(job.email);
    await sendEmail({
      from: FROM,
      to,
      ...(replyOk ? { reply_to: job.email } : {}),
      subject: lead.subject,
      html: lead.html,
      ...(reportHtml ? { attachments: [{ filename: `website-check-${(result?.host ?? "report").replace(/[^a-z0-9.-]/gi, "")}.html`, content: utf8ToBase64(reportHtml) }] } : {}),
    });
    notified = true;
  } catch (e) {
    console.error("website-check lead email failed", job.id, e);
  }

  await supabase.from("website_checks").update({ email_sent: emailSent, email_error: emailError || null, notified }).eq("id", job.id);
}

export function registerWebsiteCheck(app: Hono) {
  // Status for the confirmation card: only "running / sent / failed", never results or addresses.
  // The id is a random UUID returned to the visitor who started the check.
  app.get("*/website-check/status", async (c) => {
    const id = c.req.query("id") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return c.json({ state: "unknown" }, 400);
    const { data, error } = await db().from("website_checks").select("status, email_sent, email_error").eq("id", id).maybeSingle();
    if (error) return c.json({ state: "unknown" }, 500);
    if (!data) return c.json({ state: "unknown" }, 404);
    const state = data.email_sent ? "sent" : data.status === "failed" || data.email_error ? "failed" : "running";
    return c.json({ state });
  });

  app.post("*/website-check", async (c) => {
    try {
      const raw = await c.req.text();
      if (raw.length > 4000) return c.json({ success: false, error: "too_large" }, 413);
      // deno-lint-ignore no-explicit-any
      let body: any;
      try {
        body = JSON.parse(raw);
      } catch {
        return c.json({ success: false, error: "invalid_json" }, 400);
      }

      // Honeypot: bots fill every field. Pretend success, do nothing.
      if (clean(body.website, 200)) return c.json({ success: true });

      const email = clean(body.email, 200).toLowerCase();
      const url = clean(body.url, 300);
      const trade = clean(body.trade, 80);
      const city = clean(body.city, 80);
      const optIn = body.optIn === true;
      if (!EMAIL_RE.test(email)) return c.json({ success: false, error: "invalid_email" }, 400);
      const emailDomain = email.split("@")[1];
      if (DISPOSABLE.has(emailDomain)) return c.json({ success: false, error: "email_disposable" }, 400);
      const parsed = normalizeUrl(url);
      if (!parsed) return c.json({ success: false, error: "invalid_url" }, 400);
      if (!(await domainAcceptsMail(emailDomain))) return c.json({ success: false, error: "email_domain" }, 400);

      const supabase = db();
      const ip = (c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for")?.split(",")[0] || "").trim();
      const ipHash = ip ? await sha256(`${Deno.env.get("WEBSITE_CHECK_SALT") ?? "nuell-website-check"}:${ip}`) : null;
      const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

      const [{ count: byEmail }, { count: byIp }] = await Promise.all([
        supabase.from("website_checks").select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", since),
        ipHash
          ? supabase.from("website_checks").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since)
          : Promise.resolve({ count: 0 }),
      ]);
      if ((byEmail ?? 0) >= LIMIT_PER_EMAIL || (byIp ?? 0) >= LIMIT_PER_IP) {
        return c.json({ success: false, error: "rate_limited" }, 429);
      }

      const { data, error } = await supabase
        .from("website_checks")
        .insert({
          url: parsed.toString(),
          email,
          trade: trade || null,
          city: city || null,
          marketing_opt_in: optIn,
          marketing_opt_in_text: optIn ? OPT_IN_TEXT : null,
          ip_hash: ipHash,
          user_agent: clean(c.req.header("user-agent"), 400) || null,
        })
        .select("id")
        .single();
      if (error || !data) throw new Error(error?.message ?? "insert failed");

      const job: Job = { id: data.id, url: parsed.toString(), email, trade, city, optIn };
      const work = processCheck(job).catch((e) => console.error("website-check background error", data.id, e));
      // deno-lint-ignore no-explicit-any
      const runtime = (globalThis as any).EdgeRuntime;
      if (runtime?.waitUntil) runtime.waitUntil(work);
      else await work; // local runs without the edge runtime

      return c.json({ success: true, id: data.id });
    } catch (err) {
      console.error("website-check error", err);
      return c.json({ success: false, error: "server_error" }, 500);
    }
  });
}
