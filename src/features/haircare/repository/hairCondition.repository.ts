import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { AppError } from '@/shared/errors';
import type { HairCondition } from '../types';
import { haircareService, HaircareService } from '../services/haircare.service';

export type CreateHairConditionInput = Omit<HairCondition, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export class HairConditionRepository {
  constructor(private readonly service: HaircareService = haircareService) {}

  async fetchConditions(userId: string, limitCount = 100): Promise<Result<HairCondition[], AppError>> {
    try {
      const conditions = await this.service.fetchHairConditions(userId, limitCount);
      return ok(conditions);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch hair condition records', { originalError: error }));
    }
  }

  async createCondition(userId: string, input: CreateHairConditionInput): Promise<Result<HairCondition, AppError>> {
    try {
      const condition = await this.service.createHairCondition(userId, input);
      return ok(condition);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create hair condition record', { originalError: error }));
    }
  }

  async updateCondition(
    userId: string,
    id: string,
    updates: Partial<HairCondition>
  ): Promise<Result<HairCondition, AppError>> {
    try {
      const updated = await this.service.updateHairCondition(userId, id, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update hair condition record', { originalError: error }));
    }
  }

  async deleteCondition(userId: string, id: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteHairCondition(userId, id);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete hair condition record', { originalError: error }));
    }
  }
}

export const hairConditionRepository = new HairConditionRepository();
