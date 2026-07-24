import type { ISkinAIProvider } from './ISkinAIProvider';
import type { SkinAIContext, SkinRecommendation, SkinWeeklyReview } from '../types/ai.types';

export class MockSkinAIProvider implements ISkinAIProvider {
  readonly name = 'mock';

  async askCoach(question: string, _context: SkinAIContext): Promise<string> {
    return `[Mock AI Response] Thank you for asking: "${question}". For best skincare results, apply sunscreen daily and keep your barrier hydrated. (Note: Consult a board-certified dermatologist for medical conditions).`;
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
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    return fullText;
  }

  async generateRecommendations(
    context: SkinAIContext,
    ruleRecommendations?: SkinRecommendation[]
  ): Promise<SkinRecommendation[]> {
    if (ruleRecommendations && ruleRecommendations.length > 0) {
      return ruleRecommendations.map((r) => ({
        ...r,
        summary: `[Mock AI Enhanced] ${r.summary}`,
      }));
    }

    return [
      {
        id: `rec_mock_${Date.now()}`,
        title: 'Daily Broad-Spectrum Sunscreen',
        summary: 'Apply SPF 30+ daily every morning to protect your skin barrier and prevent hyperpigmentation.',
        targetConcern: 'hyperpigmentation',
        recommendedCategory: 'sunscreen',
        actionableSteps: ['Apply 2 finger-lengths of SPF 30+ every AM', 'Reapply every 2 hours if outdoors'],
        confidenceScore: 0.95,
      },
    ];
  }

  async generateWeeklyReview(context: SkinAIContext): Promise<SkinWeeklyReview> {
    return {
      id: `rev_mock_${Date.now()}`,
      dateRange: 'Past 7 Days',
      summary: `You logged ${context.recentLogsCount} routine executions this week for ${context.userProfile.skinType} skin.`,
      highlights: ['Consistent AM routine completion', 'Active moisturizer usage'],
      areasToImprove: ['Ensure evening cleanser application before bed'],
      scoreChangeLabel: '+0.5 Health Score Improvement',
    };
  }
}
