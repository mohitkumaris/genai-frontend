
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import RequestSection from './components/RequestSection';
import ResponseSection from './components/ResponseSection';
import InspectionPanel from './components/InspectionPanel';
import { orchestrate } from './services/executionApi';
import { ExecutionLog } from './types';

const SESSION_ID = `scope_${Math.random().toString(36).substring(7).toUpperCase()}`;

const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentExecution, setCurrentExecution] = useState<ExecutionLog | null>(null);
  const [history, setHistory] = useState<ExecutionLog[]>([]);

  const handleRunExecution = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    const startTime = Date.now();
    try {
      const response = await orchestrate({ prompt, session_id: SESSION_ID });
      const endTime = Date.now();

      // Map orchestrator response to frontend structure
      const result = response.result;
      const routingMeta = result.metadata?.routing || {};

      const newLog: ExecutionLog = {
        id: response.request_id,
        sessionId: SESSION_ID,
        timestamp: Date.now(),
        prompt: prompt,
        duration: endTime - startTime,
        output: {
          status: 'success',
          agent: result.agent_name,
          routing_reason: routingMeta.reason || 'N/A',
          policy_status: routingMeta.policy_influenced ? 'WARN' : 'PASS',
          tokens_used: result.metadata?.tokens_used ?? 0,
          latency_ms: result.metadata?.latency_ms ?? (endTime - startTime),
          confidence: result.confidence,
          sla_tier: result.metadata?.sla_tier ?? 'default',
          cost_estimate: result.metadata?.cost_estimate ?? 'N/A',
          execution_id: response.request_id,
          result: { output: result.output },
        },
        summaryText: result.output
      };

      setCurrentExecution(newLog);
      setHistory(prev => [newLog, ...prev]);
    } catch (error) {
      console.error("Execution Fault:", error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleNewSession = () => {
    window.location.reload(); // Hard reset for true stateless feel
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background-dark overflow-hidden">
      <Header sessionId={SESSION_ID} onNew={handleNewSession} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-12 pb-32 overflow-y-auto scroll-smooth">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-0">
          <RequestSection
            prompt={prompt}
            setPrompt={setPrompt}
            onExecute={handleRunExecution}
            isLoading={isLoading}
          />

          <ResponseSection
            execution={currentExecution}
            isLoading={isLoading}
          />
        </div>
      </main>

      <InspectionPanel history={history} />
    </div>
  );
};

export default App;
