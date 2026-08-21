// ============================================================================
// POST /api/whatsapp — Twilio WhatsApp Webhook
// ============================================================================
// Twilio sends an HTTP POST to this URL whenever someone messages your
// WhatsApp number. We reply with TwiML XML.
//
// Setup steps:
//   1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
//   2. Set Webhook URL to: https://your-app.vercel.app/api/whatsapp
//   3. Method: HTTP POST
//   4. Save and test by messaging the sandbox number on WhatsApp
// ============================================================================

import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  validateTwilioRequest,
  createTwiMLResponse,
  detectUseCaseFromMessage,
} from '@/lib/whatsapp/twilio';
import { getRetriever } from '@/lib/rag/retriever';
import { buildSystemPrompt } from '@/lib/rag/prompts';
import { detectLanguage } from '@/lib/language/detect';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // ── Parse Twilio form body ─────────────────────────────────────────────────
  // Twilio sends application/x-www-form-urlencoded
  const rawBody = await req.text();
  const params = Object.fromEntries(new URLSearchParams(rawBody));

  // ── Validate Twilio signature (security — skip in development) ─────────────
  if (process.env.NODE_ENV === 'production') {
    const signature = req.headers.get('x-twilio-signature') ?? '';
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp`;

    if (!validateTwilioRequest(webhookUrl, params, signature)) {
      console.warn('[whatsapp] Invalid Twilio signature — request rejected');
      return new Response('Forbidden', { status: 403 });
    }
  }

  const userMessage = (params.Body ?? '').trim();
  const fromNumber = params.From ?? 'unknown';

  console.log(`[whatsapp] Message from ${fromNumber}: "${userMessage.slice(0, 80)}"`);

  if (!userMessage) {
    return new Response(createTwiMLResponse('Please send a text message.'), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // ── Detect use case + language ─────────────────────────────────────────────
  const useCase = detectUseCaseFromMessage(userMessage);
  const language = detectLanguage(userMessage);

  // ── Retrieve context from Pinecone ─────────────────────────────────────────
  let context = '';
  try {
    const retriever = await getRetriever(useCase, 3); // fewer chunks for WhatsApp brevity
    const docs = await retriever.invoke(userMessage);
    context = docs.map((d) => d.pageContent).join('\n\n');
  } catch (err) {
    console.error('[whatsapp] Retrieval failed:', err);
  }

  // ── Build bilingual system prompt ─────────────────────────────────────────
  const systemPrompt = buildSystemPrompt(language, useCase, context);

  // WhatsApp-specific instruction: keep it short
  const whatsappSystem =
    systemPrompt +
    (language === 'bn'
      ? '\n\n📱 WhatsApp বার্তার জন্য: উত্তর ৩০০ শব্দের মধ্যে রাখুন।'
      : '\n\n📱 For WhatsApp: Keep the reply under 300 words.');

  // Default error message
  const errorMsg =
    language === 'bn'
      ? 'দুঃখিত, এই মুহূর্তে সেবা প্রদান করা সম্ভব হচ্ছে না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।'
      : 'Sorry, I am temporarily unavailable. Please try again shortly.';

  // ── Generate response (non-streaming — Twilio needs complete response) ──────
  let answer = errorMsg;

  try {
    // Groq primary
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    const result = await generateText({
      model: groq('groq/compound-mini'),
      system: whatsappSystem,
      prompt: userMessage,
      temperature: 0.3,
      maxOutputTokens: 500,
    });
    answer = result.text;
  } catch (groqError: any) {
    console.warn('[whatsapp] Groq failed, trying Gemini:', groqError.message);

    try {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
      const result = await generateText({
        model: google('gemini-3.6-flash'),
        system: whatsappSystem,
        prompt: userMessage,
        temperature: 0.3,
        maxOutputTokens: 500,
      });
      answer = result.text;
    } catch (geminiError: any) {
      console.error('[whatsapp] Both LLMs failed:', geminiError.message);
    }
  }

  // ── Return TwiML ──────────────────────────────────────────────────────────
  const twiml = createTwiMLResponse(answer);
  return new Response(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}
