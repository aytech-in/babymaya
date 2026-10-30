# Baby Aytekin

A one-page live status site for the family: a rocking crescent-moon cradle under a night sky that changes with the status (waiting, labor, hospital, born). No build step, no dependencies. Plain HTML, CSS and JS, ready for GitHub Pages.

```
index.html   the page
style.css    styling
app.js       copy (TR / DE / EN), rendering, sky animation, status polling
status.json  the current status (this is the only file you edit)
admin.html   phone-friendly editor that commits status.json through the GitHub API
.nojekyll    tells GitHub Pages to serve files as they are
```

## Run it locally

Opening `index.html` directly will not load `status.json` (browsers block `fetch` on `file://`), so use a tiny server:

```bash
cd baby-aytekin
python3 -m http.server 8000
```

Then open http://localhost:8000. To see every scene without changing the real status:

- http://localhost:8000/?preview=waiting
- http://localhost:8000/?preview=labor
- http://localhost:8000/?preview=hospital
- http://localhost:8000/?preview=born

## Deploy to GitHub Pages

1. Create a new repository on GitHub, for example `baby-aytekin`. Public is fine; Pages on private repos needs a paid plan.
2. Push this folder:

   ```bash
   cd baby-aytekin
   git init -b main
   git add .
   git commit -m "Baby Aytekin status page"
   git remote add origin https://github.com/<your-user>/baby-aytekin.git
   git push -u origin main
   ```

3. On GitHub open **Settings > Pages**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. After a minute the site is live at `https://<your-user>.github.io/baby-aytekin/`.

## Updating the status from your phone

Visitors' open pages re-check `status.json` every 45 seconds, and GitHub Pages usually republishes within a minute after a commit.

### Option A: the admin page (best)

1. On GitHub (github.com in your phone browser), go to **Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token**.
2. Set **Repository access** to **Only select repositories** and pick `baby-aytekin`.
3. Under **Repository permissions** set **Contents** to **Read and write**. Leave everything else off.
4. Choose an expiry that covers the next few weeks, then generate and copy the token.
5. Open `https://<your-user>.github.io/baby-aytekin/admin.html` on your phone, paste the token once, and tap **Save and load status**.
6. From then on: tap a status, optionally add a note, tap **Publish update**. When she is born, add her name, birth time, weight and length.

The token is stored only in your phone browser's local storage and is sent only to `api.github.com`. Anyone who finds the admin page still cannot change anything without the token. When you are done, delete the token on GitHub (or tap **Remove token from this device**).

### Option B: edit the file on GitHub

Open `status.json` in the GitHub mobile app or on github.com, tap the pencil, change `"status"` to one of `waiting`, `labor`, `hospital`, `born`, and commit.

## status.json

```json
{
  "status": "waiting",
  "note": "Short message shown on the page (optional)",
  "due": "2026-10-28",
  "updated": "2026-10-30T20:15:00.000Z",
  "born": { "name": "", "at": "2026-11-01T03:12", "weight": "3.4 kg", "length": "51 cm" }
}
```

- `status`: `waiting`, `labor`, `hospital` or `born`.
- `due`: optional, `YYYY-MM-DD`. When set, the page shows days past or until the due date.
- `updated`: ISO time in UTC, shown on the page in Berlin time. The admin page sets it for you.
- `born`: only shown once `status` is `born`. `at` is local time as `YYYY-MM-DDTHH:mm`.

## Customizing

- Wording and languages: the `T` object at the top of `app.js`.
- Colors: the `:root` variables in `style.css` and the `SCENES` object in `app.js`.
- Polling interval: the `45000` (milliseconds) in `app.js`.
