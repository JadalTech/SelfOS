import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { AppError } from '@/shared/errors';
import type { HairPhoto, PhotoAngle } from '../types';
import { haircareService, HaircareService } from '../services/haircare.service';
import { hairStorageService, HairStorageService } from '../services/hairStorage.service';

export interface UploadPhotoInput {
  readonly imageUri: string;
  readonly captureDate: string; // YYYY-MM-DD
  readonly angle: PhotoAngle;
  readonly notes?: string;
}

export class HairPhotoRepository {
  constructor(
    private readonly haircareSvc: HaircareService = haircareService,
    private readonly storageSvc: HairStorageService = hairStorageService
  ) {}

  async fetchPhotos(userId: string, limitCount = 100): Promise<Result<HairPhoto[], AppError>> {
    try {
      const photos = await this.haircareSvc.fetchHairPhotos(userId, limitCount);
      return ok(photos);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch progress photos', { originalError: error }));
    }
  }

  async uploadPhoto(userId: string, input: UploadPhotoInput): Promise<Result<HairPhoto, AppError>> {
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

      return ok(photo);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to upload progress photo', { originalError: error }));
    }
  }

  async deletePhoto(userId: string, photoId: string, storagePath: string): Promise<Result<void, AppError>> {
    try {
      // 1. Delete binary blob from Storage
      if (storagePath) {
        await this.storageSvc.deletePhoto(storagePath);
      }
      // 2. Delete metadata from Firestore
      await this.haircareSvc.deletePhotoMetadata(userId, photoId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete progress photo', { originalError: error }));
    }
  }
}

export const hairPhotoRepository = new HairPhotoRepository();
