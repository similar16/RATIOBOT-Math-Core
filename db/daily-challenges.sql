-- Daily challenge sets: published content is immutable; future sets stay private.
create table public.daily_challenge_sets (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null references public.classes(id) on delete cascade,
 challenge_date date not null,
 questions jsonb not null check (jsonb_typeof(questions)='array' and jsonb_array_length(questions)=2),
 published boolean not null default false,
 created_at timestamptz not null default now(),
 unique(class_id,challenge_date),
 check (not published or (length(trim(questions->0->>'body'))>0 and length(trim(questions->1->>'body'))>0 and questions->0->>'body' is not null and questions->1->>'body' is not null))
);
create table public.daily_challenge_answers (
 set_id uuid not null references public.daily_challenge_sets(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 slot smallint not null check(slot in (0,1)),
 answer text not null check(length(trim(answer)) between 1 and 4000),
 reasoning text not null default '' check(length(reasoning)<=8000),
 submitted_at timestamptz not null default now(),
 primary key(set_id,user_id,slot)
);
create index daily_challenge_answers_user on public.daily_challenge_answers(user_id);
alter table public.daily_challenge_sets enable row level security;
alter table public.daily_challenge_answers enable row level security;
revoke all on public.daily_challenge_sets,public.daily_challenge_answers from anon,authenticated;
grant select,insert,update on public.daily_challenge_sets to authenticated;
grant select,insert,update on public.daily_challenge_answers to authenticated;
create policy daily_sets_read on public.daily_challenge_sets for select to authenticated using (
 private.is_teacher_in_class(class_id) or (private.is_member_of_class(class_id) and published and challenge_date <= (now() at time zone 'Asia/Shanghai')::date));
create policy daily_sets_create on public.daily_challenge_sets for insert to authenticated with check(private.is_teacher_in_class(class_id));
create policy daily_sets_edit_draft on public.daily_challenge_sets for update to authenticated using(private.is_teacher_in_class(class_id) and not published) with check(private.is_teacher_in_class(class_id));
create policy daily_answers_read on public.daily_challenge_answers for select to authenticated using (
 exists(select 1 from public.daily_challenge_sets s where s.id=set_id and (private.is_teacher_in_class(s.class_id) or (user_id=(select auth.uid()) and private.is_member_of_class(s.class_id)))));
create policy daily_answers_create on public.daily_challenge_answers for insert to authenticated with check (
 user_id=(select auth.uid()) and exists(select 1 from public.daily_challenge_sets s where s.id=set_id and private.is_member_of_class(s.class_id) and not private.is_teacher_in_class(s.class_id) and s.published and s.challenge_date <= (now() at time zone 'Asia/Shanghai')::date));
create policy daily_answers_edit on public.daily_challenge_answers for update to authenticated using(user_id=(select auth.uid())) with check (
 user_id=(select auth.uid()) and exists(select 1 from public.daily_challenge_sets s where s.id=set_id and private.is_member_of_class(s.class_id) and not private.is_teacher_in_class(s.class_id) and s.published and s.challenge_date <= (now() at time zone 'Asia/Shanghai')::date));
