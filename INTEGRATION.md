# RATIOBOT integration baseline

`site/` contains the full application HTML and restored artwork; the unchanged original assets are extracted from the retained ZIP at build time. The application was reconstructed from commit f69e41a, with all original ZIP assets retained byte for byte. The root historical HTML and Python patch scripts are retained as history, but are not deployment inputs. Edit `site/index.html` and `site/rings.html`; do not append another patch layer.

Build: `npm ci && npm run build`. Tests: `npm test` and `python tests/assets.py` (Pillow required). `_site` is the only Pages artifact. `build-info.json` identifies its exact commit.

## Root causes and changes

- Actions never invoked the existing BASE theme script or v54 scope fix, although commits claimed those fixes.
- v53 scorer ran outside the main closure and could not access currentProfile/saveCurrentProfile. It is now inside that closure, with a single scoring channel and cached per-run receipts.
- Badge WebP and BASE1 Base64 were undecodable; BASE3 Base64 was incomplete. Restored original PNG artwork from saved project files. BASE1 uses the nine original full-resolution avatars. Badges are individually cropped from 数学成就徽章贴纸表.png, matching RATIOBOT_16枚徽章_切分校验.jpg. Farm and space stages come from 农场伙伴成长冒险图鉴.png and 太空主题九级成长探索图.png.
- Growth uses 90 global levels, 9 per BASE, local Lv.1–9, retained completed collections. BASE4–10 retain reserved slots.
- XP stays at 260+85*(level-1) per level and the already reduced per-question factor 8. Assumption: 20 standard integer questions/day, 5 days/week, ~1000 XP/week. BASE1 completion is 4460 XP (~4.5 weeks); BASE2 spans another 11520 XP (~11.5 weeks). Difficulty, mistakes and hints alter this estimate. No R-to-XP conversion.
- R scoring stays 8/4/0 for 0/1/2+ A/B errors and retains the pre-existing 40 R daily cap. Wallet, finish receipt, history and snapshot share the actual capped gain.
- Records now retain elapsed seconds and show grade, errors, operations and failed placements. Existing progress_snapshots/game_stats.history remains the teacher data source; no parallel data schema is introduced.
- Supabase write errors are now checked, pending local saves survive failed sync, writes are serialized, and same-student retry is supported. This preserves the existing snapshot model; simultaneous play on multiple devices is still not an atomic server ledger.
- Logout waits for pending writes and clears the old game frame. A completed game cannot be assigned to a different current student.

## Verification boundaries

Behavior tests execute the complete main script and the actual child wrong-answer branch with isolated profiles and a mocked Supabase client. Database RLS write/read probes were run inside a rolled-back transaction on the existing database. They are not a claim of real-account browser end-to-end verification. Teacher dashboard rendering and roster parsing were exercised with mock data; no real roster or password was changed.

The managed browser blocked localhost previews. Live public page verification is performed after Pages deployment. A signed-in student/teacher browser regression requires a legitimate login via the secure sign-in handoff.
