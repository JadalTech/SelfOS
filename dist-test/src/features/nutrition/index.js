"use strict";
/**
 * Nutrition Module Public API Barrel Export
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./types"), exports);
__exportStar(require("./constants/nutrition.constants"), exports);
__exportStar(require("./validation/nutrition.validation"), exports);
__exportStar(require("./engine/nutritionEngine"), exports);
__exportStar(require("./analytics/utils/nutritionAnalytics"), exports);
__exportStar(require("./repository/contracts"), exports);
__exportStar(require("./repository/nutrition.repository"), exports);
__exportStar(require("./mappers/nutrition.mapper"), exports);
__exportStar(require("./hooks/queryKeys"), exports);
__exportStar(require("./hooks/useNutrition"), exports);
// Presentation Layer
__exportStar(require("./presentation/screens"), exports);
__exportStar(require("./presentation/forms"), exports);
__exportStar(require("./presentation/layouts"), exports);
// AI Layer
__exportStar(require("./ai/types"), exports);
__exportStar(require("./ai/providers"), exports);
__exportStar(require("./ai/repository/nutritionAIRepository"), exports);
__exportStar(require("./ai/hooks/useNutritionCoach"), exports);
