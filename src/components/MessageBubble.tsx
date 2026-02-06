
import React, { useState } from 'react';
import { Message, Role } from '../types';
import { ICONS } from '../constants';

interface MessageBubbleProps {
    message: Message;
    showDebugPanel?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showDebugPanel = false }) => {
    const isUser = message.role === Role.USER;
    const [isExpanded, setIsExpanded] = useState(true);

    // Loading state
    if (message.isLoading) {
        return (
            <div className="flex w-full justify-end">
                <div className="max-w-[95%] w-full rounded-2xl border border-slate-200/50 bg-white/50 p-4 dark:border-slate-800/50 dark:bg-surface-dark/50">
                    <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:200ms]"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:400ms]"></div>
                        </div>
                        <span className="text-[12px] font-medium text-slate-400 italic">Processing...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (message.isError) {
        return (
            <div className="flex flex-col items-center py-2 space-y-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <span className="text-red-500">{ICONS.Error}</span>
                    <span className="text-[13px] font-medium text-red-600 dark:text-red-400">{message.content}</span>
                </div>
            </div>
        );
    }

    // User message
    if (isUser) {
        return (
            <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-xl bg-slate-200/50 p-4 dark:bg-slate-800/50">
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400 mb-1">You</p>
                    <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {message.content}
                    </div>
                </div>
            </div>
        );
    }

    // Assistant response
    return (
        <div className="flex w-full justify-end">
            <div className="max-w-[95%] w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <p className="text-[11px] font-bold uppercase tracking-tight text-primary">Assistant</p>
                    </div>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-slate-200">
                        {isExpanded ? ICONS.ExpandLess : ICONS.ExpandMore}
                    </button>
                </div>

                {isExpanded && (
                    <div className="space-y-4">
                        <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {message.content.includes('```') ? (
                                message.content.split('```').map((part, i) => {
                                    if (i % 2 === 1) {
                                        return (
                                            <pre key={i} className="monospace-id text-[13px] leading-tight text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 overflow-x-auto my-2">
                                                {part.trim()}
                                            </pre>
                                        );
                                    }
                                    return <span key={i}>{part}</span>;
                                })
                            ) : (
                                <div className="text-slate-800 dark:text-slate-200">
                                    {message.content}
                                </div>
                            )}
                        </div>

                        {/* Debug Panel - Disabled by default */}
                        {showDebugPanel && message.metadata && (
                            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                                {message.metadata.confidence !== undefined && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 font-medium uppercase">Confidence</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{(message.metadata.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                )}
                                {message.metadata.latency_ms !== undefined && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 font-medium uppercase">Latency</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{message.metadata.latency_ms}ms</span>
                                    </div>
                                )}
                                {message.metadata.sla_tier && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 font-medium uppercase">SLA Tier</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{message.metadata.sla_tier}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
