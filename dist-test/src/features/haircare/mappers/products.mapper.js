"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToHairProductVM = mapToHairProductVM;
exports.mapToHairProductVMs = mapToHairProductVMs;
const CATEGORY_LABELS = {
    shampoo: 'Shampoo',
    conditioner: 'Conditioner',
    oil: 'Hair Oil',
    serum: 'Scalp Serum',
    mask: 'Deep Mask',
    treatment: 'Treatment',
    custom: 'Custom Product',
};
function mapToHairProductVM(product) {
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
function mapToHairProductVMs(products) {
    return products.map(mapToHairProductVM);
}
