"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairPhotoRepository = exports.HairPhotoRepository = void 0;
const types_1 = require("@/shared/types");
const errors_1 = require("@/shared/errors");
const haircare_service_1 = require("../services/haircare.service");
const hairStorage_service_1 = require("../services/hairStorage.service");
class HairPhotoRepository {
    haircareSvc;
    storageSvc;
    constructor(haircareSvc = haircare_service_1.haircareService, storageSvc = hairStorage_service_1.hairStorageService) {
        this.haircareSvc = haircareSvc;
        this.storageSvc = storageSvc;
    }
    async fetchPhotos(userId, limitCount = 100) {
        try {
            const photos = await this.haircareSvc.fetchHairPhotos(userId, limitCount);
            return (0, types_1.ok)(photos);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to fetch progress photos', { originalError: error }));
        }
    }
    async uploadPhoto(userId, input) {
        try {
            const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            // 1. Upload binary file to Firebase Storage
            const storageResult = await this.storageSvc.uploadPhoto(userId, photoId, input.imageUri);
            // 2. Save metadata document in Firestore
            const photo = await this.haircareSvc.createPhotoMetadata(userId, photoId, {
                photoUrl: storageResult.downloadUrl,
                storagePath: storageResult.storagePath,
                captureDate: input.captureDate,
                angle: input.angle,
                notes: input.notes,
            });
            return (0, types_1.ok)(photo);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to upload progress photo', { originalError: error }));
        }
    }
    async deletePhoto(userId, photoId, storagePath) {
        try {
            // 1. Delete binary blob from Storage
            if (storagePath) {
                await this.storageSvc.deletePhoto(storagePath);
            }
            // 2. Delete metadata from Firestore
            await this.haircareSvc.deletePhotoMetadata(userId, photoId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new errors_1.AppError('FIREBASE_ERROR', 'Failed to delete progress photo', { originalError: error }));
        }
    }
}
exports.HairPhotoRepository = HairPhotoRepository;
exports.hairPhotoRepository = new HairPhotoRepository();
