import type { SleepAIContext } from '../types/sleepAI.types';

export class SleepPromptBuilder {
  /**
   * High-level coaching persona rules.
   */
  static buildSystemPrompt(): string {
    return `You are Antigravity Sleep Coach, a professional sleep science expert and biological recovery guide.
Your goal is to help the user optimize their sleep duration, quality, schedule consistency, and biological recovery score.
Adhere strictly to the following coaching guidelines:
- Promote healthy sleep hygiene habits (wind-down routines, environment adjustments, light management).
- Emphasize the importance of schedule consistency (going to bed and waking up at the same time daily).
- Help users understand their sleep debt and recovery ratings.
- Frame all guidance in a positive, encouraging, actionable, and educational tone.`;
  }

  /**
   * Embeds general sleep safety rules, disclaimers, and restriction on diagnostics.
   */
  static buildSafetySection(): string {
    return `### Safety & Medical Disclaimer Rules:
- You are an educational AI coach. You are NOT a doctor, medical professional, or clinical therapist.
- NEVER diagnose any illness, clinical sleep disorder (e.g., chronic insomnia, sleep apnea, narcolepsy), or medical condition.
- NEVER suggest clinical treatments, prescription sleep aids, or medical interventions.
- If the user mentions chronic fatigue, physical pain, severe insomnia, breathing issues, or clinical symptoms, advise them to consult a qualified physician or board-certified sleep specialist.
- Keep all recommendations non-clinical, behavioral, and safe.`;
  }

  /**
   * Generates a serialized JSON string representing the simplified sleep context.
   */
  static buildContextSection(context: SleepAIContext): string {
    const todayStr = context.todaySleep
      ? `Today's Sleep: Duration ${context.todaySleep.durationMinutes}m, Quality ${context.todaySleep.qualityRating}/10, Bedtime ${context.todaySleep.bedtimeFormatted}, Wake-up ${context.todaySleep.wakeTimeFormatted}`
      : 'Today\'s Sleep: Not logged yet';

    const scheduleStr = context.schedule
      ? `Active Schedule: Target Duration ${context.schedule.targetDurationMinutes}m, Weekday ${context.schedule.weekdayBedtime}-${context.schedule.weekdayWakeTime}, Weekend ${context.schedule.weekendBedtime}-${context.schedule.weekendWakeTime}`
      : 'Active Schedule: None set';

    const goalsStr = context.recentGoals.length > 0
      ? context.recentGoals.map((g) => `- Goal Category: ${g.category}, Target: ${g.targetValue}${g.targetTime ? ` at ${g.targetTime}` : ''}, Active: ${g.isActive}`).join('\n')
      : 'Goals: None active';

    return `### User Sleep Context Metrics:
- ${todayStr}
- Weekly Averages: Duration ${(context.weeklyAverages.averageDurationMinutes / 60).toFixed(1)}h, Quality ${context.weeklyAverages.averageQualityScore.toFixed(1)}/10, Recovery ${context.weeklyAverages.averageRecoveryScore.toFixed(1)}%, Consistency ${context.weeklyAverages.consistencyScore}%
- Monthly Averages: Duration ${(context.monthlyAverages.averageDurationMinutes / 60).toFixed(1)}h, Quality ${context.monthlyAverages.averageQualityScore.toFixed(1)}/10, Recovery ${context.monthlyAverages.averageRecoveryScore.toFixed(1)}%, Consistency ${context.monthlyAverages.consistencyScore}%
- Current Sleep Debt: ${context.sleepDebt} minutes
- Current Recovery Rating: ${context.recoveryScore}%
- Bedtime Trend: ${context.bedtimeTrend}
- Wake-up Trend: ${context.wakeUpTrend}
- Preferred Sleep Duration: ${(context.preferredSleepDuration / 60).toFixed(1)}h
- ${scheduleStr}
- Active Goals:
${goalsStr}
${context.recentNotesSummary ? `- Recent Sleep Journal Observations: "${context.recentNotesSummary}"` : ''}`;
  }

  /**
   * Binds system, context, safety, and user question for general Chat Q&A.
   */
  static buildChatPrompt(question: string, context: SleepAIContext): string {
    return `${this.buildSystemPrompt()}

${this.buildSafetySection()}

${this.buildContextSection(context)}

### User Question:
"${question}"

Provide a concise, direct, helpful response in markdown format. Keep it under 200 words. Keep the tone conversational and educational.`;
  }

  /**
   * Instructs provider to return a formatted JSON block containing structured recommendations.
   */
  static buildRecommendationsPrompt(context: SleepAIContext): string {
    return `${this.buildSystemPrompt()}

${this.buildSafetySection()}

${this.buildContextSection(context)}

### Output Instruction:
Generate 2 to 3 personalized, highly actionable sleep recommendations based on the user's metrics.
Return EXACTLY a JSON object matching the schema below. Do not wrap in markdown blocks, do not include any text before or after the JSON.

JSON Schema:
{
  "recommendations": [
    {
      "id": "string (unique identifier like 'rec_bedtime_shift')",
      "title": "string (short actionable headline)",
      "summary": "string (1-2 sentences explaining why based on their metrics)",
      "targetConcern": "string (e.g. 'Sleep Debt', 'Consistency', 'Wind-down')",
      "recommendedCategory": "string ('duration' | 'hygiene' | 'consistency' | 'recovery' | 'schedule')",
      "category": "string ('duration' | 'hygiene' | 'consistency' | 'recovery' | 'schedule')",
      "priority": "string ('low' | 'medium' | 'high')",
      "actionableSteps": ["string (step 1)", "string (step 2)"],
      "confidenceScore": number (between 0.0 and 1.0),
      "actionLabel": "string (optional navigation trigger like 'Adjust Schedule')",
      "actionRoute": "string (optional route path like '/(app)/sleep/schedule')"
    }
  ]
}`;
  }

  /**
   * Formulates prompts for structured JSON weekly analysis.
   */
  static buildWeeklyReviewPrompt(context: SleepAIContext): string {
    return `${this.buildSystemPrompt()}

${this.buildSafetySection()}

${this.buildContextSection(context)}

### Output Instruction:
Generate a weekly sleep review analysis.
Return EXACTLY a JSON object matching the schema below. Do not wrap in markdown blocks, do not include any text before or after the JSON.

JSON Schema:
{
  "id": "string (unique identifier)",
  "dateRange": "string (e.g. 'Jul 21 - Jul 27')",
  "summary": "string (2-3 sentences summarizing their weekly adherence and recovery trends)",
  "highlights": ["string (key observation 1)", "string (key observation 2)"],
  "areasToImprove": ["string (actionable advice 1)", "string (actionable advice 2)"],
  "scoreChangeLabel": "string (e.g. '+5% vs last week' or 'stable')",
  "healthScore": number (calculated sleep score rating between 1 and 10 based on consistency and quality)
}`;
  }

  /**
   * Advises adjustments for unrealistic goal targets.
   */
  static buildGoalReviewPrompt(goals: any[], context: SleepAIContext): string {
    const goalsStr = goals.map((g) => `- Category: ${g.category}, Target: ${g.targetValue}, Active: ${g.isActive}`).join('\n');
    return `${this.buildSystemPrompt()}

${this.buildSafetySection()}

${this.buildContextSection(context)}

### Current Goals to Review:
${goalsStr}

Provide educational advice on whether these goals are realistic given their recent sleep duration and recovery trends, and suggest adjustments if appropriate. Keep it concise.`;
  }
}
