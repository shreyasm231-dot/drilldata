create type public.app_role as enum ('staff','resident');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'staff'));

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  age int,
  household_size int,
  zip_code text,
  preferred_language text,
  employment text,
  monthly_income text,
  situation text,
  needs text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "read own or staff" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'staff'));
create policy "staff review" on public.profiles for update to authenticated using (public.has_role(auth.uid(),'staff')) with check (public.has_role(auth.uid(),'staff'));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data,'{}'::jsonb);
begin
  insert into public.profiles (id, full_name, age, household_size, zip_code, preferred_language, employment, monthly_income, situation, needs)
  values (new.id, coalesce(m->>'full_name',''), nullif(m->>'age','')::int, nullif(m->>'household_size','')::int, m->>'zip_code', m->>'preferred_language', m->>'employment', m->>'monthly_income', left(m->>'situation',2000),
    coalesce(array(select jsonb_array_elements_text(case when jsonb_typeof(m->'needs')='array' then m->'needs' else '[]'::jsonb end)),'{}'));
  insert into public.user_roles (user_id, role) values (new.id, 'resident');
  return new;
exception when others then
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'resident') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();