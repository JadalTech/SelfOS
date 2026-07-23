"use strict";
/**
 * Scratch Unit Verification Script for Haircare Mappers, Validation, and View Models
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mappers_1 = require("../src/features/haircare/mappers");
const haircare_validation_1 = require("../src/features/haircare/validation/haircare.validation");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[Assertion Failed] ${message}`);
    }
}
console.log('=== Starting Haircare Architecture Unit & Integration Tests ===');
const mockProduct = {
    id: 'p1',
    userId: 'u1',
    name: 'Nizoral 2%',
    brand: 'McNeil',
    category: 'shampoo',
    isFavorite: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockCoreRoutine = {
    id: 'cr1',
    userId: 'u1',
    title: 'Sunday Ketoconazole Wash',
    type: 'haircare',
    status: 'active',
    schedule: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [0], // Sunday
        startDate: '2026-07-01',
        timezone: 'UTC',
    },
    reminders: [],
    currentStreak: 3,
    longestStreak: 5,
    lastCompletedDate: '2026-07-19',
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockHairRoutine = {
    id: 'hr1',
    userId: 'u1',
    routineId: 'cr1',
    haircareCategory: 'wash-day',
    productIds: ['p1'],
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockHairLog = {
    id: 'hl1',
    userId: 'u1',
    hairRoutineId: 'hr1',
    routineLogId: 'rl1',
    date: '2026-07-23',
    time: '10:00:00',
    appliedProductIds: ['p1'],
    notes: 'Scalp felt great',
    createdAt: new Date(),
};
// ---------------------------------------------------------------------------
// Test 1: Validation Schemas
// ---------------------------------------------------------------------------
console.log('Running Test 1: Zod Validation Schemas...');
const validProd = haircare_validation_1.hairProductSchema.parse({
    name: 'Ketoconazole 2%',
    brand: 'Nizoral',
    category: 'shampoo',
});
assert(validProd.name === 'Ketoconazole 2%', 'Valid product schema parsed');
const validRoutine = haircare_validation_1.hairRoutineSchema.parse({
    title: 'Sunday Wash Day',
    haircareCategory: 'wash-day',
    productIds: ['p1'],
    frequency: 'weekly',
});
assert(validRoutine.title === 'Sunday Wash Day', 'Valid routine schema parsed');
const validLog = haircare_validation_1.hairLogSchema.parse({
    hairRoutineId: 'hr1',
    appliedProductIds: ['p1'],
    notes: 'Good wash',
});
assert(validLog.hairRoutineId === 'hr1', 'Valid log schema parsed');
console.log('✅ Test 1 Passed');
// ---------------------------------------------------------------------------
// Test 2: Product Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 2: mapToHairProductVM...');
const productVM = (0, mappers_1.mapToHairProductVM)(mockProduct);
assert(productVM.brand === 'McNeil', 'Product brand mapped');
assert(productVM.categoryLabel === 'Shampoo', 'Category label mapped');
console.log('✅ Test 2 Passed');
// ---------------------------------------------------------------------------
// Test 3: Routine Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 3: mapToHairRoutineVM...');
const routineVM = (0, mappers_1.mapToHairRoutineVM)(mockHairRoutine, [mockCoreRoutine], [mockProduct]);
assert(routineVM.title === 'Sunday Ketoconazole Wash', 'Core routine title mapped');
assert(routineVM.categoryLabel === 'Wash Day', 'Category label mapped');
assert(routineVM.products.length === 1, 'Linked product mapped');
console.log('✅ Test 3 Passed');
// ---------------------------------------------------------------------------
// Test 4: Log Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 4: mapToHairLogVM...');
const logVM = (0, mappers_1.mapToHairLogVM)(mockHairLog, [mockHairRoutine], [mockCoreRoutine], [mockProduct]);
assert(logVM.routineTitle === 'Sunday Ketoconazole Wash', 'Log title mapped');
assert(logVM.appliedProducts[0].includes('Nizoral 2%'), 'Applied product name mapped');
console.log('✅ Test 4 Passed');
// ---------------------------------------------------------------------------
// Test 5: Haircare Dashboard ViewModel Construction
// ---------------------------------------------------------------------------
console.log('Running Test 5: buildHaircareDashboardVM...');
const dashVM = (0, mappers_1.buildHaircareDashboardVM)([mockProduct], [mockHairRoutine], [mockCoreRoutine], [mockHairLog]);
assert(dashVM.activeProductsCount === 1, 'Active products count is 1');
assert(dashVM.completedWashDaysCount === 1, 'Completed wash days count is 1');
assert(dashVM.favoriteProducts.length === 1, '1 favorite product listed');
assert(dashVM.recentLogs.length === 1, '1 recent log listed');
console.log('✅ Test 5 Passed');
console.log('\n=== All Haircare Architecture Unit & Integration Tests Passed! ===');
