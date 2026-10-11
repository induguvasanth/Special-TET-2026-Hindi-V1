# V10: Fast display + logo + usage guide

## Deploy
Upload only the files inside `github/` to your existing GitHub Pages repository, replacing the older files. No changes to Apps Script or Google Sheets are required.

## Changes
- Existing cached quiz directory renders immediately; refreshes in the background only when older than 10 minutes.
- Does NOT automatically clear all browser cache: doing so would make repeat visits slower and can break offline/cached loading. Versioned JS/CSS URLs request the updated files after deployment.
- Right-aligned Cloudinary logo inside the hero.
- Show/Hide Telugu + English usage guide, image downloaded only when first opened.
- Working full quiz mobile direct-navigation and 15 MCQs preserved.

## Limitations
First-time visitors must still retrieve quiz links from the Google Apps Script directory. Network/Apps Script startup delay cannot be eliminated by the GitHub frontend alone. Cloudinary assets need internet connectivity.
