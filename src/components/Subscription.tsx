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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-6 lg:p-8">
      {/* Add decorative background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-purple-500/5 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
            Get more credits and unlock premium features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-xl
                ${plan.id === 'premium' 
                  ? 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60' 
                  : 'bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70'}`}
            >
              {/* Add card decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-2xl blur-sm"></div>

              {plan.id === 'premium' && (
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Popular
                  </span>
                </div>
              )}

              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    ETB {plan.price}
                  </span>
                  <span className="ml-2 text-lg font-medium text-gray-800 dark:text-gray-200">/one time</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-800 dark:text-gray-200 font-medium">
                      <div className="mr-3 p-1 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold transition-all duration-200
                    ${plan.id === 'premium'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
