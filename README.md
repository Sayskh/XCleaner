# XCleaner

In-page floating tool to bulk delete your posts, undo reposts, and unlike tweets on X (Twitter).

Works without opening DevTools, inspecting network traffic, or copying authentication tokens.

## Features

* Bulk delete your posts and replies
* Bulk undo reposts (unretweet)
* Bulk unlike liked tweets
* Date range filters (only before or after a given date)
* Keep pinned posts safe
* Only delete posts containing links or media
* Whitelist specific post IDs from deletion
* Automatic backoff and resume on X rate limits (HTTP 429)
* Runs entirely inside your browser session, zero external servers

## Installation

### 1. Install a userscript manager

Pick one. Violentmonkey is open source, Tampermonkey is most popular. Both work.

**Chrome / Edge / Brave / Opera:**
* Tampermonkey: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
* Violentmonkey: https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlatuglb

**Firefox:**
* Tampermonkey: https://addons.mozilla.org/firefox/addon/tampermonkey/
* Violentmonkey: https://addons.mozilla.org/firefox/addon/violentmonkey/

**Safari:** Install Userscripts from the App Store, then enable it in Settings > Extensions.

**Mobile:** Kiwi Browser or Orion supports Tampermonkey / Violentmonkey.

After install, you will see the manager icon in your toolbar.

### 2. Install XCleaner

1. Open this link: https://raw.githubusercontent.com/Sayskh/XCleaner/main/dist/xcleaner.user.js
2. Your manager will open an install page. Click **Install**.
3. If no prompt appears, open the manager Dashboard > Utilities > Import from URL, paste the link above, then Install.

The manager will keep XCleaner updated automatically.

### 3. Use it

1. Open https://x.com and log in.
2. A floating `XC` button appears at the bottom-right.
3. Click it to open the panel, pick what to clean, and start.

## Development

Build the userscript bundle:

```bash
node build.js
```

Generated output:
* `dist/xcleaner.user.js` (single-file userscript)

A daily GitHub Actions workflow automatically checks X GraphQL endpoint IDs and updates `src/core/ids.json` if changes are detected.

## Credits

Based on earlier scripts by:
* [Lyfhael/DeleteTweets](https://github.com/Lyfhael/DeleteTweets)
* [Lyfhael/UnlikeAllTweets](https://github.com/Lyfhael/UnlikeAllTweets)

## License

MIT
