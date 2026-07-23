export type ProductCategory =
  | 'shampoo'
  | 'conditioner'
  | 'oil'
  | 'serum'
  | 'mask'
  | 'treatment'
  | 'custom';

export interface HairProduct {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly brand: string;
  readonly category: ProductCategory;
  readonly isFavorite: boolean;
  readonly isActive: boolean;
  readonly notes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
