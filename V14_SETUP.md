# V14 — Automatic 5-minute completion

- 15-MCQ embedded quiz: after 5 minutes of visible time in the quiz viewer, mark that specific short quiz finished automatically. Time while browser tab is hidden is not counted.
- Full Quiz: the quiz is a separate Apps Script page, so the portal cannot inspect activity. When returning to the portal after 5 minutes or more, the Full Quiz is marked finished based on elapsed time. This is NOT proof of submission or answering.
- Existing localStorage completion data is preserved. Progress is per browser profile.
- Navigation remains within the same subject for Next Topic.
- Full Quiz original URLs are still opened directly, and the 15-MCQ viewer remains unchanged.

## Install
Upload all files from github/ to the repository root, replacing previous GitHub Pages files. No Apps Script changes needed.

## Troubleshooting Full Quiz
If the Full Quiz link shows File not found, open its exact URL from the Full Quiz spreadsheet directly in a private browser window. A broken Google Apps Script deployment or invalid Full Quiz URL cannot be repaired by the portal.
