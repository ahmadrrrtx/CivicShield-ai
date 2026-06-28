export function extractTitleFromHtml(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim() || null;
}

export function stripHtmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function createExcerpt(text: string, maxLength = 360) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function computeFreshness(lastUpdated: string, fetchedAt?: string): 'fresh' | 'aging' | 'stale' {
  const reference = fetchedAt || new Date().toISOString();
  const updatedTs = Date.parse(lastUpdated);
  const fetchedTs = Date.parse(reference);

  if (Number.isNaN(updatedTs) || Number.isNaN(fetchedTs)) return 'aging';

  const diffDays = Math.abs(fetchedTs - updatedTs) / (1000 * 60 * 60 * 24);
  if (diffDays <= 90) return 'fresh';
  if (diffDays <= 365) return 'aging';
  return 'stale';
}
