/**
 * Knowledge Graph Engine & Backlink Manager
 * SelfOS v3.2.0 — Batch 14C
 */

import type { KnowledgeItem, Backlink } from '../domain/knowledge.types';

export class KnowledgeGraphEngine {
  static resolveBacklinks(targetItemId: string, allItems: readonly KnowledgeItem[]): Backlink[] {
    const backlinks: Backlink[] = [];

    for (const item of allItems) {
      if (item.id !== targetItemId && item.content.includes(`[[${targetItemId}]]`)) {
        backlinks.push({
          sourceItemId: item.id,
          targetItemId,
          contextSnippet: item.content.substring(0, 60),
        });
      }
    }

    return backlinks;
  }
}
export default KnowledgeGraphEngine;
