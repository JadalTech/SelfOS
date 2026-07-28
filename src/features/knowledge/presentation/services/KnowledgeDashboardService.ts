/**
 * Knowledge Dashboard Aggregator Service
 * SelfOS v3.2.0 — Batch 14C
 */

import { noteRepository } from '../repositories/NoteRepository';
import { journalRepository } from '../repositories/JournalRepository';
import { KnowledgeAnalyticsEngine } from '../analytics/KnowledgeAnalyticsEngine';
import type { Note, JournalEntry, KnowledgeAnalytics } from '../domain/knowledge.types';

export interface UnifiedKnowledgeDashboardModel {
  readonly notes: readonly Note[];
  readonly journals: readonly JournalEntry[];
  readonly analytics: KnowledgeAnalytics;
}

export class KnowledgeDashboardService {
  static async getDashboardData(userId: string): Promise<UnifiedKnowledgeDashboardModel> {
    const [notesRes, journalsRes] = await Promise.all([
      noteRepository.getAll(userId),
      journalRepository.getAll(userId),
    ]);

    const notes = notesRes.success ? notesRes.data : [];
    const journals = journalsRes.success ? journalsRes.data : [];
    const analytics = KnowledgeAnalyticsEngine.computeAnalytics(notes, journals);

    return {
      notes,
      journals,
      analytics,
    };
  }
}
export default KnowledgeDashboardService;
