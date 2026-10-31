# Tziutziya

A tiny Progressive Web App for saving tweets from X into folders, displayed in a Pinterest-style board layout. Everything is stored locally on your device (IndexedDB), with JSON export and import for backup and restore.

No framework, no build step: plain HTML, CSS and JavaScript.

**Live app: [lraviv.github.io/tziutziya](https://lraviv.github.io/tziutziya/)**

## Features

- **Folders as boards**: each folder shows a collage of images from its tweets
- **Folder tags**: tag folders (e.g. `work`, `recipes`) and filter the home screen by tag
- **Masonry grid** of saved tweets with text, images, videos and quoted tweets
- **Notes** on any saved tweet
- **Search** across tweet text, notes, author names and folder names
- **Move, edit and delete** saved tweets; rename and delete folders
- **Sorting** inside each folder: recently or oldest saved, recently or oldest posted (remembered per folder)
- **Select mode**: long-press a tweet (or tap the check button) to select several and move or delete them together
- **Backup and restore** to a JSON file (merge or full replace), with a backup reminder you can set to weekly, every 2 weeks, monthly, or off
- **Works offline**: the app shell and tweet images are cached by a service worker
- **English and Hebrew** interface with full RTL support. Choose the language in Settings; the choice is remembered on the device (the default follows the device language)
- **Light and dark mode**, following the system setting

## Deploy (GitHub Pages, free)

1. Push the files to a public GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then click **Save**.
4. After a minute or two the site is live at `https://<username>.github.io/<repo>/`.

Or with the GitHub CLI, from the project folder:

```bash
gh api -X POST repos/{owner}/{repo}/pages -f "source[branch]=main" -f "source[path]=/"
```

Any static host works (Netlify, Vercel, Cloudflare Pages), as long as it serves over HTTPS.

## Install on iPhone

1. Open the site in **Safari**.
2. Tap the Share button, then **Add to Home Screen**.
3. From now on, open the app from its home screen icon.

> On iOS, a home screen web app has its own storage, separate from Safari, and that storage is not cleared automatically. Always use the installed app so your saves stay in one place.

## Saving a tweet

1. In the X app, tap **Share** on a tweet, then **Copy Link**.
2. Open Tziutziya and tap the **Save tweet** button at the bottom. Allow "Paste" if iOS asks.
3. Pick a folder (or create a new one), optionally add a note, and save.

On Android, the app also registers as a share target, so it can appear directly in the share sheet once installed.

## Backup

Open **Settings** (⚙︎):

- **Export backup** opens the share sheet, where you can choose "Save to Files" or iCloud.
- **Restore from backup** lets you merge a backup with what's already saved, or replace everything.

The backup includes folders, tweets, notes and image links. The images themselves are not included in the file.

## How it works

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup, styles and logic, with hash-based routing |
| `sw.js` | Service worker: offline app shell (stale-while-revalidate) and image cache |
| `manifest.webmanifest` | PWA manifest: name, icons, standalone display, share target |
| `icon-*.png`, `apple-touch-icon.png` | App icons |

Tweet content (text, media, quoted tweet) is fetched from the public [FxTwitter](https://github.com/FixTweet/FxTwitter) API (`api.fxtwitter.com`), so no X API key is needed. If that service is unavailable, the tweet is saved as a link only, and you can retry fetching its content later from the tweet's detail view.

## Privacy

There is no backend and no account. Your folders and saved tweets never leave your device, except for the tweet IDs sent to FxTwitter to fetch their content, and the backup files you export yourself.
