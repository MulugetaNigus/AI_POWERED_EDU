import React, { useState } from 'react';
import FormModal from './FormModal';
import DisplayQuestions from './DIsplayQuestions';
import DummyQuestions from './DummyQuestions';
import ExamHeader from './ExamHeader';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award } from 'lucide-react';

interface ExamDetails {
  subject: string;
  period: string;
}

const ExamApp: React.FC = () => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);

    const handleStartClick = () => {
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (details: ExamDetails) => {
        setExamDetails(details);
        setIsFormModalOpen(false);
    };

    const handleFormClose = () => {
        setIsFormModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {!examDetails ? (
                <div className="relative">
                    <ExamHeader />
                    <div className="container mx-auto px-4 pt-32 pb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Ready to Test Your Knowledge?
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
                                Challenge yourself with our comprehensive exam system
                            </p>

                            {/* Features */}
                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                                >
                                    <BookOpen className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
                                    <h3 className="text-lg font-semibold dark:text-white">Multiple Subjects</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Choose from various subjects</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                                >
                                    <Clock className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
                                    <h3 className="text-lg font-semibold dark:text-white">Past Papers</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Practice with previous exams</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                                >
                                    <Award className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
                                    <h3 className="text-lg font-semibold dark:text-white">Instant Feedback</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Get immediate results</p>
                                </motion.div>
                            </div>

                            <motion.button
                                onClick={handleStartClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 text-lg font-semibold text-white rounded-xl
                                    bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
                                    hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600
                                    transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Start Exam
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            ) : (
                <DisplayQuestions questions={DummyQuestions} />
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
