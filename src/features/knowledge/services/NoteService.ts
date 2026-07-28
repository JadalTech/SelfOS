/**
 * Note Service
 * SelfOS v3.2.0 — Batch 14C
 */

import { noteRepository } from '../repositories/NoteRepository';
import type { Note } from '../domain/knowledge.types';

export class NoteService {
  async createNote(userId: string, title: string, content: string): Promise<Note> {
    const note: Note = {
      id: `note_${Date.now()}`,
      userId,
      title,
      content,
      state: 'published',
      tags: [],
      isPinned: false,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await noteRepository.save(note);
    return note;
  }
}

export const noteService = new NoteService();
