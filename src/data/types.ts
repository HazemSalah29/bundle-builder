export type Variant = {
  id: string;
  label: string;
  swatchColor: string;
  icon?: string;
};

export type Product = {
  id: string;
  category: "camera" | "sensor" | "accessory" | "plan";
  name: string;
  description: string;
  image: string;
  badge?: string;
  compareAtPrice?: number;
  price: number;
  unit?: "mo";
  variants?: Variant[];
  required?: boolean;
  /** Uses the small title/description type scale per design-tokens.md (only the Floodlight card in the source Figma file). */
  compact?: boolean;
};

export type Step = {
  id: string;
  order: number;
  title: string;
  icon?: string;
  products: Product[];
};

export type SeedSelection = {
  productId: string;
  variantId?: string;
  qty: number;
};

export type Shipping = {
  label: string;
  compareAtPrice: number;
  price: number;
  icon: string;
};

export type Catalog = {
  steps: Step[];
  seedSelections: SeedSelection[];
  shipping: Shipping;
  guaranteeBadgeImage: string;
};
