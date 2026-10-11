# V16 — Embed Full Quiz on the same website page

## What changed
- Full Quiz now opens in the SAME embedded quiz player (iframe) as 15 MCQs, on PC, Android and tablet.
- No direct browser navigation when clicking Full Quiz.
- Existing 15 MCQs, navigation, completion indicators and directory loading remain.
- Five-minute visible-time completion also applies to embedded Full Quiz.
- **Open full screen ↗** is retained as a fallback for browsers where Google Apps Script blocks iframe embedding.

## Install
Upload ONLY the contents of `github/` to the ROOT of the GitHub Pages repository, overwriting matching files. Keep existing `.github`, `scripts`, Apps Script and Sheets unchanged. Confirm index.html is at repository root.

## Important limitation
Google Apps Script may prohibit framing depending on the Full Quiz engine response. This front-end cannot override X-Frame-Options or Content-Security-Policy. If iframe shows a blank page or refusal, the Full Quiz engine owner must change its HTML output to allow iframe embedding (where appropriate) and redeploy, or use the Open full screen link. The iframe load event alone cannot prove successful rendering.
