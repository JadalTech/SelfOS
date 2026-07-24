import type { ISkinAIProvider } from './ISkinAIProvider';
import type { SkinAIContext, SkinRecommendation, SkinWeeklyReview } from '../types/ai.types';

export class FallbackHeuristicSkinAIProvider implements ISkinAIProvider {
  readonly name = 'fallback-heuristic';

  async askCoach(question: string, context: SkinAIContext): Promise<string> {
    const qLower = question.toLowerCase();

    let response = '';

    if (qLower.includes('sunscreen') || qLower.includes('spf')) {
      response =
        'Broad-spectrum sunscreen (SPF 30+) is the single most essential step in your skincare routine. ' +
        'Apply it every morning as the final step before makeup, and reapply every 2 hours during direct outdoor exposure.';
    } else if (qLower.includes('acne') || qLower.includes('breakout')) {
      response =
        'For acne-prone skin, look for ingredients like Salicylic Acid (BHA) to unclog pores, or Niacinamide to calm inflammation. ' +
        'Avoid over-cleansing or harsh scrubbing, which can damage your skin barrier and trigger excess sebum.';
    } else if (qLower.includes('dry') || qLower.includes('hydration') || qLower.includes('barrier')) {
      response =
        'To repair dryness or a damaged skin barrier, simplify your routine: use a gentle hydrating cleanser, a Hyaluronic Acid serum on damp skin, ' +
        'and a rich moisturizer containing Ceramides or Fatty Acids.';
    } else if (qLower.includes('retinol') || qLower.includes('retinoid') || qLower.includes('aging')) {
      response =
        'Retinoids stimulate collagen production and speed cell turnover. Introduce them gradually (1-2 nights a week initially), ' +
        'always apply to dry skin at night, and never skip morning sunscreen.';
    } else {
      const skinType = context.userProfile.skinType || 'your';
      response =
        `Based on your ${skinType} skin profile, keep your routine consistent with a gentle cleanser, targeted serum, moisturizer, and daily SPF. ` +
        'Introduce active ingredients one at a time and allow 4-6 weeks to observe improvements.';
    }

    return `${response} (Medical Disclaimer: SelfOS AI provides educational guidance only. Please consult a board-certified dermatologist for medical skin conditions.)`;
  }

  async streamResponse(
    question: string,
    context: SkinAIContext,
    onChunk: (chunkText: string) => void
  ): Promise<string> {
    const fullText = await this.askCoach(question, context);
    const words = fullText.split(' ');
    let current = '';

    for (const word of words) {
      current += (current ? ' ' : '') + word;
      onChunk(current);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    return fullText;
  }

  async generateRecommendations(
    context: SkinAIContext,
    ruleRecommendations?: SkinRecommendation[]
  ): Promise<SkinRecommendation[]> {
    if (ruleRecommendations && ruleRecommendations.length > 0) {
      return ruleRecommendations;
    }

    const recs: SkinRecommendation[] = [];

    const hasSunscreen = context.activeProducts.some((p) => p.category === 'sunscreen');
    if (!hasSunscreen) {
      recs.push({
        id: `rec_spf_${Date.now()}`,
        title: 'Add Daily Sunscreen (SPF 30+)',
        summary: 'Protect your skin barrier and prevent hyperpigmentation by adding daily SPF protection.',
        targetConcern: 'aging',
        recommendedCategory: 'sunscreen',
        actionableSteps: [
          'Choose a broad-spectrum mineral or chemical sunscreen',
          'Apply 2 finger-lengths of product every morning after moisturizer',
        ],
        confidenceScore: 0.95,
      });
    }

    const hasMoisturizer = context.activeProducts.some((p) => p.category === 'moisturizer');
    if (!hasMoisturizer) {
      recs.push({
        id: `rec_moist_${Date.now()}`,
        title: 'Incorporate Barrier Moisturizer',
        summary: 'Lock in hydration and support lipid barrier repair.',
        targetConcern: 'dryness',
        recommendedCategory: 'moisturizer',
        actionableSteps: [
          'Apply morning and evening after serum',
          'Look for ceramides, glycerin, or hyaluronic acid',
        ],
        confidenceScore: 0.90,
      });
    }

    return recs;
  }

  async generateWeeklyReview(context: SkinAIContext): Promise<SkinWeeklyReview> {
    const logs = context.recentLogsCount || 0;
    const skinType = context.userProfile.skinType || 'balanced';

    return {
      id: `rev_${Date.now()}`,
      dateRange: 'Past 7 Days',
      summary: `In the past week, you completed ${logs} routine executions for ${skinType} skin.`,
      highlights: [
        'Maintained active skincare routine steps',
        'Consistently tracked products in vanity',
      ],
      areasToImprove: [
        'Aim for 100% daily morning sunscreen compliance',
        'Check for expiring products in your vanity',
      ],
      scoreChangeLabel: logs > 10 ? '+0.4 Score Improvement' : 'Stable Health Score',
    };
  }
}
