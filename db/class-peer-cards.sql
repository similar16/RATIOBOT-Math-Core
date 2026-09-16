-- Public projection of existing progress; raw snapshots remain self/teacher only.
alter table public.profiles add column if not exists public_training jsonb not null default '{}'::jsonb;
create or replace function private.peer_training_summary(c jsonb,b jsonb,e jsonb,g jsonb)
returns jsonb language sql immutable set search_path = '' as $$
select jsonb_build_object('cores',coalesce(c,'{}'::jsonb),'badges',coalesce(b,'[]'::jsonb),
'modules',coalesce(e->'modules','{}'::jsonb),'games',coalesce(g->'games','0'::jsonb),
'questions',coalesce(g->'questions','0'::jsonb),'history',coalesce((select jsonb_agg(clean order by ord) from (
select ord, (select jsonb_object_agg(key,value) from jsonb_each(item) where key=any(array['at','game','stage','numberType','difficulty','accuracy','avgTime','rGain','abMistakes','totalOps','totalFails','grade','durationSeconds','xp','level'])) as clean
from jsonb_array_elements(coalesce(g->'history','[]'::jsonb)) with ordinality h(item,ord) where ord<=10
) rows),'[]'::jsonb));
$$;
revoke all on function private.peer_training_summary(jsonb,jsonb,jsonb,jsonb) from public;
grant execute on function private.peer_training_summary(jsonb,jsonb,jsonb,jsonb) to authenticated, service_role;
create or replace function private.sync_peer_training() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 update public.profiles set public_training=private.peer_training_summary(new.cores,new.badges,new.economy,new.game_stats) where user_id=new.user_id;
 return new;
end;
$$;
revoke all on function private.sync_peer_training() from public;
drop trigger if exists sync_peer_training on public.progress_snapshots;
create trigger sync_peer_training after insert or update on public.progress_snapshots for each row execute function private.sync_peer_training();
update public.profiles p set public_training=private.peer_training_summary(s.cores,s.badges,s.economy,s.game_stats) from public.progress_snapshots s where s.user_id=p.user_id;
create or replace view public.class_public_cards with (security_invoker=true) as
select cm.class_id,p.user_id,p.display_name,p.avatar_key,p.outfit_key,p.level,p.base_level,p.streak,p.badge_count,
coalesce(dc.checked_in,false) as today_checked_in,coalesce(dc.full_clear,false) as today_full_clear,
cm.student_code,coalesce(dc.points,0) as today_points,p.public_training,p.updated_at
from public.class_members cm join public.profiles p on p.user_id=cm.user_id
left join public.daily_checkins dc on dc.user_id=cm.user_id and dc.checkin_date=(now() at time zone 'Asia/Shanghai')::date
where cm.role='student' and p.public_card_enabled=true;
