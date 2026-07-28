/**
 * Journal Service
 * SelfOS v3.2.0 — Batch 14C
 */

import { journalRepository } from '../repositories/JournalRepository';
import { ReflectionEngine } from '../journal/ReflectionEngine';
import type { JournalEntry, MoodType } from '../domain/knowledge.types';

export class JournalService {
  async createJournalEntry(
    userId: string,
    date: string,
    content: string,
    mood: MoodType = 'good',
    sleepQualityScore?: number
  ): Promise<JournalEntry> {
    const reflections = ReflectionEngine.generateHealthTriggeredPrompts(sleepQualityScore);

    const entry: JournalEntry = {
      id: `j_${Date.now()}`,
      userId,
      title: `Daily Journal - ${date}`,
      content,
      date,
      mood,
      reflections,
      state: 'published',
      tags: [],
      isPinned: false,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await journalRepository.save(entry);
    return entry;
  }
}

export const journalService = new JournalService();
