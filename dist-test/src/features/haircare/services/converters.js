"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairLogConverter = exports.hairRoutineConverter = exports.hairProductConverter = void 0;
const firestore_1 = require("firebase/firestore");
exports.hairProductConverter = {
    toFirestore(product) {
        return {
            userId: product.userId,
            name: product.name,
            brand: product.brand,
            category: product.category,
            isFavorite: product.isFavorite ?? false,
            isActive: product.isActive ?? true,
            notes: product.notes ?? null,
            createdAt: product.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(product.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            name: data.name || '',
            brand: data.brand || '',
            category: data.category || 'custom',
            isFavorite: data.isFavorite ?? false,
            isActive: data.isActive ?? true,
            notes: data.notes || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.hairRoutineConverter = {
    toFirestore(routine) {
        return {
            userId: routine.userId,
            routineId: routine.routineId,
            haircareCategory: routine.haircareCategory,
            productIds: routine.productIds || [],
            instructions: routine.instructions ?? null,
            createdAt: routine.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(routine.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            routineId: data.routineId || '',
            haircareCategory: data.haircareCategory || 'wash-day',
            productIds: Array.isArray(data.productIds) ? data.productIds : [],
            instructions: data.instructions || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.hairLogConverter = {
    toFirestore(log) {
        return {
            userId: log.userId,
            hairRoutineId: log.hairRoutineId,
            routineLogId: log.routineLogId ?? null,
            date: log.date,
            time: log.time,
            appliedProductIds: log.appliedProductIds || [],
            notes: log.notes ?? null,
            createdAt: log.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(log.createdAt) : firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            hairRoutineId: data.hairRoutineId || '',
            routineLogId: data.routineLogId || undefined,
            date: data.date || '',
            time: data.time || '',
            appliedProductIds: Array.isArray(data.appliedProductIds) ? data.appliedProductIds : [],
            notes: data.notes || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
        };
    },
};
