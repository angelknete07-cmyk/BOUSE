-- BOUSE — persistance de compte et quotas du mentor.
-- À appliquer sur un projet Supabase dédié, après inspection (aucun projet
-- existant ne doit être modifié sans relecture préalable).

-- 1. Copie synchronisée de l'état d'apprentissage --------------------------
-- L'application reste locale d'abord : le navigateur valide l'état
-- (parseState) et le serveur conserve une copie par utilisateur. Le document
-- JSON suit le format versionné de l'application (schemaVersion 1).
create table if not exists public.learning_states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  schema_version integer not null check (schema_version = 1),
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  -- Garde-fou de taille : une sauvegarde normale pèse quelques dizaines de ko.
  constraint learning_states_size check (pg_column_size(state) < 1048576)
);

alter table public.learning_states enable row level security;

create policy "learning_states_select_own" on public.learning_states
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "learning_states_insert_own" on public.learning_states
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "learning_states_update_own" on public.learning_states
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "learning_states_delete_own" on public.learning_states
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Révision et horodatage tenus par le serveur, pas par le client.
create or replace function public.learning_states_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.revision := old.revision + 1;
  else
    new.revision := 1;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists learning_states_touch on public.learning_states;
create trigger learning_states_touch
  before insert or update on public.learning_states
  for each row execute function public.learning_states_touch();

-- 2. Quotas du mentor ------------------------------------------------------
-- Écrit uniquement par la fonction serveur (rôle service) ; chaque
-- utilisateur peut lire sa propre consommation.
create table if not exists public.mentor_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  requests integer not null default 0 check (requests >= 0),
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  primary key (user_id, day)
);

alter table public.mentor_usage enable row level security;

create policy "mentor_usage_select_own" on public.mentor_usage
  for select to authenticated using ((select auth.uid()) = user_id);

-- Incrément atomique appelé par la fonction serveur avec la clé de service.
create or replace function public.mentor_record_usage(
  p_user uuid,
  p_input integer,
  p_output integer
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.mentor_usage (user_id, day, requests, input_tokens, output_tokens)
  values (p_user, (now() at time zone 'utc')::date, 1, greatest(p_input, 0), greatest(p_output, 0))
  on conflict (user_id, day) do update set
    requests = public.mentor_usage.requests + 1,
    input_tokens = public.mentor_usage.input_tokens + greatest(excluded.input_tokens, 0),
    output_tokens = public.mentor_usage.output_tokens + greatest(excluded.output_tokens, 0);
$$;

revoke all on function public.mentor_record_usage(uuid, integer, integer) from public, anon, authenticated;

-- 3. Suppression de compte -------------------------------------------------
-- Supprime l'utilisateur courant ; les lignes liées partent en cascade.
-- Les données locales du navigateur ne sont pas touchées.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;
  delete from auth.users where id = current_user_id;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
