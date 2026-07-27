import type { ISleepAIProvider } from './ISleepAIProvider';
import type { SleepAIContext, SleepRecommendation, SleepWeeklyReview } from '../types/sleepAI.types';

export class FallbackHeuristicSleepAIProvider implements ISleepAIProvider {
  readonly name = 'heuristic';

  async askCoach(question: string, context: SleepAIContext): Promise<string> {
    const q = question.toLowerCase();

    // Safety check first
    if (q.includes('diagnose') || q.includes('apnea') || q.includes('insomnia') || q.includes('disorder') || q.includes('medical') || q.includes('pill') || q.includes('drug')) {
      return "As your sleep coach, I can only provide behavioral recommendations and educational sleep hygiene tips. For clinical questions, chronic insomnia, or potential sleep disorders like sleep apnea, please consult a qualified physician or board-certified sleep specialist.";
    }

    if (q.includes('debt') || q.includes('deficit') || q.includes('tired')) {
      return `Your current sleep debt is ${context.sleepDebt} minutes. To reduce this debt, try to go to bed 15-30 minutes earlier rather than sleeping in excessively on weekends, which disrupts your circadian rhythm. Focus on consistency!`;
    }

    if (q.includes('consistent') || q.includes('schedule') || q.includes('weekend')) {
      const socialJetlag = this.detectSocialJetlag(context);
      return `Your schedule consistency is currently at ${context.consistencyScore}%. ${
        socialJetlag
          ? "I noticed a significant shift between your weekday and weekend sleep times (Social Jetlag). Establishing a bedtime within 30 minutes of your weekday average will improve consistency."
          : "You have a solid schedule alignment. Keep maintaining a regular bedtime to lock in your body's biological clock."
      }`;
    }

    if (q.includes('quality') || q.includes('restless') || q.includes('deep')) {
      return `Your average sleep quality is ${context.weeklyAverages.averageQualityScore.toFixed(1)}/10. To improve quality, avoid caffeine within 8 hours of bedtime, limit blue light exposure (screens) for 1 hour before sleep, and keep your bedroom cool (around 65-68°F / 18-20°C).`;
    }

    if (q.includes('recovery') || q.includes('energy')) {
      return `Your current recovery score is ${context.recoveryScore}%. Biological recovery is computed from sleep duration, perceived quality, and bedtime consistency. Repaying sleep debt is the fastest way to lift this score.`;
    }

    return "Hi, I am your Sleep Coach! I can help you analyze your sleep debt, schedule consistency, and recovery scores. Ask me anything about wind-down habits, sleep hygiene, or how to optimize your schedule!";
  }

  async generateRecommendations(context: SleepAIContext): Promise<SleepRecommendation[]> {
    const recs: SleepRecommendation[] = [];

    // 1. Chronic Sleep Debt
    if (context.sleepDebt > 180) {
      recs.push({
        id: 'rec_sleep_debt_chronic',
        title: 'Repay Chronic Sleep Debt',
        summary: `Your sleep debt has accumulated to ${context.sleepDebt} minutes. This can lead to daytime cognitive fatigue.`,
        targetConcern: 'Sleep Debt',
        recommendedCategory: 'duration',
        category: 'duration',
        priority: 'high',
        actionableSteps: [
          'Go to bed 20 minutes earlier tonight.',
          'Take a short 15-20 minute power nap before 2:00 PM if needed.',
        ],
        confidenceScore: 0.95,
        actionLabel: 'Log Sleep',
        actionRoute: '/(app)/sleep/log',
      });
    }

    // 2. Declining Recovery
    if (context.recoveryScore < 50) {
      recs.push({
        id: 'rec_recovery_decline',
        title: 'Prioritize Biological Recovery',
        summary: `Your latest recovery score of ${context.recoveryScore}% is low, indicating high physiological strain.`,
        targetConcern: 'Recovery',
        recommendedCategory: 'recovery',
        category: 'recovery',
        priority: 'high',
        actionableSteps: [
          'Implement a 30-minute digital wind-down sequence before bed.',
          'Avoid heavy meals and vigorous workouts within 3 hours of sleeping.',
        ],
        confidenceScore: 0.9,
      });
    }

    // 3. Irregular Weekend Schedules (Social Jetlag)
    if (this.detectSocialJetlag(context)) {
      recs.push({
        id: 'rec_social_jetlag',
        title: 'Minimize Weekend Sleep Shifts',
        summary: 'Your weekend bedtime shifts significantly compared to weekdays. This shifts your biological clock.',
        targetConcern: 'Consistency',
        recommendedCategory: 'consistency',
        category: 'consistency',
        priority: 'medium',
        actionableSteps: [
          'Keep your weekend wake-up time within 60 minutes of weekdays.',
          'Get bright outdoor light within 30 minutes of waking on weekends.',
        ],
        confidenceScore: 0.85,
        actionLabel: 'Adjust Schedule',
        actionRoute: '/(app)/sleep/schedule',
      });
    }

    // 4. Low Consistency Score
    if (context.consistencyScore < 70 && context.consistencyScore > 0) {
      recs.push({
        id: 'rec_improve_consistency',
        title: 'Establish a Rigid Sleep Window',
        summary: `Your sleep schedule consistency is ${context.consistencyScore}%. Circadian biology thrives on repetition.`,
        targetConcern: 'Circadian Rhythm',
        recommendedCategory: 'consistency',
        category: 'consistency',
        priority: 'medium',
        actionableSteps: [
          'Set a target bedtime and stick to it within a 15-minute window.',
          'Use bedroom blackout curtains to block morning light.',
        ],
        confidenceScore: 0.88,
        actionLabel: 'View Schedule',
        actionRoute: '/(app)/sleep/schedule',
      });
    }

    // 5. Oversleeping and Poor Quality
    if (context.weeklyAverages.averageDurationMinutes > 600 && context.weeklyAverages.averageQualityScore < 6) {
      recs.push({
        id: 'rec_oversleep_quality',
        title: 'Optimize Sleep Efficiency',
        summary: 'You are averaging over 10 hours in bed, but report low sleep quality. Your sleep may be fragmented.',
        targetConcern: 'Sleep Efficiency',
        recommendedCategory: 'hygiene',
        category: 'hygiene',
        priority: 'medium',
        actionableSteps: [
          'Reduce total time in bed to 8 hours to increase sleep compression.',
          'Track caffeine and screen time variables to check for sleep interruptions.',
        ],
        confidenceScore: 0.8,
      });
    }

    // 6. Insufficient Data
    if (context.weeklyAverages.averageDurationMinutes === 0) {
      recs.push({
        id: 'rec_insufficient_data',
        title: 'Log Baseline Sleep Data',
        summary: 'We do not have enough recent logs to establish sleep trends and circadian tracking.',
        targetConcern: 'Tracking',
        recommendedCategory: 'hygiene',
        category: 'hygiene',
        priority: 'high',
        actionableSteps: [
          'Log your sleep times for the next 3 consecutive days.',
          'Consider enabling wearable import for automated logs.',
        ],
        confidenceScore: 0.99,
        actionLabel: 'Log Sleep',
        actionRoute: '/(app)/sleep/log',
      });
    }

    // Fallback default recommendations if empty
    if (recs.length === 0) {
      recs.push({
        id: 'rec_default_hygiene',
        title: 'Standard Sleep Hygiene Rules',
        summary: 'Your sleep parameters are healthy. Keep optimizing your biological recovery.',
        targetConcern: 'Hygiene',
        recommendedCategory: 'hygiene',
        category: 'hygiene',
        priority: 'low',
        actionableSteps: [
          'Avoid alcohol within 4 hours of sleeping.',
          'Keep your sleep environment pitch black and quiet.',
        ],
        confidenceScore: 0.95,
      });
    }

    return recs;
  }

