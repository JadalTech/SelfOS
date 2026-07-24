import type { INutritionAIProvider } from './INutritionAIProvider';
import type { NutritionAIContext } from '../types/nutritionAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';

export class FallbackHeuristicNutritionAIProvider implements INutritionAIProvider {
  readonly name = 'heuristic';

  async askCoach(question: string, context: NutritionAIContext): Promise<string> {
    const qLower = question.toLowerCase();
    let reply = '';

    if (qLower.includes('protein')) {
      reply = `To hit your goal of ${context.dailyGoals.protein}g, focus on lean protein sources. Greek yogurt, egg whites, chicken breast, and tofu are highly efficient options that keep fats low.`;
    } else if (qLower.includes('calorie') || qLower.includes('deficit') || qLower.includes('surplus')) {
      const deficit = context.dailyGoals.calories - context.dailyTotals.calories;
      reply = deficit > 0
        ? `You have a remaining calorie budget of ${deficit} kcal today. Focus on nutrient-dense foods to hit your macros.`
        : `You are currently ${Math.abs(deficit)} kcal over your calorie target of ${context.dailyGoals.calories} kcal today. Consider balancing tomorrow's intake with lighter meals.`;
    } else if (qLower.includes('sugar') || qLower.includes('carb')) {
      reply = `Carbohydrates are your body's primary energy source. Focus on complex carbs like oats, quinoa, and brown rice while minimizing refined sugars to maintain steady blood glucose levels.`;
    } else {
      reply = `Based on your nutrition goals (${context.dailyGoals.calories} kcal: ${context.dailyGoals.protein}g P, ${context.dailyGoals.carbs}g C, ${context.dailyGoals.fats}g F), consistency is key. Keep logging meals daily and aim to eat whole foods.`;
    }

    return `${reply}\n\n(Dietitian Disclaimer: Educational advice only. Please consult a registered dietitian or healthcare provider for medical nutritional guidance.)`;
  }

  async generateRecommendations(context: NutritionAIContext): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];
    const totals = context.dailyTotals;
    const goals = context.dailyGoals;

    // 1. Protein Deficiency Rule
    if (totals.protein < goals.protein * 0.8) {
      recommendations.push({
        id: 'rec_low_protein',
        title: 'Boost Lean Protein Intake',
        summary: 'Your protein levels are below 80% of your daily goal.',
        targetConcern: 'Protein Deficiency',
        actionableSteps: [
          'Add 150g Greek yogurt to your breakfast or snacks.',
          'Consider a scoop of whey or plant-based protein powder post-workout.',
          'Include egg whites or chicken breast in your next main meal.',
        ],
        confidenceScore: 0.95,
      });
    }

    // 2. High Sugar Warning Rule
    if (totals.sugar && totals.sugar > 40) {
      recommendations.push({
        id: 'rec_high_sugar',
        title: 'Reduce Refined Sugar',
        summary: 'You have consumed over 40g of sugar today, which can cause energy crashes.',
        targetConcern: 'Sugar Balance',
        actionableSteps: [
          'Replace sweet snacks with whole fresh fruits like berries or apples.',
          'Opt for unsweetened plant milks or yogurts.',
          'Read ingredient labels for hidden high fructose corn syrups.',
        ],
        confidenceScore: 0.9,
      });
    }

    // 3. Low Fiber Warning Rule
    if (totals.fiber !== undefined && totals.fiber < 25) {
      recommendations.push({
        id: 'rec_low_fiber',
        title: 'Increase Dietary Fiber',
        summary: 'Your fiber intake is below the recommended 25g minimum.',
        targetConcern: 'Digestive Health',
        actionableSteps: [
          'Add 1 tbsp of chia seeds or flaxseeds to your morning meals.',
          'Choose whole grains (oats, brown rice) instead of refined white flours.',
          'Include high-fiber vegetables like broccoli, brussels sprouts, or spinach.',
        ],
        confidenceScore: 0.85,
      });
    }

    // Default recommendation if no warnings triggered
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'rec_maintenance',
        title: 'Maintain Consistency',
        summary: 'Your calorie intake and macro distributions are currently stable.',
        targetConcern: 'Overall Adherence',
        actionableSteps: [
          'Continue logging meals and tracking portions.',
          'Ensure hydration limits are met alongside meals.',
          'Focus on meal timing consistency.',
        ],
        confidenceScore: 0.8,
      });
    }

    return recommendations;
  }

  async generateWeeklyReview(context: NutritionAIContext): Promise<AIWeeklyReview> {
    const calorieDeficit = context.dailyGoals.calories - context.weeklyAverageCalories;
    const streak = context.loggingStreak;

    return {
      id: `review_${Date.now()}`,
      dateRange: 'Past 7 Days',
      summary: `Your weekly average calorie intake is ${context.weeklyAverageCalories} kcal against a target of ${context.dailyGoals.calories} kcal. You maintained a logging streak of ${streak} days.`,
      highlights: [
        `Logged meals consistently for ${streak} days straight.`,
        `Average macronutrient distribution: ${context.macroRatios.proteinPercent}% Protein, ${context.macroRatios.carbPercent}% Carbs, ${context.macroRatios.fatPercent}% Fats.`,
      ],
      areasToImprove: [
        calorieDeficit < 0
          ? 'Monitor surplus calories to ensure they match lean bulking goals.'
          : 'Increase portion sizes slightly if weight loss is too rapid.',
        'Ensure micronutrient variety by adding dark leafy greens to main meals.',
      ],
      scoreChangeLabel: 'Consistency Stable',
    };
  }
}
