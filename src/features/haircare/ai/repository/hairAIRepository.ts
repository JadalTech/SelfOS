import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { AppError } from '@/shared/errors';
import { haircareRepository } from '../../repository/haircare.repository';
import { hairPhotoRepository } from '../../repository/hairPhoto.repository';
import { hairConditionRepository } from '../../repository/hairCondition.repository';
import { routineRepository } from '@/features/routine';
import { buildHairAnalyticsVM } from '../../analytics/utils/hairAnalytics';
import { HairAIContextBuilder } from '../utils/contextBuilder';
import { hairAIService, HairAIService } from '../services/hairAI.service';
import type {
  HairAIContext,
  HairRecommendation,
  HairCoachMessage,
  HairReviewSummary,
} from '../types/ai.types';

export class HairAIRepository {
  constructor(private readonly aiService: HairAIService = hairAIService) {}

  /**
   * Helper to build aggregated context payload for current user.
   */
  async getContext(userId: string): Promise<Result<HairAIContext, AppError>> {
    try {
      const [prodsRes, routinesRes, logsRes, photosRes, condsRes, coreRoutinesRes] = await Promise.all([
        haircareRepository.fetchProducts(userId),
        haircareRepository.fetchHairRoutines(userId),
        haircareRepository.fetchHairLogs(userId, 50),
        hairPhotoRepository.fetchPhotos(userId, 50),
        hairConditionRepository.fetchConditions(userId, 50),
        routineRepository.fetchRoutines({ type: 'haircare' }),
      ]);

      const products = prodsRes.success ? prodsRes.data : [];
      const hairRoutines = routinesRes.success ? routinesRes.data : [];
      const logs = logsRes.success ? logsRes.data : [];
      const photos = photosRes.success ? photosRes.data : [];
      const conditions = condsRes.success ? condsRes.data : [];
      const coreRoutines = coreRoutinesRes.success ? coreRoutinesRes.data : [];

      const analytics = buildHairAnalyticsVM(
        products,
        hairRoutines,
        coreRoutines,
        logs,
        photos,
        conditions
      );

      const ctx = HairAIContextBuilder.buildContext(
        products,
        hairRoutines,
        coreRoutines,
        logs,
        photos,
        conditions,
        analytics
      );

      return ok(ctx);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to build AI context', { originalError: error }));
    }
  }

  async getRecommendations(userId: string): Promise<Result<HairRecommendation[], AppError>> {
    const ctxRes = await this.getContext(userId);
    if (!ctxRes.success) return ctxRes;

    try {
      const recs = await this.aiService.generateRecommendations(ctxRes.data);
      return ok(recs);
    } catch (error) {
      return err(new AppError('UNKNOWN_ERROR', 'Failed to generate recommendations', { originalError: error }));
    }
  }

  async askCoach(
    userId: string,
    userMessage: string,
    history: HairCoachMessage[] = []
  ): Promise<Result<string, AppError>> {
    const ctxRes = await this.getContext(userId);
    if (!ctxRes.success) return ctxRes;

    try {
      const answer = await this.aiService.askCoach(ctxRes.data, userMessage, history);
      return ok(answer);
    } catch (error) {
      return err(new AppError('UNKNOWN_ERROR', 'Failed to consult AI Hair Coach', { originalError: error }));
    }
  }

  async getWeeklyReview(userId: string): Promise<Result<HairReviewSummary, AppError>> {
    const ctxRes = await this.getContext(userId);
    if (!ctxRes.success) return ctxRes;

    try {
      const review = await this.aiService.generateWeeklyReview(ctxRes.data);
      return ok(review);
    } catch (error) {
      return err(new AppError('UNKNOWN_ERROR', 'Failed to generate weekly review', { originalError: error }));
    }
  }
}

export const hairAIRepository = new HairAIRepository();
