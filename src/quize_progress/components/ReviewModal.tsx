import React from 'react';
import { X, BookOpen, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: {
    topic: string;
    score: number;
  };
}

const improvementAreas = {
  'Mechanics': {
    title: 'Mechanics Improvement Plan',
    description: "Your understanding of mechanical physics concepts needs strengthening. Focus on these key areas:",
    areas: [
      {
        title: "Newton's Laws of Motion",
        description: "Review the fundamental principles of motion, forces, and their interactions. Pay special attention to problem-solving involving multiple forces."
      },
      {
        title: "Conservation of Energy",
        description: "Practice problems involving energy transformations, particularly between kinetic and potential energy in various systems."
      },
      {
        title: "Momentum and Collisions",
        description: "Work on understanding elastic and inelastic collisions, and how momentum is conserved in isolated systems."
      }
    ],
    resources: [
      "Interactive Physics Simulations",
      "Video Tutorials on Force Analysis",
      "Practice Problems with Step-by-Step Solutions"
    ]
  },
  'Thermodynamics': {
    title: 'Thermodynamics Mastery Path',
    description: "Your thermodynamics foundation needs reinforcement. Concentrate on these essential concepts:",
    areas: [
      {
        title: "Laws of Thermodynamics",
        description: "Focus on understanding heat transfer, energy conservation, and entropy in thermal processes."
      },
      {
        title: "Gas Laws and Behavior",
        description: "Practice problems involving ideal gas law, real gases, and their behavior under different conditions."
      },
      {
        title: "Heat Engines and Efficiency",
        description: "Study the principles of heat engines, refrigeration cycles, and calculating thermal efficiency."
      }
    ],
    resources: [
      "Thermal Process Animations",
      "Interactive Temperature-Pressure Diagrams",
      "Thermodynamics Problem Sets"
    ]
  }
};

export default function ReviewModal({ isOpen, onClose, topic }: ReviewModalProps) {
  if (!isOpen) return null;

  const improvement = improvementAreas[topic.topic as keyof typeof improvementAreas];

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
                  {improvement.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Current Score: {topic.score}%
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

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {improvement.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{topic.score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${topic.score}%` }}
              />
            </div>
          </div>

          {/* Improvement Areas */}
          <div className="space-y-4 mb-8">
            {improvement.areas.map((area, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {area.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recommended Resources
            </h4>
            <ul className="space-y-2">
              {improvement.resources.map((resource, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {resource}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}