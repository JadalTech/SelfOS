/**
 * AI Knowledge Coordinator
 * SelfOS v3.2.0 — Batch 14C
 */

import type { Note } from '../domain/knowledge.types';

export class KnowledgeCoordinator {
  static summarizeNote(note: Note): string {
    const firstParagraph = note.content.split('\n')[0] || note.content;
    return `Summary of "${note.title}": ${firstParagraph.substring(0, 100)}...`;
  }

  static extractActionItems(note: Note): string[] {
    const lines = note.content.split('\n');
    return lines
      .filter((line) => line.trim().startsWith('- [ ]') || line.trim().startsWith('* TODO'))
      .map((line) => line.replace(/^-\s*\[\s*\]|\*\s*TODO/, '').trim());
  }
}
export default KnowledgeCoordinator;
