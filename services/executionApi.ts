/**
 * Execution API Client
 * 
 * Thin HTTP client for orchestrator communication.
 * NO intelligence, NO provider logic, NO model references.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export interface OrchestrationRequest {
    prompt: string;
    session_id?: string;
}

export interface OrchestrationResponse {
    execution_id: string;
    status: string;
    result: Record<string, unknown>;
    metadata: {
        agent: string;
        routing_reason: string;
        policy_status: 'PASS' | 'WARN' | 'FAIL';
        latency_ms: number;
        sla_tier: string;
        cost_estimate: string;
        confidence: number;
        tokens_used?: number;
    };
    summary?: string;
}

/**
 * Send execution request to orchestrator.
 * Frontend only captures input and renders output.
 */
export async function orchestrate(request: OrchestrationRequest): Promise<OrchestrationResponse> {
    const response = await fetch(`${API_BASE}/v1/orchestrate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Orchestration failed: ${response.status} - ${error}`);
    }

    return response.json();
}
