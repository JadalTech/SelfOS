import type { CalculatedDayStatus } from '@/features/routine/engine/completion';
import type { ProductCategory } from './product.types';

export interface HairProductVM {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly category: ProductCategory;
  readonly categoryLabel: string;
  readonly isFavorite: boolean;
  readonly isActive: boolean;
  readonly notes?: string;
}

export interface HairRoutineVM {
  readonly id: string;
  readonly routineId: string;
  readonly title: string;
  readonly categoryLabel: string;
  readonly scheduleSummary: string;
  readonly status: CalculatedDayStatus;
  readonly currentStreak: number;
  readonly products: HairProductVM[];
  readonly instructions?: string;
}

export interface HairLogVM {
  readonly id: string;
  readonly hairRoutineId: string;
  readonly routineTitle: string;
  readonly date: string;
  readonly time: string;
  readonly appliedProducts: string[];
  readonly notes?: string;
}

export interface HaircareDashboardVM {
  readonly upcomingWashDay?: HairRoutineVM;
  readonly activeRoutines: HairRoutineVM[];
  readonly favoriteProducts: HairProductVM[];
  readonly recentLogs: HairLogVM[];
  readonly activeProductsCount: number;
  readonly completedWashDaysCount: number;
}
