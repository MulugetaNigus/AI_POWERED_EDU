import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import SuccessPayment from './SuccessPayment';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 250,
    credits: 50,
    features: [
      '50 AI Credits',
      'PDF Chat Support',
      'Feedback Analytics',
    ]
  },
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
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentError, setpaymentError] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    setEmail(user.email);
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user_info") || "{}");
      // Generate a unique transaction reference
      const tx_ref = `sub_${plan.id}_${Date.now()}`;

      const response = await axios.post('http://localhost:8888/api/v1/initialize',
        {
          amount: plan.price.toString(),
          currency: "ETB",
          email: email,
          tx_ref: tx_ref,
          callback_url: `${window.location.origin}/payment-callback?tx_ref=${tx_ref}`,
          return_url: `${window.location.origin}/payment-callback?tx_ref=${tx_ref}`
        }
      );

      // Check if we have a successful response with checkout URL
      if (response.data.status === 'success' && response.data.data.checkout_url) {
        // Store transaction details in localStorage for verification
        localStorage.setItem('pending_payment', JSON.stringify({
          tx_ref,
          plan_id: plan.id,
          amount: plan.price,
          credits: plan.credits,
          userId: user._id // Store user ID for credit update
        }));

        // Redirect to the checkout URL
        window.location.href = response.data.data.checkout_url;
      } else {
        console.error('Payment initialization failed:', response.data);
      }
    } catch (error) {
      setpaymentError(true);
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-6 lg:p-8">
      {/* Success Payment Modal */}
      <SuccessPayment
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        plan={selectedPlan || undefined}
      />
      {/* Add decorative background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-purple-500/5 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-start mb-5">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
            Get more credits and unlock premium features
          </p>
          <br />
          {paymentError &&
            <div className='border-2 border-red-200 bg-red-200 p-4 rounded flex items-center justify-center w-2/6'>
              <span><p className='text-red-900 font-bold text-base'>Payment Error, Please try again !</p></span>
            </div>
          }
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-xl
                group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                ${plan.id === 'premium'
                  ? 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60'
                  : plan.id === 'starter'
                    ? 'bg-gradient-to-br from-white/95 to-white/75 dark:from-gray-800/95 dark:to-gray-900/75'
                    : 'bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70'}`}
            >
              {/* Mirror effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-transparent to-transparent dark:from-white/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-100"></div>
              </div>

              {/* Card decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors duration-300"></div>
              <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-2xl blur-sm group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors duration-300"></div>

              {plan.id === 'premium' && (
                <div className="absolute top-4 right-4 transform group-hover:scale-105 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Popular
                  </span>
                </div>
              )}

              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transform group-hover:translate-y-[-2px] transition-transform duration-300">{plan.name}</h3>
                <div className="flex items-baseline mb-8 transform group-hover:translate-y-[-2px] transition-transform duration-300">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-colors duration-300">
                    ETB {plan.price}
                  </span>
                  <span className="ml-2 text-lg font-medium text-gray-800 dark:text-gray-200">/one time</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-800 dark:text-gray-200 font-medium transform group-hover:translate-x-1 transition-transform duration-300 delay-[${index * 50}ms]"
                    >
                      <div className="mr-3 p-1 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-colors duration-300">
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
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold transition-all duration-300
                    transform group-hover:scale-[1.02] group-hover:shadow-xl
                    ${plan.id === 'premium'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-purple-500/25'
                      : plan.id === 'starter'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25'
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
