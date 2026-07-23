/**
 * Scratch Unit Verification Script for HairCondition Mappers & Validation
 */

import { mapToHairConditionVM, filterConditionVMs } from '../src/features/haircare/mappers/condition.mapper';
import { hairConditionSchema } from '../src/features/haircare/validation/haircare.validation';
import type { HairCondition } from '../src/features/haircare/types/condition.types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Batch 6D Condition Architecture Unit Tests ===');

const mockCondition1: HairCondition = {
  id: 'hc1',
  userId: 'u1',
  recordDate: '2026-07-23',
  hairType: 'wavy',
  porosity: 'medium',
  scalpType: 'oily',
  hairDensity: 'medium',
  sheddingLevel: 2,
  dandruffLevel: 1,
  itchinessLevel: 1,
  oilinessLevel: 4,
  drynessLevel: 2,
  breakageLevel: 1,
  frizzLevel: 3,
  shineLevel: 4,
  overallHealth: 9,
  sleepHours: 8,
  waterIntakeLiters: 2.5,
  notes: 'Oily scalp after workout',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCondition2: HairCondition = {
  id: 'hc2',
  userId: 'u1',
  recordDate: '2026-07-15',
  hairType: 'wavy',
  porosity: 'high',
  scalpType: 'dry',
  hairDensity: 'thin',
  sheddingLevel: 4,
  dandruffLevel: 3,
  itchinessLevel: 4,
  oilinessLevel: 1,
  drynessLevel: 4,
  breakageLevel: 3,
  frizzLevel: 4,
  shineLevel: 2,
  overallHealth: 3,
  notes: 'High shedding and itchiness',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Test 1: Validation Schema
// ---------------------------------------------------------------------------
console.log('Running Test 1: hairConditionSchema...');
const validAssessment = hairConditionSchema.parse({
  recordDate: '2026-07-23',
  hairType: 'wavy',
  porosity: 'medium',
  scalpType: 'oily',
  hairDensity: 'thick',
  sheddingLevel: 2,
  dandruffLevel: 1,
  itchinessLevel: 1,
  oilinessLevel: 4,
  drynessLevel: 2,
  breakageLevel: 1,
  frizzLevel: 2,
  shineLevel: 4,
  overallHealth: 9,
  notes: 'Great health',
});
assert(validAssessment.overallHealth === 9, 'Overall health score parsed correctly');
console.log('✅ Test 1 Passed');

// ---------------------------------------------------------------------------
// Test 2: Condition Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 2: mapToHairConditionVM...');
const vm1 = mapToHairConditionVM(mockCondition1);
assert(vm1.formattedDate === 'Jul 23, 2026', 'Formatted date matched Jul 23, 2026');
assert(vm1.scalpTypeLabel === 'Oily Scalp', 'Scalp type label mapped to Oily Scalp');
assert(vm1.healthBadgeLabel === 'Optimal / Healthy', 'Badge label mapped to Optimal');
console.log('✅ Test 2 Passed');

// ---------------------------------------------------------------------------
// Test 3: Filtering & Search
// ---------------------------------------------------------------------------
console.log('Running Test 3: filterConditionVMs...');
const vms = [mapToHairConditionVM(mockCondition1), mapToHairConditionVM(mockCondition2)];

const filteredBySearch = filterConditionVMs(vms, { searchKeyword: 'shedding' });
assert(filteredBySearch.length === 1, '1 record matched search keyword "shedding"');
assert(filteredBySearch[0].id === 'hc2', 'Matched mockCondition2');

const filteredByScalp = filterConditionVMs(vms, { scalpType: 'oily' });
assert(filteredByScalp.length === 1, '1 record matched scalpType "oily"');
assert(filteredByScalp[0].id === 'hc1', 'Matched mockCondition1');

console.log('✅ Test 3 Passed');

console.log('\n=== All Batch 6D Condition Architecture Unit Tests Passed! ===');
