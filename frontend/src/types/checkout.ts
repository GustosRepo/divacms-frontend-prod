// ✅ Define Shipping & Checkout Form Data
export interface CheckoutFormData {
  cartItems: CartItem[]; // items in the cart
  pointsUsed: number; // ✅ New field for points redemption (frontend uses number)
  points: number; // ✅ User points balance
  shippingInfo: {
    name: string;
    phone?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

// ✅ Define Order Data Structure
export interface OrderData {
  orderId?: string; // backend-generated
  userId: string;
  email: string;
  items: CartItem[];
  // monetary fields in frontend are represented as numbers in major currency units (e.g. dollars)
  subtotal: number; // pre-tax, pre-shipping total
  taxAmount: number; // tax charged
  shippingFee: number; // shipping charged
  totalAmount: number; // final charged amount
  status: string;
  trackingCode?: string;
  estimatedDelivery?: string;
  pointsUsed: number; // points consumed on this order
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt?: string; // ISO timestamp
  shippingInfo: {
    name: string;
    phone?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}