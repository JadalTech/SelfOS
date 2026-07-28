/**
 * Agent Capability Registry
 * SelfOS v2.0.0 — Batch 13C
 */

import type { AssistantContext } from '../../domain/assistant.types';

export interface AgentCapability {
  readonly agentId: string;
  readonly name: string;
  readonly version: string;
  readonly supportedIntents: readonly string[];
  readonly supportedHealthDomains: readonly string[];
  readonly executionCost: 'low' | 'medium' | 'high';
  readonly priority: number;
}

export interface IAssistantAgent {
  readonly capability: AgentCapability;
  execute(context: AssistantContext, userMessage: string): Promise<string>;
}

export class AgentRegistry {
  private readonly agents = new Map<string, IAssistantAgent>();

  register(agent: IAssistantAgent): void {
    this.agents.set(agent.capability.name, agent);
  }

  resolve(name: string): IAssistantAgent | null {
    return this.agents.get(name) || null;
  }

  getAgentsForDomain(domain: string): IAssistantAgent[] {
    return Array.from(this.agents.values()).filter((a) =>
      a.capability.supportedHealthDomains.includes(domain)
    );
  }
}

export const agentRegistry = new AgentRegistry();
export default agentRegistry;
