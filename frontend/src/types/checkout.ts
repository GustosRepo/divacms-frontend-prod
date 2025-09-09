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

// Shipping info used across admin and checkout views
export interface ShippingInfo {
  name?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  zip?: string | null;
  address?: string | null; // fallback single-line address
  pickup?: {
    reservation_expires_at?: string | null;
  } | null;
  customer?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    user_id?: string | null;
  } | null;
  // admin/payment fields
  payment_status?: string | null;
  payment_proof_url?: string | null;
  [key: string]: unknown;
}

// A light-weight admin order shape used in admin pages
export interface AdminOrder {
  id: string;
  customerEmail?: string | null;
  totalAmount?: number;
  status?: string;
  trackingCode?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zip?: string | null;
  shipping_info?: ShippingInfo | null;
  phone?: string | null;
}