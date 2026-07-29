/**
 * Auth Domain Analytics Events
 */

import type { IAnalyticsProvider } from '../types';

export const AuthEvents = {
  loginSuccess(analytics: IAnalyticsProvider, method: 'email' | 'google' | 'anonymous'): void {
    analytics.trackEvent('login_success', { method });
  },

  loginFailure(analytics: IAnalyticsProvider, method: string, errorCode: string): void {
    analytics.trackEvent('login_failure', { method, errorCode });
  },

  signUpSuccess(analytics: IAnalyticsProvider, method: string): void {
    analytics.trackEvent('sign_up_success', { method });
  },

  logout(analytics: IAnalyticsProvider): void {
    analytics.trackEvent('logout');
  },
};
