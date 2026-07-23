import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { AppError } from '@/shared/errors';
import { routineRepository } from '@/features/routine';
import type { HairProduct, HairRoutine, HairLog } from '../types';
import { haircareService, HaircareService } from '../services/haircare.service';

export interface CreateProductInput {
  readonly name: string;
  readonly brand: string;
  readonly category: HairProduct['category'];
  readonly isFavorite?: boolean;
  readonly isActive?: boolean;
  readonly notes?: string;
}

export interface CreateHairRoutineInput {
  readonly title: string;
  readonly haircareCategory: HairRoutine['haircareCategory'];
  readonly productIds: string[];
  readonly frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  readonly daysOfWeek?: number[];
  readonly reminderTime?: string;
  readonly instructions?: string;
}

export interface LogHaircareInput {
  readonly hairRoutineId: string;
  readonly coreRoutineId: string;
  readonly dateStr: string;
  readonly appliedProductIds: string[];
  readonly notes?: string;
}

export class HaircareRepository {
  constructor(private readonly service: HaircareService = haircareService) {}

  // --- Products Repository Methods ---

  async fetchProducts(userId: string): Promise<Result<HairProduct[], AppError>> {
    try {
      const products = await this.service.fetchProducts(userId);
      return ok(products);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch hair products', { originalError: error }));
    }
  }

  async createProduct(userId: string, input: CreateProductInput): Promise<Result<HairProduct, AppError>> {
    try {
      const product = await this.service.createProduct(userId, {
        name: input.name,
        brand: input.brand,
        category: input.category,
        isFavorite: input.isFavorite ?? false,
        isActive: input.isActive ?? true,
        notes: input.notes,
      });
      return ok(product);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create hair product', { originalError: error }));
    }
  }

  async updateProduct(
    userId: string,
    productId: string,
    updates: Partial<HairProduct>
  ): Promise<Result<HairProduct, AppError>> {
    try {
      const updated = await this.service.updateProduct(userId, productId, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update hair product', { originalError: error }));
    }
  }

  async deleteProduct(userId: string, productId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteProduct(userId, productId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete hair product', { originalError: error }));
    }
  }

  // --- Hair Routines Repository Methods ---

  async fetchHairRoutines(userId: string): Promise<Result<HairRoutine[], AppError>> {
    try {
      const hairRoutines = await this.service.fetchHairRoutines(userId);
      return ok(hairRoutines);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch hair routines', { originalError: error }));
    }
  }

  async createHairRoutine(
    userId: string,
    input: CreateHairRoutineInput
  ): Promise<Result<HairRoutine, AppError>> {
    try {
      // 1. Create underlying core generic Routine in Routine Engine
      const coreRoutineRes = await routineRepository.createRoutine({
        title: input.title,
        type: 'haircare',
        status: 'active',
        schedule: {
          frequency: input.frequency,
          interval: 1,
          daysOfWeek: input.daysOfWeek,
          startDate: new Date().toISOString().split('T')[0],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        },
        reminders: input.reminderTime
          ? [{ id: 'rem_hair', time: input.reminderTime, enabled: true }]
          : [],
      });

      if (!coreRoutineRes.success) {
        const appErr = coreRoutineRes.error instanceof AppError
          ? coreRoutineRes.error
          : new AppError('FIREBASE_ERROR', coreRoutineRes.error.message, { originalError: coreRoutineRes.error });
        return err(appErr);
      }

      const coreRoutine = coreRoutineRes.data;

      // 2. Create HairRoutine extension record linking coreRoutine.id
      const hairRoutine = await this.service.createHairRoutine(userId, {
        routineId: coreRoutine.id,
        haircareCategory: input.haircareCategory,
        productIds: input.productIds,
        instructions: input.instructions,
      });

      return ok(hairRoutine);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create hair routine', { originalError: error }));
    }
  }

  async updateHairRoutine(
    userId: string,
    id: string,
    updates: Partial<HairRoutine>
  ): Promise<Result<HairRoutine, AppError>> {
    try {
      const updated = await this.service.updateHairRoutine(userId, id, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update hair routine', { originalError: error }));
    }
  }

  async deleteHairRoutine(userId: string, id: string, coreRoutineId?: string): Promise<Result<void, AppError>> {
    try {
      if (coreRoutineId) {
        await routineRepository.archiveRoutine(coreRoutineId);
      }
      await this.service.deleteHairRoutine(userId, id);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete hair routine', { originalError: error }));
    }
  }

  // --- Hair Logs Repository Methods ---

  async fetchHairLogs(userId: string, limitCount = 50): Promise<Result<HairLog[], AppError>> {
    try {
      const logs = await this.service.fetchHairLogs(userId, limitCount);
      return ok(logs);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch hair logs', { originalError: error }));
    }
  }

  async logHaircareExecution(
    userId: string,
    input: LogHaircareInput
  ): Promise<Result<HairLog, AppError>> {
    try {
      // 1. Complete underlying core routine in Routine Engine to update streaks & core completion logs
      let routineLogId: string | undefined;
      const coreLogRes = await routineRepository.completeRoutine(input.coreRoutineId, input.dateStr);

      if (coreLogRes.success) {
        routineLogId = coreLogRes.data.id;
      }

      const timeStr = new Date().toTimeString().split(' ')[0];

      // 2. Create HairLog audit record
      const hairLog = await this.service.logHaircareExecution(userId, {
        hairRoutineId: input.hairRoutineId,
        routineLogId,
        date: input.dateStr,
        time: timeStr,
        appliedProductIds: input.appliedProductIds,
        notes: input.notes,
      });

      return ok(hairLog);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to log haircare execution', { originalError: error }));
    }
  }
}

export const haircareRepository = new HaircareRepository();
