-- nüll. client onboarding questionnaires (replaces Typeform).
-- Written only by the make-server-ea5edff4 edge function (service role).
-- RLS is on with no policies, so the public anon key cannot read or write.

create table if not exists public.onboarding_questionnaires (
  id text not null,
  version integer not null,
  client_slug text not null,
  client_name text not null,
  project text,
  title text not null,
  -- Snapshot of the questionnaire config at submit time, so old submissions
  -- still render with the questions they were actually asked.
  definition jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id, version)
);

create table if not exists public.onboarding_submissions (
  id uuid primary key,
  questionnaire_id text not null,
  questionnaire_version integer not null,
  client_slug text not null,
  client_name text not null,
  project text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  current_step text,
  current_step_index integer,
  -- Language the client filled the form in (answers/free text are in this language).
  language text not null default 'de',
  contact jsonb not null default '{}'::jsonb,
  -- Raw answers keyed by question id (restorable UI state).
  answers jsonb not null default '{}'::jsonb,
  -- AI-friendly output: { client, contact, social: {...}, website: {...} }.
  structured jsonb,
  user_agent text,
  device jsonb,
  resume_token_hash text not null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  email_sent_at timestamptz,
  email_error text
);

create index if not exists onboarding_submissions_client_idx
  on public.onboarding_submissions (client_slug, status, updated_at desc);

create table if not exists public.onboarding_submission_answers (
  submission_id uuid not null references public.onboarding_submissions (id) on delete cascade,
  question_id text not null,
  question_key text not null,
  section_key text not null,
  question_label text not null,
  number integer not null,
  is_follow_up boolean not null default false,
  position integer not null,
  value jsonb,
  value_text text,
  primary key (submission_id, question_id)
);

create index if not exists onboarding_submission_answers_key_idx
  on public.onboarding_submission_answers (section_key, question_key);

alter table public.onboarding_questionnaires enable row level security;
alter table public.onboarding_submissions enable row level security;
alter table public.onboarding_submission_answers enable row level security;
