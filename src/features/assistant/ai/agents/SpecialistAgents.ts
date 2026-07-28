/**
 * Expanded Specialist Domain Coach Agents
 * SelfOS v2.0.0 — Batch 13C
 */

import { agentRegistry, type IAssistantAgent, type AgentCapability } from '../registry/AgentRegistry';
import type { AssistantContext } from '../../domain/assistant.types';

// Helper to construct capabilities
function createCapability(name: string, domain: string, priority = 1): AgentCapability {
  return {
    agentId: `agent_${name.toLowerCase()}`,
    name,
    version: '1.0.0',
    supportedIntents: [`ask_${domain}`],
    supportedHealthDomains: [domain],
    executionCost: 'low',
    priority,
  };
}

export class NutritionCoachAgent implements IAssistantAgent {
  readonly capability = createCapability('NutritionCoachAgent', 'nutrition', 2);
  async execute(): Promise<string> {
    return 'NutritionCoachAgent: Ensure balanced macronutrients and optimal caloric distribution.';
  }
}

export class WorkoutCoachAgent implements IAssistantAgent {
  readonly capability = createCapability('WorkoutCoachAgent', 'workout', 2);
  async execute(): Promise<string> {
    return 'WorkoutCoachAgent: Maintain Progressive Overload while managing recovery periods.';
  }
}

export class SleepCoachAgent implements IAssistantAgent {
  readonly capability = createCapability('SleepCoachAgent', 'sleep', 2);
  async execute(): Promise<string> {
    return 'SleepCoachAgent: Optimize sleep window consistency to minimize sleep debt.';
  }
}

export class HydrationCoachAgent implements IAssistantAgent {
  readonly capability = createCapability('HydrationCoachAgent', 'hydration', 2);
  async execute(): Promise<string> {
    return 'HydrationCoachAgent: Drink 250mL water every 2 hours to maintain target hydration index.';
  }
}

export class ReviewAgent implements IAssistantAgent {
  readonly capability = createCapability('ReviewAgent', 'review', 1);
  async execute(): Promise<string> {
    return 'ReviewAgent: Compiling daily health achievements and focus areas.';
  }
}

// Auto-register domain agents
agentRegistry.register(new NutritionCoachAgent());
agentRegistry.register(new WorkoutCoachAgent());
agentRegistry.register(new SleepCoachAgent());
agentRegistry.register(new HydrationCoachAgent());
agentRegistry.register(new ReviewAgent());
