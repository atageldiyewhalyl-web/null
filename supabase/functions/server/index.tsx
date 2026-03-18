import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ea5edff4/health", (c) => {
  return c.json({ status: "ok" });
});

// Contact form submission
app.post("/make-server-ea5edff4/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: "Missing required fields: name, email, message" }, 400);
    }

    const id = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await kv.set(id, JSON.stringify({
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    }));

    console.log(`Contact message saved with id: ${id}`);
    return c.json({ success: true, id });
  } catch (err) {
    console.log(`Error saving contact message: ${err}`);
    return c.json({ error: `Failed to save contact message: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);