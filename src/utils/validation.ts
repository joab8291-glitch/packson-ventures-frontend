import { z } from 'zod';

const phoneRegex = /^(254|0)?(7|1)\d{8}$/;

export const airtimeSchema = z.object({
  operator: z.string().min(1, 'Please select a network operator'),
  senderNumber: z.string()
    .regex(phoneRegex, 'Enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)'),
  recipientNumber: z.string()
    .regex(phoneRegex, 'Enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)'),
  amount: z.number()
    .min(20, 'Minimum amount is KES 20')
    .max(10000, 'Maximum amount is KES 10,000')
    .positive('Amount must be positive'),
});

export type AirtimeFormData = z.infer<typeof airtimeSchema>;

export const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
};

export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString()}`;
};
