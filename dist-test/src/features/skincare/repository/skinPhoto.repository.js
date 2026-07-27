"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skinPhotoRepository = exports.SkinPhotoRepository = void 0;
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const skincare_service_1 = require("../services/skincare.service");
const skincareStorage_service_1 = require("../services/skincareStorage.service");
class SkinPhotoRepository {
    service;
    storageService;
    constructor(service = skincare_service_1.skincareService, storageService = skincareStorage_service_1.skincareStorageService) {
        this.service = service;
        this.storageService = storageService;
    }
    async fetchPhotos(userId) {
        try {
            const photos = await this.service.fetchPhotos(userId);
            return (0, types_1.ok)(photos);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch skincare photos', { originalError: error }));
        }
    }
    async uploadPhoto(userId, input) {
        try {
            const photoId = `photo_${Date.now()}`;
            const targetUri = input.imageUri || input.photoUri || '';
            // 1. Upload image binary blob to Storage
            const storageResult = await this.storageService.uploadPhoto(userId, photoId, targetUri);
            // 2. Create metadata record in Firestore
            const photo = await this.service.createPhotoRecord(userId, {
                photoUrl: storageResult.downloadUrl,
                storagePath: storageResult.storagePath,
                date: input.date,
                timeOfDay: input.timeOfDay,
                angle: input.angle,
                lightingCondition: input.lightingCondition,
                notes: input.notes,
            });
            return (0, types_1.ok)(photo);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to upload skincare photo', { originalError: error }));
        }
    }
    async deletePhoto(userId, photoId, storagePath) {
        try {
            // 1. Delete image from Storage
            if (storagePath) {
                await this.storageService.deletePhoto(storagePath);
            }
            // 2. Delete metadata document from Firestore
            await this.service.deletePhotoRecord(userId, photoId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete skincare photo', { originalError: error }));
        }
    }
}
exports.SkinPhotoRepository = SkinPhotoRepository;
exports.skinPhotoRepository = new SkinPhotoRepository();
