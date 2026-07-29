/**
 * React Query Infrastructure Test Suite
 * SelfOS Testing Infrastructure
 *
 * Verifies QueryCache behavior, optimistic mutation updates, query invalidation, and retry mechanics.
 *
 * Run with: npx tsx __tests__/react-query/react-query.test.ts
 */

import { QueryClient } from '@tanstack/react-query';
import { buildRoutine } from '../factories/routine.factory';

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

async function runReactQueryTests(): Promise<void> {
  console.log('\n--- React Query Infrastructure Test Suite ---\n');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5000,
      },
    },
  });

  const queryKey = ['routines', 'user_123'];

  // 1. Cache Storage & Invalidation
  console.log('Test Group: Cache Behavior & Invalidation');
  const routineList = [buildRoutine({ id: 'r1' }), buildRoutine({ id: 'r2' })];

  queryClient.setQueryData(queryKey, routineList);
  const cached = queryClient.getQueryData<typeof routineList>(queryKey);

  assert(cached?.length === 2, 'setQueryData stores data in query cache');
  assert(queryClient.isFetching({ queryKey }) === 0, 'Query is not fetching initially');

  await queryClient.invalidateQueries({ queryKey });
  const isStale = queryClient.getQueryState(queryKey)?.isInvalidated;
  assert(isStale === true, 'invalidateQueries marks query state as invalidated');

  // 2. Optimistic Update Pattern
  console.log('\nTest Group: Optimistic Updates');
  const previousData = queryClient.getQueryData<typeof routineList>(queryKey) || [];
  const newRoutine = buildRoutine({ id: 'r3', title: 'Optimistic Routine' });

  // Simulate onMutate
  queryClient.setQueryData(queryKey, [...previousData, newRoutine]);
  const optimisticCache = queryClient.getQueryData<typeof routineList>(queryKey);

  assert(optimisticCache?.length === 3, 'Optimistic update updates cache immediately before server confirmation');

  // Simulate onError rollback
  queryClient.setQueryData(queryKey, previousData);
  const rolledBackCache = queryClient.getQueryData<typeof routineList>(queryKey);
  assert(rolledBackCache?.length === 2, 'onError callback successfully rolls back optimistic cache changes');

  // 3. Retries and Stale Management
  console.log('\nTest Group: Retries & Stale Management');
  let attemptCount = 0;
  const failingQueryKey = ['test_fail_query'];

  try {
    await queryClient.fetchQuery({
      queryKey: failingQueryKey,
      queryFn: async () => {
        attemptCount++;
        throw new Error('Network timeout');
      },
      retry: 2,
      retryDelay: 1,
    });
  } catch (err: any) {
    assert(err.message === 'Network timeout', 'Fetch query propagates final error after retries');
  }

  assert(attemptCount === 3, 'Query retries exactly specified retry count (1 initial + 2 retries)');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runReactQueryTests();
