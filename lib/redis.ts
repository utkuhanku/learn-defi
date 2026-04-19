import { Redis } from '@upstash/redis'

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  // Warn rather than throw so Next.js build analysis doesn't crash;
  // actual Redis calls will fail at request time if creds are missing.
  console.warn(
    '[redis] missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN — Redis calls will fail',
  )
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
})

// Key helpers — consistent naming
export const keys = {
  user: (fid: number) => `user:${fid}`,
  allUsers: 'users:all',
  rateLimit: (fid: number, bucket: string) =>
    `ratelimit:${fid}:${bucket}`,
  globalRateLimit: (bucket: string) => `ratelimit:global:${bucket}`,
} as const

// Stored per user
export type UserRecord = {
  fid: number
  notificationUrl: string
  notificationToken: string
  addedAt: number
  lastActive?: number
  streak?: number
  lastStreakCheck?: number
}
