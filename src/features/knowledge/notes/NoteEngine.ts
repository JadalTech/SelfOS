/**
 * Note Engine
 * SelfOS v3.2.0 — Batch 14C
 */

import type { Note } from '../domain/knowledge.types';

export class NoteEngine {
  static togglePin(note: Note): Note {
    return {
      ...note,
      isPinned: !note.isPinned,
      updatedAt: new Date(),
    };
  }

  static toggleFavorite(note: Note): Note {
    return {
      ...note,
      isFavorite: !note.isFavorite,
      updatedAt: new Date(),
    };
  }
}
export default NoteEngine;
