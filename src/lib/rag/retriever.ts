// ============================================================================
// RAG Retriever
// ============================================================================
// Creates a LangChain retriever from the Pinecone vector store.
// Routes to the correct namespace based on the active use case.
// ============================================================================

import { getVectorStore } from '@/lib/vectorstore/pinecone';
import type { UseCase } from '@/types';

/**
 * Returns a retriever for the specified use case.
 *
 * The retriever performs a cosine similarity search in Pinecone,
 * returning the top-k most relevant document chunks.
 *
 * @param useCase   "ecommerce" | "realestate"
 * @param k         Number of chunks to retrieve (default: 4)
 */
export async function getRetriever(
  useCase: UseCase,
  k = 4
) {
  // Each use case maps to its own Pinecone namespace
  const namespace = useCase; // "ecommerce" | "realestate"

  const vectorStore = await getVectorStore(namespace);

  return vectorStore.asRetriever({
    k,
    searchType: 'similarity',
    // Optional: filter by metadata fields (e.g., only delivered orders)
    // filter: { status: 'delivered' },
  });
}

/**
 * Retrieves raw document chunks for a query.
 * Useful for debugging what the RAG chain "sees".
 *
 * @param query    User's natural language query
 * @param useCase  Which namespace to search
 * @param k        Number of results
 */
export async function retrieveDocuments(
  query: string,
  useCase: UseCase,
  k = 4
) {
  const retriever = await getRetriever(useCase, k);
  const docs = await retriever.invoke(query);

  return docs.map((doc) => ({
    content: doc.pageContent,
    metadata: doc.metadata,
    score: (doc as any)._distance ?? undefined,
  }));
}
