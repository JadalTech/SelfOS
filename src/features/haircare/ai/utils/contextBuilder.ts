import type { Routine } from '@/features/routine/types';
import type {
  HairProduct,
  HairRoutine,
  HairLog,
  HairPhoto,
  HairCondition,
} from '../..';
import type { HairAnalyticsVM } from '../../analytics';
import type { HairAIContext } from '../types/ai.types';

export class HairAIContextBuilder {
  static buildContext(
    products: HairProduct[],
    hairRoutines: HairRoutine[],
    coreRoutines: Routine[],
    logs: HairLog[],
    photos: HairPhoto[],
    conditions: HairCondition[],
    analytics: HairAnalyticsVM
  ): HairAIContext {
    const activeProducts = products
      .filter((p) => p.isActive)
      .map((p) => ({ name: p.name, brand: p.brand, category: p.category }));

    const sortedConditions = [...conditions].sort((a, b) => b.recordDate.localeCompare(a.recordDate));
    const latestCond = sortedConditions[0] || null;

    const topProduct = analytics.productUsage[0];

    return {
      activeProducts,
      activeRoutinesCount: hairRoutines.length,
      completedWashDaysCount: logs.length,
      avgWashIntervalDays: analytics.monthly.avgWashIntervalDays,
      weeklyCompletionRate: analytics.weekly.completionRate,
      photosCount: photos.length,
      latestConditionScore: latestCond ? latestCond.overallHealth : undefined,
      latestConditionScalpType: latestCond ? latestCond.scalpType : undefined,
      topUsedProduct: topProduct ? topProduct.productName : undefined,
      currentStreak: analytics.currentStreak,
      longestStreak: analytics.longestStreak,
    };
  }

  static stringifyContext(ctx: HairAIContext): string {
    return JSON.stringify(ctx, null, 2);
  }
}
