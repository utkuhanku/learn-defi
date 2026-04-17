'use client'

import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { useAccount } from 'wagmi'
import { User } from 'lucide-react'

export function UserChip() {
  const { context } = useMiniKit()
  const { isConnected } = useAccount()

  const user = context?.user as
    | { displayName?: string; username?: string; pfpUrl?: string }
    | undefined

  const displayName = user?.displayName ?? user?.username ?? null
  const pfpUrl = user?.pfpUrl ?? null

  if (!displayName && !isConnected) {
    return (
      <span className="text-sm font-medium text-[var(--text-muted)]">
        guest
      </span>
    )
  }

  const initial = displayName?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex items-center gap-2">
      {pfpUrl ? (
        <img
          src={pfpUrl}
          alt=""
          className="h-7 w-7 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-15 dark:bg-gray-80">
          {displayName ? (
            <span className="text-xs font-semibold text-gray-60">
              {initial}
            </span>
          ) : (
            <User size={14} strokeWidth={1.5} className="text-gray-50" />
          )}
        </div>
      )}
      {displayName && (
        <span className="text-sm font-medium">{displayName}</span>
      )}
    </div>
  )
}
