"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionAIService = exports.NutritionAIService = void 0;
const firebase_1 = require("../../../../shared/firebase");
const firestore_1 = require("firebase/firestore");
class NutritionAIService {
    getDb() {
        return (0, firebase_1.getFirebaseFirestore)();
    }
    // --- Lightweight Conversation Persistence ---
    async fetchConversation(userId, maxMessages = 50) {
        const db = this.getDb();
        const ref = (0, firestore_1.collection)(db, 'users', userId, 'nutrition_conversations');
        const q = (0, firestore_1.query)(ref, (0, firestore_1.orderBy)('timestamp', 'asc'), (0, firestore_1.limit)(maxMessages));
        const snapshot = await (0, firestore_1.getDocs)(q);
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
    async saveMessage(userId, message) {
        const db = this.getDb();
        const ref = (0, firestore_1.doc)(db, 'users', userId, 'nutrition_conversations', message.id);
        await (0, firestore_1.setDoc)(ref, {
            sender: message.sender,
            text: message.text,
            timestamp: message.timestamp,
            providerName: message.providerName || 'heuristic',
            latencyMs: message.latencyMs || 0,
        });
    }
    async clearConversation(userId) {
        const db = this.getDb();
        const ref = (0, firestore_1.collection)(db, 'users', userId, 'nutrition_conversations');
        const snapshot = await (0, firestore_1.getDocs)(ref);
        const deletePromises = snapshot.docs.map((docSnap) => (0, firestore_1.deleteDoc)(docSnap.ref));
        await Promise.all(deletePromises);
    }
    // --- Recommendations Storage ---
    async saveRecommendations(userId, recommendations) {
        const db = this.getDb();
        const promises = recommendations.map((rec) => {
            const ref = (0, firestore_1.doc)(db, 'users', userId, 'nutrition_recommendations', rec.id);
            return (0, firestore_1.setDoc)(ref, {
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
exports.NutritionAIService = NutritionAIService;
exports.nutritionAIService = new NutritionAIService();
