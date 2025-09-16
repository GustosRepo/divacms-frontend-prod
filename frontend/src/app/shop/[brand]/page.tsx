import { redirect } from 'next/navigation';

const validBrands = new Set(['nails','toys','accessories']);

export default function BrandShopRoute(props: unknown) {
  const p = props as { params?: { brand?: string | string[] } };
  const params = p.params;
  const raw = Array.isArray(params?.brand) ? params.brand[0] : params?.brand;
  const brand = String(raw || '').toLowerCase();
  if (!validBrands.has(brand)) {
    // fallback to hub if invalid brand
    redirect('/shop');
  }
redirect(`/shop?brand_segment=${brand}&page=1`);
}
