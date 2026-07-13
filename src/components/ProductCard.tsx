'use client';

import Image from 'next/image';
import { useSelection } from '../state/selectionStore';
import { VariantChips } from './VariantChips';
import { QuantityStepper } from './QuantityStepper';
import { formatPrice } from '../lib/formatPrice';
import type { Product } from '../data/types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { getQty, setQty, getActiveVariantId, setActiveVariantId } =
    useSelection();

  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const activeVariantId = hasVariants
    ? getActiveVariantId(product.id)
    : undefined;

  const isSelected = hasVariants
    ? variants.some((variant) => getQty(product.id, variant.id) > 0)
    : getQty(product.id) > 0;

  const qty = hasVariants
    ? getQty(product.id, activeVariantId)
    : getQty(product.id);

  const handleQtyChange = (nextQty: number) => {
    setQty(product.id, hasVariants ? activeVariantId : undefined, nextQty);
  };

  const titleClass = product.compact
    ? 'text-product-title-sm'
    : 'text-product-title';
  const descriptionClass = product.compact
    ? 'text-product-description-sm'
    : 'text-product-description';

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-card bg-surface p-3 ${
        isSelected ? 'border-2 border-primary' : 'border border-border'
      }`}
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 rounded-badge bg-primary px-1.5 py-0.5 text-badge text-primary-text-on">
          {product.badge}
        </span>
      )}
      <div className="flex gap-3 w-full">
        <div className="relative aspect-square w-26 shrink-0 overflow-hidden rounded-image">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
          <h3 className={`${titleClass} text-ink`}>{product.name}</h3>

          {product.description && (
            <div className="flex flex-col gap-1">
              <p className={`${descriptionClass} text-body gap-1`}>
                {product.description}
                <a
                  href="#"
                  className={`${descriptionClass} text-primary underline`}
                >
                  Learn More
                </a>
              </p>
            </div>
          )}
          {hasVariants && activeVariantId && (
            <VariantChips
              variants={variants}
              activeVariantId={activeVariantId}
              onSelect={(variantId) =>
                setActiveVariantId(product.id, variantId)
              }
            />
          )}
          <div className="mt-auto flex items-center justify-between gap-3">
            {product.required ? (
              <span className="text-stepper-count text-ink tabular-nums">
                {qty}
              </span>
            ) : (
              <QuantityStepper qty={qty} onChange={handleQtyChange} />
            )}
            <div className="flex flex-col items-baseline gap-2">
              {product.compareAtPrice !== undefined && (
                <span className="text-price-compare text-danger-strike line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="text-price-active text-ink">
                {formatPrice(product.price)}
                {product.unit ? `/${product.unit}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
