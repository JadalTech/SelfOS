/**
 * Firestore Service for Workout AI Coach Persistence
 */

import { getFirebaseFirestore } from '../../../../shared/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query as firestoreQuery,
  orderBy,
  limit,
} from 'firebase/firestore';
import type { WorkoutChatMessage } from '../types/workoutAI.types';
import type { AIRecommendation } from '../../../../shared/types/ai.types';

export class WorkoutAIService {
  private getDb() {
    return getFirebaseFirestore();
  }

  // --- Conversation History Persistence ---

  async fetchConversation(userId: string, maxMessages = 50): Promise<WorkoutChatMessage[]> {
    const db = this.getDb();
    const ref = collection(db, 'users', userId, 'workout_conversations');
    const q = firestoreQuery(ref, orderBy('timestamp', 'asc'), limit(maxMessages));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        sender: data.sender,
        text: data.text,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
        providerName: data.providerName,
        latencyMs: data.latencyMs,
      };
    });
  }

  async saveMessage(userId: string, message: WorkoutChatMessage): Promise<void> {
    const db = this.getDb();
    const ref = doc(db, 'users', userId, 'workout_conversations', message.id);
    await setDoc(ref, {
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp,
      providerName: message.providerName || 'heuristic',
      latencyMs: message.latencyMs || 0,
    });
  }

  async clearConversation(userId: string): Promise<void> {
    const db = this.getDb();
    const ref = collection(db, 'users', userId, 'workout_conversations');
    const snapshot = await getDocs(ref);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  }

  // --- Recommendations Storage ---

  async saveRecommendations(userId: string, recommendations: AIRecommendation[]): Promise<void> {
    const db = this.getDb();
    const promises = recommendations.map((rec) => {
      const ref = doc(db, 'users', userId, 'workout_recommendations', rec.id);
      return setDoc(ref, {
        title: rec.title,
        summary: rec.summary,
        targetConcern: rec.targetConcern,
        recommendedCategory: rec.recommendedCategory || null,
        actionableSteps: rec.actionableSteps,
        confidenceScore: rec.confidenceScore,
        createdAt: new Date(),
      });
    });
    await Promise.all(promises);
  }
}

export const workoutAIService = new WorkoutAIService();
