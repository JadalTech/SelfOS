import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import type { HairProduct, HairRoutine, HairLog } from '../types';

export const hairProductConverter = {
  toFirestore(product: WithFieldValue<HairProduct>): DocumentData {
    return {
      userId: product.userId,
      name: product.name,
      brand: product.brand,
      category: product.category,
      isFavorite: product.isFavorite ?? false,
      isActive: product.isActive ?? true,
      notes: product.notes ?? null,
      createdAt: product.createdAt instanceof Date ? Timestamp.fromDate(product.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): HairProduct {
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const hairRoutineConverter = {
  toFirestore(routine: WithFieldValue<HairRoutine>): DocumentData {
    return {
      userId: routine.userId,
      routineId: routine.routineId,
      haircareCategory: routine.haircareCategory,
      productIds: routine.productIds || [],
      instructions: routine.instructions ?? null,
      createdAt: routine.createdAt instanceof Date ? Timestamp.fromDate(routine.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): HairRoutine {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      routineId: data.routineId || '',
      haircareCategory: data.haircareCategory || 'wash-day',
      productIds: Array.isArray(data.productIds) ? data.productIds : [],
      instructions: data.instructions || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const hairLogConverter = {
  toFirestore(log: WithFieldValue<HairLog>): DocumentData {
    return {
      userId: log.userId,
      hairRoutineId: log.hairRoutineId,
      routineLogId: log.routineLogId ?? null,
      date: log.date,
      time: log.time,
      appliedProductIds: log.appliedProductIds || [],
      notes: log.notes ?? null,
      createdAt: log.createdAt instanceof Date ? Timestamp.fromDate(log.createdAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): HairLog {
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    };
  },
};
