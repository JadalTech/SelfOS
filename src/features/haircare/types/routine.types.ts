export type HairRoutineCategory =
  | 'wash-day'
  | 'oiling'
  | 'scalp-massage'
  | 'deep-conditioning'
  | 'custom';

export interface HairRoutine {
  readonly id: string;
  readonly userId: string;
  readonly routineId: string; // Foreign key -> Core generic Routine.id
  readonly haircareCategory: HairRoutineCategory;
  readonly productIds: string[]; // HairProduct.id array
  readonly instructions?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
