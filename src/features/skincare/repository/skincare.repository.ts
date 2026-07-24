import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import { routineRepository } from '../../routine';
import type { SkincareProduct, SkincareRoutine, SkincareLog, RoutineStep, SkinConcern } from '../types';
import { skincareService, SkincareService } from '../services/skincare.service';

export interface CreateSkincareProductInput {
  readonly name: string;
  readonly brand: string;
  readonly category: SkincareProduct['category'];
  readonly type: SkincareProduct['type'];
  readonly keyIngredients?: string[];
  readonly openedDate?: Date | string;
  readonly shelfLifeMonths?: number;
  readonly isFavorite?: boolean;
  readonly isActive?: boolean;
  readonly notes?: string;
}

export interface CreateSkincareRoutineInput {
  readonly title: string;
  readonly timeOfDay: SkincareRoutine['timeOfDay'];
  readonly steps: {
    id?: string;
    productId: string;
    stepOrder: number;
    timeOfDay: SkincareRoutine['timeOfDay'];
    waitTimeMinutes?: number;
    instructions?: string;
    isOptional?: boolean;
  }[];
  readonly targetedConcerns?: SkinConcern[];
  readonly frequency?: 'daily' | 'weekly' | 'biweekly' | 'custom';
  readonly daysOfWeek?: number[];
  readonly reminderTime?: string;
}

export interface LogSkincareExecutionInput {
  readonly skincareRoutineId: string;
  readonly coreRoutineId: string;
  readonly dateStr: string;
  readonly timeStr?: string;
  readonly completedStepIds: string[];
  readonly skippedStepIds?: string[];
  readonly appliedProductIds: string[];
  readonly weather?: SkincareLog['weather'];
  readonly uvIndex?: number;
  readonly skinFeelingRating?: number;
  readonly notes?: string;
}

export class SkincareRepository {
  constructor(private readonly service: SkincareService = skincareService) {}

  // --- Product Inventory ---

  async fetchProducts(userId: string): Promise<Result<SkincareProduct[], AppError>> {
    try {
      const products = await this.service.fetchProducts(userId);
      return ok(products);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skincare products', { originalError: error }));
    }
  }

  async createProduct(
    userId: string,
    input: CreateSkincareProductInput
  ): Promise<Result<SkincareProduct, AppError>> {
    try {
      const openedDateParsed = input.openedDate
        ? typeof input.openedDate === 'string'
          ? new Date(input.openedDate)
          : input.openedDate
        : undefined;

      const product = await this.service.createProduct(userId, {
        ...input,
        keyIngredients: input.keyIngredients || [],
        isFavorite: input.isFavorite ?? false,
        isActive: input.isActive ?? true,
        openedDate: openedDateParsed,
      });
      return ok(product);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create skincare product', { originalError: error }));
    }
  }

  async updateProduct(
    userId: string,
    productId: string,
    updates: Partial<SkincareProduct>
  ): Promise<Result<SkincareProduct, AppError>> {
    try {
      const updated = await this.service.updateProduct(userId, productId, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update skincare product', { originalError: error }));
    }
  }

  async deleteProduct(userId: string, productId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteProduct(userId, productId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete skincare product', { originalError: error }));
    }
  }

  // --- Routines ---

  async fetchRoutines(userId: string): Promise<Result<SkincareRoutine[], AppError>> {
    try {
      const routines = await this.service.fetchRoutines(userId);
      return ok(routines);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skincare routines', { originalError: error }));
    }
  }

  async createSkincareRoutine(
    userId: string,
    input: CreateSkincareRoutineInput
  ): Promise<Result<SkincareRoutine, AppError>> {
    try {
      const frequencyMap = input.frequency === 'biweekly' ? 'weekly' : (input.frequency || 'daily');
      const intervalVal = input.frequency === 'biweekly' ? 2 : 1;

      // 1. First, create core Generic Routine via routineRepository
      const coreRoutineResult = await routineRepository.createRoutine({
        title: input.title,
        type: 'skincare',
        status: 'active',
        schedule: {
          frequency: frequencyMap,
          interval: intervalVal,
          daysOfWeek: input.daysOfWeek,
          startDate: new Date().toISOString().split('T')[0],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        },
        reminders: input.reminderTime
          ? [
              {
                id: `rem_${Date.now()}`,
                time: input.reminderTime,
                enabled: true,
              },
            ]
          : [],
      });

      if (!coreRoutineResult.success) {
        return err(coreRoutineResult.error as AppError);
      }

      const formattedSteps: RoutineStep[] = input.steps.map((s, idx) => ({
        id: s.id || `step_${idx}_${Date.now()}`,
        productId: s.productId,
        stepOrder: s.stepOrder,
        timeOfDay: s.timeOfDay,
        waitTimeMinutes: s.waitTimeMinutes,
        instructions: s.instructions,
        isOptional: s.isOptional ?? false,
      }));

      // 2. Create specialized SkincareRoutine entity
      const skincareRoutine = await this.service.createRoutine(userId, {
        routineId: coreRoutineResult.data.id,
        timeOfDay: input.timeOfDay,
        steps: formattedSteps,
        targetedConcerns: input.targetedConcerns || [],
      });

      return ok(skincareRoutine);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create skincare routine', { originalError: error }));
    }
  }

  async updateSkincareRoutine(
    userId: string,
    skincareRoutineId: string,
    updates: Partial<SkincareRoutine>
  ): Promise<Result<SkincareRoutine, AppError>> {
    try {
      const updated = await this.service.updateRoutine(userId, skincareRoutineId, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update skincare routine', { originalError: error }));
    }
  }

  async deleteSkincareRoutine(
    userId: string,
    skincareRoutineId: string,
    coreRoutineId?: string
  ): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteRoutine(userId, skincareRoutineId);
      if (coreRoutineId) {
        await routineRepository.archiveRoutine(coreRoutineId);
      }
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete skincare routine', { originalError: error }));
    }
  }

  // --- Execution Audit Logs ---

  async fetchLogs(userId: string, limitDays?: number): Promise<Result<SkincareLog[], AppError>> {
    try {
      const logs = await this.service.fetchLogs(userId, limitDays);
      return ok(logs);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skincare logs', { originalError: error }));
    }
  }

  async logRoutineExecution(
    userId: string,
    input: LogSkincareExecutionInput
  ): Promise<Result<SkincareLog, AppError>> {
    try {
      // 1. Complete core generic routine log first
      const coreLogResult = await routineRepository.completeRoutine(
        input.coreRoutineId,
        input.dateStr
      );

      const routineLogId = coreLogResult.success ? coreLogResult.data.id : `log_${Date.now()}`;

      // 2. Create specialized SkincareLog entry
      const log = await this.service.createLog(userId, {
        skincareRoutineId: input.skincareRoutineId,
        routineLogId,
        date: input.dateStr,
        time: input.timeStr || new Date().toTimeString().split(' ')[0],
        completedStepIds: input.completedStepIds,
        skippedStepIds: input.skippedStepIds || [],
        appliedProductIds: input.appliedProductIds,
        weather: input.weather,
        uvIndex: input.uvIndex,
        skinFeelingRating: input.skinFeelingRating,
        notes: input.notes,
      });

      return ok(log);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to log skincare routine execution', { originalError: error }));
    }
  }
}

export const skincareRepository = new SkincareRepository();
