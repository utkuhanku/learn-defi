'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app-error]', error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-[var(--bg)] px-6 text-center">
      <AlertCircle size={40} className="text-red" strokeWidth={1.5} />
      <div>
        <h2 className="text-xl font-bold tracking-[-0.02em]">
          something went wrong
        </h2>
        <p className="mt-2 text-sm text-[var(--text-3)]">
          we hit an unexpected error. try again?
        </p>
      </div>
      <button
        onClick={reset}
        className="press cursor-pointer rounded-xl bg-base-blue px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:brightness-110"
      >
        try again
      </button>
    </div>
  )
}
