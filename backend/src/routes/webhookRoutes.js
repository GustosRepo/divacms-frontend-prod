// /src/routes/webhookRoutes.js
import express from "express";
import { stripeWebhookHandler } from "../webhooks/stripeWebhook.js";

const router = express.Router();

// Raw body is applied in server.js for this mount path.
// Keeping it here too can break Stripe signature verification.
router.post("/", stripeWebhookHandler);

export default router;