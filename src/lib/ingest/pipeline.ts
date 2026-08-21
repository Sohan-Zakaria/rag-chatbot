// ============================================================================
// Ingestion Pipeline — Orchestrator
// ============================================================================
// Re-exports all ingestion functions for easy import across the codebase.
// ============================================================================

export { ingestPDF } from './pdf-loader';
export { ingestOrders } from './json-loader';
