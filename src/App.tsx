/**
 * GenAI Frontend - App Entry Point
 * 
 * This is a thin presentation layer with no intelligence or decision authority.
 * Frontend owns presentation only — not state, not memory, not policy.
 */

import React from 'react';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
    return <ChatPage />;
};

export default App;
