/**
 * App Core Domain Analytics Events
 */

import type { IAnalyticsProvider } from '../types';

export const AppEvents = {
  appLaunched(analytics: IAnalyticsProvider, platform: string): void {
    analytics.trackEvent('app_launched', { platform });
  },

  themeChanged(analytics: IAnalyticsProvider, theme: 'light' | 'dark' | 'system'): void {
    analytics.trackEvent('theme_changed', { theme });
  },

  screenView(analytics: IAnalyticsProvider, screenName: string, screenClass?: string): void {
    analytics.trackScreenView(screenName, screenClass);
  },
};
