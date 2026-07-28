/**
 * Historical Snapshot Engine
 * SelfOS v3.3.0 — Batch 14D
 */

export interface HistoricalSnapshot {
  readonly snapshotId: string;
  readonly date: string;
  readonly lifeScore: number;
  readonly healthScore: number;
  readonly productivityScore: number;
}

export class HistoricalSnapshotEngine {
  private static readonly snapshots: HistoricalSnapshot[] = [];

  static captureSnapshot(date: string, lifeScore: number, healthScore: number, productivityScore: number): HistoricalSnapshot {
    const snapshot: HistoricalSnapshot = {
      snapshotId: `snap_${date}`,
      date,
      lifeScore,
      healthScore,
      productivityScore,
    };
    this.snapshots.push(snapshot);
    return snapshot;
  }

  static getSnapshots(): readonly HistoricalSnapshot[] {
    return this.snapshots;
  }
}
export default HistoricalSnapshotEngine;
