# Version 4 improvements

- Removed the floating dark iframe warning banner completely.
- Added local browser cache: topic cards can appear immediately on repeat visits while fresh links update in the background.
- Added connection warming for Apps Script quiz pages on hover and before launch.
- Added preconnect for Google Apps Script content delivery and refreshed the player styling.
- Full quiz and 15-MCQ URLs remain supplied by the directory Apps Script. Existing MCQ question/answer functionality is untouched.

## Deploy
Upload all files from `github/` to your existing GitHub Pages root. Do not change the existing directory Apps Script unless your 15-MCQ URL issue persists. Hard-refresh once after deployment.

## Technical limitation
Google Apps Script may prevent iframe embedding. This is controlled by the existing quiz deployment's X-Frame-Options and Apps Script HtmlService configuration, not by CSS. If the quiz cannot render in the iframe, use the existing Open full screen button. To allow embedding for a quiz Apps Script you own, its HTML output may be configured with `HtmlService.XFrameOptionsMode.ALLOWALL`, after reviewing clickjacking risks. This change belongs in the quiz project, not in the directory project. Google Apps Script startup/network latency cannot be eliminated from GitHub Pages.
