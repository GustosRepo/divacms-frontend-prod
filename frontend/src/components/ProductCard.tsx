import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const resolveImageSrc = (img?: string): string => {
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    // Absolute URL provided by storage/CDN
    if (img && /^https?:\/\//i.test(img)) return img;
    // Use provided relative path if present, otherwise fallback to placeholder
    if (img && img.trim()) {
      const path = img.startsWith("/") ? img : `/uploads/${img}`;
      return `${base}${path}`;
    }
    return `${base}/uploads/placeholder.jpg`;
  };

  return (
  <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-[250px] lg:max-w-[220px] mx-auto">
      <div className="w-full aspect-square overflow-hidden flex items-center justify-center bg-gray-100">
        <Image
          src={resolveImageSrc(product.image)}
          alt={product.title}
          width={220}
          height={220}
          className="rounded-lg object-cover w-full h-full"
          priority
        />
      </div>
      <h3 className="font-shuneva font-bold mt-2 break-words text-base md:text-lg">{product.title}</h3>
      <p className="font-shuneva  break-words text-sm md:text-base">{product.description}</p>
      <p className="font-shuneva font-bold mt-1 text-pink-500 text-base md:text-lg">${product.price.toFixed(2)}</p>
    </div>
  );
}