/**
 * Knowledge Recommendation Engine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { KnowledgeItem } from '../domain/knowledge.types';

export class KnowledgeRecommendationEngine {
  static getRelatedNotes(targetItem: KnowledgeItem, allItems: readonly KnowledgeItem[]): KnowledgeItem[] {
    const targetTagNames = new Set(targetItem.tags.map((t) => t.name.toLowerCase()));
    if (targetTagNames.size === 0) return [];

    return allItems
      .filter((i) => i.id !== targetItem.id)
      .filter((i) => i.tags.some((t) => targetTagNames.has(t.name.toLowerCase())));
  }
}
export default KnowledgeRecommendationEngine;
