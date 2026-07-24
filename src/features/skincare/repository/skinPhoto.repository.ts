import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type { ProgressPhoto, PhotoAngle, RoutineTime } from '../types';
import { skincareService, SkincareService } from '../services/skincare.service';
import { skincareStorageService, SkincareStorageService } from '../services/skincareStorage.service';

export interface UploadSkinPhotoInput {
  readonly imageUri?: string;
  readonly photoUri?: string;
  readonly date: string; // YYYY-MM-DD
  readonly timeOfDay: RoutineTime;
  readonly angle: PhotoAngle;
  readonly lightingCondition?: string;
  readonly notes?: string;
}

export class SkinPhotoRepository {
  constructor(
    private readonly service: SkincareService = skincareService,
    private readonly storageService: SkincareStorageService = skincareStorageService
  ) {}

  async fetchPhotos(userId: string): Promise<Result<ProgressPhoto[], AppError>> {
    try {
      const photos = await this.service.fetchPhotos(userId);
      return ok(photos);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skincare photos', { originalError: error }));
    }
  }

  async uploadPhoto(userId: string, input: UploadSkinPhotoInput): Promise<Result<ProgressPhoto, AppError>> {
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

      return ok(photo);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to upload skincare photo', { originalError: error }));
    }
  }

  async deletePhoto(userId: string, photoId: string, storagePath: string): Promise<Result<void, AppError>> {
    try {
      // 1. Delete image from Storage
      if (storagePath) {
        await this.storageService.deletePhoto(storagePath);
      }
      // 2. Delete metadata document from Firestore
      await this.service.deletePhotoRecord(userId, photoId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete skincare photo', { originalError: error }));
    }
  }
}

export const skinPhotoRepository = new SkinPhotoRepository();
