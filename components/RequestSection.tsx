
import React from 'react';

interface RequestSectionProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onExecute: () => void;
  isLoading: boolean;
}

const RequestSection: React.FC<RequestSectionProps> = ({ prompt, setPrompt, onExecute, isLoading }) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">Execution Request</label>
        <span className="text-[10px] text-slate-400 mono-font">PAYLOAD_TYPE: STRING</span>
      </div>
      <div className="relative group">
        <textarea 
          className="w-full min-h-[140px] p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all mono-font text-sm leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none resize-none shadow-sm"
          placeholder="Enter request for execution..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>
      <button 
        className={`w-full h-11 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all active:scale-[0.99] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={onExecute}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-spin material-symbols-outlined" style={{ fontSize: '18px' }}>sync</span>
        ) : (
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bolt</span>
        )}
        <span>{isLoading ? 'Processing' : 'Run Execution'}</span>
      </button>
    </section>
  );
};

export default RequestSection;
