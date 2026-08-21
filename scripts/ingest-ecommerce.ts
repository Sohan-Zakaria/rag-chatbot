#!/usr/bin/env tsx
// ============================================================================
// scripts/ingest-ecommerce.ts
// ============================================================================
// Run ONCE to load order data into Pinecone's "ecommerce" namespace.
//
// Usage:
//   npm run ingest:ecommerce
//   -- or --
//   npx tsx --env-file=.env.local scripts/ingest-ecommerce.ts
//
// Prerequisites:
//   1. Fill in .env.local with PINECONE_API_KEY, PINECONE_INDEX_NAME, HUGGINGFACE_API_KEY
//   2. Create Pinecone index: name=rag-chatbot, dimension=384, metric=cosine
// ============================================================================

import path from 'path';
import { ingestOrders } from '../src/lib/ingest/pipeline';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'ecommerce', 'orders.json');

async function main() {
  console.log('\n🚀 Starting e-commerce data ingestion...');
  console.log('━'.repeat(50));

  // Validate environment variables
  const required = ['PINECONE_API_KEY', 'PINECONE_INDEX_NAME', 'HUGGINGFACE_API_KEY'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`\n❌ Missing environment variables: ${missing.join(', ')}`);
    console.error('   Please fill in your .env.local file first.\n');
    process.exit(1);
  }

  try {
    const result = await ingestOrders(ORDERS_FILE);
    console.log('\n✅ Ingestion complete!');
    console.log(`   Orders processed : ${result.orders}`);
    console.log(`   Chunks in Pinecone: ${result.chunks}`);
    console.log('\n📌 Next steps:');
    console.log('   1. Check your Pinecone dashboard → index "rag-chatbot" → namespace "ecommerce"');
    console.log('   2. Run: npm run dev');
    console.log('   3. Open: http://localhost:3000/demo/ecommerce');
    console.log('   4. Ask: "Where is my order #ORD-1234?"\n');
  } catch (err: any) {
    console.error('\n❌ Ingestion failed:', err.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   • Check PINECONE_API_KEY is correct');
    console.error('   • Check PINECONE_INDEX_NAME matches your index (should be: rag-chatbot)');
    console.error('   • Check Pinecone index dimension is 384 (not 1536)');
    console.error('   • Check HUGGINGFACE_API_KEY is valid\n');
    process.exit(1);
  }
}

main();
