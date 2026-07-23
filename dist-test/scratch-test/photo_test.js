"use strict";
/**
 * Scratch Unit Verification Script for HairPhoto Mappers & Validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const photos_mapper_1 = require("../src/features/haircare/mappers/photos.mapper");
const haircare_validation_1 = require("../src/features/haircare/validation/haircare.validation");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[Assertion Failed] ${message}`);
    }
}
console.log('=== Starting Batch 6C Photo Architecture Unit Tests ===');
const mockPhoto1 = {
    id: 'hp1',
    userId: 'u1',
    photoUrl: 'https://storage.googleapis.com/test/hp1.jpg',
    storagePath: 'users/u1/haircare/photos/hp1.jpg',
    captureDate: '2026-07-01',
    angle: 'crown',
    notes: 'Month 1 Baseline',
    createdAt: new Date('2026-07-01T10:00:00Z'),
    updatedAt: new Date('2026-07-01T10:00:00Z'),
};
const mockPhoto2 = {
    id: 'hp2',
    userId: 'u1',
    photoUrl: 'https://storage.googleapis.com/test/hp2.jpg',
    storagePath: 'users/u1/haircare/photos/hp2.jpg',
    captureDate: '2026-07-23',
    angle: 'crown',
    notes: 'Month 1 End',
    createdAt: new Date('2026-07-23T10:00:00Z'),
    updatedAt: new Date('2026-07-23T10:00:00Z'),
};
const mockPhoto3 = {
    id: 'hp3',
    userId: 'u1',
    photoUrl: 'https://storage.googleapis.com/test/hp3.jpg',
    storagePath: 'users/u1/haircare/photos/hp3.jpg',
    captureDate: '2026-06-15',
    angle: 'hairline',
    notes: 'June baseline',
    createdAt: new Date('2026-06-15T10:00:00Z'),
    updatedAt: new Date('2026-06-15T10:00:00Z'),
};
// ---------------------------------------------------------------------------
// Test 1: Validation Schema
// ---------------------------------------------------------------------------
console.log('Running Test 1: hairPhotoUploadSchema...');
const validUpload = haircare_validation_1.hairPhotoUploadSchema.parse({
    imageUri: 'file:///path/to/image.jpg',
    captureDate: '2026-07-23',
    angle: 'crown',
    notes: 'Test photo',
});
assert(validUpload.angle === 'crown', 'Photo angle parsed correctly');
console.log('✅ Test 1 Passed');
// ---------------------------------------------------------------------------
// Test 2: Photo Mapper
// ---------------------------------------------------------------------------
console.log('Running Test 2: mapToHairPhotoVM...');
const vm1 = (0, photos_mapper_1.mapToHairPhotoVM)(mockPhoto1);
assert(vm1.formattedDate === 'Jul 1, 2026', 'Formatted date matched Jul 1, 2026');
assert(vm1.angleLabel === 'Crown View', 'Angle label mapped to Crown View');
console.log('✅ Test 2 Passed');
// ---------------------------------------------------------------------------
// Test 3: Monthly Timeline Grouping
// ---------------------------------------------------------------------------
console.log('Running Test 3: groupPhotosByMonth...');
const photoVMs = [(0, photos_mapper_1.mapToHairPhotoVM)(mockPhoto1), (0, photos_mapper_1.mapToHairPhotoVM)(mockPhoto2), (0, photos_mapper_1.mapToHairPhotoVM)(mockPhoto3)];
const groups = (0, photos_mapper_1.groupPhotosByMonth)(photoVMs);
assert(groups.length === 2, '2 monthly groups created (July 2026, June 2026)');
assert(groups[0].monthYearLabel === 'July 2026', 'First group is July 2026');
assert(groups[0].photos.length === 2, 'July 2026 contains 2 photos');
assert(groups[1].monthYearLabel === 'June 2026', 'Second group is June 2026');
assert(groups[1].photos.length === 1, 'June 2026 contains 1 photo');
console.log('✅ Test 3 Passed');
console.log('\n=== All Batch 6C Photo Architecture Unit Tests Passed! ===');
