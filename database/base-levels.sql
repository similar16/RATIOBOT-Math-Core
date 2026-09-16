-- Existing XP is preserved. Only derived level/BASE values are recalculated.
alter table public.profiles alter column base_level set default 1;
with levels as (
 select p.user_id,coalesce((select max(lv) from generate_series(1,90) lv
 where (lv-1)*260 + 85*(lv-1)*(lv-2)/2 <= p.xp),1) as lv
 from public.profiles p
)
update public.profiles p set level=l.lv,base_level=((l.lv-1)/9)+1
from levels l where p.user_id=l.user_id;
