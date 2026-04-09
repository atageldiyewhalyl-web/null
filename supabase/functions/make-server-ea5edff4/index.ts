import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
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

// Health check endpoint
app.get("*/health", (c) => {
  return c.json({ status: "ok" });
});

// Contact form submission
app.post("*/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, city, practiceArea, hasWebsite, websiteUrl } = body;

    // Validate required fields
    if (!name || !email || !phone || !city || !practiceArea) {
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
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Database (KV Store)
    await kv.set(id, JSON.stringify(submissionData));

    // 2. Send Email Notification via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("NOTIFICATION_EMAIL");

    if (resendApiKey && toEmail) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Nüll Contact <onboarding@resend.dev>",
            to: toEmail,
            reply_to: email, // Direct reply to lead
            subject: `New Lead: ${name} (${city})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #fff; color: #1d1d1f;">
                <h2 style="color: #007aff; margin-top: 0; font-size: 20px;">New Website Inquiry</h2>
                <div style="margin-top: 24px; padding: 20px; background-color: #f5f5f7; border-radius: 12px;">
                  <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 0 0 12px 0;"><strong>Phone:</strong> ${phone}</p>
                  <p style="margin: 0 0 12px 0;"><strong>City:</strong> ${city}</p>
                  <p style="margin: 0 0 12px 0;"><strong>Practice Area:</strong> ${practiceArea}</p>
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
      } catch (err) {
        console.error("Critical Email Error:", err);
      }
    }

    return c.json({ success: true, id });
  } catch (err) {
    console.error(`Submission Error: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);