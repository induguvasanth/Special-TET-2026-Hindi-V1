# SPECIAL TET 2026 – Hindi 2A Premium Portal

## What changed
- Premium responsive interface, mobile-first cards and full-width quiz viewer.
- Both quiz modes are read from their own Google Sheet. The portal NEVER invents quiz URLs.
- Supports URL text, linked cells (including rich-text hyperlink runs), and HYPERLINK formulas.
- Normalizes subject and numeric range so e.g. `• CDP 221–270` matches `CDP 221-270`.
- Apps Script caches the directory for 5 minutes, reducing repeated Sheet reads. The quiz itself still loads from the existing quiz Apps Script, so its speed depends on that separate service.
- `Refresh` button bypasses the directory cache.
- The portal uses JSONP because GitHub Pages cannot read Google Apps Script JSON through ordinary cross-origin fetch reliably.

## REQUIRED: Update Apps Script and deploy new version
1. Open the Apps Script project associated with your directory deployment URL ending `...M5tyQ/exec`.
2. Replace its `Code.gs` with `apps-script/Code.gs` from this package. This is the DIRECTORY project, not the quiz project.
3. Save. Click Deploy > Manage deployments > Edit (pencil) > Version > New version > Deploy.
4. Confirm web-app execution is set to **Me** and access is **Anyone**. The Sheets must be accessible to the account running the script.
5. Test the API in a browser: `https://script.google.com/macros/s/AKfycbwoSKTSJoshstkrbaW4mwlluCYQlTLo8Ld62GDWPzdIMEvO6YkXiNVzT5UGVq2M5tyQ/exec?refresh=1`.
6. The JSON should contain `stats.shortLinks` greater than zero and each matching topic should have `shortUrl`.

## IMPORTANT: Short links
The short quiz Sheet ID is `1fjDQP6pHKolHBTFFeyvayWP4PNFhgp3RwgHMB9I66Ng`. Each row must have `Topic Name` and an actual independent short-quiz URL, either:
- In a column headed `Quiz URL`, `URL`, `Link`, `Quiz Link`, `Practice URL`, `Web App URL`, or `Quiz`; or
- As a clickable hyperlink in the topic-name cell; or
- In a `=HYPERLINK("https://...", "...")` formula.

If the Sheet has only topic names, the website cannot know the independent quiz URLs. Do not generate a short URL from the full quiz URL unless you have verified your existing quiz app uses the same base and supports those exact topics.

## GitHub Pages
1. Upload ALL files inside `github/` to your GitHub repository root (or update the existing files).
2. `config.js` already includes your directory deployment URL.
3. In GitHub repository Settings > Pages, publish from the main branch root.
4. Hard-refresh the page (Ctrl+Shift+R) to clear cached older JavaScript.

## Troubleshooting
- Full Quiz works but 15 MCQs disabled: check API `stats.shortLinks`, check short Sheet hyperlinks, update directory Code.gs, redeploy a NEW VERSION, then press Refresh.
- If the short sheet uses ranges different from the full sheet, the portal shows them as separate cards; align topic names/ranges if you intend paired buttons.
- Embedded quiz blank: Google may forbid iframe embedding. Click `Open full screen` for the exact original quiz URL.
- Quiz takes time: the portal loads only a lightweight directory, but cannot accelerate the separate quiz Apps Script server or Google redirect. Optimizing the quiz app requires its source code.
