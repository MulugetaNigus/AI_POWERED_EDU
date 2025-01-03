import axios from 'axios';

// Replace with your actual Chapa secret key
const CHAPA_API_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = import.meta.env.VITE_CHAPA_SECRET_KEY;

interface PaymentInitializationData {
  amount: number;
  currency?: string,
  email: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
}

export async function initializePayment(data: PaymentInitializationData) {
  try {
    const response = await axios.post(
      `${CHAPA_API_URL}/transaction/initialize`,
      {
        amount: data.amount,
        currency: 'ETB',
        email: data.email,
        tx_ref: data.tx_ref,
        callback_url: data.callback_url,
        return_url: data.return_url,
      },
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
        },
        withCredentials: true
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
        },
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    console.error('Chapa payment verification failed:', error);
    throw error;
  }
}
