import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Modal from './Modal';
import ExamHeader from './ExamHeader';

const DisplayQuestions = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnswerDetail, setSelectedAnswerDetail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false); // Track if an answer is selected

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (index) => {
    const isCorrect = currentQuestion.alternatives[index] === currentQuestion.answer;
    setSelectedAnswerIndex(index);
    setIsAnswerCorrect(isCorrect);
    setSelectedAnswerDetail(currentQuestion.answerDetail);
    setIsModalOpen(true);
    setIsAnswerSelected(true); // Disable further answer selection

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Confetti lasts for 3 seconds
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
    <div className="h-full">
      <ExamHeader />

      <div className="pt-28 mx-16 my-10 shadow p-10 rounded-lg dark:bg-gray-800">
        <p className="dark:text-white text-gray-600 font-bold text-xl">
          <span>{currentQuestionIndex + 1}.</span> {currentQuestion.question}
        </p>

        {currentQuestion.alternatives.map((alt, index) => (
          <div
            key={index}
            onClick={() => !isAnswerSelected && handleAnswerClick(index)} // Disable click if answer is selected
            className={`mt-6 border-2 p-5 rounded-lg font-bold cursor-pointer transition ease-out duration-125
              ${selectedAnswerIndex === index
                ? isAnswerCorrect
                  ? 'border-2 border-blue-500 text-gray-600'
                  : 'border-2 border-red-500 text-gray-600'
                : 'border-blue-200 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:text-white'
              }
              ${isAnswerSelected ? 'pointer-events-none opacity-50' : ''}`} // Disable interaction and reduce opacity
          >
            {alt}
          </div>
        ))}

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevious}
            className="text-white font-bold hover:bg-red-500 border-2 hover:border-red-500 border-red-600 px-14 p-3 rounded-lg bg-red-600 cursor-pointer"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="text-white font-bold hover:bg-blue-500 border-2 hover:border-blue-500 border-blue-600 px-14 p-3 rounded-lg bg-blue-600 cursor-pointer"
            disabled={currentQuestionIndex === questions.length - 1 || !isAnswerSelected} // Disable Next button until an answer is selected
          >
            Next
          </button>
        </div>
      </div>

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