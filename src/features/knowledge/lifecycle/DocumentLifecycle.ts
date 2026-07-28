/**
 * Document Lifecycle State Machine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { DocumentState } from '../domain/knowledge.types';

export class DocumentLifecycle {
  private static readonly ALLOWED_TRANSITIONS: Record<DocumentState, readonly DocumentState[]> = {
    draft: ['published', 'archived', 'trash'],
    published: ['archived', 'draft', 'trash'],
    archived: ['published', 'trash'],
    trash: ['draft'], // Restore to draft
  };

  static isValidTransition(current: DocumentState, next: DocumentState): boolean {
    return this.ALLOWED_TRANSITIONS[current].includes(next);
  }
}
export default DocumentLifecycle;
