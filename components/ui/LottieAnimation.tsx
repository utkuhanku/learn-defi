'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import type { DotLottie } from '@lottiefiles/dotlottie-web'

const DotLottieReact = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  { ssr: false },
)

type Props = {
  src: string
  loop?: boolean
  autoplay?: boolean
  className?: string
  style?: React.CSSProperties
  /** Rendered if the Lottie asset fails to load (404, network error, etc). */
  fallback?: React.ReactNode
}

export function LottieAnimation({
  src,
  loop = false,
  autoplay = true,
  className = '',
  style,
  fallback = null,
}: Props) {
  const [failed, setFailed] = useState(false)

  const refCallback = useCallback((instance: DotLottie | null) => {
    if (!instance) return
    instance.addEventListener('loadError', () => setFailed(true))
  }, [])

  if (failed) {
    return <>{fallback}</>
  }

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
      dotLottieRefCallback={refCallback}
    />
  )
}
