/**
 * Unified Repository Facade for Workout Module
 */

import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  IExerciseRepository,
  IWorkoutRepository,
  IPersonalRecordRepository,
  IWorkoutAnalyticsRepository,
} from './contracts';
import type {
  Exercise,
  WorkoutPlan,
  WorkoutTemplate,
  WorkoutSession,
  PersonalRecord,
} from '../types/workout.types';
import { STANDARD_EXERCISES } from '../constants/workout.constants';
import { workoutService, WorkoutService } from '../services/workout.service';
import {
  exerciseSchema,
  workoutPlanSchema,
  workoutTemplateSchema,
  workoutSessionSchema,
} from '../validation/workout.validation';
import { calculateOneRepMax, calculateSessionTotals } from '../engine/workoutEngine';
import { buildWorkoutAnalytics } from '../analytics/utils/workoutAnalytics';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export class WorkoutRepository
  implements
    IExerciseRepository,
    IWorkoutRepository,
    IPersonalRecordRepository,
    IWorkoutAnalyticsRepository
{
  constructor(private readonly service: WorkoutService = workoutService) {}

  // --- IExerciseRepository ---

  async searchExercises(userId: string, searchTerm: string): Promise<Result<Exercise[], AppError>> {
    try {
      const userExs = await this.service.fetchUserExercises(userId);
      const globalExs = STANDARD_EXERCISES;

      const merged = [...userExs, ...globalExs];

      if (!searchTerm) {
        return ok(merged);
      }

      const term = searchTerm.toLowerCase();
      const filtered = merged.filter(
        (ex) =>
          ex.name.toLowerCase().includes(term) ||
          (ex.aliases && ex.aliases.some((a) => a.toLowerCase().includes(term))) ||
          ex.primaryMuscleGroup.toLowerCase().includes(term)
      );

      return ok(filtered);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to search exercises catalog', {
          originalError: error,
        })
      );
    }
  }

  async createUserExercise(
    userId: string,
    exercise: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source'>
  ): Promise<Result<Exercise, AppError>> {
    try {
      const parsed = exerciseSchema.parse({
        ...exercise,
        source: 'user',
        userId,
      });

      const newEx = await this.service.createUserExercise(userId, parsed);
      return ok(newEx);
    } catch (error) {
      if (error && (error as any).name === 'ZodError') {
        return err(AppError.validation((error as any).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to create custom exercise', {
          originalError: error,
        })
      );
    }
  }

  async deleteUserExercise(userId: string, exerciseId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteUserExercise(userId, exerciseId);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to delete custom exercise', {
          originalError: error,
        })
      );
    }
  }

  // --- IWorkoutRepository ---

  async fetchPlans(userId: string): Promise<Result<WorkoutPlan[], AppError>> {
    try {
      const plans = await this.service.fetchPlans(userId);
      return ok(plans);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch workout plans', { originalError: error })
      );
    }
  }

  async savePlan(
    userId: string,
    plan: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<WorkoutPlan, AppError>> {
    try {
      workoutPlanSchema.parse(plan);
      const saved = await this.service.savePlan(userId, plan);
      return ok(saved);
    } catch (error) {
      if (error && (error as any).name === 'ZodError') {
        return err(AppError.validation((error as any).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to save workout plan', { originalError: error })
      );
    }
  }

  async deletePlan(userId: string, planId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deletePlan(userId, planId);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to delete workout plan', { originalError: error })
      );
    }
  }

  async fetchTemplates(userId: string): Promise<Result<WorkoutTemplate[], AppError>> {
    try {
      const templates = await this.service.fetchTemplates(userId);
      return ok(templates);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch templates', { originalError: error })
      );
    }
  }

  async createTemplate(
    userId: string,
    template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<WorkoutTemplate, AppError>> {
    try {
      workoutTemplateSchema.parse(template);
      const saved = await this.service.createTemplate(userId, template);
      return ok(saved);
    } catch (error) {
      if (error && (error as any).name === 'ZodError') {
        return err(AppError.validation((error as any).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to create template', { originalError: error })
      );
    }
  }

  async deleteTemplate(userId: string, templateId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteTemplate(userId, templateId);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to delete template', { originalError: error })
      );
    }
  }

  async getActiveSession(userId: string): Promise<Result<WorkoutSession | null, AppError>> {
    try {
      const session = await this.service.getActiveSession(userId);
      return ok(session);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to get active session', { originalError: error })
      );
    }
  }

  async saveSession(
    userId: string,
    session: WorkoutSession
  ): Promise<Result<WorkoutSession, AppError>> {
    try {
      workoutSessionSchema.parse(session);
      
      // Calculate session totals using Engine before saving
      const totals = calculateSessionTotals(
        session.exercises,
        session.startedAt,
        session.completedAt,
        session.durationSeconds
      );

      const finalizedSession: WorkoutSession = {
        ...session,
        totalVolume: totals.totalVolume,
        totalReps: totals.totalReps,
        durationSeconds: totals.durationSeconds,
        estimatedIntensity: totals.estimatedIntensity,
        averageRPE: totals.averageRPE,
        averageRestDuration: totals.averageRestDuration,
        caloriesBurned: totals.caloriesBurned,
        updatedAt: new Date(),
      };

      const saved = await this.service.saveSession(userId, finalizedSession);

      // Trigger Personal Record checking when session completes successfully
      if (finalizedSession.status === 'completed') {
        await this.checkAndLogNewPRs(userId, finalizedSession);
      }

      return ok(saved);
    } catch (error) {
      if (error && (error as any).name === 'ZodError') {
        return err(AppError.validation((error as any).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to save session log', { originalError: error })
      );
    }
  }

  async fetchHistory(userId: string, limitCount = 50): Promise<Result<WorkoutSession[], AppError>> {
    try {
      const sessions = await this.service.fetchHistory(userId, limitCount);
      return ok(sessions);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch workout history', { originalError: error })
      );
    }
  }

  async deleteSession(userId: string, sessionId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteSession(userId, sessionId);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to delete session', { originalError: error })
      );
    }
  }

  // --- IPersonalRecordRepository ---

  async fetchPersonalRecords(userId: string): Promise<Result<PersonalRecord[], AppError>> {
    try {
      const records = await this.service.fetchPersonalRecords(userId);
      return ok(records);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch personal records', {
          originalError: error,
        })
      );
    }
  }

  async deletePersonalRecord(userId: string, recordId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deletePersonalRecord(userId, recordId);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to delete personal record', {
          originalError: error,
        })
      );
    }
  }

  async checkAndLogNewPRs(
    userId: string,
    session: WorkoutSession
  ): Promise<Result<PersonalRecord[], AppError>> {
    try {
      const prsRes = await this.fetchPersonalRecords(userId);
      if (!prsRes.success) return err(prsRes.error);
      const existingPrs = prsRes.data;

      // Group existing PRs by exerciseId and type
      const prMap = new Map<string, PersonalRecord>();
      for (const pr of existingPrs) {
        const key = `${pr.exerciseId}:${pr.type}`;
        const current = prMap.get(key);
        if (!current || pr.value > current.value) {
          prMap.set(key, pr);
        }
      }

      const newPrs: PersonalRecord[] = [];
      const dateStr = session.completedAt
        ? session.completedAt.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      for (const ex of session.exercises) {
        let totalExerciseVolume = 0;
        let maxWeightInExercise = 0;
        let maxRepsInExercise = 0;
        let maxEstimated1RM = 0;
        let maxDuration = 0; // for cardio

        for (const set of ex.sets) {
          if (!set.completed) continue;

          // Volume
          if (set.type !== 'warmup') {
            totalExerciseVolume += set.weight * set.reps;
          }

          // Max weight & reps
          if (set.weight > maxWeightInExercise) {
            maxWeightInExercise = set.weight;
          }
          if (set.reps > maxRepsInExercise) {
            maxRepsInExercise = set.reps;
          }

          // Estimated 1RM
          if (set.weight > 0 && set.reps > 0) {
            const estimated1RM = calculateOneRepMax(set.weight, set.reps);
            if (estimated1RM > maxEstimated1RM) {
              maxEstimated1RM = estimated1RM;
            }
          }

          // Duration for cardio
          if (ex.exerciseCategory === 'cardio' && set.reps > maxDuration) {
            maxDuration = set.reps;
          }
        }

        // 1. Check max weight PR
        if (maxWeightInExercise > 0 && ex.exerciseCategory !== 'cardio') {
          const key = `${ex.exerciseId}:max-weight`;
          const currentPr = prMap.get(key);
          if (!currentPr || maxWeightInExercise > currentPr.value) {
            const newPr: PersonalRecord = {
              id: `pr-${ex.exerciseId}-weight-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              userId,
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              type: 'max-weight',
              value: maxWeightInExercise,
              unit: 'kg',
              date: dateStr,
              sessionId: session.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            newPrs.push(newPr);
            prMap.set(key, newPr);
          }
        }

        // 2. Check estimated 1RM PR
        if (maxEstimated1RM > 0 && ex.exerciseCategory !== 'cardio') {
          const key = `${ex.exerciseId}:one-rep-max`;
          const currentPr = prMap.get(key);
          if (!currentPr || maxEstimated1RM > currentPr.value) {
            const newPr: PersonalRecord = {
              id: `pr-${ex.exerciseId}-1rm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              userId,
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              type: 'one-rep-max',
              value: maxEstimated1RM,
              unit: 'kg',
              date: dateStr,
              sessionId: session.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            newPrs.push(newPr);
            prMap.set(key, newPr);
          }
        }

        // 3. Check highest volume PR
        if (totalExerciseVolume > 0 && ex.exerciseCategory !== 'cardio') {
          const key = `${ex.exerciseId}:highest-volume`;
          const currentPr = prMap.get(key);
          if (!currentPr || totalExerciseVolume > currentPr.value) {
            const newPr: PersonalRecord = {
              id: `pr-${ex.exerciseId}-vol-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              userId,
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              type: 'highest-volume',
              value: totalExerciseVolume,
              unit: 'kg',
              date: dateStr,
              sessionId: session.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            newPrs.push(newPr);
            prMap.set(key, newPr);
          }
        }

        // 4. Check max repetitions PR
        if (maxRepsInExercise > 0 && ex.exerciseCategory !== 'cardio') {
          const key = `${ex.exerciseId}:max-reps`;
          const currentPr = prMap.get(key);
          if (!currentPr || maxRepsInExercise > currentPr.value) {
            const newPr: PersonalRecord = {
              id: `pr-${ex.exerciseId}-reps-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              userId,
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              type: 'max-reps',
              value: maxRepsInExercise,
              unit: 'reps',
              date: dateStr,
              sessionId: session.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            newPrs.push(newPr);
            prMap.set(key, newPr);
          }
        }

        // 5. Check longest duration (for cardio)
        if (maxDuration > 0 && ex.exerciseCategory === 'cardio') {
          const key = `${ex.exerciseId}:longest-duration`;
          const currentPr = prMap.get(key);
          if (!currentPr || maxDuration > currentPr.value) {
            const newPr: PersonalRecord = {
              id: `pr-${ex.exerciseId}-duration-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              userId,
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              type: 'longest-duration',
              value: maxDuration,
              unit: 'seconds',
              date: dateStr,
              sessionId: session.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            newPrs.push(newPr);
            prMap.set(key, newPr);
          }
        }
      }

      // Save all new personal records to Firestore
      for (const pr of newPrs) {
        await this.service.savePersonalRecord(userId, pr);
      }

      return ok(newPrs);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to calculate and save personal records', {
          originalError: error,
        })
      );
    }
  }

  // --- IWorkoutAnalyticsRepository ---

  async fetchWorkoutAnalytics(
    userId: string,
    limitDays = 90
  ): Promise<Result<FeatureAnalytics[], AppError>> {
    try {
      const [sessions, prs] = await Promise.all([
        this.service.fetchHistory(userId, 100), // load up to 100 sessions
        this.service.fetchPersonalRecords(userId),
      ]);

      const analytics = buildWorkoutAnalytics(sessions, prs, 3);
      return ok(analytics);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to compile workout analytics', {
          originalError: error,
        })
      );
    }
  }
}

export const workoutRepository = new WorkoutRepository();
