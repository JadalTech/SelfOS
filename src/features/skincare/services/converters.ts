import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import type {
  SkincareProduct,
  SkincareRoutine,
  SkincareLog,
  SkinAssessment,
  ProgressPhoto,
  SkinReminder,
} from '../types';

export const skincareProductConverter = {
  toFirestore(product: WithFieldValue<SkincareProduct>): DocumentData {
    return {
      userId: product.userId,
      name: product.name,
      brand: product.brand,
      category: product.category,
      type: product.type,
      keyIngredients: product.keyIngredients || [],
      openedDate: product.openedDate instanceof Date ? Timestamp.fromDate(product.openedDate) : null,
      shelfLifeMonths: product.shelfLifeMonths ?? null,
      expiryDate: product.expiryDate instanceof Date ? Timestamp.fromDate(product.expiryDate) : null,
      isFavorite: product.isFavorite ?? false,
      isActive: product.isActive ?? true,
      notes: product.notes ?? null,
      createdAt: product.createdAt instanceof Date ? Timestamp.fromDate(product.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): SkincareProduct {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      name: data.name || '',
      brand: data.brand || '',
      category: data.category || 'moisturizer',
      type: data.type || 'cream',
      keyIngredients: Array.isArray(data.keyIngredients) ? data.keyIngredients : [],
      openedDate: data.openedDate instanceof Timestamp ? data.openedDate.toDate() : undefined,
      shelfLifeMonths: typeof data.shelfLifeMonths === 'number' ? data.shelfLifeMonths : undefined,
      expiryDate: data.expiryDate instanceof Timestamp ? data.expiryDate.toDate() : undefined,
      isFavorite: data.isFavorite ?? false,
      isActive: data.isActive ?? true,
      notes: data.notes || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const skincareRoutineConverter = {
  toFirestore(routine: WithFieldValue<SkincareRoutine>): DocumentData {
    return {
      userId: routine.userId,
      routineId: routine.routineId,
      timeOfDay: routine.timeOfDay,
      steps: routine.steps || [],
      targetedConcerns: routine.targetedConcerns || [],
      createdAt: routine.createdAt instanceof Date ? Timestamp.fromDate(routine.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): SkincareRoutine {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      routineId: data.routineId || '',
      timeOfDay: data.timeOfDay || 'morning',
      steps: Array.isArray(data.steps) ? data.steps : [],
      targetedConcerns: Array.isArray(data.targetedConcerns) ? data.targetedConcerns : [],
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const skincareLogConverter = {
  toFirestore(log: WithFieldValue<SkincareLog>): DocumentData {
    return {
      userId: log.userId,
      skincareRoutineId: log.skincareRoutineId,
      routineLogId: log.routineLogId,
      date: log.date,
      time: log.time,
      completedStepIds: log.completedStepIds || [],
      skippedStepIds: log.skippedStepIds || [],
      appliedProductIds: log.appliedProductIds || [],
      weather: log.weather ?? null,
      uvIndex: log.uvIndex ?? null,
      skinFeelingRating: log.skinFeelingRating ?? null,
      notes: log.notes ?? null,
      createdAt: log.createdAt instanceof Date ? Timestamp.fromDate(log.createdAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): SkincareLog {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      skincareRoutineId: data.skincareRoutineId || '',
      routineLogId: data.routineLogId || '',
      date: data.date || '',
      time: data.time || '',
      completedStepIds: Array.isArray(data.completedStepIds) ? data.completedStepIds : [],
      skippedStepIds: Array.isArray(data.skippedStepIds) ? data.skippedStepIds : [],
      appliedProductIds: Array.isArray(data.appliedProductIds) ? data.appliedProductIds : [],
      weather: data.weather || undefined,
      uvIndex: typeof data.uvIndex === 'number' ? data.uvIndex : undefined,
      skinFeelingRating: typeof data.skinFeelingRating === 'number' ? data.skinFeelingRating : undefined,
      notes: data.notes || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    };
  },
};

export const skinAssessmentConverter = {
  toFirestore(assessment: WithFieldValue<SkinAssessment>): DocumentData {
    return {
      userId: assessment.userId,
      recordDate: assessment.recordDate,
      skinType: assessment.skinType,
      concerns: assessment.concerns || [],
      severityMap: assessment.severityMap || {},
      overallHealthScore: assessment.overallHealthScore,
      hydrationLevel: assessment.hydrationLevel,
      sensitivityLevel: assessment.sensitivityLevel,
      oilinessLevel: assessment.oilinessLevel,
      barrierHealthScore: assessment.barrierHealthScore,
      sleepHours: assessment.sleepHours ?? null,
      stressLevel: assessment.stressLevel ?? null,
      notes: assessment.notes ?? null,
      createdAt: assessment.createdAt instanceof Date ? Timestamp.fromDate(assessment.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): SkinAssessment {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      recordDate: data.recordDate || '',
      skinType: data.skinType || 'normal',
      concerns: Array.isArray(data.concerns) ? data.concerns : [],
      severityMap: data.severityMap || {},
      overallHealthScore: data.overallHealthScore ?? 7,
      hydrationLevel: data.hydrationLevel ?? 3,
      sensitivityLevel: data.sensitivityLevel ?? 3,
      oilinessLevel: data.oilinessLevel ?? 3,
      barrierHealthScore: data.barrierHealthScore ?? 3,
      sleepHours: typeof data.sleepHours === 'number' ? data.sleepHours : undefined,
      stressLevel: typeof data.stressLevel === 'number' ? data.stressLevel : undefined,
      notes: data.notes || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const progressPhotoConverter = {
  toFirestore(photo: WithFieldValue<ProgressPhoto>): DocumentData {
    return {
      userId: photo.userId,
      photoUrl: photo.photoUrl,
      storagePath: photo.storagePath,
      date: photo.date,
      timeOfDay: photo.timeOfDay,
      angle: photo.angle,
      lightingCondition: photo.lightingCondition ?? null,
      notes: photo.notes ?? null,
      createdAt: photo.createdAt instanceof Date ? Timestamp.fromDate(photo.createdAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): ProgressPhoto {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      photoUrl: data.photoUrl || '',
      storagePath: data.storagePath || '',
      date: data.date || '',
      timeOfDay: data.timeOfDay || 'morning',
      angle: data.angle || 'front',
      lightingCondition: data.lightingCondition || undefined,
      notes: data.notes || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    };
  },
};

export const skinReminderConverter = {
  toFirestore(reminder: WithFieldValue<SkinReminder>): DocumentData {
    return {
      userId: reminder.userId,
      title: reminder.title,
      time: reminder.time,
      reminderType: reminder.reminderType,
      frequency: reminder.frequency,
      daysOfWeek: reminder.daysOfWeek || [],
      isEnabled: reminder.isEnabled ?? true,
      createdAt: reminder.createdAt instanceof Date ? Timestamp.fromDate(reminder.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): SkinReminder {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      title: data.title || '',
      time: data.time || '08:00',
      reminderType: data.reminderType || 'morning-routine',
      frequency: data.frequency || 'daily',
      daysOfWeek: Array.isArray(data.daysOfWeek) ? data.daysOfWeek : [],
      isEnabled: data.isEnabled ?? true,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};
