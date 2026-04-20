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

// Onboarding form submission (Detailed project kick-off)
app.post("*/onboarding", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      name, email, firm, phone, city, 
      selectedServices, selectedAreas, customAreas,
      websiteDetails, seoDetails, audienceData, designData, logisticsData,
      pdfBase64
    } = body;

    const id = `onboard_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const submissionData = { ...body, createdAt: new Date().toISOString() };

    // 1. Save to Database (KV Store) for tracking
    await kv.set(id, JSON.stringify(submissionData));

    // 2. Send Email Notification via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("NOTIFICATION_EMAIL");

    if (resendApiKey && toEmail) {
      try {
        const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
        const validReplyTo = (email && isValidEmail(email)) ? email : toEmail;

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Nüll Studio <onboarding@resend.dev>",
            to: toEmail,
            reply_to: validReplyTo,
            subject: `NEW PROJECT: ${firm || name || 'Client'} (${(selectedServices || []).join(', ')})`,
            attachments: pdfBase64 ? [
              {
                filename: `Nuell_Brief_${(firm || name || 'Project').replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.pdf`,
                content: pdfBase64,
              }
            ] : [],
            html: `
              <div style="font-family: sans-serif; max-width: 700px; padding: 32px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #fff; color: #1d1d1f; line-height: 1.5;">
                <h2 style="color: #007aff; margin-top: 0; font-size: 24px;">Project Kick-off Brief</h2>
                <p style="color: #86868b; font-size: 14px;">A new client has completed the onboarding flow.</p>
                
                <!-- Section: Identity -->
                <div style="margin-top: 32px; padding: 24px; background-color: #f5f5f7; border-radius: 16px;">
                  <h3 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #d2d2d7; padding-bottom: 8px;">1. Client Identity</h3>
                  <p style="margin: 12px 0 0 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 8px 0 0 0;"><strong>Firm:</strong> ${firm || 'N/A'}</p>
                  <p style="margin: 8px 0 0 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 8px 0 0 0;"><strong>Phone:</strong> ${phone}</p>
                  <p style="margin: 8px 0 0 0;"><strong>City:</strong> ${city}</p>
                </div>

                <!-- Section: Scope -->
                <div style="margin-top: 24px; padding: 24px; border: 1px solid #f5f5f7; border-radius: 16px;">
                  <h3 style="margin-top: 0; font-size: 16px;">2. Project Scope</h3>
                  <p><strong>Service Type:</strong> ${(selectedServices && Array.isArray(selectedServices)) ? selectedServices.join(', ').toUpperCase() : 'N/A'}</p>
                  <p><strong>Law Areas:</strong> ${[...(selectedAreas || []), ...(customAreas || [])].filter(Boolean).join(', ')}</p>
                </div>

                <!-- Section: Website Detail -->
                ${websiteDetails ? `
                <div style="margin-top: 24px; padding: 24px; border: 1px solid #f5f5f7; border-radius: 16px;">
                  <h3 style="margin-top: 0; font-size: 16px;">3. Website Architecture</h3>
                  <p><strong>Site Type:</strong> ${websiteDetails.siteType}</p>
                  <p><strong>Architecture:</strong> ${websiteDetails.architecture?.join(', ')}</p>
                  <p><strong>Requested Extras:</strong> ${websiteDetails.extras?.join(', ')}</p>
                  <p><strong>Existing Site:</strong> ${websiteDetails.existingSiteUrl || 'None'}</p>
                  <p><strong>Dislikes/Missing:</strong> ${websiteDetails.dislikes || 'None'}</p>
                </div>
                ` : ''}

                <!-- Section: Design -->
                ${designData ? `
                <div style="margin-top: 24px; padding: 24px; border: 1px solid #f5f5f7; border-radius: 16px;">
                  <h3 style="margin-top: 0; font-size: 16px;">4. Design Vision</h3>
                  <p><strong>Style:</strong> ${designData.style}</p>
                  <p><strong>Tone (1-100):</strong> ${designData.tone}</p>
                  <p><strong>Colors:</strong> ${designData.colors}</p>
                  <p><strong>Inspiration References:</strong> ${designData.references || 'None'}</p>
                </div>
                ` : ''}

                <!-- Section: Logistics -->
                ${logisticsData ? `
                <div style="margin-top: 24px; padding: 24px; background-color: #fff9f9; border: 1px solid #ffebeb; border-radius: 16px;">
                  <h3 style="margin-top: 0; font-size: 16px; color: #ff2d55;">5. Logistics & Ready Assets</h3>
                  <p><strong>Deadline:</strong> ${logisticsData.deadline}</p>
                  <p><strong>Domain Status:</strong> ${logisticsData.domainStatus}</p>
                  ${logisticsData.domainName ? `<p><strong>Requested Domain:</strong> ${logisticsData.domainName}</p>` : ''}
                  <p><strong>Assets Ready:</strong> ${logisticsData.contentReady?.join(', ')}</p>
                  <p><strong>Extra Project Notes:</strong> ${logisticsData.extraNotes || 'None'}</p>
                </div>
                ` : ''}

                <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 32px 0;">
                <p style="font-size: 12px; color: #86868b; text-align: center;">
                  Internal Project ID: ${id}<br>
                  Submitted at: ${new Date(submissionData.createdAt).toLocaleString('de-DE')}
                </p>
              </div>
            `,
          }),
        });
        
        if (!resendRes.ok) {
          const resendErr = await resendRes.json();
          console.error("Resend API Error:", resendErr);
          return c.json({ success: false, error: resendErr, id });
        }
      } catch (err) {
        console.error("Critical Onboarding Email Error:", err);
        return c.json({ success: false, error: err.message, id });
      }
    }

    return c.json({ success: true, id });
  } catch (err) {
    console.error(`Onboarding Submission Error: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
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