'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Fallback connect button for non-Base-App contexts.
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
        <span className="font-mono text-sm text-[var(--text-2)]">
          {truncateAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="press cursor-pointer text-sm font-medium text-[var(--text-3)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="press cursor-pointer rounded-xl bg-base-blue px-4 py-2 text-sm font-semibold tracking-[-0.01em] text-white transition-colors duration-150 hover:brightness-110"
    >
      connect
    </button>
  )
}
