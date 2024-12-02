import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { verifyPayment } from '../services/paymentService';
import { updateSubscription, updatePaymentStatus } from '../services/mongoService';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        const txRef = searchParams.get('tx_ref');
        const user = auth.currentUser;

        if (!txRef || !user) {
          setStatus('error');
          setMessage('Invalid transaction reference or user not authenticated');
          return;
        }

        // Verify payment with Chapa
        const verificationResult = await verifyPayment(txRef);

        if (verificationResult.status === 'success') {
          // Extract plan details from tx_ref (e.g., sub_userId_timestamp_planId)
          const planId = txRef.split('_')[3];
          
          // Update payment status in MongoDB
          await updatePaymentStatus(txRef, 'success');
          
          // Update user subscription in MongoDB
          await updateSubscription(
            user.uid,
            planId as 'basic' | 'premium',
            1 // 1 month subscription
          );

          setStatus('success');
          setMessage('Payment successful! Your subscription has been activated.');

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment.');
      }
    };

    verifyTransaction();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Verifying Payment
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Please wait while we verify your payment...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Payment Successful
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Payment Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {message}
              </p>
              <button
                onClick={() => navigate('/subscription')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
