/**
 * Knowledge Screen Components
 * SelfOS v3.2.0 — Batch 14C
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NoteCard, JournalEntryCard } from '../components/Components';
import { useNotesViewModel, useJournalViewModel } from '../viewmodels/ViewModels';

export const KnowledgeDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Knowledge Base & Vault</Text>
      <Text style={styles.empty}>Personal Knowledge Base Overview.</Text>
    </View>
  );
};

export const NotesDashboardScreen: React.FC = () => {
  const { notes } = useNotesViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes & Documentation</Text>
      {notes.length === 0 ? (
        <Text style={styles.empty}>No notes recorded.</Text>
      ) : (
        <FlatList data={notes} keyExtractor={(n) => n.id} renderItem={({ item }) => <NoteCard note={item} />} />
      )}
    </View>
  );
};

export const JournalDashboardScreen: React.FC = () => {
  const { entries } = useJournalViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Journal & Reflections</Text>
      {entries.length === 0 ? (
        <Text style={styles.empty}>No journal entries recorded.</Text>
      ) : (
        <FlatList data={entries} keyExtractor={(j) => j.id} renderItem={({ item }) => <JournalEntryCard entry={item} />} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 16,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    color: '#8E8E9F',
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
});
