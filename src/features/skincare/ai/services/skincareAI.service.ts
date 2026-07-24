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
import type { SkinChatMessage, SkinRecommendation } from '../types/ai.types';

export class SkincareAIService {
  private getDb() {
    return getFirebaseFirestore();
  }

  // --- Lean Conversation Storage ---

  async fetchConversation(userId: string, maxMessages = 50): Promise<SkinChatMessage[]> {
    const db = this.getDb();
    const ref = collection(db, 'users', userId, 'skin_conversations');
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
      };
    });
  }

  async saveMessage(userId: string, message: SkinChatMessage): Promise<void> {
    const db = this.getDb();
    const ref = doc(db, 'users', userId, 'skin_conversations', message.id);
    await setDoc(ref, {
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp,
      providerName: message.providerName || 'heuristic',
    });
  }

  async clearConversation(userId: string): Promise<void> {
    const db = this.getDb();
    const ref = collection(db, 'users', userId, 'skin_conversations');
    const snapshot = await getDocs(ref);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  }

  // --- Recommendations Storage ---

  async saveRecommendations(userId: string, recommendations: SkinRecommendation[]): Promise<void> {
    const db = this.getDb();
    const promises = recommendations.map((rec) => {
      const ref = doc(db, 'users', userId, 'skin_recommendations', rec.id);
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

export const skincareAIService = new SkincareAIService();
