import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAG Chatbot — AI Assistant for Your Business',
  description:
    'Bilingual (English + বাংলা) AI chatbot powered by Groq LLaMA, LangChain, and Pinecone. ' +
    'Demo use cases: e-commerce order tracking and real estate property search.',
  keywords: ['RAG chatbot', 'AI chatbot', 'Bangla chatbot', 'LangChain', 'Groq', 'Pinecone'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Bangla (Bengali) Google Font for correct script rendering.
          Hind Siliguri is widely used for Bangla UIs.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
