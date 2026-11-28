import type { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { normalizeUrl, runWebsiteCheck, type CheckResult } from "./website_check_core.ts";
import { renderReportEmail } from "./website_check_email.ts";
import { DISPOSABLE, EMAIL_RE, domainAcceptsMail } from "./website_check.ts";

/*
 * Flyer funnel (/check-flyer). The QR code on the printed flyers promises "Kostenloser Website-Check & Angebot".
 *
 * POST …/make-server-ea5edff4/flyer-check  { name, company, email, phone, url?, noWebsite?, challenge?, consent, source?, website (honeypot) }
 *   Saves the lead, answers at once with { id }, runs the same check as /website-check in the background and
 *   e-mails the visitor the same report /website-check sends (28 Nov 2026: no waiting on screen any more).
 * GET  …/make-server-ea5edff4/flyer-check/result?id=…
 *   Returns only the visitor's own score and top 3 issues (by the random UUID). Never names, phone numbers or addresses.
 *
 * Unlike /website-check, the score is shown on screen (Halyl's decision for the flyer, 28 Nov 2026) and the next step is
 * WhatsApp, so no e-mail is asked for. Halyl gets a lead alert by e-mail as soon as the check is done.
 * Secrets: RESEND_API_KEY, PAGESPEED_API_KEY, GOOGLE_PLACES_API_KEY (optional), NOTIFICATION_EMAIL, WEBSITE_CHECK_SALT (optional).
 * Table: public.flyer_leads (migration 20261128120000).
 */

const FROM = '"nüll. Website-Check" <check@forms.xn--nll-hoa.com>';
const NOTIFY_FALLBACK = "halyl@xn--nll-hoa.com";
const REPLY_TO = "halyl@xn--nll-hoa.com";
const LIMIT_PER_IP = 10; // per 24 h

// Shown next to the required checkbox on /check-flyer. Stored with every lead, so keep both in sync.
export const FLYER_CONSENT_TEXT =
  "Ich bin einverstanden, dass nüll. meine Angaben speichert und mich zu meinem Website-Check und einem Angebot per E-Mail, Telefon oder WhatsApp kontaktiert. Widerruf jederzeit möglich.";

const SOURCES = new Set(["allgemein", "handwerk"]);

const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** German-style phone number -> digits for wa.me (49…), or null if it doesn't look like a phone number. */
export function phoneToWa(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "49" + d.slice(1);
  if (!/^\d{8,15}$/.test(d)) return null;
  return d;
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

type Lead = { id: string; name: string; company: string; email: string; phone: string; url: string | null; noWebsite: boolean; challenge: string; source: string };

function leadEmail(lead: Lead, result: CheckResult | null, error: string) {
  const wa = phoneToWa(lead.phone);
  const score = result?.score;
  const subject = `Flyer-Lead: ${lead.company}${lead.noWebsite ? " (keine Website)" : score != null ? ` – ${score}/100` : ""}`;
  const top = (result?.top ?? []).map((c) => `<li><b>${esc(c.title)}</b><br><span style="color:#555">${esc(c.detail)}</span></li>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
  <h2 style="margin:0 0 12px">Neuer Flyer-Lead</h2>
  <table cellpadding="4" style="border-collapse:collapse">
    <tr><td style="color:#666">Name</td><td><b>${esc(lead.name)}</b></td></tr>
    <tr><td style="color:#666">Betrieb</td><td><b>${esc(lead.company)}</b></td></tr>
    <tr><td style="color:#666">E-Mail</td><td><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
    <tr><td style="color:#666">Telefon</td><td><b>${esc(lead.phone)}</b>${wa ? ` · <a href="https://wa.me/${wa}">WhatsApp öffnen</a> · <a href="tel:+${wa}">Anrufen</a>` : ""}</td></tr>
    <tr><td style="color:#666">Website</td><td>${lead.noWebsite ? "<b>Hat noch keine Website</b>" : lead.url ? `<a href="${esc(lead.url)}">${esc(lead.url)}</a>` : "–"}</td></tr>
    <tr><td style="color:#666">Größte Herausforderung</td><td><b>${esc(lead.challenge || "–")}</b></td></tr>
    <tr><td style="color:#666">Flyer</td><td>${esc(lead.source || "unbekannt")}</td></tr>
    ${lead.noWebsite ? "" : `<tr><td style="color:#666">Note</td><td><b>${score != null ? `${score}/100` : "keine (Check fehlgeschlagen)"}</b>${result?.builtBy ? ` · gebaut von nüll. (${esc(result.builtBy.client)})` : ""}</td></tr>`}
  </table>
  ${top ? `<h3 style="margin:18px 0 6px">Die drei wichtigsten Baustellen</h3><ol style="padding-left:18px;margin:0">${top}</ol>` : ""}
  ${error ? `<p style="color:#a1000f">Fehler beim Check: ${esc(error)}</p>` : ""}
  <p style="color:#666;margin-top:18px">Der Kontakt hat der Kontaktaufnahme per Telefon/WhatsApp zugestimmt. Lead-ID ${esc(lead.id)}</p>
</div>`;
  return { subject, html };
}

async function processLead(lead: Lead) {
  const supabase = db();
  let result: CheckResult | null = null;
  let error = "";
  if (lead.url) {
    try {
      result = await runWebsiteCheck(
        { url: lead.url },
        { pagespeedKey: Deno.env.get("PAGESPEED_API_KEY"), placesKey: Deno.env.get("GOOGLE_PLACES_API_KEY") },
      );
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      console.error("flyer-check failed", lead.id, error);
    }
    await supabase
      .from("flyer_leads")
      .update({
        status: result ? "done" : "failed",
        completed_at: new Date().toISOString(),
        final_url: result?.finalUrl ?? null,
        score: result?.score ?? null,
        results: result,
        error: error || null,
      })
      .eq("id", lead.id);

    // The visitor's report, same as /website-check (also when the site was unreachable: the e-mail says so).
    if (result) {
      let emailSent = false;
      let emailError = "";
      try {
        const report = renderReportEmail(result, {});
        await sendEmail({ from: FROM, to: lead.email, reply_to: REPLY_TO, subject: report.subject, html: report.html, text: report.text });
        emailSent = true;
      } catch (e) {
        emailError = e instanceof Error ? e.message : String(e);
        console.error("flyer-check report email failed", lead.id, emailError);
      }
      await supabase.from("flyer_leads").update({ email_sent: emailSent, email_error: emailError || null }).eq("id", lead.id);
    }
  }

  let notified = false;
  try {
    const mail = leadEmail(lead, result, error);
    await sendEmail({ from: FROM, to: Deno.env.get("NOTIFICATION_EMAIL") || NOTIFY_FALLBACK, subject: mail.subject, html: mail.html });
    notified = true;
  } catch (e) {
    console.error("flyer-check lead email failed", lead.id, e);
  }
  await supabase.from("flyer_leads").update({ notified }).eq("id", lead.id);
}

export function registerFlyerCheck(app: Hono) {
  app.get("*/flyer-check/result", async (c) => {
    const id = c.req.query("id") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return c.json({ state: "unknown" }, 400);
    const { data, error } = await db().from("flyer_leads").select("status, score, results").eq("id", id).maybeSingle();
    if (error) return c.json({ state: "unknown" }, 500);
    if (!data) return c.json({ state: "unknown" }, 404);
    if (data.status === "queued") return c.json({ state: "running" });
    if (data.status === "no_site") return c.json({ state: "no_site" });
    const r = data.results as CheckResult | null;
    if (data.status === "failed" || !r) return c.json({ state: "failed" });
    return c.json({
      state: r.reachable ? "done" : "unreachable",
      score: data.score,
      band: r.band,
      host: r.host,
      builtBy: r.builtBy ? r.builtBy.client : null,
      top: (r.top ?? []).slice(0, 3).map((t) => ({ title: t.title, detail: t.detail, status: t.status })),
    });
  });

  app.post("*/flyer-check", async (c) => {
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
      if (clean(body.website, 200)) return c.json({ success: true, id: null });

      const name = clean(body.name, 120);
      const company = clean(body.company, 160);
      const phone = clean(body.phone, 40);
      const email = clean(body.email, 200).toLowerCase();
      const noWebsite = body.noWebsite === true;
      const challenge = clean(body.challenge, 300);
      const source = SOURCES.has(clean(body.source, 20)) ? clean(body.source, 20) : "";
      if (body.consent !== true) return c.json({ success: false, error: "consent" }, 400);
      if (name.length < 2) return c.json({ success: false, error: "invalid_name" }, 400);
      if (company.length < 2) return c.json({ success: false, error: "invalid_company" }, 400);
      if (!phoneToWa(phone)) return c.json({ success: false, error: "invalid_phone" }, 400);
      if (!EMAIL_RE.test(email)) return c.json({ success: false, error: "invalid_email" }, 400);
      const emailDomain = email.split("@")[1];
      if (DISPOSABLE.has(emailDomain)) return c.json({ success: false, error: "email_disposable" }, 400);
      if (!(await domainAcceptsMail(emailDomain))) return c.json({ success: false, error: "email_domain" }, 400);
      let url: string | null = null;
      if (!noWebsite) {
        const parsed = normalizeUrl(clean(body.url, 300));
        if (!parsed) return c.json({ success: false, error: "invalid_url" }, 400);
        url = parsed.toString();
      }

      const supabase = db();
      const ip = (c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for")?.split(",")[0] || "").trim();
      const ipHash = ip ? await sha256(`${Deno.env.get("WEBSITE_CHECK_SALT") ?? "nuell-website-check"}:${ip}`) : null;
      if (ipHash) {
        const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
        const { count } = await supabase.from("flyer_leads").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
        if ((count ?? 0) >= LIMIT_PER_IP) return c.json({ success: false, error: "rate_limited" }, 429);
      }

      const { data, error } = await supabase
        .from("flyer_leads")
        .insert({
          source: source || null,
          name,
          company,
          email,
          phone,
          url,
          no_website: noWebsite,
          challenge: challenge || null,
          status: noWebsite ? "no_site" : "queued",
          consent: true,
          consent_text: FLYER_CONSENT_TEXT,
          ip_hash: ipHash,
          user_agent: clean(c.req.header("user-agent"), 400) || null,
        })
        .select("id")
        .single();
      if (error || !data) throw new Error(error?.message ?? "insert failed");

      const lead: Lead = { id: data.id, name, company, email, phone, url, noWebsite, challenge, source };
      const work = processLead(lead).catch((e) => console.error("flyer-check background error", data.id, e));
      // deno-lint-ignore no-explicit-any
      const runtime = (globalThis as any).EdgeRuntime;
      if (runtime?.waitUntil) runtime.waitUntil(work);
      else await work; // local runs without the edge runtime

      return c.json({ success: true, id: data.id });
    } catch (err) {
      console.error("flyer-check error", err);
      return c.json({ success: false, error: "server_error" }, 500);
    }
  });
}
