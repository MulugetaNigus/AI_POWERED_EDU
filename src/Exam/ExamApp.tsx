import React, { useState, useEffect } from 'react';
import FormModal from './FormModal';
import DisplayQuestions from './DIsplayQuestions';
import DummyQuestions from './DummyQuestions';
import ExamHeader from './ExamHeader';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award } from 'lucide-react';
import { ExamDetails, ExamQuestion } from './types';

const ExamApp: React.FC = () => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (examDetails) {
            fetchQuestions();
        }
    }, [examDetails]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://extreamx-backend.onrender.com/api/v1/getAllExamQuestions');
            const data = await response.json();
            
            const filteredQuestions = data.filter((q: ExamQuestion) => 
                q.subject === examDetails?.subject && 
                q.grade === examDetails?.grade &&
                q.year.toString() === examDetails?.period
            );

            if (filteredQuestions.length === 0) {
                setError('No questions found for the selected criteria');
                return;
            }

            // Transform the questions into the required format
            const transformedQuestions = filteredQuestions[0].questions.map(q => ({
                question: q.question,
                alternatives: q.options,
                answer: q.options[q.correctAnswer],
                answerDetail: `The correct answer is: ${q.options[q.correctAnswer]}`
            }));

            setQuestions(transformedQuestions);
        } catch (err) {
            setError('Failed to fetch questions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="bg-green-500 text-white rounded-lg p-4 text-xl">
                {error}
            </div>
            <button onClick={() => window.location.href = "/"} className="mt-4 px-4 py-2 bg-white text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors duration-300">Return to Home Page</button>
        </div>;
    }

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
                <>
                    {questions.length > 0 ? (
                        <DisplayQuestions questions={questions} />
                    ) : (
                        <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
                            No questions available for the selected criteria
                        </div>
                    )}
                </>
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
