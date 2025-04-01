'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NotFound() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center w-[50%]">
        <h1 className="text-4xl font-bold text-black mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
        
        {session?.user ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/')}
          >
            Go to Home
          </button>
        )}
      </div>
    </div>
  );
}
