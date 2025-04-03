import { useState, useEffect } from 'react';
import { Loader2, Check, X, CreditCard, Zap, Shield, FileText, ArrowRight, Star, HelpCircle, AlertCircle, Crown } from 'lucide-react';
import axios from 'axios';
import SuccessPayment from './SuccessPayment';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  isPopular?: boolean;
}

// Define SuccessPaymentProps to match the expected props in SuccessPayment
interface SuccessPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: {
    name: string;
    price: number;
    credits: number;
  };
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 250,
    credits: 50,
    features: [
      '50 AI Credits',
      'PDF Chat Support',
      'Basic Analytics',
      'Email Support',
      'Single Device Access'
    ]
  },
  {
    id: 'basic',
    name: 'Pro',
    price: 500,
    credits: 100,
    isPopular: true,
    features: [
      '100 AI Credits',
      'Advanced PDF Chat',
      'Detailed Analytics',
      'Priority Support',
      'Multiple Device Access',
      'Exam Practice Questions'
    ]
  },
  {
    id: 'premium',
    name: 'Elite',
    price: 1000,
    credits: 500,
    features: [
      '500 AI Credits',
      'Premium PDF Analysis',
      'Advanced Analytics Dashboard',
      '24/7 Priority Support',
      'Unlimited Device Access',
      'Unlimited Practice Questions',
      'Personalized Study Plans'
    ]
  }
];

