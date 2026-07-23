import type {
  HairAIContext,
  HairRecommendation,
  HairCoachMessage,
  HairReviewSummary,
} from '../types/ai.types';
import { PromptBuilder } from '../prompts/promptBuilder';

export interface HairAIProvider {
  ask(systemPrompt: string, userMessage: string): Promise<string>;
}

export class FallbackHeuristicAIProvider implements HairAIProvider {
  async ask(systemPrompt: string, userMessage: string): Promise<string> {
    const q = userMessage.toLowerCase();

    if (q.includes('improve') || q.includes('progress') || q.includes('doing')) {
      return "Based on your logged data, keeping a steady wash schedule and documenting your scalp health every 1-2 weeks is the best way to track improvement. Your current habit streak and wash frequency show great potential!";
    }

    if (q.includes('product') || q.includes('shampoo') || q.includes('oil')) {
      return "Your active products catalog is saved in your regimen. For best results, rotate treatment products as scheduled and ensure your scalp gets proper hydration after clarifying washes.";
    }

    if (q.includes('wash') || q.includes('frequency') || q.includes('often')) {
      return "Maintaining an average wash interval of 3 to 4 days helps prevent sebum buildup while preserving your scalp's natural lipid barrier.";
    }

    return "I am your AI Hair Coach! I can help you analyze wash consistency, track scalp condition trends, and maximize your product regimen. Feel free to ask about your streak, wash frequency, or recommendations!";
  }
}

export class HairAIService {
  constructor(private readonly provider: HairAIProvider = new FallbackHeuristicAIProvider()) {}

  async generateRecommendations(ctx: HairAIContext): Promise<HairRecommendation[]> {
    const recs: HairRecommendation[] = [];

    // Rule 1: Consistency / Streak
    if (ctx.currentStreak < 2) {
      recs.push({
        id: 'rec_streak',
        title: 'Maintain Routine Consistency',
        category: 'consistency',
        priority: 'high',
        description: 'You skipped recent scheduled routines. Completing routines on schedule builds habit momentum.',
        actionLabel: 'View Routines',
        actionRoute: '/(app)/haircare/routines',
      });
    } else {
      recs.push({
        id: 'rec_streak_great',
        title: 'Outstanding Streak Momentum',
        category: 'consistency',
        priority: 'low',
        description: `You are on a ${ctx.currentStreak}-day routine streak! Keep executing your planned wash days.`,
      });
    }

    // Rule 2: Wash Frequency
    if (ctx.avgWashIntervalDays > 5) {
      recs.push({
        id: 'rec_frequency',
        title: 'Shorten Wash Interval',
        category: 'routine',
        priority: 'medium',
        description: `Your average wash interval is ${ctx.avgWashIntervalDays} days. Consider washing every 3-4 days to prevent scalp buildup.`,
        actionLabel: 'Check Wash Days',
        actionRoute: '/(app)/haircare/routines',
      });
    }

    // Rule 3: Scalp Assessment
    if (!ctx.latestConditionScore) {
      recs.push({
        id: 'rec_condition',
        title: 'Log Scalp Health Self-Assessment',
        category: 'condition',
        priority: 'high',
        description: 'You haven\'t logged a scalp condition assessment. Log shedding, oiliness, and itchiness to track trends.',
        actionLabel: 'Log Assessment',
        actionRoute: '/(app)/haircare/condition/new',
      });
    }

    // Rule 4: Progress Photo
    if (ctx.photosCount === 0) {
      recs.push({
        id: 'rec_photo',
        title: 'Capture Baseline Progress Photo',
        category: 'routine',
        priority: 'medium',
        description: 'Document your crown view baseline photo to visually measure growth over time.',
        actionLabel: 'Upload Photo',
        actionRoute: '/(app)/haircare/timeline',
      });
    }

    // Rule 5: Top Product Usage
    if (ctx.activeProducts.length > 0 && !ctx.topUsedProduct) {
      recs.push({
        id: 'rec_product',
        title: 'Link Products to Wash Days',
        category: 'product',
        priority: 'low',
        description: 'Tag products when completing wash day logs to track application rankings.',
      });
    }

    return recs;
  }

  async askCoach(
    ctx: HairAIContext,
    userMessage: string,
    history: HairCoachMessage[] = []
  ): Promise<string> {
    const systemPrompt = PromptBuilder.buildCoachSystemPrompt(ctx);
    return await this.provider.ask(systemPrompt, userMessage);
  }

  async generateWeeklyReview(ctx: HairAIContext): Promise<HairReviewSummary> {
    const periodLabel = `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    const headline = ctx.weeklyCompletionRate >= 70
      ? 'Exceptional Regimen Adherence & Healthy Consistency!'
      : 'Opportunity to Improve Wash Day Habit Consistency.';

    const keyObservations = [
      `Weekly routine completion rate reached ${ctx.weeklyCompletionRate}%.`,
      `Average wash interval is currently every ${ctx.avgWashIntervalDays || 3} days.`,
      `Current active habit streak stands at ${ctx.currentStreak} days.`,
    ];

    const actionableAdvice = [
      'Maintain steady treatment schedules on your designated wash days.',
      'Log hair and scalp conditions weekly to catch shedding or dryness early.',
      'Take monthly crown progress photos to verify growth density.',
    ];

    return {
      title: 'Weekly Regimen Review',
      periodLabel,
      headline,
      keyObservations,
      actionableAdvice,
      healthScore: ctx.latestConditionScore || 8,
    };
  }
}

export const hairAIService = new HairAIService();
