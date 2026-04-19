'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { parseEther } from 'viem'
import { base } from 'wagmi/chains'
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { LottieAnimation } from '@/components/ui/LottieAnimation'
import { ANIMATIONS } from '@/lib/animations'
import { DEV_ADDRESS, DEV_ENS, ETH_USD_FALLBACK } from '@/lib/constants'
import { useProgress } from '@/stores/useProgress'

type Props = {
  open: boolean
  onClose: () => void
}

const PRESETS = [1, 5, 10] as const

function usdToEth(usd: number): string {
  return (usd / ETH_USD_FALLBACK).toFixed(6)
}

function isUserRejection(err: Error | null): boolean {
  if (!err) return false
  const msg = err.message.toLowerCase()
  return (
    msg.includes('rejected') ||
    msg.includes('denied') ||
    msg.includes('user cancel') ||
    msg.includes('user declined')
  )
}

export function TipModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>{open && <TipModalInner onClose={onClose} />}</AnimatePresence>
  )
}

// Inner component — only mounts when open, so state naturally resets on close.
function TipModalInner({ onClose }: { onClose: () => void }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5)
  const [customAmount, setCustomAmount] = useState('')
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const {
    sendTransaction,
    data: hash,
    isPending,
    error,
    reset,
  } = useSendTransaction()
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })
  const recordTip = useProgress((s) => s.recordTip)

  // Award XP + badge on confirmed receipt
  useEffect(() => {
    if (isSuccess && hash) {
      recordTip()
    }
  }, [isSuccess, hash, recordTip])

  const activeUsd =
    selectedAmount !== null
      ? selectedAmount
      : customAmount
        ? parseFloat(customAmount)
        : NaN
  const validUsd = !isNaN(activeUsd) && activeUsd > 0
  const ethAmount = validUsd ? usdToEth(activeUsd) : '0.000000'

  async function handleTip() {
    if (!validUsd) return
    if (chainId !== base.id) {
      try {
        await switchChainAsync({ chainId: base.id })
      } catch {
        return
      }
    }
    sendTransaction({
      to: DEV_ADDRESS,
      value: parseEther(ethAmount),
    })
  }

  const txState: 'idle' | 'pending' | 'success' | 'error' = isSuccess
    ? 'success'
    : isPending || isConfirming
      ? 'pending'
      : error && !isUserRejection(error)
        ? 'error'
        : 'idle'

  const rejected = error && isUserRejection(error)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center"
      onClick={onClose}
    >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-t-3xl bg-[#111] p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <div className="mb-2 flex justify-end">
              <button
                onClick={onClose}
                aria-label="close"
                className="press cursor-pointer rounded-full bg-[var(--surface-2)] p-2 text-[var(--text-3)] transition-colors duration-150 hover:text-[var(--text)]"
              >
                <X size={16} />
              </button>
            </div>

            {txState === 'idle' && (
              <AmountScreen
                selectedAmount={selectedAmount}
                setSelectedAmount={setSelectedAmount}
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                validUsd={validUsd}
                ethAmount={ethAmount}
                onSend={handleTip}
                rejected={!!rejected}
              />
            )}

            {txState === 'pending' && (
              <PendingScreen usd={activeUsd} />
            )}

            {txState === 'success' && hash && (
              <SuccessScreen hash={hash} onClose={onClose} />
            )}

            {txState === 'error' && (
              <ErrorScreen
                message={error?.message ?? 'Something went wrong'}
                onRetry={() => reset()}
                onClose={onClose}
              />
            )}
      </motion.div>
    </motion.div>
  )
}

// ────────────────────────────────────────────────────────────────
// Screens

