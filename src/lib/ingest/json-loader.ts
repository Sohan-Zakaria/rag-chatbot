// ============================================================================
// JSON Order Data Loader — E-commerce Use Case
// ============================================================================
// Reads order records from a JSON file, formats each as a human-readable
// text document, and ingests into the Pinecone "ecommerce" namespace.
//
// This text-based format makes the LLM's context window usage efficient
// and ensures the RAG retriever can find orders by customer name, order ID,
// or product name.
// ============================================================================

import fs from 'fs';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { addDocumentsToPinecone } from '@/lib/vectorstore/pinecone';
import type { Order } from '@/types';

// Map status codes to human-readable strings (bilingual friendly)
const STATUS_LABELS: Record<string, string> = {
  pending:    'Pending (order placed, not yet processed)',
  processing: 'Processing (being prepared for shipment)',
  shipped:    'Shipped (on the way to you)',
  delivered:  'Delivered (successfully received)',
  cancelled:  'Cancelled',
};

/**
 * Converts a single order object to a human-readable text document.
 * This is what gets embedded and stored in Pinecone.
 */
function orderToDocument(order: Order): Document {
  const statusLabel = STATUS_LABELS[order.status] || order.status;

  const text = `
Order ID: ${order.orderId}
Customer Name: ${order.customerName}
Customer ID: ${order.customerId}
Customer Phone: ${order.customerPhone || 'N/A'}
Product: ${order.product}
Quantity: ${order.quantity}
Order Status: ${statusLabel}
Tracking Number: ${order.trackingNumber}
Estimated Delivery: ${order.estimatedDelivery}
Shipping Address: ${order.shippingAddress}
Total Amount: ৳${order.totalAmount.toLocaleString()} ${order.currency}
Order Date: ${order.orderDate}
Notes: ${order.notes || 'None'}
  `.trim();

  return new Document({
    pageContent: text,
    metadata: {
      orderId: order.orderId,
      customerId: order.customerId,
      customerName: order.customerName,
      status: order.status,
      source: 'orders-database',
    },
  });
}

/**
 * Ingests all orders from a JSON file into the Pinecone "ecommerce" namespace.
 *
 * @param filePath  Path to the orders JSON file (array of Order objects)
 */
export async function ingestOrders(filePath: string): Promise<{ orders: number; chunks: number }> {
  console.log(`\n📦 Loading orders from: ${filePath}`);

  // 1. Read and parse JSON
  const raw = fs.readFileSync(filePath, 'utf-8');
  const orders: Order[] = JSON.parse(raw);
  console.log(`   ↳ Found ${orders.length} orders`);

  // 2. Convert each order to a Document
  const docs = orders.map(orderToDocument);

  // 3. Split (orders are short, but good practice for large catalogs)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 100,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`   ↳ Split into ${splitDocs.length} chunks`);

  // 4. Upsert into Pinecone
  await addDocumentsToPinecone(splitDocs, 'ecommerce');

  return { orders: orders.length, chunks: splitDocs.length };
}
