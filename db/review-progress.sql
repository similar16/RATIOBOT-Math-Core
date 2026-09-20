-- Additive setting: class creators retain their existing UPDATE policy.
-- Class members can SELECT their class; students cannot change its progress.
alter table public.classes add column if not exists review_progress jsonb not null default '{"through":0,"dates":{}}'::jsonb;
comment on column public.classes.review_progress is 'Knowledge review release cursor and per-card learned dates; default closed. Existing class membership RLS applies.';
