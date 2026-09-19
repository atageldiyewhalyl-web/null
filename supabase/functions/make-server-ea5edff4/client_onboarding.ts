import type { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import {
  MAX_BODY_BYTES,
  ONBOARDING_CLIENTS,
  renderSubmissionEmail,
  renderSubmissionMarkdown,
  utf8ToBase64,
  validateBase,
  validateSubmit,
} from "./client_onboarding_email.ts";

const FROM = '"nüll. Client Onboarding" <onboarding@forms.xn--nll-hoa.com>';

const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function readBody(c: any) {
  const raw = await c.req.text();
  if (raw.length > MAX_BODY_BYTES) return { error: "Payload too large" as const };
  try {
    return { body: JSON.parse(raw) };
  } catch {
    return { error: "Invalid JSON" as const };
  }
}

/** Loads the submission and checks the resume token. Missing rows are fine (first save). */
async function authorize(supabase: ReturnType<typeof db>, body: any) {
  const tokenHash = await sha256(body.resumeToken);
  const { data, error } = await supabase
    .from("onboarding_submissions")
    .select("id, status, resume_token_hash")
    .eq("id", body.submissionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data && data.resume_token_hash !== tokenHash) return { forbidden: true as const, tokenHash };
  return { existing: data, tokenHash };
}

function baseRow(body: any, tokenHash: string) {
  const client = ONBOARDING_CLIENTS[body.slug];
  return {
    id: body.submissionId,
    questionnaire_id: body.questionnaireId,
    questionnaire_version: body.questionnaireVersion,
    client_slug: body.slug,
    client_name: client.name,
    project: body.definition?.project ?? body.project ?? null,
    current_step: String(body.currentStep ?? "").slice(0, 80) || null,
    current_step_index: Number.isInteger(body.currentStepIndex) ? body.currentStepIndex : null,
    language: body.language === "tr" ? "tr" : "de",
    contact: body.contact ?? {},
    answers: body.answers,
    user_agent: String(body.device?.userAgent ?? "").slice(0, 400) || null,
    device: body.device ?? null,
    resume_token_hash: tokenHash,
    started_at: body.startedAt ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

type EmailJob = {
  slug: string;
  // deno-lint-ignore no-explicit-any
  definition: any;
  structured: unknown;
  // deno-lint-ignore no-explicit-any
  rows: any[];
  contact: Record<string, string | undefined>;
  language: string;
  submissionId: string;
  completedAt: string;
};

/** Sends the notification with the .md + .json attachments. Used on submit and on resend. */
async function sendSubmissionEmail(job: EmailJob): Promise<{ emailSent: boolean; emailError: string | null }> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) return { emailSent: false, emailError: "RESEND_API_KEY missing" };
  const client = ONBOARDING_CLIENTS[job.slug];
  if (!client) return { emailSent: false, emailError: "Unknown questionnaire" };

  const emailInput = {
    clientName: client.name,
    title: job.definition.title,
    project: job.definition.project ?? "",
    submissionId: job.submissionId,
    completedAt: job.completedAt,
    language: job.language === "tr" ? "tr" : "de",
    contact: job.contact,
    // deno-lint-ignore no-explicit-any
    sections: (job.definition.sections ?? []).map((s: any) => ({ key: s.key, title: s.title })),
    rows: job.rows,
  };
  const { subject, html } = renderSubmissionEmail(emailInput);
  const markdown = renderSubmissionMarkdown(emailInput);
  // Resend rejects non-ASCII reply-to addresses (e.g. "müller@…"); drop it rather than lose the email.
  const contactEmail = String(job.contact.email ?? "").trim();
  const replyTo = /^[\x20-\x7e]+$/.test(contactEmail) ? contactEmail : "";
  const day = job.completedAt.slice(0, 10);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
    body: JSON.stringify({
      from: FROM,
      to: client.recipients,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
      attachments: [
        { filename: `onboarding-${job.slug}-${day}.md`, content: utf8ToBase64(markdown) },
        { filename: `onboarding-${job.slug}-${day}.json`, content: utf8ToBase64(JSON.stringify(job.structured, null, 2)) },
      ],
    }),
  });
  if (res.ok) return { emailSent: true, emailError: null };
  return { emailSent: false, emailError: JSON.stringify(await res.json().catch(() => ({ status: res.status }))) };
}

