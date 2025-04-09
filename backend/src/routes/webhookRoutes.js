// /src/routes/webhookRoutes.js
import express from "express";
import { stripeWebhookHandler } from "../webhooks/stripeWebhook.js";

const router = express.Router();

// 🛑 DO NOT parse body here — this route expects raw body
router.post("/", express.raw({ type: "application/json" }), stripeWebhookHandler);

export default router;