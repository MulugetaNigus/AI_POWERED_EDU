import React, { useState } from 'react';
import FormModal from './FormModal';
import DisplayQuestions from './DIsplayQuestions';
import DummyQuestions from './DummyQuestions'; // Import your questions data
import ExamHeader from './ExamHeader';

const ExamApp = () => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [examDetails, setExamDetails] = useState(null);

    const handleStartClick = () => {
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (details) => {
        setExamDetails(details);
        setIsFormModalOpen(false);
    };

    const handleFormClose = () => {
        setIsFormModalOpen(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {!examDetails ? (
                <>
                    <ExamHeader />
                    <button
                        onClick={handleStartClick}
                        className="px-6 py-3 text-white text-xl font-bold rounded-lg 
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            bg-[length:400%_400%]
            animate-gradientShift"
                    >
                        Start Exam
                    </button>
                </>
            ) : (
                <div className='w-full'>
                    <DisplayQuestions questions={DummyQuestions} />
                </div>
            )}

            <FormModal
                isOpen={isFormModalOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default ExamApp;
