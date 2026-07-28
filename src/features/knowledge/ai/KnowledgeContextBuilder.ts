/**
 * Knowledge Context Builder for AI Assistant
 * SelfOS v3.2.0 — Batch 14C
 */

import type { Note, JournalEntry } from '../domain/knowledge.types';

export interface AIKnowledgeContext {
  readonly totalNotes: number;
  readonly totalJournalEntries: number;
  readonly recentNoteTitle?: string;
}

export class KnowledgeContextBuilder {
  static buildContext(notes: readonly Note[], journals: readonly JournalEntry[]): AIKnowledgeContext {
    return {
      totalNotes: notes.length,
      totalJournalEntries: journals.length,
      recentNoteTitle: notes.length > 0 ? notes[0].title : undefined,
    };
  }
}
export default KnowledgeContextBuilder;
