/**
 * Specialized Presentation Contexts for AI Assistant UI
 * SelfOS v2.0.0 — Batch 13B
 */

import React, { createContext, useContext, useState } from 'react';
import type { ConversationTurn } from '../../domain/assistant.types';

// =========================================================================
// 1. Conversation UI Context
// =========================================================================

export interface ConversationUIContextType {
  readonly turns: readonly ConversationTurn[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly setTurns: React.Dispatch<React.SetStateAction<ConversationTurn[]>>;
}

const ConversationUIContext = createContext<ConversationUIContextType | null>(null);

export const ConversationUIProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ConversationUIContext.Provider value={{ turns, loading, error, setTurns }}>
      {children}
    </ConversationUIContext.Provider>
  );
};

export const useConversationUIContext = () => {
  const ctx = useContext(ConversationUIContext);
  if (!ctx) throw new Error('useConversationUIContext must be used within ConversationUIProvider');
  return ctx;
};

// =========================================================================
// 2. Composer UI Context
// =========================================================================

export interface ComposerUIContextType {
  readonly text: string;
  readonly setText: (text: string) => void;
  readonly draft: string;
  readonly setDraft: (draft: string) => void;
  readonly clear: () => void;
}

const ComposerUIContext = createContext<ComposerUIContextType | null>(null);

export const ComposerUIProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [text, setText] = useState('');
  const [draft, setDraft] = useState('');

  const clear = () => {
    setText('');
    setDraft('');
  };

  return (
    <ComposerUIContext.Provider value={{ text, setText, draft, setDraft, clear }}>
      {children}
    </ComposerUIContext.Provider>
  );
};

export const useComposerUIContext = () => {
  const ctx = useContext(ComposerUIContext);
  if (!ctx) throw new Error('useComposerUIContext must be used within ComposerUIProvider');
  return ctx;
};

// =========================================================================
// 3. Streaming UI Context
// =========================================================================

export interface StreamingUIContextType {
  readonly isStreaming: boolean;
  readonly streamedText: string;
  readonly setIsStreaming: (val: boolean) => void;
  readonly setStreamedText: (text: string) => void;
}

const StreamingUIContext = createContext<StreamingUIContextType | null>(null);

export const StreamingUIProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');

  return (
    <StreamingUIContext.Provider value={{ isStreaming, streamedText, setIsStreaming, setStreamedText }}>
      {children}
    </StreamingUIContext.Provider>
  );
};

export const useStreamingUIContext = () => {
  const ctx = useContext(StreamingUIContext);
  if (!ctx) throw new Error('useStreamingUIContext must be used within StreamingUIProvider');
  return ctx;
};
