import Link from 'next/link';

const FEATURES = [
  { icon: '⚡', title: 'Groq LLaMA 3.3 70B', desc: 'Free, ultra-fast inference (no credit card)' },
  { icon: '🔍', title: 'Pinecone Vector DB', desc: 'Semantic search over your business data' },
  { icon: '🌐', title: 'Bangla + English', desc: 'Auto-detects and responds in both languages' },
  { icon: '📱', title: 'WhatsApp Ready', desc: 'Twilio webhook integration included' },
  { icon: '📄', title: 'PDF Ingestion', desc: 'Upload property PDFs, ingest instantly' },
  { icon: '🚀', title: 'Vercel Deploy', desc: 'One-click deployment, auto-scales' },
];

const STACK = [
  { name: 'Next.js 14', color: 'bg-black text-white' },
  { name: 'Groq API', color: 'bg-orange-500 text-white' },
  { name: 'LangChain', color: 'bg-teal-600 text-white' },
  { name: 'Pinecone', color: 'bg-green-600 text-white' },
  { name: 'Hugging Face', color: 'bg-yellow-500 text-white' },
  { name: 'Twilio', color: 'bg-red-600 text-white' },
  { name: 'Tailwind CSS', color: 'bg-sky-500 text-white' },
  { name: 'TypeScript', color: 'bg-blue-600 text-white' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Free AI · No Credit Card · Groq + Gemini Fallback
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-5 leading-tight">
          RAG Chatbot for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
            Your Business
          </span>
        </h1>

        <p className="text-xl text-gray-500 mb-4 max-w-2xl mx-auto">
          An AI assistant trained on YOUR data. Speaks English and{' '}
          <span className="font-semibold text-gray-700">বাংলা</span> automatically.
        </p>
        <p className="text-base text-gray-400 mb-10">
          E-commerce order tracking · Real estate property search · WhatsApp widget · Website embed
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/demo/ecommerce"
            className="px-8 py-3.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
          >
            🛍️ E-commerce Demo
          </Link>
          <Link
            href="/demo/realestate"
            className="px-8 py-3.5 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            🏠 Real Estate Demo
          </Link>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">What&apos;s included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ───────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-center text-gray-500 mb-5">Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {STACK.map((s) => (
            <span key={s.name} className={`px-3 py-1.5 rounded-full text-sm font-medium ${s.color}`}>
              {s.name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Bilingual showcase ───────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p className="font-semibold text-gray-700">🌐 Bilingual in action</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full h-fit mt-1 flex-shrink-0">User</span>
              <p className="text-gray-700 text-sm bg-gray-50 rounded-xl px-4 py-2.5">
                Where is my order <strong>#ORD-1234</strong>?
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full h-fit mt-1 flex-shrink-0">Bot</span>
              <p className="text-gray-700 text-sm bg-violet-50 rounded-xl px-4 py-2.5">
                Your order <strong>ORD-1234</strong> (Samsung Galaxy A54) is currently <strong>Shipped</strong> 🚚.
                Tracking: SHURJO-BD-789012. Estimated delivery: August 23, 2026. Is there anything else I can help you with?
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4" />
            <div className="flex gap-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full h-fit mt-1 flex-shrink-0">User</span>
              <p className="text-gray-700 text-sm bg-gray-50 rounded-xl px-4 py-2.5" dir="auto">
                আমার অর্ডার <strong>#ORD-1234</strong> কোথায়?
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full h-fit mt-1 flex-shrink-0">Bot</span>
              <p className="text-gray-700 text-sm bg-violet-50 rounded-xl px-4 py-2.5" dir="auto">
                আপনার অর্ডার <strong>ORD-1234</strong> (Samsung Galaxy A54) বর্তমানে <strong>পাঠানো হয়েছে</strong> 🚚।
                ট্র্যাকিং নম্বর: SHURJO-BD-789012। আনুমানিক ডেলিভারি: ২৩ আগস্ট ২০২৬। আর কোনো সাহায্য দরকার?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="text-center py-10 text-sm text-gray-400">
        Built with ❤️ · Next.js · Groq · LangChain · Pinecone · Free Tier Only
      </footer>
    </main>
  );
}
