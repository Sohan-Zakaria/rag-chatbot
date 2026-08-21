// ============================================================================
// Shared TypeScript Types
// ============================================================================

/** Which demo use case the chatbot is running for */
export type UseCase = 'ecommerce' | 'realestate';

/** Detected or configured response language */
export type Language = 'en' | 'bn';

/** A single chat message (compatible with Vercel AI SDK format) */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** Body sent to POST /api/chat */
export interface ChatRequest {
  messages: ChatMessage[];
  useCase: UseCase;
}

/** Body sent to POST /api/ingest (JSON variant) */
export interface IngestRequest {
  useCase: UseCase;
  filePath?: string;
}

/** A single e-commerce order record */
export interface Order {
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  product: string;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: string;
  totalAmount: number;
  currency: string;
  orderDate: string;
  notes?: string;
}

/** A property listing record */
export interface PropertyListing {
  listingId: string;
  title: string;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: 'sqft' | 'sqm';
  price: number;
  currency: string;
  priceType: 'sale' | 'rent';
  location: string;
  city: string;
  description: string;
  amenities: string[];
  contactPhone: string;
  available: boolean;
}
