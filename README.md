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

Install Tampermonkey or Violentmonkey in your browser, then add `xcleaner.user.js` from the latest [Release](../../releases/latest), or open the raw file directly: https://raw.githubusercontent.com/Sayskh/XCleaner/main/dist/xcleaner.user.js

Works on any browser supporting a userscript manager, including Safari (via Userscripts app) and mobile browsers (Kiwi, Orion).

Open [x.com](https://x.com). A floating `XC` button appears at the bottom-right corner.

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
