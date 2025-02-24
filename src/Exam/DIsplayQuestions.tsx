import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Modal from './Modal';
import ExamHeader from './ExamHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronLeft, ChevronRight, HelpCircle, Trophy } from 'lucide-react';

interface Question {
  question: string;
  alternatives: string[];
  answer: string;
  answerDetail: string;
}

interface TransformedQuestion {
  question: string;
  alternatives: string[];
  answer: string;
  answerDetail: string;
}

interface DisplayQuestionsProps {
  questions: TransformedQuestion[];
}

const DisplayQuestions: React.FC<DisplayQuestionsProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnswerDetail, setSelectedAnswerDetail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setProgress((currentQuestionIndex / questions.length) * 100);
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerClick = (index: number) => {
    if (isAnswerSelected) return;

    const isCorrect = currentQuestion.alternatives[index] === currentQuestion.answer;
    setSelectedAnswerIndex(index);
    setIsAnswerCorrect(isCorrect);
    setSelectedAnswerDetail(currentQuestion.answerDetail);
    setIsModalOpen(true);
    setIsAnswerSelected(true);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Check if this is the last question
    if (currentQuestionIndex === questions.length - 1) {
      setTimeout(() => {
        setShowResultModal(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetSelection();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetSelection();
    }
  };

  const resetSelection = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setIsAnswerSelected(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ExamHeader />

      <div className="container mx-auto px-4 pt-28">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 dark:bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {currentQuestion.alternatives.map((alt, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`w-full text-left p-6 rounded-xl transition-all transform
                    ${selectedAnswerIndex === index
                      ? isAnswerCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                      : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }
                    ${isAnswerSelected ? 'cursor-not-allowed opacity-75' : 'hover:scale-[1.01]'}
                    border-2 font-medium`}
                  disabled={isAnswerSelected}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    {selectedAnswerIndex === index && (
                      <span className="flex-shrink-0">
                        {isAnswerCorrect ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </span>
                    )}
                    <span>{alt}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors
                ${currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              Show Explanation
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1 || !isAnswerSelected}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors
                ${(currentQuestionIndex === questions.length - 1 || !isAnswerSelected)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500'
                }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md m-4 p-6"
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Exam Completed!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  You got <span className="font-bold text-blue-600">{correctAnswers}</span> out of{' '}
                  <span className="font-bold text-blue-600">{questions.length}</span> questions correct!
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Score: {Math.round((correctAnswers / questions.length) * 100)}%
                </div>
                <button
                  onClick={() => window.location.href = "/exam"}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg
                    hover:bg-blue-700 transition-colors"
                >
                  Finish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && <Confetti />}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={selectedAnswerDetail}
      />
    </div>
  );
};

export default DisplayQuestions;