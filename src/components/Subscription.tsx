import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebaseConfig';
import { getUserCredits, createPayment } from '../services/mongoService';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 500, 
    credits: 100,
    features: [
      '100 AI Credits',
      'PDF Chat Support',
      'Feedback Analytics',
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 1000, 
    credits: 500,
    features: [
      '500 AI Credits',
      'PDF Chat Support',
      'Feedback Analytics'
    ]
  }
];

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      const user = auth.currentUser;
      if (user) {
        const credits = await getUserCredits(user.uid);
        if (credits) {
          setUserCredits(credits.credits);
        }
      }
    };
    fetchCredits();
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const txRef = `sub_${user.uid}_${Date.now()}_${plan.id}`;

      // Create payment record in MongoDB
      await createPayment(user.uid, txRef, plan.price, plan.id as 'basic' | 'premium');

      // Initialize Chapa payment
      const response = await axios.post('YOUR_BACKEND_ENDPOINT/create-payment', {
        amount: plan.price,
        email: user.email,
        first_name: user.displayName?.split(' ')[0] || 'User',
        last_name: user.displayName?.split(' ').slice(1).join(' ') || 'Name',
        tx_ref: txRef,
        callback_url: `${window.location.origin}/payment-callback`,
        return_url: `${window.location.origin}/dashboard`,
        customization: {
          title: `${plan.name} Subscription`,
          description: `Subscribe to ${plan.name} and get ${plan.credits} credits`
        }
      });

      // Redirect to Chapa payment page
      window.location.href = response.data.data.checkout_url;

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Learning Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Get more AI credits and unlock advanced features
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700"
            >
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price} ETB
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </p>
                <p className="mt-8">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Includes:
                  </span>
                  <ul className="mt-4 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                </p>
              </div>
              <div className="px-6 pt-6 pb-8">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading}
                  className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {userCredits !== null && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
            Your current balance: {userCredits} credits
          </div>
        )}
      </div>
    </div>
  );
}
