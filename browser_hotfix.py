from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
p=root/'index.html'
s=p.read_text('utf-8')
if 'global.supabase' in s:
    s=s.replace('global.supabase','window.supabase')
if 'window.supabase' not in s:
    raise SystemExit('Supabase browser client reference not found')
p.write_text(s,'utf-8')
print('Browser Supabase hotfix applied')
