// ============================================================================
// PDF Document Loader — Real Estate Use Case
// ============================================================================
// Loads a PDF file, splits it into overlapping chunks, and ingests into
// the Pinecone "realestate" namespace.
//
// Uses LangChain's PDFLoader (powered by pdf-parse under the hood).
// ============================================================================

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { addDocumentsToPinecone } from '@/lib/vectorstore/pinecone';

/**
 * Ingests a PDF file into the Pinecone "realestate" namespace.
 *
 * @param filePath  Absolute path to the PDF file on the filesystem
 */
export async function ingestPDF(filePath: string): Promise<{ chunks: number }> {
  console.log(`\n📄 Loading PDF: ${filePath}`);

  // 1. Load PDF — splits by page by default
  const loader = new PDFLoader(filePath, { splitPages: true });
  const rawDocs = await loader.load();
  console.log(`   ↳ Loaded ${rawDocs.length} pages`);

  // 2. Split pages into overlapping chunks for better retrieval
  //    chunkSize=1000 chars ≈ ~200 tokens (fits in context window)
  //    chunkOverlap=200 preserves context across chunk boundaries
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });
  const docs = await splitter.splitDocuments(rawDocs);
  console.log(`   ↳ Split into ${docs.length} chunks`);

  // 3. Upsert into Pinecone
  await addDocumentsToPinecone(docs, 'realestate');

  return { chunks: docs.length };
}
