/**
 * Orchestrator API Client
 * 
 * This is the ONLY external API the frontend calls.
 * All messages go through POST /orchestrate.
 * 
 * Rules enforced:
 * - No business logic
 * - No silent retries
 * - No fallback logic
 * - Explicit error handling
 */

import { config } from '../config/config';
import { OrchestratorRequest, OrchestratorResponse, ApiError } from '../types';

/**
 * Send a message to the orchestrator
 * 
 * @param sessionId - Opaque session identifier (passed through unchanged)
 * @param message - User's raw message
 * @returns Orchestrator response
 * @throws ApiError on any failure (no silent handling)
 */
export async function sendMessage(
    sessionId: string,
    message: string
): Promise<OrchestratorResponse> {
    const request: OrchestratorRequest = {
        session_id: sessionId,
        message: message,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);

    try {
        const response = await fetch(`${config.orchestratorUrl}/orchestrate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Explicit error handling - no fallback logic
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error: ApiError = {
                message: errorData.detail || errorData.message || `Request failed with status ${response.status}`,
                statusCode: response.status,
            };
            throw error;
        }

        const data: OrchestratorResponse = await response.json();
        return data;

    } catch (error: unknown) {
        clearTimeout(timeoutId);

        // Handle abort (timeout)
        if (error instanceof DOMException && error.name === 'AbortError') {
            const apiError: ApiError = {
                message: 'Request timed out. Please try again.',
            };
            throw apiError;
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            const apiError: ApiError = {
                message: 'Unable to connect to server. Please check your connection.',
            };
            throw apiError;
        }

        // Re-throw ApiError as-is
        if ((error as ApiError).message) {
            throw error;
        }

        // Unknown error
        const apiError: ApiError = {
            message: 'An unexpected error occurred.',
        };
        throw apiError;
    }
}

/**
 * Generate a new session ID
 * This is a simple UUID-like string. The frontend does not interpret it.
 */
export function generateSessionId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}
