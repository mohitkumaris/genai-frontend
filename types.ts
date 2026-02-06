
export interface ExecutionResult {
  status: string;
  agent: string;
  routing_reason: string;
  policy_status: 'PASS' | 'WARN' | 'FAIL';
  tokens_used: number;
  latency_ms: number;
  confidence: number;
  sla_tier: string;
  cost_estimate: string;
  execution_id: string;
  result: Record<string, unknown>;
}

export interface ExecutionLog {
  id: string;
  sessionId: string;
  timestamp: number;
  prompt: string;
  duration: number;
  output: ExecutionResult;
  summaryText: string;
}

export enum ViewMode {
  CONSOLE = 'CONSOLE',
  HISTORY = 'HISTORY',
  RAW_LOGS = 'RAW_LOGS'
}
