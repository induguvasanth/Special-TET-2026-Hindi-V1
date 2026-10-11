# V17 Chrome Full Quiz fix

## What changed
- Full Quiz opens its actual Google quiz URL in a new Chrome tab. This avoids blocked cross-origin iframe embedding.
- 15 MCQs remain embedded in the existing player.
- Quiz completion is no longer automatically awarded just because five minutes elapsed. Use Mark finished after submitting.
- Code.gs now prioritizes explicit quiz URL columns and skips spreadsheet links.
- Directory cache version bumped to refresh old missing Full Quiz URLs.

## Deploy
1. Upload the CONTENTS of `github/` to the ROOT of your GitHub Pages repository.
2. In the DIRECTORY Google Apps Script project, replace `Code.gs` with `apps-script/Code.gs`. Do not overwrite the separate quiz engine's Apps Script project.
3. Deploy the directory Apps Script as a NEW VERSION of the existing web app, Execute as Me, access Anyone. Keep its existing /exec URL in `github/config.js`.
4. Confirm the Full Quiz Google Sheet contains direct published quiz web-app links, not spreadsheet links.
5. Open the GitHub Pages site in Chrome, hard refresh (Ctrl+Shift+R), tap Refresh, then test Full Quiz and 15 MCQs.

## Note
A GitHub Pages site cannot force Google Apps Script pages to be iframe-compatible. A real new tab is the reliable Chrome fallback. Browser popup settings and Google quiz deployment permissions must also permit access. No live Google deployment was changed or verified here.
