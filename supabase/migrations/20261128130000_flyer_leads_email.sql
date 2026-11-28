-- Flyer funnel: the score is e-mailed instead of shown on screen (28 Nov 2026), so the lead now gives an e-mail address.
alter table public.flyer_leads add column if not exists email text;
alter table public.flyer_leads add column if not exists email_sent boolean not null default false;
alter table public.flyer_leads add column if not exists email_error text;
