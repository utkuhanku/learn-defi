'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Fallback connect button for non-Base-App contexts.
 * Inside Base App, MiniKit handles auth — this button
 * only shows when context.user is unavailable.
 */
export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  function handleConnect() {
    const cb = connectors.find((c) => c.id === 'coinbaseWalletSDK')
    const fallback = connectors.find((c) => c.id === 'injected')
    const connector = cb ?? fallback ?? connectors[0]
    if (connector) connect({ connector })
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-gray-60 dark:text-gray-30">
          {truncateAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="min-h-11 cursor-pointer text-sm font-medium text-gray-50 transition-colors duration-120 hover:text-gray-100 dark:hover:text-gray-0"
        >
          disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="min-h-11 cursor-pointer rounded-sm bg-base-blue px-5 py-3 text-base font-medium text-white transition-all duration-120 hover:brightness-[1.04] active:scale-[0.98]"
    >
      connect wallet
    </button>
  )
}
