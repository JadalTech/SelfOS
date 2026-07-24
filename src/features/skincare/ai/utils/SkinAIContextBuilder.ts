import type {
  SkinAssessment,
  SkincareRoutine,
  SkincareLog,
  SkincareProduct,
  SkinConcern,
} from '../../types';
import type { SkinAIContext } from '../types/ai.types';

export class SkinAIContextBuilder {
  static buildContext(params: {
    assessments: SkinAssessment[];
    routines: SkincareRoutine[];
    logs: SkincareLog[];
    products: SkincareProduct[];
  }): SkinAIContext {
    const { assessments, routines, logs, products } = params;

    const latestAssessment = assessments.length > 0 ? assessments[0] : undefined;

    const skinType = latestAssessment ? latestAssessment.skinType : 'normal';
    const mainConcerns: SkinConcern[] = latestAssessment ? latestAssessment.concerns : [];

    const activeProducts = products.filter((p) => p.isActive);

    return {
      userProfile: {
        skinType,
        mainConcerns,
      },
      latestAssessment,
      activeRoutines: routines,
      recentLogsCount: logs.length,
      activeProducts,
    };
  }
}
