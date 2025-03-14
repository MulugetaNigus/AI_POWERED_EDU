import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, Loader2, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
}

interface QuickReply {
  id: number;
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant from ExtreamX. How can I help you with your educational journey today?",
      isBot: true,
      timestamp: new Date(),
      feedback: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickReplies: QuickReply[] = [
    { id: 1, text: "How do I prepare for exams?" },
    { id: 2, text: "What subjects do you cover?" },
    { id: 3, text: "Tell me about your AI features" },
    { id: 4, text: "How much does it cost?" }
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    sendMessage(inputValue);
  };

  const sendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      isBot: false,
      timestamp: new Date(),
      feedback: null
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowQuickReplies(false);

    // Simulate bot response after a delay
    setTimeout(() => {
      let responseText = "Thanks for your message! Our team will get back to you soon. In the meantime, feel free to explore our learning resources or check out our FAQ section.";
      
      // Simple keyword matching for demo purposes
      if (text.toLowerCase().includes("exam")) {
        responseText = "Our platform offers comprehensive exam preparation resources including practice tests, study guides, and personalized learning paths. Would you like me to show you some examples?";
      } else if (text.toLowerCase().includes("subject")) {
        responseText = "We cover a wide range of subjects including Mathematics, Physics, Chemistry, Biology, History, Geography, and more. Each subject has tailored content for different grade levels.";
      } else if (text.toLowerCase().includes("ai") || text.toLowerCase().includes("feature")) {
        responseText = "Our AI features include personalized learning paths, intelligent question answering, automated progress tracking, and adaptive quizzes that adjust to your skill level.";
      } else if (text.toLowerCase().includes("cost") || text.toLowerCase().includes("price")) {
        responseText = "We offer a free basic plan and premium subscriptions starting at $9.99/month. Premium plans include additional features like advanced AI tutoring and unlimited practice tests.";
      }
      
      const botResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        isBot: true,
        timestamp: new Date(),
        feedback: null
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.text);
  };

  const toggleQuickReplies = () => {
    setShowQuickReplies(!showQuickReplies);
  };

  const provideFeedback = (messageId: number, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, feedback } 
          : message
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        aria-label="Chat with us"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            )}
          </>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            className="fixed bottom-20 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <Bot className="h-6 w-6 mr-2" />
                  <span className="absolute bottom-0 right-1 h-2 w-2 bg-green-400 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold">ExtreamX Assistant</h3>
                  <p className="text-xs text-blue-100">Online | Ready to help</p>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full p-1"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="p-4 h-80 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.isBot
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                        : 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${message.isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                      
                      {message.isBot && (
                        <div className="flex items-center space-x-1 ml-2">
                          <button 
                            onClick={() => provideFeedback(message.id, 'positive')}
                            className={`p-1 rounded-full ${message.feedback === 'positive' ? 'bg-green-100 dark:bg-green-800' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            aria-label="Helpful"
                          >
                            <ThumbsUp className={`h-3 w-3 ${message.feedback === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                          </button>
                          <button 
                            onClick={() => provideFeedback(message.id, 'negative')}
                            className={`p-1 rounded-full ${message.feedback === 'negative' ? 'bg-red-100 dark:bg-red-800' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                            aria-label="Not helpful"
                          >
                            <ThumbsDown className={`h-3 w-3 ${message.feedback === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <p className="text-sm">Typing...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length < 3 && (
              <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div 
                  className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleQuickReplies}
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick replies</span>
                  {showQuickReplies ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                
                <AnimatePresence>
                  {showQuickReplies && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 grid grid-cols-2 gap-2">
                        {quickReplies.map((reply) => (
                          <motion.button
                            key={reply.id}
                            className="text-xs text-left p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply.text}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <motion.button
                type="submit"
                className={`ml-2 p-2 rounded-full ${
                  inputValue.trim() === '' 
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                } text-white`}
                whileHover={inputValue.trim() !== '' ? { scale: 1.1 } : {}}
                whileTap={inputValue.trim() !== '' ? { scale: 0.9 } : {}}
                disabled={inputValue.trim() === ''}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </form>

            {/* Powered by */}
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by <span className="font-medium text-blue-600 dark:text-blue-400">ExtreamX AI</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot; 