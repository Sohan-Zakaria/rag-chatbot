#!/usr/bin/env tsx
// ============================================================================
// scripts/ingest-realestate.ts
// ============================================================================
// Run ONCE to load property listing text into Pinecone's "realestate" namespace.
//
// This script ingests the sample text file at data/realestate/listings.txt
// In production, replace with your own PDF using: npm run ingest:realestate
//
// Usage:
//   npm run ingest:realestate
//   -- or --
//   npx tsx --env-file=.env.local scripts/ingest-realestate.ts
// ============================================================================

import path from 'path';
import fs from 'fs';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { addDocumentsToPinecone } from '../src/lib/vectorstore/pinecone';

// We use a text file instead of PDF here so no PDF file is needed to get started.
// When you have a real PDF, use the ingestPDF() function instead.
const LISTINGS_FILE = path.join(process.cwd(), 'data', 'realestate', 'listings.txt');

async function main() {
  console.log('\n🚀 Starting real estate data ingestion...');
  console.log('━'.repeat(50));

  // Validate environment variables
  const required = ['PINECONE_API_KEY', 'PINECONE_INDEX_NAME', 'HUGGINGFACE_API_KEY'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`\n❌ Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (!fs.existsSync(LISTINGS_FILE)) {
    console.error(`\n❌ File not found: ${LISTINGS_FILE}`);
    process.exit(1);
  }

  try {
    const text = fs.readFileSync(LISTINGS_FILE, 'utf-8');
    console.log(`\n📄 Loaded listings file (${text.length} chars)`);

    // Convert to LangChain Document
    const doc = new Document({
      pageContent: text,
      metadata: { source: 'realestate-listings', type: 'property-listing' },
    });

    // Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
      separators: ['\n\n', '\n', '. ', ' '],
    });
    const docs = await splitter.splitDocuments([doc]);
    console.log(`   ↳ Split into ${docs.length} chunks`);

    // Upsert to Pinecone
    await addDocumentsToPinecone(docs, 'realestate');

    console.log('\n✅ Ingestion complete!');
    console.log(`   Chunks in Pinecone: ${docs.length}`);
    console.log('\n📌 Next steps:');
    console.log('   1. Check Pinecone dashboard → namespace "realestate"');
    console.log('   2. Run: npm run dev');
    console.log('   3. Open: http://localhost:3000/demo/realestate');
    console.log('   4. Ask: "2-bedroom apartments under ৳50,000/month?"\n');
  } catch (err: any) {
    console.error('\n❌ Ingestion failed:', err.message);
    process.exit(1);
  }
}

main();
