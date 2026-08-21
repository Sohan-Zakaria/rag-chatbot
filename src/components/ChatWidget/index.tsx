'use client';

// ============================================================================
// ChatWidget — Root Component (Embeddable)
// ============================================================================
// This is the single component you add to any page to get the floating
// chat bubble + chat window.
//
// Usage:
//   import ChatWidget from '@/components/ChatWidget';
//   <ChatWidget useCase="ecommerce" botName="TechMart Support" />
//
// Embeddable on external sites:
//   Drop an iframe pointing to /embed/ecommerce (see src/app/embed/page.tsx)
// ============================================================================

import { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';
import type { UseCase } from '@/types';

interface ChatWidgetProps {
  /** Which knowledge base to query */
  useCase?: UseCase;
  /** Primary brand color (hex or Tailwind color) */
  primaryColor?: string;
  /** First message shown when the chat opens */
  welcomeMessage?: string;
  /** Bot's display name in the header */
  botName?: string;
  /** Optional bot subtitle (e.g., "Online • Replies instantly") */
  botSubtitle?: string;
  /** Whether the chat window starts open */
  defaultOpen?: boolean;
}

export default function ChatWidget({
  useCase = 'ecommerce',
  primaryColor = '#7C3AED',
  welcomeMessage,
  botName = 'AI Assistant',
  botSubtitle = 'Online • Replies instantly',
  defaultOpen = false,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Sensible default welcome messages per use case
  const defaultWelcome =
    useCase === 'ecommerce'
      ? '👋 Hello! I can help you track your orders, check delivery status, and answer product questions. What can I help you with?\n\nআপনার অর্ডার সম্পর্কে প্রশ্ন থাকলে জানাতে পারেন!'
      : '👋 Hello! I can help you find properties, check prices, and answer questions about listings. What are you looking for?\n\nসম্পত্তি সম্পর্কে যেকোনো প্রশ্ন করুন!';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window — conditionally rendered */}
      {isOpen && (
        <ChatWindow
          useCase={useCase}
          primaryColor={primaryColor}
          welcomeMessage={welcomeMessage ?? defaultWelcome}
          botName={botName}
          botSubtitle={botSubtitle}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Floating bubble button */}
      <ChatBubble
        isOpen={isOpen}
        primaryColor={primaryColor}
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </div>
  );
}