export function registerClientOnboarding(app: Hono) {
  // Autosave: called on step changes, never blocks the client.
  app.post("*/client-onboarding/progress", async (c) => {
    try {
      const { body, error: readError } = await readBody(c);
      if (readError) return c.json({ success: false, error: readError }, 400);
      const invalid = validateBase(body);
      if (invalid) return c.json({ success: false, error: invalid }, 400);

      const supabase = db();
      const auth = await authorize(supabase, body);
      if ("forbidden" in auth) return c.json({ success: false, error: "Forbidden" }, 403);
      if (auth.existing?.status === "completed") return c.json({ success: true, id: body.submissionId, completed: true });

      const { error } = await supabase.from("onboarding_submissions").upsert(baseRow(body, auth.tokenHash));
      if (error) throw new Error(error.message);
      return c.json({ success: true, id: body.submissionId });
    } catch (err: any) {
      console.error(`Client onboarding progress error: ${err?.message ?? err}`);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  });

  /** Resend the notification for a stored submission (service role only; used when the first send failed). */
app.post("*/client-onboarding/resend", async (c) => {
  try {
    // Guarded by its own secret (ADMIN_TOKEN) so a resend can never be triggered with the public anon key.
    const adminToken = Deno.env.get("ADMIN_TOKEN") ?? "";
    if (!adminToken || c.req.header("X-Admin-Token") !== adminToken) return c.json({ success: false, error: "Forbidden" }, 403);
    const { submissionId } = await c.req.json().catch(() => ({}));
    if (typeof submissionId !== "string") return c.json({ success: false, error: "Missing submissionId" }, 400);

    const supabase = db();
    const { data: submission, error } = await supabase
      .from("onboarding_submissions")
      .select("id, client_slug, questionnaire_id, questionnaire_version, contact, structured, completed_at, status")
      .eq("id", submissionId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!submission || submission.status !== "completed") return c.json({ success: false, error: "No completed submission" }, 404);

    const [{ data: questionnaire }, { data: answerRows }] = await Promise.all([
      supabase
        .from("onboarding_questionnaires")
        .select("definition")
        .eq("id", submission.questionnaire_id)
        .eq("version", submission.questionnaire_version)
        .maybeSingle(),
      supabase.from("onboarding_submission_answers").select("*").eq("submission_id", submissionId).order("position"),
    ]);
    if (!questionnaire) return c.json({ success: false, error: "Questionnaire snapshot missing" }, 404);

    const { emailSent, emailError } = await sendSubmissionEmail({
      slug: submission.client_slug,
      definition: questionnaire.definition,
      structured: submission.structured,
      rows: answerRows ?? [],
      contact: submission.contact ?? {},
      language: (submission.structured as any)?.language ?? "de",
      submissionId,
      completedAt: submission.completed_at ?? new Date().toISOString(),
    });
    await supabase
      .from("onboarding_submissions")
      .update(emailSent ? { email_sent_at: new Date().toISOString(), email_error: null } : { email_error: emailError })
      .eq("id", submissionId);
    return c.json({ success: emailSent, emailSent, error: emailError });
  } catch (err: any) {
    console.error(`Client onboarding resend error: ${err?.message ?? err}`);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

app.post("*/client-onboarding/submit", async (c) => {
    try {
      const { body, error: readError } = await readBody(c);
      if (readError) return c.json({ success: false, error: readError }, 400);
      const invalid = validateSubmit(body);
      if (invalid) return c.json({ success: false, error: invalid }, 400);

      const supabase = db();
      const auth = await authorize(supabase, body);
      if ("forbidden" in auth) return c.json({ success: false, error: "Forbidden" }, 403);
      // Retried submit after success: don't store or email twice.
      if (auth.existing?.status === "completed") return c.json({ success: true, id: body.submissionId, alreadyCompleted: true });

      const client = ONBOARDING_CLIENTS[body.slug];
      const definition = body.definition;
      const completedAt = new Date().toISOString();

      const { error: qError } = await supabase.from("onboarding_questionnaires").upsert({
        id: definition.id,
        version: definition.version,
        client_slug: body.slug,
        client_name: client.name,
        project: definition.project ?? null,
        title: definition.title,
        definition,
        updated_at: completedAt,
      });
      if (qError) throw new Error(qError.message);

      const structured = { ...body.structured, client_name: client.name, submitted_at: completedAt };
      // Save everything first and flip to completed last, so a failed write can be retried.
      const { error: sError } = await supabase
        .from("onboarding_submissions")
        .upsert({ ...baseRow(body, auth.tokenHash), structured });
      if (sError) throw new Error(sError.message);

      await supabase.from("onboarding_submission_answers").delete().eq("submission_id", body.submissionId);
      const rows = body.rows.map((r: any) => ({
        submission_id: body.submissionId,
        question_id: String(r.question_id),
        question_key: String(r.question_key),
        section_key: String(r.section_key),
        question_label: String(r.question_label),
        number: Number(r.number) || 0,
        is_follow_up: Boolean(r.is_follow_up),
        position: Number(r.position) || 0,
        value: r.value ?? null,
        value_text: r.value_text ?? null,
      }));
      const { error: aError } = await supabase.from("onboarding_submission_answers").insert(rows);
      if (aError) throw new Error(aError.message);

      const { error: cError } = await supabase
        .from("onboarding_submissions")
        .update({ status: "completed", current_step: "completed", completed_at: completedAt })
        .eq("id", body.submissionId);
      if (cError) throw new Error(cError.message);

      // Email is a notification; the submission is already safe in the database.
      let emailSent = false;
      let emailError: string | null = null;
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        emailError = "RESEND_API_KEY missing";
      } else {
        const result = await sendSubmissionEmail({
          slug: body.slug,
          definition,
          structured,
          rows,
          contact: body.contact ?? {},
          language: body.language === "tr" ? "tr" : "de",
          submissionId: body.submissionId,
          completedAt,
        });
        emailSent = result.emailSent;
        emailError = result.emailError;
      }

      await supabase
        .from("onboarding_submissions")
        .update(emailSent ? { email_sent_at: new Date().toISOString(), email_error: null } : { email_error: emailError })
        .eq("id", body.submissionId);
      if (emailError) console.error(`Client onboarding email error: ${emailError}`);

      return c.json({ success: true, id: body.submissionId, emailSent });
    } catch (err: any) {
      console.error(`Client onboarding submit error: ${err?.message ?? err}`);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  });
}
