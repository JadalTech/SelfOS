/**
 * Presentation Components for Notes, Journal & Knowledge Management
 * SelfOS v3.2.0 — Batch 14C
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Note, JournalEntry, Reflection, Backlink } from '../../domain/knowledge.types';

export const NoteCard: React.FC<{ readonly note: Note; readonly onPress?: () => void }> = ({ note, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.titleText}>{note.title}</Text>
      <Text style={styles.contentText} numberOfLines={2}>{note.content}</Text>
      <Text style={styles.metaText}>Status: {note.state}</Text>
    </Pressable>
  );
};

export const JournalEntryCard: React.FC<{ readonly entry: JournalEntry }> = ({ entry }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.titleText}>{entry.title}</Text>
      <Text style={styles.metaText}>Mood: {entry.mood} | Reflections: {entry.reflections.length}</Text>
      <Text style={styles.contentText} numberOfLines={2}>{entry.content}</Text>
    </View>
  );
};

export const BacklinkGraphWidget: React.FC<{ readonly backlinks: readonly Backlink[] }> = ({ backlinks }) => {
  return (
    <View style={styles.widgetCard}>
      <Text style={styles.widgetTitle}>Knowledge Links ({backlinks.length})</Text>
      {backlinks.map((b, i) => (
        <Text key={i} style={styles.linkText}>• Mentioned in: {b.sourceItemId}</Text>
      ))}
    </View>
  );
};

export const ReflectionPromptCard: React.FC<{ readonly reflection: Reflection }> = ({ reflection }) => {
  return (
    <View style={styles.promptCard}>
      <Text style={styles.promptHeader}>Health Reflection Prompt</Text>
      <Text style={styles.promptText}>{reflection.promptText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentText: {
    color: '#CCCCCC',
    fontSize: 13,
    marginVertical: 4,
  },
  metaText: {
    color: '#FF4081',
    fontSize: 12,
  },
  widgetCard: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#3F51B5',
  },
  widgetTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  linkText: {
    color: '#8E8E9F',
    fontSize: 12,
  },
  promptCard: {
    backgroundColor: '#2D1B28',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FF4081',
  },
  promptHeader: {
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 13,
  },
  promptText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
});
