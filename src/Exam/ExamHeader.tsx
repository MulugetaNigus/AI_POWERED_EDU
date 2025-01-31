import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Timer, Flag } from 'lucide-react';

interface ExamHeaderProps {
  timer?: {
    minutes: number;
    seconds: number;
  };
  questionsCompleted?: number;
  totalQuestions?: number;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ 
  timer,
  questionsCompleted = 0,
  totalQuestions = 0
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <Header />
      
      {/* Exam Progress Bar */}
      {(timer || totalQuestions > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-2 flex items-center justify-between"
        >
          {timer && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Timer className="w-4 h-4" />
              <span className="font-medium">
                {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
              </span>
            </div>
          )}
          
          {totalQuestions > 0 && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Flag className="w-4 h-4" />
              <span className="font-medium">
                {questionsCompleted} of {totalQuestions} Questions
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ExamHeader;