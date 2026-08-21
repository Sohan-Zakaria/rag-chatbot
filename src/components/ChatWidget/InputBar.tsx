'use client';

// ============================================================================
// InputBar — Message Input + Send Button
// ============================================================================
// Supports:
//   - Enter to send (Shift+Enter for new line)
//   - dir="auto" for Bangla text input (right-to-left rendering)
//   - Disabled state while bot is responding
//   - Sample question chips to guide new users
// ============================================================================

import { type FormEvent, type ChangeEvent, KeyboardEvent } from 'react';
import type { UseCase } from '@/types';

interface InputBarProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  primaryColor: string;
  useCase: UseCase;
}

// Quick suggestion chips shown below the input
const SUGGESTIONS: Record<UseCase, string[]> = {
  ecommerce: [
    'Where is my order #ORD-1234?',
    'আমার অর্ডার কোথায়?',
    'Track order ORD-1235',
  ],
  realestate: [
    '2-bed apartment in Dhaka?',
    'ঢাকায় ২ বেড ফ্ল্যাট কত টাকা?',
    'Properties under ৳50,000/month',
  ],
};

export default function InputBar({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  primaryColor,
  useCase,
}: InputBarProps) {
  // Handle Enter key (submit) vs Shift+Enter (newline)
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      // Trigger form submit
      const form = (e.target as HTMLInputElement).closest('form');
      form?.requestSubmit();
    }
  }

  // Fill input with suggestion chip text
  function handleSuggestion(suggestion: string) {
    // Simulate an input change event
    const event = {
      target: { value: suggestion },
    } as ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  }

  const suggestions = SUGGESTIONS[useCase];

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-100">
      {/* Suggestion chips — only when input is empty and not loading */}
      {!input && !isLoading && (
        <div className="px-3 pt-2 pb-1 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-colors bg-white"
              dir="auto"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={onSubmit} className="px-3 py-2.5 flex items-center gap-2">
        <input
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder={useCase === 'ecommerce' ? 'Ask about your order...' : 'Ask about properties...'}
          disabled={isLoading}
          dir="auto"
          autoComplete="off"
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-gray-50"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="w-9 h-9 rounded-full text-white flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
          style={{ backgroundColor: primaryColor }}
        >
          {isLoading ? (
            // Spinner while loading
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            // Send arrow
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      {/* Powered by footer */}
      <p className="text-center text-gray-400 text-[10px] pb-2">
        Powered by Groq · LangChain · Pinecone
      </p>
    </div>
  );
}
