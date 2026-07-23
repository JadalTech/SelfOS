export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
export type HairPorosity = 'low' | 'medium' | 'high' | 'unknown';
export type ScalpType = 'dry' | 'normal' | 'oily' | 'combination' | 'sensitive';
export type HairDensity = 'thin' | 'medium' | 'thick';

export interface HairCondition {
  readonly id: string;
  readonly userId: string;
  readonly recordDate: string; // YYYY-MM-DD
  readonly hairType: HairType;
  readonly porosity: HairPorosity;
  readonly scalpType: ScalpType;
  readonly hairDensity: HairDensity;
  readonly sheddingLevel: number; // 1-5
  readonly dandruffLevel: number; // 1-5
  readonly itchinessLevel: number; // 1-5
  readonly oilinessLevel: number; // 1-5
  readonly drynessLevel: number; // 1-5
  readonly breakageLevel: number; // 1-5
  readonly frizzLevel: number; // 1-5
  readonly shineLevel: number; // 1-5
  readonly overallHealth: number; // 1-10
  readonly stressLevel?: number; // 1-5
  readonly sleepHours?: number;
  readonly waterIntakeLiters?: number;
  readonly notes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface HairConditionVM {
  readonly id: string;
  readonly recordDate: string;
  readonly formattedDate: string;
  readonly hairTypeLabel: string;
  readonly porosityLabel: string;
  readonly scalpTypeLabel: string;
  readonly hairDensityLabel: string;
  readonly sheddingLevel: number;
  readonly dandruffLevel: number;
  readonly itchinessLevel: number;
  readonly oilinessLevel: number;
  readonly drynessLevel: number;
  readonly breakageLevel: number;
  readonly frizzLevel: number;
  readonly shineLevel: number;
  readonly overallHealth: number;
  readonly healthBadgeColor: string; // Tailwind color class
  readonly healthBadgeLabel: string;
  readonly stressLevel?: number;
  readonly sleepHours?: number;
  readonly waterIntakeLiters?: number;
  readonly notes?: string;
}

export interface ConditionFilterParams {
  readonly searchKeyword?: string;
  readonly scalpType?: ScalpType | 'all';
  readonly minHealthScore?: number;
  readonly dateSort?: 'newest' | 'oldest';
}
