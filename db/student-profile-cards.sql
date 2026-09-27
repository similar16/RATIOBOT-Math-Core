-- Student personal mission cards and self-uploaded square avatars.
alter table public.profiles
  add column if not exists custom_avatar text,
  add column if not exists profile_card jsonb not null default '{"theme":"sun","title":"数学任务员","featured_badges":[],"show_recent":true}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname='profiles_custom_avatar_size'
      and conrelid='public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_custom_avatar_size
      check (custom_avatar is null or length(custom_avatar) <= 450000);
  end if;
end $$;

create or replace view public.class_public_cards with (security_invoker=true) as
select
  cm.class_id,
  p.user_id,
  p.display_name,
  p.avatar_key,
  p.outfit_key,
  p.level,
  p.base_level,
  p.streak,
  p.badge_count,
  coalesce(dc.checked_in,false) as today_checked_in,
  coalesce(dc.full_clear,false) as today_full_clear,
  cm.student_code,
  coalesce(dc.points,0) as today_points,
  p.public_training,
  p.updated_at,
  p.custom_avatar,
  p.profile_card
from public.class_members cm
join public.profiles p on p.user_id=cm.user_id
left join public.daily_checkins dc
  on dc.user_id=cm.user_id
 and dc.checkin_date=(now() at time zone 'Asia/Shanghai')::date
where cm.role='student' and p.public_card_enabled=true;


-- 2026-09-28: avatar uploads are disabled.
-- custom_avatar now stores only one of ten built-in portrait asset paths.
update public.profiles
set custom_avatar=null
where custom_avatar is not null
  and custom_avatar not in (
    'assets/student-avatar-01.svg','assets/student-avatar-02.svg',
    'assets/student-avatar-03.svg','assets/student-avatar-04.svg',
    'assets/student-avatar-05.svg','assets/student-avatar-06.svg',
    'assets/student-avatar-07.svg','assets/student-avatar-08.svg',
    'assets/student-avatar-09.svg','assets/student-avatar-10.svg'
  );
alter table public.profiles drop constraint if exists profiles_custom_avatar_whitelist;
alter table public.profiles add constraint profiles_custom_avatar_whitelist
check (
  custom_avatar is null or custom_avatar in (
    'assets/student-avatar-01.svg','assets/student-avatar-02.svg',
    'assets/student-avatar-03.svg','assets/student-avatar-04.svg',
    'assets/student-avatar-05.svg','assets/student-avatar-06.svg',
    'assets/student-avatar-07.svg','assets/student-avatar-08.svg',
    'assets/student-avatar-09.svg','assets/student-avatar-10.svg'
  )
);
update public.class_visual_settings set avatars='[]'::jsonb where avatars <> '[]'::jsonb;
