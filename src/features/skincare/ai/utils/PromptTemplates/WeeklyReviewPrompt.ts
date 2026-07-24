import type { SkinAIContext } from '../../types/ai.types';

export function getWeeklyReviewPrompt(context: SkinAIContext): string {
  return `Generate a structured weekly review for a user with ${context.userProfile.skinType} skin.
User completed ${context.recentLogsCount} routine logs in the past 30 days.

Provide:
1. Overall Progress Summary
2. Key Routine Highlights
3. Areas Needing Focus
4. Next Week Action Goal`;
}
