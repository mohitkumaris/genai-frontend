
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

      const newLog: ExecutionLog = {
        id: response.execution_id,
        sessionId: SESSION_ID,
        timestamp: Date.now(),
        prompt: prompt,
        duration: endTime - startTime,
        output: {
          status: response.status,
          agent: response.metadata.agent,
          routing_reason: response.metadata.routing_reason,
          policy_status: response.metadata.policy_status,
          tokens_used: response.metadata.tokens_used ?? 0,
          latency_ms: response.metadata.latency_ms,
          confidence: response.metadata.confidence,
          sla_tier: response.metadata.sla_tier,
          cost_estimate: response.metadata.cost_estimate,
          execution_id: response.execution_id,
          result: response.result,
        },
        summaryText: response.summary ?? 'Execution completed.'
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
