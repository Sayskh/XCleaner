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

### Quick Install (no build step)

1. Open the latest [Release](../../releases/latest).
2. Chrome / Edge / Brave: download `XCleaner-extension.zip`, extract anywhere.
3. Firefox: download `XCleaner.xpi`.
4. Follow the browser-specific step below.

### 1. Chromium Browsers (Chrome, Edge, Brave, Opera, Vivaldi)

1. Open `chrome://extensions` in your browser.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked** and select the extracted `XCleaner-extension` folder.
4. Open [x.com](https://x.com). A floating `XC` button appears at the bottom-right corner.

### 2. Firefox and Firefox-based Browsers (LibreWolf, Floorp, Waterfox)

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on...**
3. Select the downloaded `XCleaner.xpi`, or `manifest.json` inside the extracted `XCleaner-extension` folder.
4. Open [x.com](https://x.com). The floating `XC` button will appear at the bottom-right.

Temporary add-ons unload when Firefox restarts. Reload it from `about:debugging` after each restart.

### 3. Userscript (Tampermonkey, Violentmonkey)

Works on any browser supporting a userscript manager, including Safari (via Userscripts app) and mobile browsers (Kiwi, Orion).

1. Install Tampermonkey or Violentmonkey in your browser.
2. Download `xcleaner.user.js` from the [latest Release](../../releases/latest), or open the raw file directly: https://raw.githubusercontent.com/Sayskh/XCleaner/main/dist/xcleaner.user.js
3. Open [x.com](https://x.com) to use the panel.

## Development

Build both extension and userscript bundles:

```bash
node build.js
```

Generated outputs:
* `dist/extension/` (cross-browser Manifest V3 extension)
* `dist/xcleaner.user.js` (single-file userscript)

A daily GitHub Actions workflow automatically checks X GraphQL endpoint IDs and updates `src/core/ids.json` if changes are detected.

## Credits

Based on earlier scripts by:
* [Lyfhael/DeleteTweets](https://github.com/Lyfhael/DeleteTweets)
* [Lyfhael/UnlikeAllTweets](https://github.com/Lyfhael/UnlikeAllTweets)

## License

MIT
