-- Class-level appearance customization: simple level avatars and square badge artwork.
create table if not exists public.class_visual_settings(
  class_id uuid primary key references public.classes(id) on delete cascade,
  avatars jsonb not null default '[]'::jsonb,
  badge_images jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.class_visual_settings enable row level security;
revoke all on public.class_visual_settings from anon,authenticated;
grant select,insert,update on public.class_visual_settings to authenticated;

drop policy if exists class_visual_read on public.class_visual_settings;
create policy class_visual_read on public.class_visual_settings
for select to authenticated using(private.is_member_of_class(class_id));

drop policy if exists class_visual_insert on public.class_visual_settings;
create policy class_visual_insert on public.class_visual_settings
for insert to authenticated with check(
  updated_by=(select auth.uid()) and private.is_teacher_in_class(class_id)
);

drop policy if exists class_visual_update on public.class_visual_settings;
create policy class_visual_update on public.class_visual_settings
for update to authenticated using(private.is_teacher_in_class(class_id))
with check(
  updated_by=(select auth.uid()) and private.is_teacher_in_class(class_id)
);
