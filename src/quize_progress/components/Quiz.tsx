import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useProgressStore } from './store/progressStore';
import { generatePersonalizedFeedback } from './lib/gemini';
import PDFUploader from './PDFUploader';

interface QuizProps {
  subject: string;
  grade: string;
}

export default function Quiz({ subject, grade }: QuizProps) {
  const { questions, topics, addQuizResult } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; questionIndex: number }[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, { correct: isCorrect, questionIndex: currentQuestion }];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setIsGeneratingFeedback(true);
      try {
        const personalizedFeedback = await generatePersonalizedFeedback(newAnswers, topics);
        setFeedback(personalizedFeedback);
        
        const score = newAnswers.filter(a => a.correct).length;
        addQuizResult(subject, score, questions.length);
      } catch (error) {
        console.error('Error generating feedback:', error);
      }
      setIsGeneratingFeedback(false);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  if (questions.length === 0) {
    return <PDFUploader />;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
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

      {isGeneratingFeedback && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Generating personalized feedback...
          </p>
        </div>
      )}

      {feedback && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Quiz Complete - Performance Analysis
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {feedback.strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Areas for Improvement</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {feedback.weaknesses.map((weakness: string, index: number) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations</h4>
              {feedback.recommendations.map((rec: any, index: number) => (
                <div key={index} className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-2">{rec.topic}</h5>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{rec.action}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Recommended Resources:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {rec.resources.map((resource: string, i: number) => (
                        <li key={i}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}