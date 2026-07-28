/**
 * Knowledge Analytics Engine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { Note, JournalEntry, KnowledgeAnalytics } from '../domain/knowledge.types';

export class KnowledgeAnalyticsEngine {
  static computeAnalytics(notes: readonly Note[], journals: readonly JournalEntry[]): KnowledgeAnalytics {
    let wordCount = 0;

    for (const n of notes) {
      wordCount += n.content.split(/\s+/).filter(Boolean).length;
    }

    for (const j of journals) {
      wordCount += j.content.split(/\s+/).filter(Boolean).length;
    }

    return {
      totalNotes: notes.length,
      journalStreakDays: journals.length,
      totalWritingWords: wordCount,
      reflectionsCount: journals.reduce((sum, j) => sum + j.reflections.length, 0),
    };
  }
}
export default KnowledgeAnalyticsEngine;
