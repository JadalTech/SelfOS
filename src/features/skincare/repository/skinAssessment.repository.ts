import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type { SkinAssessment } from '../types';
import { skincareService, SkincareService } from '../services/skincare.service';

export interface CreateSkinAssessmentInput {
  readonly recordDate: string;
  readonly skinType: SkinAssessment['skinType'];
  readonly concerns: SkinAssessment['concerns'];
  readonly severityMap: SkinAssessment['severityMap'];
  readonly overallHealthScore: number;
  readonly hydrationLevel: number;
  readonly sensitivityLevel: number;
  readonly oilinessLevel: number;
  readonly barrierHealthScore: number;
  readonly sleepHours?: number;
  readonly stressLevel?: number;
  readonly notes?: string;
}

export class SkinAssessmentRepository {
  constructor(private readonly service: SkincareService = skincareService) {}

  async fetchAssessments(userId: string): Promise<Result<SkinAssessment[], AppError>> {
    try {
      const assessments = await this.service.fetchAssessments(userId);
      return ok(assessments);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skin assessments', { originalError: error }));
    }
  }

  async getLatestAssessment(userId: string): Promise<Result<SkinAssessment | null, AppError>> {
    try {
      const assessments = await this.service.fetchAssessments(userId);
      const latest = assessments.length > 0 ? assessments[0] : null;
      return ok(latest);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch latest skin assessment', { originalError: error }));
    }
  }

  async createAssessment(
    userId: string,
    input: CreateSkinAssessmentInput
  ): Promise<Result<SkinAssessment, AppError>> {
    try {
      const assessment = await this.service.createAssessment(userId, {
        recordDate: input.recordDate,
        skinType: input.skinType,
        concerns: input.concerns,
        severityMap: input.severityMap,
        overallHealthScore: input.overallHealthScore,
        hydrationLevel: input.hydrationLevel,
        sensitivityLevel: input.sensitivityLevel,
        oilinessLevel: input.oilinessLevel,
        barrierHealthScore: input.barrierHealthScore,
        sleepHours: input.sleepHours,
        stressLevel: input.stressLevel,
        notes: input.notes,
      });
      return ok(assessment);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to record skin assessment', { originalError: error }));
    }
  }

  async updateAssessment(
    userId: string,
    assessmentId: string,
    updates: Partial<SkinAssessment>
  ): Promise<Result<SkinAssessment, AppError>> {
    try {
      const updated = await this.service.updateAssessment(userId, assessmentId, updates);
      return ok(updated);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update skin assessment', { originalError: error }));
    }
  }

  async deleteAssessment(userId: string, assessmentId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteAssessment(userId, assessmentId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete skin assessment', { originalError: error }));
    }
  }
}

export const skinAssessmentRepository = new SkinAssessmentRepository();
