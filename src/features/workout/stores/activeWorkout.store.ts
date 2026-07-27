/**
 * Active Workout Tracking Store
 *
 * Manages the live state of an active workout session with
 * local storage persistence to prevent data loss on app reload or crash.
 */

import { create } from 'zustand';
import type {
  WorkoutSession,
  WorkoutExercise,
  ExerciseSet,
  Exercise,
  SetType,
} from '../types/workout.types';
import { storage } from '../../../shared/storage';

const ACTIVE_WORKOUT_STORAGE_KEY = '@selfos/workout/active-session';

interface ActiveWorkoutState {
  activeSession: WorkoutSession | null;
  isTracking: boolean;
  isPaused: boolean;
  isHydrated: boolean;
}

interface ActiveWorkoutActions {
  startSession: (
    userId: string,
    name: string,
    options?: { templateId?: string; planId?: string; exercises?: WorkoutExercise[] }
  ) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  incrementDuration: () => Promise<void>;
  updateNotes: (notes: string) => Promise<void>;
  addExerciseToSession: (exercise: Exercise) => Promise<void>;
  removeExerciseFromSession: (exerciseId: string) => Promise<void>;
  addSetToExercise: (exerciseId: string, type?: SetType) => Promise<void>;
  removeSetFromExercise: (exerciseId: string, setIndex: number) => Promise<void>;
  updateSetMetrics: (
    exerciseId: string,
    setIndex: number,
    updates: Partial<Omit<ExerciseSet, 'id'>>
  ) => Promise<void>;
  completeSet: (exerciseId: string, setIndex: number, completed: boolean) => Promise<void>;
  finishSession: () => Promise<WorkoutSession | null>;
  abandonSession: () => Promise<void>;
  hydrateStore: () => Promise<void>;
}

const DEFAULT_SET_TYPE: SetType = 'working';

