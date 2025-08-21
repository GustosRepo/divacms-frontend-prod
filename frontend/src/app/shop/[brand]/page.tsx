import { redirect } from 'next/navigation';

const validBrands = new Set(['nails','toys','accessories']);

export default function BrandShopRoute({ params }: { params: { brand: string } }) {
  const brand = params.brand.toLowerCase();
  if (!validBrands.has(brand)) {
    // fallback to hub if invalid brand
    redirect('/shop');
  }
  redirect(`/shop?brand_segment=${brand}`);
}
