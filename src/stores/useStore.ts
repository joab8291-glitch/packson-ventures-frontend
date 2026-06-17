import { create } from 'zustand';
import { TransactionStatus } from '@/services/api';

interface TransactionState {
  isProcessing: boolean;
  transaction: TransactionStatus | null;
  checkoutRequestId: string | null;
  setProcessing: (processing: boolean) => void;
  setTransaction: (transaction: TransactionStatus | null) => void;
  setCheckoutRequestId: (id: string | null) => void;
  reset: () => void;
}

export const useStore = create<TransactionState>((set) => ({
  isProcessing: false,
  transaction: null,
  checkoutRequestId: null,
  setProcessing: (processing) => set({ isProcessing: processing }),
  setTransaction: (transaction) => set({ transaction }),
  setCheckoutRequestId: (id) => set({ checkoutRequestId: id }),
  reset: () => set({ isProcessing: false, transaction: null, checkoutRequestId: null }),
}));
