'use client';

// ============================================================================
// ChatWindow — The Chat UI Panel
// ============================================================================
// Uses native fetch and ReadableStream for full reliability across all versions.
// Handles real-time streaming, message history, and loading states smoothly.
// ============================================================================

import { useState, type FormEvent, type ChangeEvent } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import type { UseCase } from '@/types';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatWindowProps {
  useCase: UseCase;
  primaryColor: string;
  welcomeMessage: string;
  botName: string;
  botSubtitle: string;
  onClose: () => void;
}

export default function ChatWindow({
  useCase,
  primaryColor,
  welcomeMessage,
  botName,
  botSubtitle,
  onClose,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: welcomeMessage,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setError(null);
    setInput('');

    const userMessage: ChatMessageItem = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          useCase,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const botMessageId = 'bot-' + Date.now();
      let accumulatedResponse = '';

      setMessages((prev) => [
        ...prev,
        { id: botMessageId, role: 'assistant', content: '' },
      ]);

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: accumulatedResponse }
                : msg
            )
          );
        }
      }
    } catch (err: any) {
      console.error('[ChatWindow] Error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
      style={{ height: '520px', maxHeight: '80vh' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="px-4 py-3 flex items-center justify-between text-white flex-shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-3">
          {/* Bot avatar */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{botName}</p>
            <p className="text-xs opacity-80 leading-tight">{botSubtitle}</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-all"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Use case badge ──────────────────────────────────────────────────── */}
      <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <span className="text-xs text-gray-500">
          {useCase === 'ecommerce'
            ? '🛍️ E-commerce Support · Powered by Groq AI'
            : '🏠 Real Estate Assistant · Powered by Groq AI'}
        </span>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        primaryColor={primaryColor}
      />

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-xs text-red-600 flex-shrink-0">
          ⚠️ {error}
        </div>
      )}

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <InputBar
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        primaryColor={primaryColor}
        useCase={useCase}
      />
    </div>
  );
}
