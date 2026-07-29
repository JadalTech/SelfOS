/**
 * Route Resolver Registry
 *
 * Pluggable registry for feature-specific deep link route resolvers.
 * Prevents shared notification infrastructure from hardcoding feature screen routes.
 */

import { logger } from '../utils/logger';
import type { NotificationFeature, NotificationPayload } from './notification.types';

/**
 * Interface implemented by feature modules to resolve deep links from notification payloads.
 */
export interface RouteResolver {
  readonly feature: NotificationFeature;
  /**
   * Translate notification payload into a navigation path or deep link string.
   */
  resolve(payload: NotificationPayload): string | null;
}

export class RouteResolverRegistry {
  private resolvers: Map<NotificationFeature, RouteResolver> = new Map();

  /**
   * Register a feature route resolver.
   */
  public register(resolver: RouteResolver): void {
    this.resolvers.set(resolver.feature, resolver);
    logger.info('RouteResolverRegistry', `Registered route resolver for feature "${resolver.feature}"`);
  }

  /**
   * Resolve a deep link route for a given notification payload.
   */
  public resolveRoute(payload: NotificationPayload): string | null {
    const resolver = this.resolvers.get(payload.feature);
    if (resolver) {
      return resolver.resolve(payload);
    }

    // Default fallback route resolver if payload contains an explicit route
    if (payload.route && typeof payload.route === 'string') {
      return payload.route;
    }

    logger.warn('RouteResolverRegistry', `No registered route resolver for feature "${payload.feature}"`);
    return null;
  }

  /**
   * Clear all registered resolvers (for testing).
   */
  public clear(): void {
    this.resolvers.clear();
  }
}

/**
 * Singleton instance of RouteResolverRegistry.
 */
export const routeResolverRegistry = new RouteResolverRegistry();

// Standard Feature Resolver Example implementations
export class RoutineRouteResolver implements RouteResolver {
  readonly feature: NotificationFeature = 'routine';

  resolve(payload: NotificationPayload): string | null {
    if (payload.entityId) {
      return `/(app)/routine/details?id=${payload.entityId}`;
    }
    return '/(app)/routine';
  }
}

// Register default Routine route resolver
routeResolverRegistry.register(new RoutineRouteResolver());
