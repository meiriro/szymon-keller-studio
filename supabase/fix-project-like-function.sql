-- Corrección de la función de likes. Ejecutar una vez en Supabase: SQL Editor > New query.

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
    select 1 from public.project_likes l
    where l.project_id = p_project_id and l.visitor_id = v_visitor_id
  ) then
    delete from public.project_likes l
    where l.project_id = p_project_id and l.visitor_id = v_visitor_id;
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
