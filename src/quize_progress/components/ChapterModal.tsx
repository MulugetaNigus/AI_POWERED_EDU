import React, { useState } from 'react';
import { X, Book, ChevronDown } from 'lucide-react';

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (startChapter: string, endChapter: string) => void;
  subject: string;
  grade: string;
}

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export default function ChapterModal({ isOpen, onClose, onStartQuiz, subject, grade }: ChapterModalProps) {
  const [difficulty, setDifficulty] = useState<string>('');

  if (!isOpen) return null;

  const handleStartQuiz = () => {
    if (difficulty) {
      onStartQuiz(difficulty, difficulty);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Choose Quiz Difficulty
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the difficulty level for your {subject} quiz
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level
              </label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="">Select difficulty</option>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={!difficulty}
              className="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Let's Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
