
import React from 'react';

interface HeaderProps {
    sessionId: string;
    onNewSession: () => void;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sessionId, onNewSession, onToggleSidebar }) => {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 z-30 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 md:hidden transition-colors"
                >
                    <span className="material-symbols-outlined text-[22px]">menu</span>
                </button>

                <div className="hidden md:flex items-center gap-2 text-primary">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
                    </div>
                    <span className="font-bold tracking-tight text-slate-900 dark:text-white">GenAI<span className="text-primary">Platform</span></span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>

                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black leading-none mb-0.5">Session</span>
                    <span className="monospace-id text-[13px] font-semibold text-primary/80 truncate max-w-[120px]">{sessionId.slice(0, 12)}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onNewSession}
                    className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-1.5 text-[13px] font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <span className="hidden sm:inline">New Session</span>
                </button>

                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700 cursor-pointer overflow-hidden">
                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">person</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
