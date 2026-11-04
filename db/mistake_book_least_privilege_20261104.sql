-- Supabase default privileges include TRUNCATE; RLS does not protect TRUNCATE.
revoke all on table public.mistake_items from public, anon, authenticated;
grant select, insert, update on table public.mistake_items to authenticated;
