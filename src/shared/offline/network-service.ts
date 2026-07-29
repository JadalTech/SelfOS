/**
 * Network Service
 *
 * Single source of truth for network connectivity state in SelfOS.
 * Provides subscription mechanism for repositories and sync manager.
 * Completely independent of UI.
 */

import { logger } from '../utils/logger';

/**
 * Strongly-typed network connectivity states.
 */
export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'RECONNECTING';

export type NetworkStatusListener = (status: NetworkStatus) => void;

export interface NetworkServiceOptions {
  /** Health check endpoint or URL to verify true connectivity. */
  pingUrl?: string;
  /** Timeout in milliseconds for ping checks. Default: 5000ms. */
  pingTimeoutMs?: number;
}

export class NetworkService {
  private status: NetworkStatus = 'ONLINE';
  private listeners: Set<NetworkStatusListener> = new Set();
  private pingUrl: string;
  private pingTimeoutMs: number;
  private isCheckingPing = false;

  constructor(options: NetworkServiceOptions = {}) {
    this.pingUrl = options.pingUrl || 'https://www.google.com/generate_204';
    this.pingTimeoutMs = options.pingTimeoutMs || 5000;
    this.initPlatformListeners();
  }

  /**
   * Initialize platform-specific network state listeners.
   */
  private initPlatformListeners(): void {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', () => this.handleConnectionChange(true));
      window.addEventListener('offline', () => this.handleConnectionChange(false));

      // Initial status check
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        this.status = 'OFFLINE';
      }
    }
  }

  /**
   * Handle raw connection status changes.
   */
  private async handleConnectionChange(isOnline: boolean): Promise<void> {
    if (!isOnline) {
      this.setStatus('OFFLINE');
      return;
    }

    // Transition to RECONNECTING while verifying internet reachability
    this.setStatus('RECONNECTING');
    const hasReachability = await this.checkReachability();

    if (hasReachability) {
      this.setStatus('ONLINE');
    } else {
      this.setStatus('OFFLINE');
    }
  }

  /**
   * Verify actual internet reachability via lightweight fetch ping.
   */
  public async checkReachability(): Promise<boolean> {
    if (typeof fetch === 'undefined') return true;
    if (this.isCheckingPing) return this.status === 'ONLINE';

    this.isCheckingPing = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.pingTimeoutMs);

      const response = await fetch(this.pingUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response !== undefined;
    } catch {
      return false;
    } finally {
      this.isCheckingPing = false;
    }
  }

  /**
   * Retrieve current network status.
   */
  public getStatus(): NetworkStatus {
    return this.status;
  }

  /**
   * Helper check if currently online.
   */
  public isOnline(): boolean {
    return this.status === 'ONLINE';
  }

  /**
   * Helper check if currently offline.
   */
  public isOffline(): boolean {
    return this.status === 'OFFLINE';
  }

  /**
   * Manually override network status (useful for testing and offline simulation).
   */
  public setStatus(newStatus: NetworkStatus): void {
    if (this.status === newStatus) return;

    const previousStatus = this.status;
    this.status = newStatus;
    logger.info('NetworkService', `Network status changed: ${previousStatus} -> ${newStatus}`);

    this.notifyListeners();
  }

  /**
   * Subscribe to network status change events.
   * Returns an unsubscribe function for memory safety and cleanup.
   */
  public subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Notify immediately with current status
    listener(this.status);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clear all active listeners.
   */
  public removeAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Notify all registered listeners of status update.
   */
  private notifyListeners(): void {
    const currentListeners = Array.from(this.listeners);
    for (const listener of currentListeners) {
      try {
        listener(this.status);
      } catch (error) {
        logger.error('NetworkService', 'Error in network status listener', error);
      }
    }
  }
}

/**
 * Singleton instance of NetworkService shared across application.
 */
export const networkService = new NetworkService();
