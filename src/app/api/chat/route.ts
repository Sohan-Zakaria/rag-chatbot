// ============================================================================
// POST /api/chat — Main RAG Chat Endpoint
// ============================================================================
// Flow:
//  1. Receive messages + useCase from the frontend
//  2. Detect language (Bangla or English) from the last user message
//  3. Retrieve relevant chunks from Pinecone
//  4. Build a bilingual system prompt with the retrieved context
//  5. Stream the LLM response (Groq → Gemini fallback)
//  6. Return a streaming text response via Vercel AI SDK
// ============================================================================

import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getRetriever } from '@/lib/rag/retriever';
import { buildSystemPrompt } from '@/lib/rag/prompts';
import { detectLanguage } from '@/lib/language/detect';
import type { UseCase } from '@/types';

// Vercel serverless function timeout (max 30s on free tier, 60s on Pro)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, useCase = 'ecommerce' } = body as {
      messages: { role: string; content: string }[];
      useCase: UseCase;
    };

    // Validate input
    if (!messages || messages.length === 0) {
      return Response.json({ error: 'messages array is required' }, { status: 400 });
    }

    // Get the latest user message for retrieval + language detection
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user')?.content ?? '';

    // ── Step 1: Detect language ──────────────────────────────────────────────
    const language = detectLanguage(lastUserMessage);
    console.log(`[chat] language=${language} useCase=${useCase} query="${lastUserMessage.slice(0, 60)}..."`);

    // ── Step 2: Retrieve context from Pinecone ───────────────────────────────
    let context = '';
    try {
      const retriever = await getRetriever(useCase as UseCase);
      const docs = await retriever.invoke(lastUserMessage);
      context = docs
        .map((doc, i) => `[Context ${i + 1}]\n${doc.pageContent}`)
        .join('\n\n---\n\n');
      console.log(`[chat] retrieved ${docs.length} chunks from Pinecone`);
    } catch (retrievalError) {
      // Non-fatal: continue without context (LLM will say it doesn't know)
      console.error('[chat] Pinecone retrieval failed:', retrievalError);
    }

    // ── Step 3: Build system prompt ──────────────────────────────────────────
    const systemPrompt = buildSystemPrompt(language, useCase as UseCase, context);

    // ── Step 4: Stream with Groq (primary) ───────────────────────────────────
    try {
      const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

      const result = await streamText({
        model: groq('groq/compound-mini'),
        system: systemPrompt,
        messages: messages as any,
        temperature: 0.3,    // Lower = more factual, less hallucination
        maxOutputTokens: 1024,
      });

      // Add language header so the frontend can style accordingly
      return result.toTextStreamResponse({
        headers: {
          'X-Response-Language': language,
          'X-Use-Case': useCase,
        },
      });
    } catch (groqError: any) {
      // ── Step 5: Fallback to Google Gemini ──────────────────────────────────
      console.warn('[chat] Groq failed, falling back to Gemini:', groqError.message);

      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

      const result = await streamText({
        model: google('gemini-3.6-flash'),
        system: systemPrompt,
        messages: messages as any,
        temperature: 0.3,
        maxOutputTokens: 1024,
      });

      return result.toTextStreamResponse({
        headers: {
          'X-Response-Language': language,
          'X-Use-Case': useCase,
          'X-LLM-Provider': 'gemini-fallback',
        },
      });
    }
  } catch (error: any) {
    console.error('[chat] Unhandled error:', error);
    return Response.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
