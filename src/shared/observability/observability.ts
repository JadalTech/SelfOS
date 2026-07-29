/**
 * Observability Facade
 *
 * Single unified entry point exposing analytics, crash reporting, performance tracing,
 * and structured logging. The application depends ONLY on this facade.
 */

import type {
  IAnalyticsProvider,
  ICrashReporter,
  IPerformanceTracer,
  IStructuredLogger,
} from './types';
import { defaultAnalytics } from './providers/analytics';
import { defaultCrashReporter } from './providers/crash-reporter';
import { defaultPerformanceTracer } from './providers/performance';
import { defaultLogger } from './providers/logger';
import { AppEvents } from './events/app.events';
import { AuthEvents } from './events/auth.events';
import { RoutineEvents } from './events/routine.events';

export interface ObservabilityOptions {
  analytics?: IAnalyticsProvider;
  crashReporter?: ICrashReporter;
  performance?: IPerformanceTracer;
  logger?: IStructuredLogger;
}

export class ObservabilityService {
  public readonly analytics: IAnalyticsProvider;
  public readonly crashReporter: ICrashReporter;
  public readonly performance: IPerformanceTracer;
  public readonly logger: IStructuredLogger;

  constructor(options: ObservabilityOptions = {}) {
    this.analytics = options.analytics || defaultAnalytics;
    this.crashReporter = options.crashReporter || defaultCrashReporter;
    this.performance = options.performance || defaultPerformanceTracer;
    this.logger = options.logger || defaultLogger;
  }

  /**
   * Set user context across crash reporting and analytics.
   */
  public setUserContext(userId: string | null): void {
    this.crashReporter.setUserContext(userId);
    if (userId) {
      this.analytics.setUserProperties({ userId });
    }
  }

  /** Strongly-typed domain event helpers */
  public readonly app = {
    appLaunched: (platform: string) => AppEvents.appLaunched(this.analytics, platform),
    themeChanged: (theme: 'light' | 'dark' | 'system') => AppEvents.themeChanged(this.analytics, theme),
    screenView: (screenName: string, screenClass?: string) => AppEvents.screenView(this.analytics, screenName, screenClass),
  };

  public readonly auth = {
    loginSuccess: (method: 'email' | 'google' | 'anonymous') => AuthEvents.loginSuccess(this.analytics, method),
    loginFailure: (method: string, errorCode: string) => AuthEvents.loginFailure(this.analytics, method, errorCode),
    signUpSuccess: (method: string) => AuthEvents.signUpSuccess(this.analytics, method),
    logout: () => AuthEvents.logout(this.analytics),
  };

  public readonly routine = {
    routineCreated: (routineType: string, frequency: string) => RoutineEvents.routineCreated(this.analytics, routineType, frequency),
    routineCompleted: (routineType: string, streak: number) => RoutineEvents.routineCompleted(this.analytics, routineType, streak),
    routineSkipped: (routineType: string) => RoutineEvents.routineSkipped(this.analytics, routineType),
    routineArchived: (routineType: string) => RoutineEvents.routineArchived(this.analytics, routineType),
  };
}

/**
 * Singleton instance of ObservabilityService.
 */
export const observability = new ObservabilityService();
