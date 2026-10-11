V22 mobile reader fix

- Removed Full Quiz warning overlay so it no longer covers questions.
- Reduced mobile header and quiz toolbar size.
- Preserved all quiz navigation, progress tracking, and existing project files.
- Score and % Completed are rendered by the external quiz app inside an iframe. Their size cannot be changed from GitHub Pages; edit the external quiz app CSS/template to adjust those elements.

DEPLOY: Upload the contents of github/ to the same GitHub Pages repository, replacing matching files. If old version persists, refresh browser cache.
