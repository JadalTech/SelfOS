/**
 * Search Relevance Ranking Engine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { KnowledgeItem, SearchResult } from '../domain/knowledge.types';

export class SearchRankingEngine {
  static rankItems(items: readonly KnowledgeItem[], query: string): SearchResult[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    for (const item of items) {
      let score = 0;
      const matchedTerms: string[] = [];

      if (item.title.toLowerCase().includes(q)) {
        score += 50;
        matchedTerms.push('title');
      }

      if (item.content.toLowerCase().includes(q)) {
        score += 30;
        matchedTerms.push('content');
      }

      if (item.isPinned) score += 10;
      if (item.isFavorite) score += 10;

      if (score > 0) {
        results.push({ item, score: Math.min(100, score), matchedTerms });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}
export default SearchRankingEngine;
