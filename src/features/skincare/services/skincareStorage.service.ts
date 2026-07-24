import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseStorage } from '../../../shared/firebase';

export class SkincareStorageService {
  /**
   * Upload skincare progress photo binary blob to Firebase Storage.
   * Path: users/{userId}/skincare/photos/{photoId}.jpg
   */
  async uploadPhoto(
    userId: string,
    photoId: string,
    imageUri: string
  ): Promise<{ downloadUrl: string; storagePath: string }> {
    const storage = getFirebaseStorage();
    const storagePath = `users/${userId}/skincare/photos/${photoId}.jpg`;
    const storageRef = ref(storage, storagePath);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(storageRef);

    return {
      downloadUrl,
      storagePath,
    };
  }

  /**
   * Delete skincare photo binary blob from Firebase Storage.
   */
  async deletePhoto(storagePath: string): Promise<void> {
    if (!storagePath) return;
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  }
}

export const skincareStorageService = new SkincareStorageService();
