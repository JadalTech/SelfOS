import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import type { HairPhoto } from '../types';

export const hairPhotoConverter = {
  toFirestore(photo: WithFieldValue<HairPhoto>): DocumentData {
    return {
      userId: photo.userId,
      photoUrl: photo.photoUrl,
      storagePath: photo.storagePath,
      captureDate: photo.captureDate,
      angle: photo.angle,
      notes: photo.notes ?? null,
      createdAt: photo.createdAt instanceof Date ? Timestamp.fromDate(photo.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): HairPhoto {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      photoUrl: data.photoUrl || '',
      storagePath: data.storagePath || '',
      captureDate: data.captureDate || '',
      angle: data.angle || 'crown',
      notes: data.notes || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};
