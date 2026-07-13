'use client';

type QuantityStepperProps = {
  qty: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
};

export function QuantityStepper({
  qty,
  onChange,
  disabled = false,
}: QuantityStepperProps) {
  const canDecrement = !disabled && qty > 0;
  const canIncrement = !disabled;

  return (
    <div className="flex items-center gap-3 p-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        aria-disabled={!canDecrement}
        onClick={canDecrement ? () => onChange(qty - 1) : undefined}
        className={`flex h-5 w-5 items-center justify-center rounded-stepper bg-surface-alt text-sm leading-none ${
          canDecrement ? 'text-ink' : 'text-label-faint'
        }`}
      >
        −
      </button>
      <span className="text-stepper-count text-ink tabular-nums text-[16px] leading-5">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        aria-disabled={!canIncrement}
        onClick={canIncrement ? () => onChange(qty + 1) : undefined}
        className={`flex h-5 w-5 items-center justify-center rounded-stepper bg-surface-alt text-sm leading-none ${
          canIncrement ? 'text-ink' : 'text-label-faint'
        }`}
      >
        +
      </button>
    </div>
  );
}
