export function formatPrice(price: number): string {
  return price === 0 ? "FREE" : `$${price.toFixed(2)}`;
}
