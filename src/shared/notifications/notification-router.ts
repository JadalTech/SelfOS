/**
 * Notification Router
 *
 * Listens to notification tap / response events and delegates deep link resolution
 * to RouteResolverRegistry. Completely decoupled from UI frameworks.
 */

import { logger } from '../utils/logger';
import { NotificationEventEmitter, notificationEventEmitter } from './notification-events';
import type { NotificationPayload } from './notification.types';
import { RouteResolverRegistry, routeResolverRegistry } from './route-resolver';

export type NavigationHandler = (route: string, payload: NotificationPayload) => void;

export interface NotificationRouterOptions {
  routeResolverRegistry?: RouteResolverRegistry;
  eventEmitter?: NotificationEventEmitter;
}

export class NotificationRouter {
  private routeRegistry: RouteResolverRegistry;
  private eventEmitter: NotificationEventEmitter;
  private navigationHandler: NavigationHandler | null = null;
  private subscription: { remove: () => void } | null = null;

  constructor(options: NotificationRouterOptions = {}) {
    this.routeRegistry = options.routeResolverRegistry || routeResolverRegistry;
    this.eventEmitter = options.eventEmitter || notificationEventEmitter;
    this.initNotificationTapListener();
  }

  /**
   * Safely initialize Expo notification response listener.
   */
  private initNotificationTapListener(): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Notifications = require('expo-notifications') as typeof import('expo-notifications');
      if (Notifications && typeof Notifications.addNotificationResponseReceivedListener === 'function') {
        this.subscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
          const data = response.notification.request.content.data as NotificationPayload;
          this.handleNotificationTap(data);
        });
        logger.info('NotificationRouter', 'Initialized Expo notification response listener.');
      }
    } catch {
      logger.info('NotificationRouter', 'Expo Notifications unavailable. Tap listener in standby mode.');
    }
  }

  /**
   * Register global navigation handler callback (e.g. router.push).
   */
  public setNavigationHandler(handler: NavigationHandler): void {
    this.navigationHandler = handler;
  }

  /**
   * Process notification tap event.
   */
  public handleNotificationTap(payload: NotificationPayload): void {
    if (!payload || !payload.feature) {
      logger.warn('NotificationRouter', 'Received notification tap with missing payload feature.');
      return;
    }

    this.eventEmitter.emit('REMINDER_TAPPED', { payload });

    const route = this.routeRegistry.resolveRoute(payload);
    if (route) {
      logger.info('NotificationRouter', `Resolved route "${route}" for feature "${payload.feature}"`);
      if (this.navigationHandler) {
        this.navigationHandler(route, payload);
      }
    }
  }

  /**
   * Clean up response listener subscription.
   */
  public destroy(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.navigationHandler = null;
  }
}

/**
 * Singleton instance of NotificationRouter.
 */
export const notificationRouter = new NotificationRouter();
