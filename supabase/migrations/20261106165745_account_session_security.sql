-- No user data is removed. Explicit grants and live session checks protect
-- direct API access, including JWTs retained after account deletion/sign-out.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create or replace function private.has_live_session()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.sessions s
    where s.user_id = (select auth.uid())
      and s.id::text = (select auth.jwt()->>'session_id')
      and (s.not_after is null or s.not_after > now())
  );
$$;
revoke all on function private.has_live_session() from public, anon;
grant execute on function private.has_live_session() to authenticated;

-- Restrictive policy combines with existing ownership policies (AND).
create policy learning_states_live_session on public.learning_states
  as restrictive for all to authenticated
  using ((select private.has_live_session()))
  with check ((select private.has_live_session()));
create policy mentor_usage_live_session on public.mentor_usage
  as restrictive for all to authenticated
  using ((select private.has_live_session()))
  with check ((select private.has_live_session()));
revoke all on public.learning_states, public.mentor_usage from anon;
grant select, insert, update, delete on public.learning_states to authenticated;
revoke all on public.mentor_usage from authenticated;
grant select on public.mentor_usage to authenticated;
grant all on public.learning_states, public.mentor_usage to service_role;
grant execute on function public.mentor_record_usage(uuid, integer, integer) to service_role;
revoke all on function public.learning_states_touch() from public, anon, authenticated;

create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not private.has_live_session() then
    raise exception 'Session active requise' using errcode = '42501';
  end if;
  -- Cascades remove sessions/refresh tokens, learning data and quota records.
  delete from auth.users where id = current_user_id;
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
