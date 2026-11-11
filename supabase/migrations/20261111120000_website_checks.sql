-- Website-Check lead magnet (/website-check).
-- Written only by the make-server-ea5edff4 edge function (service role).
-- RLS on, no policies: the anon key can't read or write any of this.

create table if not exists public.website_checks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'queued' check (status in ('queued', 'done', 'failed')),

  -- What the visitor entered
  url text not null,
  final_url text,
  email text not null,
  trade text,
  city text,

  -- Follow-up emails only with this separate opt-in (UWG § 7). Stored with the exact wording shown.
  marketing_opt_in boolean not null default false,
  marketing_opt_in_text text,

  -- Abuse limits: hashed, never the raw IP
  ip_hash text,
  user_agent text,

  -- Results
  score integer check (score between 0 and 100),
  results jsonb,
  error text,
  email_sent boolean not null default false,
  email_error text,
  notified boolean not null default false
);

create index if not exists website_checks_email_created_idx on public.website_checks (lower(email), created_at desc);
create index if not exists website_checks_ip_created_idx on public.website_checks (ip_hash, created_at desc);
create index if not exists website_checks_created_idx on public.website_checks (created_at desc);

alter table public.website_checks enable row level security;
