import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
import { registerClientOnboarding } from "./client_onboarding.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes (global)
app.use(
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Client onboarding questionnaires (/onboarding/:slug)
registerClientOnboarding(app);

// Health check endpoint
app.get("*/health", (c) => {
  return c.json({ status: "ok" });
});

const escapeHtml = (value: unknown) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

// Customer-specific discovery onboarding submission
app.post("*/onboarding-discovery", async (c) => {
  try {
    const body = await c.req.json();
    const { answers = {}, sections = [], lang = "de" } = body;

    const id = `discovery_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const submissionData = { ...body, createdAt: new Date().toISOString(), type: "client-discovery" };

    await kv.set(id, JSON.stringify(submissionData));

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("NOTIFICATION_EMAIL");

    if (!resendApiKey || !toEmail) {
      console.error(`Discovery email configuration missing: resendApiKey=${!!resendApiKey}, toEmail=${!!toEmail}`);
      return c.json({
        success: false,
        id,
        stored: true,
        emailSent: false,
        error: "Discovery saved, but email configuration is missing on server",
      });
    }

    const sectionHtml = Array.isArray(sections) ? sections.map((section: any, index: number) => {
      const questions = Array.isArray(section.questions) ? section.questions : [];
      const questionHtml = questions.map((question: any) => {
        const answerKey = `${section.id}.${question.id}`;
        const answer = answers[answerKey];
        return `
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #1d1d1f;">${escapeHtml(question.en)}</p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #86868b;">${escapeHtml(question.de)}</p>
            <p style="margin: 0; white-space: pre-wrap; color: #1d1d1f;">${escapeHtml(answer || "No answer provided")}</p>
          </div>
        `;
      }).join("");

      return `
        <div style="margin-top: 24px; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff;">
          <p style="margin: 0 0 4px 0; color: #007aff; font-size: 12px; font-weight: 800; letter-spacing: 0.08em;">${String(index + 1).padStart(2, "0")}</p>
          <h3 style="margin: 0; font-size: 18px; color: #1d1d1f;">${escapeHtml(section.enTitle)} / ${escapeHtml(section.deTitle)}</h3>
          ${questionHtml}
        </div>
      `;
    }).join("") : "";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Nüll Studio <onboarding@resend.dev>",
        to: toEmail,
        subject: "NEW DISCOVERY ONBOARDING: Client Website Brief",
        html: `
          <div style="font-family: sans-serif; max-width: 760px; padding: 32px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #fff; color: #1d1d1f; line-height: 1.5;">
            <h2 style="color: #007aff; margin-top: 0; font-size: 24px;">Client Discovery Onboarding</h2>
            <p style="color: #86868b; font-size: 14px;">A customer-specific discovery form has been submitted.</p>
            <p style="font-size: 13px; color: #86868b;"><strong>Language:</strong> ${escapeHtml(lang)}</p>
            ${sectionHtml}
            <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 32px 0;">
            <p style="font-size: 12px; color: #86868b; text-align: center;">
              Internal Discovery ID: ${id}<br>
              Submitted at: ${new Date(submissionData.createdAt).toLocaleString('de-DE')}
            </p>
          </div>
        `,
      }),
    });

    const resendData = await resendRes.json().catch(() => ({}));
    if (!resendRes.ok) {
      console.error("Resend Discovery API Error:", resendData);
      return c.json({ success: false, error: JSON.stringify(resendData), id, stored: true, emailSent: false });
    }

    return c.json({ success: true, id, stored: true, emailSent: true });
  } catch (err: any) {
    console.error(`Discovery Onboarding Submission Error: ${err}`);
    return c.json({ error: err?.message || "Internal server error" }, 500);
  }
});

app.post("*/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      name, email, phone, city, practiceArea, 
      hasWebsite, websiteUrl, message, 
      packageName, setupPrice, monthlyPrice 
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !city) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const id = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const submissionData = {
      name,
      email,
      phone,
      city,
      practiceArea,
      hasWebsite,
      websiteUrl,
      message,
      packageName,
      setupPrice,
      monthlyPrice,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Database (KV Store)
    await kv.set(id, JSON.stringify(submissionData));

    // 2. Send Email Notification via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("NOTIFICATION_EMAIL");

    if (resendApiKey && toEmail) {
      try {
        console.log(`Attempting to send contact email to ${toEmail} for client ${name}`);
        const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
        const validReplyTo = (email && isValidEmail(email)) ? email : toEmail;

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Null Lead <onboarding@resend.dev>",
            to: toEmail,
            reply_to: validReplyTo,
            subject: `New Lead: ${name} (${city}) - ${packageName || 'Inquiry'}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #fff; color: #1d1d1f;">
                <h2 style="color: #007aff; margin-top: 0; font-size: 20px;">New Website Inquiry</h2>
                
                ${packageName ? `
                <div style="margin: 24px 0; padding: 24px; background-color: #007aff; border-radius: 16px; color: #fff;">
                  <p style="margin: 0; font-size: 12px; text-transform: uppercase; font-weight: bold; opacity: 0.8; letter-spacing: 0.05em;">Selected Package</p>
                  <h3 style="margin: 4px 0 16px 0; font-size: 28px; color: #fff; font-weight: 800;">${packageName}</h3>
                  <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; opacity: 0.8; font-weight: bold;">Monthly Retainer</p>
                    <p style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900;">€${monthlyPrice}<span style="font-size: 14px; font-weight: 400; opacity: 0.8;"> /mo</span></p>
                  </div>
                  <p style="margin: 16px 0 0 0; font-size: 13px; font-style: italic; opacity: 0.9;">Includes Maintenance, Hosting & Ongoing Support</p>
                </div>
                ` : ''}

                <div style="margin-top: 24px; padding: 20px; background-color: #f5f5f7; border-radius: 12px;">
                  <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 0 0 12px 0;"><strong>Phone:</strong> ${phone}</p>
                  <p style="margin: 0 0 12px 0;"><strong>City:</strong> ${city}</p>
                  <p style="margin: 0 0 12px 0;"><strong>Practice Area:</strong> ${practiceArea || 'N/A'}</p>
                  ${message ? `<p style="margin: 0 0 12px 0;"><strong>Message:</strong> ${message}</p>` : ''}
                  <p style="margin: 0 0 12px 0;"><strong>Has Website:</strong> ${hasWebsite === 'yes' ? 'Yes' : 'No'}</p>
                  ${hasWebsite === 'yes' ? `<p style="margin: 0;"><strong>Website URL:</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>` : ''}
                </div>
                <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 24px 0;">
                <p style="font-size: 12px; color: #86868b; text-align: center;">
                  Internal ID: ${id}<br>
                  Received at: ${new Date(submissionData.createdAt).toLocaleString('de-DE')}
                </p>
              </div>
            `,
          }),
        });

        const resendData = await resendRes.json();
        console.log(`Resend Response Status: ${resendRes.status}`, resendData);
        
        if (!resendRes.ok) {
          console.error("Resend API Contact Error:", resendData);
          return c.json({ success: false, error: resendData, id });
        }
      } catch (err: any) {
        console.error("Critical Email Error:", err);
        return c.json({ success: false, error: err.message, id });
      }
    } else {
      console.error(`Email configuration missing: resendApiKey=${!!resendApiKey}, toEmail=${!!toEmail}`);
      return c.json({ success: false, error: "Email configuration missing on server", id });
    }

    return c.json({ success: true, id });
  } catch (err) {
    console.error(`Submission Error: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);
