from pathlib import Path
import re, sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')
if 'global.supabase' in s:
    s=s.replace('global.supabase','window.supabase')
# Use a local, deployed copy of supabase-js instead of relying on jsDelivr at runtime.
s=re.sub(r'<script\s+src="https://cdn\.jsdelivr\.net/npm/@supabase/supabase-js@2(?:/dist/umd/supabase(?:\.min)?\.js)?"\s*></script>', '<script src="assets/supabase.min.js"></script>', s, count=1)
s=s.replace('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','assets/supabase.min.js')
# Older builds silently returned when Supabase failed to load. Keep an explicit message.
old="async function teacherAuth(mode){if(!cloudClient)return;"
new="async function teacherAuth(mode){if(!cloudClient){cloudMsg('#teacherMsg','云端组件未加载，请刷新页面后重试。','bad');return;}"
if old in s:
    s=s.replace(old,new,1)
# New fixed-teacher builds already include their own fallback; just verify it exists.
if 'async function teacherAuth(' not in s or '云端组件未加载，请刷新页面后重试' not in s:
    raise SystemExit('teacherAuth/fallback not found')
if 'window.supabase' not in s:
    raise SystemExit('Supabase browser client reference not found')
if 'assets/supabase.min.js' not in s:
    raise SystemExit('Local Supabase bundle reference not installed')
p.write_text(s,'utf-8')
print('Browser/Supabase hotfix applied')
