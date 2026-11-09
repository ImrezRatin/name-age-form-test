# Name & Age Register

A one-page form where anyone can save their name and age, hosted free on GitHub Pages.

```
name-age-form/
├── index.html   ← the web page (upload this to GitHub)
├── Code.gs      ← Google Apps Script that stores entries in a Google Sheet (paste into Google, not GitHub)
└── README.md
```

## Why a Google Sheet?

GitHub Pages can only serve files; it cannot store what visitors type. Without a backend the page runs in
**local mode** — each visitor's entries are kept only in their own browser. Connecting the free Google Apps
Script below turns the page into a real shared register: every submission becomes a row in your Google Sheet
and everyone sees the same list.

## Setup — about 5 minutes

### A. Create the Google Sheet backend
1. Go to <https://sheets.new> (signed in to your Google account) and name the sheet e.g. **Name Age Register**.
2. Menu **Extensions → Apps Script**. Delete the sample code in the editor.
3. Open `Code.gs` from this folder in Notepad, copy everything, paste it into the editor, press **Ctrl+S**.
4. Click **Deploy → New deployment**. Click the ⚙ gear next to "Select type" and choose **Web app**.
5. Fill in:
   - Description: `name age form`
   - **Execute as: Me**
   - **Who has access: Anyone**  ← important, otherwise visitors get a login page
6. Click **Deploy**. Google asks you to **Authorize access** → choose your account → if it says
   "Google hasn't verified this app", click **Advanced → Go to … (unsafe)** → **Allow**. (It's your own script.)
7. Copy the **Web app URL** — it looks like `https://script.google.com/macros/s/AKfycb…/exec`.

### B. Put the URL into the page
1. Open `index.html` in Notepad (or edit it directly on GitHub with the ✏ pencil button).
2. Find the line near the top of the `<script>` section:
   ```js
   const API_URL = '';
   ```
   and paste your URL between the quotes:
   ```js
   const API_URL = 'https://script.google.com/macros/s/AKfycb…/exec';
   ```
3. Save.

### C. Publish on GitHub Pages
1. GitHub → **+ → New repository** → name `name-age-form` → Public → tick **Add a README file** → Create.
2. **Add file → Upload files** → choose `index.html` → **Commit changes**.
3. **Settings → Pages → Source: Deploy from a branch → main / (root) → Save.**
4. After ~1 minute the form is live at `https://<your-username>.github.io/name-age-form/`.
   The green banner at the top confirms it is connected to the sheet.

## Updating the script later
If you change `Code.gs`, you must publish it again: **Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy**.
The URL stays the same.

## Notes
- Entries are validated twice (in the page and in the script): name 2–80 characters, age 1–120.
- The list shows the newest 500 entries; the sheet keeps everything. Visitors can download the list as CSV.
- Anyone with the page URL can add entries (that's the point), but nobody can edit or delete — only you, in the sheet.
- Google Apps Script free quota is about 20,000 requests per day, far more than a small form needs.
