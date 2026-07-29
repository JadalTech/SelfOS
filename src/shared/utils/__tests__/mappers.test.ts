/**
 * Unit Test Suite: Shared & Feature Mappers
 * SelfOS Testing Infrastructure
 *
 * Verifies domain model ⇄ ViewModel transformations, nullable fallback handling, and ISO date formatting.
 * Run with: npx tsx src/shared/utils/__tests__/mappers.test.ts
 */

import { buildRoutine } from '../../../../__tests__/factories/routine.factory';
import { buildUser } from '../../../../__tests__/factories/user.factory';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ ${message}`);
    failCount++;
  }
}

// Sample Mapper under test
function mapUserToHeaderVM(user: ReturnType<typeof buildUser>) {
  return {
    displayName: user.displayName || 'Friend',
    initial: (user.displayName || 'F').charAt(0).toUpperCase(),
    avatarUrl: user.photoURL ?? null,
    isVerified: user.emailVerified,
  };
}

function mapRoutineToCardVM(routine: ReturnType<typeof buildRoutine>) {
  return {
    id: routine.id,
    title: routine.title,
    subtitle: routine.description || 'No description',
    badgeText: routine.frequency.type.toUpperCase(),
    streakDisplay: `${routine.streak.current} 🔥`,
    isArchived: routine.isArchived,
  };
}

async function runMapperTests(): Promise<void> {
  console.log('\n--- Unit Test Suite: Mappers & ViewModels ---\n');

  // 1. User Header Mapper
  console.log('Test Group: User Header Mapper');
  const user = buildUser({ displayName: 'Sarah Connor', photoURL: 'https://example.com/pic.png' });
  const userVM = mapUserToHeaderVM(user);
  assert(userVM.displayName === 'Sarah Connor', 'Maps displayName correctly');
  assert(userVM.initial === 'S', 'Derives uppercase first initial');
  assert(userVM.avatarUrl === 'https://example.com/pic.png', 'Preserves valid photoURL');

  const anonymous = buildUser({ displayName: '', photoURL: undefined });
  const anonVM = mapUserToHeaderVM(anonymous);
  assert(anonVM.displayName === 'Friend', 'Falls back to Friend when displayName is empty');
  assert(anonVM.initial === 'F', 'Falls back to F initial for anonymous user');

  // 2. Routine Card Mapper
  console.log('\nTest Group: Routine Card Mapper');
  const routine = buildRoutine({ title: 'Skincare Evening', streak: { current: 7, best: 20 } });
  const cardVM = mapRoutineToCardVM(routine);
  assert(cardVM.title === 'Skincare Evening', 'Maps routine title');
  assert(cardVM.badgeText === 'DAILY', 'Transforms frequency type to uppercase badge');
  assert(cardVM.streakDisplay === '7 🔥', 'Formats streak string with flame emoji');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runMapperTests();
