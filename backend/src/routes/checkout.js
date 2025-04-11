import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pkg from "@prisma/client";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

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

let promoCodeId = null; // Added declaration here

// 🎯 Create Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("🛠 Incoming Checkout Data:", req.body);

    const { items } = req.body;
    const user = getUserFromToken(req);

    // 🧮 If user has 100+ points, generate and offer a coupon
    if (user && user.userId && user.userId !== "guest") {
      const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
      if (dbUser && (dbUser.points || 0) >= 100) {
        const couponCode = `DIVA-${user.userId.slice(0, 6).toUpperCase()}`;

        try {
          const promos = await stripe.promotionCodes.list({ active: true });
          const existingPromo = promos.data.find((p) => p.code === couponCode);

          if (existingPromo) {
            promoCodeId = existingPromo.id;
            console.log("🎟️ Existing promo code found:", couponCode);
          } else {
            // 🔧 Create a new coupon and promo code
            const coupon = await stripe.coupons.create({
              percent_off: 10,
              duration: "once",
            });

            const promo = await stripe.promotionCodes.create({
              code: couponCode,
              coupon: coupon.id,
              max_redemptions: 1,
            });

            promoCodeId = promo.id;

            // 🔻 Deduct 100 points once a new promo is generated
            await prisma.user.update({
              where: { id: user.userId },
              data: {
                points: {
                  decrement: 100,
                },
              },
            });

            console.log("🎁 New promo code generated and 100 points deducted:", couponCode);
          }
        } catch (err) {
          console.error("❌ Error generating or checking promo codes:", err);
        }
      }
    }

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

    // ✅ Include metadata without discounted total calculation
    const metadata = {
      userId: user?.userId || "guest",
      email: user?.email || "guest@example.com",
      items: JSON.stringify(items),
      totalAmount: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    const sessionPayload = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata,
      customer_email: user?.email || undefined,
    };

    if (promoCodeId) {
      sessionPayload.discounts = [{ promotion_code: promoCodeId }];
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
});

// ✅ New route to finalize points AFTER redirect
router.post("/finalize-points", async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;
    const totalAmount = session.amount_total / 100;
    const appliedPromoCode = session.total_details?.breakdown?.discounts?.[0]?.promotion_code;
    const expectedPromoCode = `DIVA-${userId.slice(0, 6).toUpperCase()}`;
    const usedDiscount = appliedPromoCode === expectedPromoCode;
    const pointsEarned = Math.floor(totalAmount);
    
    console.log("🔍 Finalizing points...");
    console.log("👤 userId:", userId);
    console.log("💸 totalAmount:", totalAmount);
    console.log("💰 pointsEarned:", pointsEarned);

    if (!userId || userId === "guest") {
      return res.status(200).json({ message: "Guest checkout – no points updated." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPoints = Math.max(0, (user.points || 0) + pointsEarned - (usedDiscount ? 100 : 0));

    await prisma.user.update({
      where: { id: userId },
      data: { points: newPoints },
    });

    console.log(`🟢 Final points for user ${userId}: ${newPoints}`);
    res.json({ success: true, newPoints, promoCode: usedDiscount ? expectedPromoCode : null });
  } catch (err) {
    console.error("❌ Error finalizing points:", err);
    res.status(500).json({ message: "Failed to finalize points" });
  }
});

export default router;