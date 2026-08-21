// ============================================================================
// POST /api/ingest — Document Ingestion Endpoint
// ============================================================================
// Supports two ingestion modes:
//   1. PDF upload   → multipart/form-data with file + useCase=realestate
//   2. JSON trigger → application/json with { useCase: "ecommerce", filePath }
//
// Protected by INGEST_SECRET header — never expose this endpoint publicly
// without the secret.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { ingestPDF, ingestOrders } from '@/lib/ingest/pipeline';

// Vercel allows 60s for this heavy endpoint
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-ingest-secret');
  if (secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized — invalid ingest secret' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') ?? '';

  // ── Mode 1: PDF upload ─────────────────────────────────────────────────────
  if (contentType.includes('multipart/form-data')) {
    let tmpPath: string | null = null;

    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const useCase = formData.get('useCase') as string | null;

      if (!file) {
        return NextResponse.json({ error: 'file field is required' }, { status: 400 });
      }
      if (useCase !== 'realestate') {
        return NextResponse.json(
          { error: 'useCase must be "realestate" for PDF uploads' },
          { status: 400 }
        );
      }
      if (!file.name.endsWith('.pdf')) {
        return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
      }

      // Save to /tmp (Vercel's writable temp directory)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      tmpPath = path.join('/tmp', `ingest-${Date.now()}-${file.name}`);
      await writeFile(tmpPath, buffer);

      // Run ingestion pipeline
      const result = await ingestPDF(tmpPath);

      return NextResponse.json({
        success: true,
        message: `PDF ingested into Pinecone [realestate] namespace`,
        chunks: result.chunks,
        filename: file.name,
      });
    } catch (error: any) {
      console.error('[ingest] PDF ingestion failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
      // Clean up temp file
      if (tmpPath) {
        await unlink(tmpPath).catch(() => {});
      }
    }
  }

  // ── Mode 2: JSON order data ────────────────────────────────────────────────
  if (contentType.includes('application/json')) {
    try {
      const body = await req.json();
      const { useCase, filePath } = body as { useCase: string; filePath: string };

      if (useCase !== 'ecommerce') {
        return NextResponse.json(
          { error: 'useCase must be "ecommerce" for JSON ingestion' },
          { status: 400 }
        );
      }
      if (!filePath) {
        return NextResponse.json({ error: 'filePath is required' }, { status: 400 });
      }

      const result = await ingestOrders(filePath);

      return NextResponse.json({
        success: true,
        message: `Orders ingested into Pinecone [ecommerce] namespace`,
        orders: result.orders,
        chunks: result.chunks,
      });
    } catch (error: any) {
      console.error('[ingest] JSON ingestion failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: 'Content-Type must be multipart/form-data or application/json' },
    { status: 415 }
  );
}
