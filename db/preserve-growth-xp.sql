create or replace function private.preserve_growth_xp()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.xp < old.xp then
  new.xp := old.xp;
  new.level := old.level;
  new.base_level := old.base_level;
  if new.avatar_key like 'level:%' then new.avatar_key := 'level:' || old.level::text; end if;
 end if;
 return new;
end;
$$;
revoke all on function private.preserve_growth_xp() from public;
create trigger preserve_growth_xp before update of xp on public.profiles
for each row execute function private.preserve_growth_xp();
