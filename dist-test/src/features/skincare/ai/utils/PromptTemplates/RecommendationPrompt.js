"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendationPrompt = getRecommendationPrompt;
function getRecommendationPrompt(context, ruleRecommendations) {
    const ruleSummary = ruleRecommendations
        ? ruleRecommendations.map((r) => `- [${r.targetConcern}] ${r.title}: ${r.summary}`).join('\n')
        : 'No rule triggers detected';
    return `Objective: Enhance and prioritize skincare recommendations for a user with ${context.userProfile.skinType} skin.

Detected Objective Rule Triggers:
${ruleSummary}

Active Products Count: ${context.activeProducts.length}
Recent Logs Count: ${context.recentLogsCount}

Provide actionable, prioritized recommendations explaining why each step benefits their specific skin barrier.`;
}
