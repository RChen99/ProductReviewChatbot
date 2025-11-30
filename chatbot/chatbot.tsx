// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw } from 'lucide-react';
import './chatbot.css';
import {
  getTopRatedByCategory,
  getSentimentByPriceRange,
  getBestValueProducts,
  getReviewLengthRating,
  getSentimentByCategory,
  getDiscountReviewQuality,
  getRatingVariance,
  getSentimentRatingComparison
} from '../frontend/src/services/api';

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
          <h3 className="font-semibold">Product Support</h3>
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
      text: 'Hi DS5110! How can I help you today?',
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

interface ChatbotStandaloneProps {
  currentProduct?: any;
  onSearchProduct?: (productName: string) => void;
}

export function ChatbotStandalone({ currentProduct = null, onSearchProduct }: ChatbotStandaloneProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(() => {
    const baseTime = Date.now();
    return [
      {
        id: baseTime,
        text: 'Hi DS5110! What can I help you with?',
        sender: 'bot'
      },
                    {
                      id: baseTime + 1,
                      text: 'These are the questions you can ask me:\n\n1. Top-Rated Products by Category\n\n2. Sentiment Analysis by Price Range\n\n3. Best Value Products\n\n4. Review Length vs Rating\n\n5. Sentiment by Category\n\n6. Discount Impact on Reviews\n\n7. User Rating Consistency\n\n8. Sentiment vs Rating Comparison\n\nYou may enter the number or type the topic.',
                      sender: 'bot'
                    }
    ];
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const detectAnalyticalQuery = (message: string): number | null => {
    const lowerMsg = message.toLowerCase().trim();
    
    // Check for numbers 1-8
    const numMatch = lowerMsg.match(/^(\d)$/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (num >= 1 && num <= 8) {
        return num;
      }
    }
    
    // Check for keywords
    if (lowerMsg.match(/top.*rated|best.*products|highest.*rating/) && 
        lowerMsg.match(/category|categories/)) {
      return 1;
    }
    if (lowerMsg.match(/sentiment|feeling|emotion/) && 
        lowerMsg.match(/price|cost|range/)) {
      return 2;
    }
    if (lowerMsg.match(/best.*value|value.*products|best.*deal|high.*rating.*low.*price|value.*score/)) {
      return 3;
    }
    if (lowerMsg.match(/review.*length|length.*review/) && 
        lowerMsg.match(/rating|correlation|longer/)) {
      return 4;
    }
    if (lowerMsg.match(/sentiment/) && 
        lowerMsg.match(/category|categories/)) {
      return 5;
    }
    if (lowerMsg.match(/discount|discounted/) && 
        lowerMsg.match(/review|rating|quality|worse|better/)) {
      return 6;
    }
    if (lowerMsg.match(/rating.*variance|variance|consistency|consistent|varied/)) {
      return 7;
    }
    if (lowerMsg.match(/sentiment.*rating|rating.*sentiment|comparison|compare/)) {
      return 8;
    }
    
    return null;
  };

  const getSentimentLabel = (sentimentScore: number | null | undefined): string => {
    if (sentimentScore === null || sentimentScore === undefined) {
      return 'Neutral';
    }
    if (sentimentScore > 0.3) {
      return 'Positive';
    } else if (sentimentScore < -0.3) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  };

  const formatAnalyticalResponse = (queryNum: number, data: any[]): string => {
    if (!data || data.length === 0) {
      return 'No data available for this query.';
    }

    switch(queryNum) {
      case 1: // Top-Rated Products by Category
        let result = 'Top-Rated Products by Category:\n\n';
        data.forEach(item => {
          // Use the first category segment directly from backend
          const cat = item.category || 'Uncategorized';
          
          result += `${cat}:\n`;
          
          // Display top 5 products for this category
          if (item.top_products && item.top_products.length > 0) {
            item.top_products.forEach((product: any, index: number) => {
              const productName = product.product_name || 'N/A';
              const firstFiveWords = productName.split(' ').slice(0, 5).join(' ');
              result += `  ${index + 1}. ${firstFiveWords}${productName.split(' ').length > 5 ? '...' : ''}\n`;
            });
          }
          
          result += `  Highest in ${cat}: ${item.avg_rating?.toFixed(1) || '0.0'}\n\n`;
        });
        return result.trim();
      
      case 2: // Sentiment by Price Range
        let result2 = 'Sentiment Analysis by Price Range:\n\n';
        data.forEach(item => {
          result2 += `${item.price_range || 'Unknown'}:\n`;
          const sentiment2 = item.avg_sentiment || 0;
          result2 += `  Avg Sentiment: ${sentiment2.toFixed(2)} - ${getSentimentLabel(sentiment2)}\n`;
          result2 += `  Avg Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n`;
          result2 += `  Reviews: ${item.review_count || 0}\n`;
          
          // Add top 5 products for this price range
          if (item.top_products && item.top_products.length > 0) {
            item.top_products.forEach((product: any, index: number) => {
              const productName = product.product_name || 'N/A';
              const firstFiveWords = productName.split(' ').slice(0, 5).join(' ');
              result2 += `  ${index + 1}. ${firstFiveWords}${productName.split(' ').length > 5 ? '...' : ''}\n`;
            });
          }
          
          result2 += '\n';
        });
        return result2.trim();
      
      case 3: // Best Value Products
        let result3 = 'Best Value Products (High Rating + Low Price):\n\n';
        data.forEach((item, index) => {
          const productName = item.product_name || 'N/A';
          const firstFiveWords = productName.split(' ').slice(0, 5).join(' ');
          result3 += `${index + 1}. ${firstFiveWords}${productName.split(' ').length > 5 ? '...' : ''}\n`;
          result3 += `   Price: $${item.discounted_price?.toFixed(2) || '0.00'}\n`;
          result3 += `   Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n`;
          result3 += `   Reviews: ${item.review_count || 0}\n\n`;
        });
        return result3.trim();
      
      case 4: // Review Length vs Rating
        let result4 = 'Review Length vs Rating Correlation:\n\n';
        data.forEach(item => {
          const sentiment4 = item.avg_sentiment || 0;
          result4 += `${item.length_category}:\n  Avg Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n  Avg Sentiment: ${sentiment4.toFixed(2)} - ${getSentimentLabel(sentiment4)}\n  Reviews: ${item.review_count || 0}\n`;
          
          // Add top 5 products for this length category
          if (item.top_products && item.top_products.length > 0) {
            item.top_products.forEach((product: any, index: number) => {
              const productName = product.product_name || 'N/A';
              const firstFiveWords = productName.split(' ').slice(0, 5).join(' ');
              result4 += `  ${index + 1}. ${firstFiveWords}${productName.split(' ').length > 5 ? '...' : ''}\n`;
            });
          }
          
          result4 += '\n';
        });
        return result4.trim();
      
      case 5: // Sentiment by Category
        let result5 = 'Sentiment Distribution by Category:\n\n';
        data.forEach(item => {
          // Use the first category segment directly from backend
          const cat = item.category || 'Uncategorized';
          const sentiment5 = item.avg_sentiment || 0;
          result5 += `${cat}:\n  Avg Sentiment: ${sentiment5.toFixed(2)} - ${getSentimentLabel(sentiment5)}\n  Avg Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n  Reviews: ${item.review_count || 0}\n  Products: ${item.product_count || 0}\n`;
          
          // Add top 5 products for this category
          if (item.top_products && item.top_products.length > 0) {
            item.top_products.forEach((product: any, index: number) => {
              const productName = product.product_name || 'N/A';
              const firstFiveWords = productName.split(' ').slice(0, 5).join(' ');
              result5 += `  ${index + 1}. ${firstFiveWords}${productName.split(' ').length > 5 ? '...' : ''}\n`;
            });
          }
          
          result5 += '\n';
        });
        return result5.trim();
      
      case 6: // Discount Impact on Reviews
        let result6 = 'Discount Impact on Review Quality:\n\n';
        data.forEach(item => {
          const sentiment6 = item.avg_sentiment || 0;
          result6 += `${item.discount_range}:\n  Avg Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n  Avg Sentiment: ${sentiment6.toFixed(2)} - ${getSentimentLabel(sentiment6)}\n  Reviews: ${item.review_count || 0}\n  Products: ${item.product_count || 0}\n`;
          
          // Add top 5 products for this discount range
          if (item.top_products && item.top_products.length > 0) {
            item.top_products.forEach((product: any, index: number) => {
              const productName = product.product_name || 'N/A';
              const firstFiveWords = productName.split(' ').slice(0, 5).join(' ');
              result6 += `  ${index + 1}. ${firstFiveWords}${productName.split(' ').length > 5 ? '...' : ''}\n`;
            });
          }
          
          result6 += '\n';
        });
        return result6.trim();
      
      case 7: // Rating Variance
        let result7 = 'Products with Most Consistent Ratings:\n\n';
        data.slice(0, 10).forEach(item => {
          result7 += `${item.product_name?.substring(0, 50) || 'N/A'}...\n  Avg Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n  Consistency (std dev): ${item.rating_stddev?.toFixed(2) || '0.00'}\n  Range: ${item.min_rating || '0'} - ${item.max_rating || '0'} stars\n  Reviews: ${item.review_count || 0}\n\n`;
        });
        return result7.trim();
      
      case 8: // Sentiment vs Rating Comparison
        let result8 = 'Sentiment vs Rating Comparison:\n\n';
        data.slice(0, 10).forEach(item => {
          const sentiment8 = item.avg_sentiment || 0;
          result8 += `${item.product_name?.substring(0, 50) || 'N/A'}...\n  Avg Rating: ${item.avg_rating?.toFixed(1) || '0.0'} stars\n  Avg Sentiment: ${sentiment8.toFixed(2)} - ${getSentimentLabel(sentiment8)}\n  Status: ${item.comparison || 'Unknown'}\n  Reviews: ${item.review_count || 0}\n\n`;
        });
        return result8.trim();
      
      default:
        return 'Unknown query type.';
    }
  };

  const executeAnalyticalQuery = async (queryNum: number): Promise<any> => {
    try {
      switch(queryNum) {
        case 1:
          return await getTopRatedByCategory();
        case 2:
          return await getSentimentByPriceRange();
        case 3:
          return await getBestValueProducts();
        case 4:
          return await getReviewLengthRating();
        case 5:
          return await getSentimentByCategory();
        case 6:
          return await getDiscountReviewQuality();
        case 7:
          return await getRatingVariance();
        case 8:
          return await getSentimentRatingComparison();
        default:
          return [];
      }
    } catch (error) {
      console.error('Error executing analytical query:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      const userMessageId = Date.now();
      const userMessage = {
        id: userMessageId,
        text: message,
        sender: 'user'
      };
      
      setMessages(prev => [...prev, userMessage]);
      const userMessageText = message.trim();
      setMessage('');
      
      // Check if it's an analytical query
      const queryNum = detectAnalyticalQuery(userMessageText);
      
      if (queryNum) {
        // Show loading message
        const loadingMessageId = Date.now() + 1;
        const loadingMessage = {
          id: loadingMessageId,
          text: 'Analyzing data...',
          sender: 'bot'
        };
        setMessages(prev => [...prev, loadingMessage]);
        
        try {
          const data = await executeAnalyticalQuery(queryNum);
          console.log('Query result:', queryNum, data);
          if (!data || (Array.isArray(data) && data.length === 0)) {
            const noDataMessage = {
              id: loadingMessageId + 1,
              text: 'No data available for this query. Make sure the backend is running and the database has data.',
              sender: 'bot'
            };
            setMessages(prev => {
              const filtered = prev.filter(msg => msg.id !== loadingMessageId);
              return [...filtered, noDataMessage];
            });
          } else {
            const formattedResponse = formatAnalyticalResponse(queryNum, data);
            console.log('Formatted response:', formattedResponse);
            const botMessage = {
              id: loadingMessageId + 1,
              text: formattedResponse,
              sender: 'bot'
            };
            setMessages(prev => {
              // Remove loading message and add result
              const filtered = prev.filter(msg => msg.id !== loadingMessageId);
              console.log('Setting messages:', [...filtered, botMessage]);
              return [...filtered, botMessage];
            });
          }
        } catch (error: any) {
          console.error('Query error:', error);
          const errorMessage = {
            id: loadingMessageId + 1,
            text: `Sorry, I encountered an error: ${error.message || 'Failed to fetch data. Make sure the backend is running on port 5001.'}`,
            sender: 'bot'
          };
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== loadingMessageId);
            return [...filtered, errorMessage];
          });
        }
      } else {
        // Original product search logic
        setTimeout(() => {
          const botMessageId = userMessageId + 1;
          if (!currentProduct) {
            if (onSearchProduct && userMessageText) {
              onSearchProduct(userMessageText);
              const botMessage = {
                id: botMessageId,
                text: `Searching for ${userMessageText}...`,
                sender: 'bot'
              };
              setMessages(prev => [...prev, botMessage]);
            } else {
              const botMessage = {
                id: botMessageId,
                text: 'Please provide me with the product name, or search one up. You can also ask me analytical questions by entering a number (1-8) or typing the topic.',
                sender: 'bot'
              };
              setMessages(prev => [...prev, botMessage]);
            }
          } else {
            const productName = currentProduct.product_name || 'this product';
            const productPrice = currentProduct.discounted_price || 0;
            const productRating = currentProduct.avg_rating || 0;
            const botMessage = {
              id: botMessageId,
              text: `I can help you with ${productName}. It's priced at $${productPrice.toFixed(2)} and has a ${productRating.toFixed(1)} star rating. What would you like to know?`,
              sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
          }
        }, 1000);
      }
    }
  };

  return (
    <>
      {isChatbotOpen && (
        <div className="chatbot-dialog">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h3 className="chatbot-header-title">Product Support</h3>
              <p className="chatbot-header-status">
                <span className="chatbot-online-dot"></span>
                Online
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  const baseTime = Date.now();
                  setMessages([
                    {
                      id: baseTime,
                      text: 'Hi DS5110! What can I help you with?',
                      sender: 'bot'
                    },
                    {
                      id: baseTime + 1,
                      text: 'These are the questions you can ask me:\n\n1. Top-Rated Products by Category\n\n2. Sentiment Analysis by Price Range\n\n3. Best Value Products\n\n4. Review Length vs Rating\n\n5. Sentiment by Category\n\n6. Discount Impact on Reviews\n\n7. User Rating Consistency\n\n8. Sentiment vs Rating Comparison\n\nYou may enter the number or type the topic.',
                      sender: 'bot'
                    }
                  ]);
                }}
                className="chatbot-close-button"
                aria-label="Refresh chatbot"
                title="Refresh"
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={() => setIsChatbotOpen(false)}
                className="chatbot-close-button"
                aria-label="Close chatbot"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages-container" ref={messagesContainerRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-message-wrapper ${
                  msg.sender === 'user' ? 'chatbot-message-wrapper-user' : 'chatbot-message-wrapper-bot'
                }`}
              >
                <div
                  className={`chatbot-message-bubble ${
                    msg.sender === 'user' ? 'chatbot-message-bubble-user' : 'chatbot-message-bubble-bot'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="chatbot-input"
            />
            <button
              onClick={handleSend}
              className="chatbot-send-button"
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
        className="chatbot-button"
        aria-label="Open chatbot"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </>
  );
}
