import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from "react-markdown";

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  timestamp: Date;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  const formattedTime = format(timestamp, 'HH:mm');
  
  // Pre-process the message to replace literal '\n' strings with actual newlines
  // and handle Unicode escape sequences
  const processMessage = (text: string) => {
    // Replace literal '\n' with actual newline characters
    let processedText = text.replace(/\\n/g, '\n');
    
    // Handle Unicode escape sequences like \u20b9 (rupee symbol)
    processedText = processedText.replace(/\\u([0-9a-fA-F]{4})/g, (code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    return processedText;
  };

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[80%] rounded-lg p-4 shadow-sm ${
          isUser
            ? "bg-purple-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
        }`}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-start">
            <div className="flex-1">
            {!isUser ? (
                <div className="markdown-content text-sm">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-lg font-bold my-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-md font-bold my-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-sm font-bold my-1" {...props} />,
                      h4: ({ node, ...props }) => <h4 className="text-sm font-semibold my-1" {...props} />,
                      p: ({ node, ...props }) => <p className="my-1" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-4 my-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-4 my-1" {...props} />,
                      li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                      hr: ({ node, ...props }) => <hr className="my-2 border-gray-300" {...props} />,
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-2">
                          <table className="min-w-full border-collapse border border-gray-300" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => <thead className="bg-gray-200" {...props} />,
                      tbody: ({ node, ...props }) => <tbody {...props} />,
                      tr: ({ node, ...props }) => <tr className="border-b border-gray-300" {...props} />,
                      th: ({ node, ...props }) => <th className="border px-2 py-1 text-left" {...props} />,
                      td: ({ node, ...props }) => <td className="border px-2 py-1" {...props} />,
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-2 italic my-2" {...props} />
                      ),
                      code: ({ node, ...props }) => <code className="bg-gray-200 px-1 rounded" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-gray-200 p-2 rounded my-2 overflow-x-auto" {...props} />,
                      br: ({ node, ...props }) => <br className="my-1" {...props} />,
                      a: ({ node, ...props }) => (
                        <a
                          className="text-purple-600 underline hover:text-purple-800"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {processMessage(message)}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-line">{processMessage(message)}</p>
              )}
            </div>
          </div>
          <div className={`flex items-center text-xs mt-2 ${
            isUser ? "justify-end text-purple-200" : "justify-start text-gray-400"
          }`}>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;