export const useActiveWorkoutStore = create<ActiveWorkoutState & ActiveWorkoutActions>()(
  (set, get) => {
    // Helper to persist current state
    const persist = async (session: WorkoutSession | null) => {
      if (session) {
        await storage.setObject(ACTIVE_WORKOUT_STORAGE_KEY, session);
      } else {
        await storage.remove(ACTIVE_WORKOUT_STORAGE_KEY);
      }
    };

    return {
      activeSession: null,
      isTracking: false,
      isPaused: false,
      isHydrated: false,

      startSession: async (userId, name, options) => {
        const now = new Date();
        const initialExercises = options?.exercises || [];
        
        const newSession: WorkoutSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId,
          name,
          status: 'active',
          exercises: initialExercises,
          startedAt: now,
          durationSeconds: 0,
          totalVolume: 0,
          totalReps: 0,
          createdAt: now,
          updatedAt: now,
          templateId: options?.templateId,
          planId: options?.planId,
        };

        set({
          activeSession: newSession,
          isTracking: true,
          isPaused: false,
        });

        await persist(newSession);
      },

      pauseSession: async () => {
        const { activeSession } = get();
        if (!activeSession) return;

        const now = new Date();
        const updated: WorkoutSession = {
          ...activeSession,
          status: 'paused',
          pausedAt: now,
          updatedAt: now,
        };

        set({
          activeSession: updated,
          isPaused: true,
        });

        await persist(updated);
      },

      resumeSession: async () => {
        const { activeSession } = get();
        if (!activeSession) return;

        const now = new Date();
        const updated: WorkoutSession = {
          ...activeSession,
          status: 'active',
          resumedAt: now,
          updatedAt: now,
        };

        set({
          activeSession: updated,
          isPaused: false,
        });

        await persist(updated);
      },

      incrementDuration: async () => {
        const { activeSession, isPaused, isTracking } = get();
        if (!activeSession || isPaused || !isTracking) return;

        const updated: WorkoutSession = {
          ...activeSession,
          durationSeconds: activeSession.durationSeconds + 1,
        };

        set({ activeSession: updated });
        // Minimize storage writes by only persisting every 5 seconds, 
        // or write continuously if acceptable. In memory is fast but disk write is throttled.
        // Let's persist on increment to be 100% crash resistant
        await persist(updated);
      },

      updateNotes: async (notes) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updated: WorkoutSession = {
          ...activeSession,
          notes,
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      addExerciseToSession: async (exercise) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const newEx: WorkoutExercise = {
          id: `workex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          exerciseCategory: exercise.category,
          primaryMuscleGroup: exercise.primaryMuscleGroup,
          sets: [
            {
              id: `set-${Date.now()}-0`,
              type: DEFAULT_SET_TYPE,
              weight: 0,
              reps: 0,
              completed: false,
              restTimeSeconds: exercise.defaultRestDurationSeconds,
            },
          ],
          notes: '',
        };

        const updated: WorkoutSession = {
          ...activeSession,
          exercises: [...activeSession.exercises, newEx],
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      removeExerciseFromSession: async (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updated: WorkoutSession = {
          ...activeSession,
          exercises: activeSession.exercises.filter((ex) => ex.id !== exerciseId),
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      addSetToExercise: async (exerciseId, type = DEFAULT_SET_TYPE) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;

          // Copy last set's weight and reps as standard convenience
          const lastSet = ex.sets[ex.sets.length - 1];
          const defaultWeight = lastSet ? lastSet.weight : 0;
          const defaultReps = lastSet ? lastSet.reps : 0;
          const defaultRest = lastSet ? lastSet.restTimeSeconds : undefined;

          const newSet: ExerciseSet = {
            id: `set-${Date.now()}-${ex.sets.length}`,
            type,
            weight: defaultWeight,
            reps: defaultReps,
            completed: false,
            restTimeSeconds: defaultRest,
          };

          return {
            ...ex,
            sets: [...ex.sets, newSet],
          };
        });

        const updated: WorkoutSession = {
          ...activeSession,
          exercises: updatedExercises,
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      removeSetFromExercise: async (exerciseId, setIndex) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.filter((_, i) => i !== setIndex),
          };
        });

        const updated: WorkoutSession = {
          ...activeSession,
          exercises: updatedExercises,
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      updateSetMetrics: async (exerciseId, setIndex, updates) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const updatedSets = ex.sets.map((set, i) => {
            if (i !== setIndex) return set;
            return {
              ...set,
              ...updates,
            };
          });
          return {
            ...ex,
            sets: updatedSets,
          };
        });

        const updated: WorkoutSession = {
          ...activeSession,
          exercises: updatedExercises,
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      completeSet: async (exerciseId, setIndex, completed) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedExercises = activeSession.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const updatedSets = ex.sets.map((set, i) => {
            if (i !== setIndex) return set;
            return {
              ...set,
              completed,
            };
          });
          return {
            ...ex,
            sets: updatedSets,
          };
        });

        const updated: WorkoutSession = {
          ...activeSession,
          exercises: updatedExercises,
        };

        set({ activeSession: updated });
        await persist(updated);
      },

      finishSession: async () => {
        const { activeSession } = get();
        if (!activeSession) return null;

        const now = new Date();
        const completedSession: WorkoutSession = {
          ...activeSession,
          status: 'completed',
          completedAt: now,
          updatedAt: now,
        };

        set({
          activeSession: null,
          isTracking: false,
          isPaused: false,
        });

        await persist(null);
        return completedSession;
      },

      abandonSession: async () => {
        set({
          activeSession: null,
          isTracking: false,
          isPaused: false,
        });

        await persist(null);
      },

      hydrateStore: async () => {
        try {
          const session = await storage.getObject<WorkoutSession>(ACTIVE_WORKOUT_STORAGE_KEY);
          if (session) {
            // Reconstruct Date objects from ISO strings if needed
            const reconstructed: WorkoutSession = {
              ...session,
              startedAt: new Date(session.startedAt),
              pausedAt: session.pausedAt ? new Date(session.pausedAt) : undefined,
              resumedAt: session.resumedAt ? new Date(session.resumedAt) : undefined,
              completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
              createdAt: new Date(session.createdAt),
              updatedAt: new Date(session.updatedAt),
            };

            set({
              activeSession: reconstructed,
              isTracking: true,
              isPaused: reconstructed.status === 'paused',
              isHydrated: true,
            });
          } else {
            set({ isHydrated: true });
          }
        } catch {
          set({ isHydrated: true });
        }
      },
    };
  }
);
