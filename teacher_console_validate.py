from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
s=(root/'index.html').read_text('utf-8')
checks={
 'teacher page':'id="teacher" class="page"',
 'teacher console title':'教师控制台',
 'publish roster button':'id="publishRosterBtn"',
 'roster count':'id="teacherRosterCount"',
 'name mapping':'id="teacherRosterNames"',
 'data panel':'id="teacherPanelData"',
 'accounts panel':'id="teacherPanelAccounts"',
 'data table':'id="teacherDataTable"',
 'account table':'id="teacherAccountsTable"',
 'temporary reset':'teacher_reset_password',
 'teacher redirect':"go('teacher',{bypass:true})",
 'roster database':'class_roster',
}
missing=[k for k,v in checks.items() if v not in s]
for stale in ["$('#bulkCreateStudentsBtn').onclick","$('#copyCredentialsBtn').onclick"]:
    if stale in s: missing.append('stale '+stale)
if missing: raise SystemExit('teacher console validation failed: '+', '.join(missing))
print('teacher console validation passed')
