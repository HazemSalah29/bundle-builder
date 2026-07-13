'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSelection } from '../state/selectionStore';
import { getReviewLines, getTotals, CATEGORY_ORDER } from '../state/derive';
import { ReviewLine } from './ReviewLine';
import type { Product } from '../data/types';

const CATEGORY_LABELS: Record<Product['category'], string> = {
  camera: 'Cameras',
  sensor: 'Sensors',
  accessory: 'Accessories',
  plan: 'Plan',
};

export function ReviewPanel() {
  const { catalog, qtyMap, save } = useSelection();
  const { steps, shipping, guaranteeBadgeImage } = catalog;
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] =
    useState(false);
  const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);

  const reviewLines = getReviewLines(steps, qtyMap);
  const totals = getTotals(reviewLines, shipping);
  const hasAnyLines = Object.keys(reviewLines).length > 0;

  const handleCheckout = () => {
    setShowCheckoutConfirmation(true);
  };

  const handleSave = () => {
    save();
    setShowSavedConfirmation(true);
    setTimeout(() => setShowSavedConfirmation(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 rounded-card bg-page-tint p-6">
      <span className="text-eyebrow uppercase tracking-wide text-muted">
        Review
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-ink font-medium text-[22px]">
          Your security system
        </h2>
        <p className=" text-body text-[14px]">
          Review your personalized protection system designed to keep what
          matters most safe.
        </p>
      </div>

      {hasAnyLines && (
        <div className="flex flex-col">
          {CATEGORY_ORDER.filter(
            (category) => reviewLines[category]?.length,
          ).map((category) => (
            <div
              key={category}
              className="flex flex-col border-t border-[#CED6DE] py-2"
            >
              <span className="text-review-category uppercase tracking-wide text-label-faint">
                {CATEGORY_LABELS[category]}
              </span>
              <div className="flex flex-col">
                {reviewLines[category]!.map((line) => (
                  <ReviewLine key={line.key} line={line} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-[#CED6DE] py-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-image bg-surface">
          <img src={shipping.icon} alt="shipping" className="h-7 w-7" />
        </div>
        <span className="flex-1 text-review-item-name text-ink">
          {shipping.label}
        </span>
        <div className="flex w-20 flex-col items-end gap-0.5 text-right">
          <span className="text-review-item-price text-muted-2 line-through">
            ${shipping.compareAtPrice.toFixed(2)}
          </span>
          <span className="text-review-item-price text-primary">FREE</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <Image
          src={guaranteeBadgeImage}
          alt="100% Wyze satisfaction guarantee"
          width={78}
          height={78}
        />
        <div className="flex flex-1 flex-col items-end gap-2">
          <span className="rounded-[3px] bg-primary px-2 py-1 text-[12px] text-primary-text-on">
            as low as ${totals.financingPerMonth.toFixed(2)}/mo
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[18px] text-muted-2 line-through">
              ${totals.compareAtTotal.toFixed(2)}
            </span>
            <span className="text-[24px] text-[#4E2FD2] font-bold">
              ${totals.activeTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {totals.savings > 0 && (
        <p className="text-[12px] text-center text-success">
          Congrats! You&apos;re saving ${totals.savings.toFixed(2)} on your
          security bundle!
        </p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        className="rounded-button bg-primary px-4 py-3 text-[14px] text-primary-text-on"
      >
        Checkout
      </button>

      {showCheckoutConfirmation && (
        <p className="text-[12px] text-center text-success" role="status">
          Thanks! This is a demo checkout — no order was placed.
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="self-center text-save-link italic text-muted underline"
      >
        Save my system for later
      </button>

      {showSavedConfirmation && (
        <p className="self-center text-save-link text-success" role="status">
          Saved!
        </p>
      )}
    </div>
  );
}
