-- Teacher-owned editable bank. Daily publication copies a frozen snapshot.
create table public.question_bank (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 title text not null default '' check(length(title)<=100),
 body text not null default '' check(length(body)<=16000),
 hints jsonb not null default '[]' check(jsonb_typeof(hints)='array' and jsonb_array_length(hints)<=12),
 steps jsonb not null default '[]' check(jsonb_typeof(steps)='array' and jsonb_array_length(steps)<=12),
 answer text not null default '' check(length(answer)<=12000),
 source_name text not null default '' check(length(source_name)<=250),
 source_images jsonb not null default '[]' check(jsonb_typeof(source_images)='array' and octet_length(source_images::text)<=6000000),
 include_images boolean not null default false,
 reviewed boolean not null default false,
 updated_at timestamptz not null default now()
);
create index question_bank_owner on public.question_bank(owner_id);
alter table public.question_bank enable row level security;
revoke all on public.question_bank from anon,authenticated;
grant select,insert,update on public.question_bank to authenticated;
create policy bank_read on public.question_bank for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.class_members where user_id=(select auth.uid()) and role='teacher'));
create policy bank_insert on public.question_bank for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.class_members where user_id=(select auth.uid()) and role='teacher'));
create policy bank_update on public.question_bank for update to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.class_members where user_id=(select auth.uid()) and role='teacher')) with check(owner_id=(select auth.uid()) and exists(select 1 from public.class_members where user_id=(select auth.uid()) and role='teacher'));
create table public.daily_challenge_solutions (
 set_id uuid not null references public.daily_challenge_sets(id) on delete cascade,
 slot smallint not null check(slot in (0,1)),
 answer text not null check(length(trim(answer)) between 1 and 12000),
 primary key(set_id,slot)
);
alter table public.daily_challenge_solutions enable row level security;
revoke all on public.daily_challenge_solutions from anon,authenticated;
grant select,insert on public.daily_challenge_solutions to authenticated;
create policy solution_insert on public.daily_challenge_solutions for insert to authenticated with check(exists(select 1 from public.daily_challenge_sets s where s.id=set_id and private.is_teacher_in_class(s.class_id)));
create policy solution_read on public.daily_challenge_solutions for select to authenticated using(exists(
 select 1 from public.daily_challenge_sets s where s.id=daily_challenge_solutions.set_id and (
 private.is_teacher_in_class(s.class_id) or (private.is_member_of_class(s.class_id) and s.published and s.challenge_date <= (now() at time zone 'Asia/Shanghai')::date and exists(
 select 1 from public.daily_challenge_answers a where a.set_id=daily_challenge_solutions.set_id and a.slot=daily_challenge_solutions.slot and a.user_id=(select auth.uid()))))));
create or replace function public.publish_bank_questions(target_class uuid,target_date date,question_ids uuid[]) returns uuid
language plpgsql security invoker set search_path='' as $$
declare q public.question_bank; result_id uuid; items jsonb:='[]'; answers text[]:='{}'; idx int:=0;
begin
 if auth.uid() is null or not private.is_teacher_in_class(target_class) then raise exception '只能向自己管理的班级发布';end if;
 if target_date is null or coalesce(array_length(question_ids,1),0)<>2 or question_ids[1]=question_ids[2] then raise exception '请选择两道不同的题目和日期';end if;
 foreach result_id in array question_ids loop
  select * into q from public.question_bank where id=result_id and owner_id=auth.uid() for share;
  if not found then raise exception '题目不存在或无权访问';end if;
  if not q.reviewed or length(trim(q.body))=0 or length(trim(q.answer))=0 or jsonb_array_length(q.hints)=0 or jsonb_array_length(q.steps)=0 then raise exception '请完成题目、思考提示、关键步骤和答案，并校对保存';end if;
  items:=items||jsonb_build_array(jsonb_build_object('bank_id',q.id,'title',q.title,'body',q.body,'hints',q.hints,'steps',q.steps,'images',case when q.include_images then q.source_images else '[]'::jsonb end,'has_solution',true));
  answers:=array_append(answers,q.answer);
 end loop;
 insert into public.daily_challenge_sets(class_id,challenge_date,questions,published) values(target_class,target_date,items,true) returning id into result_id;
 insert into public.daily_challenge_solutions(set_id,slot,answer) values(result_id,0,answers[1]),(result_id,1,answers[2]);
 return result_id;
end $$;
revoke all on function public.publish_bank_questions(uuid,date,uuid[]) from public,anon;
grant execute on function public.publish_bank_questions(uuid,date,uuid[]) to authenticated;
