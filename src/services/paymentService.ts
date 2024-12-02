import axios from 'axios';

// Replace with your actual Chapa secret key
const CHAPA_SECRET_KEY = 'CHASECK_TEST-QJNjBQLqB1A9ypz7FxYdJ7EIhIgjhLgr';
const CHAPA_API_URL = 'https://api.chapa.co/v1';

interface PaymentInitializationData {
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization: {
    title: string;
    description: string;
  };
}

export async function initializePayment(data: PaymentInitializationData) {
  try {
    const response = await axios.post(
      `${CHAPA_API_URL}/transaction/initialize`,
      {
        amount: data.amount,
        currency: 'ETB',
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        tx_ref: data.tx_ref,
        callback_url: data.callback_url,
        return_url: data.return_url,
        customization: data.customization
      },
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Chapa payment initialization failed:', error);
    throw error;
  }
}

export async function verifyPayment(txRef: string) {
  try {
    const response = await axios.get(
      `${CHAPA_API_URL}/transaction/verify/${txRef}`,
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Chapa payment verification failed:', error);
    throw error;
  }
}
