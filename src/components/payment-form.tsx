'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaymentFormProps {
  courseId: string;
}

export function PaymentForm({ courseId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?courseId=${courseId}`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <Button type="submit" className="w-full" size="lg" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}
