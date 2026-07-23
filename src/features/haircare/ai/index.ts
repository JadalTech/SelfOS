/**
 * Haircare AI Submodule Export
 */

export * from './types/ai.types';
export { HairAIContextBuilder } from './utils/contextBuilder';
export { PromptBuilder } from './prompts/promptBuilder';
export { hairAIService, HairAIService, FallbackHeuristicAIProvider } from './services/hairAI.service';
export { hairAIRepository, HairAIRepository } from './repository/hairAIRepository';
export { useHairRecommendations } from './hooks/useHairRecommendations';
export { useAskHairCoach } from './hooks/useAskHairCoach';
export { useWeeklyHairReview } from './hooks/useWeeklyHairReview';
export { ChatMessage } from './components/ChatMessage';
export { RecommendationCard } from './components/RecommendationCard';
export { AICoachCard } from './components/AICoachCard';
export { PromptInput } from './components/PromptInput';
export { EmptyConversation } from './components/EmptyConversation';
export { HairCoachScreen } from './screens/HairCoachScreen';
