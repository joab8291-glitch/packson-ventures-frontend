import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { airtimeSchema, AirtimeFormData, formatPhoneNumber } from '@/utils/validation';
import { purchaseAirtime, checkTransactionStatus } from '@/services/api';
import { useStore } from '@/stores/useStore';
import toast from 'react-hot-toast';

export const useAirtimePurchase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setProcessing, setTransaction, setCheckoutRequestId, reset } = useStore();

  const form = useForm<AirtimeFormData>({
    resolver: zodResolver(airtimeSchema),
    defaultValues: {
      operator: 'Safaricom',
      senderNumber: '',
      recipientNumber: '',
      amount: undefined,
    },
  });

  const onSubmit = async (data: AirtimeFormData) => {
    setIsSubmitting(true);
    setProcessing(true);
    reset();

    const loadingToast = toast.loading('Initiating M-PESA payment...');

    try {
      const payload = {
        ...data,
        senderNumber: formatPhoneNumber(data.senderNumber),
        recipientNumber: formatPhoneNumber(data.recipientNumber),
      };

      const response = await purchaseAirtime(payload);

      if (response.success && response.checkoutRequestId) {
        setCheckoutRequestId(response.checkoutRequestId);
        toast.success('STK Push sent! Check your phone for the M-PESA prompt.', {
          id: loadingToast,
        });
        pollTransactionStatus(response.checkoutRequestId);
      } else {
        toast.error(response.message || 'Payment initiation failed.', {
          id: loadingToast,
        });
        setProcessing(false);
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.', {
        id: loadingToast,
      });
      setProcessing(false);
      setIsSubmitting(false);
    }
  };

  const pollTransactionStatus = async (checkoutRequestId: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    const poll = async () => {
      attempts++;
      const status = await checkTransactionStatus(checkoutRequestId);

      if (status.status === 'completed') {
        setTransaction(status);
        setProcessing(false);
        setIsSubmitting(false);
        toast.success('✅ Payment successful! Airtime has been delivered.', {
          duration: 5000,
        });
        form.reset();
        return;
      }

      if (status.status === 'failed') {
        setTransaction(status);
        setProcessing(false);
        setIsSubmitting(false);
        toast.error('❌ Payment failed. Please try again.', {
          duration: 5000,
        });
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(poll, 3000);
      } else {
        setTransaction({
          status: 'failed',
          message: 'Transaction timed out. Please check your M-PESA statement.',
        });
        setProcessing(false);
        setIsSubmitting(false);
        toast.error('⏰ Transaction timed out. Please check your M-PESA statement.', {
          duration: 5000,
        });
      }
    };

    poll();
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
