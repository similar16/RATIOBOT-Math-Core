begin;
select set_config('request.jwt.claim.sub',(select user_id::text from public.class_members where role='student' limit 1),true);
set local role authenticated;
do $$ begin
 if (select count(*) from public.class_public_cards)<2 then raise exception 'Missing classmate cards'; end if;
 if exists(select 1 from public.progress_snapshots where user_id<>auth.uid()) then raise exception 'Raw peer snapshot exposed'; end if;
end $$;
update public.progress_snapshots set game_stats=game_stats where user_id=auth.uid();
do $$ begin
 if not exists(select 1 from public.profiles where user_id=auth.uid() and public_training ? 'history') then raise exception 'Projection trigger failed'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin
 if exists(select 1 from public.class_public_cards) then raise exception 'Outsider access'; end if;
end $$;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
do $$ begin
 if has_table_privilege('anon','public.class_public_cards','SELECT') then
   if exists(select 1 from public.class_public_cards) then raise exception 'Anonymous access'; end if;
 end if;
end $$;
select 'PASS same-class cards, private snapshots, sync trigger, outsider and anonymous denial' as result;
rollback;
