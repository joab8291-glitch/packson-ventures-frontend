import axios from 'axios';
import { API_URL } from '@/config/constants';
import { AirtimeFormData } from '@/utils/validation';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TransactionResponse {
  success: boolean;
  checkoutRequestId?: string;
  message: string;
  transactionId?: string;
}

export interface TransactionStatus {
  status: 'pending' | 'completed' | 'failed';
  message: string;
  amount?: number;
  receipt?: string;
}

export const purchaseAirtime = async (data: AirtimeFormData): Promise<TransactionResponse> => {
  try {
    const response = await api.post('/mpesa/stk-push', {
      phoneNumber: data.senderNumber,
      amount: data.amount,
      operator: data.operator,
      recipientNumber: data.recipientNumber,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to initiate payment. Please try again.',
    };
  }
};

export const checkTransactionStatus = async (checkoutRequestId: string): Promise<TransactionStatus> => {
  try {
    const response = await api.get(`/mpesa/status/${checkoutRequestId}`);
    return response.data;
  } catch (error: any) {
    return {
      status: 'failed',
      message: error.response?.data?.message || 'Failed to check transaction status.',
    };
  }
};

export const getOperators = async () => {
  try {
    const response = await api.get('/operators');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch operators:', error);
    return [];
  }
};
