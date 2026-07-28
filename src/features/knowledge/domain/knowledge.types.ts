/**
 * Notes, Journal & Knowledge Management Domain Types
 * SelfOS v3.2.0 — Batch 14C
 */

export type DocumentState = 'draft' | 'published' | 'archived' | 'trash';

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export interface Backlink {
  readonly sourceItemId: string;
  readonly targetItemId: string;
  readonly contextSnippet: string;
}

export interface KnowledgeItem {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly content: string;
  readonly state: DocumentState;
  readonly tags: readonly Tag[];
  readonly isPinned: boolean;
  readonly isFavorite: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Note extends KnowledgeItem {
  readonly folderId?: string;
  readonly notebookId?: string;
}

export interface Reflection {
  readonly reflectionId: string;
  readonly promptText: string;
  readonly userResponse?: string;
  readonly mood?: MoodType;
  readonly healthTriggeredReason?: string;
}

export interface JournalEntry extends KnowledgeItem {
  readonly date: string; // YYYY-MM-DD
  readonly mood: MoodType;
  readonly reflections: readonly Reflection[];
}

export interface KnowledgeDocument extends KnowledgeItem {
  readonly category: 'study' | 'documentation' | 'book_summary' | 'meeting';
}

export interface KnowledgeCollection {
  readonly collectionId: string;
  readonly name: string;
  readonly isSmartCollection: boolean;
  readonly ruleTag?: string;
  readonly itemIds: readonly string[];
}

export interface KnowledgeAnalytics {
  readonly totalNotes: number;
  readonly journalStreakDays: number;
  readonly totalWritingWords: number;
  readonly reflectionsCount: number;
}

export interface SearchResult {
  readonly item: KnowledgeItem;
  readonly score: number; // 0-100 relevance score
  readonly matchedTerms: readonly string[];
}
