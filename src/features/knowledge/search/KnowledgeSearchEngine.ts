/**
 * Knowledge Search Engine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { KnowledgeItem, SearchResult } from '../domain/knowledge.types';
import { SearchRankingEngine } from './SearchRankingEngine';

export class KnowledgeSearchEngine {
  static search(items: readonly KnowledgeItem[], query: string): SearchResult[] {
    return SearchRankingEngine.rankItems(items, query);
  }
}
export default KnowledgeSearchEngine;
