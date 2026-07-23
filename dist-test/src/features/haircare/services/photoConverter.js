"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairPhotoConverter = void 0;
const firestore_1 = require("firebase/firestore");
exports.hairPhotoConverter = {
    toFirestore(photo) {
        return {
            userId: photo.userId,
            photoUrl: photo.photoUrl,
            storagePath: photo.storagePath,
            captureDate: photo.captureDate,
            angle: photo.angle,
            notes: photo.notes ?? null,
            createdAt: photo.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(photo.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            photoUrl: data.photoUrl || '',
            storagePath: data.storagePath || '',
            captureDate: data.captureDate || '',
            angle: data.angle || 'crown',
            notes: data.notes || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
