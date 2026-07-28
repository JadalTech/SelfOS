/**
 * Collection & Smart Collections Manager
 * SelfOS v3.2.0 — Batch 14C
 */

import type { KnowledgeCollection, KnowledgeItem } from '../domain/knowledge.types';

export class CollectionManager {
  static populateSmartCollection(collection: KnowledgeCollection, allItems: readonly KnowledgeItem[]): KnowledgeItem[] {
    if (!collection.isSmartCollection || !collection.ruleTag) {
      return allItems.filter((i) => collection.itemIds.includes(i.id));
    }

    const tagToFind = collection.ruleTag.toLowerCase();
    return allItems.filter((i) => i.tags.some((t) => t.name.toLowerCase() === tagToFind));
  }
}
export default CollectionManager;
