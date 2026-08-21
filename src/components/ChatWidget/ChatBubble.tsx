'use client';

// ============================================================================
// ChatBubble — Floating Action Button
// ============================================================================
// The round button fixed in the bottom-right corner that opens/closes
// the chat window. Pulses with a notification ring when closed.
// ============================================================================

interface ChatBubbleProps {
  isOpen: boolean;
  primaryColor: string;
  onClick: () => void;
}

export default function ChatBubble({ isOpen, primaryColor, onClick }: ChatBubbleProps) {
  return (
    <div className="relative">
      {/* Pulsing ring — only visible when chat is closed */}
      {!isOpen && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      <button
        onClick={onClick}
        className="relative w-14 h-14 rounded-full shadow-xl text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2"
        style={{
          backgroundColor: primaryColor,
          // @ts-ignore — CSS custom property for ring color
          '--tw-ring-color': primaryColor + '50',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Animated icon swap */}
        <span
          className={`absolute transition-all duration-200 ${
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
          }`}
        >
          {/* X icon — shown when open */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>

        <span
          className={`absolute transition-all duration-200 ${
            isOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        >
          {/* Chat icon — shown when closed */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
