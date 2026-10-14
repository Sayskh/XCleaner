export function passesFilters(item, options) {
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
