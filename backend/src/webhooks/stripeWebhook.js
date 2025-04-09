import Stripe from "stripe";
import dotenv from "dotenv";
import getRawBody from "raw-body";
import sendEmail from "../services/emailServices.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

dotenv.config();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// ✅ Stripe Webhook Handler
export const stripeWebhookHandler = async (req, res) => {
  console.log("🚀 Incoming Stripe Webhook");

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error("❌ Stripe signature header missing");
    return res.status(400).send("Missing Stripe signature");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Stripe signature verified:", event.type);
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ Handle the event
  try {
    if (event.type === "checkout.session.completed") {
      await processCheckoutSession(event.data.object);
    } else {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Error handling Stripe event:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const processCheckoutSession = async (session) => {
  console.log("📦 Processing session:", session.id);
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (existingOrder) {
      console.log("⚠️ Order already exists for session:", session.id);
      return;
    }

    const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "customer_details"],
    });

    const userId = session.metadata?.userId || null;
    console.log("📦 Session metadata:", session.metadata);

    const lineItems = sessionDetails.line_items.data;

    console.log("🧾 Extracted userId:", userId);
    console.log("🧾 Total amount (cents):", session.amount_total);
    console.log("📦 Line items:", JSON.stringify(lineItems, null, 2));

    const orderData = {
      email:
        session.customer_email ||
        session.customer_details?.email ||
        session.metadata?.email ||
        "guest@example.com",
      stripeSessionId: session.id,
      totalAmount: session.amount_total / 100,
      status: "Paid",
      trackingCode: "Processing",
      shippingInfo: {},
      address: session.customer_details?.address?.line1 || null,
      city: session.customer_details?.address?.city || null,
      country: session.customer_details?.address?.country || null,
      zip: session.customer_details?.address?.postal_code || null,
    };

    if (userId && userId !== "guest") {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      if (!isUUID) {
        console.warn("⚠️ Invalid userId format:", userId);
      } else {
        orderData.userId = userId;
        console.log("✅ userId added to orderData:", userId);
      }
    }

    console.log("📄 Final Order Data:", orderData);

    let order;
    try {
      order = await prisma.order.create({ data: orderData });
      console.log("✅ Order created in DB:", order.id);
    } catch (err) {
      console.error("❌ Failed to create order in DB:", err);
      return;
    }

    for (const item of lineItems) {
      console.log("🔍 Processing item:", item.description);

      const product = await prisma.product.findUnique({
        where: { title: item.description },
      });

      if (!product) {
        console.warn("⚠️ Product not found:", item.description);
        continue;
      }

      const pricePerUnit = item.price?.unit_amount
        ? item.price.unit_amount / 100
        : order.totalAmount / item.quantity;

      try {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: pricePerUnit,
          },
        });
        console.log("➕ Added OrderItem for:", product.title);
      } catch (err) {
        console.error("❌ Failed to create orderItem:", err);
      }
    }

    try {
      await sendEmail(
        order.email,
        "Order Confirmation",
        `Thank you for your order 💅 Your tracking number is: ${order.trackingCode}`
      );

      await sendEmail(
        process.env.ADMIN_EMAIL || "admin@example.com",
        "🛍️ New Order Received",
        `A new order has been placed for $${order.totalAmount}.`
      );

      console.log("📧 Order confirmation emails sent");
    } catch (err) {
      console.error("❌ Failed to send confirmation emails:", err);
    }
  } catch (err) {
    console.error("❌ Error in processCheckoutSession:", err);
  }
};

