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
        <span className="font-mono text-sm text-[var(--text-secondary)]">
          {truncateAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="press min-h-11 cursor-pointer text-sm font-medium text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)]"
        >
          disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="press min-h-11 cursor-pointer rounded-sm bg-base-blue px-5 py-2.5 text-sm font-medium tracking-[-0.01em] text-white shadow-[0_0_16px_rgba(0,0,255,0.25)] transition-all duration-150 hover:brightness-[1.08] hover:shadow-[0_0_24px_rgba(0,0,255,0.35)]"
    >
      connect
    </button>
  )
}
