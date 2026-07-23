import type { HairAIContext } from '../types/ai.types';

export class PromptBuilder {
  static buildCoachSystemPrompt(ctx: HairAIContext): string {
    return `You are the SelfOS AI Hair Coach. You are an expert personal hair care assistant.
Analyze the user's hair care regimen data provided below and answer questions accurately, concisely, and empathetically.

STRICT GUIDELINES:
1. Base all answers strictly on the user's provided data context.
2. If data is missing or insufficient (e.g. no hair condition logged yet), state that clearly without hallucinating.
3. Keep recommendations actionable, encouraging, and evidence-based.
4. Never suggest medical prescriptions or diagnostic claims.

USER DATA CONTEXT:
- Active Products (${ctx.activeProducts.length}): ${ctx.activeProducts.map((p) => `${p.name} (${p.brand})`).join(', ') || 'None'}
- Active Routines: ${ctx.activeRoutinesCount}
- Completed Wash Logs: ${ctx.completedWashDaysCount}
- Weekly Completion Rate: ${ctx.weeklyCompletionRate}%
- Average Wash Interval: Every ${ctx.avgWashIntervalDays || 3} days
- Current Habit Streak: ${ctx.currentStreak} Days (Longest: ${ctx.longestStreak} Days)
- Progress Photos Documented: ${ctx.photosCount}
- Latest Scalp Health Score: ${ctx.latestConditionScore ? `${ctx.latestConditionScore}/10` : 'Not logged'}
- Scalp Type: ${ctx.latestConditionScalpType || 'Unknown'}
- Top Used Product: ${ctx.topUsedProduct || 'None'}
`;
  }

  static buildRecommendationPrompt(ctx: HairAIContext): string {
    return `Generate 3 personalized, actionable hair care recommendations based on the following context:
${JSON.stringify(ctx, null, 2)}
Return each recommendation focused on consistency, scalp care, or product application.`;
  }

  static buildWeeklyReviewPrompt(ctx: HairAIContext): string {
    return `Generate a concise Weekly Progress Review summary for the user's hair regimen using this data context:
${JSON.stringify(ctx, null, 2)}
Highlight routine consistency, wash frequency, and scalp health trends.`;
  }
}
