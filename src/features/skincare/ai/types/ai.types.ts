import type {
  SkinType,
  SkinConcern,
  ProductCategory,
  SkincareProduct,
  SkincareRoutine,
  SkinAssessment,
} from '../../types';

export interface SkinChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  providerName?: string;
}

export interface SkinRecommendation {
  id: string;
  title: string;
  summary: string;
  targetConcern: SkinConcern;
  recommendedCategory?: ProductCategory;
  actionableSteps: string[];
  confidenceScore: number; // 0.0 - 1.0
}

export interface SkinAIContext {
  userProfile: {
    skinType: SkinType;
    mainConcerns: SkinConcern[];
  };
  latestAssessment?: SkinAssessment;
  activeRoutines: SkincareRoutine[];
  recentLogsCount: number;
  activeProducts: SkincareProduct[];
}

export interface SkinWeeklyReview {
  id: string;
  dateRange: string;
  summary: string;
  highlights: string[];
  areasToImprove: string[];
  scoreChangeLabel: string;
}
