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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <XCircle className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
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

          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {remainingCredits <= 0 ? 'Out of Credits!' : 'Low Credits!'}
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {remainingCredits <= 0
              ? "You've run out of credits. Subscribe to continue using our AI features."
              : `You only have ${remainingCredits} credits remaining. Subscribe to get more credits and unlock premium features.`}
          </p>

          <div className="mt-4 grid gap-3">
            <button
              onClick={() => {
                onClose();
                navigate('/subscription');
              }}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Subscription Plans
            </button>
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue with Limited Credits
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Subscribe to our Basic or Premium plan to get more credits and unlock additional features.
          </p>
        </div>
      </div>
    </div>
  );
}
