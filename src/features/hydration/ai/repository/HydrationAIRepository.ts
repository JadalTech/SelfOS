/**
 * Hydration AI Repository
 * SelfOS v1.4.0 — Batch 11C Revision
 */

import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';
import type {
  HydrationAIContext,
  HydrationAdvice,
  HydrationPrediction,
  HydrationMessage,
} from '../types/hydrationAI.types';
import { HydrationContextBuilder } from '../utils/HydrationContextBuilder';
import { hydrationRepository } from '../../repository/hydration.repository';

export interface CacheEntry<T> {
  readonly data: T;
  readonly expiresAt: number;
}

export class HydrationAIRepository {
  private readonly adviceCache = new Map<string, CacheEntry<HydrationAdvice>>();
  private readonly predictionsCache = new Map<string, CacheEntry<HydrationPrediction>>();
  private readonly chatHistory = new Map<string, HydrationMessage[]>();

  constructor() {}

  /**
   * Compiles the dynamic context for the AI coach.
   */
  async compileContext(userId: string): Promise<HydrationAIContext> {
    const [entriesRes, goalRes] = await Promise.all([
      hydrationRepository.getEntries(userId, 50),
      hydrationRepository.getGoal(userId),
    ]);

    const entries = entriesRes.success ? entriesRes.data : [];
    const goal = goalRes.success ? goalRes.data : null;

    return HydrationContextBuilder.buildContext({ entries, goal });
  }

  // ---------------------------------------------------------------------------
  // Cache Management
  // ---------------------------------------------------------------------------

  getAdviceFromCache(userId: string): HydrationAdvice | null {
    const entry = this.adviceCache.get(userId);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.data;
    }
    return null;
  }

  saveAdviceToCache(userId: string, data: HydrationAdvice, ttlMs = 24 * 60 * 60 * 1000): void {
    this.adviceCache.set(userId, { data, expiresAt: Date.now() + ttlMs });
  }

  getPredictionsFromCache(userId: string): HydrationPrediction | null {
    const entry = this.predictionsCache.get(userId);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.data;
    }
    return null;
  }

  savePredictionsToCache(userId: string, data: HydrationPrediction, ttlMs = 2 * 60 * 60 * 1000): void {
    this.predictionsCache.set(userId, { data, expiresAt: Date.now() + ttlMs });
  }

  invalidateCache(userId: string): void {
    this.adviceCache.delete(userId);
    this.predictionsCache.delete(userId);
  }

  // ---------------------------------------------------------------------------
  // Conversation History
  // ---------------------------------------------------------------------------

  async getChatHistory(userId: string, conversationId: string): Promise<HydrationMessage[]> {
    return this.chatHistory.get(`${userId}_${conversationId}`) || [];
  }

  async saveMessage(userId: string, conversationId: string, message: HydrationMessage): Promise<void> {
    const key = `${userId}_${conversationId}`;
    const history = this.chatHistory.get(key) || [];
    history.push(message);
    this.chatHistory.set(key, history);
  }
}

export const hydrationAIRepository = new HydrationAIRepository();
export default hydrationAIRepository;
