'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { RegisterResponseBodyPost } from '../api/(auth)/signup/route';

export default function AppForm() {
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [errors, setErrors] = React.useState<{ message: string }[]>([]);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !fullName) {
      setErrors([{ message: 'Please fill in all the fields' }]);
      return;
    }

    setErrors([]);
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, fullName }),
    });

    const apiResponse: RegisterResponseBodyPost = await response.json();

    if ('user' in apiResponse) {
      router.refresh();
    } else {
      setErrors(apiResponse.errors);
    }
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
      <div className="grid md:grid-cols-2 min-h-screen w-full">
        <div className="bg-gray-900 flex items-center justify-center px-4 py-12 md:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="text-center text-3xl font-bold text-white">
                Welcome back!
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Sign in to your account to continue
              </p>
            </div>
            <div className="w-full">
              <div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      className="text-sm font-medium text-gray-400"
                      htmlFor="name"
                    >
                      Full name
                    </label>
                    <input
                      className="mt-1 px-2 py-3 block w-full rounded-md bg-gray-800 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                      id="name"
                      placeholder="John Doe"
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium text-gray-400"
                      htmlFor="email"
                    >
                      Email address
                    </label>
                    <input
                      className="mt-1 px-2 py-3 block w-full rounded-md bg-gray-800 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div>
                    <button className="w-full">Register</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-950">
          <Image
            alt="Login background"
            className="h-full w-full object-cover"
            height="200"
            src="/signup.avif"
            style={{
              aspectRatio: '800/800',
              objectFit: 'cover',
            }}
            width="200"
            priority
          />
        </div>
        <div className="w-full flex justify-end">
          <small className="text-gray-400">
            <a href="https://www.freepik.com/free-vector/colourful-abstract-shapes_40674957.htm#&position=29&from_view=category&uuid=9f4237de-d934-444c-93b2-7ad36f52ceee">
              Image by juicy_fish
            </a>{' '}
            on Freepik
          </small>
        </div>
      </div>
    </>
  );
}
