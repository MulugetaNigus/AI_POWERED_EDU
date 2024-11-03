import React, { useState } from 'react';
import { X, Book, ChevronDown } from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  description: string;
}

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (startChapter: number, endChapter: number) => void;
  subject: string;
  grade: string;
}

const SAMPLE_CHAPTERS: Record<string, Chapter[]> = {
  Physics: [
    { id: 1, title: 'Mechanics', description: 'Forces, motion, and energy' },
    { id: 2, title: 'Thermodynamics', description: 'Heat, temperature, and thermal processes' },
    { id: 3, title: 'Optics', description: 'Light, reflection, and refraction' },
    { id: 4, title: 'Electricity', description: 'Electric charges, current, and circuits' },
  ],
  Mathematics: [
    { id: 1, title: 'Algebra', description: 'Equations and expressions' },
    { id: 2, title: 'Geometry', description: 'Shapes and measurements' },
    { id: 3, title: 'Trigonometry', description: 'Angular functions and relationships' },
  ],
  // Add more subjects as needed
};

export default function ChapterModal({ isOpen, onClose, onStartQuiz, subject, grade }: ChapterModalProps) {
  const [startChapter, setStartChapter] = useState<number>(0);
  const [endChapter, setEndChapter] = useState<number>(0);
  const chapters = SAMPLE_CHAPTERS[subject] || [];

  if (!isOpen) return null;

  const handleStartQuiz = () => {
    if (startChapter && endChapter) {
      onStartQuiz(startChapter, endChapter);
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
                Choose Quiz Chapters
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the chapter range for your {subject} quiz
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Chapter
              </label>
              <div className="relative">
                <select
                  value={startChapter}
                  onChange={(e) => setStartChapter(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value={0}>Select chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Chapter
              </label>
              <div className="relative">
                <select
                  value={endChapter}
                  onChange={(e) => setEndChapter(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value={0}>Select chapter</option>
                  {chapters
                    .filter((chapter) => chapter.id >= startChapter)
                    .map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={!startChapter || !endChapter}
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