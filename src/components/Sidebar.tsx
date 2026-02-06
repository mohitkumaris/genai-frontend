
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <button className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${active
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
        }`}>
        {icon}
        {/* Tooltip */}
        <div className="absolute left-14 hidden rounded bg-slate-900 px-2 py-1 text-[11px] font-bold text-white group-hover:block whitespace-nowrap z-50 shadow-xl">
            {label}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
        </div>
        {active && (
            <div className="absolute -left-4 h-6 w-1 rounded-r-full bg-primary"></div>
        )}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 flex w-18 flex-col items-center border-r border-slate-200 bg-white py-6 dark:border-slate-800/60 dark:bg-surface-dark transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } shrink-0`}>
                {/* App Logo - Mobile Only */}
                <div className="mb-8 md:hidden">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white">smart_toy</span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-5">
                    <SidebarItem icon={ICONS.Terminal} label="Chat" active />
                    <SidebarItem icon={ICONS.History} label="History" />
                </div>

                <div className="flex flex-col gap-5 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <SidebarItem icon={ICONS.Settings} label="Settings" />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
