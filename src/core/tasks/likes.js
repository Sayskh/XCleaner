import { passesFilters } from '../filters.js';
import { sleep, findInstructions } from '../utils.js';

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

export async function* scanUserLikes(client, ids, options, onLog) {
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

    const instructions = findInstructions(data);
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

export async function unlikePost(client, ids, item, onLog) {
  onLog?.('info', `Unliking post ${item.id}...`);
  await client.post(ids.UnfavoriteTweet, 'UnfavoriteTweet', {
    tweet_id: item.id
  });
}
