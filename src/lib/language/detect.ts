// ============================================================================
// Language Detection — Bangla (Bengali) vs English
// ============================================================================
// Uses Unicode character range for Bangla script: U+0980 – U+09FF
// No external library needed — pure Unicode math.
// ============================================================================

import type { Language } from '@/types';

/**
 * Detects whether a message is in Bangla or English.
 *
 * Strategy: Count Bangla Unicode characters. If more than 10% of the
 * non-whitespace characters fall in the Bangla range, classify as Bangla.
 *
 * @example
 *   detectLanguage("Where is my order?")        → "en"
 *   detectLanguage("আমার অর্ডার কোথায়?")       → "bn"
 *   detectLanguage("My order ORD-1234 কোথায়?") → "bn"  (mixed, but Bangla chars > 10%)
 */
export function detectLanguage(text: string): Language {
  if (!text || text.trim().length === 0) return 'en';

  // Bangla Unicode block: U+0980 to U+09FF
  const banglaChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const nonSpaceChars = text.replace(/\s/g, '').length;

  // If 10%+ of chars are Bangla → classify as Bangla
  if (nonSpaceChars > 0 && banglaChars / nonSpaceChars >= 0.1) {
    return 'bn';
  }

  return 'en';
}

/**
 * Returns a human-readable language name for logging/UI.
 */
export function getLanguageName(lang: Language): string {
  return lang === 'bn' ? 'বাংলা (Bengali)' : 'English';
}
