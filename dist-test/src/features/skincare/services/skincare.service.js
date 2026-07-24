"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareService = exports.SkincareService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../../shared/firebase");
const skincare_constants_1 = require("../constants/skincare.constants");
const converters_1 = require("./converters");
class SkincareService {
    // --- Products ---
    getProductsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.PRODUCTS).withConverter(converters_1.skincareProductConverter);
    }
    async fetchProducts(userId) {
        const colRef = this.getProductsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async getProductById(userId, productId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.PRODUCTS, productId).withConverter(converters_1.skincareProductConverter);
        const snap = await (0, firestore_1.getDoc)(docRef);
        return snap.exists() ? snap.data() : null;
    }
    async createProduct(userId, input) {
        const colRef = this.getProductsCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const product = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, product);
        return product;
    }
    async updateProduct(userId, productId, updates) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.PRODUCTS, productId).withConverter(converters_1.skincareProductConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Skincare product ${productId} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteProduct(userId, productId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.PRODUCTS, productId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Skincare Routines ---
    getRoutinesCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ROUTINES).withConverter(converters_1.skincareRoutineConverter);
    }
    async fetchRoutines(userId) {
        const colRef = this.getRoutinesCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async getRoutineById(userId, routineId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ROUTINES, routineId).withConverter(converters_1.skincareRoutineConverter);
        const snap = await (0, firestore_1.getDoc)(docRef);
        return snap.exists() ? snap.data() : null;
    }
    async createRoutine(userId, input) {
        const colRef = this.getRoutinesCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const routine = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, routine);
        return routine;
    }
    async updateRoutine(userId, skincareRoutineId, updates) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ROUTINES, skincareRoutineId).withConverter(converters_1.skincareRoutineConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Skincare routine ${skincareRoutineId} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteRoutine(userId, skincareRoutineId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ROUTINES, skincareRoutineId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Skincare Logs ---
    getLogsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.LOGS).withConverter(converters_1.skincareLogConverter);
    }
    async fetchLogs(userId, limitCount = 50) {
        const colRef = this.getLogsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.limit)(limitCount));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createLog(userId, input) {
        const colRef = this.getLogsCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const log = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, log);
        return log;
    }
    // --- Skin Assessments ---
    getAssessmentsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ASSESSMENTS).withConverter(converters_1.skinAssessmentConverter);
    }
    async fetchAssessments(userId) {
        const colRef = this.getAssessmentsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('recordDate', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createAssessment(userId, input) {
        const colRef = this.getAssessmentsCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const assessment = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, assessment);
        return assessment;
    }
    async updateAssessment(userId, assessmentId, updates) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ASSESSMENTS, assessmentId).withConverter(converters_1.skinAssessmentConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Skin assessment ${assessmentId} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteAssessment(userId, assessmentId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.ASSESSMENTS, assessmentId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Progress Photos Metadata ---
    getPhotosCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.PHOTOS).withConverter(converters_1.progressPhotoConverter);
    }
    async fetchPhotos(userId) {
        const colRef = this.getPhotosCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('date', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createPhotoRecord(userId, input) {
        const colRef = this.getPhotosCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const photo = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, photo);
        return photo;
    }
    async deletePhotoRecord(userId, photoId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.PHOTOS, photoId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Skin Reminders ---
    getRemindersCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.REMINDERS).withConverter(converters_1.skinReminderConverter);
    }
    async fetchReminders(userId) {
        const colRef = this.getRemindersCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createReminder(userId, input) {
        const colRef = this.getRemindersCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const reminder = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, reminder);
        return reminder;
    }
    async updateReminder(userId, reminderId, updates) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.REMINDERS, reminderId).withConverter(converters_1.skinReminderConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Skin reminder ${reminderId} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteReminder(userId, reminderId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, skincare_constants_1.SKINCARE_COLLECTIONS.REMINDERS, reminderId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
}
exports.SkincareService = SkincareService;
exports.skincareService = new SkincareService();
