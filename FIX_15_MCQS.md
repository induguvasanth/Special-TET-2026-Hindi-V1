# V7 — 15 MCQs FIX

## Confirmed cause from the screenshot
The short-quiz spreadsheet uses:
A1: Topic Title (A1)
B1: Sheet Name
C1: Direct Link
D1: Open

Previous Code.gs required a header named "Topic Name", "Topic", etc., so it skipped the ENTIRE 15-MCQ sheet. The V7 `readShort_` function reads the actual URL from column C and topic from column A, starting at row 2. It also supports clickable hyperlinks and formulas.

## Installation
1. Open the DIRECTORY Apps Script project (the one used by the portal, not your existing MCQ engine).
2. Replace Code.gs completely with apps-script/Code.gs.
3. Save and choose Deploy > Manage deployments > Edit > New version > Deploy.
4. Open the directory URL with ?refresh=1. Look for stats.shortRows and stats.shortLinks (should reflect sheet rows and links).
5. Upload github/ files to GitHub Pages, replacing previous files.
6. Press Ctrl+Shift+R. Browser cache key changed to V7.

## Notes
The quiz URLs remain exactly as they appear in column C. No quiz engine code is changed.
If there are zero links after deployment, verify Apps Script execution permissions for the short-quiz spreadsheet.
