export interface HairLog {
  readonly id: string;
  readonly userId: string;
  readonly hairRoutineId: string;
  readonly routineLogId?: string; // Foreign key -> Core RoutineLog.id
  readonly date: string; // YYYY-MM-DD
  readonly time: string; // HH:mm:ss
  readonly appliedProductIds: string[];
  readonly notes?: string;
  readonly createdAt: Date;
}
