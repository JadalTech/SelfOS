/**
 * Notes, Journal & Knowledge Management Unit Tests
 * SelfOS v3.2.0 — Batch 14C
 *
 * Run with: npx tsx src/features/knowledge/__tests__/knowledge.test.ts
 */

import { DocumentLifecycle } from '../lifecycle/DocumentLifecycle';
import { KnowledgeGraphEngine } from '../graph/KnowledgeGraphEngine';
import { SearchRankingEngine } from '../search/SearchRankingEngine';
import { ReflectionEngine } from '../journal/ReflectionEngine';
import { ReflectionInsightEngine } from '../journal/ReflectionInsightEngine';
import { CollectionManager } from '../collections/CollectionManager';
import { KnowledgeRecommendationEngine } from '../recommendations/KnowledgeRecommendationEngine';
import { KnowledgeCoordinator } from '../ai/KnowledgeCoordinator';
import type { Note, JournalEntry, KnowledgeCollection } from '../domain/knowledge.types';

// Test variables
let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    failures.push(`FAIL: ${message}`);
    console.error(`  ✗ ${message}`);
  }
}

function describe(name: string, fn: () => void): void {
  console.log(`\n▸ ${name}`);
  fn();
}

function it(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failCount++;
    const msg = error instanceof Error ? error.message : String(error);
    failures.push(`FAIL: ${name} — ${msg}`);
    console.error(`  ✗ ${name} — ${msg}`);
  }
}

// =========================================================================
// RUN TEST SCENARIOS
// =========================================================================

describe('DocumentLifecycle — State Transitions', () => {
  it('validates allowed document state transitions', () => {
    assert(DocumentLifecycle.isValidTransition('draft', 'published') === true, 'draft -> published is valid');
    assert(DocumentLifecycle.isValidTransition('trash', 'published') === false, 'trash -> published is invalid');
  });
});

describe('KnowledgeGraphEngine — Backlink Resolution', () => {
  it('resolves wiki-style backlinks between notes', () => {
    const notes: Note[] = [
      { id: 'n1', userId: 'u1', title: 'React Hooks', content: 'See [[n2]] for details', state: 'published', tags: [], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
      { id: 'n2', userId: 'u1', title: 'State Management', content: 'Core principles', state: 'published', tags: [], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    const backlinks = KnowledgeGraphEngine.resolveBacklinks('n2', notes);
    assert(backlinks.length === 1, 'Resolves 1 backlink to n2');
    assert(backlinks[0].sourceItemId === 'n1', 'n1 is the source of backlink to n2');
  });
});

describe('SearchRankingEngine — Relevance Scoring', () => {
  it('scores title matches higher than content matches', () => {
    const notes: Note[] = [
      { id: 'n1', userId: 'u1', title: 'TypeScript Best Practices', content: 'Coding standards', state: 'published', tags: [], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
      { id: 'n2', userId: 'u1', title: 'General Notes', content: 'Mentions TypeScript here', state: 'published', tags: [], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    const results = SearchRankingEngine.rankItems(notes, 'TypeScript');
    assert(results.length === 2, 'Finds 2 search matches');
    assert(results[0].item.id === 'n1', 'n1 with title match ranks first');
    assert(results[0].score > results[1].score, 'Title match score is higher');
  });
});

describe('ReflectionEngine — Health-Triggered Prompts', () => {
  it('adds a sleep reflection prompt when sleep quality is low (<60)', () => {
    const prompts = ReflectionEngine.generateHealthTriggeredPrompts(45); // Low sleep quality 45
    assert(prompts.length === 2, 'Generates 2 reflection prompts');
    assert(prompts[1].reflectionId === 'r_sleep', 'Surfaces sleep reflection prompt');
  });
});

describe('ReflectionInsightEngine — Mood Analytics', () => {
  it('analyzes mood frequencies across entries', () => {
    const entries: JournalEntry[] = [
      { id: 'j1', userId: 'u1', title: 'J1', date: '2026-07-28', content: 'Good day', mood: 'great', reflections: [], state: 'published', tags: [], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
      { id: 'j2', userId: 'u1', title: 'J2', date: '2026-07-27', content: 'Tired', mood: 'tired', reflections: [], state: 'published', tags: [], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    const dist = ReflectionInsightEngine.analyzeMoodDistribution(entries);
    assert(dist.great === 1, 'Counts 1 great mood');
    assert(dist.tired === 1, 'Counts 1 tired mood');
  });
});

describe('CollectionManager — Smart Collections', () => {
  it('filters items automatically based on rule tags', () => {
    const collection: KnowledgeCollection = {
      collectionId: 'c1',
      name: 'Health Notes',
      isSmartCollection: true,
      ruleTag: 'Health',
      itemIds: [],
    };

    const notes: Note[] = [
      { id: 'n1', userId: 'u1', title: 'Hydration Log', content: 'Water intake', state: 'published', tags: [{ id: 't1', name: 'Health', color: '#FF4081' }], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
      { id: 'n2', userId: 'u1', title: 'Code Refactor', content: 'Clean code', state: 'published', tags: [{ id: 't2', name: 'Work', color: '#3F51B5' }], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    const items = CollectionManager.populateSmartCollection(collection, notes);
    assert(items.length === 1, 'Smart collection populates 1 matching note');
    assert(items[0].id === 'n1', 'Populates hydration log n1');
  });
});

describe('KnowledgeRecommendationEngine — Related Notes', () => {
  it('recommends notes sharing matching tags', () => {
    const target: Note = { id: 'n1', userId: 'u1', title: 'Target', content: 'Content', state: 'published', tags: [{ id: 't1', name: 'AI', color: '#FF4081' }], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() };
    const allNotes: Note[] = [
      target,
      { id: 'n2', userId: 'u1', title: 'AI Assistant', content: 'Prompt design', state: 'published', tags: [{ id: 't1', name: 'AI', color: '#FF4081' }], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
      { id: 'n3', userId: 'u1', title: 'Cooking', content: 'Recipes', state: 'published', tags: [{ id: 't2', name: 'Food', color: '#4CAF50' }], isPinned: false, isFavorite: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    const related = KnowledgeRecommendationEngine.getRelatedNotes(target, allNotes);
    assert(related.length === 1, 'Recommends 1 related note');
    assert(related[0].id === 'n2', 'Recommends AI Assistant n2');
  });
});

describe('KnowledgeCoordinator — Summarization & Action Extraction', () => {
  it('extracts TODO action items from note content', () => {
    const note: Note = {
      id: 'n1',
      userId: 'u1',
      title: 'Meeting Notes',
      content: 'Discussion:\n- [ ] Update database schema\n- [ ] Deploy staging build',
      state: 'published',
      tags: [],
      isPinned: false,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const actions = KnowledgeCoordinator.extractActionItems(note);
    assert(actions.length === 2, 'Extracts 2 action items');
    assert(actions[0] === 'Update database schema', 'Extracts first action item');
  });
});

// =========================================================================
// RESULTS
// =========================================================================
console.log('\n' + '='.repeat(60));
console.log(`Tests complete: ${passCount} passed, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('='.repeat(60));

process.exit(failCount > 0 ? 1 : 0);
