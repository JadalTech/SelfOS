/**
 * Presentation ViewModels for Knowledge Feature
 * SelfOS v3.2.0 — Batch 14C
 */

import { useState } from 'react';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { noteService } from '../../services/NoteService';
import { journalService } from '../../services/JournalService';
import type { Note, JournalEntry, MoodType } from '../../domain/knowledge.types';

export function useNotesViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = async (title: string, content: string) => {
    if (!userId) return;
    const newNote = await noteService.createNote(userId, title, content);
    setNotes((prev) => [...prev, newNote]);
  };

  return { notes, addNote };
}

export function useJournalViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const addJournalEntry = async (date: string, content: string, mood: MoodType = 'good') => {
    if (!userId) return;
    const entry = await journalService.createJournalEntry(userId, date, content, mood);
    setEntries((prev) => [...prev, entry]);
  };

  return { entries, addJournalEntry };
}
