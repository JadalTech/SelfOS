"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haircareService = exports.HaircareService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@/shared/firebase");
const converters_1 = require("./converters");
const photoConverter_1 = require("./photoConverter");
const conditionConverter_1 = require("./conditionConverter");
class HaircareService {
    // --- Products Operations ---
    getProductsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'hair_products').withConverter(converters_1.hairProductConverter);
    }
    async fetchProducts(userId) {
        const colRef = this.getProductsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
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
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_products', productId).withConverter(converters_1.hairProductConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Hair product ${productId} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteProduct(userId, productId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_products', productId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Hair Routines Operations ---
    getRoutinesCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'hair_routines').withConverter(converters_1.hairRoutineConverter);
    }
    async fetchHairRoutines(userId) {
        const colRef = this.getRoutinesCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createHairRoutine(userId, input) {
        const colRef = this.getRoutinesCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const hairRoutine = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, hairRoutine);
        return hairRoutine;
    }
    async updateHairRoutine(userId, id, updates) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_routines', id).withConverter(converters_1.hairRoutineConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Hair routine ${id} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteHairRoutine(userId, id) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_routines', id);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Hair Logs Operations ---
    getLogsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'hair_logs').withConverter(converters_1.hairLogConverter);
    }
    async fetchHairLogs(userId, limitCount = 50) {
        const colRef = this.getLogsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.orderBy)('createdAt', 'desc'), (0, firestore_1.limit)(limitCount));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async logHaircareExecution(userId, input) {
        const colRef = this.getLogsCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const hairLog = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, hairLog);
        return hairLog;
    }
    // --- Hair Photos Operations ---
    getPhotosCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'hair_photos').withConverter(photoConverter_1.hairPhotoConverter);
    }
    async fetchHairPhotos(userId, limitCount = 100) {
        const colRef = this.getPhotosCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('captureDate', 'desc'), (0, firestore_1.orderBy)('createdAt', 'desc'), (0, firestore_1.limit)(limitCount));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createPhotoMetadata(userId, photoId, input) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_photos', photoId).withConverter(photoConverter_1.hairPhotoConverter);
        const now = new Date();
        const photo = {
            id: photoId,
            userId,
            photoUrl: input.photoUrl,
            storagePath: input.storagePath,
            captureDate: input.captureDate,
            angle: input.angle,
            notes: input.notes,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(docRef, photo);
        return photo;
    }
    async deletePhotoMetadata(userId, photoId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_photos', photoId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Hair Conditions Operations ---
    getConditionsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'hair_conditions').withConverter(conditionConverter_1.hairConditionConverter);
    }
    async fetchHairConditions(userId, limitCount = 100) {
        const colRef = this.getConditionsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('recordDate', 'desc'), (0, firestore_1.orderBy)('createdAt', 'desc'), (0, firestore_1.limit)(limitCount));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createHairCondition(userId, input) {
        const colRef = this.getConditionsCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const condition = {
            ...input,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, condition);
        return condition;
    }
    async updateHairCondition(userId, id, updates) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_conditions', id).withConverter(conditionConverter_1.hairConditionConverter);
        await (0, firestore_1.updateDoc)(docRef, {
            ...updates,
            updatedAt: new Date(),
        });
        const updatedSnap = await (0, firestore_1.getDoc)(docRef);
        if (!updatedSnap.exists()) {
            throw new Error(`Hair condition record ${id} not found after update.`);
        }
        return updatedSnap.data();
    }
    async deleteHairCondition(userId, id) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'hair_conditions', id);
        await (0, firestore_1.deleteDoc)(docRef);
    }
}
exports.HaircareService = HaircareService;
exports.haircareService = new HaircareService();
