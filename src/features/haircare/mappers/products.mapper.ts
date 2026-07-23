import type { HairProduct, HairProductVM } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  shampoo: 'Shampoo',
  conditioner: 'Conditioner',
  oil: 'Hair Oil',
  serum: 'Scalp Serum',
  mask: 'Deep Mask',
  treatment: 'Treatment',
  custom: 'Custom Product',
};

export function mapToHairProductVM(product: HairProduct): HairProductVM {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    categoryLabel: CATEGORY_LABELS[product.category] ?? 'Product',
    isFavorite: product.isFavorite,
    isActive: product.isActive,
    notes: product.notes,
  };
}

export function mapToHairProductVMs(products: HairProduct[]): HairProductVM[] {
  return products.map(mapToHairProductVM);
}
