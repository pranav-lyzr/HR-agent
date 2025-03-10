import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import logo from './assets/main logo.png';

type Message = {
  text: string;
  isUser: boolean;  
  timestamp: Date;
};

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const newUserMessage = { 
      text: message, 
      isUser: true, 
      timestamp: new Date() 
    };
    setMessages((prev) => [...prev, newUserMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-yStV4gbpjadbQSw4i7QhoOLRwAs5dEcl',
        },
        body: JSON.stringify({
          user_id: "pranav@lyzr.ai",
          agent_id: "67c967987b4f905b3a6b86b9",
          session_id: "67c967987b4f905b3a6b86b9",
          message: message
        }),
      });
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages((prev) => [...prev, { 
        text: data.response, 
        isUser: false, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages((prev) => [...prev, { 
        text: "Sorry, there was an error processing your request. Please try again.", 
        isUser: false, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top navbar */}
      <div className="bg-white p-3 shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <img 
            src={logo}
            alt="Lyzr Icon" 
            className="h-12 w-auto pr-2 border-r border-r-[#9d9d9d]"
          />
          <div className="items-baseline space-x-1">
            <h1 className="text-l font-bold text-gray-900">
              Saksoft HR
            </h1> 
            <h1 className="text-2xl -mt-2 font-bold text-purple-500">
              Agent
            </h1>
          </div>
        </div>
      </div>
      
      {/* Chat container with card */}
      <div className="flex-1 overflow-hidden p-4 flex justify-center">
        <div className="flex-1 overflow-hidden p-4 flex justify-center">
          <div className="w-full max-w-4xl h-full flex flex-col shadow-md bg-white rounded-lg overflow-hidden">
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Dolbix Performance Report Agent</h3>
                  <p className="text-gray-500 max-w-md">Ask any questions about performance reports, metrics, or insights.</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={index} 
                      message={message.text} 
                      isUser={message.isUser} 
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isLoading && <LoadingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-200">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
