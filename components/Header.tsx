
import React from 'react';

interface HeaderProps {
  sessionId: string;
  onNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ sessionId, onNew }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-border-dark">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-primary/10 rounded">
          <span className="material-symbols-outlined text-primary block" style={{ fontSize: '20px' }}>terminal</span>
        </div>
        <h1 className="text-sm font-bold tracking-tight uppercase text-slate-800 dark:text-slate-100">GenAI Platform Console</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Request Scope:</span>
          <span className="mono-font text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-surface-dark px-1.5 py-0.5 rounded">{sessionId}</span>
        </div>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          New Session
        </button>
      </div>
    </header>
  );
};

export default Header;