  async generateWeeklyReview(context: SleepAIContext): Promise<SleepWeeklyReview> {
    const periodLabel = `Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    let summary = 'You maintained stable sleep metrics this week.';
    const highlights: string[] = [];
    const areasToImprove: string[] = [];
    let healthScore = 7;

    if (context.weeklyAverages.consistencyScore >= 80) {
      highlights.push(`Excellent bedtime consistency of ${context.weeklyAverages.consistencyScore}%.`);
      healthScore += 1;
    } else {
      areasToImprove.push('Improve schedule consistency by aligning weekday and weekend sleep times.');
      healthScore -= 1;
    }

    if (context.sleepDebt < 120) {
      highlights.push(`Sleep debt kept to a low ${context.sleepDebt} minutes.`);
      healthScore += 1;
    } else {
      areasToImprove.push(`Pay down your sleep debt of ${context.sleepDebt}m by sleeping 15-20m earlier.`);
      healthScore -= 1;
    }

    if (context.weeklyAverages.averageQualityScore >= 7.5) {
      highlights.push(`High perceived sleep quality average of ${context.weeklyAverages.averageQualityScore.toFixed(1)}/10.`);
    } else {
      areasToImprove.push('Refine wind-down habits to boost deep sleep recovery.');
    }

    summary = `This week, your sleep duration averaged ${(context.weeklyAverages.averageDurationMinutes / 60).toFixed(1)} hours with a recovery rating of ${context.weeklyAverages.averageRecoveryScore.toFixed(0)}%. ${
      areasToImprove.length > 0
        ? `Focus on: ${areasToImprove[0]}`
        : 'Outstanding adherence to sleep hygiene and biological goals!'
    }`;

    // Clamp healthScore
    healthScore = Math.max(1, Math.min(10, healthScore));

    return {
      id: `review_${Date.now()}`,
      dateRange: periodLabel,
      summary,
      highlights,
      areasToImprove,
      scoreChangeLabel: context.recoveryScore >= 70 ? 'stable' : '-4% vs last week',
      healthScore,
    };
  }

  private detectSocialJetlag(context: SleepAIContext): boolean {
    if (!context.schedule) return false;
    const weekdayBed = context.schedule.weekdayBedtime;
    const weekendBed = context.schedule.weekendBedtime;
    if (!weekdayBed || !weekendBed) return false;

    // Bedtime string HH:MM
    const [wDayH, wDayM] = weekdayBed.split(':').map(Number);
    const [wEndH, wEndM] = weekendBed.split(':').map(Number);

    const weekdayMins = wDayH * 60 + wDayM;
    const weekendMins = wEndH * 60 + wEndM;

    let diff = Math.abs(weekdayMins - weekendMins);
    // Wrap around 24 hours
    if (diff > 720) {
      diff = 1440 - diff;
    }

    return diff > 90; // bedtime shift is greater than 1.5 hours
  }
}
