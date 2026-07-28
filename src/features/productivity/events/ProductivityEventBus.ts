/**
 * Productivity Event Bus
 * SelfOS v3.0.0 — Batch 14A
 */

export type ProductivityEventType =
  | 'GoalCreated'
  | 'GoalCompleted'
  | 'TaskCreated'
  | 'TaskCompleted'
  | 'ProjectStarted'
  | 'ProjectCompleted'
  | 'PlanningGenerated'
  | 'ReminderTriggered';

export interface ProductivityEvent {
  readonly type: ProductivityEventType;
  readonly payload: Record<string, any>;
  readonly timestamp: Date;
}

export type EventListener = (event: ProductivityEvent) => void;

export class ProductivityEventBus {
  private readonly listeners: EventListener[] = [];

  subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  emit(type: ProductivityEventType, payload: Record<string, any>): void {
    const event: ProductivityEvent = { type, payload, timestamp: new Date() };
    this.listeners.forEach((listener) => listener(event));
  }
}

export const productivityEventBus = new ProductivityEventBus();
export default productivityEventBus;
