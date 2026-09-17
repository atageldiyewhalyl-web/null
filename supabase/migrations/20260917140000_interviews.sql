-- AI interviews: a Claude agent collects client information from a brief + checklist.
-- Written by the `interview` edge function and Agency OS (service role only).
-- RLS on, no policies: the anon key can't read or write any of this.

create table if not exists public.interview_briefs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  client_name text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  version integer not null default 1,
  -- The brief as Halyl wrote it (Markdown with frontmatter).
  markdown text not null,
  -- Client-safe parts the agent may see: context, goal, checklist, rules, settings.
  parsed jsonb not null,
  -- Never sent to the client-facing agent.
  internal_notes text,
  notify_emails text[] not null default array['halyl@xn--nll-hoa.com'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.interview_briefs (id) on delete restrict,
  brief_version integer not null,
  slug text not null,
  client_name text not null,
  language text not null default 'de',
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned')),
  resume_token_hash text not null,
  respondent_name text,
  client_turns integer not null default 0,
  required_total integer not null default 0,
  required_done integer not null default 0,
  busy_until timestamptz,
  transcriptions integer not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  cache_read_tokens bigint not null default 0,
  user_agent text,
  result_md text,
  result_json jsonb,
  email_sent_at timestamptz,
  email_error text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists interview_sessions_brief_idx on public.interview_sessions (brief_id, updated_at desc);
create index if not exists interview_sessions_status_idx on public.interview_sessions (status, updated_at desc);

-- Full API conversation, append-only, in order. `content` is exactly what goes back to Claude.
create table if not exists public.interview_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.interview_sessions (id) on delete cascade,
  seq integer not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  kind text not null check (kind in ('start', 'client', 'status', 'assistant', 'tool_results')),
  content jsonb not null,
  -- Readable text for the chat UI and transcript (null for internal rows).
  visible_text text,
  -- Widget shown with this assistant message (choices / ranking / alternatives).
  ui jsonb,
  created_at timestamptz not null default now(),
  unique (session_id, seq)
);

create table if not exists public.interview_answers (
  session_id uuid not null references public.interview_sessions (id) on delete cascade,
  field_id text not null,
  value text not null,
  quote text,
  updated_at timestamptz not null default now(),
  primary key (session_id, field_id)
);

-- Halyl's internal "ask about this interview" chat in Agency OS.
create table if not exists public.interview_admin_chat (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.interview_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.interview_briefs enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.interview_messages enable row level security;
alter table public.interview_answers enable row level security;
alter table public.interview_admin_chat enable row level security;
