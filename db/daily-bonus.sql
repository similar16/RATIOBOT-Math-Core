create table public.daily_challenge_rewards (
 user_id uuid not null references auth.users(id) on delete cascade,
 set_id uuid not null references public.daily_challenge_sets(id) on delete cascade,
 slot smallint not null check(slot in (0,1)),
 points integer not null default 5 check(points=5),
 awarded_at timestamptz not null default now(),
 primary key(user_id,set_id,slot)
);
alter table public.daily_challenge_rewards enable row level security;
revoke all on public.daily_challenge_rewards from anon,authenticated;
grant select on public.daily_challenge_rewards to authenticated;
create policy daily_reward_read on public.daily_challenge_rewards for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.daily_challenge_sets s where s.id=set_id and private.is_teacher_in_class(s.class_id)));
alter table public.profiles add column daily_bonus_applied integer not null default 0;
create function private.preserve_daily_bonus() returns trigger language plpgsql security invoker set search_path='' as $$
declare total integer; applied integer; e jsonb;
begin
 select coalesce(sum(points),0) into total from public.daily_challenge_rewards where user_id=new.user_id;
 if tg_table_name='profiles' then
  new.r_points:=greatest(0,coalesce(new.r_points,0)+total-new.daily_bonus_applied);
  new.daily_bonus_applied:=total;
 else
  e:=coalesce(new.economy,'{}');applied:=coalesce((e->>'challengeBonusApplied')::integer,0);
  new.economy:=e||jsonb_build_object('credits',greatest(0,coalesce((e->>'credits')::integer,0)+total-applied),'lifetimeCredits',greatest(0,coalesce((e->>'lifetimeCredits')::integer,0)+total-applied),'challengeBonusApplied',total);
 end if;
 return new;
end $$;
revoke all on function private.preserve_daily_bonus() from public,anon,authenticated;
create trigger preserve_daily_profile_bonus before insert or update of r_points,daily_bonus_applied on public.profiles for each row execute function private.preserve_daily_bonus();
create trigger preserve_daily_snapshot_bonus before insert or update of economy on public.progress_snapshots for each row execute function private.preserve_daily_bonus();
-- Only this non-exposed trigger may create reward entries. Client timestamps are ignored.
create function private.award_daily_challenge() returns trigger language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if auth.uid() is null or auth.uid()<>new.user_id then return new;end if;
 if not exists(select 1 from public.daily_challenge_sets s join public.class_members m on m.class_id=s.class_id where s.id=new.set_id and s.published and s.challenge_date=(now() at time zone 'Asia/Shanghai')::date and m.user_id=new.user_id and m.role='student') then return new;end if;
 insert into public.daily_challenge_rewards(user_id,set_id,slot) values(new.user_id,new.set_id,new.slot) on conflict do nothing;
 get diagnostics n=row_count;
 if n=1 then
  update public.profiles set r_points=r_points where user_id=new.user_id;
  update public.progress_snapshots set economy=economy where user_id=new.user_id;
 end if;
 return new;
end $$;
revoke all on function private.award_daily_challenge() from public,anon,authenticated;
create trigger award_daily_challenge after insert on public.daily_challenge_answers for each row execute function private.award_daily_challenge();
