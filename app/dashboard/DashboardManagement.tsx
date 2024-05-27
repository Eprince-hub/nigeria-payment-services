'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '../components/Input';

export default function DashboardManagement({
  accountNumber,
}: {
  accountNumber: string;
}) {
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const router = useRouter();

  async function handleTopUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Number(amount) <= 0) {
      setErrors([{ message: 'Please enter a valid amount' }]);
      setSuccessMessage('');
      setAmount('');
      setPaymentAmount('');
      return;
    }

    const response = await fetch('/api/top-up', {
      method: 'POST',
      body: JSON.stringify({ amount, accountNumber }),
    });

    if (response.ok) {
      setSuccessMessage('Top-up successful');
      setErrors([]);
      setAmount('');
      setPaymentAmount('');
      router.refresh();
      return;
    }
    const data = await response.json();
    setErrors(data.errors);
    setSuccessMessage('');
    setAmount('');
    setPaymentAmount('');
  }

  async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Number(paymentAmount) <= 0) {
      setErrors([{ message: 'Please enter a valid amount' }]);
      setSuccessMessage('');
      setAmount('');
      setPaymentAmount('');
      return;
    }

    const response = await fetch('/api/service-payment', {
      method: 'POST',
      body: JSON.stringify({
        amount: paymentAmount,
        accountNumber,
        service: 'MTN topup',
      }),
    });

    if (response.ok) {
      setSuccessMessage('Service Purchase successful');
      setErrors([]);
      setAmount('');
      setPaymentAmount('');
      router.refresh();
      return;
    }
    const data = await response.json();
    setErrors(data.errors);
    setSuccessMessage('');
    setAmount('');
    setPaymentAmount('');
  }

  return (
    <>
      {errors.length > 0 && (
        <div className="w-full">
          <ul>
            {errors.map((error) => (
              <li key={`error-${error.message}`} className="text-red-500">
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {successMessage !== '' && (
        <div className="w-full">
          <p className="text-green-500">{successMessage}</p>
        </div>
      )}
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Increase Balance
              </h3>
              <form onSubmit={handleTopUp} className="mt-2 text-gray-700">
                <Input
                  handleOnChange={(event) =>
                    // convert to kobo and add decimal
                    setAmount(event.target.value)
                  }
                  label="Amount"
                  purpose="name"
                  type="number"
                  placeholder='e.g. "5000"'
                />
                <button className="mt-4 w-full bg-indigo-500 text-white py-3 rounded-md">
                  Top-up
                </button>
              </form>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pay for Services
              </h3>
              <form onSubmit={handlePayment} className="mt-2 text-gray-700">
                <Input
                  handleOnChange={(event) =>
                    setPaymentAmount(event.target.value)
                  }
                  label="Amount"
                  purpose="name"
                  type="number"
                  placeholder='e.g. "5000"'
                />
                <button className="mt-4 w-full bg-indigo-500 text-white py-3 rounded-md">
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
