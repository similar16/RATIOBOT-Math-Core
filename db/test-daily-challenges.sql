begin;
select set_config('daily.class',(select class_id::text from public.class_members where role='student' group by class_id having count(*)>=2 limit 1),true);
select set_config('daily.student',(select user_id::text from public.class_members where class_id=current_setting('daily.class')::uuid and role='student' order by user_id limit 1),true);
select set_config('daily.peer',(select user_id::text from public.class_members where class_id=current_setting('daily.class')::uuid and role='student' and user_id<>current_setting('daily.student')::uuid limit 1),true);
select set_config('daily.teacher',(select user_id::text from public.class_members where class_id=current_setting('daily.class')::uuid and role='teacher' limit 1),true);
select set_config('request.jwt.claim.sub',current_setting('daily.teacher'),true);
set local role authenticated;
insert into public.daily_challenge_sets(class_id,challenge_date,questions) values(current_setting('daily.class')::uuid,'1999-01-01','[{"body":"test one"},{"body":"test two"}]');
select set_config('daily.set',(select id::text from public.daily_challenge_sets where class_id=current_setting('daily.class')::uuid and challenge_date='1999-01-01'),true);
insert into public.daily_challenge_sets(class_id,challenge_date,questions,published) values(current_setting('daily.class')::uuid,'2999-01-01','[{"body":"future"},{"body":"future"}]',true);
select set_config('request.jwt.claim.sub',current_setting('daily.student'),true);
do $$ begin
 if exists(select 1 from public.daily_challenge_sets where id=current_setting('daily.set')::uuid or challenge_date='2999-01-01') then raise exception 'student sees draft/future';end if;
 begin insert into public.daily_challenge_sets(class_id,challenge_date,questions) values(current_setting('daily.class')::uuid,'1999-01-02','[{},{}]');raise exception 'student published';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('daily.teacher'),true);
update public.daily_challenge_sets set published=true where id=current_setting('daily.set')::uuid;
do $$ declare n int;begin
 update public.daily_challenge_sets set published=false where id=current_setting('daily.set')::uuid;get diagnostics n=row_count;if n<>0 then raise exception 'published set mutable';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('daily.student'),true);
do $$ begin if not exists(select 1 from public.daily_challenge_sets where id=current_setting('daily.set')::uuid) then raise exception 'student cannot read published';end if;end $$;
insert into public.daily_challenge_answers(set_id,user_id,slot,answer) values(current_setting('daily.set')::uuid,auth.uid(),0,'42');
update public.daily_challenge_answers set answer='43' where set_id=current_setting('daily.set')::uuid;
select set_config('request.jwt.claim.sub',current_setting('daily.peer'),true);
do $$ declare n int;begin
 if exists(select 1 from public.daily_challenge_answers where set_id=current_setting('daily.set')::uuid) then raise exception 'peer sees answer';end if;
 update public.daily_challenge_answers set answer='tampered' where set_id=current_setting('daily.set')::uuid;get diagnostics n=row_count;if n<>0 then raise exception 'peer changes answer';end if;
 begin insert into public.daily_challenge_answers(set_id,user_id,slot,answer) values(current_setting('daily.set')::uuid,current_setting('daily.student')::uuid,1,'forged');raise exception 'forged answer accepted';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('daily.teacher'),true);
do $$ begin if not exists(select 1 from public.daily_challenge_answers where set_id=current_setting('daily.set')::uuid and answer='43') then raise exception 'teacher cannot read answers';end if;end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin if exists(select 1 from public.daily_challenge_sets where id=current_setting('daily.set')::uuid) or exists(select 1 from public.daily_challenge_answers where set_id=current_setting('daily.set')::uuid) then raise exception 'outsider access';end if;end $$;
set local role anon;
do $$ begin begin perform 1 from public.daily_challenge_sets;raise exception 'anon access';exception when insufficient_privilege then null;end;end $$;
rollback;
select 'PASS teacher publication/lock, draft/future isolation, student own writes, peer/outsider/anon denied, teacher answers; rolled back' result;
