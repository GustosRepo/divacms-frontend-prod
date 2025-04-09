import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// 🔐 Decode user from JWT (if logged in)
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Decoded user from token:", decoded);
    return decoded;
  } catch (err) {
    console.error("❌ Invalid token", err);
    return null;
  }
};

// 🎯 Create Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("🛠 Incoming Checkout Data:", req.body);

    const { items } = req.body;
    const user = getUserFromToken(req); // ← must be called before metadata
    console.log("🔑 Decoded user before metadata:", user);
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [
            item.image.startsWith("http")
              ? item.image
              : `${process.env.FRONTEND_URL}${item.image}`,
          ],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    console.log("✅ Line Items for Stripe:", lineItems);
    

    const metadata = {
      userId: user?.userId || "guest",
      email: user?.email || "guest@example.com",
    };

    console.log("📤 Stripe metadata being sent:", metadata);
    console.log("📦 Final metadata to Stripe:", {
      userId: user?.userId,
      email: user?.email,
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata,
      customer_email: user?.email || undefined,
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ message: "Failed to create checkout session", error: error.message });
  }
});

export default router;