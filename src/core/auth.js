// Native cookie and auth extractor for x.com
// Zero dependencies, runs directly in browser context

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export function getUserId() {
  const twidMatch = document.cookie.match(/twid="?u%3D([0-9]+)"?/);
  if (twidMatch && twidMatch[1]) return twidMatch[1];
  const authMatch = document.cookie.match(/auth_token=([0-9]+)-/);
  if (authMatch && authMatch[1]) return authMatch[1];
  return null;
}

export function getCsrfToken() {
  return getCookie('ct0');
}

// Fallback public web client bearer token used across X web client
export const DEFAULT_BEARER = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

export function getClientUserAgent() {
  if (typeof navigator !== 'undefined' && navigator.userAgentData?.brands) {
    return navigator.userAgentData.brands.map(b => `"${b.brand}";v="${b.version}"`).join(', ');
  }
  return '"Chromium";v="130", "Not?A_Brand";v="99"';
}
