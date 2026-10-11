# V15 Chrome Full Quiz directory repair

Screenshot showed 0 Full Quizzes, 24 short quizzes. This means the Full Quiz buttons have no usable URLs; browser cache deletion cannot fix missing directory data.

## Changes
- New cache version and forced directory refresh when no full quiz links are present.
- Merge partial short-quiz results with existing full quiz links rather than overwriting them.
- Preserve completion progress key and 5-minute behavior.
- Full Quiz still opens directly on all devices.
- Show actionable message when full quiz URLs are missing.
- Working 15 MCQs unchanged.

## Install
Upload the 5 files INSIDE github/ to the repository root, replacing previous files. Leave .github, scripts, and apps-script unchanged.

## Verify
Status should show >0 Full Quizzes. If it still says 0, the directory API or Full Quiz spreadsheet is not supplying Full Quiz URLs. Check your Full Quiz Google Sheet and directory Apps Script deployment; no frontend-only fix can invent missing links.
