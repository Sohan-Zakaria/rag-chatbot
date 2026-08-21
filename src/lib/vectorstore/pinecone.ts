// ============================================================================
// Pinecone Vector Store
// ============================================================================
// Wraps the Pinecone client and exposes LangChain-compatible PineconeStore.
//
// NAMESPACES (within a single index):
//   "ecommerce"   — order data, product catalog
//   "realestate"  — PDF property listings
//
// ⚠ CREATE your Pinecone index first:
//   Name:      rag-chatbot
//   Dimension: 384
//   Metric:    cosine
// ============================================================================

import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import type { Document } from '@langchain/core/documents';
import { getEmbeddings } from './embeddings';

// ── Pinecone client singleton ────────────────────────────────────────────────
let _pinecone: Pinecone | null = null;

function getPineconeClient(): Pinecone {
  if (!_pinecone) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables.');
    }
    _pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  }
  return _pinecone;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a LangChain PineconeStore for the given namespace.
 * Used for QUERYING (retrieval).
 *
 * @param namespace  "ecommerce" | "realestate"
 */
export async function getVectorStore(namespace: string): Promise<PineconeStore> {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (!indexName) {
    throw new Error('PINECONE_INDEX_NAME is not set in environment variables.');
  }

  const index = client.Index(indexName);

  return PineconeStore.fromExistingIndex(getEmbeddings(), {
    pineconeIndex: index as any,
    namespace,
  });
}

/**
 * Ingests documents into Pinecone under the given namespace.
 * Used during the INGEST step (run once before chatting).
 *
 * @param documents  Array of LangChain Document objects
 * @param namespace  "ecommerce" | "realestate"
 */
export async function addDocumentsToPinecone(
  documents: Document[],
  namespace: string
): Promise<void> {
  if (documents.length === 0) {
    console.warn('addDocumentsToPinecone: no documents provided, skipping.');
    return;
  }

  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (!indexName) {
    throw new Error('PINECONE_INDEX_NAME is not set in environment variables.');
  }

  const index = client.Index(indexName);

  console.log(`📌 Upserting ${documents.length} documents → Pinecone [${indexName}/${namespace}]`);

  await PineconeStore.fromDocuments(documents, getEmbeddings(), {
    pineconeIndex: index as any,
    namespace,
  });

  console.log(`✅ Pinecone upsert complete for namespace: ${namespace}`);
}
