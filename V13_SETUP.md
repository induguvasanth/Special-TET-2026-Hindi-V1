# V13 — Full Quiz launch and next-topic navigation
- Full Quiz opens its exact original Google Apps Script URL as a top-level page on ALL devices (PC, phone, tablet).
- The 15-MCQ player is unchanged.
- When returning from a Full Quiz, the portal offers Mark finished and Next topic.
- Next topic follows numerical range inside the SAME subject, e.g. Hindi Content 1–60 → 61–120 → 121–180. It does not jump to another subject.
- Existing browser-saved completion status is preserved.
## Deploy
Replace the files in github/ on GitHub Pages. No directory Apps Script or Sheets change required.
## Diagnostic
If a Full Quiz URL still fails when opened directly in the browser, its underlying Full Quiz Apps Script deployment is failing or restricted. The portal cannot fix that. Test the exact URL in the Full Quiz spreadsheet in Chrome Incognito. If it fails, provide that quiz app's Code.gs and HTML to repair the underlying app.
