// GraphQL client wrapper
// Handles headers, rate limit retry, and 404 detection

import { getCsrfToken, getUserId, DEFAULT_BEARER, getClientUserAgent } from './auth.js';
import { sleep } from './utils.js';

export function createClient(txIdProvider, onRateLimit, onLog) {
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
        const body = await response.text().catch(() => '');
        throw new Error(`Query ID or operation name is stale. Request: ${url} Response: ${body.slice(0, 300)}`);
      }

      if (response.status === 429) {
        const reset = response.headers.get('x-rate-limit-reset');
        const waitMs = reset ? Math.max(0, parseInt(reset) * 1000 - Date.now()) : 60000;
        onRateLimit?.(waitMs);
        onLog?.('warn', `Rate limited. Waiting ${Math.ceil(waitMs / 1000)} seconds...`);
        await sleep(waitMs);
        continue;
      }

      if (retry >= maxRetries) throw new Error(`Network error: ${response.status} ${response.statusText} on ${url}`);
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
      if (!queryId) throw new Error(`Missing query ID for ${operation}. Route ID not pinned in ids.json.`);
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
      if (!queryId) throw new Error(`Missing query ID for ${operation}. Route ID not pinned in ids.json.`);
      const url = `https://x.com/i/api/graphql/${queryId}/${operation}`;
      const body = JSON.stringify({ variables, queryId });
      const res = await request(url, { method: 'POST', body });
      return res.json();
    }
  };
}
