"use client";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Calculate subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-4xl p-6">
        <h1 className="font-shuneva text-4xl font-bold text-center">🛍️ YOUR CART</h1>
        <p className="text-center text-pink-400 mt-2">
          {cart.length > 0 ? `You have ${cart.length} item(s) in your cart!` : "Your cart is empty."}
        </p>

        {cart.length === 0 ? (
          <div className="text-center mt-6">
            <Link href="/shop" className="text-pink-400 underline">Continue Shopping</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {cart.map((product) => {
              const rawImage = product.image || "";
              const imageSrc = rawImage
                ? rawImage.startsWith("http")
                  ? rawImage
                  : `${process.env.NEXT_PUBLIC_API_URL}${rawImage}`
                : "/placeholder.jpg"; // fallback (ensure exists in public)
              return (
                <div key={product.id} className="flex items-center justify-between bg-black/20 p-4 rounded-lg shadow-lg">
                  <Image
                    src={imageSrc}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1 px-4">
                    <h2 className="font-shuneva text-lg font-bold">{product.title}</h2>
                    <p className="text-gray-300">${product.price.toFixed(2)} x {product.quantity}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center mt-2 space-x-2">
                      <label className="text-sm">Qty:</label>
                      <select
                        className="px-2 py-1 text-black rounded-lg bg-white shadow-md"
                        value={product.quantity}
                        onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                      >
                        {[...Array(10).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button className="text-red-500 text-sm mt-2" onClick={() => removeFromCart(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Subtotal */}
            <div className="bg-black/20 p-4 rounded-lg shadow-lg text-center text-xl font-bold">
              SUBTOTAL: <span className="text-pink-400">${subtotal.toFixed(2)}</span>
            </div>

            {/* Checkout & Clear Cart Buttons */}
            <div className="flex flex-col items-center gap-4">
              <button
                className="bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105 w-full max-w-xs"
                onClick={handleCheckout}
              >
                Checkout
              </button>

              <button
                className="bg-red-600 hover:bg-red-800 text-white px-16 py-1 rounded-lg text-lg shadow-md transition transform hover:scale-105 w-1/2 max-w-xs"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}