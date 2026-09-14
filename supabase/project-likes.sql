-- Szymon Keller — contador público de likes por proyecto
-- Ejecutar una vez en Supabase: SQL Editor > New query.

create table if not exists public.project_likes (
  project_id text not null check (char_length(project_id) between 1 and 100),
  visitor_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, visitor_id)
);

alter table public.project_likes enable row level security;

-- Las lecturas y cambios se realizan únicamente a través de las funciones siguientes.
revoke all on table public.project_likes from anon, authenticated;

create or replace function public.project_like_summaries(p_project_ids text[])
returns table (project_id text, likes bigint, liked boolean)
language sql
security definer
set search_path = public
as $$
  select
    ids.project_id,
    count(l.visitor_id)::bigint as likes,
    bool_or(l.visitor_id = auth.uid()) as liked
  from unnest(p_project_ids) as ids(project_id)
  left join public.project_likes l on l.project_id = ids.project_id
  group by ids.project_id;
$$;

create or replace function public.toggle_project_like(p_project_id text)
returns table (project_id text, likes bigint, liked boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_visitor_id uuid := auth.uid();
  v_liked boolean;
begin
  if v_visitor_id is null then
    raise exception 'Authentication required';
  end if;

  if char_length(trim(p_project_id)) = 0 or char_length(p_project_id) > 100 then
    raise exception 'Invalid project id';
  end if;

  if exists (
    select 1 from public.project_likes
    where project_id = p_project_id and visitor_id = v_visitor_id
  ) then
    delete from public.project_likes
    where project_id = p_project_id and visitor_id = v_visitor_id;
    v_liked := false;
  else
    insert into public.project_likes (project_id, visitor_id)
    values (p_project_id, v_visitor_id);
    v_liked := true;
  end if;

  return query
  select
    p_project_id,
    count(l.visitor_id)::bigint,
    v_liked
  from public.project_likes l
  where l.project_id = p_project_id
  group by p_project_id;

  if not found and v_liked = false then
    return query select p_project_id, 0::bigint, false;
  end if;
end;
$$;

revoke all on function public.project_like_summaries(text[]) from public;
revoke all on function public.toggle_project_like(text) from public;
grant execute on function public.project_like_summaries(text[]) to authenticated;
grant execute on function public.toggle_project_like(text) to authenticated;
