import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Diva Factory | Press-On Nails, Toys & Boutique",
  description: "Browse our complete collection of luxury press-on nails, collectible toys, and kawaii boutique accessories. Filter by brand and category to find your perfect Y2K aesthetic.",
  openGraph: {
    title: "Shop Diva Factory | Press-On Nails, Toys & Boutique",
    description: "Browse our complete collection of luxury press-on nails, collectible toys, and kawaii boutique accessories.",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
