import React from 'react';
// import { UserCircle, Clock } from "lucide-react";
import { format } from 'date-fns';
import ReactMarkdown from "react-markdown";


type ChatMessageProps = {
  message: string;
  isUser: boolean;
  timestamp: Date;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  const formattedTime = format(timestamp, 'HH:mm');

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
            {/* {!isUser && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <span className="text-sm font-bold">AI</span>
                </div>
              </div>
            )} */}
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
                    }}
                  >
                    {message}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message}</p>
              )}
            </div>
            {/* {isUser && (
              <div className="flex-shrink-0 ml-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-gray-500" />
                </div>
              </div>
            )} */}
          </div>
          <div className={`flex items-center text-xs mt-2 ${
            isUser ? "justify-end text-purple-200" : "justify-start text-gray-400"
          }`}>
            {/* <Clock className="w-3 h-3 mr-1" /> */}
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;