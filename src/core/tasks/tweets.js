import { passesFilters } from '../filters.js';
import { sleep } from '../utils.js';

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

export async function* scanUserTweets(client, ids, options, onLog) {
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

export async function deletePost(client, ids, item, onLog) {
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
