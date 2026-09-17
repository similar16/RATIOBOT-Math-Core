begin;
select set_config('test.registration_uid',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email) values(current_setting('test.registration_uid')::uuid,'authenticated','authenticated','rollback-registration-test@example.invalid');
set local role service_role;
insert into public.profiles(user_id,display_name) values(current_setting('test.registration_uid')::uuid,'回滚注册测试');
insert into public.progress_snapshots(user_id) values(current_setting('test.registration_uid')::uuid);
do $$ begin
if not exists(select 1 from public.profiles where user_id=current_setting('test.registration_uid')::uuid and public_training ? 'history') then raise exception 'Registration projection failed'; end if;
end $$;
rollback;
