# Baby Aytekin

A one-page live status site for the family: a rocking crescent-moon cradle under a night sky that changes with the status (waiting, hospital, born). Plain HTML, CSS and JS, no build step. The page is hosted on GitHub Pages and the status lives in Firebase (Firestore), so updates appear on every open page within seconds.

```
index.html           the public page (styles are in its <style> block)
app.js               copy (TR / DE / EN), rendering, sky animation
data.js              listens to the status document in Firestore
firebase-config.js   your Firebase web config (paste it in, see below)
firestore.rules      who can read and write the status
admin.html           phone-friendly page where you sign in and post updates
```

## How it works

- The status is one Firestore document, `status/current`. Anyone can read it. Only your account can write it.
- The public page listens to that document and re-renders instantly when it changes. The last status is cached in the browser, so returning visitors see something immediately.
- `admin.html` is a public file, but it is only a sign-in form. Without your email and password nobody can change anything. The Firebase config in `firebase-config.js` is not a secret; access is enforced by `firestore.rules` on Google's servers.

## One-time Firebase setup (about 10 minutes, free Spark plan)

1. Go to https://console.firebase.google.com and create a project. Google Analytics is not needed.
2. **Build > Firestore Database > Create database.** Choose an EU location (for example `eur3` or `europe-west3`); it cannot be changed later. Start in production mode.
3. **Build > Authentication > Get started > Sign-in method:** enable **Email/Password**. On the **Users** tab choose **Add user** and create your own account with a long, unique password. Copy the **User UID** shown in the list. If you see an option under **Settings > User actions** to disable creating new accounts (sign-up), turn it off.
4. **Firestore Database > Rules:** paste the contents of `firestore.rules`, replace `PASTE_YOUR_USER_UID_HERE` with your UID, and publish.
5. **Project settings > General > Your apps > Web (`</>`):** register an app (skip Firebase Hosting) and copy the config values into `firebase-config.js` (`apiKey`, `authDomain`, `projectId`, `appId`).

## Try it locally

Browsers block ES modules on `file://`, so use a tiny server:

```bash
cd baby-aytekin
python3 -m http.server 8000
```

- http://localhost:8000/admin.html: sign in, pick a status, press **Publish update**.
- http://localhost:8000/: the public page. Keep it open in another tab and watch it change.
- Scene previews with sample data (nothing is published): `/?preview=waiting`, `/?preview=hospital`, `/?preview=born`.

## Deploy to GitHub Pages

1. Create a public repository, for example `baby-aytekin`. Pages on a free account needs a public repo. It contains no baby details, only code.
2. Push this folder:

   ```bash
   cd baby-aytekin
   git add .
   git commit -m "Baby Aytekin status page"
   git remote add origin https://github.com/<your-user>/baby-aytekin.git
   git push -u origin main
   ```

3. On GitHub open **Settings > Pages**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. The site is live after a minute at `https://<your-user>.github.io/baby-aytekin/`. Bookmark `.../admin.html` on your phone and sign in once; Firebase keeps you signed in.

Optional hardening in the Google Cloud console (APIs & Services > Credentials): restrict your browser API key to the HTTP referrers `https://<your-user>.github.io/*` and `http://localhost:8000/*`. If sign-in ever complains about the domain, add `<your-user>.github.io` under Authentication > Settings > Authorized domains.

Both pages are marked `noindex`, so search engines are asked to skip them. Anyone with the link can still open the page.

## The status document

Fields in `status/current` (the admin page writes all of them):

| field | meaning |
| --- | --- |
| `status` | `waiting`, `hospital` or `born` |
| `note` | short message shown on the page (optional) |
| `due` | due date `YYYY-MM-DD`; when set the page shows days past or until it |
| `nameHint` | her name, shown before the birth as "Her name will be Maya." (the page assumes Maya until you change it) |
| `updated` | ISO time in UTC, shown in Berlin time (set automatically) |
| `born` | `name`, `at` (`YYYY-MM-DDTHH:mm`, local time), `weight`, `length`; shown once `status` is `born` |

## Customizing

- Wording and languages: the `T` object at the top of `app.js`.
- Colors: the `:root` variables in the `<style>` block of `index.html` and the `SCENES` object in `app.js`.

## Free tier

GitHub Pages is free for public repos. Firebase Spark is free and needs no payment card; Firestore includes 50,000 reads and 20,000 writes per day, far more than this page uses. Spark does not bill overages, it pauses the product for the rest of the month instead. Check the current limits at https://firebase.google.com/docs/projects/billing/firebase-pricing-plans.
