'use client';

import { useState } from 'react';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';

const SAMPLE_LISTINGS = [
  { title: '2-Bed Apartment, Dhanmondi', price: '৳45,000/mo', type: 'Rent', beds: 2, area: '1,200 sqft' },
  { title: '3-Bed Apartment, Gulshan-1', price: '৳95,000/mo', type: 'Rent', beds: 3, area: '2,100 sqft' },
  { title: 'Commercial Space, Motijheel', price: '৳1,20,00,000', type: 'Sale', beds: null, area: '3,500 sqft' },
  { title: '4-Bed House, Bashundhara', price: '৳2,50,00,000', type: 'Sale', beds: 4, area: '5,200 sqft' },
  { title: 'Studio Apartment, Mirpur', price: '৳18,000/mo', type: 'Rent', beds: 1, area: '650 sqft' },
];

const SAMPLE_QUESTIONS = [
  { en: '2-bedroom apartments under ৳50,000/month?', bn: '৳৫০,০০০ টাকার মধ্যে ২ বেড ফ্ল্যাট আছে?' },
  { en: 'Show me properties in Gulshan area', bn: 'গুলশানে কোনো সম্পত্তি আছে?' },
  { en: 'Any 3-bed apartments for rent in Dhaka?', bn: 'ঢাকায় ৩ বেড ভাড়া ফ্ল্যাট?' },
  { en: 'Properties available for sale?', bn: 'বিক্রয়ের জন্য কোনো সম্পত্তি আছে?' },
  { en: 'Cheapest apartment available?', bn: 'সবচেয়ে সস্তা ফ্ল্যাট কোনটি?' },
];

export default function RealEstateDemoPage() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  async function handlePDFUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadMessage('Uploading and ingesting PDF...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('useCase', 'realestate');

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'x-ingest-secret': 'your-secret-key-change-this-in-production' },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setUploadStatus('done');
        setUploadMessage(`✅ Ingested ${data.chunks} chunks from "${file.name}". Chat with it now!`);
      } else {
        setUploadStatus('error');
        setUploadMessage(`❌ Error: ${data.error}`);
      }
    } catch {
      setUploadStatus('error');
      setUploadMessage('❌ Upload failed. Make sure INGEST_SECRET is correct.');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <p className="font-bold text-gray-900">PropertyBD</p>
              <p className="text-xs text-gray-500">Real Estate AI Assistant Demo</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Real Estate Property Assistant</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            This bot is trained on PropertyBD listings. Ask about properties in English or বাংলা.
            You can also upload your own PDF listing to chat with it live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Sample listings ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800">🏘️ Sample Listings (in Pinecone)</h2>
              <p className="text-xs text-gray-500 mt-0.5">Pre-ingested from sample PDF</p>
            </div>
            <div className="divide-y divide-gray-50">
              {SAMPLE_LISTINGS.map((listing) => (
                <div key={listing.title} className="px-6 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{listing.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {listing.area}
                        {listing.beds ? ` · ${listing.beds} beds` : ''}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold text-emerald-600">{listing.price}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        listing.type === 'Rent'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {listing.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sample questions + PDF upload ────────────────────────────── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800">💬 Try These Questions</h2>
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

            {/* PDF Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-2">📄 Upload Your Own PDF</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload a property listing PDF and chat with it instantly. The file is embedded
                into Pinecone and available in seconds.
              </p>
              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  disabled={uploadStatus === 'uploading'}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:opacity-50"
                />
              </label>
              {uploadMessage && (
                <p className={`mt-3 text-sm ${
                  uploadStatus === 'done' ? 'text-emerald-600' :
                  uploadStatus === 'error' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {uploadMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat Widget ──────────────────────────────────────────────────────── */}
      <ChatWidget
        useCase="realestate"
        primaryColor="#059669"
        botName="PropertyBD Assistant"
        botSubtitle="সম্পত্তি খোঁজুন · Find Properties"
        defaultOpen={true}
      />
    </main>
  );
}
