-- Phase 5: public feedback wall, reactions, replies, and reporting
alter table public.feedback
  add column if not exists is_hidden boolean not null default false;
alter table public.replies
  add column if not exists is_hidden boolean not null default false;

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  persona_id uuid not null references public.personas(id) on delete cascade,
  emoji text not null check (emoji in ('love', 'fire', 'laugh', 'clap', 'chai')),
  created_at timestamptz not null default now()
);
create index if not exists reactions_feedback_idx
  on public.reactions (feedback_id);

-- Keep the latest reaction per persona and feedback before enforcing the one-reaction limit.
delete from public.reactions older
using public.reactions newer
where older.feedback_id = newer.feedback_id
  and older.persona_id = newer.persona_id
  and (older.created_at, older.ctid) < (newer.created_at, newer.ctid);

alter table public.reactions
  drop constraint if exists reactions_feedback_id_persona_id_emoji_key;
create unique index if not exists reactions_feedback_persona_idx
  on public.reactions (feedback_id, persona_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  reporter_persona_id uuid not null references public.personas(id) on delete cascade,
  reason text not null check (reason in ('spam', 'abuse', 'hate', 'personal_info', 'other')),
  created_at timestamptz not null default now()
);
create unique index if not exists reports_feedback_reporter_idx
  on public.reports (feedback_id, reporter_persona_id)
  where reply_id is null;
create unique index if not exists reports_reply_reporter_idx
  on public.reports (reply_id, reporter_persona_id)
  where reply_id is not null;

alter table public.reactions enable row level security;
alter table public.reports enable row level security;
revoke all on public.reactions, public.reports from public, anon, authenticated;

notify pgrst, 'reload schema';
