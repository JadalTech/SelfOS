"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionPromptBuilder = void 0;
class NutritionPromptBuilder {
    static buildSystemPrompt() {
        return `You are the SelfOS Nutrition AI Coach, an expert digital dietitian assistant.
Your goal is to explain daily logs, analyze caloric and macronutrient targets, and offer structured food suggestions.

Operational Safety Guidelines:
1. Provide educational guidance on food, portion sizing, macros, and eating habits.
2. NEVER diagnose medical nutritional deficiencies or write medical therapy diets.
3. ALWAYS include a dietitian safety disclaimer at the end of unstructured advice.
4. Keep recommendations realistic, actionable, and structured.

Core Dietitian Disclaimer:
"Dietitian Disclaimer: Educational advice only. Please consult a registered dietitian or healthcare provider for medical nutritional guidance or diet modifications."`;
    }
    static buildChatPrompt(question, context) {
        return `User Question: "${question}"

Injected Nutrition Context:
- Active Calorie Budget: ${context.dailyGoals.calories} kcal (Consumed: ${context.dailyTotals.calories} kcal)
- Macro Goals: P: ${context.dailyGoals.protein}g, C: ${context.dailyGoals.carbs}g, F: ${context.dailyGoals.fats}g
- Today's Consumed Macros: P: ${context.dailyTotals.protein}g, C: ${context.dailyTotals.carbohydrates}g, F: ${context.dailyTotals.fats}g
- Weekly Logging Streak: ${context.loggingStreak} days
- Consistency Score: ${context.consistencyPercent || 0}%

Answer the question clearly using the context provided above. Suggest whole food adjustments if relevant.`;
    }
    static buildRecommendationsPrompt(context) {
        return `Analyze the user's daily food intake metrics and generate structural recommendations.
    
Injected Nutrition Context:
- Calorie Budget: ${context.dailyGoals.calories} kcal (Consumed: ${context.dailyTotals.calories} kcal)
- Macro Goals: P: ${context.dailyGoals.protein}g, C: ${context.dailyGoals.carbs}g, F: ${context.dailyGoals.fats}g
- Consumed: P: ${context.dailyTotals.protein}g, C: ${context.dailyTotals.carbohydrates}g, F: ${context.dailyTotals.fats}g
- Today's fiber: ${context.dailyTotals.fiber || 0}g, sugar: ${context.dailyTotals.sugar || 0}g

Respond STRICTLY with a valid JSON object matching the schema below. Do not wrap in markdown tags or include conversational commentary.

JSON Schema:
{
  "recommendations": [
    {
      "id": "string (unique ID)",
      "title": "string (clear title)",
      "summary": "string (issue detail)",
      "targetConcern": "string (concern category)",
      "actionableSteps": ["string (step 1)", "string (step 2)"],
      "confidenceScore": number (0.0 to 1.0)
    }
  ]
}`;
    }
    static buildWeeklyReviewPrompt(context) {
        return `Synthesize a weekly summary based on the historical logs.

Injected Context:
- Target calories: ${context.dailyGoals.calories} kcal
- Weekly average calories consumed: ${context.weeklyAverageCalories} kcal
- Logging Streak: ${context.loggingStreak} days
- Weekly Adherence score: ${context.weeklyAdherenceScore} / 10
- Favorite Foods: ${context.favoriteFoods.map((f) => `${f.foodName} (${f.count}x)`).join(', ')}

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
exports.NutritionPromptBuilder = NutritionPromptBuilder;
