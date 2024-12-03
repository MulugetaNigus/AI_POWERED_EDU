import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingCredits: number;
}

export default function SubscriptionModal({ isOpen, onClose, remainingCredits }: SubscriptionModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-md rounded-2xl max-w-md w-full p-8 shadow-xl border border-white/20 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-2xl blur-sm"></div>

        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/90 dark:to-red-800/90">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              {remainingCredits <= 0 ? 'Out of Credits!' : 'Low Credits!'}
            </h3>

            <p className="mt-2 text-base text-gray-800 dark:text-gray-200">
              {remainingCredits <= 0
                ? "You've run out of credits. Subscribe to continue using our AI features."
                : `You only have ${remainingCredits} credits remaining. Subscribe to get more credits and unlock premium features.`}
            </p>

            <div className="mt-6 grid gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/subscription');
                }}
                className="w-full inline-flex justify-center items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                View Subscription Plans
              </button>
              <button
                onClick={onClose}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-200/50 dark:border-gray-600/50 text-sm font-semibold rounded-xl text-gray-800 dark:text-white bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-600/90 backdrop-blur-sm transition-all duration-200"
              >
                Continue with Limited Credits
              </button>
            </div>

            <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Subscribe to our Basic or Premium plan to get more credits and unlock additional features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
