/**
 * Specialist Coach Agents
 * SelfOS v2.0.0 — Batch 13A
 */

import type { IAssistantAgent, AgentCapability } from '../registry/AgentRegistry';
import type { AssistantContext } from '../../domain/assistant.types';
import { agentRegistry } from '../registry/AgentRegistry';

function createCap(name: string): AgentCapability {
  return {
    agentId: `agent_${name.toLowerCase()}`,
    name,
    version: '1.0.0',
    supportedIntents: ['ask_health'],
    supportedHealthDomains: ['health'],
    executionCost: 'low',
    priority: 1,
  };
}

export class HealthCoachAgent implements IAssistantAgent {
  readonly capability = createCap('HealthCoachAgent');
  async execute(context: AssistantContext): Promise<string> {
    return `HealthCoachAgent response: Let's optimize routines. Current index score is ${context.healthScore}/10.`;
  }
}

export class RoutineCoachAgent implements IAssistantAgent {
  readonly capability = createCap('RoutineCoachAgent');
  async execute(): Promise<string> {
    return 'RoutineCoachAgent response: Try maintaining your standard routines.';
  }
}

export class GoalCoachAgent implements IAssistantAgent {
  readonly capability = createCap('GoalCoachAgent');
  async execute(): Promise<string> {
    return 'GoalCoachAgent response: Lets outline your training targets.';
  }
}

export class InsightExplainerAgent implements IAssistantAgent {
  readonly capability = createCap('InsightExplainerAgent');
  async execute(): Promise<string> {
    return 'InsightExplainerAgent response: Let me explain sleep quality correlations.';
  }
}

export class MotivationAgent implements IAssistantAgent {
  readonly capability = createCap('MotivationAgent');
  async execute(): Promise<string> {
    return 'MotivationAgent response: Fantastic consistency streak!';
  }
}

export class SummaryAgent implements IAssistantAgent {
  readonly capability = createCap('SummaryAgent');
  async execute(): Promise<string> {
    return 'SummaryAgent response: Today was a solid day.';
  }
}

// Register all agents into registry
agentRegistry.register(new HealthCoachAgent());
agentRegistry.register(new RoutineCoachAgent());
agentRegistry.register(new GoalCoachAgent());
agentRegistry.register(new InsightExplainerAgent());
agentRegistry.register(new MotivationAgent());
agentRegistry.register(new SummaryAgent());
