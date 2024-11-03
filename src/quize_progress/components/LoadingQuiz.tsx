import React from 'react';
import { Brain } from 'lucide-react';

export default function LoadingQuiz() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="relative">
        <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-pulse" />
        <div className="absolute inset-0 w-12 h-12 border-t-2 border-blue-600 dark:border-blue-400 rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Generating Quiz
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Preparing personalized questions for you...
        </p>
      </div>
      <div className="w-full max-w-xs mx-auto">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 dark:bg-blue-400 rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}