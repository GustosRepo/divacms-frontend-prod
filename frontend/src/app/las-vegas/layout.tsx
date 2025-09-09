import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Labubu Collectibles, Kawaii Boutique & Y2K Nails Las Vegas | Diva Factory",
  description: "Vegas&apos;s premier kawaii destination! Labubu collectibles, Pop Mart blind boxes, Y2K boutique accessories & custom press-on nails. Local pickup available.",
  keywords: "Labubu Las Vegas, Pop Mart Vegas, kawaii boutique Vegas, Y2K nails Las Vegas, collectibles Nevada, kawaii accessories, designer toys Vegas",
  openGraph: {
    title: "Labubu Collectibles, Kawaii Boutique & Nails Las Vegas | Diva Factory",
  description: "Vegas&apos;s kawaii paradise! Labubu collectibles, kawaii boutique accessories, and Y2K nails with fast local delivery.",
  },
};

export default function LasVegasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
