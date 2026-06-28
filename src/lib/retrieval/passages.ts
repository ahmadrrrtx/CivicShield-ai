export type RankedPassage = {
  text: string;
  score: number;
};

export function splitIntoPassages(text: string, maxPassageLength = 420) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [] as string[];

  const roughSegments = normalized.split(/(?<=[.!?])\s+/);
  const passages: string[] = [];
  let current = '';

  for (const segment of roughSegments) {
    const next = current ? `${current} ${segment}` : segment;
    if (next.length <= maxPassageLength) {
      current = next;
    } else {
      if (current) passages.push(current.trim());
      current = segment;
    }
  }

  if (current) passages.push(current.trim());
  return passages.filter((passage) => passage.length >= 80);
}

export function rankPassages(query: string, passages: string[]): RankedPassage[] {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length >= 3);

  return passages
    .map((text) => {
      const lower = text.toLowerCase();
      const score = terms.reduce((sum, term) => (lower.includes(term) ? sum + 1 : sum), 0);
      return { text, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function selectBestPassage(query: string, text: string) {
  const passages = splitIntoPassages(text);
  const ranked = rankPassages(query, passages);
  return ranked[0] ?? null;
}
