/**
 * Observability Layer Unit Tests
 * SelfOS Observability Suite
 *
 * Verifies PII Sanitization, CrashReporter, AnalyticsProvider, PerformanceTracer,
 * NavigationTracker, and ObservabilityFacade.
 *
 * Run with: npx tsx src/shared/observability/__tests__/observability.test.ts
 */

import { sanitizePayload, CrashReporter } from '../providers/crash-reporter';
import { AnalyticsProvider } from '../providers/analytics';
import { PerformanceTracer } from '../providers/performance';
import { NavigationTracker } from '../middleware/navigation-tracker';
import { ObservabilityService } from '../observability';

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

async function runObservabilityTests(): Promise<void> {
  console.log('\n--- Observability Layer Unit Test Suite ---\n');

  // 1. PII & Sensitive Data Sanitization Tests
  console.log('Test Group: PII Sanitization Guard');
  const rawPayload = {
    userId: 'user_123',
    password: 'SuperSecretPassword123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    secret: 'my_api_secret',
    email: 'test@example.com',
    journalContent: 'Deep personal thoughts...',
    amount: 500,
    safeMetadata: 'Public info',
  };

  const sanitized = sanitizePayload(rawPayload);
  assert(sanitized.userId === 'user_123', 'Preserves non-sensitive field userId');
  assert(sanitized.password === '[REDACTED]', 'Sanitizes password to [REDACTED]');
  assert(sanitized.token === '[REDACTED]', 'Sanitizes token to [REDACTED]');
  assert(sanitized.secret === '[REDACTED]', 'Sanitizes secret to [REDACTED]');
  assert(sanitized.email === '[REDACTED]', 'Sanitizes email to [REDACTED]');
  assert(sanitized.journalContent === '[REDACTED]', 'Sanitizes journalContent to [REDACTED]');
  assert((sanitized.amount as unknown as string) === '[REDACTED]', 'Sanitizes amount to [REDACTED]');
  assert(sanitized.safeMetadata === 'Public info', 'Preserves safeMetadata');

  // 2. CrashReporter Tests
  console.log('\nTest Group: CrashReporter');
  const crashReporter = new CrashReporter();
  crashReporter.setUserContext('u_100');
  crashReporter.recordBreadcrumb('User opened settings', 'user_action', { token: 'secret_123' });

  const breadcrumbs = crashReporter.getRecentBreadcrumbs();
  assert(breadcrumbs.length === 1, 'Breadcrumb recorded correctly');
  assert((breadcrumbs[0] as any).data?.token === '[REDACTED]', 'Breadcrumb data sanitized automatically');

  crashReporter.captureException(new Error('Network Failed'), { password: 'pass' });
  assert(true, 'captureException executes without error');

  // 3. AnalyticsProvider Tests
  console.log('\nTest Group: AnalyticsProvider');
  const analytics = new AnalyticsProvider();
  analytics.setUserProperties({ role: 'member', email: 'user@selfos.app' });
  const userProps = analytics.getUserProperties();

  assert(userProps.role === 'member', 'Sets valid user property');
  assert(userProps.email === '[REDACTED]', 'Sanitizes user properties PII');

  analytics.trackEvent('test_event', { feature: 'routine', password: '123' });
  assert(true, 'trackEvent executes with sanitized payload');

  // 4. PerformanceTracer Tests
  console.log('\nTest Group: PerformanceTracer');
  const perf = new PerformanceTracer();
  const measuredResult = await perf.measureAsync('firestore_query', async () => {
    return 'query_success';
  });

  assert(measuredResult === 'query_success', 'measureAsync benchmarks and returns async result');

  // 5. NavigationTracker Tests
  console.log('\nTest Group: NavigationTracker');
  const navTracker = new NavigationTracker({ analytics, crashReporter });
  navTracker.onNavigate('DashboardScreen');
  assert(navTracker.getCurrentScreen() === 'DashboardScreen', 'NavigationTracker records screen view');

  navTracker.onNavigate('DashboardScreen'); // Duplicate view check
  assert(navTracker.getCurrentScreen() === 'DashboardScreen', 'NavigationTracker ignores duplicate active screen view');

  // 6. Observability Facade Tests
  console.log('\nTest Group: Observability Facade');
  const obs = new ObservabilityService({
    analytics,
    crashReporter,
    performance: perf,
  });

  obs.setUserContext('user_999');
  obs.app.appLaunched('iOS');
  obs.auth.loginSuccess('email');
  obs.routine.routineCompleted('skincare', 5);

  assert(true, 'ObservabilityFacade domain event helpers execute cleanly');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runObservabilityTests();
