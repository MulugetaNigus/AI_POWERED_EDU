import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, PartyPopper, X, CreditCard, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: {
    name: string;
    credits: number;
  };
}

const SuccessPayment: React.FC<SuccessPaymentProps> = ({ isOpen, onClose, plan }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleConfirm}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-full max-w-2xl mx-4 z-50 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl p-8 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

              {/* Success Icon Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -inset-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-2xl rounded-full"
                  />
                  <CheckCircle2 className="w-24 h-24 text-green-500" strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-6"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Payment Successful!
                </h2>
                
                <div className="space-y-4">
                  <p className="text-xl text-gray-700 dark:text-gray-300">
                    Thank you for subscribing to {plan?.name}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <CreditCard className="w-6 h-6 text-green-500" />
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          Payment Verified
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <Zap className="w-6 h-6 text-green-500" />
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {plan?.credits} Credits Added
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-lg text-gray-600 dark:text-gray-400">
                    <PartyPopper className="w-6 h-6" />
                    <p>Your account has been upgraded!</p>
                  </div>

                  {/* Confirm Button */}
                  {/* <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm();
                    }}
                    className="cursor-pointer mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/25 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Continue to Dashboard
                  </motion.button> */}
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleConfirm}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </motion.button>

              {/* Progress Bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 origin-left"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessPayment;
