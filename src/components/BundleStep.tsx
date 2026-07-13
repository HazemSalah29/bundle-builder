'use client';

import Image from 'next/image';
import { useSelection } from '../state/selectionStore';
import { getSelectedCountForStep } from '../state/derive';
import { ProductCard } from './ProductCard';
import type { Step } from '../data/types';

type BundleStepProps = {
  step: Step;
  nextStep?: Step;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <Image
      src={'/icons/carrot-up.svg'}
      alt=""
      width={12}
      height={12}
      className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
    />
  );
}

export function BundleStep({ step, nextStep }: BundleStepProps) {
  const { qtyMap, isStepExpanded, toggleStep, setStepExpanded } =
    useSelection();
  const expanded = isStepExpanded(step.id);
  const selectedCount = getSelectedCountForStep(step, qtyMap);

  const handleNext = () => {
    setStepExpanded(step.id, false);
    if (nextStep) {
      setStepExpanded(nextStep.id, true);
    }
  };

  const panelId = `step-panel-${step.id}`;

  return (
    <div className={`rounded-card ${expanded ? 'bg-page-tint' : 'bg-surface'}`}>
      <span className="text-eyebrow uppercase tracking-wide text-muted px-4 py-2 block">
        STEP {step.order} OF 4
      </span>
      <button
        type="button"
        onClick={() => toggleStep(step.id)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={`flex w-full items-center gap-3 px-3.75 py-5 text-left border-t ${expanded ? '' : 'border-b'}`}
      >
        {step.icon && <Image src={step.icon} alt="" width={26} height={26} />}
        <span className="flex flex-1 flex-col gap-1">
          <span className="text-[18px] md:text-[22px] text-ink">
            {step.title}
          </span>
        </span>
        <span className="flex items-center gap-2 text-step-state text-[#4E2FD2]">
          {selectedCount} selected
          <ChevronIcon expanded={expanded} />
        </span>
      </button>

      {expanded && (
        <div
          id={panelId}
          className="flex flex-col items-center w-full gap-4 px-4 pb-5"
        >
          <div className="sm:flex sm:flex-col md:grid md:grid-cols-2 gap-3.75 w-full">
            {step.products.map((product, index) => {
              const isLastOdd =
                index === step.products.length - 1 &&
                step.products.length % 2 !== 0;
              return (
                <div
                  key={product.id}
                  className={
                    isLastOdd ? 'col-span-2 flex justify-center' : 'contents'
                  }
                >
                  <div
                    className={
                      isLastOdd ? 'md:w-[calc(50%-0.46875rem)]' : 'contents'
                    }
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              );
            })}
          </div>
          {nextStep && (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-button border border-primary px-4 py-2 text-next-button text-primary"
            >
              Next: {nextStep.title}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
