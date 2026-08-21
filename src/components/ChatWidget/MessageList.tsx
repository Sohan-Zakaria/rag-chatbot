'use client';

// ============================================================================
// MessageList — Scrollable Message History
// ============================================================================
// Renders user and assistant messages with distinct styling.
// Includes a typing indicator (animated dots) while the LLM is generating.
// Auto-scrolls to the latest message.
// ============================================================================

import { useEffect, useRef } from 'react';
import type { ChatMessageItem } from './ChatWindow';

interface MessageListProps {
  messages: ChatMessageItem[];
  isLoading: boolean;
  primaryColor: string;
}

export default function MessageList({ messages, isLoading, primaryColor }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 chat-scroll">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-end gap-2 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {/* Bot avatar — only on assistant messages */}
          {message.role === 'assistant' && (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0 mb-1">
              🤖
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
              message.role === 'user'
                ? 'text-white rounded-br-sm shadow-sm'
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
            }`}
            // dir="auto" enables right-to-left rendering for Bangla automatically
            dir="auto"
            style={
              message.role === 'user' ? { backgroundColor: primaryColor } : {}
            }
          >
            {message.content}
          </div>
        </div>
      ))}

      {/* ── Typing indicator ──────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-end gap-2 justify-start">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
            🤖
          </div>
          <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
            <div className="flex space-x-1 items-center h-3">
              <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
              <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
              <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
            </div>
          </div>
        </div>
      )}

      {/* Invisible anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
