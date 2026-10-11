# V12 — Navigation & browser-saved completion

## New features
- Home / All topics remains available in the quiz player.
- Next section navigation on the library page and player.
- `Mark finished` on the quiz player, and a one-tap confirmation when returning to the portal from a mobile Full Quiz.
- Completion stored in browser `localStorage`, separately for Full Quiz and 15 MCQs per topic.
- Finished topics display a subtle green border, checkmark, and status; both completed shows a stronger green tint and medal.

## Important limitation
Your actual quizzes run in a separate Google Apps Script origin. GitHub Pages cannot read the result/Submit event inside that cross-origin page. Therefore V12 **does not falsely mark quizzes completed automatically**. Students confirm completion after submitting, via `Mark finished`. To automate genuine completion, the quiz Apps Script must send a completion message or use an authenticated backend.

Browser storage persists across normal revisits but is browser/profile/device specific and can be erased when site data is cleared or private browsing ends. No Google Sheets or Apps Script changes are needed for this version.

## Deploy
Replace the contents of your GitHub Pages directory with the `github` files from this ZIP. Keep `.github` and `scripts` from V11 for static directory refresh. The V12 package includes them as well. The existing quiz URLs remain unchanged.
