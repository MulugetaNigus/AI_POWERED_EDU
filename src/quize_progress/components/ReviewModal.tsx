import { useEffect } from 'react';
import { X, BookOpen, Target, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacker: {
    subject: string;
    score: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: {
      topic: string;
      action: string;
      resources: string[];
    }[];
  };
}

export default function ReviewModal({ isOpen, onClose, feedbacker }: ReviewModalProps) {

  // useEffect( () => {
    // alert(feedbacker.score)
  // }, [])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {feedbacker.subject} Review
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Current Score: {feedbacker.score}%
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {/* <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span> */}
              {/* <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{feedbacker.score}%</span> */}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${parseInt(feedbacker.score) * 20}%` }}
              />
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Strengths</h4>
              <ul className="space-y-2">
                {feedbacker.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Areas to Improve</h4>
              <ul className="space-y-2">
                {feedbacker.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                    <Target className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Recommended Actions</h4>
            {feedbacker.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{rec.topic}</h5>
                <p className="text-blue-700 dark:text-blue-300 mb-3">{rec.action}</p>
                <div className="text-sm">
                  <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Resources:</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {rec.resources.map((resource, i) => (
                      <li key={i} className="text-blue-600 dark:text-blue-400">{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}