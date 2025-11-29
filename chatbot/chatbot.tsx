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
          <h3 className="font-semibold">DS5110 Support</h3>
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
