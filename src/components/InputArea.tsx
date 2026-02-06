
import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    return (
        <footer className="safe-area-bottom border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark/95 ios-blur p-4 z-20">
            <div className="relative flex flex-col gap-3 max-w-4xl mx-auto">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-[15px] focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-surface-dark dark:text-white dark:placeholder-slate-500 disabled:opacity-50"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || disabled}
                        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg active:scale-95 transition-all hover:opacity-90 disabled:opacity-50 disabled:bg-slate-500"
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                </div>
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        <span>Messages are processed by the orchestrator</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default InputArea;
