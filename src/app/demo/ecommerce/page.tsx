import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';

const SAMPLE_ORDERS = [
  { id: 'ORD-1234', product: 'Samsung Galaxy A54', status: 'Shipped 🚚' },
  { id: 'ORD-1235', product: 'Apple AirPods Pro', status: 'Delivered ✅' },
  { id: 'ORD-1236', product: 'Dell Inspiron Laptop', status: 'Processing ⚙️' },
  { id: 'ORD-1237', product: 'Anker 65W Charger ×2', status: 'Pending 🕐' },
  { id: 'ORD-1238', product: 'Xiaomi Redmi Note 13', status: 'Cancelled ❌' },
];

const SAMPLE_QUESTIONS = [
  { en: 'Where is my order #ORD-1234?', bn: 'আমার অর্ডার #ORD-1234 কোথায়?' },
  { en: 'What is the status of ORD-1236?', bn: 'ORD-1236 এর স্ট্যাটাস কী?' },
  { en: 'Was ORD-1235 delivered?', bn: 'ORD-1235 কি ডেলিভারি হয়েছে?' },
  { en: 'What is the tracking number for ORD-1234?', bn: 'ORD-1234 এর ট্র্যাকিং নম্বর কী?' },
  { en: 'Why was ORD-1238 cancelled?', bn: 'ORD-1238 কেন বাতিল হলো?' },
];

export default function EcommerceDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛍️</span>
            <div>
              <p className="font-bold text-gray-900">TechMart Bangladesh</p>
              <p className="text-xs text-gray-500">E-commerce AI Support Demo</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Intro ────────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">E-commerce Support Bot</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            This demo bot is trained on TechMart&apos;s order database. Ask it about any order below —
            in <strong>English</strong> or <strong>বাংলা</strong>.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Bot is live — click the purple bubble →
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Order table ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800">📦 Sample Orders in the Database</h2>
              <p className="text-xs text-gray-500 mt-0.5">These are ingested into Pinecone</p>
            </div>
            <div className="divide-y divide-gray-50">
              {SAMPLE_ORDERS.map((order) => (
                <div key={order.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold text-violet-600">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.product}</p>
                  </div>
                  <span className="text-sm">{order.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sample questions ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800">💬 Try These Questions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Copy and paste into the chat widget</p>
            </div>
            <div className="divide-y divide-gray-50">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <div key={i} className="px-6 py-3">
                  <p className="text-sm text-gray-800">{q.en}</p>
                  <p className="text-sm text-gray-500 mt-0.5" dir="auto">{q.bn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bilingual note ────────────────────────────────────────────────── */}
        <div className="mt-8 bg-violet-50 rounded-2xl p-6 border border-violet-100">
          <h3 className="font-semibold text-violet-800 mb-2">🌐 Bilingual Detection</h3>
          <p className="text-sm text-violet-700">
            The bot automatically detects your language. Type in English → get an English response.
            Type in বাংলা → get a বাংলা response. No configuration needed!
          </p>
          <p className="text-sm text-violet-600 mt-2 font-mono">
            Tech: Unicode range U+0980–U+09FF detection · &gt;10% Bangla chars → respond in Bengali
          </p>
        </div>
      </div>

      {/* ── Chat Widget (floating bottom-right) ─────────────────────────────── */}
      <ChatWidget
        useCase="ecommerce"
        primaryColor="#7C3AED"
        botName="TechMart Support"
        botSubtitle="Order tracking · বাংলা + English"
        defaultOpen={true}
      />
    </main>
  );
}
