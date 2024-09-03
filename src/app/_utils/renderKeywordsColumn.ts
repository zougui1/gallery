const defaultLimit = 3;

export const renderKeywordsColumn = (keywords: string[], limit = defaultLimit): string => {
  if (!keywords || keywords.length <= limit) {
    return keywords.join(', ');
  }

  const summary = keywords.slice(0, limit);
  const overflowingKeywords = keywords.slice(limit);

  return `${summary.join(', ')}... +${overflowingKeywords.length}`;
}
