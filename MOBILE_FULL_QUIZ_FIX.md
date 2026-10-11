# V9 — Full Quiz mobile/tablet fix

## Problem
Full quiz works in desktop Chrome but fails in embedded viewer on phones and tablets, while 15 MCQs work.

## Fix
On mobile/tablet (screen width <=1024px or mobile user agent), tapping **Full Quiz** opens its original Apps Script URL as a top-level browser page (same tab). The browser Back button returns to the portal. This avoids the cross-origin iframe layer. On desktop the full quiz remains embedded; 15 MCQs retain existing behavior everywhere.

## Deploy
Replace ONLY the files in github/ on GitHub Pages. No changes to Apps Script or Sheets are needed. Hard refresh or use Incognito to test.

## If it still fails
Open the exact Full Quiz URL from the spreadsheet directly in mobile Chrome. If it fails there, the problem is in the separate quiz Apps Script (deployment permissions, redirects, HTML, or slow Google Sheets reads), not the portal. That quiz engine source is required to fix it.
