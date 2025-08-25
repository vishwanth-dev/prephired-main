'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center max-w-md mx-auto px-4'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Something went wrong!</h2>
        <p className='text-gray-600 mb-6'>We apologize for the inconvenience. Please try again.</p>
        <button
          onClick={reset}
          className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors'
        >
          Try again
        </button>
      </div>
    </div>
  );
}
