# V6 — fixed Code.gs regex and short-quiz link scanning
1. Replace directory Apps Script Code.gs with apps-script/Code.gs.
2. Save, then Deploy > Manage deployments > Edit > New version > Deploy.
3. Ensure the deployment runs as you and is accessible to Anyone.
4. Test your deployed /exec?refresh=1 URL. JSON `stats.shortLinks` should be greater than zero.
5. Replace GitHub files and hard refresh.
6. If `shortLinks` is zero, check Apps Script execution permissions to the second spreadsheet, and ensure the topic rows contain clickable URLs or HYPERLINK formulas. The script does not generate links from topic names.
Existing quiz app stays unchanged. The 15-MCQ links cannot be verified from here because the source spreadsheet is not accessible through public fetch.
