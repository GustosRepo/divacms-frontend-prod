import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg w-[280px] md:w-[250px] lg:w-[220px]">
      <Image
        src={
          product.image && product.image.startsWith("http")
            ? product.image
            : `http://localhost:3001/uploads/placeholder.jpg`
        }
        alt={product.title}
        width={220}  // Adjusted width
        height={220} // Adjusted height
        className="rounded-lg object-cover"
      />
      <h3 className="font-bold mt-2">{product.title}</h3>
      <p className="text-gray-500">{product.description}</p>
      <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
    </div>
  );
}