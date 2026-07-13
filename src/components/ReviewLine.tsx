'use client';

import Image from 'next/image';
import { useSelection } from '../state/selectionStore';
import { QuantityStepper } from './QuantityStepper';
import { formatPrice } from '../lib/formatPrice';
import type { ReviewLine as ReviewLineData } from '../state/derive';

type ReviewLineProps = {
  line: ReviewLineData;
};

export function ReviewLine({ line }: ReviewLineProps) {
  const { setQty } = useSelection();
  const {
    productId,
    variantId,
    category,
    name,
    image,
    qty,
    lineTotal,
    unitCompareAtPrice,
    lineCompareAtTotal,
    unit,
    required,
  } = line;
  const isPlan = category === 'plan';

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className={`relative  shrink-0 overflow-hidden rounded-image ${isPlan ? '' : 'bg-white h-12 w-12'}`}
      >
        {!isPlan ? (
          <Image src={image} alt={name} fill className="object-contain" />
        ) : (
          <Image
            src={image}
            alt={name}
            width={20}
            height={20}
            className="object-contain"
          />
        )}
      </div>

      <span
        className={`flex-1  leading-4 text-ink ${isPlan ? 'font-bold text-[16px]' : 'text-[14px]'}`}
      >
        {isPlan && name.includes('Unlimited')
          ? name.split(/(Unlimited)/).map((part, index) =>
              part === 'Unlimited' ? (
                <span key={index} style={{ color: '#4E2FD2' }}>
                  {part}
                </span>
              ) : (
                part
              ),
            )
          : name}
      </span>
      <div className="flex flex-row gap-4">
        {!isPlan && (
          <QuantityStepper
            qty={qty}
            onChange={(nextQty) => setQty(productId, variantId, nextQty)}
            disabled={required}
          />
        )}

        <div className="flex w-10 flex-col items-end gap-0.5 text-right justify-center">
          {unitCompareAtPrice !== undefined && (
            <span className="text-review-item-price text-muted-2 line-through">
              ${lineCompareAtTotal.toFixed(2)}
              {unit ? `/${unit}` : ''}
            </span>
          )}
          <span className="text-review-item-price text-primary">
            {formatPrice(lineTotal)}
            {unit ? `/${unit}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
