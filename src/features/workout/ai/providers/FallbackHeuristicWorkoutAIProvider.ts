/**
 * Local Rules-based Fallback/Heuristic AI Provider
 */

import type { IWorkoutAIProvider } from './IWorkoutAIProvider';
import type { WorkoutAIContext } from '../types/workoutAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';

export class FallbackHeuristicWorkoutAIProvider implements IWorkoutAIProvider {
  readonly name = 'heuristic';

  async askCoach(question: string, context: WorkoutAIContext): Promise<string> {
    const qLower = question.toLowerCase();
    let reply = '';

    if (qLower.includes('overload') || qLower.includes('progress') || qLower.includes('weight')) {
      if (context.recentPersonalRecords.length > 0) {
        const firstPr = context.recentPersonalRecords[0];
        reply = `To apply progressive overload on ${firstPr.exerciseName} (where you recently hit ${firstPr.valueLabel}), try to increase the load by 2.5% to 5% in your next session, or aim to complete 1-2 more reps with your current weight.`;
      } else {
        reply = 'To apply progressive overload, focus on gradually increasing the weight or the number of completed repetitions per set once you can comfortably complete all sets at your current target rep range.';
      }
    } else if (qLower.includes('recovery') || qLower.includes('rest') || qLower.includes('sore')) {
      reply = 'Ensure at least 48 hours of recovery between high-intensity training sessions targeting the same muscle group. Sleep (7-9 hours) and adequate protein intake are essential for muscle repair.';
    } else if (qLower.includes('substitution') || qLower.includes('swap') || qLower.includes('replace')) {
      reply = `Based on your preferred equipment (${context.preferredEquipment.join(', ') || 'bodyweight'}), you can substitute barbell exercises with dumbbells or machine variations to achieve similar muscle activation while protecting joint mechanics.`;
    } else if (qLower.includes('deload')) {
      reply = 'A deload week is recommended every 6-8 weeks of consistent training. Reduce your training volume (sets) by 30-50% and decrease the intensity (weight) by 10-20% to allow joints and the central nervous system to fully recover.';
    } else {
      reply = `Based on your fitness logs, you have completed ${context.weeklyFrequency} workouts this week with a current streak of ${context.workoutStreak} consecutive days. Keep up the consistency and focus on progressive volume trends.`;
    }

    return `${reply}\n\nTrainer Disclaimer: Educational coaching advice only. Consult a physician, certified trainer, or physical therapist before starting any new exercise split or training plan.`;
  }

  async generateRecommendations(context: WorkoutAIContext): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // 1. Inactivity Detection Rule
    if (context.weeklyFrequency === 0) {
      recommendations.push({
        id: 'rec_inactivity_detected',
        title: 'Restart Training Consistency',
        summary: 'No workouts completed yet this week. Ease back in to rebuild consistency.',
        targetConcern: 'Consistency',
        actionableSteps: [
          'Schedule a short 20-minute active recovery or full-body session today.',
          'Focus on a low-intensity, high-compliance starter workout.',
          'Aim to log just one workout to break the friction.'
        ],
        confidenceScore: 0.95,
      });
    }

    // 2. Low Frequency / Consistency Rule
    if (context.targetDaysPerWeek && context.weeklyFrequency < context.targetDaysPerWeek && context.weeklyFrequency > 0) {
      recommendations.push({
        id: 'rec_frequency_low',
        title: 'Meet Target Split Schedule',
        summary: `Your frequency (${context.weeklyFrequency} workouts) is behind your split goal (${context.targetDaysPerWeek} days/week).`,
        targetConcern: 'Consistency',
        actionableSteps: [
          'Review your upcoming calendar days and block out 30 minutes for your next split.',
          'Perform a shortened "express" version of your workout if time is constrained.',
          'Ensure target workouts are logged before the week completes.'
        ],
        confidenceScore: 0.9,
      });
    }

    // 3. Progressive Overload Opportunities Rule
    if (context.personalRecordsCount > 0 && context.recentPersonalRecords.length > 0) {
      const topPr = context.recentPersonalRecords[0];
      recommendations.push({
        id: 'rec_progressive_overload',
        title: 'Apply Progressive Overload',
        summary: `You recently hit a record on ${topPr.exerciseName} (${topPr.valueLabel}). It's time to progress.`,
        targetConcern: 'Progressive Overload',
        actionableSteps: [
          `Increase the working weight on ${topPr.exerciseName} by 2.5% to 5% next session.`,
          `Keep repetitions at the lower end of your target range and work back up.`,
          'Ensure strict form is maintained under the increased resistance.'
        ],
        confidenceScore: 0.85,
      });
    }

