/**
 * Firestore Custom Converters for Workout Module
 */

import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import type {
  WorkoutPlan,
  WorkoutSession,
  WorkoutTemplate,
  PersonalRecord,
  Exercise,
} from '../types/workout.types';

export const userExerciseConverter = {
  toFirestore(ex: WithFieldValue<Exercise>): DocumentData {
    return {
      name: ex.name,
      aliases: ex.aliases ?? null,
      primaryMuscleGroup: ex.primaryMuscleGroup,
      secondaryMuscleGroups: ex.secondaryMuscleGroups ?? null,
      equipment: ex.equipment,
      category: ex.category,
      difficulty: ex.difficulty,
      unilateral: ex.unilateral ?? false,
      defaultRestDurationSeconds: ex.defaultRestDurationSeconds ?? null,
      defaultUnit: ex.defaultUnit,
      instructions: ex.instructions ?? null,
      source: 'user',
      userId: ex.userId,
      createdAt: ex.createdAt instanceof Date ? Timestamp.fromDate(ex.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Exercise {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name || '',
      aliases: data.aliases || undefined,
      primaryMuscleGroup: data.primaryMuscleGroup || 'other',
      secondaryMuscleGroups: data.secondaryMuscleGroups || undefined,
      equipment: data.equipment || 'none',
      category: data.category || 'other',
      difficulty: data.difficulty || 'beginner',
      unilateral: data.unilateral ?? false,
      defaultRestDurationSeconds: data.defaultRestDurationSeconds || undefined,
      defaultUnit: data.defaultUnit || 'kg',
      instructions: data.instructions || undefined,
      source: 'user',
      userId: data.userId || '',
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const workoutPlanConverter = {
  toFirestore(plan: WithFieldValue<WorkoutPlan>): DocumentData {
    return {
      userId: plan.userId,
      name: plan.name,
      description: plan.description ?? null,
      exercises: plan.exercises || [],
      targetDaysPerWeek: plan.targetDaysPerWeek ?? null,
      isActive: plan.isActive ?? true,
      createdAt: plan.createdAt instanceof Date ? Timestamp.fromDate(plan.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): WorkoutPlan {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      name: data.name || '',
      description: data.description || undefined,
      exercises: Array.isArray(data.exercises) ? data.exercises : [],
      targetDaysPerWeek: typeof data.targetDaysPerWeek === 'number' ? data.targetDaysPerWeek : undefined,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const workoutSessionConverter = {
  toFirestore(session: WithFieldValue<WorkoutSession>): DocumentData {
    return {
      userId: session.userId,
      templateId: session.templateId ?? null,
      planId: session.planId ?? null,
      name: session.name,
      status: session.status,
      exercises: session.exercises || [],
      startedAt: session.startedAt instanceof Date ? Timestamp.fromDate(session.startedAt) : Timestamp.now(),
      pausedAt: session.pausedAt instanceof Date ? Timestamp.fromDate(session.pausedAt) : null,
      resumedAt: session.resumedAt instanceof Date ? Timestamp.fromDate(session.resumedAt) : null,
      completedAt: session.completedAt instanceof Date ? Timestamp.fromDate(session.completedAt) : null,
      durationSeconds: session.durationSeconds || 0,
      notes: session.notes ?? null,
      totalVolume: session.totalVolume || 0,
      totalReps: session.totalReps || 0,
      estimatedIntensity: session.estimatedIntensity ?? null,
      averageRPE: session.averageRPE ?? null,
      averageRestDuration: session.averageRestDuration ?? null,
      caloriesBurned: session.caloriesBurned ?? null,
      createdAt: session.createdAt instanceof Date ? Timestamp.fromDate(session.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): WorkoutSession {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      templateId: data.templateId || undefined,
      planId: data.planId || undefined,
      name: data.name || '',
      status: data.status || 'active',
      exercises: Array.isArray(data.exercises) ? data.exercises : [],
      startedAt: data.startedAt instanceof Timestamp ? data.startedAt.toDate() : new Date(),
      pausedAt: data.pausedAt instanceof Timestamp ? data.pausedAt.toDate() : undefined,
      resumedAt: data.resumedAt instanceof Timestamp ? data.resumedAt.toDate() : undefined,
      completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : undefined,
      durationSeconds: data.durationSeconds || 0,
      notes: data.notes || undefined,
      totalVolume: data.totalVolume || 0,
      totalReps: data.totalReps || 0,
      estimatedIntensity: data.estimatedIntensity || undefined,
      averageRPE: data.averageRPE || undefined,
      averageRestDuration: data.averageRestDuration || undefined,
      caloriesBurned: data.caloriesBurned || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const workoutTemplateConverter = {
  toFirestore(template: WithFieldValue<WorkoutTemplate>): DocumentData {
    return {
      userId: template.userId,
      name: template.name,
      description: template.description ?? null,
      exercises: template.exercises || [],
      createdAt: template.createdAt instanceof Date ? Timestamp.fromDate(template.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): WorkoutTemplate {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      name: data.name || '',
      description: data.description || undefined,
      exercises: Array.isArray(data.exercises) ? data.exercises : [],
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};

export const workoutHistoryConverter = {
  toFirestore(session: WithFieldValue<WorkoutSession>): DocumentData {
    return workoutSessionConverter.toFirestore(session);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): WorkoutSession {
    return workoutSessionConverter.fromFirestore(snapshot, options);
  },
};

export const personalRecordConverter = {
  toFirestore(pr: WithFieldValue<PersonalRecord>): DocumentData {
    return {
      userId: pr.userId,
      exerciseId: pr.exerciseId,
      exerciseName: pr.exerciseName,
      type: pr.type,
      value: pr.value,
      unit: pr.unit,
      date: pr.date,
      sessionId: pr.sessionId ?? null,
      createdAt: pr.createdAt instanceof Date ? Timestamp.fromDate(pr.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): PersonalRecord {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      exerciseId: data.exerciseId || '',
      exerciseName: data.exerciseName || '',
      type: data.type || 'max-weight',
      value: data.value || 0,
      unit: data.unit || 'kg',
      date: data.date || '',
      sessionId: data.sessionId || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};
