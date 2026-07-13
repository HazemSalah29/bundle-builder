import type { Product, Step } from "../data/types";

export type QtyMap = Record<string, number>;
export type ActiveVariantMap = Record<string, string>;

export const CATEGORY_ORDER: Product["category"][] = [
  "camera",
  "sensor",
  "accessory",
  "plan",
];

export function makeQtyKey(productId: string, variantId?: string): string {
  return `${productId}:${variantId ?? "default"}`;
}

function productQtyKeys(product: Product): string[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants.map((variant) => makeQtyKey(product.id, variant.id));
  }
  return [makeQtyKey(product.id)];
}

export function getSelectedCountForStep(step: Step, qtyMap: QtyMap): number {
  return step.products.filter((product) =>
    productQtyKeys(product).some((key) => (qtyMap[key] ?? 0) > 0)
  ).length;
}

export type ReviewLine = {
  key: string;
  productId: string;
  variantId?: string;
  category: Product["category"];
  name: string;
  image: string;
  icon?: string;
  variantLabel?: string;
  swatchColor?: string;
  qty: number;
  unitPrice: number;
  unitCompareAtPrice?: number;
  lineTotal: number;
  lineCompareAtTotal: number;
  unit?: "mo";
  required?: boolean;
};

export type ReviewLinesByCategory = Partial<Record<Product["category"], ReviewLine[]>>;

export function getReviewLines(catalog: Step[], qtyMap: QtyMap): ReviewLinesByCategory {
  const grouped: ReviewLinesByCategory = {};

  for (const category of CATEGORY_ORDER) {
    const lines: ReviewLine[] = [];

    for (const step of catalog) {
      for (const product of step.products) {
        if (product.category !== category) continue;

        const variants = product.variants ?? [undefined];
        for (const variant of variants) {
          const key = makeQtyKey(product.id, variant?.id);
          const qty = qtyMap[key] ?? 0;
          if (qty <= 0) continue;

          const unitCompareAtPrice = product.compareAtPrice;
          lines.push({
            key,
            productId: product.id,
            variantId: variant?.id,
            category: product.category,
            name: product.name,
            image: product.image,
            icon: step.icon,
            variantLabel: variant?.label,
            swatchColor: variant?.swatchColor,
            qty,
            unitPrice: product.price,
            unitCompareAtPrice,
            lineTotal: product.price * qty,
            lineCompareAtTotal: (unitCompareAtPrice ?? product.price) * qty,
            unit: product.unit,
            required: product.required,
          });
        }
      }
    }

    if (lines.length > 0) {
      grouped[category] = lines;
    }
  }

  return grouped;
}

export type Totals = {
  compareAtTotal: number;
  activeTotal: number;
  savings: number;
  financingPerMonth: number;
};

export function getTotals(
  reviewLines: ReviewLinesByCategory,
  shipping: { price: number; compareAtPrice?: number }
): Totals {
  const lines = Object.values(reviewLines).flat() as ReviewLine[];

  const compareAtTotal = lines.reduce((sum, line) => sum + line.lineCompareAtTotal, 0);
  const activeTotal =
    lines.reduce((sum, line) => sum + line.lineTotal, 0) + shipping.price;

  return {
    compareAtTotal,
    activeTotal,
    savings: compareAtTotal - activeTotal,
    financingPerMonth: activeTotal / 12,
  };
}
