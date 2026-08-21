// ============================================================================
// HuggingFace Embeddings — Free, No Credit Card
// ============================================================================
// Model: sentence-transformers/all-MiniLM-L6-v2
// Output: 384-dimensional vectors
// FREE tier: ~1000 req/day, ~100 req/min
//
// ⚠ PINECONE INDEX MUST be created with dimension=384, metric=cosine
// ============================================================================

import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

// Singleton — avoid re-creating the client on every request
let _embeddings: HuggingFaceInferenceEmbeddings | null = null;

/**
 * Returns a shared instance of the HuggingFace embeddings client.
 *
 * Uses `sentence-transformers/all-MiniLM-L6-v2`:
 * - 384 dimensions (lightweight, fast)
 * - Multilingual-aware (handles Bangla reasonably well)
 * - Free forever on HuggingFace Inference API
 */
export function getEmbeddings(): HuggingFaceInferenceEmbeddings {
  if (!_embeddings) {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY is not set in environment variables.');
    }

    _embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      // 384 dimensions — must match Pinecone index dimension
      model: 'sentence-transformers/all-MiniLM-L6-v2',
    });
  }

  return _embeddings;
}
