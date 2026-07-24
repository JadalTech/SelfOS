import type { SkinAIContext } from '../../types/ai.types';

export function getChatPrompt(question: string, context: SkinAIContext): string {
  const skinType = context.userProfile.skinType;
  const concerns = context.userProfile.mainConcerns.join(', ') || 'None specified';
  const activeProducts = context.activeProducts
    .map((p) => `- ${p.brand} ${p.name} (${p.category}) [Actives: ${p.keyIngredients.join(', ')}]`)
    .join('\n') || 'No products listed';

  return `User Question: "${question}"

User Context Summary:
- Skin Type: ${skinType}
- Target Concerns: ${concerns}
- Active Vanity Products:
${activeProducts}
- Recent Routine Executions (30 Days): ${context.recentLogsCount}
${context.latestAssessment ? `- Latest Health Score: ${context.latestAssessment.overallHealthScore}/10 (Hydration: ${context.latestAssessment.hydrationLevel}/5, Barrier: ${context.latestAssessment.barrierHealthScore}/5)` : ''}

Please answer the user's question directly, keeping your response concise, evidence-based, and tailored to their profile.`;
}
