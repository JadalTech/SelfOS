"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skincareStorageService = exports.SkincareStorageService = void 0;
const storage_1 = require("firebase/storage");
const firebase_1 = require("../../../shared/firebase");
class SkincareStorageService {
    /**
     * Upload skincare progress photo binary blob to Firebase Storage.
     * Path: users/{userId}/skincare/photos/{photoId}.jpg
     */
    async uploadPhoto(userId, photoId, imageUri) {
        const storage = (0, firebase_1.getFirebaseStorage)();
        const storagePath = `users/${userId}/skincare/photos/${photoId}.jpg`;
        const storageRef = (0, storage_1.ref)(storage, storagePath);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await (0, storage_1.uploadBytes)(storageRef, blob, {
            contentType: 'image/jpeg',
            customMetadata: {
                userId,
                uploadedAt: new Date().toISOString(),
            },
        });
        const downloadUrl = await (0, storage_1.getDownloadURL)(storageRef);
        return {
            downloadUrl,
            storagePath,
        };
    }
    /**
     * Delete skincare photo binary blob from Firebase Storage.
     */
    async deletePhoto(storagePath) {
        if (!storagePath)
            return;
        const storage = (0, firebase_1.getFirebaseStorage)();
        const storageRef = (0, storage_1.ref)(storage, storagePath);
        await (0, storage_1.deleteObject)(storageRef);
    }
}
exports.SkincareStorageService = SkincareStorageService;
exports.skincareStorageService = new SkincareStorageService();
