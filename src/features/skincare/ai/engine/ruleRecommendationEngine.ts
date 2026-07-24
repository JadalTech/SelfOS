import type { SkinAIContext, SkinRecommendation } from '../types/ai.types';
import { calculateProductExpiry } from '../../engine/skincareEngine';

export class RuleRecommendationEngine {
  static detectRecommendations(context: SkinAIContext): SkinRecommendation[] {
    const recommendations: SkinRecommendation[] = [];

    // 1. Missing Sunscreen Trigger
    const hasSunscreen = context.activeProducts.some((p) => p.category === 'sunscreen');
    if (!hasSunscreen) {
      recommendations.push({
        id: `rec_rule_spf_${Date.now()}`,
        title: 'Daily SPF 30+ Protection Missing',
        summary: 'No active sunscreen found in your vanity. Sunscreen is essential to prevent hyperpigmentation and UV barrier damage.',
        targetConcern: 'aging',
        recommendedCategory: 'sunscreen',
        actionableSteps: [
          'Add a broad-spectrum mineral or chemical sunscreen to your routine',
          'Apply as the final step of your morning routine',
        ],
        confidenceScore: 0.98,
      });
    }

    // 2. Expired Products Trigger
    const expiredProducts = context.activeProducts.filter((p) => {
      const exp = calculateProductExpiry(p.openedDate, p.shelfLifeMonths);
      return exp.isExpired;
    });

    if (expiredProducts.length > 0) {
      const names = expiredProducts.map((p) => p.name).join(', ');
      recommendations.push({
        id: `rec_rule_exp_${Date.now()}`,
        title: 'Expired Product Replacement Alert',
        summary: `The following products have exceeded their safe shelf life: ${names}. Expired actives may cause skin irritation.`,
        targetConcern: 'barrier-damage',
        actionableSteps: [
          'Replace expired products with fresh formulas',
          'Check PAO (Period After Opening) symbols on containers',
        ],
        confidenceScore: 0.95,
      });
    }

    // 3. Low Routine Execution Compliance Trigger
    if (context.recentLogsCount < 4) {
      recommendations.push({
        id: `rec_rule_logs_${Date.now()}`,
        title: 'Boost Routine Consistency',
        summary: 'You logged fewer than 4 routine executions over the past period. Consistency is key for active ingredient efficacy.',
        targetConcern: 'texture',
        actionableSteps: [
          'Set daily morning and evening reminders',
          'Simplify routine steps to maintain daily consistency',
        ],
        confidenceScore: 0.90,
      });
    }

    // 4. Low Barrier Health Score Trigger
    if (context.latestAssessment && context.latestAssessment.barrierHealthScore <= 2) {
      recommendations.push({
        id: `rec_rule_barrier_${Date.now()}`,
        title: 'Focus on Barrier Repair',
        summary: 'Your recent barrier health score indicates compromised lipid resilience. Temporarily pause strong exfoliants.',
        targetConcern: 'barrier-damage',
        recommendedCategory: 'moisturizer',
        actionableSteps: [
          'Use gentle ceramide-rich moisturizers',
          'Pause physical exfoliants and high-strength acids',
        ],
        confidenceScore: 0.95,
      });
    }

    return recommendations;
  }
}
