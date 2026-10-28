-- PulseBox schema v1 (Phase 3)
create extension if not exists pgcrypto;

-- EVENTS (organizer_id is nullable so we can seed a demo event; Phase 6 ties it to auth)
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  description text check (char_length(description) <= 2000),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  is_open boolean not null default true,
  event_date date,
  feedback_deadline timestamptz,
  created_at timestamptz not null default now()
);

-- PERSONAS (public: nickname + avatar only)
create table public.personas (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 2 and 40),
  avatar_id smallint not null check (avatar_id >= 0),
  created_at timestamptz not null default now()
);

-- PERSONA CREDENTIALS (private: only a hash of the PulsePass is ever stored)
create table public.persona_credentials (
  persona_id uuid primary key references public.personas(id) on delete cascade,
  credential_hash text not null unique,
  created_at timestamptz not null default now()
);

-- FEEDBACK
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  persona_id uuid not null references public.personas(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 1000),
  category text not null check (category in ('experience', 'suggestion', 'issue')),
  mood text not null check (mood in ('fire', 'love', 'happy', 'meh', 'sad', 'angry')),
  rating smallint check (rating between 1 and 5),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index feedback_event_created_idx on public.feedback (event_id, created_at desc);
create index feedback_persona_idx on public.feedback (persona_id);

-- REPLIES
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  persona_id uuid not null references public.personas(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 500),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index replies_feedback_created_idx on public.replies (feedback_id, created_at);
create index replies_persona_idx on public.replies (persona_id);

-- REACTIONS
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  persona_id uuid not null references public.personas(id) on delete cascade,
  emoji text not null check (emoji in ('love', 'fire', 'laugh', 'clap', 'chai')),
  created_at timestamptz not null default now(),
  unique (feedback_id, persona_id, emoji)
);
create index reactions_feedback_idx on public.reactions (feedback_id);

-- REPORTS
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  reporter_persona_id uuid not null references public.personas(id) on delete cascade,
  reason text not null check (reason in ('spam', 'abuse', 'hate', 'personal_info', 'other')),
  created_at timestamptz not null default now()
);
create unique index reports_feedback_reporter_idx
  on public.reports (feedback_id, reporter_persona_id)
  where reply_id is null;
create unique index reports_reply_reporter_idx
  on public.reports (reply_id, reporter_persona_id)
  where reply_id is not null;

-- ROW LEVEL SECURITY
alter table public.events enable row level security;
alter table public.personas enable row level security;
alter table public.persona_credentials enable row level security;
alter table public.feedback enable row level security;
alter table public.replies enable row level security;
alter table public.reactions enable row level security;
alter table public.reports enable row level security;

-- Public can READ the wall. Nobody can write from the browser.
create policy "public read events" on public.events
  for select to anon, authenticated using (true);
create policy "public read personas" on public.personas
  for select to anon, authenticated using (true);
create policy "public read feedback" on public.feedback
  for select to anon, authenticated using (true);
create policy "public read replies" on public.replies
  for select to anon, authenticated using (true);

-- persona_credentials: deliberately NO policies = no browser access at all
revoke all on public.persona_credentials from anon, authenticated;
revoke all on public.reactions, public.reports from public, anon, authenticated;

-- Defense in depth: no browser writes anywhere (all writes go through our server routes).
-- Phase 7 will re-grant insert/update on events for approved organizers.
revoke insert, update, delete on
  public.events, public.personas, public.feedback, public.replies
from anon, authenticated;

-- DEMO EVENT (your landing page links to /event/demo)
insert into public.events (title, description, slug, is_open, event_date)
values ('PulseBox Demo Fest', 'A demo event to try out the feedback wall.', 'demo', true, current_date);