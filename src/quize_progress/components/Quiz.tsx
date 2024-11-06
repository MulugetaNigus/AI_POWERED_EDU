import React, { useState } from 'react';
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { useProgressStore } from './store/progressStore';
import { generatePersonalizedFeedback, generateQuestionsForSubject } from './lib/gemini';
import PDFUploader from './PDFUploader';
import LoadingQuiz from './LoadingQuiz';

interface QuizProps {
  subject: string;
  grade: string;
}

export default function Quiz({ subject, grade }: QuizProps) {
  const { questions, topics, addQuizResult, updateQuestions, updateTopics, updateImprovementAreas } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; questionIndex: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startQuiz = async () => {
    if (!subject) {
      setError('Please select a subject first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting quiz for subject:', subject);
      const result = await generateQuestionsForSubject(subject);
      
      if (!result || !result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
        throw new Error('No questions received from the server');
      }

      console.log('Received questions:', result.questions.length);
      updateQuestions(result.questions);
      updateTopics(result.topics || []);
      if (result.improvementAreas) {
        updateImprovementAreas(result.improvementAreas);
      }
      setHasStarted(true);
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setHasStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, { correct: isCorrect, questionIndex: currentQuestion }];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      try {
        const personalizedFeedback = await generatePersonalizedFeedback(newAnswers, topics);
        const score = newAnswers.filter(a => a.correct).length;
        addQuizResult(subject, score, questions.length, personalizedFeedback);
      } catch (error) {
        console.error('Error generating feedback:', error);
        // Continue without feedback if there's an error
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  if (isLoading) {
    return <LoadingQuiz />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <XCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setHasStarted(false);
          }}
          className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Ready to start your {subject} quiz?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge in {subject} for {grade}
          </p>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <PDFUploader />;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {progress.toFixed(0)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {questions[currentQuestion].text}
      </h3>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showExplanation}
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              selectedAnswer === index
                ? index === questions[currentQuestion].correctAnswer
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-white">{option}</span>
              {showExplanation && selectedAnswer === index && (
                index === questions[currentQuestion].correctAnswer ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )
              )}
            </div>
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            {questions[currentQuestion].explanation}
          </p>
        </div>
      )}

      {showExplanation && currentQuestion < questions.length - 1 && (
        <button
          onClick={handleNext}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Question
        </button>
      )}
    </div>
  );
}