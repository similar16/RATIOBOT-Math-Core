begin;
select set_config('review.test_class',(select id::text from public.classes where exists(select 1 from public.class_members m where m.class_id=classes.id and m.role='student') limit 1),true);
select set_config('request.jwt.claim.sub',(select created_by::text from public.classes where id=current_setting('review.test_class')::uuid),true);
set local role authenticated;
do $$ declare n int; begin
 update public.classes set review_progress='{"through":1,"dates":{"ch2-1":"2026-09-01"}}' where id=current_setting('review.test_class')::uuid;
 get diagnostics n=row_count;if n<>1 then raise exception 'Owner cannot set progress';end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',(select user_id::text from public.class_members where class_id=current_setting('review.test_class')::uuid and role='student' limit 1),true);
set local role authenticated;
do $$ declare n int; begin
 if not exists(select 1 from public.classes where id=current_setting('review.test_class')::uuid and review_progress->>'through'='1') then raise exception 'Student cannot read own progress';end if;
 update public.classes set review_progress='{"through":47,"dates":{}}' where id=current_setting('review.test_class')::uuid;
 get diagnostics n=row_count;if n<>0 then raise exception 'Student changed progress';end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin if exists(select 1 from public.classes where id=current_setting('review.test_class')::uuid) then raise exception 'Outsider can read progress';end if;end $$;
set local role anon;
do $$ begin if exists(select 1 from public.classes where id=current_setting('review.test_class')::uuid) then raise exception 'Anonymous can read progress';end if;end $$;
rollback;
select 'PASS creator writes, member reads, student write denied, outsider/anon denied; transaction rolled back' as result;
