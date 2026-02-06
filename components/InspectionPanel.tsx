
import React, { useState } from 'react';
import { ExecutionLog } from '../types';

interface InspectionPanelProps {
  history: ExecutionLog[];
}

const InspectionPanel: React.FC<InspectionPanelProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'logs' | 'traces' | 'evals'>('history');

  const tabs = [
    { id: 'history', label: 'History' },
    { id: 'logs', label: 'Raw Logs' },
    { id: 'traces', label: 'Traces' },
    { id: 'evals', label: 'Evaluations' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] ${isOpen ? 'h-[50vh]' : 'h-11'}`}>
      <div className="flex items-center justify-between px-6 h-11 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">System Inspection</span>
          </div>
          {isOpen && (
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id as any); }}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >{tab.label}</button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!isOpen && history.length > 0 && (
            <span className="text-[9px] font-mono text-slate-400">{history.length} EXEC_STORED</span>
          )}
          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px', transform: isOpen ? 'rotate(180deg)' : 'none' }}>keyboard_arrow_up</span>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 h-[calc(50vh-44px)] overflow-y-auto custom-scrollbar">
          {activeTab === 'history' && (
            <div className="flex flex-col gap-2 py-4">
              {history.length === 0 ? (
                <div className="text-[10px] text-slate-400 mono-font p-12 text-center border border-dashed border-slate-200 dark:border-border-dark rounded-xl">No cold storage execution records available.</div>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="group flex items-center justify-between p-3 border border-slate-100 dark:border-border-dark rounded-xl mono-font text-[10px] hover:bg-slate-50 dark:hover:bg-surface-dark transition-all">
                    <div className="flex gap-6 items-center">
                      <div className="flex flex-col">
                        <span className="text-primary font-black tracking-tighter uppercase">ID: {h.output.execution_id}</span>
                        <span className="text-[8px] text-slate-400 uppercase">{new Date(h.timestamp).toLocaleString()}</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 line-clamp-1 max-w-sm font-medium">{h.prompt}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 bg-slate-100 dark:bg-background-dark px-1.5 py-0.5 rounded">{h.output.latency}</span>
                      <button className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors" style={{ fontSize: '16px' }}>visibility</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="py-4 mono-font text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
              <div className="text-slate-500">[00:00:00.000] SYSTEM_BOOT_SEQUENCE [OK]</div>
              <div className="text-slate-500">[00:00:00.005] PLATFORM_GOVERNANCE_ENGINE [ACTIVE]</div>
              {history.map((h, i) => (
                <div key={i} className="border-l-2 border-slate-200 dark:border-border-dark pl-3 py-1">
                  <div className="text-blue-400/80">[{new Date(h.timestamp).toLocaleTimeString()}] CALL DISPATCHED (ID:{h.id})</div>
                  <div className="text-slate-600"> &gt; AGENT: {h.output.agent}</div>
                  <div className="text-slate-600"> &gt; POLICY_STATUS: {h.output.policy_status}</div>
                  <div className="text-green-400/80">[{new Date(h.timestamp + h.duration).toLocaleTimeString()}] EMISSION_SUCCESS ({h.output.latency})</div>
                </div>
              ))}
              <div className="text-primary/50 animate-pulse mt-4">[LISTENING] Kernel awaits dispatch signal...</div>
            </div>
          )}

          {activeTab === 'traces' && (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-800 mb-2">account_tree</span>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Opentelemetry Traces Unavailable</p>
              <p className="text-[9px] text-slate-500 mt-1">Connect a collector to view execution span breakdowns.</p>
            </div>
          )}

          {activeTab === 'evals' && (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-800 mb-2">fact_check</span>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Agent Evaluations Panel</p>
              <p className="text-[9px] text-slate-500 mt-1">Automated validation metrics will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionPanel;
