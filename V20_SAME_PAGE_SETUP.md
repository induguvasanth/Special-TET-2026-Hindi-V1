V20 Same-page Full Quiz

1. Upload github folder files to the GitHub Pages repository root.
2. Hard refresh Chrome (Ctrl+Shift+R).
3. Full Quiz and 15 MCQs now share the existing embedded quiz player.
4. If Full Quiz shows a blank/blocked frame, use Open full screen. The FULL QUIZ ENGINE Apps Script (not the directory Code.gs) must permit embedding: HtmlService.createHtmlOutput...setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL). This setting relaxes clickjacking protection; use only if you trust the embedding site and understand the risk.
5. Directory Code.gs need not be changed.
6. Test Chrome normal, incognito and Brave.
