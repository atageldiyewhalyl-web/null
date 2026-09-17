import type { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import {
  MAX_BODY_BYTES,
  ONBOARDING_CLIENTS,
  renderSubmissionEmail,
  utf8ToBase64,
  validateBase,
  validateSubmit,
} from "./client_onboarding_email.ts";

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
        const { subject, html } = renderSubmissionEmail({
          clientName: client.name,
          title: definition.title,
          project: definition.project ?? "",
          submissionId: body.submissionId,
          completedAt,
          language: body.language === "tr" ? "tr" : "de",
          contact: body.contact ?? {},
          sections: (definition.sections ?? []).map((s: any) => ({ key: s.key, title: s.title })),
          rows,
        });
        const replyTo = String(body.contact?.email ?? "").trim();
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
          body: JSON.stringify({
            from: '"nüll. Client Onboarding" <onboarding@forms.xn--nll-hoa.com>',
            to: client.recipients,
            ...(replyTo ? { reply_to: replyTo } : {}),
            subject,
            html,
            attachments: [
              {
                filename: `${body.slug}-onboarding-${completedAt.slice(0, 10)}.json`,
                content: utf8ToBase64(JSON.stringify(structured, null, 2)),
              },
            ],
          }),
        });
        if (res.ok) emailSent = true;
        else emailError = JSON.stringify(await res.json().catch(() => ({ status: res.status })));
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
