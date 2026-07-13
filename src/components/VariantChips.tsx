'use client';

import Image from 'next/image';
import type { Variant } from '../data/types';

type VariantChipsProps = {
  variants: Variant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
};

export function VariantChips({
  variants,
  activeVariantId,
  onSelect,
}: VariantChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(variant.id)}
            className={`flex items-center gap-1 rounded-tag border px-1.5 py-0.5 text-variant-chip text-body ${
              isActive ? 'border-primary' : 'border-border'
            }`}
          >
            {variant.icon ? (
              <Image
                src={variant.icon}
                alt=""
                width={22}
                height={22}
                className=" shrink-0 object-contain"
              />
            ) : (
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-border-light"
                style={{ backgroundColor: variant.swatchColor }}
              />
            )}
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
