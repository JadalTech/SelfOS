import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseStorage } from '@/shared/firebase';

export class HairStorageService {
  /**
   * Upload progress photo binary blob to Firebase Storage.
   * Path: users/{userId}/haircare/photos/{photoId}.jpg
   */
  async uploadPhoto(
    userId: string,
    photoId: string,
    imageUri: string
  ): Promise<{ downloadUrl: string; storagePath: string }> {
    const storage = getFirebaseStorage();
    const storagePath = `users/${userId}/haircare/photos/${photoId}.jpg`;
    const storageRef = ref(storage, storagePath);

    // Fetch binary blob from local URI (works in React Native & Web)
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload to Firebase Storage with metadata
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
   * Delete photo binary blob from Firebase Storage.
   */
  async deletePhoto(storagePath: string): Promise<void> {
    if (!storagePath) return;
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  }
}

export const hairStorageService = new HairStorageService();
