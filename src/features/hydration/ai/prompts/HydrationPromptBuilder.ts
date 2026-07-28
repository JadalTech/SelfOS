import {
  DailyCoachPrompt,
  WeeklySummaryPrompt,
  MonthlySummaryPrompt,
  GoalReviewPrompt,
  ReminderOptimizationPrompt,
  PredictionPrompt,
  HabitAnalysisPrompt,
  HydrationScorePrompt,
  DrinkQualityPrompt,
  MotivationPrompt,
} from './HydrationPrompts';
import type { HydrationAIContext } from '../types/hydrationAI.types';

export class HydrationPromptBuilder {
  static buildDailyCoachPrompt(context: HydrationAIContext): string {
    return `
${DailyCoachPrompt}
Context:
- Consumed: ${context.consumedML} mL
- Goal: ${context.goalML} mL
- Remaining: ${context.remainingML} mL
- Score: ${context.hydrationScore}/10
- Streak: ${context.currentStreak} days
- Climate: ${context.climate}
- Activity: ${context.activityLevel}
- Dominant drink: ${Object.keys(context.drinkTypeBreakdown)[0] || 'water'}

Provide a JSON response complying with the following structure:
{
  "text": "Your coaching advice here",
  "severity": "info" | "warning" | "critical",
  "suggestedML": 250
}
`;
  }

  static buildPredictionPrompt(context: HydrationAIContext): string {
    return `
${PredictionPrompt}
Context:
- Consumed: ${context.consumedML} mL
- Goal: ${context.goalML} mL
- Streak: ${context.currentStreak} days
- Average size: ${context.averageDrinkSize} mL
- Peak hour: ${context.peakHour}

Provide a JSON response complying with the following structure:
{
  "expectedFinalIntakeML": number,
  "goalCompletionProbability": number,
  "expectedNextDrinkTime": "HH:mm" | null,
  "riskScore": number
}
`;
  }

  static buildScorePrompt(context: HydrationAIContext): string {
    return `
${HydrationScorePrompt}
Context:
- Overall Score: ${context.hydrationScore}/10
- Streak: ${context.currentStreak} days
- Averages: ${context.averageDrinkSize} mL

Provide JSON:
{
  "timing": number,
  "consistency": number,
  "goalAchievement": number,
  "drinkDistribution": number,
  "hydrationQuality": number
}
`;
  }
}
