/**
 * Workout Prompt Templates for Workout AI Coach
 */

import type { WorkoutAIContext } from '../../types/workoutAI.types';

export class WorkoutPromptBuilder {
  static buildSystemPrompt(): string {
    return `You are the SelfOS Workout AI Coach, an expert certified personal trainer assistant.
Your goal is to explain workout performance, analyze training frequency, suggest progressive overload, offer exercise substitutions, and design deload suggestions.

Operational Safety Guidelines:
1. Provide educational coaching advice on fitness splits, exercise form tips, rest intervals, and volume parameters.
2. NEVER prescribe medical rehabilitation plans, physical therapy protocols, or diagnostics for joint/muscle injuries.
3. ALWAYS include a trainer safety disclaimer at the end of unstructured chat advice.
4. Keep recommendations realistic, progressive, and highly structured.

Core Trainer Disclaimer:
"Trainer Disclaimer: Educational coaching advice only. Consult a physician, certified trainer, or physical therapist before starting any new exercise split or training plan."`;
  }

  static buildChatPrompt(question: string, context: WorkoutAIContext): string {
    const prsList = context.recentPersonalRecords.length > 0
      ? context.recentPersonalRecords.map((pr) => `- ${pr.exerciseName}: ${pr.valueLabel} (${pr.typeLabel})`).join('\n')
      : 'No recent records logged yet.';

    const workloads = context.muscleWorkloads.length > 0
      ? context.muscleWorkloads.map((mw) => `- ${mw.muscleGroup}: ${mw.percentage}%`).join('\n')
      : 'No workload logs available.';

    return `User Question: "${question}"

Injected Workout Context:
- Active Split Plan: ${context.activePlanName || 'None/Flexible'}
- Target Frequency: ${context.targetDaysPerWeek ? `${context.targetDaysPerWeek} days/week` : 'Flexible'}
- Current Streak: ${context.workoutStreak} consecutive workout days
- Weekly Frequency: ${context.weeklyFrequency} workouts logged this week
- Personal Records Count: ${context.personalRecordsCount} achievements
- Recent Personal Records:
${prsList}
- Muscle Workload Ratios:
${workloads}
- Preferred Equipment: ${context.preferredEquipment.join(', ') || 'None/Bodyweight'}
- User Training Goal: ${context.userGoal || 'General Strength'}

Answer the question clearly using the fitness context above. Suggest exercise adjustments, volume progressions, or safety tips if relevant.`;
  }

  static buildRecommendationsPrompt(context: WorkoutAIContext): string {
    const workloads = context.muscleWorkloads.map((mw) => `- ${mw.muscleGroup}: ${mw.percentage}%`).join('\n');
    return `Analyze the user's workout metrics and generate structural recommendations for progressive overload, recovery, or consistency.

Injected Workout Context:
- Streak: ${context.workoutStreak} days
- Weekly frequency: ${context.weeklyFrequency} (Target: ${context.targetDaysPerWeek || 'Flexible'})
- PR Achievements: ${context.personalRecordsCount}
- Preferred Equipment: ${context.preferredEquipment.join(', ')}
- Muscle Workload:
${workloads}

Respond STRICTLY with a valid JSON object matching the schema below. Do not wrap in markdown tags or include conversational commentary.

JSON Schema:
{
  "recommendations": [
    {
      "id": "string (unique ID)",
      "title": "string (clear title)",
      "summary": "string (issue detail)",
      "targetConcern": "string (Progressive Overload | Recovery | Consistency | Balance)",
      "actionableSteps": ["string (step 1)", "string (step 2)"],
      "confidenceScore": number (0.0 to 1.0)
    }
  ]
}`;
  }

  static buildWeeklyReviewPrompt(context: WorkoutAIContext): string {
    const volumeTrendList = context.totalVolumeTrend.map((t) => `${t.date}: ${t.volume}kg`).join(', ');
    return `Synthesize a weekly training summary based on the historical logs.

Injected Context:
- Weekly workouts logged: ${context.weeklyFrequency} (Target: ${context.targetDaysPerWeek || 'Flexible'})
- Active plan: ${context.activePlanName || 'Flexible'}
- Workout Streak: ${context.workoutStreak} days
- Volume Trend: ${volumeTrendList || 'No logs this week'}
- Recent PRs: ${context.recentPersonalRecords.map((r) => r.exerciseName).join(', ') || 'None'}

Respond STRICTLY with a valid JSON object matching the schema below. Do not wrap in markdown tags or include conversational commentary.

JSON Schema:
{
  "id": "string",
  "dateRange": "string",
  "summary": "string",
  "highlights": ["string", "string"],
  "areasToImprove": ["string", "string"],
  "scoreChangeLabel": "string"
}`;
  }
}
