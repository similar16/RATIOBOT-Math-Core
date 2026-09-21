begin;
select set_config('bank.class',(select class_id::text from public.class_members where role='student' group by class_id having count(*)>=2 limit 1),true);
select set_config('bank.teacher',(select user_id::text from public.class_members where class_id=current_setting('bank.class')::uuid and role='teacher' limit 1),true);
select set_config('bank.student',(select user_id::text from public.class_members where class_id=current_setting('bank.class')::uuid and role='student' order by user_id limit 1),true);
select set_config('bank.peer',(select user_id::text from public.class_members where class_id=current_setting('bank.class')::uuid and role='student' and user_id<>current_setting('bank.student')::uuid limit 1),true);
select set_config('request.jwt.claim.sub',current_setting('bank.teacher'),true);
set local role authenticated;
insert into public.question_bank(title,body,hints,steps,answer,reviewed) values ('bank-test-1','Compute 1+1','["Think"]','["Add"]','2',true),('bank-test-2','Compute 2+2','["Think"]','["Add"]','4',true);
select set_config('bank.ids',(select array_agg(id)::text from public.question_bank where title in ('bank-test-1','bank-test-2')),true);
select set_config('bank.set',public.publish_bank_questions(current_setting('bank.class')::uuid,'1998-01-01',current_setting('bank.ids')::uuid[])::text,true);
do $$ begin
 if (select count(*) from public.daily_challenge_solutions where set_id=current_setting('bank.set')::uuid)<>2 then raise exception 'solutions missing';end if;
 if exists(select 1 from public.daily_challenge_sets where id=current_setting('bank.set')::uuid and (questions->0 ? 'answer' or questions->1 ? 'answer')) then raise exception 'answer leaked in public snapshot';end if;
 begin perform public.publish_bank_questions(current_setting('bank.class')::uuid,'1998-01-01',current_setting('bank.ids')::uuid[]);raise exception 'existing publication overwritten';exception when unique_violation then null;end;
 update public.question_bank set body='Changed in bank' where id=any(current_setting('bank.ids')::uuid[]);
 if exists(select 1 from public.daily_challenge_sets where id=current_setting('bank.set')::uuid and questions::text like '%Changed in bank%') then raise exception 'published snapshot changed';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('bank.student'),true);
do $$ begin
 if exists(select 1 from public.question_bank) then raise exception 'student reads bank';end if;
 if exists(select 1 from public.daily_challenge_solutions where set_id=current_setting('bank.set')::uuid) then raise exception 'student sees solution before submission';end if;
 begin perform public.publish_bank_questions(current_setting('bank.class')::uuid,'1998-01-02',current_setting('bank.ids')::uuid[]);exception when raise_exception then if sqlerrm<>'只能向自己管理的班级发布' then raise;end if;end;
 begin insert into public.question_bank(body) values('student write');raise exception 'student can write bank';exception when insufficient_privilege then null;end;
end $$;
insert into public.daily_challenge_answers(set_id,user_id,slot,answer) values(current_setting('bank.set')::uuid,auth.uid(),0,'2');
do $$ begin
 if (select count(*) from public.daily_challenge_solutions where set_id=current_setting('bank.set')::uuid)<>1 then raise exception 'per-question answer gate failed';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('bank.peer'),true);
do $$ begin if exists(select 1 from public.daily_challenge_solutions where set_id=current_setting('bank.set')::uuid) then raise exception 'peer uses another submission';end if;end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin if exists(select 1 from public.question_bank) or exists(select 1 from public.daily_challenge_solutions where set_id=current_setting('bank.set')::uuid) then raise exception 'outsider read';end if;end $$;
set local role anon;
do $$ begin begin perform 1 from public.question_bank;raise exception 'anon bank read';exception when insufficient_privilege then null;end;begin perform 1 from public.daily_challenge_solutions;raise exception 'anon solution read';exception when insufficient_privilege then null;end;end $$;
rollback;
select 'PASS bank owner, student/anon denial, atomic publish, collision prevention, immutable snapshots and per-user/per-question submitted-answer gate; rolled back' result;
