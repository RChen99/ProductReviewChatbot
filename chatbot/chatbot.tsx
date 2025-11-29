// @ts-nocheck
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

// Chatbot Dialog Component
interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Array<{ id: number; text: string; sender: string }>;
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
}

function ChatbotDialog({
  isOpen,
  onClose,
  messages,
  message,
  setMessage,
  onSend
}: ChatbotDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-32 right-6 bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200" style={{ width: '400px', height: '550px' }}>
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Chat Support</h3>
          <p className="text-sm text-gray-300">Online</p>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-[#374151] p-1 rounded transition-colors"
          aria-label="Close chatbot"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex justify-start"
          >
            <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-gray-900">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff9900] text-gray-900 shadow-sm"
          />
          <SendButton onSend={onSend} />
        </div>
      </div>
    </div>
  );
}

// Send Button Component
interface SendButtonProps {
  onSend: () => void;
}

function SendButton({ onSend }: SendButtonProps) {
  return (
    <button
      onClick={onSend}
      className="bg-[#ff9900] hover:bg-[#fa8900] text-white rounded-2xl transition-colors w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-sm"
      aria-label="Send message"
    >
      <Send size={20} />
    </button>
  );
}

// Main Chatbot Component
export function Chatbot() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! Welcome to DS5110 Holiday Deals! How can I help you today?',
      sender: 'bot'
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };
      
      setMessages([...messages, userMessage]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: 'Thanks for your message! I\'m here to help you find the best holiday deals. What are you looking for?',
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  return (
    <ChatbotDialog
      isOpen={isChatbotOpen}
      onClose={() => setIsChatbotOpen(false)}
      messages={messages}
      message={message}
      setMessage={setMessage}
      onSend={handleSend}
    />
  );
}

// Chatbot Standalone Component
export function ChatbotStandalone() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! Welcome to DS5110 Holiday Deals! How can I help you today?',
      sender: 'bot'
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user'
      };
      
      setMessages([...messages, userMessage]);
      setMessage('');
      
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: 'Thanks for your message! I\'m here to help you find the best holiday deals. What are you looking for?',
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const styles = {
    chatDialog: {
      position: 'fixed' as const,
      bottom: '128px',
      right: '24px',
      width: '400px',
      height: '550px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column' as const,
      zIndex: 50,
      border: '1px solid #e5e7eb'
    },
    chatHeader: {
      backgroundColor: '#232f3e',
      color: 'white',
      padding: '16px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerTitle: {
      fontWeight: 600,
      margin: 0,
      fontSize: '16px'
    },
    headerStatus: {
      fontSize: '14px',
      color: '#d1d5db',
      margin: 0
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    messageWrapper: {
      display: 'flex'
    },
    messageWrapperUser: {
      justifyContent: 'flex-end'
    },
    messageWrapperBot: {
      justifyContent: 'flex-start'
    },
    messageBubble: {
      maxWidth: '75%',
      padding: '12px',
      borderRadius: '8px'
    },
    messageBubbleUser: {
      backgroundColor: '#ff9900',
      color: 'white'
    },
    messageBubbleBot: {
      backgroundColor: '#f3f4f6',
      color: '#111827'
    },
    inputContainer: {
      padding: '16px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: '8px'
    },
    input: {
      flex: 1,
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      color: '#111827'
    },
    sendButton: {
      backgroundColor: '#ff9900',
      border: 'none',
      color: 'white',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    chatButton: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      backgroundColor: '#ff9900',
      border: 'none',
      color: 'white',
      padding: '20px',
      borderRadius: '50%',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      transition: 'background-color 0.2s'
    }
  };

  return (
    <>
      {isChatbotOpen && (
        <div style={styles.chatDialog}>
          {/* Header */}
          <div style={styles.chatHeader}>
            <div>
              <h3 style={styles.headerTitle}>Chat Support</h3>
              <p style={styles.headerStatus}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  marginRight: '6px',
                  verticalAlign: 'middle'
                }}></span>
                Online
              </p>
            </div>
            <button 
              onClick={() => setIsChatbotOpen(false)}
              style={styles.closeButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Close chatbot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageWrapper,
                  ...(msg.sender === 'user' ? styles.messageWrapperUser : styles.messageWrapperBot)
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot)
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              onFocus={(e) => e.currentTarget.style.borderColor = '#ff9900'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              placeholder="Type your message..."
              style={styles.input}
            />
            <button
              onClick={handleSend}
              style={styles.sendButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fa8900'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9900'}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <button 
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        style={styles.chatButton}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fa8900'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff9900'}
        aria-label="Open chatbot"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </>
  );
}
