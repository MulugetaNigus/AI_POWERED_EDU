import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SuccessPayment from '../components/SuccessPayment';
import { Loader2 } from 'lucide-react';

const PaymentCallback = () => {
  const [verifying, setVerifying] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get tx_ref from URL parameters
        const params = new URLSearchParams(location.search);
        const tx_ref = params.get('tx_ref');
        const status = params.get('status');

        if (!tx_ref) {
          throw new Error('Transaction reference not found');
        }

        if (status === 'failed') {
          throw new Error('Payment failed');
        }

        // Verify payment with backend
        const response = await axios.get(`http://localhost:8888/api/v1/verify/${tx_ref}`);

        if (response.data.status === 'success') {
          try {
            // Get pending payment details from localStorage
            const pendingPayment = JSON.parse(localStorage.getItem('pending_payment') || '{}');
            
            // Update credits using stored values
            const creditResponse = await axios.put(
              `http://localhost:8888/api/v1/onboard/credit/674ac7117faa14533fcedc42/${pendingPayment.credits}`
            );

            if (creditResponse.data) {
              setShowSuccess(true);
              localStorage.setItem('payment_success', 'true');
              console.log('Credit updated:', creditResponse.data);
            } else {
              throw new Error('Failed to update credits');
            }
          } catch (error) {
            console.error('Error updating credit:', error);
            throw error;
          }
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setError(error.message || 'Payment verification failed');

        // Redirect to subscription page after 3 seconds on error
        setTimeout(() => {
          navigate('/subscription');
        }, 3000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Verifying Payment
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Payment Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {error}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to subscription page...
          </p>
        </div>
      </div>
    );
  }

  return <SuccessPayment isOpen={showSuccess} onClose={() => setShowSuccess(false)} />;
};

export default PaymentCallback;