    // 4. Excessive Training Frequency Rule (Overtraining risk)
    if (context.weeklyFrequency > 6) {
      recommendations.push({
        id: 'rec_overtraining_risk',
        title: 'Schedule Active Rest Day',
        summary: `You have logged ${context.weeklyFrequency} workouts this week. Overtraining increases injury risk.`,
        targetConcern: 'Recovery',
        actionableSteps: [
          'Dedicate the next 24-48 hours to complete rest or light stretching.',
          'Focus on hydration and protein intake to facilitate muscle repair.',
          'Monitor indicators like sleep quality and persistent joint soreness.'
        ],
        confidenceScore: 0.95,
      });
    }

    // 5. Muscle Group Workload Balance Rule
    const chestWorked = context.muscleWorkloads.some((mw) => mw.muscleGroup === 'chest' && mw.percentage > 0);
    const backWorked = context.muscleWorkloads.some((mw) => mw.muscleGroup === 'back' && mw.percentage > 0);
    const legsWorked = context.muscleWorkloads.some((mw) => (mw.muscleGroup === 'quadriceps' || mw.muscleGroup === 'hamstrings' || mw.muscleGroup === 'glutes') && mw.percentage > 0);

    if (context.weeklyFrequency > 0 && (!chestWorked || !backWorked || !legsWorked)) {
      const missingMuscles: string[] = [];
      if (!chestWorked) missingMuscles.push('Chest');
      if (!backWorked) missingMuscles.push('Back');
      if (!legsWorked) missingMuscles.push('Legs');

      recommendations.push({
        id: 'rec_muscle_imbalance',
        title: 'Balance Muscle Workload',
        summary: `Your logs show zero workout volume for key muscle groups this week: ${missingMuscles.join(', ')}.`,
        targetConcern: 'Balance',
        actionableSteps: [
          `Integrate at least one exercise targeting the ${missingMuscles[0]} in your next session.`,
          'Ensure your weekly split plan allocates workload evenly to prevent muscular imbalances.',
          'Incorporate compound movements (e.g. squats, rows, presses) to target multiple chains simultaneously.'
        ],
        confidenceScore: 0.8,
      });
    }

    // Default recommendations if no rules triggered
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'rec_fitness_maintenance',
        title: 'Maintain Training Volume',
        summary: 'Your training frequency and muscle group workload distributions are balanced and stable.',
        targetConcern: 'Balance',
        actionableSteps: [
          'Continue executing your split plan and logging sets consistently.',
          'Track rest intervals to ensure optimal heart rate and muscle recovery.',
          'Ensure progressive overload parameters are applied systematically.'
        ],
        confidenceScore: 0.75,
      });
    }

    return recommendations;
  }

  async generateWeeklyReview(context: WorkoutAIContext): Promise<AIWeeklyReview> {
    const totalVolume = context.totalVolumeTrend.reduce((sum, pt) => sum + pt.volume, 0);

    const highlights: string[] = [];
    const areasToImprove: string[] = [];
    let summary = '';

    if (context.weeklyFrequency >= (context.targetDaysPerWeek || 3)) {
      summary = `Excellent training discipline this week! You logged ${context.weeklyFrequency} workouts and maintained a solid routine.`;
      highlights.push(`Successfully completed target training split frequency (${context.weeklyFrequency} sessions).`);
    } else if (context.weeklyFrequency === 0) {
      summary = 'No workouts were completed this week. Life happens, but let\'s look to re-establish consistency in the upcoming week.';
      areasToImprove.push('Break training friction by scheduling a light 15-minute home workout.');
    } else {
      summary = `You logged ${context.weeklyFrequency} workouts this week, slightly behind your target split frequency.`;
      areasToImprove.push('Allocate locked calendar times for training sessions to minimize missed workouts.');
    }

    if (context.personalRecordsCount > 0) {
      highlights.push(`Set ${context.personalRecordsCount} new personal achievement records.`);
    }

    if (context.workoutStreak > 3) {
      highlights.push(`Maintained a consecutive workout streak of ${context.workoutStreak} days.`);
    }

    if (context.weeklyFrequency > 6) {
      areasToImprove.push('Enforce at least 1-2 full rest days to prevent physical fatigue and CNS overtraining.');
    }

    if (highlights.length === 0) {
      highlights.push('Maintained base active movements and workout log entries.');
    }
    if (areasToImprove.length === 0) {
      areasToImprove.push('Introduce progressive overload incrementally by adding reps or weight.');
    }

    return {
      id: `review_${Date.now()}`,
      dateRange: 'Past 7 Days',
      summary,
      highlights,
      areasToImprove,
      scoreChangeLabel: totalVolume > 0 ? `+${Math.round(totalVolume)}kg total volume logged` : '0kg volume logged',
    };
  }
}
