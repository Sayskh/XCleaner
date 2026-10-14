# XCleaner

In-page floating tool to bulk delete your posts, undo reposts, and unlike tweets on X (Twitter).

No DevTools, no token copying, no external servers. Everything runs inside your browser session on the account you are logged into.

## Before you use this

Deletion is final. X gives you no way to restore a deleted post, an undone repost, or a removed like. Once it is gone, it is gone.

XCleaner only acts on the account currently logged in in your browser. You choose the filters, you press start, and you are responsible for what gets cleaned. Read the panel options before running a pass.

X rate limits apply. The script backs off automatically when it hits HTTP 429 and pauses until it can continue. That is expected, not a failure.

If you might regret losing something, keep a copy first. Export your archive from X settings, or save the posts you care about, before you start.

## Features

* Bulk delete your posts and replies
* Bulk undo reposts (unretweet)
* Bulk unlike liked tweets
* Date range filters (From / To)
* Keep pinned posts safe
* Only delete posts containing links or media
* Whitelist specific post IDs from deletion
* Automatic backoff on X rate limits (HTTP 429)
* Live log with progress, pause, and stop controls

## Installation

### 1. Install a userscript manager

Pick one. Violentmonkey is open source, Tampermonkey is most popular. Both work.

**Chrome / Edge / Brave / Opera:**
* [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlatuglb)

**Firefox:**
* [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
* [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)

**Safari:** Install Userscripts from the App Store, then enable it in Settings > Extensions.

**Mobile:** Kiwi Browser or Orion supports Tampermonkey / Violentmonkey.

After install, you will see the manager icon in your toolbar.

### 2. Install XCleaner

1. Open this link: [xcleaner.user.js](https://raw.githubusercontent.com/Sayskh/XCleaner/main/dist/xcleaner.user.js)
2. Your manager will open an install page. Click **Install**.
3. If no prompt appears, open the manager Dashboard > Utilities > Import from URL, paste the link above, then Install.

The manager keeps XCleaner updated automatically from that same URL.

### 3. Use it

1. Open [x.com](https://x.com) and log in.
2. A floating `XC` button appears at the bottom-right.
3. Click it to open the panel, pick what to clean, and start.

## Development

Build the userscript bundle:

```bash
node build.js
```

Output:
* `dist/xcleaner.user.js` (single-file userscript)

X exposes GraphQL query IDs that change over time. A daily GitHub Actions workflow (`.github/workflows/sync-ids.yml`) checks them and updates `src/core/ids.json` when a change is detected.

## Credits

Big thanks to Lyfhael. XCleaner exists because these two scripts came first:

* [DeleteTweets](https://github.com/Lyfhael/DeleteTweets)
* [UnlikeAllTweets](https://github.com/Lyfhael/UnlikeAllTweets)

XCleaner builds on that work. The original MIT license text is carried in [LICENSE](LICENSE), covering Lyfhael (2023) and Sayskh (2026).

## License

MIT. You can use, modify, and redistribute it. See [LICENSE](LICENSE) for the full text and copyright notices.
