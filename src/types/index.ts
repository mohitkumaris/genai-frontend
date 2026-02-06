/**
 * Type definitions for GenAI Frontend
 * 
 * These types define the contract between the frontend and orchestrator API.
 * The frontend treats all responses as opaque - it renders what it receives.
 */

// ============================================================================
// Core Enums
// ============================================================================

export enum Role {
    USER = 'user',
    ASSISTANT = 'assistant',
}

// ============================================================================
// API Contract Types
// ============================================================================

/**
 * Request sent to orchestrator
 * Frontend ONLY sends session_id and message - nothing else.
 */
export interface OrchestratorRequest {
    session_id: string;
    message: string;
}

/**
 * Response from orchestrator
 * Frontend renders this exactly as received - no interpretation.
 */
export interface OrchestratorResponse {
    session_id: string;
    response: string;
    metadata?: ResponseMetadata;
}

/**
 * Optional metadata returned by orchestrator
 * Used for debug panel (disabled by default)
 */
export interface ResponseMetadata {
    confidence?: number;
    sla_tier?: string;
    latency_ms?: number;
    request_id?: string;
    tokens?: {
        prompt: number;
        completion: number;
        total: number;
    };
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Message for display in the chat UI
 * This is purely presentational state.
 */
export interface Message {
    id: string;
    role: Role;
    content: string;
    timestamp: Date;
    metadata?: ResponseMetadata;
    isError?: boolean;
    isLoading?: boolean;
}

/**
 * Error state for explicit error display
 */
export interface ApiError {
    message: string;
    statusCode?: number;
}
