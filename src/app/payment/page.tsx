'use client';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '@/components/payment-form';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const amount = searchParams.get('amount');
  const title = searchParams.get('title');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount || '0') * 100, // Convert to cents
        courseId,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, courseId]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0f172a',
      colorBackground: '#ffffff',
      colorText: '#0f172a',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-2xl font-bold text-primary">${amount}</p>
          </div>

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance,
              }}>
              <PaymentForm courseId={courseId || ''} />
            </Elements>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Your payment is secure and encrypted</p>
            <p className="mt-2">We accept Visa, Mastercard, and American Express</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
