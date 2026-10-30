-- Phase 7: limit persona creation to one claim per browser token
create table if not exists public.persona_device_claims (
  device_token_hash text primary key,
  persona_id uuid not null references public.personas(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.persona_device_claims enable row level security;
revoke all on public.persona_device_claims from public, anon, authenticated;

notify pgrst, 'reload schema';
