/**
 * Network Service Test Mock
 * SelfOS Testing Infrastructure
 */

export class MockNetworkService {
  private status: 'ONLINE' | 'OFFLINE' = 'ONLINE';
  private listeners: Set<(status: 'ONLINE' | 'OFFLINE') => void> = new Set();

  getStatus(): 'ONLINE' | 'OFFLINE' {
    return this.status;
  }

  isOnline(): boolean {
    return this.status === 'ONLINE';
  }

  isOffline(): boolean {
    return this.status === 'OFFLINE';
  }

  setStatus(newStatus: 'ONLINE' | 'OFFLINE'): void {
    this.status = newStatus;
    this.listeners.forEach((fn) => fn(newStatus));
  }

  subscribe(listener: (status: 'ONLINE' | 'OFFLINE') => void): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }
}
