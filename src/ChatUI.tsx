import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import logo from './assets/main logo.png';

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
};

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    const newUserMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    
    // Set streaming to true and add a loading message
    setIsStreaming(true);
    setMessages((prev) => [
      ...prev,
      { text: '', isUser: false, timestamp: new Date(), isLoading: true },
    ]);

    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/stream/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-yStV4gbpjadbQSw4i7QhoOLRwAs5dEcl',
        },
        body: JSON.stringify({
          user_id: "pranav@lyzr.ai",
          agent_id: "67c967987b4f905b3a6b86b9",
          session_id: "67c967987b4f905b3a6b86b9",
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (response.body) {
        const reader = response.body.getReader();
        let accumulatedMessage = '';

        // Replace loading message with an actual response message
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            text: '', 
            isUser: false, 
            timestamp: new Date(),
            isLoading: false 
          };
          return newMessages;
        });

        let streamDone = false;
        while (!streamDone) {
          const { value, done } = await reader.read();
          if (done) {
            streamDone = true;
            break;
          }
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim() === '[DONE]') {
                streamDone = true;
                break;
              } else {
                accumulatedMessage += data;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].text = accumulatedMessage;
                  return newMessages;
                });
              }
            }
          }
        }
        
        // Streaming is complete
        setIsStreaming(false);
      } else {
        throw new Error('Response body is null');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => {
        // Replace the loading message with an error message
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: "Sorry, there was an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
          isLoading: false,
        };
        return newMessages;
      });
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white p-3 shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Lyzr Icon"
            className="h-12 w-auto pr-2 border-r border-r-[#9d9d9d]"
          />
          <div className="items-baseline space-x-1">
            <h1 className="text-l font-bold text-gray-900">Saksoft HR</h1>
            <h1 className="text-2xl -mt-2 font-bold text-purple-500">Agent</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-4 flex justify-center">
        <div className="w-full max-w-4xl h-full flex flex-col shadow-md bg-white rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to Dolbix Performance Report Agent
                </h3>
                <p className="text-gray-500 max-w-md">
                  Ask any questions about performance reports, metrics, or insights.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  message.isLoading ? (
                    <div key={index} className="flex items-start mb-4">
                      {/* <div className="flex-shrink-0 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span className="text-purple-500 text-sm font-bold">AI</span>
                      </div> */}
                      <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-purple-500 animate-pulse"></div>
                          <div className="h-4 w-4 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                          <div className="h-4 w-4 rounded-full bg-purple-300 animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ChatMessage
                      key={index}
                      message={message.text}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  )
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div className="border-t border-gray-200">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