function AmountScreen({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  validUsd,
  ethAmount,
  onSend,
  rejected,
}: {
  selectedAmount: number | null
  setSelectedAmount: (n: number | null) => void
  customAmount: string
  setCustomAmount: (s: string) => void
  validUsd: boolean
  ethAmount: string
  onSend: () => void
  rejected: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-5xl">☕</div>
      <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">
        tip the dev
      </h2>
      <p className="mt-1 text-sm text-[var(--text-3)]">
        support open-source DeFi education on Base
      </p>

      {/* presets */}
      <div className="mt-6 grid w-full grid-cols-3 gap-3">
        {PRESETS.map((amt) => {
          const active = selectedAmount === amt
          return (
            <button
              key={amt}
              onClick={() => {
                setSelectedAmount(amt)
                setCustomAmount('')
              }}
              className={`press flex cursor-pointer flex-col items-center gap-1 rounded-xl py-4 transition-colors duration-150 ${
                active
                  ? 'bg-base-blue text-white'
                  : 'bg-[var(--surface-2)] text-white/80 hover:bg-white/10'
              }`}
            >
              <span className="text-xl font-bold tracking-[-0.02em]">
                ${amt}
              </span>
              <span
                className={`text-[10px] tabular-nums ${
                  active ? 'text-white/70' : 'text-[var(--text-3)]'
                }`}
              >
                ~{usdToEth(amt)} ETH
              </span>
            </button>
          )
        })}
      </div>

      {/* custom input */}
      <div className="mt-4 w-full">
        <label className="label mb-2 block text-left">or custom amount</label>
        <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-4 py-3">
          <span className="text-sm text-[var(--text-3)]">$</span>
          <input
            type="number"
            inputMode="decimal"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setSelectedAmount(null)
            }}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="flex-1 bg-transparent text-base font-semibold tabular-nums text-white outline-none placeholder:text-[var(--text-4)]"
          />
          <span className="text-xs text-[var(--text-3)]">USD</span>
        </div>
      </div>

      {/* recipient */}
      <div className="mt-5 w-full rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-3)]">sending to</span>
          <span className="font-mono text-sm font-semibold text-white">
            {DEV_ENS}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-[var(--text-3)]">network</span>
          <span className="text-xs font-semibold text-base-blue">
            Base mainnet
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-[var(--text-3)]">amount</span>
          <span className="font-mono text-xs tabular-nums text-white">
            ~{ethAmount} ETH
          </span>
        </div>
      </div>

      {rejected && (
        <p className="mt-3 text-xs text-red">transaction cancelled</p>
      )}

      {/* send CTA */}
      <button
        onClick={onSend}
        disabled={!validUsd}
        className={`press mt-5 w-full cursor-pointer rounded-xl py-4 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-150 ${
          validUsd
            ? 'bg-base-blue text-white hover:brightness-110'
            : 'cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-4)]'
        }`}
      >
        send tip →
      </button>

      {/* reward hint */}
      <p className="mt-3 text-xs text-[var(--text-3)]">
        reward: <span className="font-bold text-yellow">+100 XP</span> ·{' '}
        <span className="font-bold text-base-blue">supporter badge</span> 🎖
      </p>
    </div>
  )
}

function PendingScreen({ usd }: { usd: number }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="h-24 w-24">
        <LottieAnimation
          src={ANIMATIONS.lightning}
          loop
          className="h-full w-full"
          fallback={<div className="animate-soft-pulse text-5xl">⏳</div>}
        />
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-[-0.02em]">
        confirm in your wallet
      </h3>
      <p className="mt-2 text-sm text-[var(--text-3)]">
        <span className="font-bold text-white tabular-nums">
          ${usd.toFixed(2)}
        </span>{' '}
        → <span className="font-mono text-white">{DEV_ENS}</span>
      </p>
      <p className="mt-4 text-xs text-[var(--text-4)]">
        do not close this window
      </p>
    </div>
  )
}

function SuccessScreen({
  hash,
  onClose,
}: {
  hash: string
  onClose: () => void
}) {
  const explorerUrl = `https://basescan.org/tx/${hash}`
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-32 w-32">
        <LottieAnimation
          src={ANIMATIONS.celebration}
          loop={false}
          className="h-full w-full"
          fallback={<div className="animate-celebrate text-6xl">🎉</div>}
        />
      </div>
      <h2 className="animate-celebrate text-3xl font-bold tracking-[-0.03em]">
        tip sent!
      </h2>
      <p className="mt-2 text-sm text-[var(--text-3)]">
        you supported open defi education
      </p>

      <div className="mt-6 flex gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-yellow/10 px-3 py-1">
          <span className="text-sm font-bold text-yellow">+100 XP</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-base-blue/10 px-3 py-1">
          <span className="text-sm font-bold text-base-blue">
            supporter 🎖
          </span>
        </div>
      </div>

      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="press mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] py-3 text-sm font-semibold text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        view on basescan
        <ExternalLink size={14} />
      </a>

      <button
        onClick={onClose}
        className="press mt-3 w-full cursor-pointer rounded-xl bg-base-blue py-4 text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors duration-150 hover:brightness-110"
      >
        done
      </button>
    </div>
  )
}

function ErrorScreen({
  message,
  onRetry,
  onClose,
}: {
  message: string
  onRetry: () => void
  onClose: () => void
}) {
  const shortMessage = message.slice(0, 120)
  const isInsufficient = /insufficient|not enough/i.test(message)

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="text-5xl">😕</div>
      <h3 className="mt-3 text-xl font-bold tracking-[-0.02em]">
        something went wrong
      </h3>
      <p className="mt-2 text-sm text-[var(--text-3)]">
        {isInsufficient
          ? 'insufficient ETH balance on Base'
          : shortMessage}
      </p>
      <div className="mt-6 flex w-full gap-2">
        <button
          onClick={onClose}
          className="press flex-1 cursor-pointer rounded-xl bg-[var(--surface-2)] py-3 text-sm font-semibold text-white/80 transition-colors duration-150 hover:bg-white/10"
        >
          close
        </button>
        <button
          onClick={onRetry}
          className="press flex-1 cursor-pointer rounded-xl bg-base-blue py-3 text-sm font-semibold text-white transition-colors duration-150 hover:brightness-110"
        >
          retry
        </button>
      </div>
    </div>
  )
}
