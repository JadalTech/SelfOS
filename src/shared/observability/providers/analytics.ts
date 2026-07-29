/**
 * Analytics Provider
 *
 * Strongly typed analytics provider abstraction.
 * Automatically sanitizes event parameters to guarantee privacy.
 */

import { logger } from '@/shared/utils/logger';
import type { IAnalyticsProvider } from '../types';
import { sanitizePayload } from './crash-reporter';

export class AnalyticsProvider implements IAnalyticsProvider {
  private userProperties: Record<string, string | number | boolean> = {};

  public setUserProperties(properties: Record<string, string | number | boolean>): void {
    const sanitized = sanitizePayload(properties);
    this.userProperties = { ...this.userProperties, ...sanitized };
    logger.info('Analytics', 'Set user properties', sanitized);
  }

  public trackEvent(eventName: string, params?: Record<string, unknown>): void {
    const sanitizedParams = params ? sanitizePayload(params) : undefined;
    logger.info('Analytics', `Track Event: "${eventName}"`, sanitizedParams);
  }

  public trackScreenView(screenName: string, screenClass?: string): void {
    logger.info('Analytics', `Screen View: "${screenName}"`, { screenClass });
  }

  public getUserProperties() {
    return { ...this.userProperties };
  }
}

export const defaultAnalytics = new AnalyticsProvider();
