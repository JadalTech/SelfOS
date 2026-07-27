import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '@/shared/firebase';
import type { SleepChatMessage, SleepRecommendation, SleepWeeklyReview } from '../types/sleepAI.types';

export class SleepAIService {
  private getDb() {
    return getFirebaseFirestore();
  }

  /**
   * Save a single message into a conversation history.
   * Persists only the lightweight content (sender, text, timestamp, providerName, latencyMs).
   */
  async saveMessage(userId: string, conversationId: string, message: SleepChatMessage): Promise<void> {
    const db = this.getDb();
    const convRef = doc(db, 'users', userId, 'sleep_conversations', conversationId);

    // Fetch existing conversation messages
    const snap = await getDoc(convRef);
    let messages: any[] = [];

    if (snap.exists()) {
      messages = snap.data().messages || [];
    }

    const newMessageData = {
      id: message.id,
      sender: message.sender,
      text: message.text,
      timestamp: Timestamp.fromDate(message.timestamp),
      providerName: message.providerName || null,
      latencyMs: message.latencyMs || null,
    };

    messages.push(newMessageData);

    await setDoc(convRef, {
      id: conversationId,
      messages,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Loads the chat messages for a specific conversation ID.
   */
  async getConversation(userId: string, conversationId: string): Promise<SleepChatMessage[]> {
    const db = this.getDb();
    const convRef = doc(db, 'users', userId, 'sleep_conversations', conversationId);
    const snap = await getDoc(convRef);

    if (!snap.exists()) {
      return [];
    }

    const data = snap.data();
    const rawMessages = data.messages || [];

    return rawMessages.map((m: any) => ({
      id: m.id,
      conversationId,
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp instanceof Timestamp ? m.timestamp.toDate() : new Date(m.timestamp),
      providerName: m.providerName || undefined,
      latencyMs: m.latencyMs || undefined,
    }));
  }

  /**
   * Saves the latest recommendations generated for the user.
   */
  async saveRecommendations(userId: string, recommendations: SleepRecommendation[]): Promise<void> {
    const db = this.getDb();
    const recRef = doc(db, 'users', userId, 'sleep_recommendations', 'latest');

    const serialized = recommendations.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      targetConcern: r.targetConcern,
      category: r.category,
      priority: r.priority,
      actionableSteps: r.actionableSteps,
      confidenceScore: r.confidenceScore,
      actionLabel: r.actionLabel || null,
      actionRoute: r.actionRoute || null,
    }));

    await setDoc(recRef, {
      recommendations: serialized,
      generatedAt: Timestamp.now(),
    });
  }

  /**
   * Gets the latest saved recommendations.
   */
  async getLatestRecommendations(userId: string): Promise<SleepRecommendation[]> {
    const db = this.getDb();
    const recRef = doc(db, 'users', userId, 'sleep_recommendations', 'latest');
    const snap = await getDoc(recRef);

    if (!snap.exists()) {
      return [];
    }

    const data = snap.data();
    const list = data.recommendations || [];

    return list.map((r: any) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      targetConcern: r.targetConcern,
      recommendedCategory: r.category,
      category: r.category,
      priority: r.priority,
      actionableSteps: r.actionableSteps,
      confidenceScore: r.confidenceScore,
      actionLabel: r.actionLabel || undefined,
      actionRoute: r.actionRoute || undefined,
    }));
  }

  /**
   * Saves a weekly review report.
   */
  async saveWeeklyReview(userId: string, review: SleepWeeklyReview): Promise<void> {
    const db = this.getDb();
    const reviewRef = doc(db, 'users', userId, 'sleep_weekly_reviews', 'latest');

    await setDoc(reviewRef, {
      ...review,
      generatedAt: Timestamp.now(),
    });
  }

  /**
   * Retrieves the latest weekly review report.
   */
  async getLatestWeeklyReview(userId: string): Promise<SleepWeeklyReview | null> {
    const db = this.getDb();
    const reviewRef = doc(db, 'users', userId, 'sleep_weekly_reviews', 'latest');
    const snap = await getDoc(reviewRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    return {
      id: data.id,
      dateRange: data.dateRange,
      summary: data.summary,
      highlights: data.highlights || [],
      areasToImprove: data.areasToImprove || [],
      scoreChangeLabel: data.scoreChangeLabel,
      healthScore: data.healthScore,
    };
  }
}

export const sleepAIService = new SleepAIService();
