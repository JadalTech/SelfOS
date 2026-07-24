import type { SkincareProduct, SkincareProductVM } from '../types';
import { PRODUCT_CATEGORY_OPTIONS, PRODUCT_TYPE_OPTIONS } from '../constants/skincare.constants';
import { calculateProductExpiry } from '../engine/skincareEngine';

export function mapToSkincareProductVM(product: SkincareProduct): SkincareProductVM {
  const categoryOption = PRODUCT_CATEGORY_OPTIONS.find((c) => c.value === product.category);
  const typeOption = PRODUCT_TYPE_OPTIONS.find((t) => t.value === product.type);

  const categoryLabel = categoryOption ? categoryOption.label : product.category;
  const typeLabel = typeOption ? typeOption.label : product.type;

  const ingredientsListFormatted =
    product.keyIngredients && product.keyIngredients.length > 0
      ? product.keyIngredients.join(', ')
      : 'No active ingredients listed';

  const openedDateFormatted = product.openedDate
    ? product.openedDate.toISOString().split('T')[0]
    : undefined;

  const expiryInfo = calculateProductExpiry(product.openedDate, product.shelfLifeMonths);

  let expiryStatusLabel: string | undefined;
  if (expiryInfo.status === 'expired') {
    expiryStatusLabel = 'Expired';
  } else if (expiryInfo.status === 'expiring-soon' && expiryInfo.daysRemaining !== null) {
    expiryStatusLabel = `Expires in ${expiryInfo.daysRemaining} days`;
  } else if (expiryInfo.expiryDate) {
    expiryStatusLabel = `Expires ${expiryInfo.expiryDate.toISOString().split('T')[0]}`;
  }

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    categoryLabel,
    type: product.type,
    typeLabel,
    keyIngredients: product.keyIngredients || [],
    ingredientsListFormatted,
    openedDateFormatted,
    expiryDateFormatted: expiryInfo.expiryDate ? expiryInfo.expiryDate.toISOString().split('T')[0] : undefined,
    expiryStatus: expiryInfo.status,
    expiryStatusLabel,
    isFavorite: product.isFavorite,
    isActive: product.isActive,
    notes: product.notes,
  };
}

export function mapToSkincareProductVMs(products: SkincareProduct[]): SkincareProductVM[] {
  return products.map(mapToSkincareProductVM);
}
