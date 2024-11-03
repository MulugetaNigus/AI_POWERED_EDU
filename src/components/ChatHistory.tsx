import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';

interface ChatHistoryProps {
  history: {
    grade: number;
    subject: string;
    messages: Array<{
      text: string;
      isAI: boolean;
      timestamp: string;
    }>;
  }[];
}

export default function ChatHistory({ history }: ChatHistoryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Chat History
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {history.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No chat history yet</p>
          </div>
        ) : (
          history.map((chat, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Grade {chat.grade} - {chat.subject}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {chat.messages.length} messages
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {chat.messages.slice(-2).map((message, msgIndex) => (
                  <div
                    key={msgIndex}
                    className={`text-sm ${
                      message.isAI
                        ? 'text-gray-600 dark:text-gray-300'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <span className="font-medium">{message.isAI ? 'AI' : 'You'}:</span>{' '}
                    {message.text.length > 100
                      ? `${message.text.substring(0, 100)}...`
                      : message.text}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}