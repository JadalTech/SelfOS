/**
 * Assistant Monitoring Service
 * SelfOS v2.0.0 — Batch 13D
 */

export class AssistantMonitoringService {
  private errorCount = 0;

  recordError(): void {
    this.errorCount += 1;
  }

  getErrorRate(): number {
    return this.errorCount;
  }
}

export const assistantMonitoringService = new AssistantMonitoringService();
export default assistantMonitoringService;
