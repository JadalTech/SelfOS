/**
 * Insights Engine AI Coach Layer Unit Tests
 * SelfOS v1.5.0 — Batch 12C
 *
 * Run with: npx tsx src/features/insights/__tests__/insights.ai.test.ts
 */

import { AIProviderFactory } from '../ai/providers/Providers';
import { coordinatorAgent } from '../ai/agents/Agents';
import { AIContextBuilder } from '../ai/builders/AIContextBuilder';
import { AIResponseValidator } from '../ai/validators/AIResponseValidator';
import { ResponseFusionService } from '../ai/services/ResponseFusionService';
import { AITelemetry } from '../ai/utils/AITelemetry';
import { ConversationContextManager } from '../ai/utils/ConversationContextManager';
import type { PipelineOutput } from '../pipeline/InsightPipeline';

// Test harness
let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    failures.push(`FAIL: ${message}`);
    console.error(`  ✗ ${message}`);
  }
}

function describe(name: string, fn: () => void): void {
  console.log(`\n▸ ${name}`);
  fn();
}

function it(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failCount++;
    const msg = error instanceof Error ? error.message : String(error);
    failures.push(`FAIL: ${name} — ${msg}`);
    console.error(`  ✗ ${name} — ${msg}`);
  }
}

// =========================================================================
// RUN TEST SCENARIOS
// =========================================================================

describe('AI Providers — Factory Strategy', () => {
  it('loads the correct mock provider in absence of environment keys', () => {
    const provider = AIProviderFactory.getProvider('mock');
    assert(provider.name === 'mock', `Expected mock provider, got ${provider.name}`);
  });
});

describe('Parallel CoordinatorAgent Pipeline', () => {
  it('coordinates sub-agent executions in parallel', async () => {
    const mockPipeline: PipelineOutput = {
      score: { id: 's', userId: 'u', overallScore: 8, nutrition: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false }, workout: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false }, sleep: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false }, hydration: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false }, trend: 'stable', grade: 'B', confidence: 0.9, calculatedAt: new Date() },
      trends: [],
      correlations: [],
      habits: [],
      recommendations: [],
      prediction: null,
      insights: [],
    };
    const results = await coordinatorAgent.executeParallel('user-1', mockPipeline);
    assert(results.summary.includes('Score is 8'), 'Orchestrated health summary successfully');
  });
});

describe('AI Context & derived confidence builder', () => {
  it('compiles optimized context with derived confidence percentage', () => {
    const mockPipeline: PipelineOutput = {
      score: { id: 's', userId: 'u', overallScore: 7.2, nutrition: { score: 7, weight: 0.5, dataCompleteness: 0.8, isMissing: false }, workout: { score: 7, weight: 0.5, dataCompleteness: 0.8, isMissing: false }, sleep: { score: 0, weight: 0, dataCompleteness: 0, isMissing: true }, hydration: { score: 0, weight: 0, dataCompleteness: 0, isMissing: true }, trend: 'stable', grade: 'C', confidence: 0.8, calculatedAt: new Date() },
      trends: [],
      correlations: [],
      habits: [],
      recommendations: [],
      prediction: null,
      insights: [],
    };
    const ctxString = AIContextBuilder.buildContext(mockPipeline);
    const parsed = JSON.parse(ctxString);
    assert(parsed.derivedConfidence === 0.8, 'Derived confidence matches domain score data completeness');
  });
});

describe('AI Safety Validator — medical claim firewall', () => {
  it('sanitizes prohibited medical/diagnostic jargon', () => {
    const raw = {
      wins: ['Recovered workout habits'],
      areasForImprovement: ['Diagnose insomnia disease symptoms'],
      priorityRecommendation: 'Prescribe medicine for sleep fatigue',
      motivation: 'Stay healthy',
    };
    const validated = AIResponseValidator.validateHealthSummary(raw);
    assert(!validated.areasForImprovement[0].includes('disease'), 'Sanitizes disease keywords');
    assert(validated.priorityRecommendation.includes('general wellness focus'), 'Sanitizes prescribe keywords');
  });
});

describe('ResponseFusionService — prioritizations & deduplication', () => {
  it('resolves conflicting recommendations prioritizing rest on fatigue', () => {
    const recommendations = [
      'Focus on sleep fatigue rest recovery.',
      'Deduplicated entry sample.',
      'Deduplicated entry sample.', // duplicate
      'Progressive overload push harder training volume.', // conflicts with fatigue rest recommendation
    ];
    const fused = ResponseFusionService.fuseRecommendations(recommendations);
    assert(fused.length === 2, `Expected 2 unique recommendations, got ${fused.length}`);
    assert(!fused.some((r) => r.includes('push harder')), 'Fatigue warning overrides progressive overload');
  });
});

describe('ConversationContextManager — history pruning', () => {
  it('truncates message logs based on token budget constraints', () => {
    const messages = Array(15).fill({ id: 'm', sender: 'user', text: 'hi', timestamp: new Date() });
    const pruned = ConversationContextManager.pruneHistory(messages, 5);
    assert(pruned.length === 5, `Expected history pruned to 5, got ${pruned.length}`);
  });
});

describe('AI Telemetry Monitoring', () => {
  it('records prompt usage metrics correctly', () => {
    AITelemetry.recordRequest(100, 50, 450);
    const metrics = AITelemetry.getMetrics();
    assert(metrics.promptTokens === 100, 'Records prompt tokens');
    assert(metrics.latencyMs === 450, 'Records request latency');
  });
});

// =========================================================================
// RESULTS
// =========================================================================
console.log('\n' + '='.repeat(60));
console.log(`Tests complete: ${passCount} passed, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('='.repeat(60));

process.exit(failCount > 0 ? 1 : 0);
