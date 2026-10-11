# V11 Fast first-load setup

## Changes
- Tiny Show/Hide Usage Guide button below search (not below hero).
- Retains existing Full Quiz mobile direct navigation and working 15 MCQs.
- Browser cache retained; never blindly clear it (doing so slows repeat visits).
- Optional **same-origin static directory snapshot** eliminates Google Apps Script directory round-trip for first-time users once generated.

## Upload
Upload contents of `github/` to the **root** of your GitHub Pages repository. Also upload `.github/workflows/refresh-directory.yml` and `scripts/update_directory.py` to repository root (not into github/).

## IMPORTANT: Enable instant first-visit topic cards
1. In GitHub repository > Actions > Refresh quiz directory snapshot > Run workflow.
2. Workflow fetches publicly accessible Apps Script directory and writes `directory-data.js` into repo root.
3. GitHub Actions needs repository Settings > Actions > General > Workflow permissions > Read and write permissions.
4. Once completed, the first visit reads the small `directory-data.js` hosted on GitHub Pages; Apps Script only refreshes stale data in the background.
5. The workflow refreshes links every 6 hours. If Apps Script is not public or GitHub Pages uses a subfolder, adjust deployment paths.

**No Apps Script modifications needed.** The generated snapshot is empty until the workflow successfully runs. Without a snapshot, existing live Apps Script loading is retained. Initial loading speed still depends on network and Apps Script; it cannot be guaranteed instant.
