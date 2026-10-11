# V8 mobile / incognito directory recovery

- Keeps instant localStorage cached directory on repeat visits.
- Directory Apps Script request times out sooner (8 seconds instead of 15).
- After 3.5 seconds without cards, attempts public Google Sheets gviz loading as a fallback.
- Does not require changes to the existing quiz player Apps Script.
- NOTE: Google Sheets fallback requires viewer access to the spreadsheets. The reliable solution is DIRECTORY Apps Script deployed as Execute as: Me, Who has access: Anyone.

## Deploy
1. Replace files from `github/` in GitHub Pages.
2. Verify Apps Script deployment is set to Execute as Me and Anyone.
3. Re-deploy the existing directory Apps Script Code.gs if it was changed.
4. Test the portal in Chrome Incognito or a phone with no Google sign-in.
5. If still no cards, open the directory `/exec?refresh=1` URL in an incognito browser. It MUST show JSON, not a Google sign-in page.

No hardcoded quiz URLs were fabricated.
