// ============================================================================
// Twilio WhatsApp Helper
// ============================================================================
// Handles Twilio webhook signature validation and TwiML response generation.
// ============================================================================

import twilio from 'twilio';
import type { UseCase } from '@/types';

// ── Signature validation ─────────────────────────────────────────────────────

/**
 * Validates that a webhook request truly came from Twilio (not a spoofed request).
 * This is critical for production security.
 *
 * @param url        Full URL of your webhook (e.g., https://yourapp.vercel.app/api/whatsapp)
 * @param params     Parsed form body from Twilio
 * @param signature  Value of the X-Twilio-Signature header
 */
export function validateTwilioRequest(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error('TWILIO_AUTH_TOKEN is not set — skipping validation');
    return false;
  }
  return twilio.validateRequest(authToken, signature, url, params);
}

// ── TwiML response builder ───────────────────────────────────────────────────

/**
 * Creates a TwiML XML response that Twilio will use to send a WhatsApp message.
 *
 * @param message  The bot's reply text
 * @returns        TwiML XML string
 */
export function createTwiMLResponse(message: string): string {
  const { MessagingResponse } = twilio.twiml;
  const response = new MessagingResponse();

  // Truncate to WhatsApp's 1600 char limit
  const truncated =
    message.length > 1500
      ? message.slice(0, 1497) + '...'
      : message;

  response.message(truncated);
  return response.toString();
}

// ── Use case routing ─────────────────────────────────────────────────────────

/**
 * Determines which use case to use based on keywords in the incoming WhatsApp message.
 *
 * In production, you could look up the sender's phone number in a database
 * to know which configured bot they belong to.
 *
 * @param body  The raw text body of the WhatsApp message
 */
export function detectUseCaseFromMessage(body: string): UseCase {
  const lower = body.toLowerCase();

  // E-commerce keywords (English + Bangla)
  const ecommerceKeywords = [
    'order', 'delivery', 'track', 'shipping', 'product', 'purchase', 'cancel', 'refund',
    'অর্ডার', 'ডেলিভারি', 'ট্র্যাক', 'শিপিং', 'পণ্য', 'ক্রয়', 'বাতিল', 'ফেরত',
  ];

  const hasEcommerceKeyword = ecommerceKeywords.some((kw) => lower.includes(kw));

  if (hasEcommerceKeyword) return 'ecommerce';

  // Default to real estate
  return 'realestate';
}
