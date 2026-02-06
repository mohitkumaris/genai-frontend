
import React from 'react';
import { ExecutionLog } from '../types';

interface ResponseSectionProps {
  execution: ExecutionLog | null;
  isLoading: boolean;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({ execution, isLoading }) => {
  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 animate-pulse mt-8">
        <div className="h-24 bg-slate-200 dark:bg-surface-dark rounded-xl"></div>
        <div className="h-48 bg-slate-200 dark:bg-surface-dark rounded-xl"></div>
      </section>
    );
  }

  if (!execution) {
    return (
      <section className="flex flex-col items-center justify-center py-24 border border-dashed border-slate-200 dark:border-border-dark rounded-3xl mt-8">
        <span className="material-symbols-outlined text-slate-300 dark:text-slate-800 text-6xl mb-4 font-extralight">developer_board</span>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Awaiting Dispatch</p>
      </section>
    );
  }

  const { output } = execution;
  const jsonString = JSON.stringify(output.result, null, 2);

  return (
    <section className="flex flex-col gap-6 mt-8">
      {/* Execution Summary Panel (Read-only Governance Metadata) */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-1">Execution Summary</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-200 dark:bg-border-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
          <SummaryBlock label="Selected Agent" value={output.agent} icon="smart_toy" />
          <SummaryBlock label="Routing Reason" value={output.routing_reason} icon="route" className="md:col-span-2" />
          <SummaryBlock
            label="Policy Status"
            value={output.policy_status}
            icon="gavel"
            valueClass={
              output.policy_status === 'PASS' ? 'text-green-500' :
                output.policy_status === 'WARN' ? 'text-amber-500' : 'text-red-500'
            }
          />
          <SummaryBlock label="SLA Tier" value={output.sla_tier} icon="verified_user" />
          <SummaryBlock label="Latency" value={`${output.latency_ms}ms`} icon="timer" />
          <SummaryBlock label="Estimated Cost" value={output.cost_estimate} icon="payments" />
          <SummaryBlock label="Confidence" value={`${(output.confidence * 100).toFixed(1)}%`} icon="query_stats" />
          <SummaryBlock label="Execution ID" value={output.execution_id} icon="fingerprint" className="md:col-span-1" />
        </div>
      </div>

      {/* Result Output Panel (Clean, final user-facing response) */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-1">Result Output</label>
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-sm min-h-[120px]">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="mono-font text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {jsonString}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-blue-50/50 dark:bg-primary/5 border border-blue-100 dark:border-primary/10 rounded-lg">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>info</span>
          {execution.summaryText}
        </p>
      </div>
    </section>
  );
};

const SummaryBlock = ({ label, value, icon, className = "", valueClass = "" }: { label: string, value: string, icon: string, className?: string, valueClass?: string }) => (
  <div className={`flex flex-col gap-1.5 p-4 bg-white dark:bg-surface-dark ${className}`}>
    <div className="flex items-center gap-1.5 text-slate-400">
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>
      <span className="text-[9px] uppercase font-black tracking-widest">{label}</span>
    </div>
    <span className={`mono-font text-[11px] font-bold truncate ${valueClass || 'text-slate-600 dark:text-slate-300'}`}>
      {value}
    </span>
  </div>
);

export default ResponseSection;
