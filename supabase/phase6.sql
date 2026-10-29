-- Phase 6: organizer verification, private proof storage, and event moderation
alter table public.events
  add column if not exists is_suspended boolean not null default false;

create index if not exists events_organizer_created_idx
  on public.events (organizer_id, created_at desc);

create table if not exists public.organizer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  institution_name text not null check (char_length(institution_name) between 2 and 150),
  proof_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'suspended')),
  review_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists organizer_applications_status_created_idx
  on public.organizer_applications (status, created_at);

alter table public.organizer_applications enable row level security;
revoke all on public.organizer_applications from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'organizer-verification',
  'organizer-verification',
  false,
  1048576,
  array['application/pdf', 'image/jpeg']
)
on conflict (id) do update
set public = false,
    file_size_limit = 1048576,
    allowed_mime_types = array['application/pdf', 'image/jpeg'];

create or replace function public.get_organizer_event_analytics(
  p_event_id uuid,
  p_organizer_id uuid
) returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'feedbackCount',
      (select count(*) from public.feedback f
       where f.event_id = e.id and f.is_hidden = false),
    'averageRating',
      (select round(avg(f.rating)::numeric, 2) from public.feedback f
       where f.event_id = e.id and f.is_hidden = false and f.rating is not null),
    'moodCounts',
      coalesce((
        select jsonb_object_agg(summary.mood, summary.total)
        from (
          select f.mood, count(*)::integer as total
          from public.feedback f
          where f.event_id = e.id and f.is_hidden = false
          group by f.mood
        ) summary
      ), '{}'::jsonb),
    'categoryCounts',
      coalesce((
        select jsonb_object_agg(summary.category, summary.total)
        from (
          select f.category, count(*)::integer as total
          from public.feedback f
          where f.event_id = e.id and f.is_hidden = false
          group by f.category
        ) summary
      ), '{}'::jsonb),
    'feedback',
      coalesce((
        select jsonb_agg(to_jsonb(recent) order by recent.created_at desc)
        from (
          select f.id, f.message, f.category, f.mood, f.rating, f.created_at
          from public.feedback f
          where f.event_id = e.id and f.is_hidden = false
          order by f.created_at desc
          limit 100
        ) recent
      ), '[]'::jsonb)
  )
  from public.events e
  where e.id = p_event_id and e.organizer_id = p_organizer_id;
$$;
revoke all on function public.get_organizer_event_analytics(uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.get_organizer_event_analytics(uuid, uuid)
  to service_role;

notify pgrst, 'reload schema';
