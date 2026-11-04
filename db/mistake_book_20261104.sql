-- RATIOBOT H区：错题修复站（2026-11-04）
-- 所有学生内容必须受 RLS 保护，教师仅可查看自己班级。
create table if not exists public.mistake_items (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_key text not null check (length(source_key) between 3 and 160),
  source text not null default '手动录入' check (length(source) <= 60),
  kind text not null default 'manual' check (length(kind) <= 45),
  topic text not null default '未分类' check (length(topic) <= 100),
  question text not null check (length(question) between 1 and 4000),
  correct_answer text not null check (length(correct_answer) between 1 and 1200),
  submitted_answer text not null default '' check (length(submitted_answer) <= 1200),
  variant_question text not null default '' check (length(variant_question) <= 4000),
  variant_answer text not null default '' check (length(variant_answer) <= 1200),
  error_type text not null default '待分析' check (length(error_type) <= 100),
  priority smallint not null default 2 check (priority between 1 and 3),
  times_wrong integer not null default 1 check (times_wrong between 0 and 10000),
  retry_count integer not null default 0 check (retry_count between 0 and 10000),
  success_streak smallint not null default 0 check (success_streak between 0 and 20),
  status text not null default 'pending' check (status in ('pending','reviewing','mastered')),
  due_on date not null default current_date,
  selected_for_retest boolean not null default false,
  attempts jsonb not null default '[]'::jsonb check (jsonb_typeof(attempts) = 'array' and jsonb_array_length(attempts) <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_wrong_at timestamptz not null default now(),
  unique(user_id, source_key)
);
create index if not exists mistake_items_user_due on public.mistake_items (user_id, due_on) where status <> 'mastered';
create index if not exists mistake_items_class_user on public.mistake_items (class_id, user_id);
alter table public.mistake_items enable row level security;
grant select,insert,update on public.mistake_items to authenticated;
revoke all on public.mistake_items from anon;

drop policy if exists mistake_read on public.mistake_items;
create policy mistake_read on public.mistake_items for select to authenticated
 using (user_id = (select auth.uid()) or private.is_teacher_in_class(class_id));

drop policy if exists mistake_insert on public.mistake_items;
create policy mistake_insert on public.mistake_items for insert to authenticated
 with check (
   (user_id = (select auth.uid()) or private.is_teacher_in_class(class_id))
   and exists (
     select 1 from public.class_members m
     where m.class_id = mistake_items.class_id and m.user_id = mistake_items.user_id and m.role = 'student'
   )
 );

drop policy if exists mistake_update on public.mistake_items;
create policy mistake_update on public.mistake_items for update to authenticated
 using (user_id = (select auth.uid()) or private.is_teacher_in_class(class_id))
 with check (
   (user_id = (select auth.uid()) or private.is_teacher_in_class(class_id))
   and exists (
     select 1 from public.class_members m
     where m.class_id = mistake_items.class_id and m.user_id = mistake_items.user_id and m.role = 'student'
   )
 );
