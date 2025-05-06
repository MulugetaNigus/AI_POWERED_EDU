import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
}: OnboardingLayoutProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="relative mb-6">
            {/* Progress bar */}
            <div className="h-2 bg-gray-100 dark:bg-gray-700">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Back button */}
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="absolute left-4 top-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Step indicator */}
            <div className="absolute right-4 top-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index <= currentStep
                    ? 'bg-blue-500 dark:bg-blue-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: index === currentStep ? 1.2 : 0.8,
                  opacity: index === currentStep ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}