export default function Subscription() {
  const [loading, setLoading] = useState<{ [planId: string]: boolean }>({});
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [email, setEmail] = useState<string | undefined>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [userID, setUserID] = useState<string | undefined>("");
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showFeatureTooltip, setShowFeatureTooltip] = useState<{[key: string]: boolean}>({});

  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setEmail(user?.emailAddresses[0].emailAddress);
    const currentUserEmail = user?.emailAddresses[0].emailAddress;

    if (currentUserEmail) {
      fetchUserID(currentUserEmail);
    }
  }, [user]);

  useEffect(() => {
    if (userID) {
      localStorage.setItem("CURRENTUSERIDFORPAYMENT", JSON.stringify(userID));
    }
  }, [userID]);

  useEffect(() => {
    if (paymentError) {
      setShowErrorToast(true);
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        setPaymentError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentError]);

  const fetchUserID = async (currentUserEmail: string) => {
    try {
      const response = await axios.get(`http://localhost:8888/api/v1/onboard?email=${currentUserEmail}`);
      const userData = response.data;
      const currentUserData = userData.find((user: { email: string; }) => user.email === currentUserEmail);
      if (currentUserData) {
        setUserID(currentUserData._id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    setLoading(prev => ({ ...prev, [plan.id]: true }));
    setSelectedPlan(plan);

    try {
      // Generate a unique transaction reference
      const tx_ref = `sub_${plan.id}_${Date.now()}`;
      const callbackUrl = `${window.location.origin}/payment-callback?tx_ref=${tx_ref}`;

      const response = await axios.post('http://localhost:8888/api/v1/initialize',
        {
          amount: (cycle === 'annual' ? plan.price * 10 * 0.85 : plan.price).toString(),
          currency: "ETB",
          email: email,
          tx_ref: tx_ref,
          callback_url: callbackUrl,
          return_url: callbackUrl
        }
      );

      // Check if we have a successful response with checkout URL
      if (response.data.status === 'success' && response.data.data.checkout_url) {
        // Store transaction details in localStorage for verification
        localStorage.setItem('pending_payment', JSON.stringify({
          tx_ref,
          plan_id: plan.id,
          amount: cycle === 'annual' ? plan.price * 10 * 0.85 : plan.price,
          credits: cycle === 'annual' ? plan.credits * 12 : plan.credits,
          userId: userID
        }));

        // Redirect to the checkout URL
        window.location.href = response.data.data.checkout_url;
      } else {
        setPaymentError(true);
        console.error('Payment initialization failed:', response.data);
      }
    } catch (error) {
      setPaymentError(true);
      console.error('Payment error:', error);
    } finally {
      setLoading(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  const toggleFeatureTooltip = (feature: string) => {
    setShowFeatureTooltip(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const planColors = {
    starter: {
      light: 'from-blue-500 to-blue-600',
      dark: 'from-blue-600 to-blue-700',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      icon: 'text-blue-500 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      shadow: 'shadow-blue-500/20 dark:shadow-blue-900/20'
    },
    basic: {
      light: 'from-purple-500 to-blue-500',
      dark: 'from-purple-600 to-blue-600',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      icon: 'text-purple-500 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      shadow: 'shadow-purple-500/20 dark:shadow-purple-900/20'
    },
    premium: {
      light: 'from-amber-500 to-orange-500',
      dark: 'from-amber-600 to-orange-600',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
      icon: 'text-amber-500 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      shadow: 'shadow-amber-500/20 dark:shadow-amber-900/20'
    }
  };

  const featureTooltips: { [key: string]: string } = {
    'PDF Chat Support': 'Upload your PDF documents and ask questions directly about the content.',
    'Advanced PDF Chat': 'Enhanced PDF analysis with better context understanding and detailed insights.',
    'Premium PDF Analysis': 'Top-tier PDF parsing with deep learning insights and comprehensive explanations.',
    'Basic Analytics': 'Track your usage and learning progress with simple charts and reports.',
    'Detailed Analytics': 'Advanced insights into your learning patterns with personalized recommendations.',
    'Advanced Analytics Dashboard': 'Comprehensive analytics suite with predictive insights and performance tracking.'
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] opacity-30 dark:opacity-10 bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] opacity-30 dark:opacity-10 bg-gradient-to-t from-amber-100 to-red-100 dark:from-amber-900 dark:to-red-900 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      {/* Floating accent elements */}
      <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-blue-400/30 dark:from-purple-400/10 dark:to-blue-400/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-amber-400/30 to-orange-400/30 dark:from-amber-400/10 dark:to-orange-400/10 rounded-full blur-xl animate-float-delayed"></div>

      {/* Success modal */}
      <SuccessPayment
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        plan={selectedPlan}
      />

      {/* Error toast */}
      <AnimatePresence>
        {showErrorToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 shadow-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-gray-800 dark:text-gray-200">Payment processing error. Please try again.</p>
            <button 
              onClick={() => setShowErrorToast(false)} 
              className="ml-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Left aligned now */}
        <div className="text-left mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30">
            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Subscription Plans</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-0 max-w-2xl">
              <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400">
                Power Up Your Learning
              </span>
            </h1>
            
            {/* Billing cycle toggle - Left aligned now */}
            <div className="md:ml-6">
              <div className="inline-flex p-1 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCycle('monthly')}
                  className={`relative px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    cycle === 'monthly'
                      ? 'text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cycle === 'monthly' && (
                    <motion.div
                      layoutId="billingTabBackground"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Monthly</span>
                </button>
                
                <button
                  onClick={() => setCycle('annual')}
                  className={`relative px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    cycle === 'annual'
                      ? 'text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cycle === 'annual' && (
                    <motion.div
                      layoutId="billingTabBackground"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Annual</span>
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Save 15%
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mt-6">
            Choose the plan that best fits your needs and elevate your exam preparation with our AI-powered tools.
          </p>
        </div>

        {/* Pricing cards - Enhanced with better spacing and features */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: plans.indexOf(plan) * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.isPopular ? 'md:-translate-y-4 z-10' : 'z-0'
              }`}
            >
              {/* Card background with gradient border */}
              <div className="absolute inset-0 p-0.5 rounded-2xl bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-[calc(1rem-1px)]"></div>
              </div>
              
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="px-4 py-1 rounded-full text-xs font-semibold flex items-center
                    bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              {/* Card content - Using flex column with justify-between to align buttons */}
              <div className={`relative h-full p-6 sm:p-8 flex flex-col 
                ${plan.isPopular ? 'bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10' : 'bg-white dark:bg-gray-900'}`}
              >
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className={`text-4xl font-extrabold 
                        ${plan.isPopular 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400' 
                          : 'text-gray-900 dark:text-white'}`}>
                        {cycle === 'annual' 
                          ? `${Math.round(plan.price * 10 * 0.85)}`
                          : `${plan.price}`}
                      </span>
                      <span className="ml-1 text-2xl font-semibold text-gray-500 dark:text-gray-400">ETB</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
                        /{cycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Feature badge */}
                  <div className={`inline-flex items-center px-3 py-1 mb-6 rounded-full ${planColors[plan.id as keyof typeof planColors].badge}`}>
                    <Zap className={`h-4 w-4 mr-2 ${planColors[plan.id as keyof typeof planColors].icon}`} />
                    <span className="text-sm">
                      {cycle === 'annual' 
                        ? `${plan.credits * 12} AI Credits`
                        : `${plan.credits} AI Credits`}
                    </span>
                  </div>
                  
                  {/* Features list - enhanced with better spacing */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start group">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${planColors[plan.id as keyof typeof planColors].badge} flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-200`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <div className="ml-3 relative">
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                          
                          {/* Info tooltip for certain features */}
                          {featureTooltips[feature] && (
                            <div className="inline-block ml-1">
                              <button 
                                onMouseEnter={() => toggleFeatureTooltip(feature)}
                                onMouseLeave={() => toggleFeatureTooltip(feature)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                              >
                                <HelpCircle className="h-3.5 w-3.5" />
                              </button>
                              
                              {showFeatureTooltip[feature] && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute z-20 left-0 bottom-full mb-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-700 dark:text-gray-300"
                                >
                                  {featureTooltips[feature]}
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Button section - now in a separate div at the bottom with mt-auto */}
                <div className="mt-auto pt-8">
                  {/* CTA Button - Enhanced with better hover effects */}
                  <motion.button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading[plan.id]}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                      flex items-center justify-center ${loading[plan.id] ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'} 
                      bg-gradient-to-r ${planColors[plan.id as keyof typeof planColors].light} hover:${planColors[plan.id as keyof typeof planColors].dark}
                      ${planColors[plan.id as keyof typeof planColors].shadow} transition-all duration-300`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading[plan.id] ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Select {plan.name}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Guarantee badge */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="h-3 w-3 mr-1 text-green-500" />
                    <span>7-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

