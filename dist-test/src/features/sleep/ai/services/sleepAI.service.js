"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepAIService = exports.SleepAIService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@/shared/firebase");
class SleepAIService {
    getDb() {
        return (0, firebase_1.getFirebaseFirestore)();
    }
    /**
     * Save a single message into a conversation history.
     * Persists only the lightweight content (sender, text, timestamp, providerName, latencyMs).
     */
    async saveMessage(userId, conversationId, message) {
        const db = this.getDb();
        const convRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_conversations', conversationId);
        // Fetch existing conversation messages
        const snap = await (0, firestore_1.getDoc)(convRef);
        let messages = [];
        if (snap.exists()) {
            messages = snap.data().messages || [];
        }
        const newMessageData = {
            id: message.id,
            sender: message.sender,
            text: message.text,
            timestamp: firestore_1.Timestamp.fromDate(message.timestamp),
            providerName: message.providerName || null,
            latencyMs: message.latencyMs || null,
        };
        messages.push(newMessageData);
        await (0, firestore_1.setDoc)(convRef, {
            id: conversationId,
            messages,
            updatedAt: firestore_1.Timestamp.now(),
        });
    }
    /**
     * Loads the chat messages for a specific conversation ID.
     */
    async getConversation(userId, conversationId) {
        const db = this.getDb();
        const convRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_conversations', conversationId);
        const snap = await (0, firestore_1.getDoc)(convRef);
        if (!snap.exists()) {
            return [];
        }
        const data = snap.data();
        const rawMessages = data.messages || [];
        return rawMessages.map((m) => ({
            id: m.id,
            conversationId,
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp instanceof firestore_1.Timestamp ? m.timestamp.toDate() : new Date(m.timestamp),
            providerName: m.providerName || undefined,
            latencyMs: m.latencyMs || undefined,
        }));
    }
    /**
     * Saves the latest recommendations generated for the user.
     */
    async saveRecommendations(userId, recommendations) {
        const db = this.getDb();
        const recRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_recommendations', 'latest');
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
        await (0, firestore_1.setDoc)(recRef, {
            recommendations: serialized,
            generatedAt: firestore_1.Timestamp.now(),
        });
    }
    /**
     * Gets the latest saved recommendations.
     */
    async getLatestRecommendations(userId) {
        const db = this.getDb();
        const recRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_recommendations', 'latest');
        const snap = await (0, firestore_1.getDoc)(recRef);
        if (!snap.exists()) {
            return [];
        }
        const data = snap.data();
        const list = data.recommendations || [];
        return list.map((r) => ({
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
    async saveWeeklyReview(userId, review) {
        const db = this.getDb();
        const reviewRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_weekly_reviews', 'latest');
        await (0, firestore_1.setDoc)(reviewRef, {
            ...review,
            generatedAt: firestore_1.Timestamp.now(),
        });
    }
    /**
     * Retrieves the latest weekly review report.
     */
    async getLatestWeeklyReview(userId) {
        const db = this.getDb();
        const reviewRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_weekly_reviews', 'latest');
        const snap = await (0, firestore_1.getDoc)(reviewRef);
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
exports.SleepAIService = SleepAIService;
exports.sleepAIService = new SleepAIService();
