import { Router } from 'express';
import express from 'express';
import { protect } from '../../middleware/auth.js';
import {
  createCheckoutSession,
  confirmTestPayment,
  handleWebhook
} from '../../controllers/paymentController.js';

const router = Router();

// Stripe Webhook (needs raw body if verified with signature)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Protected payment endpoints
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/confirm-test-payment', protect, confirmTestPayment);

export default router;

