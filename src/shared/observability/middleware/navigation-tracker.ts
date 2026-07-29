/**
 * Navigation Tracker Middleware
 *
 * Automatically records screen navigation events to analytics and crash breadcrumbs
 * without cluttering screen components with tracking logic.
 */

import type { IAnalyticsProvider, ICrashReporter } from '../types';
import { defaultAnalytics } from '../providers/analytics';
import { defaultCrashReporter } from '../providers/crash-reporter';

export interface NavigationTrackerOptions {
  analytics?: IAnalyticsProvider;
  crashReporter?: ICrashReporter;
}

export class NavigationTracker {
  private analytics: IAnalyticsProvider;
  private crashReporter: ICrashReporter;
  private currentScreen: string | null = null;

  constructor(options: NavigationTrackerOptions = {}) {
    this.analytics = options.analytics || defaultAnalytics;
    this.crashReporter = options.crashReporter || defaultCrashReporter;
  }

  /**
   * Record navigation transition to a new screen.
   */
  public onNavigate(screenName: string, screenClass?: string): void {
    if (this.currentScreen === screenName) return;

    const previousScreen = this.currentScreen;
    this.currentScreen = screenName;

    // Track analytics screen view
    this.analytics.trackScreenView(screenName, screenClass);

    // Record breadcrumb for crash diagnostics
    this.crashReporter.recordBreadcrumb(
      `Navigated to screen: ${screenName}${previousScreen ? ` (from ${previousScreen})` : ''}`,
      'navigation',
      { from: previousScreen, to: screenName }
    );
  }

  /**
   * Get current active screen name.
   */
  public getCurrentScreen(): string | null {
    return this.currentScreen;
  }
}

/**
 * Singleton instance of NavigationTracker.
 */
export const navigationTracker = new NavigationTracker();
