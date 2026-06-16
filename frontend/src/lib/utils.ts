export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function imageSrc(url: string | null | undefined, apiUrl: string) {
  if (!url) return '/placeholder-product.svg';
  if (url.startsWith('http') || url.startsWith('/placeholder')) return url;
  if (url.startsWith('/uploads')) return `${apiUrl}${url}`;
  return url;
}

export const CATEGORIES = [
  'All',
  'Sarees',
  'Kurtis',
  'Ethnic',
  'Dupattas',
  'Men',
  'Kids',
  'Home',
  'Beauty',
];

export const ORDER_STATUSES = [
  'Order Placed',
  'Packed',
  'Shipped',
  'Out For Delivery',
  'Delivered',
] as const;
