(() => {
  'use strict';
  const IDS = {
  "UserTweetsAndReplies": "qUpkZU6eN8MbtQb7rC_pYg",
  "DeleteTweet": "nxpZCY2K-I6QoFHAHeojFQ",
  "DeleteRetweet": "ZyZigVsNiFO6v1dEks1eWg",
  "Likes": "xA8fDIbrJfy4ojjjXmSR-A",
  "UnfavoriteTweet": "ZYKSe-w7KEslx3JhSIk5LA",
  "updatedAt": "2026-10-14T01:41:47.943593+00:00"
};
  const PANEL_HTML = "<!-- Vanilla Floating Panel Template for XCleaner -->\n<div id=\"xcleaner-root\" role=\"dialog\" aria-labelledby=\"xc-title-text\" aria-modal=\"false\">\n  <div class=\"xc-header\">\n    <div class=\"xc-title\" id=\"xc-title-text\">XCleaner</div>\n    <button class=\"xc-close\" id=\"xc-btn-close\" aria-label=\"Close XCleaner panel\" type=\"button\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n        <path d=\"M10.59 12L5 6.41 6.41 5 12 10.59 17.59 5 19 6.41 13.41 12 19 17.59 17.59 19 12 13.41 6.41 19 5 17.59 10.59 12z\"/>\n      </svg>\n    </button>\n  </div>\n\n  <div class=\"xc-body\">\n    <!-- State notice (Empty / Rate limit / Error / Success) -->\n    <div id=\"xc-status-banner\" class=\"xc-status\" style=\"display: none;\" role=\"status\" aria-live=\"polite\"></div>\n\n    <!-- Target Action Selector -->\n    <fieldset class=\"xc-group\" style=\"border: none; padding: 0; margin: 0;\">\n      <legend class=\"xc-label\">Items to Clean</legend>\n      <label class=\"xc-checkbox\">\n        <input type=\"checkbox\" id=\"xc-opt-posts\" checked>\n        <span>Delete my posts and replies</span>\n      </label>\n      <label class=\"xc-checkbox\">\n        <input type=\"checkbox\" id=\"xc-opt-unretweet\" checked>\n        <span>Undo reposts (unretweet)</span>\n      </label>\n      <label class=\"xc-checkbox\">\n        <input type=\"checkbox\" id=\"xc-opt-unlike\">\n        <span>Unlike liked posts</span>\n      </label>\n    </fieldset>\n\n    <!-- Filters -->\n    <div class=\"xc-group\">\n      <label class=\"xc-label\" for=\"xc-date-after\">Date Range (Optional)</label>\n      <div style=\"display: flex; gap: 8px;\">\n        <input type=\"date\" id=\"xc-date-after\" class=\"xc-input\" aria-label=\"Only after date\">\n        <input type=\"date\" id=\"xc-date-before\" class=\"xc-input\" aria-label=\"Only before date\">\n      </div>\n    </div>\n\n    <div class=\"xc-group\">\n      <label class=\"xc-checkbox\">\n        <input type=\"checkbox\" id=\"xc-opt-pinned\" checked>\n        <span>Keep pinned post safe</span>\n      </label>\n      <label class=\"xc-checkbox\">\n        <input type=\"checkbox\" id=\"xc-opt-urlonly\">\n        <span>Only delete posts with links or media</span>\n      </label>\n    </div>\n\n    <div class=\"xc-group\">\n      <label class=\"xc-label\" for=\"xc-whitelist-ids\">Keep specific Post IDs (Comma-separated)</label>\n      <input type=\"text\" id=\"xc-whitelist-ids\" class=\"xc-input\" placeholder=\"1840000000000000000, 1840000000000000001\">\n    </div>\n\n    <!-- Progress indicator -->\n    <div class=\"xc-progress\" id=\"xc-progress-section\" style=\"display: none;\">\n      <div style=\"display: flex; justify-content: space-between; font-size: 12px;\">\n        <span id=\"xc-progress-summary\">Scanned: 0</span>\n        <span id=\"xc-progress-actions\">Deleted: 0</span>\n      </div>\n      <div class=\"xc-progress-bar\">\n        <div class=\"xc-progress-fill\" id=\"xc-progress-fill\"></div>\n      </div>\n    </div>\n\n    <!-- Execution log -->\n    <div class=\"xc-group\">\n      <label class=\"xc-label\" for=\"xc-log-box\">Activity Log</label>\n      <div id=\"xc-log-box\" class=\"xc-log\" role=\"log\" aria-live=\"polite\">Ready. Choose options and click Start.</div>\n    </div>\n\n    <!-- Action Buttons -->\n    <div class=\"xc-actions\">\n      <button type=\"button\" id=\"xc-btn-start\" class=\"xc-btn xc-btn-primary\">Start Cleaning</button>\n      <button type=\"button\" id=\"xc-btn-pause\" class=\"xc-btn xc-btn-secondary\" style=\"display: none;\">Pause</button>\n      <button type=\"button\" id=\"xc-btn-stop\" class=\"xc-btn xc-btn-secondary\" style=\"display: none;\">Stop</button>\n    </div>\n  </div>\n</div>\n";
  const PANEL_CSS = "/* XCleaner floating panel - Vanilla, inheriting x.com native aesthetic */\n#xcleaner-root {\n  position: fixed;\n  bottom: 24px;\n  right: 24px;\n  width: 360px;\n  max-height: 560px;\n  overflow-y: auto;\n  background: #ffffff;\n  border: 1px solid #cfd9de;\n  border-radius: 16px;\n  box-shadow: 0 8px 24px rgba(0,0,0,0.16);\n  z-index: 99999;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n  color: #0f1419;\n  font-size: 14px;\n  line-height: 1.5;\n}\n@media (prefers-color-scheme: dark) {\n  #xcleaner-root {\n    background: #16181c;\n    border-color: #2f3336;\n    color: #e7e9ea;\n    box-shadow: 0 8px 24px rgba(0,0,0,0.6);\n  }\n}\n#xcleaner-root * { box-sizing: border-box; }\n.xc-header {\n  display: flex; align-items: center; justify-content: space-between;\n  padding: 16px; border-bottom: 1px solid #eff3f4;\n}\n@media (prefers-color-scheme: dark) { .xc-header { border-color: #2f3336; } }\n.xc-title { font-weight: 700; font-size: 16px; }\n.xc-close { width: 44px; height: 44px; display: grid; place-items: center; border: none; background: none; cursor: pointer; border-radius: 9999px; }\n.xc-close:focus-visible, .xc-btn:focus-visible, input:focus-visible { outline: 2px solid #1d9bf0; outline-offset: 2px; }\n.xc-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }\n.xc-group { display: flex; flex-direction: column; gap: 8px; }\n.xc-label { font-weight: 600; font-size: 13px; }\n.xc-checkbox { display: flex; align-items: center; gap: 8px; }\n.xc-checkbox input { width: 18px; height: 18px; }\n.xc-input, .xc-textarea { width: 100%; padding: 10px 12px; border: 1px solid #cfd9de; border-radius: 8px; font-size: 14px; }\n@media (prefers-color-scheme: dark) { .xc-input, .xc-textarea { background:#202327; border-color:#333639; color:#e7e9ea; } }\n.xc-actions { display: flex; gap: 8px; }\n.xc-btn { flex: 1; height: 44px; border-radius: 9999px; border: none; font-weight: 700; cursor: pointer; }\n.xc-btn-primary { background: #f4212e; color: #fff; }\n.xc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }\n.xc-btn-secondary { background: transparent; border: 1px solid #cfd9de; color: inherit; }\n@media (prefers-color-scheme: dark) { .xc-btn-secondary { border-color:#2f3336; } }\n.xc-progress { display: flex; flex-direction: column; gap: 6px; }\n.xc-progress-bar { height: 8px; background: #eff3f4; border-radius: 9999px; overflow: hidden; }\n.xc-progress-fill { height: 100%; width: 0; background: #1d9bf0; transition: width 0.3s ease; }\n.xc-log { background: #f7f9f9; border: 1px solid #eff3f4; border-radius: 8px; padding: 8px; max-height: 160px; overflow-y: auto; font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }\n@media (prefers-color-scheme: dark) { .xc-log { background:#0f1419; border-color:#2f3336; } }\n.xc-status { padding: 8px 12px; border-radius: 8px; font-size: 13px; }\n.xc-status--rate { background: #fff3cd; color: #664d03; }\n@media (prefers-color-scheme: dark) { .xc-status--rate { background:#332701; color:#ffd54d; } }\n.xc-status--error { background: #fdd9d7; color: #5f2120; }\n@media (prefers-color-scheme: dark) { .xc-status--error { background:#3a1211; color:#f28b82; } }\n.xc-status--success { background: #d1e7dd; color: #0a3622; }\n@media (prefers-color-scheme: dark) { .xc-status--success { background:#0a2e1f; color:#81c995; } }\n";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Native cookie and auth extractor for x.com
// Zero dependencies, runs directly in browser context

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getUserId() {
  const twidMatch = document.cookie.match(/twid="?u%3D([0-9]+)"?/);
  if (twidMatch && twidMatch[1]) return twidMatch[1];
  const authMatch = document.cookie.match(/auth_token=([0-9]+)-/);
  if (authMatch && authMatch[1]) return authMatch[1];
  return null;
}

function getCsrfToken() {
  return getCookie('ct0');
}

// Fallback public web client bearer token used across X web client
const DEFAULT_BEARER = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

function getClientUserAgent() {
  if (typeof navigator !== 'undefined' && navigator.userAgentData?.brands) {
    return navigator.userAgentData.brands.map(b => `"${b.brand}";v="${b.version}"`).join(', ');
  }
  return '"Chromium";v="130", "Not?A_Brand";v="99"';
}

function passesFilters(item, options) {
  if (!options) return true;

  if (options.whitelistIds?.length && options.whitelistIds.includes(item.id)) {
    return false;
  }

  if (options.whitelistAuthors?.length && item.authorUsername) {
    const authorLower = item.authorUsername.toLowerCase();
    if (options.whitelistAuthors.some(a => a.toLowerCase() === authorLower)) {
      return false;
    }
  }

  if (options.keepPinned && item.isPinned) {
    return false;
  }

  if (item.createdAt) {
    if (options.afterDate && item.createdAt < options.afterDate) return false;
    if (options.beforeDate && item.createdAt > options.beforeDate) return false;
  }

  if (options.urlOnly && !item.hasUrl) {
    return false;
  }

  if (options.matchKeywords?.length && item.text) {
    const textLower = item.text.toLowerCase();
    if (!options.matchKeywords.some(kw => textLower.includes(kw.toLowerCase()))) {
      return false;
    }
  }

  return true;
}

// GraphQL client wrapper
// Handles headers, rate limit retry, and 404 detection



function createClient(txIdProvider, onRateLimit, onLog) {
  const csrf = getCsrfToken();
  const userId = getUserId();
  if (!csrf || !userId) throw new Error('Not logged in. Please log in to x.com first.');

  async function request(url, options = {}) {
    let retry = 0;
    const maxRetries = 5;

    async function doFetch() {
      const txId = txIdProvider?.() || '';
      const headers = {
        'accept': '*/*',
        'authorization': DEFAULT_BEARER,
        'content-type': 'application/json',
        'sec-ch-ua': getClientUserAgent(),
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-csrf-token': csrf,
        'x-twitter-active-user': 'yes',
        'x-twitter-auth-type': 'OAuth2Session',
        'x-twitter-client-language': 'en',
        'x-client-uuid': crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-000000000000'
      };
      if (txId) headers['x-client-transaction-id'] = txId;

      return fetch(url, { ...options, headers, credentials: 'include', mode: 'cors' });
    }

    while (true) {
      const response = await doFetch();

      if (response.ok) return response;

      if (response.status === 404) {
        throw new Error('Query ID is outdated. Please wait for auto-sync or update ids.json manually.');
      }

      if (response.status === 429) {
        const reset = response.headers.get('x-rate-limit-reset');
        const waitMs = reset ? Math.max(0, parseInt(reset) * 1000 - Date.now()) : 60000;
        onRateLimit?.(waitMs);
        onLog?.('warn', `Rate limited. Waiting ${Math.ceil(waitMs / 1000)} seconds...`);
        await sleep(waitMs);
        continue;
      }

      if (retry >= maxRetries) throw new Error(`Network error: ${response.status} ${response.statusText}`);
      retry++;
      const backoff = 10000 * retry;
      onLog?.('warn', `Request failed (${response.status}). Retrying in ${backoff / 1000}s...`);
      await sleep(backoff);
    }
  }

  return {
    userId,
    request,
    get: async (queryId, operation, variables, features = {}, fieldToggles = {}) => {
      const params = new URLSearchParams({
        variables: JSON.stringify(variables),
        features: JSON.stringify(features),
        fieldToggles: JSON.stringify(fieldToggles)
      });
      const url = `https://x.com/i/api/graphql/${queryId}/${operation}?${params.toString()}`;
      const res = await request(url, { method: 'GET' });
      return res.json();
    },
    post: async (queryId, operation, variables) => {
      const url = `https://x.com/i/api/graphql/${queryId}/${operation}`;
      const body = JSON.stringify({ variables, queryId });
      const res = await request(url, { method: 'POST', body });
      return res.json();
    }
  };
}

const TWEETS_FEATURES = {
  rweb_lists_timeline_redesign_enabled: true,
  responsive_web_graphql_exclude_directive_enabled: true,
  verified_phone_label_enabled: false,
  creator_subscriptions_tweet_preview_api_enabled: true,
  responsive_web_graphql_timeline_navigation_enabled: true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  tweetypie_unmention_optimization_enabled: true,
  responsive_web_edit_tweet_api_enabled: true,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
  view_counts_everywhere_api_enabled: true,
  longform_notetweets_consumption_enabled: true,
  responsive_web_twitter_article_tweet_consumption_enabled: false,
  tweet_awards_web_tipping_enabled: false,
  freedom_of_speech_not_reach_fetch_enabled: true,
  standardized_nudges_misinfo: true,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
  longform_notetweets_rich_text_read_enabled: true,
  longform_notetweets_inline_media_enabled: true,
  responsive_web_media_download_video_enabled: false,
  responsive_web_enhance_cards_enabled: false
};

async function* scanUserTweets(client, ids, options, onLog) {
  let cursor = null;
  const count = 40;

  while (true) {
    const variables = {
      userId: client.userId,
      count,
      includePromotedContent: false,
      withCommunity: true,
      withVoice: true
    };
    if (cursor) variables.cursor = cursor;

    onLog?.('info', 'Scanning posts timeline...');
    const data = await client.get(ids.UserTweetsAndReplies, 'UserTweetsAndReplies', variables, TWEETS_FEATURES);

    const instructions = data?.data?.user?.result?.timeline_v2?.timeline?.instructions || [];
    let entries = [];
    for (const inst of instructions) {
      if (inst.type === 'TimelineAddEntries') entries = inst.entries;
    }

    if (!entries || entries.length === 0) break;

    let foundItems = 0;
    let nextCursor = null;

    for (const entry of entries) {
      if (entry.entryId?.startsWith('cursor-bottom-')) {
        nextCursor = entry.content?.value;
        continue;
      }

      const item = parseTweetEntry(entry);
      if (!item) continue;

      foundItems++;
      if (passesFilters(item, options)) {
        yield item;
      } else {
        onLog?.('info', `Skipped post: ${item.id} (filtered)`);
      }
    }

    if (!nextCursor || nextCursor === cursor || foundItems === 0) {
      break;
    }
    cursor = nextCursor;
    await sleep(1500);
  }
}

function parseTweetEntry(entry) {
  let tweet = null;
  function recurse(obj) {
    if (!obj || typeof obj !== 'object' || tweet) return;
    if ((obj.__typename === 'Tweet' || obj.rest_id) && obj.legacy) {
      tweet = obj;
      return;
    }
    for (const k of Object.keys(obj)) recurse(obj[k]);
  }
  recurse(entry);

  if (!tweet) return null;

  const legacy = tweet.legacy || {};
  const isRetweet = Boolean(legacy.retweeted_status_result);
  const sourceTweetId = legacy.retweeted_status_result?.result?.rest_id || null;
  const createdAt = legacy.created_at ? new Date(legacy.created_at).getTime() : null;
  const hasUrl = Boolean((legacy.entities?.urls && legacy.entities.urls.length > 0) || (legacy.entities?.media && legacy.entities.media.length > 0));

  return {
    id: tweet.rest_id || legacy.id_str,
    isRetweet,
    sourceTweetId,
    createdAt,
    hasUrl,
    text: legacy.full_text || '',
    authorUsername: tweet.core?.user_results?.result?.legacy?.screen_name || null,
    isPinned: Boolean(entry.entryId?.includes('pinned'))
  };
}

async function deletePost(client, ids, item, onLog) {
  if (item.isRetweet && item.sourceTweetId) {
    onLog?.('info', `Unretweeting original post ${item.sourceTweetId}...`);
    await client.post(ids.DeleteRetweet, 'DeleteRetweet', {
      source_tweet_id: item.sourceTweetId,
      dark_request: false
    });
  } else {
    onLog?.('info', `Deleting post ${item.id}...`);
    await client.post(ids.DeleteTweet, 'DeleteTweet', {
      tweet_id: item.id,
      dark_request: false
    });
  }
}

const LIKES_FEATURES = {
  rweb_lists_timeline_redesign_enabled: true,
  responsive_web_graphql_exclude_directive_enabled: true,
  verified_phone_label_enabled: false,
  creator_subscriptions_tweet_preview_api_enabled: true,
  responsive_web_graphql_timeline_navigation_enabled: true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  tweetypie_unmention_optimization_enabled: true,
  responsive_web_edit_tweet_api_enabled: true,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
  view_counts_everywhere_api_enabled: true,
  longform_notetweets_consumption_enabled: true,
  responsive_web_twitter_article_tweet_consumption_enabled: false,
  tweet_awards_web_tipping_enabled: false,
  freedom_of_speech_not_reach_fetch_enabled: true,
  standardized_nudges_misinfo: true,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
  longform_notetweets_rich_text_read_enabled: true,
  longform_notetweets_inline_media_enabled: true,
  responsive_web_media_download_video_enabled: false,
  responsive_web_enhance_cards_enabled: false
};

async function* scanUserLikes(client, ids, options, onLog) {
  let cursor = null;
  const count = 40;

  while (true) {
    const variables = {
      userId: client.userId,
      count,
      includePromotedContent: false,
      withClientEventToken: false,
      withBirdwatchNotes: false,
      withVoice: true,
      withV2Timeline: true
    };
    if (cursor) variables.cursor = cursor;

    onLog?.('info', 'Scanning likes timeline...');
    const data = await client.get(ids.Likes, 'Likes', variables, LIKES_FEATURES);

    const instructions = data?.data?.user?.result?.timeline_v2?.timeline?.instructions || [];
    let entries = [];
    for (const inst of instructions) {
      if (inst.type === 'TimelineAddEntries') entries = inst.entries;
    }

    if (!entries || entries.length === 0) break;

    let foundItems = 0;
    let nextCursor = null;

    for (const entry of entries) {
      if (entry.entryId?.startsWith('cursor-bottom-')) {
        nextCursor = entry.content?.value;
        continue;
      }

      const item = parseLikeEntry(entry);
      if (!item) continue;

      foundItems++;
      if (passesFilters(item, options)) {
        yield item;
      } else {
        onLog?.('info', `Skipped liked post: ${item.id} (filtered)`);
      }
    }

    if (!nextCursor || nextCursor === cursor || foundItems === 0) {
      break;
    }
    cursor = nextCursor;
    await sleep(1500);
  }
}

function parseLikeEntry(entry) {
  let tweet = null;
  function recurse(obj) {
    if (!obj || typeof obj !== 'object' || tweet) return;
    if ((obj.__typename === 'Tweet' || obj.rest_id) && obj.legacy) {
      tweet = obj;
      return;
    }
    for (const k of Object.keys(obj)) recurse(obj[k]);
  }
  recurse(entry);

  if (!tweet) return null;

  const legacy = tweet.legacy || {};
  const createdAt = legacy.created_at ? new Date(legacy.created_at).getTime() : null;
  const hasUrl = Boolean((legacy.entities?.urls && legacy.entities.urls.length > 0) || (legacy.entities?.media && legacy.entities.media.length > 0));

  return {
    id: tweet.rest_id || legacy.id_str,
    createdAt,
    hasUrl,
    text: legacy.full_text || '',
    authorUsername: tweet.core?.user_results?.result?.legacy?.screen_name || legacy.screen_name || null,
    isPinned: false
  };
}

async function unlikePost(client, ids, item, onLog) {
  onLog?.('info', `Unliking post ${item.id}...`);
  await client.post(ids.UnfavoriteTweet, 'UnfavoriteTweet', {
    tweet_id: item.id
  });
}

class CleanerRunner {
  constructor(client, ids, options, callbacks = {}) {
    this.client = client;
    this.ids = ids;
    this.options = options;
    this.callbacks = callbacks;
    this.state = 'idle';
    this.counters = {
      scanned: 0,
      deletedPosts: 0,
      unretweeted: 0,
      unliked: 0,
      skipped: 0
    };
  }

  log(level, message) {
    this.callbacks.onLog?.(level, message);
  }

  reportProgress() {
    this.callbacks.onProgress?.({
      state: this.state,
      counters: { ...this.counters }
    });
  }

  pause() {
    if (this.state === 'running') {
      this.state = 'paused';
      this.log('info', 'Process paused by user.');
      this.reportProgress();
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'running';
      this.log('info', 'Process resumed.');
      this.reportProgress();
    }
  }

  stop() {
    this.state = 'stopped';
    this.log('info', 'Process stopped by user.');
    this.reportProgress();
  }

  async run() {
    this.state = 'running';
    this.reportProgress();
    this.log('info', 'Starting XCleaner run...');

    try {
      if (this.options.deletePosts || this.options.unretweet) {
        for await (const item of scanUserTweets(this.client, this.ids, this.options, (lvl, msg) => this.log(lvl, msg))) {
          while (this.state === 'paused') await sleep(500);
          if (this.state === 'stopped') break;

          this.counters.scanned++;

          if (item.isRetweet && !this.options.unretweet) {
            this.counters.skipped++;
            this.reportProgress();
            continue;
          }
          if (!item.isRetweet && !this.options.deletePosts) {
            this.counters.skipped++;
            this.reportProgress();
            continue;
          }

          await deletePost(this.client, this.ids, item, (lvl, msg) => this.log(lvl, msg));

          if (item.isRetweet) {
            this.counters.unretweeted++;
          } else {
            this.counters.deletedPosts++;
          }

          this.reportProgress();
          await sleep(1000 + Math.random() * 800);
        }
      }

      if (this.state !== 'stopped' && this.options.unlike) {
        for await (const item of scanUserLikes(this.client, this.ids, this.options, (lvl, msg) => this.log(lvl, msg))) {
          while (this.state === 'paused') await sleep(500);
          if (this.state === 'stopped') break;

          this.counters.scanned++;
          await unlikePost(this.client, this.ids, item, (lvl, msg) => this.log(lvl, msg));
          this.counters.unliked++;
          this.reportProgress();
          await sleep(1000 + Math.random() * 800);
        }
      }

      if (this.state !== 'stopped') {
        this.state = 'done';
        this.log('info', 'Finished successfully. All selected items processed.');
      }
    } catch (err) {
      this.state = 'error';
      this.log('error', `Run aborted due to error: ${err.message}`);
      this.callbacks.onError?.(err);
    } finally {
      this.reportProgress();
    }
  }
}

// UI Panel Controller - binds HTML/CSS to CleanerRunner
// Adheres strictly to antislop: no buzzwords, 3 states, 44px buttons, AA contrast



function mountXCleaner(containerEl, ids, options = {}) {
  const panel = containerEl.querySelector('#xcleaner-root');
  if (!panel) return;

  const btnClose = panel.querySelector('#xc-btn-close');
  const btnStart = panel.querySelector('#xc-btn-start');
  const btnPause = panel.querySelector('#xc-btn-pause');
  const btnStop = panel.querySelector('#xc-btn-stop');
  const logBox = panel.querySelector('#xc-log-box');
  const statusBanner = panel.querySelector('#xc-status-banner');
  const progressSection = panel.querySelector('#xc-progress-section');
  const progressSummary = panel.querySelector('#xc-progress-summary');
  const progressActions = panel.querySelector('#xc-progress-actions');

  // Input elements
  const optPosts = panel.querySelector('#xc-opt-posts');
  const optUnretweet = panel.querySelector('#xc-opt-unretweet');
  const optUnlike = panel.querySelector('#xc-opt-unlike');
  const optPinned = panel.querySelector('#xc-opt-pinned');
  const optUrlOnly = panel.querySelector('#xc-opt-urlonly');
  const dateAfter = panel.querySelector('#xc-date-after');
  const dateBefore = panel.querySelector('#xc-date-before');
  const whitelistIds = panel.querySelector('#xc-whitelist-ids');

  let runner = null;

  function appendLog(level, message) {
    const time = new Date().toLocaleTimeString();
    const line = `[${time}] ${message}\n`;
    logBox.textContent += line;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setBanner(type, message) {
    if (!message) {
      statusBanner.style.display = 'none';
      return;
    }
    statusBanner.className = `xc-status xc-status--${type}`;
    statusBanner.textContent = message;
    statusBanner.style.display = 'block';
  }

  btnClose.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  btnStart.addEventListener('click', async () => {
    // Validate selection
    if (!optPosts.checked && !optUnretweet.checked && !optUnlike.checked) {
      setBanner('error', 'Please select at least one item type to clean.');
      return;
    }

    setBanner(null);
    logBox.textContent = '';
    progressSection.style.display = 'flex';
    btnStart.style.display = 'none';
    btnPause.style.display = 'block';
    btnStop.style.display = 'block';

    const parseIds = whitelistIds.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const runOptions = {
      deletePosts: optPosts.checked,
      unretweet: optUnretweet.checked,
      unlike: optUnlike.checked,
      keepPinned: optPinned.checked,
      urlOnly: optUrlOnly.checked,
      afterDate: dateAfter.value ? new Date(dateAfter.value).getTime() : null,
      beforeDate: dateBefore.value ? new Date(dateBefore.value).getTime() : null,
      whitelistIds: parseIds
    };

    try {
      const txProvider = () => options.getTransactionId ? options.getTransactionId() : '';
      const client = createClient(
        txProvider,
        (waitMs) => {
          setBanner('rate', `Rate limited by X. Pausing for ${Math.ceil(waitMs / 1000)} seconds...`);
        },
        (lvl, msg) => appendLog(lvl, msg)
      );

      runner = new CleanerRunner(client, ids, runOptions, {
        onLog: (lvl, msg) => appendLog(lvl, msg),
        onProgress: (p) => {
          progressSummary.textContent = `Scanned: ${p.counters.scanned}`;
          progressActions.textContent = `Deleted: ${p.counters.deletedPosts} | Unretweeted: ${p.counters.unretweeted} | Unliked: ${p.counters.unliked}`;
          if (p.state === 'done') {
            setBanner('success', 'Cleaning completed. All matched posts have been removed.');
            btnStart.style.display = 'block';
            btnPause.style.display = 'none';
            btnStop.style.display = 'none';
          }
        },
        onError: (err) => {
          setBanner('error', `Error: ${err.message}`);
          btnStart.style.display = 'block';
          btnPause.style.display = 'none';
          btnStop.style.display = 'none';
        }
      });

      await runner.run();
    } catch (err) {
      setBanner('error', `Failed to start: ${err.message}`);
      btnStart.style.display = 'block';
      btnPause.style.display = 'none';
      btnStop.style.display = 'none';
    }
  });

  btnPause.addEventListener('click', () => {
    if (!runner) return;
    if (runner.state === 'running') {
      runner.pause();
      btnPause.textContent = 'Resume';
    } else if (runner.state === 'paused') {
      runner.resume();
      btnPause.textContent = 'Pause';
    }
  });

  btnStop.addEventListener('click', () => {
    if (runner) runner.stop();
    btnStart.style.display = 'block';
    btnPause.style.display = 'none';
    btnStop.style.display = 'none';
    setBanner('rate', 'Process stopped.');
  });
}

// Mount logic: injects FAB + panel into x.com page
// Uses globals: IDS, PANEL_HTML, PANEL_CSS, mountXCleaner (defined by build.js inlining)

function injectFloatingUI() {
  if (document.getElementById('xcleaner-fab') || document.getElementById('xcleaner-root')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'xcleaner-styles';
  styleEl.textContent = PANEL_CSS;
  document.head.appendChild(styleEl);

  const fab = document.createElement('button');
  fab.id = 'xcleaner-fab';
  fab.textContent = 'XC';
  fab.setAttribute('aria-label', 'Open XCleaner');
  fab.style.cssText =
    'position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:9999px;background:#0f1419;color:#ffffff;border:1px solid #2f3336;z-index:99998;cursor:pointer;font-weight:700;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
  document.body.appendChild(fab);

  const container = document.createElement('div');
  container.id = 'xcleaner-container';
  container.innerHTML = PANEL_HTML;
  document.body.appendChild(container);

  const panel = container.querySelector('#xcleaner-root');
  panel.style.display = 'none';

  fab.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  mountXCleaner(container, IDS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingUI);
} else {
  injectFloatingUI();
}
})();