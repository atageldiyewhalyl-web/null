-- Flyer funnel (/check-flyer): QR code on the printed flyers -> short form -> score on screen -> WhatsApp.
-- Written only by the make-server-ea5edff4 edge function (service role).
-- RLS on, no policies: the anon key can't read or write any of this.

create table if not exists public.flyer_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'queued' check (status in ('queued', 'done', 'failed', 'no_site')),

  -- Which flyer the QR code was on (?f=allgemein / ?f=handwerk)
  source text,

  -- What the visitor entered
  name text not null,
  company text not null,
  phone text not null,
  url text,
  no_website boolean not null default false,
  challenge text, -- "Was ist gerade deine größte Herausforderung?" (optional)
  final_url text,

  -- Contact consent, stored with the exact wording shown next to the checkbox
  consent boolean not null default false,
  consent_text text,

  -- Abuse limits: hashed, never the raw IP
  ip_hash text,
  user_agent text,

  -- Results
  score integer check (score between 0 and 100),
  results jsonb,
  error text,
  notified boolean not null default false
);

create index if not exists flyer_leads_created_idx on public.flyer_leads (created_at desc);
create index if not exists flyer_leads_ip_created_idx on public.flyer_leads (ip_hash, created_at desc);

alter table public.flyer_leads enable row level security;
