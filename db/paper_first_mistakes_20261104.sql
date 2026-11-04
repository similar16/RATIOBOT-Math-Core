-- RATIOBOT H区：教师试卷为准的错题档案 / 一人一卷
-- 原来的 mistake_items 保留为「线上训练错题参考」，不计入试卷统计。
create table if not exists public.paper_tests (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null references public.classes(id) on delete cascade,
 created_by uuid not null default auth.uid() references auth.users(id),
 title text not null check(length(btrim(title)) between 1 and 120),
 exam_date date not null default current_date,
 question_count smallint not null check(question_count between 1 and 100),
 published boolean not null default false,
 file_path text not null default '' check(length(file_path)<=300),
 file_name text not null default '' check(length(file_name)<=200),
 notes text not null default '' check(length(notes)<=800),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists paper_tests_class_date on public.paper_tests(class_id,exam_date desc);
alter table public.paper_tests enable row level security;
revoke all on public.paper_tests from public,anon,authenticated;
grant select,insert,update on public.paper_tests to authenticated;
create policy paper_tests_read on public.paper_tests for select to authenticated using (
 private.is_teacher_in_class(class_id) or
 (published and private.is_member_of_class(class_id))
);
create policy paper_tests_create on public.paper_tests for insert to authenticated with check (
 private.is_teacher_in_class(class_id) and created_by=(select auth.uid())
);
create policy paper_tests_edit on public.paper_tests for update to authenticated
 using(private.is_teacher_in_class(class_id))
 with check(private.is_teacher_in_class(class_id));

create table if not exists public.paper_questions (
 id uuid primary key default gen_random_uuid(),
 paper_id uuid not null references public.paper_tests(id) on delete cascade,
 question_no text not null check(length(btrim(question_no)) between 1 and 15),
 kind text not null default 'regular' check(kind in ('regular','depth')),
 body text not null default '' check(length(body)<=8000),
 answer text not null default '' check(length(answer)<=2000),
 variant_body text not null default '' check(length(variant_body)<=8000),
 variant_answer text not null default '' check(length(variant_answer)<=2000),
 priority smallint not null default 2 check(priority between 1 and 3),
 updated_at timestamptz not null default now(),
 unique(paper_id,question_no)
);
create index if not exists paper_questions_paper_kind on public.paper_questions(paper_id,kind);
alter table public.paper_questions enable row level security;
revoke all on public.paper_questions from public,anon,authenticated;
grant select,insert,update on public.paper_questions to authenticated;
create policy paper_questions_read on public.paper_questions for select to authenticated using (
 exists(select 1 from public.paper_tests p where p.id=paper_id and
   (private.is_teacher_in_class(p.class_id) or (p.published and private.is_member_of_class(p.class_id))))
);
create policy paper_questions_create on public.paper_questions for insert to authenticated with check (
 exists(select 1 from public.paper_tests p where p.id=paper_id and private.is_teacher_in_class(p.class_id))
);
create policy paper_questions_edit on public.paper_questions for update to authenticated
 using(exists(select 1 from public.paper_tests p where p.id=paper_id and private.is_teacher_in_class(p.class_id)))
 with check(exists(select 1 from public.paper_tests p where p.id=paper_id and private.is_teacher_in_class(p.class_id)));

-- 分开保留老师、学生的两份错题登记，互不覆盖；统计时合并去重。
create table if not exists public.paper_error_reports (
 paper_id uuid not null references public.paper_tests(id) on delete cascade,
 class_id uuid not null references public.classes(id) on delete cascade,
 student_code text not null check(length(btrim(student_code)) between 1 and 15),
 source text not null check(source in ('teacher','student')),
 wrong_numbers text[] not null default array[]::text[] check(cardinality(wrong_numbers)<=100),
 updated_by uuid not null default auth.uid() references auth.users(id),
 updated_at timestamptz not null default now(),
 primary key(paper_id,student_code,source)
);
create index if not exists paper_errors_class_student on public.paper_error_reports(class_id,student_code);
alter table public.paper_error_reports enable row level security;
revoke all on public.paper_error_reports from public,anon,authenticated;
grant select,insert,update on public.paper_error_reports to authenticated;
create policy paper_errors_read on public.paper_error_reports for select to authenticated using (
 exists(select 1 from public.paper_tests p where p.id=paper_id and p.class_id=class_id and
  (private.is_teacher_in_class(class_id) or
   (p.published and exists(select 1 from public.class_members m where
      m.class_id=paper_error_reports.class_id and m.student_code=paper_error_reports.student_code
      and m.user_id=(select auth.uid()) and m.role='student'))))
);
create policy paper_errors_create on public.paper_error_reports for insert to authenticated with check (
 updated_by=(select auth.uid()) and
 exists(select 1 from public.paper_tests p where p.id=paper_id and p.class_id=class_id and
  ( (source='teacher' and private.is_teacher_in_class(class_id)) or
    (source='student' and p.published and exists(select 1 from public.class_members m where
      m.class_id=paper_error_reports.class_id and m.student_code=paper_error_reports.student_code
      and m.user_id=(select auth.uid()) and m.role='student'))))
);
create policy paper_errors_edit on public.paper_error_reports for update to authenticated
 using(
  (source='teacher' and private.is_teacher_in_class(class_id)) or
  (source='student' and exists(select 1 from public.class_members m where
     m.class_id=paper_error_reports.class_id and m.student_code=paper_error_reports.student_code
     and m.user_id=(select auth.uid()) and m.role='student'))
 )
 with check(
  updated_by=(select auth.uid()) and
  exists(select 1 from public.paper_tests p where p.id=paper_id and p.class_id=class_id and
    ((source='teacher' and private.is_teacher_in_class(class_id)) or
     (source='student' and p.published and exists(select 1 from public.class_members m where
       m.class_id=paper_error_reports.class_id and m.student_code=paper_error_reports.student_code
       and m.user_id=(select auth.uid()) and m.role='student'))))
 );

-- 一人一卷：教师先生成草稿、修改题号，审核后才对学生发布。
create table if not exists public.paper_retest_plans (
 paper_id uuid not null references public.paper_tests(id) on delete cascade,
 class_id uuid not null references public.classes(id) on delete cascade,
 student_code text not null check(length(btrim(student_code)) between 1 and 15),
 selected_numbers text[] not null default array[]::text[] check(cardinality(selected_numbers)<=5),
 extra_numbers text[] not null default array[]::text[] check(cardinality(extra_numbers)<=5),
 published boolean not null default false,
 teacher_note text not null default '' check(length(teacher_note)<=600),
 updated_by uuid not null default auth.uid() references auth.users(id),
 updated_at timestamptz not null default now(),
 primary key(paper_id,student_code),
 constraint paper_retest_max5 check (cardinality(selected_numbers)+cardinality(extra_numbers)<=5)
);
create index if not exists paper_plans_class_publish on public.paper_retest_plans(class_id,published);
alter table public.paper_retest_plans enable row level security;
revoke all on public.paper_retest_plans from public,anon,authenticated;
grant select,insert,update on public.paper_retest_plans to authenticated;
create policy paper_plans_read on public.paper_retest_plans for select to authenticated using (
 private.is_teacher_in_class(class_id) or
 (published and exists(select 1 from public.paper_tests p where p.id=paper_id and p.class_id=class_id and p.published)
  and exists(select 1 from public.class_members m where m.class_id=paper_retest_plans.class_id
   and m.student_code=paper_retest_plans.student_code
   and m.user_id=(select auth.uid()) and m.role='student'))
);
create policy paper_plans_create on public.paper_retest_plans for insert to authenticated with check (
 private.is_teacher_in_class(class_id) and updated_by=(select auth.uid()) and
 exists(select 1 from public.paper_tests p where p.id=paper_id and p.class_id=class_id)
);
create policy paper_plans_edit on public.paper_retest_plans for update to authenticated
 using(private.is_teacher_in_class(class_id))
 with check(private.is_teacher_in_class(class_id) and updated_by=(select auth.uid()) and
 exists(select 1 from public.paper_tests p where p.id=paper_id and p.class_id=class_id));

-- 教师原试卷上传：私有 bucket，只发短时签名链接给本班学生。
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values('ratiobot-paper-tests','ratiobot-paper-tests',false,12582912,
 array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/png','image/jpeg','image/webp'])
on conflict(id) do nothing;
create policy paper_files_read on storage.objects for select to authenticated using (
 bucket_id='ratiobot-paper-tests' and
 exists(select 1 from public.paper_tests p where p.id::text=split_part(name,'/',2)
  and p.class_id::text=split_part(name,'/',1)
  and (private.is_teacher_in_class(p.class_id) or (p.published and private.is_member_of_class(p.class_id))))
);
create policy paper_files_create on storage.objects for insert to authenticated with check (
 bucket_id='ratiobot-paper-tests' and
 exists(select 1 from public.paper_tests p where p.id::text=split_part(name,'/',2)
  and p.class_id::text=split_part(name,'/',1) and private.is_teacher_in_class(p.class_id))
);
create policy paper_files_edit on storage.objects for update to authenticated
 using(bucket_id='ratiobot-paper-tests' and
 exists(select 1 from public.paper_tests p where p.id::text=split_part(name,'/',2)
  and p.class_id::text=split_part(name,'/',1) and private.is_teacher_in_class(p.class_id)))
 with check(bucket_id='ratiobot-paper-tests' and
 exists(select 1 from public.paper_tests p where p.id::text=split_part(name,'/',2)
  and p.class_id::text=split_part(name,'/',1) and private.is_teacher_in_class(p.class_id)));
