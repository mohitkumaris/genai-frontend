/**
 * ChatPage - Main chat interface
 * 
 * This is the primary page component that:
 * - Captures user input
 * - Sends messages to orchestrator
 * - Renders responses exactly as received
 * - Maintains minimal UI state (input, loading, error, messages for display)
 * 
 * This component does NOT:
 * - Store conversation memory (messages are display-only)
 * - Assemble context
 * - Apply policy or enforcement
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import InputArea from '../components/InputArea';
import { Message, Role, ApiError } from '../types';
import { sendMessage, generateSessionId } from '../api/orchestrator';

const ChatPage: React.FC = () => {
    // Session ID - created once, passed through unchanged
    const [sessionId] = useState(() => generateSessionId());

    // Minimal UI state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debug mode - disabled by default
    const [showDebugPanel] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleNewSession = () => {
        // Reload the page to get a new session
        window.location.reload();
    };

    const handleSendMessage = async (content: string) => {
        // Add user message to display
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: Role.USER,
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Add loading indicator
        const loadingId = `loading-${Date.now()}`;
        setMessages(prev => [...prev, {
            id: loadingId,
            role: Role.ASSISTANT,
            content: '',
            timestamp: new Date(),
            isLoading: true
        }]);

        try {
            // Send to orchestrator - single API call
            const response = await sendMessage(sessionId, content);

            // Render response exactly as received
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: Role.ASSISTANT,
                content: response.response,
                timestamp: new Date(),
                metadata: response.metadata,
            };

            setMessages(prev => prev.filter(m => m.id !== loadingId).concat(assistantMessage));

        } catch (error: unknown) {
            // Explicit error display - no silent retries, no fallback logic
            const apiError = error as ApiError;
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: Role.ASSISTANT,
                content: apiError.message || 'An error occurred',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => prev.filter(m => m.id !== loadingId).concat(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark overflow-hidden">
            <Header
                sessionId={sessionId}
                onNewSession={handleNewSession}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="relative flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark/30">
                    {/* Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#195de6_1px,transparent_1px)] [background-size:24px_24px]"></div>

                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth z-10"
                    >
                        <div className="max-w-3xl mx-auto space-y-6 w-full pb-10">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                        <span className="material-symbols-outlined text-4xl">smart_toy</span>
                                    </div>
                                    <h2 className="text-xl font-bold dark:text-white">Start a conversation</h2>
                                    <p className="text-slate-500 max-w-sm text-sm">Send a message below to interact with the GenAI platform.</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        showDebugPanel={showDebugPanel}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="z-20">
                        <InputArea
                            onSendMessage={handleSendMessage}
                            disabled={isLoading}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatPage;
