import React from 'react';
import { ChatProvider } from './context/ChatProvider';
import { ChatWindow } from './components/ChatWindow';

export default function App() {
  // Adjust these to your setup
  const apiBase = 'http://localhost:4000'; // Express API
  const wsBase  = 'http://localhost:4000'; // Socket.IO server (same host/port as API)
  const me     = '6720f1f8a1a1a1a1a1a1a1a1'; // <- replace with your logged-in user's _id (string)
  const other  = '6720f208b2b2b2b2b2b2b2b2'; // <- replace with the other user's _id

  return (
    <ChatProvider>
      <div style={{ height: '80vh', maxWidth: 720, margin: '24px auto', padding: 12 }}>
        <h2 style={{ marginBottom: 12 }}>Real Tour — Chat</h2>
        <ChatWindow apiBase={apiBase} wsBase={wsBase} me={me} other={other} />
      </div>
    </ChatProvider>
  );
}
